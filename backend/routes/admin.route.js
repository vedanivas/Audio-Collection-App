import express from 'express';
import * as authenticator from '../middlewares/auth.js';
import { getAllUsers, uploadFile } from '../controllers/admin.controller.js';

const router = express.Router();
const auth = authenticator.default;

router
    .route('/getAll')
    .get(getAllUsers);

router
    .route('/upload')
    .post(uploadFile);

export default router;