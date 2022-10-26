// var nodemailer = require('nodemailer');
import { createTransport } from 'nodemailer';

export const useNewConsultationNotif = ( sender, recipient ) => {
    const [recepient, setRecipient] = useState('')

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'kjqb4929@gmail.com',
            pass: 'ocvbmuyzwnweqgra'
        }
    })

    const mailStudent = {
        from: 'kjqb4929@gmail.com',
        to: `${recipient.}`,
        subject: 'Omsim',
        text: 'Badabida'
    }

    const mailTeacher = {
        from: 'kjqb4929@gmail.com',
        to: 'qkjqbaturiano@tip.edu.ph',
        subject: 'Omsim',
        text: 'Badabida'
    }
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}