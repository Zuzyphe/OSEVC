const { DataTypes } = require('sequelize')
const config = require('../../config')
const User = require('./eventMembersModel')

const Event = config.sequelize.define('eventEVC', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    event_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    event_time: {
        type: DataTypes.TIME,
    },
    nbr_participants: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:User,
            key: 'id'
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

module.exports = Event


