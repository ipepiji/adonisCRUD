var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');    //Need to send email for security reason

const user_email_service = 'gmail' //yahoo,gmail and etc

const user_email = 'adonismailtest@gmail.com';

const user_email_password = 'adonis12345';

var transporter = nodemailer.createTransport(smtpTransport({
    service: user_email_service,
    auth: {
      user: user_email,
      pass: user_email_password
    }
}));

module.exports = transporter