import multer from 'multer';
import config from '../../config';
import path from 'path';
import AzureService from '../services/azureService';


class ContentController {

    constructor(containerName){
        this.containerName=containerName;
        this.azureService=new AzureService();
    }

    async uploadToAzure(req,res){
        try {
          let response=  await this.azureService.uploadStream(this.containerName, req,res);
          return res.json({message:response.message,success:true});
        } catch (error) {
            console.log(error);
            return res.json({
                message:new Error(error),
                success:false
            });
        }
    }

    async upload(req, res) {
        try {
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, config.document_path)
                },
                filename: function (req, file, cb) {
                    cb(null, Date.now() + '-' + file.originalname)
                }
            })

            var upload = multer({ storage: storage }).single('content');
            upload(req, res, function (err) {
                if (err) {
                    console.log(err);
                    return res.end("Error uploading file.");
                }
                res.json({
                    success: true,
                    path: req.file.path
                })
            });
        }
        catch (err) {
            res.json({ err });
        }
    }
}

module.exports = ContentController;