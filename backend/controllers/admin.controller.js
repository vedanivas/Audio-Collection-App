/**
 * Admin controller
 *
 * @author Vedanivas
 */
import httpStatus from 'http-status';
import fs from 'fs';

import * as errors from '../utils/api-error.js';
import * as response from '../middlewares/response-handler.js';
import { findAll, uploadTextFileToMinio, updateTexts, deleteAudioFromMinio, resetText, deleteTextFromMySQL } from '../services/admin.service.js';

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
 * to retrieve all available users in system
 *
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const getAllData = async (req, res) => {
    const data = await findAll();
    res.status(httpStatus.OK).send(responseHandler(data));
}

/**
 * Function which provides functionality
 * to upload and parse file
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const uploadFile = async (req, res) => {
    const file = req.file
    
    // const response = await uploadTextFileToMinio(file)
    // if (response.status === 'fail') {
    //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(response.message))
    // }
    
    const lines = file.buffer.toString('utf8').split('\n')
    
    const rows = []
    lines.forEach((line) => rows.push({ english: line, telugu: line, hindi: line }))

    try {
        await updateTexts(rows)
        res.status(httpStatus.OK).send(responseHandler('File uploaded and texts updated successfully'))
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(error.message))
    }
}

/**
 * Function which provides functionality
 * to delete audio file
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const deleteAudio = async (req, res) => {
    const ids = req.body.ids
    
    let flag = true
    ids.forEach(async id => {
        const fileName = `${id}.wav`
        let response = await resetText(id)
        if (response.status === 'fail') {
            flag = false
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(response.message))
        }

        response = await deleteAudioFromMinio(fileName)
        if (response.status === 'fail') {
            flag = false
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(response.message))
        }
    })

    if (flag) {
        return res.status(httpStatus.OK).send(responseHandler("Audios deleted successfully"))
    }
}

/**
 * Function which provides functionality
 * to delete a text
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const deleteText = async (req, res) => {
    const ids = req.body.ids

    let flag = true
    ids.forEach(async id => {
        const response = await deleteTextFromMySQL(id)
        if (response.status === 'fail') {
            flag = false
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(response.message))
        }
    })

    if (flag) {
        return res.status(httpStatus.OK).send(responseHandler("Texts reset successfully"))
    }
}

export {
    getAllData,
    uploadFile,
    deleteAudio,
    deleteText,
}