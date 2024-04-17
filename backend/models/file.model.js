/**
 * Model class for "text"
 *
 * @author Vedanivas
 *
 * @param {Sequelize} sequelize - sequelize object
 * @param {Sequelize.DataTypes} DataTypes - sequelize datatypes
 *
 * @returns File - sequelize model for file entity
 */

export default (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
      filename: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      toBeRecorded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
      total: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        default: 'Telugu'
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      tableName: 'files',
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    });
    
    File.sync().then(() => console.log('File table created/exists'))

    return File
  }
  