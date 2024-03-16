import express from 'express';
import * as authenticator from '../middlewares/auth.js';
import { login, addUser, upload } from '../controllers/user.controller.js';

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
    .route('/upload')
    .post(auth, upload)

export default router;