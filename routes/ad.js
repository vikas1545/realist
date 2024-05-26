import express from "express";
import * as ad from "../controllers/ad.js";
import {requireSignIn} from "../middlewares/auth.js";
const router = express.Router();

router.post('/upload-image',requireSignIn,ad.uploadImage);
router.delete('/remove-image',requireSignIn,ad.removeImage);
router.post('/create',requireSignIn,ad.create);
router.get('/ads',ad.ads);
router.get('/ad/:slug',ad.read);
router.post('/wishlist',requireSignIn,ad.addToWishList);
router.delete('/wishlist/:adId',requireSignIn,ad.removeFromWishList);

export default router;