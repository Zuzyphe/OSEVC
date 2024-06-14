
const { DataTypes } = require('sequelize')
const config = require('../../config')


const PersonalNotes = config.sequelize.define('personalNotes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text_pers_notes: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


module.exports = PersonalNotes