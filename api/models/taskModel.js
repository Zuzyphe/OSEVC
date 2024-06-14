const { DataTypes} = require('sequelize')
const config = require('../../config')


const Task = config.sequelize.define('tasks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    task_desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nbr_participant: {
        type: DataTypes.INTEGER
    },
    urgent_task: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

module.exports = Task