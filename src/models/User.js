const { DataTypes } = require("sequelize");
// Modelo de product (Matias)
module.exports = (sequelize) => {
    sequelize.define("user", {
        id_user: {
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
        },
    });
};
