const nodemailer = require("nodemailer");

const sendEmail = async(email,subject,text) => {
    try{
        const trans = nodemailer.createTransport({
            host : process.env.HOST,
            service: process.env.SERVICE,
            port : 587,
            secure : true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        await trans.sendMail({
            from : process.env.USER,
            to : email,
            subject,
            text
        });
        console.log("Email sent");
    }
    catch(error){
        console.log(error);
    }
};

module.exports = sendEmail;