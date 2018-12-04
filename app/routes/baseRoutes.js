import express from 'express';
import User from '../models/user';
import path from 'path';
import AppInitialization from '../initialization/appInitialization';
import config from '../../config';


let router = express.Router();

//Home page route
router.get('/', function (req, res) {
    res.sendFile(path.resolve("index.html"));
});

//ABout page route
router.get('/about', function (req, res) {
    res.send('About this wiki');
});

router.get('/setup', async function (req, res) {
    //Initialize app data
    let app=new AppInitialization(config.containerName);
    await app.init();
    
    // create a sample user

    let kiran = new User({
        name: 'kiran',
        password: 'password',
        admin: true
    });

    //check if user exists
    User.findOne({ name: 'kiran' }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            //save the sample user
            kiran.save(function (err) {
                if (err)
                    throw err;
                console.log('User saved successfully');
                res.json({ success: true });
            });
        } else {
            console.log('Setup has been completed already');
            res.json({success:true});
        }
    });

});

module.exports = router;