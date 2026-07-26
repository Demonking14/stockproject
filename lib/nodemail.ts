import nodemail from 'nodemailer'

export const transporter = nodemail.createTransport({
    service:'gmail',
    auth:{
         user:process.env.GMAIL_USER!,
         pass:process.env.GMAIL_APP_PASSWORD
    }
});