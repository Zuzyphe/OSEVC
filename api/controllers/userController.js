const { Op } = require('sequelize');
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const { Request, Response } = require('express');
const User = require('../models/eventMembersModel');
const Event = require('../models/eventEVCModel')
const Flash = require('connect-flash');

module.exports = {
    list: async (req, res) => { // <---- montre la liste des utilisateurs existants/displays the existing users list ---->
        const users = await User.findAll({ raw: true })
        res.render('user_list', { users })
    },

    get: (req, res) => {  // <---- Donne la page d'inscription ---->
        const navInscription = true // sert à mettre le lien active 
        res.render('user_create', { navInscription })
    },

    post: async (req, res) => { // <---- enregistre un user dans la base ---->
        // Vérifier que la case des politiques de confidentialité a été cochée
        const hasAcceptedPrivacyPolicy = req.body.confidentiality === 'true';

        if (!hasAcceptedPrivacyPolicy) {
            // Si la case n'a pas été cochée, renvoyer une erreur ou un message approprié
            return res.status(400).send('Vous devez accepter les politiques de confidentialité pour vous inscrire.');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('user_create', { errors: errors.array() }, { hasAcceptedPrivacyPolicy });
        }
        // Application du trim sur les valeurs des champs
        
        
        const prenom = req.body.prenom.trim();
        const nom = req.body.nom.trim()
        const email = req.body.email.trim();
        const password = req.body.password;
        const confidentiality = req.body.confidentiality;

        
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { member_email: email },
                    { member_firstname: req.body.prenom },
                    { member_name: req.body.nom },
                ]
            }
        })
        if (user) {
            const error = "Ces identifiants existent déjà."
            return res.render('user_create', { error })
        } else {

            await User.create({
                member_firstname: prenom,
                member_name: nom,
                member_email: email,
                password: password,
                confidentiality: confidentiality
            })
            req.flash('success', 'Votre compte a bien été créé, vous pouvez maintenant vous connecter avec vos identifiants.');
            res.redirect('login')
        }
    },
    getAccount: async (req, res) => {
        // Chercher l'utilisateur correspondant à l'id -- find the right user in the database according to his id
        const account = await User.findOne({
            where: { id: req.params.id },
            // include: [{
            //     model: Event,
            // }],
                        
        });

        // console.log(account);
        // console.log(req.session);
        req.session.uid = account.id;
        
        res.render('my_account', { account })
    },
    getLogin: async (req, res) => { // <---- Donne la page de connexion ---->
        // res.render('login')
        res.render('login', { message: req.flash('success') });
    },
    postLogin: async (req, res) => { // <---- permet de connecter un user au site ---->
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', { errors: errors.array() });
        }
        // cherche en base l'utilisateur par son email 
        const user = await User.findOne({
            where: { member_email: req.body.email }
        })
        if (!user) { //si on trouve pas d'user -> retour à la page de inscription
            res.redirect('/user/register')
        } else {
            //sinon 
            // compare les mot de passe (formulaire, base de donnée)
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                //si faux 
                if (!result) {
                    // -> renvoie sur la page login

                    res.status(401).render('login', { errors: errors.array() })

                } else {
                    //sinon inscription dans la session
                    req.session.uid = user.id
                    req.session.prenom = user.member_firstname
                    req.session.isAdmin = user.isAdmin
                    req.session.isOrganiser = user.isOrganiser
                    req.session.isParticipant = user.isParticipant
                    //répeter pour chaque role
                    console.log(req.session);

                    if (user.isAdmin) {
                        req.session.isAdmin = true
                    }
                    if (user.isOrganiser) {
                        req.session.isOrganiser = true
                    }
                    if (user.isParticipant) {
                        req.session.isParticipant = true
                    }
                    
                    res.redirect('/user/personal_board')
                }
            })

        }

    },
    logout: (req, res) => { // <---- deconnecte l'user  ---->
        req.session.destroy()
        res.redirect('/')
    },
    addalarm: (req, res) => {
        req.session.alarm = true
        res.redirect('/user/read/' + req.params.id)
        // res.render('my_account')
    },
    removeregister: async (req, res) => {
        await User.destroy({
            where: {
                [Op.and]: [
                    { userId: req.params.userId },
                    { eventId: req.params.eventId }
                ]
            }
        })
        res.redirect('/')
    },
    update: async (req, res) => {
        const user = await User.findByPk(req.params.id, { raw: true })
        res.render("user_create", { user })
    }
}