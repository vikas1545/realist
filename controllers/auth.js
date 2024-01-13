import * as config from "../config.js";
import jwt from "jsonwebtoken";

export const welcome = (req, res) => {
    res.json({
        data: "Hello Vikas",
    });
};

export const preRegister = async (req, res) => {
    try {
        //console.log(req.body);
        const {email, password} = req.body;
        const token = jwt.sign({email, password}, config.JWT_SECRET, {
            expiresIn: "1h",
        })
        const emailParams = {
            Source: config.EMAIL_FROM, Destination: {
                ToAddresses: [config.EMAIL_TO],
            }, Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html>
                                 <body>
                                  <h5>Welcome to Realist App</h5>
                                  <p>Please click the link bellow to activate your account.</p>
                                  <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
                                </body>
                               </html>`,
                    },
                }, Subject: {
                    Charset: "UTF-8", Data: "Welcome to Realist",
                },
            },
        };

        const data = await config.AWSSES.sendEmail(emailParams).promise();

        console.log('Email data:', data);
        return res.json({ok: true});
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({error: 'Something went wrong. Try again.'});
    }
};

export const register = async (req,res)=> {
    try {
        console.log("body..",req.body);
        return res.json({ok:"Registered..."})
    }catch (err) {
        console.log('err :',err);
        return res.json({error:"Something went wrong.."})
    }
}
