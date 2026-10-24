const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const { UserModel } = require('../database/UserSchema');
const secretKey = 'joshua';
class LoginController{

    async UserLogin(req,res){
        try{
            console.log("Loging in...");
            const Email=req.body.email;
            const Password=req.body.password;
            let result=await UserModel.findOne({Email:Email});
            if(result){
                console.log("User Found...");
                let compare=await bcrypt.compare(Password,result.Password);
                if(compare){
                    const userPayload={
                        name:result.Name,
                        email:result.Email
                    }
                    
                    const token = jwt.sign(userPayload, secretKey);
                    console.log("Token signed...");
                    res.status(200).json({token})
                    
                }else{
                    console.log("Incorrect Password...")
                    res.status(404).json({message:"Incorrect Password"})
                }
            }else{
                console.log("User not found...")
                res.status(404).json({message:"User Not Found"})
            }

        }catch(error){

        }
    }


}

module.exports=new LoginController;