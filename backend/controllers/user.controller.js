/**
 * User controller
 *
 * @author Vedanivas
 */
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import httpStatus from 'http-status'
import bcrypt from 'bcryptjs'

import * as errors from '../utils/api-error.js'
import * as response from '../middlewares/response-handler.js'
import { findByMail, create, uploadToMinio, collectSents } from '../services/user.service.js'

import { generateAccessToken } from '../utils/authentication.js'

ffmpeg.setFfmpegPath(ffmpegPath.path);

/**
 * @constant {NotFoundError} NotFoundError - not found error object
 */
const { NotFoundError } = errors.default;
/**
 * @constant {function} responseHandler - function to form generic success response
 */
const responseHandler = response.default;

/**
 * Function which provides functionality
 * to add/create new user in system
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const addUser = async (req, res) => {
    const details = req.body;
    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
    details.password = await bcrypt.hash(details.password, salt);
    try {
        const userDetails = await create(details);
        res.status(httpStatus.CREATED).send(responseHandler(userDetails));
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const errorMessage = error.errors[0].path === 'email' 
                                 ? "Email already in use." 
                                 : "Phone number already in use.";
            res.status(409).send({ error: errorMessage });
        } else {
            res.status(500).send({ error: "Internal server error." });
        }
    }
};



/**
 * Function which provides functionality
 * to login a
 * the provided mail and password
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 *
 * @throws {NotFoundError} - if no such user exists for provided userId
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findByMail(email);
        
        if (!user) {
            return res.status(404).json({ error: 'Invalid email or password. Please try again.' });
        }

        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
        }

        const payload = {
            user: {
                id: user.email,
                admin: user.admin,
            },
        };
          
        const token = generateAccessToken(payload);
        res.status(200).send({ token: token, admin: user.admin });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


/**
 * Function which provides functionality
 * to upload the provided audio file
 * to the system
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const uploadAudio = async (req, res) => {
    const filePath = req.file.path;
    const file = {
        path: `uploads/${req.file.filename}.wav`,
        originalname: req.file.originalname,
        fileName: req.file.filename,
    }
    
    ffmpeg(filePath)
    .toFormat('wav')
    .on('error', (err) => {
      console.error('An error occurred: ' + err.message);
      return res.sendStatus(500);
    })
    .on('end', () => uploadToMinio(file))
    .save(file.path);
    
    res.status(httpStatus.OK).send(responseHandler({ 'message': 'File uploaded successfully' }));
}

/**
 * Function which provides functionality
 * to get all the sentences
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const getSentences = async (req, res) => {
    const sents = await collectSents()
    res.status(httpStatus.OK).send(responseHandler(sents))
}

export {
    addUser,
    login,
    uploadAudio,
    getSentences,
};