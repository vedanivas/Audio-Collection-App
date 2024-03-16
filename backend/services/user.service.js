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
const { User } = db.db;

/**
 * findById function to fetch data for provided userId
 *
 * @param {number} userId - user id for which data needs to be fetched
 * @returns {Promise} User object
 */
const findByMail = async num => await User.findOne({
    where: {
        email: num
    }
}) 

/**
 * create function to add new user
 *
 * @param {object} data - user object with information to be saved in system
 * @returns {Promise} Created user object
 */
const create = async data => await User.create(data);
  
/**
 * Function to upload file to minio
 * 
 * @param {object} file - file object to be uploaded
 * @returns {Promise} - uploaded file object
 */
const uploadToMinio = async file => {
  const { originalname, buffer } = file;
  const fileName = `${Date.now()}-${originalname}`;
  const metaData = {
    'Content-Type': 'application/octet-stream',
    'X-Amz-Meta-Testing': 1234,
    'example': 5678
  }
  await minioClient.putObject('audios', fileName, buffer, metaData);
  return { fileName };
}

export {
    findByMail,
    create,
    uploadToMinio,
};