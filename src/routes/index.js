const { Router } = require("express");
// import all routers;
const questionRouter = require("./question.js");

const router = Router();

/// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);

router.use("/users", questionRouter);

module.exports = router;
