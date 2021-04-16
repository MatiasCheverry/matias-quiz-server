const { DataTypes } = require("sequelize");
// Modelo de product (Matias)
module.exports = (sequelize) => {
    sequelize.define(
        "question", {
            id_question: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },

    );
};