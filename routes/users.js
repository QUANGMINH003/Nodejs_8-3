var express = require('express');
var router = express.Router();
let userSchema = require('../models/users');
let jwt = require('jsonwebtoken');
const { fail } = require('assert');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* Create a new user */
router.post('/', async function (req, res, next) {
  try {
    let user = new userSchema(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

/* POST to verify email and username, then update status */
router.post('/verify', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    let user = await userSchema.findOne({ email: email, username: username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.status = true;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

/* Get all users, with optional search by username or fullname */
router.get('/all', async function (req, res, next) {
  try {
    let { username, fullname } = req.query;
    let filter = {};

    if (username) {
      filter.username = { $regex: username, $options: 'i' }; // Tìm username có chứa chuỗi nhập vào
    }
    if (fullname) {
      filter.fullname = { $regex: fullname, $options: 'i' }; // Tìm fullname có chứa chuỗi nhập vào
    }

    let users = await userSchema.find(filter);
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET user by username */
router.get('/username/:username', async function (req, res, next) {
  try {
    let user = await userSchema.findOne({ username: req.params.username }).populate('role');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/* Soft delete user by ID */
router.delete('/:id', async function (req, res, next) {
  try {
    let user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.deleted = true;
    await user.save();
    res.status(200).send({ message: 'User soft deleted' });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
