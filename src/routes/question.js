const server = require("express").Router();
const { Question, User } = require("../db.js");

// 1: Get User by name
server.get("/:nickname", async (req, res) => {
    try {
        const { nickname } = req.params;
        const userNickname = await User.findOrCreate({
            where: { nickname },
        });

        console.log(userNickname);
        res.json(userNickname);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = server;
