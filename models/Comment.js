const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Comment extends Model {

}

Comment.init(
    {
        // this is how we know what posts our comments belong too
        // we use this FK to attach related comments to posts
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Post',
                key: 'id',
                unique: false
            },
        },
        // this is how we know what user our comments belong too
        // use use this FK to attach related comments to a user
        // we can use this relation to display user's comments on their profile etc
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
                unique: false
            },
        },
        // the text body of the comment, ours is limited to 1000 characters
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        // i think dates are neat, this will craete a date when the model and can be used for neat
        // data display on comments (written by comment.name on comment.date is how it will look in handlebars)
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
        modelName: 'Comment',
    }
);

module.exports = Comment;
