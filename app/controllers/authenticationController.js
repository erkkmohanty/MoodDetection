import User from '../models/user';
import jwt from 'jsonwebtoken';//used to create, sign and verify tokens
import fs from 'fs';

class AuthenticationController {
    constructor(req, res) {
        this._req = req;
        this._res = res;
    }
    async authenticate() {
        try {
            let { name, password } = this._req.body;
            let privateKey = fs.readFileSync('./private.key', 'utf8');

            let user = await User.findOne({ name });
            if (!user) {
                this._res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            //check if password matches

            if (user.password !== password) {
                this._res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }

            //if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password

            const payload = {
                admin: user.admin
            };

            const signOptions = {
                issuer: "KK",
                subject: "Image upload",
                audience: "imageupload.com",
                expiresIn: "12h",
                algorithm: "RS256"
            };

            let token = jwt.sign(payload, privateKey, signOptions);

            //return the information including token as JSON

            this._res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        }
        catch (error) {
            this._res.json({ success: false, message: 'Authentication failed. User not found.' + error });
        }
    }
}

module.exports = AuthenticationController;