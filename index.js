const app = require("./src/app.js");
const { conn, Question, Answer, User } = require("./src/db.js");
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3001;
// server-side
const io = require("socket.io")(server, {
    cors: {
        origin: "https://matias - quiz - app.herokuapp.com",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
const arrayOfQuestions = require("./src/Seeders/questions.js");
const Sequelize = require("sequelize");
const {
    getQuestions,
    getOrCreateUser,
    handleAnswer,
    getScore,
} = require("./src/Functions/Quiz.js");
var globalStartTime = undefined;
var nextQuestion = undefined;
async function startTimer(startTime) {
    globalStartTime = startTime;
    io.emit("newDeadline", globalStartTime);
    nextQuestion = await getQuestions();
    io.emit("newQuiz", nextQuestion);
    var start = globalStartTime,
        diff,
        minutes,
        seconds;
    var duration = 60;

    async function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = diff % 60 | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        io.emit("newDeadline", minutes + ":" + seconds);
        console.log(minutes + ":" + seconds);
        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
            console.log("finished");
            nextQuestion = await getQuestions();
            // console.log(nextQuestion);
            var score = await getScore();
            io.emit("sendscore", score);
            console.log(score);
            io.emit("newQuiz", nextQuestion);
        }
    }
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("getData", async (msg, callback) => {
        console.log(msg);
        callback({ nextQuestion });
    });

    socket.on("log", async (msg, callback) => {
        var userNickName = await getOrCreateUser(msg);
        callback({
            user: userNickName[0].dataValues,
        });
    });
    socket.on("answer", (answerObject) => {
        handleAnswer(answerObject);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// Syncing all the models at once.
conn.sync({ force: true })
    .then(async () => {
        app.get("/", (req, res) => {
            res.sendFile(__dirname + "/index.html");
        });
        app.get("/quiz", (req, res) => {
            res.sendFile(__dirname + "/quiz.html");
        });
        server.listen(port, () => {
            console.log("%s listening at " + port); // eslint-disable-line no-console
        });
        const seeder = async function () {
            arrayOfQuestions.map(async (question) => {
                try {
                    const newQuestion = await Question.create({
                        text: question.text,
                    });
                    const correctAnswer = await Answer.create({
                        text: question.trueAnswer,
                        val: true,
                    });
                    await newQuestion.addAnswer(correctAnswer);
                    question.answers.forEach(async (a) => {
                        try {
                            const incorrectAnswer = await Answer.create({
                                text: a,
                                val: false,
                            });
                            await newQuestion.addAnswer(incorrectAnswer);
                        } catch (e) {
                            console.log(e);
                        }
                    });
                    newQuestion.save();
                } catch (e) {
                    console.log(e);
                }
            });
            console.log("db populated");
        };
        await seeder();
    })
    .then(startTimer(Date.now()));
module.exports.io = io;
