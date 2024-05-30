const { warn, error } = require('@frenzie24/logger');
const handleError = (err, logged_in, res, next) => {
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

module.exports = handleError;