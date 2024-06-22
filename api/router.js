const express = require('express')
const router = express.Router()
const homeController = require('../api/controllers/homeController')
const userController = require('../api/controllers/userController')
const taskController = require('./controllers/taskController')
const activityController = require('./controllers/activitiesController')
const eventController = require('./controllers/eventController')
// const searchController = require('./controllers/searchController')
const personalboardController = require('./controllers/personalboardController')
const { body, param } = require('express-validator')

const authMW = require("./middleware/auth")
const isAdminMW = require("./middleware/isAdmin")
const isOrganiserMW = require("./middleware/isOrganiser")
const isParticipantMW = require("./middleware/isParticipant")
const authenticateUser = require('./middleware/authenticateUser')



//<-----------  Home Routes   ----------->

router.route('/')
    .get(homeController.get)

//<-----------  Events Routes   ----------->
router.route('event_create')
    .get(eventController.eventCreate)

router.route('event_read')
    .get(eventController.eventGet)

router.route('/event/read/:id')
    .get([
        param('id').exists().withMessage("L'identifiant de l'événement est requis.")
    ], eventController.readEvent)

// //<-----------  Roles Routes   ----------->

// router.route('/user/personal/board/:userId')
//     .post (userController.postRole)

//<-----------  User Routes   ----------->

router.route('/user/register')
    .get(userController.get)
    .post([
        body('prenom')
            .isLength({ min: 4 })
            .notEmpty().withMessage('Le prénom d\'utilisateur est requis')
            .trim(),
        body('nom')
            .isLength({ min: 2 })
            .notEmpty().withMessage('Le nom d\'utilisateur est requis')
            .trim(),
        body('email')
            .notEmpty().withMessage('L\'adresse e-mail est requise')
            .isEmail().withMessage('L\'adresse e-mail n\'est pas valide')
            .trim(),
        body('password')
            .isLength({ min: 8 }).withMessage('les données entrées sont incorrectes')
            .matches(/[a-z]/).withMessage('les données entrées sont incorrectes')
            .matches(/[A-Z]/).withMessage('les données entrées sont incorrectes')
            .matches(/[0-9]/).withMessage('les données entrées sont incorrectes')
            .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('les données entrées sont incorrectes')
            .custom((value, { req }) => {
                if (value !== req.body.confPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }
                return true;
            })
            .trim(),
    ], userController.post);

router.route('/user/login')
    .get(userController.getLogin)
    .post(
        body('email')
            .notEmpty().withMessage('L\'adresse e-mail est requise')
            .isEmail().withMessage('L\'adresse e-mail n\'est pas valide')
            .trim(),
        body('password')
            .notEmpty().withMessage('Le mot de passe invalide')
            .trim()
        , userController.postLogin)

router.route('/user/logout')
    .get(userController.logout)

router.route('/user/read/:id')
    .get(userController.getAccount)
    .post(userController.updatePost)

router.route('/user/unregister/:userId/:eventId')
    .get(userController.removeregister)

router.route('/user/update/:id')
    .get(userController.update)
    

//a vérifier

router.route('/user/delete/:id')

router.route('/user/list')
    .get(userController.list)

router.route('/user/inscription/success')
    .post(userController.post)


//<---------  Personal Board Routes   ----------->
router.route('/user/personal_board')
    .get(personalboardController.personalBoard);

//<---------  Tasks Routes   ----------->

router.route('/task/read/:id')
    .get(taskController.read);

router.route('/task/list')
    .get(taskController.list)

router.route('/task/read/:id')
    .get(taskController.read)

router.route('/task/create')
    .get(taskController.createTask)
    .post(
        body('taskName')
            .exists().trim()
            .isLength({ min: 2, max: 50 }).withMessage('les données entrées sont incorrectes.')
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .escape(),

        body('taskDescription')
            .exists().trim()
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .isLength({ max: 400 }).withMessage('Le contenu incorrect')
            .escape(),

        body('playerNumber')
            .isInt({ min: 1, max: 60 }).withMessage('Nombre de joueur incorrect')
        ,
        taskController.postTask)


router.route('/task/page/:id')
    .get(taskController.getTaskDetail)

router.route('/task/update/:id')
    .get(taskController.getTaskUpdate)
    .post([
        // utilisation du middleware pour n'autoriser la modification qu'à l'admin
        body('taskName')
            .exists().trim()
            .isLength({ min: 2, max: 50 }).withMessage('les données entrées sont incorrectes')
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .escape(),

        body('taskDescription')
            .exists().trim()
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .isLength({ max: 400 }).withMessage('Contenu incorrect')
            .escape(),

        body('playerNumber')
            .isInt({ min: 1, max: 60 }).withMessage('Nombre de joueurs incorrect')
        ,
    ], taskController.postTaskUpdate)



router.route('/task/delete/:id')
    .post(taskController.taskDelete)

//<-----------  Activities Routes   ----------->

router.route('/activities/create')
    .get(activityController.createActivities)
    .post(
        body('activitiesName')
            .exists().trim()
            .isLength({ min: 2, max: 20 }).withMessage('Les données entrées sont incorrectes')
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .escape(),

        body('activitiesDescription')
            .exists().trim()
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .isLength({ max: 200 }).withMessage('Le contenu incorrecte')
            .escape(),

        body('activitiesDate')
            .isDate().withMessage('la date invalide')
            .notEmpty().withMessage('Une date est requise'),

        body('activitiesTime')
            .isTime({ hourFormat: 'hour24' })
            .withMessage('heure de l\'événement incorrecte'),

        body('playersNumber')
            .isInt({ min: 1, max: 60 }).withMessage('Le nombre de joueurs incorrect')
        ,
        activityController.postActivities)

router.route('/activities/list')
    .get(activityController.list)

router.route("/activities/read/:id")
    .get([
        param('id').exists().withMessage("L'identifiant de l'événement est requis.")
    ], activityController.read)

router.route('/activities/update/:id')
    .get(activityController.getActivitiesUpdate)
    .post([
        // Middleware de validation pour le titre de l'event
        body('activitiesName')
            .exists().trim()
            .isLength({ min: 2, max: 20 }).withMessage('les données entrées sont incorrectes')
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .escape(),

        // Middleware de validation pour description de l'event
        body('activitiesDescription')
            .exists().trim()
            .notEmpty().withMessage('Ce champ ne doit pas être vide.')
            .isLength({ max: 200 }).withMessage('Le contenu est incorrect.')
            .escape(),

        // Middleware de validation pour la date de l'event
        body('activitiesDate')
            .isDate().withMessage('la date invalide')
            .notEmpty().withMessage('Ce champ ne doit pas être vide'),
        // Middleware de validation pour l'heure de l'event
        body('activitiesTime')
            .isTime({ hourFormat: 'hour24' })
            .withMessage('L\'heure de l\'événement est incorrecte'),
        // Middleware de validation pour le nombre de joueur de l'event
        body('playersNumber')
            .isInt({ min: 1, max: 60 }).withMessage('Le nombre de joueurs incorrecte.'),
        body('address').exists().trim()
            .notEmpty().withMessage('L\'adresse est obligatoire')

    ], activityController.postUpdate)

router.route('/activities/delete/:id')
    .post(activityController.activitiesDelete)

router.route('/activities/:id/places')
    .get(activityController.getAvailablePlaces)

router.route('/activities/:id/register')
    .post(authMW, activityController.registerUserToActivities)


router.route('/activities/registrated/users')
    .get(activityController.getRegistratedUsers)
router.route('/activities/:eventId/user/:userId/delete')
    .post(activityController.deleteRegistratedUsers)


// //<---------  Search Routes   ----------->
// router.route('/search')
//     .get(searchController.search)
// router.route('/search/results')
//     .post(searchController.search)


//<-----------  FAQ Routes   ----------->

router.route('/FAQ')
    .get(homeController.faq)



module.exports = router