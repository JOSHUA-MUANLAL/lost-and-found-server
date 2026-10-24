const connection=require('./connection')
const mongoose = require('mongoose');

try{
    const ItemSchema = new mongoose.Schema({
        ItemName:String,
        
        Type:String,
        Description:String,
        
        PostBy:String,
        Prize:Number,
        State:{
            type:Boolean,
            default:false
        },
        Location:[Number],
        Image:[{
            data: Buffer,
            contentType: String
            }],
        CreatedAt: {
            type: Date, 
            default: Date.now
            },
        FoundBy:{
            Name:{
                type:String,
            default:''
            },
            Email:{
                type:String,
            default:''
            }
        },
        OTP:{
            type:Number
        }
      
      });
      
      

      const ItemModel = connection.model('itemdata', ItemSchema);
      console.log("connected",ItemModel);
      
      
      module.exports = {ItemModel};

}catch(error){
    console.log("Error in Usermodel:-\n",error)
}