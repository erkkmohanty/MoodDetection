import jwt from 'jsonwebtoken';//used to create, sign and verify tokens
import fs from 'fs';

class JwtAuthMiddleware {
   
    Authenticate=(req,res,next)=>{
        // check header or url parameters or post parameters for token
        let token=req.body.token||
                  req.query.token||
                  req.headers['x-access-token'];
        let publicKey = fs.readFileSync('./public.key', 'utf8');
        //if there is no token,return error
        if(!token){
            return res.status(403).send({
                success:false,
                message:'No token provided'
            });
        }
        //decode token
        jwt.verify(token,publicKey,function(err,decoded){
            console.log(JSON.stringify(decoded));
            if(err){
               return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else{
                //if everything is good, save to request for use in other routes
                req.decoded=decoded;
                next();
            }
        })
    }
}

module.exports=JwtAuthMiddleware;