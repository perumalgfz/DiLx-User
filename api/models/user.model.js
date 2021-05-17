const sql = require("./db.js");
var generator = require('generate-password');
const eMail = require("../models/email.js");

var currnetDate = new Date().toISOString();

// constructor User
const User = function (user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.description = user.description;
    this.hobby = user.hobby;
    this.gender = user.gender;
    this.city = user.city;
    this.status = user.status;
    this.createdAt = currnetDate;
    this.updatedAt = currnetDate;
};

User.create = (newUser, hobbies, result) => {

    var hobbiesArray = Array.from(hobbies);

    sql.query("INSERT INTO user_tbl SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // console.log("User created: ", { id: res.insertId, ...newUser });
        var user_id = res.insertId;
        hobbiesArray.forEach(hobby => {
            const hobbiesData = {
                user_id: user_id,
                hobby: hobby
            }

            sql.query("INSERT INTO hobbies SET ?", hobbiesData, (err, res) => {

            });
        });

        return result(null, { userId: res.insertId, userEmail: res.email });
    });
};


User.updateById = (id, user, hobbies, result) => {
    const hobbiesArray = hobbies;

    var fields = "";
    Object.keys(user).forEach(key => {
        fields = fields.concat(`${key} =  '${user[key]}',`);
    });

    fields = fields.slice(0, -1);

    var query = `UPDATE user_tbl SET ${fields} WHERE id = ${id}`;

    sql.query(query, (err, res) => {
        if (err) {
            result({ kind: "MYQSLError" }, null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        hobbiesArray.forEach(hobby => {
            const hobbiesData = {
                user_id: id,
                hobby: hobby
            }
            sql.query("DELETE FROM hobbies WHERE user_id = ?", id, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return result(null, err);
                } else {
                    sql.query("INSERT INTO hobbies SET ?", hobbiesData, (err, res) => {

                    });
                }

            });
        });


        // console.log("updated User: ", { id: id, ...user });
        result(null, { id: id, ...user });
    });
}

User.findById = (userId, result) => {
    const query = `SELECT u.*, GROUP_CONCAT(h.hobby) as hobby FROM user_tbl u LEFT JOIN hobbies h ON u.id = h.user_id where u.id = ${userId} GROUP BY u.id `;
    // console.log(query);
    // sql.query(`SELECT * FROM user_tbl WHERE id = ${userId}`, (err, res) => {
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }

        if (res.length) {
            // console.log("found User: ", res[0]);
            return result(null, res[0]);
        }

        // not found User with the id
        result({ kind: "not_found" }, null);
    });
}

User.findByEmail = (userEmail, result) => {

    sql.query("SELECT * FROM user_tbl WHERE email = ? LIMIT 1", userEmail, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }

        if (res.length) {
            let id = res[0].id;
            let email = res[0].email;

            //Auto Password generator
            var password = generator.generate({
                length: 10,
                numbers: true
            });

            var query = `UPDATE user_tbl SET password = '${password}' WHERE id = ${id}`;
            sql.query(query, (err, res) => {
                if (err) {
                    return result(null, err);
                }

                if (res.affectedRows == 0) {
                    // not found User with the email
                    return result({ kind: "not_found" }, null);
                }
            });

            const mailData = {
                password: password,
                email: email,
            }
            //Sending email
            eMail.sent(mailData, (err, data) => {
                // console.log('Email Response Data:' + data.msg);
            });

            return result(null, res[0]);
        }
        // not found User with the id
        result({ kind: "not_found" }, null);
    });
}

User.getAll = result => {
    const query = " SELECT u.*, GROUP_CONCAT(h.hobby) as hobby FROM `user_tbl` u LEFT JOIN hobbies h ON u.id = h.user_id GROUP BY u.id ORDER BY u.id DESC";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("Users: ", res);
        result(null, res);
    });
}

User.getAll2 = (sortBy, result) => {
    const query = ` SELECT u.*, GROUP_CONCAT(h.hobby) as hobby FROM user_tbl u LEFT JOIN hobbies h ON u.id = h.user_id GROUP BY u.id ORDER BY u.${sortBy} `;
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}

User.remove = (id, result) => {
    sql.query("DELETE FROM user_tbl WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted User with id: ", id);
        result(null, res);
    });
}

User.loginValitation = (userData, result) => {

    const query = `SELECT * FROM user_tbl WHERE email = '${userData.email}' AND password = '${userData.password}' LIMIT 1`;

    sql.query(query, (error, results, fields) => {
        if (error) {
            console.log("error: ", error);
            return result(null, error);
        };
        // check if user exists
        if (!results || !results[0]) {
            console.log("No user::")
            return result({ kind: "Unauthorized" }, null);
        }

        // check if user active/not
        if (results[0].status == '0') {
            console.log("user account_inactive::")
            return result({ kind: "account_inactive" }, null);
        }
        console.log("user login Success")
        result(null, { id: results[0].id, name: results[0].firstname, email: results[0].email });
        return

    });
}

module.exports = User;