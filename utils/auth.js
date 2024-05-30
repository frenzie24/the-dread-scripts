const { info } = require('@frenzie24/logger')
const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    info('A user attempted an action that requires logging in. Redirecting to login view')
    res.render('/login');
    return;
  }
   if (req.session.user_id == "undefined") {
    
    info('A user attempted an action that requires logging in and their session has expired. Redirecting to login view')
    res.render('/login');
    return;
  }
  else {
    next();
  }
};

module.exports = withAuth;
