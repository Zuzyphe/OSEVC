const { Op } = require('sequelize')
const Activity = require('../models/activitiesModel')
const Task = require('../models/taskModel')


module.exports = {
  get: async (req, res) => {
    const navHome = true
    const activities = await Activity.findAll({
      include: Task 
    })

    // if (!latest) {
      //   res.render('home', { navHome})
      // }else{
      //   res.render('home', { latest, navHome })
      // }
   
    console.log(req.session)
    console.log(activities)
    res.render('index', {activities, isAdmin: req.session.isAdmin });

  },
  // search: async (req, res) => {
  //   const { count: articleCount, rows: articleResults } = await Article.findAndCountAll({
  //     where: {
  //       [Op.or]: [
  //         { title: { [Op.substring]: req.query.search } },
  //         { content: { [Op.substring]: req.query.search } }
  //       ]
  //     },
  //     raw: true
  //   });

  //   const { count: commentCount, rows: commentResults } = await Comment.findAndCountAll({
  //     where: {
  //       content: { [Op.substring]: req.query.search }
  //     },
  //     raw: true
  //   });
  // },
  faq: async (req,res) => {
    res.render('FAQ')
  }

}