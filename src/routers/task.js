const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tasks', auth, async (req, res) => {
    const match = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    try {
        const tasks = await User.findOne({ _id: req.user._id.toString() }).populate({
            path: 'tasks',
            match
        }).exec();
        res.send(tasks.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        
        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (error) {
        res.send(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if(!task){
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;