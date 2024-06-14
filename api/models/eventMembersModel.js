const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const config = require('../../config')


const User = config.sequelize.define('eventMembers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    member_firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    member_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    member_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isOrganiser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isParticipant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confidentiality: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: (User) => {
            {
                User.password = User.password && User.password != "" ? bcrypt.hashSync(User.password, 10) : ""
            }
        },
        beforeUpdate: (User) => {

            User.password = User.password && User.password != "" ? bcrypt.hashSync(User.password, 10) : ""

        }
    }
})

module.exports = User