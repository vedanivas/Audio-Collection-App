/**
 * Admin controller
 *
 * @author Vedanivas
 */
import httpStatus from 'http-status';
import fs from 'fs';

import * as errors from '../utils/api-error.js';
import * as response from '../middlewares/response-handler.js';
import { findAll, uploadTextFileToMinio, updateTexts } from '../services/admin.service.js';

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
const getAllUsers = async (req, res) => {
    const users = await findAll();
    let data = users.map((user) => user.dataValues);
    let newss = data[0];
    console.log(newss.phone_number, typeof newss.phone_number);
    if (newss.phone_number === "1234567891") {
        console.log('yes');
    }
    res.status(httpStatus.OK).send(responseHandler(users));
}

/**
 * Function which provides functionality
 * to upload and parse file
 * 
 * @param {*} req - express HTTP request object
 * @param {*} res - express HTTP response object
 */
const uploadFile = async (req, res) => {
    // const filePath = req.file;
    
    const filePath = '/Users/vedanivaschowdary/Academics/Sem_6/BTPI/sample.txt'
    // const response = uploadTextFileToMinio(filePath);
    // if (response.status === 'fail') {
    //     res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(response.message));
    // }

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Error reading file'));
        }

        const lines = data.split('\n');

        const rows = []
        lines.forEach((line) => rows.push({ text: line }));

        await updateTexts(rows);
        // if (response.status === 'fail') {
        //     res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(response.message));
        // }
        res.status(httpStatus.OK).send(responseHandler('File uploaded and texts updated successfully'));
    })

}

export {
    getAllUsers,
    uploadFile,
};