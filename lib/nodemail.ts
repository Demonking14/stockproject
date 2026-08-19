import nodemail from 'nodemailer'

export const transporter = nodemail.createTransport({
    service:'gmail',
    auth:{
         user:process.env.GOOGLE_USER!,
         pass:process.env.GOOGLE_APP_PASSWORD
    }
});