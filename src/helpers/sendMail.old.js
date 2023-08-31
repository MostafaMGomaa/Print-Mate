const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

module.exports = (user, res) => {
  const link = `http://localhost:${process.env.PORT}/api/v1/users/reset-Password/${user.id}/${user.passwordResetToken}`;
  const msg = {
    from: process.env.EMAIL_NAME,
    to: user.email,
    subject: 'printMate',
    html: `<div><center>
             <p>Hello ${user.email}</p>
             <h3> you can reset your password by clicking the link below </h3> 
             <a href ='${link}'>Reset Password</a>
             <p>Your link is active for 45 minutes. After that, you will need to resend the link to your email</p>
             </div></center>
           `,
  };
  sgMail
    .send(msg)
    .then(
      res
        .status(201)
        .json({ message: 'reset password link has been sent to your email' })
    )
    .catch((err) => console.log(err));
};
