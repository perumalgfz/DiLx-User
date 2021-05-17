module.exports = app => {
    const user = require("../controllers/user.controller.js");
    const { checkToken } = require("../helper/token_validation");
    const { validateLogin, validateForgotPwd, validateFormData } = require('../helper/valitation');

    app.get("/", user.login);

    app.post("/check", validateLogin, user.loginCheck);

    app.get("/logout", user.logout);

    app.get("/forgot", user.forgotPwd);

    app.post("/newpwd", validateForgotPwd, user.generateNewPwd);

    // Find/Retrieve all Users
    app.get("/user", checkToken, user.findAll);
    // app.get("/user", user.findAll);
    
    app.get("/user/:sort", checkToken, user.findAll2);

    app.get("/add", user.add);

    // Create a new User
    app.post("/user/add", user.insert);

    app.get("/edit/(:id)", checkToken, user.edit);

    app.post("/update/(:id)", checkToken, user.update);

    // Retrieve a single User with userId
    app.get("/find/:id", checkToken, user.findOne);

    // Delete a user
    app.get("/user/delete/:id", checkToken, user.delete);
    // app.delete("/user/:id", checkToken, user.delete);

};