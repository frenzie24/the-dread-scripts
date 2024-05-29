const { log } = require('@frenzie24/logger')
const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    
    res.status(400).redirect('/login');
    return;
  }
  log(res)
   if (req.session.user_id == "undefined") {

    res.status(400).redirect('/login');
    return;
  }
  else {
    next();
  }
};

module.exports = withAuth;
