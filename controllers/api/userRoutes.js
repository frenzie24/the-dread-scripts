const router = require('express').Router();
const { User } = require('../../models');
const {info, warn, log, error} = require('@frenzie24/logger');
router.post('/', async (req, res) => {
  console.log('attempting registration')
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      log('user registered', 'green')
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// handles logging in
router.post('/login', async (req, res) => {
  info('attempting log in')
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
   
    if (!userData) {
      warn(`userData is undefinded`)
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    // check the password, if submitted password does not match stored hash password for user then exit
    if (!validPassword) {
      error(`invalid password attempt;`)
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    log('Login success.', 'brightGreen', 'bgBlack' );
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      log(`User: ${userData.name} has logged in.`);
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    warn('We ran into an error:')
error(err);;
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      log('Log out success');
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
