const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const { log, info, warn, error } = require('@frenzie24/logger')

router.post('/', withAuth, async (req, res) => {
    info('attempting new comment')
    try {

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

router.delete('/:id', withAuth, async (req, res) => {

    try {
        const _id = Math.floor(req.params.id);
        if (!Number.isInteger(_id)) {
            warn(`Bad request: id invalid`);
            res.status(400).json({ issue: 'id provided is invalid', solution: 'id needs to be an integer' });
            return;
        }

        info(`attempting to delete Comment with id: ${_id}`)
        const commentData = await Comment.destroy({
            where: {
                id: _id,
                user_id: req.session.user_id,
            },
        });
        if (!commentData) {
            warn(`No comment found with id: ${_id}`);
            res.status(404).json({ message: 'No Comment found with this id!' });
            return;
        }

        log('comment deleted', 'green');
        res.status(200).json(commentData);
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
});

module.exports = router;
