const jwt = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {        
        token = globalJwtToken; // global token

        if (token) {

            jwt.verify(token, "wo+~PPEy&Kdc[Zw", (err, user) => {
                console.log('Token Err:' +err)
                if (!err) {

                    req.user = user;
                    next();
                } else {
                    // console.log('Token Available::')                    
                    req.flash('error', 'User is not authenticated, please relogin');                    
                    res.redirect('/');
                }                
            });
        } else {
            // there is not token.
            req.flash('error', 'Access denied! unauthorised user.');                    
            res.redirect('/');
        }
    }
}