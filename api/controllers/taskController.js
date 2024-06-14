const {Op, Model} = require('sequelize')
const Task = require('../models/taskModel')
const Activity = require('../models/activitiesModel')
const {validationResult} = require('express-validator')
const { Request, Response } = require('express');

module.exports = {
    list: async (req,res) => {
        const tasks = await Task.findAll({
            include: [{ model: Activity}],
            raw: true
          })
        console.log(tasks);
        res.render('task_list', {tasks})
    }, 
    createTask: async (req, res) => { // <---- function that shows a new task created---->
        const navTaskCreate = true
        res.render('task_create', { navTaskCreate})
    },
    postTask: async (req, res) => { // <---- function that creates a new task---->
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('task_create', { errors: errors.array() });
            }
            const task = await Task.findOne({
                where: {
                    task_name: req.body.taskName.trim(),
                    task_desc: req.body.taskDescription.trim(),
                    nbr_participant: req.body.playerNumber,
                    urgent_task: req.body.UrgentTask
                }
            }, {
                where: {
                    id: req.params.id
                },
                returning: true
            });

            console.log("Correspondance trouvé :", task); // log affichage de la correspondance

            if (task !== null) {
                const error = "Cette tâche existe déjà";
                return res.render('task_create', { error: error });
            } else {
                const taskcreated = await Task.create({
                    task_name: req.body.taskName.trim(),
                    task_desc: req.body.taskDescription.trim(),
                    nbr_participant: req.body.playerNumber
                });
                console.log("Tâche créée :", taskcreated); // log confirmation de la création d'un jeu
                return res.redirect('/task/list');
            }
        } catch (error) {
            console.error("Erreur lors de la création de la tâche :", error);
            return res.status(500).send("Une erreur est survenue lors de la création de la tâche.");
        }

    },
    read: async (req, res) => { //<---- fonction pour voir le jeu via l'ID ---->
        const navTask = true;
        try {
            
            console.log("ID de la tâche à rechercher :", req.params.id); // log pour afficher l'ID

            let task = await Task.findByPk(req.params.id);
            if (!task) {
                return res.status(404).send("La tâche n'a pas été trouvée.");
            }
            task = task.toJSON();
            
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.render('task_read', { task, navTask, errors: result.errors });
            } else {
                return res.render('task_read', { task, navTask});
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la lecture du jeu :", error);
            return res.status(500).send("Une erreur est survenue lors de la lecture du jeu.");
        }
    },

    getTaskDetail: async (req,res) => {
        const task = await Task.findByPk(req.params.id, {raw: true})
        res.render('task_page', {task})
    },


    getTaskUpdate: async (req, res) => { // <---- function to get the task to modify ---->
        const task = await Task.findByPk(req.params.id, { raw: true })
        res.render('task_update', { task })
    },

    postTaskUpdate: async (req, res) => { // <---- function that modifies the task ---->
        try {
            const [updatedRowsCount, updatedRows] = await Task.update({
                    task_name: req.body.taskName,
                    task_desc: req.body.taskDescription,
                    nbr_participant: req.body.playerNumber
            }, {
                where: {
                    id: req.params.id
                },
                returning: true
            });

            if (updatedRowsCount === 0) {
                return res.status(404).send("La tâche à modifier n'a pas été trouvée.");
            }

            const updatedTask = updatedRows[0];
            res.redirect('/task/list');
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour de la tâche:", error);
            return res.status(500).send("Une erreur est survenue lors de la mise à jour de la tâche.");
        }
    },

    taskDelete: async (req, res) => { // <---- function to suppress a task ---->
        await Task.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect('/task/list')
    }
}