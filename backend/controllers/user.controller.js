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
    const details = req.body
    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS)
    details.password = await bcrypt.hash(details.password, salt)
    const userDetails = await create(details)
    res.status(httpStatus.CREATED).send(responseHandler(userDetails))
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
    const { email, password } = req.body

    const user = await findByMail(email)

    if (!user) {
        throw new NotFoundError('Invalid email or password. Please try again.')
    }

    const check = await bcrypt.compare(password, user.password)

    if (!check) {
        throw new NotFoundError('Invalid email or password. Please try again.')
    }

    const payload = {
        user: {
            id: user.email,
            admin: user.admin,
        },
    };

    const token = generateAccessToken(payload);
    if (!token) {
        throw new NotFoundError('Token not generated');
    }

    res.status(httpStatus.OK).send(responseHandler({ 'token': token, 'admin': user.admin }));
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
    const filePaths = req.files
    console.log(filePaths)

    filePaths.forEach((filePath) => {
        const file = filePath.path.split('.')[0] + '.wav'
        const names = file.split('/')
        const filename = '/'+ names[1] + '/' + names[2]
        ffmpeg(filePath.path)
            .toFormat('wav')
            .on('error', (err) => {
                console.error('An error occurred: ' + err.message)
                return res.sendStatus(500)
            })
            .on('end', async () => await uploadToMinio({fileName: filename, path: file}))
            .save(file)
    })
    res.status(httpStatus.OK).send(responseHandler('Audios uploaded successfully'));
}

/**
 * Function which provides functionality
 * to get all the sentences
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const getSentences = async (req, res) => {
    try {
        const sents = await collectSents()
        res.status(httpStatus.OK).send(responseHandler(sents))
    } catch (error) {
        console.log(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(error))
    }
}

export {
    addUser,
    login,
    uploadAudio,
    getSentences,
};