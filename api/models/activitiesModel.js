const { DataTypes} = require('sequelize')
const config = require('../../config')

const Activity = config.sequelize.define('activities', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_activity:{
        type: DataTypes.STRING,
        allowNull:false
        }, 
    description_activity:{
        type: DataTypes.STRING,
    },
    nbr_participants: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activity_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    activity_time: {
        type: DataTypes.TIME,
    },
    activity_address: {
        type: DataTypes.STRING,
        allowNull:false
    },
    creatorId:{
        type: DataTypes.INTEGER,
        allowNull:false
        }
});


module.exports = Activity;


