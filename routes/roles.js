const express = require('express');
const router = express.Router();
const Role = require('../models/roles'); // Assuming Role is a Mongoose model

// Create a new role
router.post('/', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).send(role);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all roles with filters
router.get('/roles', async (req, res) => {
    try {
        const { username, fullname, loginCountGte, loginCountLte } = req.query;
        const filter = {};

        if (username) {
            filter.username = new RegExp(username, 'i'); // case-insensitive search
        }
        if (fullname) {
            filter.fullname = new RegExp(fullname, 'i'); // case-insensitive search
        }
        if (loginCountGte) {
            filter.loginCount = { ...filter.loginCount, $gte: Number(loginCountGte) };
        }
        if (loginCountLte) {
            filter.loginCount = { ...filter.loginCount, $lte: Number(loginCountLte) };
        }

        const roles = await Role.find(filter).populate('role');
        res.send(roles);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get role by ID
router.get('/roles/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('role');
        if (!role) {
            return res.status(404).send();
        }
        res.send(role);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get role by username
router.get('/roles/username/:username', async (req, res) => {
    try {
        const role = await Role.findOne({ username: req.params.username }).populate('role');
        if (!role) {
            return res.status(404).send();
        }
        res.send(role);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Soft delete a role
router.delete('/roles/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!role) {
            return res.status(404).send();
        }
        res.send(role);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;