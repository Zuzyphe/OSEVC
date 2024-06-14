// const Task = require('../models/taskModel')
// const Event = require('../models/eventEVCModel')
// const { Op } = require("sequelize");

// module.exports = {
// //recherche concernant les events
//     search: async(req, res)=>{
//         console.log(req.body.search);
//         const {count: activitiesCount, rows: eventResults} = await Activity.findAndCountAll({
//             where: {
//                 [Op.or]: [
//                 {name: {[Op.substring]: req.body.search}},
//                 {description:{[Op.substring]: req.body.search}},
//                 {event_date:{[Op.substring]: req.body.search}},
//                 {event_time:{[Op.substring]: req.body.search}},
//                 {players_number:{[Op.substring]: req.body.search}}
//             ]
//             },
//             raw: true
//         });
//         //recherche concernant les jeux
//         const {count: taskCount, rows: taskResults} = await Task.findAndCountAll({
//             where: {
//                 [Op.or]: [
//                 {task_name:{[Op.substring]: req.body.search}},
//                 {task_desc:{[Op.substring]: req.body.search}},
//                 {player_number:{[Op.substring]: req.body.search}}
//             ]
//             },
//             raw: true
//         });
//         const events = await Activity.findAll({
//             include: Task
//           })
        
//         res.render('search_results', {taskResults, taskCount, eventResults, activitiesCount});

//     }
// }