//get the packages we need
"use strict";
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import config from './config';// get the config file
import baseroutes from './app/routes/baseRoutes';
import authenticationRoutes from './app/routes/authenticationRoutes';
import userRoutes from './app/routes/userRoutes';
import JwtAuthMiddleware from './app/middlewares/jwtauth-middleware';
import contentRoutes from './app/routes/contentRoutes';
import multer from 'multer';


let app = express();

//file upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname)
  }
})

var upload = multer({ storage: storage }).single('content');
//configuration

let port = process.env.PORT || config.port;
mongoose.connect(config.database, { useNewUrlParser: true }); // connect to database

//use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use morgan to log requests to the console
app.use(morgan('dev'));

app.use('/', baseroutes);//base routes
app.use('/api', new JwtAuthMiddleware().Authenticate);
app.use('/authentication', authenticationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contents', contentRoutes);


app.post('/photos', function (req, res, next) {
  upload(req,res,function(err) {
        console.log(req);
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.json({
            success:true,
            path:req.file.path
        })
    });
});



//start the server
app.listen(config.port);
console.log(`Magic happens at http://localhost:${config.port}`)
