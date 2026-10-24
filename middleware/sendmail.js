const nodemailer = require("nodemailer");


const transporter=nodemailer.createTransport({
    service:"gmail",
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:'ciriktazumo@gmail.com',
        pass:'thxt rlqf hxuy llwt',
    },
    debug:true
});





const sendMail=async(mailOptions)=>{
    try{
        await transporter.sendMail(mailOptions)
        console.log("email sent")
    }catch(error){
        console.log(error)
    }
}



module.exports=sendMail