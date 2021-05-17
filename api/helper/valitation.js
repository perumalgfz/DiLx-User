const { check, validationResult } = require('express-validator');

exports.validateLogin = [
    check('email', 'Email is not valid/empty')
                .isEmail()
                .normalizeEmail(),
    check('password', 'Password is not valid/empty')
                .exists()
                .isLength({ min: 3})
];

exports.validateForgotPwd = [
    check('email', 'Email is not valid/empty')
                .isEmail()
                .normalizeEmail(),
];

// exports.validateFormData = [
//     check('firstname', 'First Name is not valid/empty')
//                 .exists()
//                 .isLength({min: 3}),
//     check('email', 'Email is not valid/empty')
//                 .isEmail()
//                 .normalizeEmail(),
//     check('password', 'Password is not valid/empty')
//                 .exists()
//                 .isLength({ min: 3})
// ];

