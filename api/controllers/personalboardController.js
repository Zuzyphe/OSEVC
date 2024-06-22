const { Op } = require('sequelize')

module.exports = {
  personalBoard: async (req, res) => {

    const navHome = true
    //redirects the user to its personal page
        res.render('personal_board');
     
}

// get: async (req, res) => {

//   const navHome = true
//   //redirects the user to its personal page
//       res.render('personal_board');
   
// }

}