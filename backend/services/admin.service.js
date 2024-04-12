/**
 * User service which serves DB operations
 * required by the user controller
 *
 * @author Vedanivas
 */
import db from '../models/index.js';
import minioClient from '../configs/minio.js';

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
const uploadTextFileToMinio = async filePath => {
    const name = filePath.split('/').pop();
    // const metaData = {
    //     'Content-Type': 'text/plain',
    // }
    minioClient.fPutObject('texts', name, filePath, (err, objInfo) => {
        if (err) {
            console.log(err);
            return { status: 'fail', message: err };
        }

        return { status: 'success', message: objInfo };
    });
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