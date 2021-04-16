const arrayOfQuestions = require("./models/Question.js");
const { conn, Question, Answer, User } = require("./db.js");

conn.sync({ force: true })
    .then(async () => {
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
        };
        await seeder();
    })
    .then(console.log("db populated"))
    .catch((e) => console.log(e));
