import express from 'express';
import multer from 'multer'
import * as authenticator from '../middlewares/auth.js';
import { getAllUsers, uploadFile } from '../controllers/admin.controller.js';

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const auth = authenticator.default;

router
    .route('/getAll')
    .get(getAllUsers);

router
    .route('/upload')
    .post(upload.single('file'), uploadFile);

export default router;