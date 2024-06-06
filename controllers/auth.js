import * as config from "../config.js";
import jwt from "jsonwebtoken";
import {emailTemplate} from "../helpers/email.js";
import {hashPassword, comparePassword} from "../helpers/auth.js";
import User from "../models/user.js";
import {nanoid} from "nanoid";
import validator from "email-validator";
import {json} from "express";

const tokenAndUserResponse = (req, res, user) => {
    const token = jwt.sign({_id: user._id}, config.JWT_SECRET, {
        expiresIn: "1h"
    })

    const refreshToken = jwt.sign({_id: user._id}, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({token, refreshToken, user})
}
export const welcome = (req, res) => {
    res.json({
        data: "Hello Vikas",
    });
};

export const preRegister = async (req, res) => {
    try {

        const {email, password} = req.body;
        if (!validator.validate(email)) {
            return res.json({error: "A valid email is required"})
        }
        if (!password) {
            return res.json({error: "Password is required"})
        }
        if (password && password.length < 6) {
            return res.json({error: "Password should be at least 6 character"})
        }

        const user = await User.findOne({email});
        if (user) {
            return res.json({error: "Email is already existing"})
        }
        const token = jwt.sign({email, password}, config.JWT_SECRET, {
            expiresIn: "1h",
        })

        const data = await config.AWSSES.sendEmail(emailTemplate(email,
            `<p>Please click the link bellow to activate your account.</p>
                                                           <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>`,
            config.EMAIL_TO, "Accout Activation")).promise();

        return res.json({ok: true});
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({error: 'Something went wrong. Try again.'});
    }
};

export const register = async (req, res) => {
    try {
        const {email, password} = jwt.verify(req.body.token, config.JWT_SECRET)
        //console.log("decoded :",decoded);
        const hashedPassword = await hashPassword(password);
        const user = await new User({
            username: nanoid(6),
            email,
            password: hashedPassword
        }).save();

        tokenAndUserResponse(req, res, user);
    } catch (err) {
        console.log('err :', err);
        return res.json({error: "Something went wrong.."})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.json({error: "email is not registered"})
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.json({error: "Wrong Password"})
        }

        tokenAndUserResponse(req, res, user)
    } catch (err) {
        console.log('err :', err)
        return res.json({error: "Something went wrong.."})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.json({error: "Couldn't find user with that email"})
        } else {
            const resetCode = nanoid();
            user.resetCode = resetCode;
            user.save();
            const token = jwt.sign({resetCode}, config.JWT_SECRET, {expiresIn: "1h"})

            await config.AWSSES.sendEmail(emailTemplate(email,
                    `<p>Please click the link bellow to access your account</p>
                            <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my Account</a>`,
                    config.EMAIL_FROM, "Access your account"),
                (err, data) => {
                    if (err) {
                        res.json({ok: false})
                    } else {
                        console.log(data)
                        res.json({ok: true})
                    }
                })
        }
    } catch (err) {
        res.json({error: "Something went wrong"})
    }
}

export const accessAccount = async (req, res) => {
    try {
        const {resetCode} = jwt.verify(req.body.resetCode, config.JWT_SECRET);
        console.log('resetCode :', resetCode)
        if (resetCode) {
            const user = await User.findOneAndUpdate({resetCode: resetCode}, {resetCode: ""})
            tokenAndUserResponse(req, res, user)
        }
    } catch (err) {
        res.json({error: "Something went wrong"})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const {_id} = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
        const user = await User.findById(_id);
        tokenAndUserResponse(req, res, user)
    } catch (err) {
        console.log(err);
        return res.status(403).json({error: "Refresh token failed"})
    }
}
export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.password = undefined;
        user.resetCode = undefined;
        return res.json({user: user})
    } catch (err) {
        console.log(err);
        return res.status(403).json({error: "Unauthorized"})
    }
}

export const publicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        user.password = undefined;
        user.resetCode = undefined;
        return res.json(user)
    } catch (err) {
        console.log(err);
        return res.json({error: "User not found"})
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {password} = req.body;
        if (!password) {
            return res.json({error: "Password is required!"})
        }
        if (password && password.length < 6) {
            return res.json({error: "Password must be of at least 6 character!"})
        }
        const user = await User.findByIdAndUpdate(req.user._id, {
            password: await hashPassword(password)
        });
        res.json({ok: true})
    } catch (err) {
        console.log('err :', err);
        res.status(403).json({error: "Unauthorized"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body.profile, {
            new: true
        })
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user)
    } catch (err) {
        console.log('err :', err);
        if (err.codeName === 'DuplicateKey') {
            return res.json({error: "Username or email is already taken"})
        } else {
            res.status(403).json({error: "Unauthorized"})
        }
    }
}

