import express from 'express';
import AuthenticationController from '../controllers/authenticationController';

let authenticationRoutes= express.Router();

authenticationRoutes.get('/',function(req,res){
    res.json({message:'Welcome to coolest API on earth!'});
});

authenticationRoutes.post('/authenticate', async function(req,res){
    return await new AuthenticationController(req,res).authenticate();
})



module.exports=authenticationRoutes;