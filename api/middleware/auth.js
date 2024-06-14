const User = require("../models/eventMembersModel")

module.exports = async (req, res, next) => {
    
    let user
    if (req.session.member_firstname !== undefined) {
        user = await User.findOne({
            where: {
                prenom: req.session.member_firstname
            }
        }, { raw: true })
    }

    if (!user) {
        res.redirect('/user/login')
    } else {
        next()
    }

}


