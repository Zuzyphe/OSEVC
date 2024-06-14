const { DataTypes } = require('sequelize')
const config = require('../../config')

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
    name_organiser: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

module.exports = Event


