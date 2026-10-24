const connection=require('./connection')
const mongoose = require('mongoose');

try{
    const UserSchema = new mongoose.Schema({
        Name:String,
        Email:String,
        Password:String,
        Number:Number,
        Contact:{
            Room:String,
            Email:String,
            Name:String
        }
        ,
        FoundItem:[{
            ItemId:String,
        }]
        ,
        Points:{
            type:Number,
            default:0
        },
        NoOfFound:{
            type:Number,
            default:0
        },
        NoOfLost:{
            type:Number,
            default:0
        },
        MoneyEarn:{
            type:Number,
            default:0
        }
      
      });
      
      
      // Create the User model
      const UserModel = connection.model('userdata', UserSchema);
      console.log("connected",UserModel);
      
      // Export the User model
      module.exports = {UserModel};

}catch(error){
    console.log("Error in Usermodel:-\n",error)
}