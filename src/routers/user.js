const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/home');
    }

    res.render('index');
});

router.get('/signup', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/home');
    }

    res.render('signup');
});

router.get('/home', auth, async (req, res) => {
    try {
        res.render('home', {
            home: true,
            name: req.user.name,
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/update', auth, (req, res) => {
    const date = new Date(req.user.dob);
    const dob = date.toISOString().split('T')[0];

    res.render('updateUser', {
        updateProfile: true,
        name: req.user.name,
        email: req.user.email,
        gender: req.user.gender,
        dob
    });
});

router.get('/success', (req, res) => {
    res.render('success', {
        updated: req.query.updated,
        task: req.query.task
    });
});

router.post('/signup', async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie('token', 'Bearer ' + token);
        res.status(201).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie('token', 'Bearer ' + token);
        res.send();
    } catch (error) {
        if(error.message === 'Email is not registered!')
            res.status(404).send({ 'Error': error.message });
        else
            res.status(400).send({ 'Error': error.message });
    }
});

router.patch('/update', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        res.send();
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/deletePro', auth, async (req, res) => {

    try {
        await req.user.remove();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;