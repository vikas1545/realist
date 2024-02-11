import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config.js";

export const requireSignIn = async (req,res,next)=> {
    try{
        const decoded = jwt.verify(req.headers.authorization,JWT_SECRET);
        console.log('decoded :',decoded)
        req.user = decoded; //req.user._id
        next();
    }catch (e) {
        console.log(e);
        res.status(401).json({error:"Invalid or expired token"})
    }
}