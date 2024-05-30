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
        }
      ],
    });

    // Serialize data so the template can read it
    const posts = postsData.map((post) => post.get({ plain: true }));

    log(posts)
    // Pass serialized data and session flag into template
    let nextPostID = 0;

    posts.forEach(post => nextPostID = post.id > nextPostID ? post.id : nextPostID)
    log(nextPostID + 1);

   return res.render('homepage', {
      posts,
      nextPostID: nextPostID,
      curernt_user_id: req.session.user_id,
      logged_in: req.session.logged_in
    });
  } catch (err) {
   return  handleError(err, req.session.logged_in, res);
  }
});

router.patch('/post', withAuth, async (req, res) => {
  log('============================');
  log(`updating post id: ${req.body.id}`);
  log(req.body, 'red', 'bgWhite');
  log(req.body.content)

  try {
    const _id = Math.floor(req.query.id);
    if (!Number.isInteger(_id)) {
      warn(`Bad request: id invalid`);
      return res.status(400).json({ issue: 'id provided is invalid', solution: 'id needs to be an integer' });

    }
    const post = await Post.findByPk(_id)

    post.title = req.body.title;
    post.content = req.body.content;
    post.save();
    return res.status(200).redirect(`/post?id=${req.body.id}`);

  } catch (err) {
    handleError(err, req.session.logged_in, res);
  }
});

router.patch('/comment', withAuth, async (req, res) => {
  log('============================');
  info(`updating comment id: ${req.query.id}`);
  log(req.body, 'red', 'bgWhite');
  // log(req.body.content)

  try {

    const _id = Math.floor(req.query.id);
    if (!Number.isInteger(_id)) {
      warn(`Bad request: id invalid`);
     return handleError(err, req.session.logged_in, res);

    }
    const comment = await Comment.findByPk(_id)

    comment.content = req.body.content;
    comment.save();
    return res.status(200);

  } catch (err) {
    return handleError(err, req.session.logged_in, res);
  }
});

// navs to post and gets data from associated id
router.get('/post/', async (req, res) => {

  try {
    const _id = Math.floor(req.query.id);
    log(`id: ${_id}`);
    // if _id is not an integer then exit 
    if (!Number.isInteger(_id)) {
      warn(`Bad request: id invalid`); handleError(err, req.session.logged_in, res);
    
    }
    // find the post by id, include related comments and related user's name attribute

    info(`Attempting to retrieve post with id: ${_id}`)
    const postData = await Post.findByPk(_id, {
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        }, {
          model: Comment,
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
      ],
    });

    const post = postData.get({ plain: true });

    log(req.session.logged_in)


    for (let i = 0; i < post.Comments.length; i++) {
      post.Comments[i].current_user_id = req.session.user_id;
    }

    log(['post:', post, 'comments:', post.Comments], ['brightMagenta', 'magenta'], 'none');
    const loggedIn = req.session.logged_in;
    post.current_user_id = req.session.user_id;
    //  log([currentUserId, typeof currentUserId], 'magenta')
    //   let current_user_id = currentUserId ? currentUserId : -1;
    // render the post page
    await res.render('post', {
      post,
      //   current_user_id: current_user_id,
      logged_in: loggedIn,
    });
  } catch (err) {
    // we had an eror log the error and send a message to the client
    return handleError(err, req.session.logged_in, res);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Post, include: [{ model: Comment }]
      }]
    });

    const user = userData.get({ plain: true });
    log(user.Posts);
    res.render('dashboard', {
      ...user,
      logged_in: true,
      dashboard: true
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    info(`User is already logged in.`)
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

const handleError = (err, logged_in, res) => {
  warn('We ran into an error:')
  error(err);
  if (logged_in) {
    return res.render('dashboard', {
      ...user,
      logged_in: true,
      dashboard: true
    });
  } else return res.render('login');

}

module.exports = router;
