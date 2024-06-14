const User = require("../models/eventMembersModel")

module.exports = async (req, res, next) => {
    if (!req.session.uid) {
        res.redirect('/login') // redirect to login page if no user is logged in
    } else {
        let user = await User.findOne({
            where: {
                id: req.session.uid
            }
        }, { raw: true })

        if (!user || user.isAdmin === false) {
            res.redirect('/access-denied') // redirect to access denied page if user is not an admin
        } else {
            next()
        }
    }
}
