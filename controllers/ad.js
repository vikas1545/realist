import {nanoid} from "nanoid";
import {AWSS3} from "../config.js";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import slugify from 'slugify';
import * as config from "../config.js";
import {emailTemplate} from "../helpers/email.js";
import {requireSignIn} from "../middlewares/auth.js";

export const uploadImage = async (req, res) => {
    try {
        const {image} = req.body;
        const base64Image = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const type = image.split(";")[0].split("/")[1];
        const params = {
            Bucket: 'vk-realist-app-bucket',
            Key: `${nanoid()}.${type}`,
            Body: base64Image,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${type}`
        }

        AWSS3.upload(params, (err, data) => {
            if (err) {
                console.log("error :", err);
                res.sendStatus(400);
            } else {
                res.send(data)
            }
        })

    } catch (e) {
        console.log('error :', e);
        res.json({error: "Upload failed! Try Again."})
    }
}

export const removeImage = async (req, res) => {
    try {
        const {Key, Bucket} = req.body;
        AWSS3.deleteObject({Bucket, Key}, (err, data) => {
            if (err) {
                console.log("err :", err)
                res.sendStatus(400)
            } else {
                res.send({ok: true, message: data})
            }
        })

    } catch (e) {
        console.log('error :', e);
        res.json({error: "delete failed! Try Again."})
    }
}

export const create = async (req, res) => {
    try {
        const {photos, description, title, address, price, type, landsize, coordinates} = req.body;
        console.log("req.body ****************** :", req.body)
        const payLoadData = req.body;
        if (!photos?.length) {
            return res.json({error: "Photos are required"})
        }
        if (!price) {
            return res.json({error: "Price is required"})
        }
        if (!type) {
            return res.json({error: "Type is required"})
        }
        if (!address) {
            return res.json({error: "Address is required"})
        }
        if (!description) {
            return res.json({error: "Description is required"})
        }

        delete payLoadData['coordinates']

        // Generate slug if not provided
        // if (!payLoadData.slug) {
        //     payLoadData.slug = slugify(title, { lower: true });
        // }


        const ad = await new Ad({
            //...req.body,
            ...payLoadData,
            postedBy: req.user._id,
            location: {
                type: "Point",
                coordinates: [Number(coordinates?.lon), Number(coordinates?.lat)]
            },
            slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`)
        }).save();


        //make user role seller
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                // $addToSet: {role: "Admin"}
                $set: {role: ["Seller"]}
            }, {
                new: true
            }
        )
        user.password = undefined;
        user.resetCode = undefined
        res.json({ad, user})

    } catch (err) {
        console.log("error :", err)
        res.send({error: "Something went wrong!"})
    }
}

export const ads = async (req, res) => {
    try {
        const adsForSell = await Ad.find({action: "Sell"})
            .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
            .sort({createdAt: -1}).limit(12);

        const adsForRent = await Ad.find({action: "Rent"})
            .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
            .sort({createdAt: -1}).limit(12);

        res.json({adsForSell, adsForRent})
    } catch (e) {
        console.log("error :", e)
    }
}

export const read = async (req, res) => {
    try {
        const ad = await Ad.findOne({slug: req.params.slug})
            .populate("postedBy", "name usename email company photo.Location")
            .select("-photos.ETag -photos.Key -photos.key -photos.ETag -photos.Bucket");

        const related = await Ad.find({
            _id: {$ne: ad._id},
            action: ad.action,
            type: ad.type,
            address: ad.address
        }).limit(3).select("-photos.ETag -photos.Key -photos.key -photos.ETag -photos.Bucket")

        res.json({ad, related})

    } catch (err) {
        console.log('err :', err)
        res.json({error: "Something went wrong"})
    }
}

export const addToWishList = async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: {wishlist: req.body.adId}
        }, {new: true})

        const {password, resetCode, ...rest} = user._doc; // Here, `doc` represents the retrieved user document
        res.json(rest)
    } catch (e) {
        res.json({error: "something went wrong"})
        console.log("error :", e)
    }
}

export const removeFromWishList = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            $pull: {wishlist: req.params.adId}
        }, {new: true})

        const {password, resetCode, ...rest} = user._doc; // Here, `doc` represents the retrieved user document
        res.json(rest)
    } catch (e) {
        console.log("error :", e)
    }
}

export const contactSeller = async (req, res) => {
    try {
        console.log('------ ', req.body);
        const {email, name, message, phone, adId} = req.body;
        const ad = await Ad.findById(adId).populate("postedBy", "email");

        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: {enquiredProperties: adId}
        });

        if (!user) {
            return res.json({error: "Could not find user with this email"})
        } else {
            //send email


            await config.AWSSES.sendEmail(emailTemplate(ad.postedBy.email,
                    `<p>You have received a new customer enquiry</p>
                              <h4>Customer details</h4>
                              <p>Name :${name}</p>
                              <p>Email :${email}</p>
                              <p>Phone :${phone}</p>
                              <p>Message :${message}</p>
                            <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} ${ad.price}</a>`,
                    email, "New enquiry received"),
                (err, data) => {
                    if (err) {
                        res.json({ok: false})
                    } else {
                        console.log(data)
                        res.json({ok: true})
                    }
                })


        }
    } catch (e) {
        res.json({error: "Something went wrong"})
    }
}

export const userAds = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.body.params ? req.body.params : 1;
        const total = await Ad.find({postedBy: req.user._id})
            .select("-photos.key photos.Key photos.ETag photos.Bucket -location")
            .populate("postedBy", "name email username phone company")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({createAt: -1});

        res.json({ads, total:total.length})
    } catch (e) {
        console.log('error :',e)
        res.json({error:"Something went wrong"})
    }
}