const sgMail = require('@sendgrid/mail');

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

class Email {
  constructor(to, url) {
    this.from = process.env.EMAIL_FROM;
    this.to = to;
    this.url = url;
  }

  async send(msg) {
    try {
      return await sgMail.send(msg);
    } catch (error) {
      console.error(error);
      if (error.response) console.error(error.response.body);
    }
  }

  async welcome() {
    return await this.send({
      from: this.from,
      to: this.to,
      subject: 'Welcome in Print Mate',
      text: 'Welcome in print-mate',
      html: `<div><h1>Print Mate</h1><center><p>Welcome to our Family!</p></center></div>`,
    });
  }

  async restPassword() {
    return await this.send({
      from: this.from,
      to: this.to,
      subject: 'Password reset token',
      text: `Your password reset token is ${this.url} (valid for only 10 minutes)`,
      html: `<div><h1>Print Mate</h1>
                    <center>
                     <p>Your password reset token is ${this.url} (valid for only 10 minutes)</p>
                    </center>
            </div>`,
    });
  }
}

module.exports = Email;
