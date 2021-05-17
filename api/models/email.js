const nodemailer = require('nodemailer');

// constructor
const eMail = function (email) {
    this.email = email.email;
    this.password = email.password;
}

eMail.sent = (mailData, result) => {
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_id,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_FROM,
        to: `${mailData.email}`,
        subject: 'Your Account Password',
        html: `Auto generator Password: ${mailData.password}`
    }

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = eMail;