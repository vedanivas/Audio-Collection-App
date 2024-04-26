import express from 'express';
import upload from '../configs/multer.js';
import * as authenticator from '../middlewares/auth.js';
import { login, addUser, uploadAudio, getSentences } from '../controllers/user.controller.js';

const router = express.Router();
const auth = authenticator.default;

// Add validator
router
    .route('/register')
    .post(addUser);

router
    .route('/login')
    .post(login);

router
    .route('/uploadAudio')
    .post(upload.array('audio', 3), uploadAudio)

router
    .route('/fetchSentences')
    .get(getSentences)

export default router;