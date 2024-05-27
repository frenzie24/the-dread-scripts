const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const { log, info, warn, error } = require('@frenzie24/logger')

//create a new comment
router.post('/', withAuth, async (req, res) => {
    info('attempting new comment')
    try {
        // we try to create a comment data passed from the client (req.body)
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        log('Comment created.', 'green')
        res.status(200).json(newComment);
    } catch (err) {
        error(err)
        res.status(400).json(err);
    }
});

// delete by id: when the path is /:id, then the id would go /1 to get the comment with an id of 1
router.delete('/:id', withAuth, async (req, res) => {

    try {
        // we use req.params.id a lot so lets just set up a variable for it
        const _id = Math.floor(req.params.id);
        // check to make sure the first param passed (id) is a number, if not send a message to the client and return
        if (!Number.isInteger(_id)) {
            warn(`Bad request: id invalid`);
            res.status(400).json({ issue: 'id provided is invalid', solution: 'id needs to be an integer' });
            return;
        }

        // find the comment we want to delete by id and where user_id matches the current user
        info(`attempting to delete Comment with id: ${_id}`)
        const commentData = await Comment.destroy({
            where: {
                id: _id,
                user_id: req.session.user_id,
            },
        });
        // if we cant find the comment write a warning to the terminal and send a message back to the client
        if (!commentData) {
            warn(`No comment found with id: ${_id}`);
            res.status(404).json({ message: 'No Comment found with this id!' });
            return;
        }

        // we found the comment we want to delete, bye bye!
        log('comment deleted', 'green');
        res.status(200).json(commentData);
    } catch (err) {
        // we had an error somewhere, log the error and send a message back to the client
        error(err)
        res.status(500).json(err);
    }
});

module.exports = router;
