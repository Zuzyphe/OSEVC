const { Op } = require('sequelize')

const Activity = require('../models/activitiesModel')
const Task = require('../models/taskModel')
const User = require('../models/eventMembersModel')
const { validationResult } = require('express-validator');
const { Request, Response } = require('express');


module.exports = {
    list: async (req, res) => { //  <---- fonction affichage de tous les events ---->
        const activities = await Activity.findAll(
            {
                include:
                    [{
                        model: Task,
                        raw: true
                    }
                    ], 
                    raw : true
            },
        )
        const navActivities = true
        console.log(activities)
        res.render('activities_list', { activities, navActivities })
    },

    createActivities: async (req, res) => { // <---- fonction affichage de la page activités ---->
        const navEventCreate = true
        const tasks = await Task.findAll({raw:true})
        res.render('activities_create', { navEventCreate, tasks })
    },

    postActivities: async (req, res) => { // <---- fonction de création d'event ---->
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('activities_create', { errors: errors.array() });
            }
            const activity = await Activity.findOne({
                where: {
                    name: req.body.activitiesName.trim(),
                    event_time: req.body.activitiesTime,
                    event_date: req.body.activitiesDate,
                    event_address: req.body.address,
                    imageUrl: req.body.imgTask
                }
            });

            console.log("Correspondance trouvé :", activity); // log affichage de la correspondance

            if (activity !== null) {
                const error = "Cet événement existe déjà";
                return res.render('activities_create', { error: error });
            } else {
                // console.log(req.body.activitiesDate)
                const eventcreated = await Activity.create({
                    name_activity: req.body.activitiesName.trim(),
                    description_activity: req.body.activitiesDescription.trim(),
                    event_date: req.body.activitiesDate,
                    event_time: req.body.activitiesTime,
                    nbr_participants: req.body.playersNumber,
                    activity_address: req.body.address,
                    name_organiser: req.body.NameOrganiser.trim(),
                    taskId: req.body.taskID,
                    imageUrl: req.body.imgtask
                });
                console.log("Activité créée :", eventcreated); // log confirmation de la création d'un évenement 
                return res.redirect('/activities/list');
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'activité :", error);
            return res.status(500).send("Une erreur est survenue lors de la création de l'événement.");
        }

    },
    read: async (req, res) => { //<---- fonction pour lire l'event via l'ID ---->
        const navEvent = true;
        // try {

        console.log("ID de l'activité à rechercher :", req.params.id); // log pour afficher l'ID

        let activity = await Activity.findByPk(req.params.id, {
            include: {
                model: Task
            },
        });
        if (!activity) {
            return res.status(404).send("L'événement n'a pas été trouvé.");
        } else {
            activity = activity.toJSON();
            // Appel à la fonction getAvailablePlaces pour obtenir le nombre de places restantes
            const availablePlaces = await module.exports.getAvailablePlaces(req, res);
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.render('eactivities_read', { activity, navEvent, errors: result.errors });
            } else {
                console.log(activity)
                res.render('activities_read', { activity, navEvent, availablePlaces });
            }
        }
        // } catch (error) {
        //     console.error("Une erreur s'est produite lors de la lecture de l'événement :", error);
        //     return res.status(500).send("Une erreur est survenue lors de la lecture de l'événement.");
        // }
    },
    getAvailablePlaces: async (req, res) => { // <------- fonction pour récupèrer le nombre de place disponibles ------>
        try {
            const activityId = req.params.id;
            const activity = await Activity.findByPk(activityId);

            if (!activity) {
                return res.status(404).send("L'activité n'a pas été trouvée.");
            } else {
                const participantsCount = await ActivityUser.count({
                    where: {
                        activityId: activityId
                    }
                });
                const remainingPlaces = activity.players_number - participantsCount;
                // Si le nombre de places restantes est égal ou inférieur à zéro
                if (remainingPlaces <= 0) {
                    return res.status(403).json({ message: "Désolé, il n'y a plus de places disponibles." });
                } else {
                    return remainingPlaces;
                }
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du nombre de places restantes :", error);
            return res.status(500).json({ error: "Erreur lors de la récupération du nombre de places restantes." });
        }
    },
    registerUserToActivities: async (req, res) => { // <----- Fonction pour inscrire l'utilisateur à l'événement ---->
        try {
            const activityId = req.params.id;
            const userId = req.session.uid;

            //Vérifier si il y a encore des places dans l'event
            const availablePlaces = await module.exports.getAvailablePlaces(req, res);

            if (availablePlaces <= 0) {
                return res.status(403).json({ message: "Désolé, il n'y a plus de places disponibles." });
            } else {

                // Vérifier si l'utilisateur est déjà inscrit à l'événement
                const existingParticipant = await ActivityUser.findOne({
                    
                    where: { [Op.and] : 
                        {
                        activityId: activityId,
                        userId: userId
                        }
                        
                    }
                });

                if (existingParticipant) {
                    let activity = await Activity.findByPk(req.params.id, {
                        include: {
                            model: Task,
                        },
                    });
                    activity = activity.toJSON()
                    return res.render('activities_read', {activity, availablePlaces, message: "Vous êtes déjà inscrit à cette activité." });
                } else {
                    // Inscrire l'utilisateur à l'événement
                    await ActivityUser.create({
                        activityId: activityId,
                        userId: userId
                    });

                    let activity = await Activity.findByPk(req.params.id, {
                        include: {
                            model: Task
                        },
                    });
                    activity = activity.toJSON()
                    res.render('activities_read', { activity, availablePlaces, message: "Inscription validée" })
                     
                }
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'inscription de l'utilisateur à l'événement :", error);
            return res.status(500).json({ error: "Une erreur est survenue lors de l'inscription à l'événement." });
        }
    },

    getActivitiesUpdate: async (req, res) => { // <---- fonction récupérer l'event ---->
        const activity = await Activity.findByPk(req.params.id, { raw: true })
        const tasks = await Task.findAll({raw: true})
        res.render('activities_update', { activity, tasks })
    },

    postUpdate: async (req, res) => { // <---- fonction modification d'event ---->
        try {
            const [updatedRowsCount, updatedRows] = await Activity.update({
                name_activity: req.body.activitiesName,
                description_activity: req.body.activitiesDescription,
                event_date: req.body.activitiesDate,
                event_time: req.body.eventTime,
                nbr_participants: req.body.playersNumber,
                imageUrl: req.body.imgTask
            }, {
                where: {
                    id: req.params.id
                },
                returning: true
            });

            if (updatedRowsCount === 0) {
                return res.status(404).send("L'article à mettre à jour n'a pas été trouvé.");
            }

            const updatedArticle = updatedRows[0];
            res.redirect('/activities/list');
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour de l'article :", error);
            return res.status(500).send("Une erreur est survenue lors de la mise à jour de l'article.");
        }
    },
    // Fonction pour obtenir le nombre de places restantes dans une activité

    activitiesDelete: async (req, res) => { // <---- fonction suppression d'une activité ---->
        await Activity.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect('/activities/list')
    },
    getRegistratedUsers: async (req, res) => { // <---- fonction pour récuperer la liste des utilisateurs inscris aux évenements ---->
        const navActivityUser = true;
        // Récupérer tous les utilisateurs avec leurs événements inscrits
        const activities = await Activity.findAll({
            include: [{
                model: User
                // through: ActivityUser // Assurez-vous que le nom du modèle est correctement orthographié
            }]

        });
        console.log(activities);
        res.render('activities_registration', { activities, navActivityUser });
    },
    deleteRegistratedUsers: async(req,res)=>{ //<----- fonction pour supprimer l'utilisateur inscris à un event ---->
        
        await ActivityUser.destroy( { where: {
            [Op.and]: [
                { userId: req.params.userId },
                { activityId: req.params.activityId }
            ]
        } } )
        res.redirect('/activities/registrated/users')
    } ,
}