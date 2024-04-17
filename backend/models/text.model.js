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
      telugu: {
        type: DataTypes.STRING,
        allowNull: false
      },
      english: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hindi: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recorded: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0
      },
      user: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [10]  
        }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      tableName: 'texts',
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    })
    
    Text.sync().then(() => console.log('Text table created/exists'))

    return Text;
  }
  