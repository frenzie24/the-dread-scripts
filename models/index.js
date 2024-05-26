const User = require('./User');
const Comment = require('./Comment');
const Post = require('./Post');


/*
PREVIOUS HOMEWORK HAS THE SOLUTION TO THIS I THINK
*/
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    through: {model:Comment, as: 'comments'}
});

User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    through:{model:Comment, as: 'comments'}
});

module.exports = { User, Comment, Post };
