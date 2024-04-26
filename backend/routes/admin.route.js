import express from 'express';
import multer from 'multer'
import * as authenticator from '../middlewares/auth.js';
import { getAllData, uploadFile, deleteAudio, deleteText } from '../controllers/admin.controller.js';

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const auth = authenticator.default;

router
    .route('/getAllData')
    .get(getAllData)

router
    .route('/upload')
    .post(upload.single('file'), uploadFile)

router
    .route('/deleteAudio')
    .post(deleteAudio)

router
    .route('/deleteText')
    .post(deleteText)

export default router;