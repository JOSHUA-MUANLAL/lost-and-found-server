const connection=require('./connection')
const mongoose = require('mongoose');

try{
    const ChatSchema = new mongoose.Schema({
    Room: String,
    Sender: String,
    Reciever: String,

    message: {
        type: String,
        trim: true,
        maxlength: 5000,
        default: ""
    },

    msgType: {
        type: String,
        enum: ["text", "post"],
        default: "text"
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "itemdata",
        default: null
    },

    CreatedAt: {
        type: Date,
        default: Date.now
    },

    Read: {
        type: Boolean,
        default: false
    }
});
      
      
      
      const ChatModel = connection.model('chatdata', ChatSchema);
      console.log("connected",ChatModel);
      
      
      module.exports = {ChatModel};

}catch(error){
    console.log("Error in Chatmodel:-\n",error)
}