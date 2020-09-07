const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        // user exist, check for correct password
        const passwortResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwortResult){
            // generate token
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).json({token: `Bearer ${token}`})
        } else{
            res.status(401).json({message: "Incorrect password. Please try again."})
        }
    }else{
        // email not found
        res.status(404).json({message: "This email not found"})
    }
};

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if(candidate){
        // throw error. user already exist
        res.status(409).json({message: "Email already exist. Try another email"})
    } else{
        // create new user
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try{
            await user.save();
            res.status(201).json(user)
        } catch (e) {
            // error
        }

    }
};
