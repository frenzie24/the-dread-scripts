const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Post extends Model {

}
Post.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
                unique: false
            },
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull:false  
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,

        },
    },
    {
       
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'Post',
    }
);

module.exports = Post;
