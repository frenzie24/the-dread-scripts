const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const { log, info, warn, error } = require('@frenzie24/logger');

router.get('/', async (req, res) => {
  log('Homepage request');
  try {
    // Get all posts and JOIN with user data and comments
    const postsData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        }, {
          model: Comment
        },
      ],
    });
    // we need to get comments here as well: refer to previous homework
    // Serialize data so the template can read it
    const posts = postsData.map((post) => post.get({ plain: true }));
    log(posts)
    // Pass serialized data and session flag into template
    res.render('homepage', {
     posts, 
      logged_in: req.session.logged_in
    });
  } catch (err) {
    error(err);
    res.status(500).json(err);
  }
});

// navs to post and gets data from associated id
router.get('/post/:id', async (req, res) => {

  try {
    const _id = Math.floor(req.params.id);
    if (!Number.isInteger(_id)) {
      warn(`Bad request: id invalid`);
      res.status(400).json({ issue: 'id provided is invalid', solution: 'id needs to be an integer' });
      return;
    }
    info(`Attempting to retrieve post with id: ${_id}`)
    const postData = await Post.findByPk(_id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        }, {
          model: Comment
        },
      ],
    });

    const post = postData.get({ plain: true });
    log(post.Comments)//, ['white', 'brightBlue'], ['bgBrightBlue', 'bgWhite'])
    res.render('post', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    error(err);
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    info(`User is already logged in.`)
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
