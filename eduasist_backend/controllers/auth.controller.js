// controllers/auth.controller.js
const db = require("../models");
const config = require('../config/auth.config');
const User = db.user;
const { registerValidationSchema, loginValidationSchema }= require("../validation/auth.validation");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const { error } = registerValidationSchema(req.body);
  if (error) return res.status(400).send({ message: "Validation failed. " + error.details[0].message});

  // Verifică dacă utilizatorul deja există
  const emailExists = await User.findOne({ where: { email: req.body.email } });
  if (emailExists) return res.status(400).send({ message: `An user with email \"${email}\" already exists`});

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = loginValidationSchema(req.body);
    if (error) return res.status(400).send({ message: "Validation failed. " + error.details[0].message });
  
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send({ message: "She specified user was not found." });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ token: null, message: "User name or password are invalid!" });

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }); // 1800 for 30 minutes;  86400 for 24 hours
    res.status(200).send({ id: user.id, email: user.email, token: token, username: `${user.firstName} ${user.lastName}` });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};