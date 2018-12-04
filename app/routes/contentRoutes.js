import express from 'express';
import ContentController from '../controllers/contentController';
import config from '../../config';

let contentRoutes= express.Router();

contentRoutes.post('/',async function(req,res) {
    //return await new ContentController().upload(req,res);
    return await new ContentController(config.containerName).uploadToAzure(req,res);
});

module.exports=contentRoutes;
