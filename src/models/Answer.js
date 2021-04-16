const { DataTypes } = require("sequelize");
// Modelo de product (Matias)
module.exports = (sequelize) => {
    sequelize.define(
        "answer", {
            id_answer: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            val: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },

    );
};