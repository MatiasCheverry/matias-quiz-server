const { Question, Answer, User, Current, conn } = require("../db.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function getQuestions() {
    let start = getRandomInt(1, 15);
    let end = start + 4;
    // console.log(start + " ------- " + end);
    try {
        const search = await Question.findAll({
            where: {
                id_question: {
                    [Op.between]: [start, end],
                },
            },
            include: [{ model: Answer }],
        });

        // ----------------------------------------

        if (search && search.length > 0) {
            let quizToSend = await Promise.all(
                search.map(async (m) => {
                    var quizItem = {
                        text: m.text,
                        answers: [],
                    };
                    m.answers.forEach((a) => quizItem.answers.push(a.text));
                    return quizItem;
                })
            );

            return quizToSend;
        }

        // ----------------------------------------
    } catch (e) {
        console.log(e);
    }
}

async function getOrCreateUser(nickname) {
    console.log(nickname);
    try {
        const userNickname = await User.findOrCreate({
            where: { nickname },
        });
        const userCurrentGame = await Current.findOrCreate({
            where: { nickname },
        });
        return userNickname;
    } catch (e) {
        console.log(e);
        return e;
    }
}
async function handleAnswer(answerObject) {
    try {
        checkQuestion = await Question.findOne({
            include: {
                model: Answer,
                where: {
                    text: answerObject.answer,
                    val: true,
                },
            },
        });
        if (checkQuestion) {
            const userScore = await User.findByPk(
                parseInt(answerObject.userId)
            );
            var newPoints = userScore.points + 1;
            userScore.points = newPoints;
            userScore.save();
            userScore.reload();
            var userCurrentScore = await Current.findOne({
                where: { nickname: userScore.nickname },
            });
            console.log("userscore nickname");
            console.log(userScore.nickname);
            if (userCurrentScore === null) {
                console.log("creating User");
                userCurrentScore = await Current.create({
                    nickname: userScore.nickname,
                    points: 1,
                });
            } else {
                var oldScore = userCurrentScore.points;
                userCurrentScore.points = oldScore + 1;
                userCurrentScore.save();
                userCurrentScore.reload();
            }

            console.log(userCurrentScore);
        }
    } catch (e) {
        console.log(e);
    }
}
async function getScore() {
    try {
        currentGame = await Current.findAll({
            order: [["points", "DESC"]],
        });
        await Current.destroy({
            where: {},
            truncate: true,
        });
        console.log(currentGame);
        return currentGame;
    } catch (e) {
        console.log(e);
    }
}

module.exports.getQuestions = getQuestions;
module.exports.getOrCreateUser = getOrCreateUser;
module.exports.handleAnswer = handleAnswer;
module.exports.getScore = getScore;
