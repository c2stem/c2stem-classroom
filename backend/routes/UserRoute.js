const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.post('/register', catchAsync(async (req, res, _next) => {
    const user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.role = req.body.role;
    user.setPassword(req.body.password);
    await user.save();
    const token = user.generateJwt();
    res.status(200).json({ token });
}));

router.post('/login', catchAsync(async (req, res, next) => {

    return passport.authenticate('local', { session: false }, (err, user, _info) => {
        if(err) {
          return next(err);
        }
    
        if(user) {
            const token = user.generateJwt();
            return res.status(200).json({ token });
        }
    
        return res.status(400).info;
      })(req, res, next);
}));

module.exports = router;