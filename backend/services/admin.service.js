/*
 * User service which serves DB operations
 * required by the user controller
 *
 * @author Vedanivas
 */
import db from '../models/index.js';
import minioClient from '../configs/minio.js';

import bufferToStream from '../utils/streamifier.js';

/*
 * @constant {Sequelize.models} - User model is extracted
 */
const { User, Text, File } = db.db;

/*
 * findAll function to retrieve all available users in system
 *
 * @returns {Promise} User object array
 */
const findAll = async () => User.findAll();

/*
 * Function to upload text 
 * file to minio
 * 
 * @param {object} file - file object to be uploaded
 * @returns {string} - presigned url of uploaded file
 */
const uploadTextFileToMinio = async file => {
    const name = file.originalname
    const fileSize = file.size
    const stream = await bufferToStream(file.buffer)

    return new Promise((resolve, reject) => {
        minioClient.putObject('texts', name, stream, fileSize, (err, objInfo) => {
            if (err) {
                console.log(err)
                reject({ status: 'fail', message: err })
            }
            resolve({ status: 'success', message: objInfo })
        })
    })
}

/*
 * Function to update
 * the table in mysql
 * 
 * @param {object} rows - rows to be added to the table
 */
const updateTexts = async rows => await Text.bulkCreate(rows);

/*
 * Function to update
 * the files table
 * check if the file
 * exists
 * 
 * @param {object} file - file metadata
 */
const checkFileExists = async file => {
    const fileExists = await File.findOne({
        where: {
            filename: file.filename
        }
    })
    if (fileExists) {
        return { status: 'exists', message: 'A file with this name already exists.' }
    }
    
    try {
        await File.create(file)
        return { status: 'success', message: 'File succesfully created.' }
    } catch (error) {
        return { status: 'fail', message: err }
    }
}

export {
    findAll,
    uploadTextFileToMinio,
    updateTexts,
    checkFileExists,
};