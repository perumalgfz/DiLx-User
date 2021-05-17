const User = require("../models/user.model.js");
var jwt = require('jsonwebtoken');
var flash = require('express-flash');
var generator = require('generate-password');
const eMail = require("../models/email.js");

const { check, validationResult } = require('express-validator');


exports.findAll = (req, res, next) => {
    User.getAll((err, data) => {

        if (err) {
            req.flash('error', err);
            // render to views/user/index.ejs
            res.render('user', { data: '' });
        } else {
            // render to views/user/index.ejs
            res.render('user', { data: data });
        }
    });
};

exports.findAll2 = (req, res, next) => {
    var sortBy = req.params.sort;
    console.log(sortBy)
    if (sortBy == "idA") {
        sortBy = "id ASC";
    } else if (sortBy == "idD") {
        sortBy = "id DESC";
    }
    if (sortBy == "fnameA") {
        sortBy = "firstname ASC";
    } else if (sortBy == "fnameD") {
        sortBy = "firstname DESC";
    }
    if (sortBy == "lnameA") {
        sortBy = "lastname ASC";
    } else if (sortBy == "lnameD") {
        sortBy = "lastname DESC";
    }
    if (sortBy == "gA") {
        sortBy = "gender ASC";
    } else if (sortBy == "gD") {
        sortBy = "gender DESC";
    }
    if (sortBy == "sA") {
        sortBy = "status ASC";
    } else if (sortBy == "sD") {
        sortBy = "status DESC";
    }

    User.getAll2(sortBy, (err, data) => {

        if (err) {
            req.flash('error', err);
            // render to views/user/index.ejs
            res.render('user', { data: '' });
        } else {
            // render to views/user/index.ejs
            res.render('user', { data: data });
        }
    });
};

//   Create and Save a new User:
exports.add = (req, res, next) => {
    var cityList = ["salem", "chennai", "madurai", "pune"];

    // render to add.ejs
    res.render('user/add', {
        firstname: '',
        lastname: '',
        email: '',
        description: '',
        city: cityList,
        gender: '',
        hobby: '',
        status: '',
    })
};

exports.insert = (req, res, next) => {

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let description = req.body.description;
    let gender = req.body.gender;
    let city = req.body.city;
    let status = req.body.status;

    let errors = false;

    if (firstname.length === 0 || lastname.length === 0 || email.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter firstname, lastname, email");
        var cityList = ["salem", "chennai", "madurai", "pune"];
        // render to add.ejs with flash message
        res.render('user/add', {
            firstname: firstname,
            lastname: lastname,
            email: email,
            city: cityList
        })
    }

    // if no error
    if (!errors) {

        //Auto Password generator
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        const mailData = {
            password: password,
            email: email,
        }

        eMail.sent(mailData, (err, data) => {
            // console.log('Email Response Data:' + data.msg);
        });

        var form_data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            description: description,
            gender: gender,
            city: city,
            status: status
        };

        const { hobby } = req.body;
        let hobbies = hobby;

        let isArray = Array.isArray(hobbies);
        if (isArray == false) {
            hobbies = [hobbies];
        }



        User.create(form_data, hobbies, (err, data) => {

            if (err) {
                req.flash('error', err);

                // render to add.ejs
                res.render('user/add', {
                    firstname: form_data.firstname,
                    lastname: form_data.lastname,
                    email: form_data.email,
                    description: form_data.description,
                    gender: form_data.gender,
                    city: form_data.city,
                    hobby: form_data.hobby,
                    status: form_data.status
                });
            } else {
                req.flash('success', 'User successfully added');
                res.redirect('/user');
            }
        });
    }
};

// Find a user with a userId
exports.findOne = (req, res, next) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found User id.`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving User id "
                });
            }
        } else res.send(data);
    });
};


//DELETE User By id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    User.remove(id, (err) => {
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/user')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/user')
        }
    });
};


exports.edit = (req, res, next) => {
    let id = req.params.id;
    User.findById(id, (err, data) => {

        if (err) throw err

        // if user not found
        if (data.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/user')
        }
        // if user found
        else {
            //console.log(data);
            var cityList = ["salem", "chennai", "madurai", "pune"];

            // render to edit.ejs
            res.render('user/edit', {
                title: 'Edit User',
                cityList: cityList,
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                description: data.description,
                gender: data.gender,
                hobby: data.hobby,
                city: data.city,
                status: data.status
            })
        }
    });
};

exports.update = (req, res, next) => {

    let id = req.params.id;

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let description = req.body.description;
    let gender = req.body.gender;
    let city = req.body.city;
    let status = req.body.status;

    let errors = false;

    if (firstname.length === 0 || lastname.length === 0 || email.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter firstname, lastname, email");
        var cityList = ["salem", "chennai", "madurai", "pune"];
        // render to add.ejs with flash message
        res.render('user/edit', {
            id: id,
            firstname: firstname,
            lastname: lastname,
            email: email,
            description: description,
            gender: gender,
            cityList: cityList,
            city: cityList,
            status: status,
            hobby: '',
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            description: description,
            gender: gender,
            city: city,
            status: status
        }

        const currnetDate = new Date().toISOString();
        // const currnetDate = now.slice(0, 19).replace('T', ' ');

        var updatedAt = {
            updatedAt: currnetDate
        }

        var userUpdate = Object.assign(form_data, updatedAt);

        const { hobby } = req.body;
        let hobbies = hobby;
        let isArray = Array.isArray(hobbies);
        if (isArray == false) {
            hobbies = [hobbies];
        }

        User.updateById(id, (userUpdate), hobbies, (err, data) => {

            if (err) {
                req.flash('error', err);

                // render to add.ejs
                res.render('user/edit', {
                    firstname: form_data.firstname,
                    lastname: form_data.lastname,
                    email: form_data.email,
                    description: form_data.description,
                    gender: form_data.gender,
                    city: form_data.city,
                    hobby: form_data.hobby,
                    status: form_data.status
                });
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/user');
            }


        });
    }
};

exports.login = (req, res, next) => {
    // render to login.ejs
    res.render('user/login', {
        email: '',
        password: '',
    })
};


exports.loginCheck = (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array()
        res.render('user/login', {
            alert
        })
    } else {
        // if no error
        let email = req.body.email;
        let password = req.body.password;

        var form_data = {
            email: email,
            password: password
        }

        User.loginValitation(form_data, (err, data) => {

            if (err) {
                globalJwtToken = '';
                if (err.kind == "Unauthorized") {
                    req.flash('error', 'Unauthorized User');
                } else if (err.kind == "account_inactive") {
                    req.flash('error', ' User account inactive, please contact your administrator');
                } else {
                    req.flash('error', err);
                }

                // render to login.ejs
                res.render('user/login', {
                    email: '',
                    password: '',
                });
            } else {
                console.log('Login Success...:')
                console.log(data)
                var token = jwt.sign(data, 'wo+~PPEy&Kdc[Zw', { expiresIn: '30m' });
                globalJwtToken = token;
                console.log('globalJwtToken:' + globalJwtToken);

                req.flash('success', 'User Login successfully');
                res.redirect('/user');
            }
        });
    }
};


exports.forgotPwd = (req, res, next) => {
    // render to login.ejs
    res.render('user/forgotpwd', {
        email: '',
        password: '',
    })
};

exports.generateNewPwd = (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array()
        res.render('user/forgotpwd', {
            alert
        })
    } else {
        // if no error
        let email = req.body.email;

        User.findByEmail(email, (err, data) => {
            if (err) {
                if (err.kind == "not_found") {
                    req.flash('error', 'Email not found');
                } else {
                    req.flash('error', err);
                }

                // render to forgotpwd.ejs
                res.render('user/forgotpwd', {
                    email: ' '
                });
            } else {
                req.flash('success', 'New password has been sent registered email');
                res.redirect('/');
            }
        });
    }
}

exports.logout = (req, res, next) => {
    // jwt.destroy(globalJwtToken);
    // render to login.ejs
    res.render('user/login', {
        email: '',
        password: '',
    })
};


