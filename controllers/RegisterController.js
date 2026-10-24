const { UserModel } = require("../database/UserSchema");
const sendmail=require('../middleware/sendmail')
const secretKey = 'joshua';
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');

class RegisterController{
    otpStore={};

    async GenerateOtp(req,res){
        try{
            const userEmail=req.body.email;
            const userName=req.body.username;
            let find=await UserModel.findOne({Email:userEmail})
            if(find){
                console.log("User is Already Registered...");
                re.status(404).jon({message:"Already Regitered"})
            }else{
                const otp=Math.floor(100000+Math.random()*900000)
                this.otpStore[userEmail]={
                otp,
                expires:Date.now()+5*60*1000
                }
                let mailOptions={
                                        from:{
                                            name:'Findora',
                                            address:'joshua00521202021@msijanakpuri.com'
                                        },
                                        to:userEmail,
                                        subject:'One time Password',
                                        text:'OTP',
                                        html:`<b>Welcome! User ${userName}<br> Your OTP is ${otp}<br><br>Hope You will Love our webpage</b>`
                                              }
                
                sendmail(mailOptions)
                console.log(`otp is ${otp}`)
                res.status(200).json({message:"Otp Sent to email"})
            }

        }catch(error){
            console.log(`Failed to generate OTP-${error}`);
            res.status(404).json({message:"Failed to Generate otp"})
        }

    }

    async verifyOtp(req,res){
        try{
            const {email,otp}=req.body;
            const data=this.otpStore[email];
            console.log(`${email} and ${otp}`)
            console.log(this.otpStore)
            if(!data){
                console.log("Otp not found...")
                return res.status(404).json({message:"OTP NOT FOUND"});
                
            }
            if(Date.now()>data.expires){
                console.log("Otp expires...")
                delete this.otpStore[email];
                return res.status(404).json({message:"Otp expired"})
            }

            if(Number(otp)!==data.otp){
                console.log('Otp Incorrect')
                return res.status(404).json({message:"Incorrect OTP"})
            }

            delete this.otpStore[email]
            res.status(200).json({message:"OTP verified"})

        }catch(error){
            console.log(error)
            res.status(404).json({message:"Failed to verify OTP"})
        }
    }

    async RegisterUser(req,res){
        try{
            
            const userEmail=req.body.email;
            const userName=req.body.username;
            const userPassword=req.body.password;
            



            let find=await UserModel.findOne({Email:userEmail});
            if(find){
                console.log("User Exist");
                res.status(404).json({message:"user existed"})
            }else{
                 console.log("reached here also 2")
                const saltRounds=10;
                const hashedPassword=await bcrypt.hash(userPassword, saltRounds)
                const user=new UserModel({ Email:userEmail,
                                            Name: userName,
                                            Password:hashedPassword,})
                             user.save()
                                .then(result=>{
                                    console.log("user data saved")
                                    let mailOptions={
                                        from:{
                                            name:'Findora',
                                            address:'joshua00521202021@msijanakpuri.com'
                                        },
                                        to:userEmail,
                                        subject:'Registration Complete',
                                        text:'Registration Complete',
                                        html:`<b>Welcome! User ${userName}<br> Thank you For Registering With Us</b>`
                                              }
                                      sendmail(mailOptions)
                                    res.status(200).json({message:'user Registered'})
                                })
                                .catch(error=>{
                                    console.log(error)
                                    res.status(404).json({message:error})
                                })   



            }



        }catch(error){
            res.status(404).json({message:"Failed to regiter"});
        }
    }
}

module.exports=new RegisterController;