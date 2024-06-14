const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

let SequelizeStore = require("connect-session-sequelize")(session.Store);

const express = require('express')
const { engine } = require('express-handlebars')
// const exphbs = require A COMPLETER

const path = require('path')
const router = require('./api/router')
const config = require('./config')


const app = express()
const port = 3000

//models call
const Event = require('./api/models/eventEVCModel');
const User = require('./api/models/eventMembersModel');
const PersonalNotes = require('./api/models/personalNotesModel');
const Activity = require('./api/models/activitiesModel');
const Task = require('./api/models/taskModel');
const EventLists = require("./api/models/eventListsModel");

//definition of the relations between the tables
Event.hasMany(Activity);
User.belongsTo(Event);
Activity.hasMany(Task);
Task.belongsTo(Activity);
Task.belongsToMany(User, { through: 'TaskUser' });
User.belongsToMany(Task, { through: 'TaskUser' });
PersonalNotes.belongsTo(User);
Activity.belongsTo(User);
EventLists.belongsTo(Event);




//exportation in the needed order
module.exports = { Event, Activity, Task, EventLists, User, PersonalNotes };

// // Créez une instance de Handlebars avec les helpers
// const hbs = exphbs.create({
//     extname: ".hbs",
//     helpers: {
//       eq: (a, b) => a === b,
//       or: (a, b) => a || b,
//       and: (a, b) => a && b,
//       formatDate: (date, format) => {
//         return moment(date).format(format);
//       },
//       formatTime: (time, format) => {
//         return moment(time, "HH:mm:ss").format(format);
//       },
//       formatDateTime: (dateTime, format) => {
//         return moment(dateTime).format(format);
//       },
//     },
//   });

app.engine('hbs', engine({
    extname: '.hbs',
    helpers: {
        ifCond: function (v1, v2, option) {
            if (v1 === v2) {
                return option.fn(this)
            }
            return option.inverse(this)
        }
    }
}))
app.set('view engine', 'hbs')

app.use('/css', express.static(path.join(__dirname, 'assets/css')))
app.use('/js', express.static(path.join(__dirname, 'assets/js')))
app.use('/pictures', express.static(path.join(__dirname, 'views/pictures')))


try {
    config.sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//Handlebars moment 
const Handlebars = require("handlebars");
const MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

//<--------Multer--------->

//Define storage
const uploadDestination = path.join(__dirname, 'assets', 'images')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use the define path
        cb(null, uploadDestination);
    },
    filename: function (req, file, cb) {
        // Generate a unique name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        // Use unique name for this file
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

//  Multer Config
const upload = multer({
    storage: storage,
    // Ajouter une vérification de type de fichier si nécessaire
    fileFilter: function (req, file, cb) {
        // Vérifier si le fichier est une image
        if (file.mimetype.startsWith('image/') && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            return cb(new Error('Seules les images au format jpeg jpg et png.'));
        }
        cb(null, true);
    }
});


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new SequelizeStore({ db: config.sequelize })
}))

app.use('*', (req, res, next) => {
    if (req.session.prenom) {
        res.locals.uid = req.session.uid;
        res.locals.prenom = req.session.prenom
        if (req.session.isAdmin) {
            res.locals.isAdmin = true
        }
        if (req.session.isOrganiser) {
            res.locals.isOrganiser = true;
        }
        if (req.session.isParticipant) {
            res.locals.isParticipant = true;
        }
    }
    next();
})


// connect-flash method to display quick messages
app.use(flash());

app.post('/upload', (req, res) => {
    const imgUrl = req.body.image_url;
    console.log('Image URL received', imgUrl);
})


app.use('/', router)


app.listen(port, () => {
    console.log(`Example app listening at 127.0.0.1:${port}`)
})

