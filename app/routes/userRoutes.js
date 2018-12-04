import express from 'express';
import User from '../models/user';

let userRoutes = express.Router();

userRoutes.get('/', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

module.exports=userRoutes;