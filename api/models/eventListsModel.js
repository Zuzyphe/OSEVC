const { DataTypes } = require('sequelize')
const config = require('../../config')

const EventLists = config.sequelize.define('eventLists', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    list_name: {
        type: DataTypes.STRING,
        allowNull: false
    }    ,
    list_bullepoint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    list_member: {
        type: DataTypes.STRING,
        allowNull: true
    }
})


module.exports = EventLists