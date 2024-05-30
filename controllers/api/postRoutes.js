const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');
const { log, info, warn, error } = require('@frenzie24/logger')

router.post('/', withAuth, async (req, res) => {
    info('attempting new Post')
    log(req.body);
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        log('Post created.', 'green')
        res.status(200).json(newPost);
    } catch (err) {
        warn('We ran into an error:')
error(err);
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    const _id = req.params.id;
    info(`attempting to delete Post with id: ${_id}`)
    try {
        const postData = await Post.destroy({
            where: {
                id: _id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {

            warn(`No Post found with id: ${_id}`);
            res.status(404).json({ message: 'No project found with this id!' });
            return;
        }
        log('Post deleted', 'green');
        res.status(200).json(postData);
    } catch (err) {
        warn('We ran into an error:')
error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
