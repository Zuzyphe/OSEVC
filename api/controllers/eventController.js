const { Op } = require('sequelize')
const Event = require('../models/eventEVCModel')
const User = require('../models/eventMembersModel')
const Activity = require('../models/activitiesModel')
const { validationResult } = require('express-validator')

module.exports = {

  eventCreate: async (req, res) => {  // <---- Donne la page d'inscription ---->
    const navEventCreate = true
    res.render('event_create', { navEventCreate })


  },
  postEvent: async (req, res) => { // <---- fonction de création d'event ---->
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('event_create', { errors: errors.array() });
      }
      const event = await Event.findOne({
        where: {
          // id: req.body.eventID,
          name: req.body.eventName.trim(),
          event_time: req.body.eventTime,
          event_date: req.body.eventDate,
          userId: req.body.NameOrganiser
        }
      });

      console.log("Correspondance trouvé :", event); // log affichage de la correspondance

      if (event !== null) {
        const error = "Cet événement existe déjà";
        return res.render('event_create', { error: error });
      } else {
        const eventcreated = await Event.create({
          name: req.body.eventName.trim(),
          description: req.body.eventDescription.trim(),
          event_time: req.body.eventTime,
          event_date: req.body.eventDate,
          nbr_participants: req.body.eventParticipantsNbr,
          event_address: req.body.eventAddress.trim(),
          imageUrl: req.body.imgEvent
        });
        console.log("Évènement créé :", eventcreated); // log confirmation de la création d'un évenement 
        return res.redirect('/event_read/:id');
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'évènement :", error);
      return res.status(500).send("Une erreur est survenue lors de la création de l'événement.");
    }

  },
  readEvent: async (req, res) => { //<---- fonction pour lire l'event via l'ID ---->
    const navEvent = true;

    console.log("ID de l'évènement à rechercher :", req.params.id); // log pour afficher l'ID

    let event = await Event.findByPk(req.params.id, {
      include: [
        { model: Activity },
        { model: User }
      ]
    });
    if (!event) {
      return res.status(404).send("L'événement n'a pas été trouvé.");
    } else {
      
        res.render('event_read', { event, navEvent });
      }
    
  },
  eventGet: (req, res) => {  // <---- Donne la page d'inscription ---->

    res.render('event_read')


  }

}