/**
 * User service which serves DB operations
 * required by the user controller
 *
 * @author Vedanivas
 */
import db from '../models/index.js';
import minioClient from '../configs/minio.js';

import bufferToStream from '../utils/streamifier.js';

/**
 * @constant {Sequelize.models} - User model is extracted
 */
const { User, Text } = db.db;

/**
 * findAll function to retrieve all available users in system
 *
 * @returns {Promise} User object array
 */
const findAll = async () => User.findAll();

/**
 * Function to upload text 
 * file to minio
 * 
 * @param {object} file - file object to be uploaded
 * @returns {string} - presigned url of uploaded file
 */
const uploadTextFileToMinio = async file => {
    const bucketName = 'texts';
    const name = file.originalname
    const fileSize = file.size
    const stream = await bufferToStream(file.buffer)

    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
        await minioClient.makeBucket(bucketName, 'us-east-1');
    }

    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, name, stream, fileSize, (err, objInfo) => {
            if (err) {
                console.log(err)
                reject({ status: 'fail', message: err })
            }
            resolve({ status: 'success', message: objInfo })
        })
    })
}

/**
 * Function to update
 * the table in mysql
 * 
 * @param {object} rows - rows to be added to the table
 */
const updateTexts = async rows => await Text.bulkCreate(rows);

export {
    findAll,
    uploadTextFileToMinio,
    updateTexts
};