const { DataTypes } = require("sequelize");
// Modelo de product (Matias)
module.exports = (sequelize) => {
    sequelize.define("current", {
        id_current: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
    });
};
