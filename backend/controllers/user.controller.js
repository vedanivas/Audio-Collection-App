/**
 * User controller
 *
 * @author Vedanivas
 */
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import httpStatus from 'http-status'

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
    const userDetails = await create(req.body);
    res.status(httpStatus.CREATED).send(responseHandler(userDetails));
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
    
    const user = await findByMail(email);
    
    if (!user) {
      throw new NotFoundError('Invalid email or password. Please try again.');
    }
    
    // const check = await bcrypt.compare(password, user.password);
    const check = true;

    if (!check) {
        throw new NotFoundError('Invalid email or password. Please try again.');
    }

    const payload = {
        user: {
          id: user.email,
          user: true,
        },
    };
      
    const token = generateAccessToken(payload);
    if (!token) {
        throw new NotFoundError('Token not generated');
    }

    res.status(httpStatus.OK).send(responseHandler({ 'token': token, 'user': true }));
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