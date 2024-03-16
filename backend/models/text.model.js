/**
 * Model class for "text"
 *
 * @author Vedanivas
 *
 * @param {Sequelize} sequelize - sequelize object
 * @param {Sequelize.DataTypes} DataTypes - sequelize datatypes
 *
 * @returns Text - sequelize model for text entity
 */

export default (sequelize, DataTypes) => {
    const Text = sequelize.define('Text', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      tableName: 'texts',
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    });
  
    return Text;
  };
  