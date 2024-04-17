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
 * @returns {status} - status of file upload
 */
const uploadToMinio = async file => {
  const { fileName, path } = file

  minioClient.fPutObject('audios', fileName, path, (err, etag) => {
    if (err) {
      console.err("Error in uploading file: ", err)
      return { status: 'fail', message: err };
    }
    return { status: 'success', message: etag };
  });
}

/**
 * Function to collect all sentences from the system
 * 
 * @returns {Array} - List of sentences
 */
const collectSents = async () => {
  try {
    const sents = await Text.findAll({
      where: {
        recorded: false,
      },
      attributes: ['english', 'telugu', 'hindi']
    })
    
    return sents.map(sent => {
      return {
        english: sent.english,
        telugu: sent.telugu,
        hindi: sent.hindi,
        id: sent.id,
      }
    })
  } catch (error) {
    console.log("Error in collecting sentences: ", error);
    return []
  }
}

export {
    findByMail,
    create,
    uploadToMinio,
    collectSents,
};