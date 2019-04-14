const sendGrid = require('sendgrid')(process.env.SENDGRID_API_KEY)

module.exports = {
  sendEmail: (email, subject, body) => {
    
    let request = sendGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
          personalizations: [
            {
              to: [
                {
                  email: email,
                },
              ],
              subject: subject,
            },
          ],
          from: {
            email: 'gamerone.1.2018@gmail.com',
          },
          content: [
            {
              type: 'text/plain',
              value: body,
            },
          ],
        }
      })

    sendGrid.API(request)
      .then(response => {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
      })
      .catch(error => {
        console.log(error.response.statusCode);
        console.log(error.response.body.error[0]);
      });
  }
}