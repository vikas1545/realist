import * as config from "../config.js";
import {nanoid} from "nanoid";
import {AWSS3} from "../config.js";

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