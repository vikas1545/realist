import {nanoid} from "nanoid";
import {AWSS3} from "../config.js";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import slugify from 'slugify';

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
        console.log("req.body ****************** :",req.body)
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
        console.log("error :",e)
    }
}