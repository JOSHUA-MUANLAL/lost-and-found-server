const { JsonWebTokenError } = require("jsonwebtoken");
const { UserModel } = require("../database/UserSchema");
const {ChatModel}=require('../database/ChatSchema')
const jwt = require('jsonwebtoken');

const onlineUsers = new Map();
const messages = new Map();

function userRoom(userId) {
  return `user_${userId}`;
}

function getRoom(email1,email2){
    return [email1,email2].sort().join('_')
}

function setupSocket(io){
   

    io.on('connection',(socket)=>{
        console.log(`User Connected ${socket.id}`)
        
        socket.on('login',(email)=>{
            socket.join(userRoom(email))
        })

        socket.on('joinChat',async({email,friendEmail})=>{
            const room=getRoom(email,friendEmail)
            console.log(`Join room for ${email} and ${friendEmail}`)
            socket.join(room)

            const messages=await ChatModel.find({Room:room}).sort({createddAt:1}).limit(100).lean();
            console.log(`message history ${messages}`)
            socket.emit('chatHistory',messages)

        })


        socket.on('get_contact',async(email)=>{
            try{
                
                const Contact=await UserModel.findOne({Email:email}).select('Contact');
                if(Contact){
                    
                   socket.emit('got_contact',Contact.Contact)
                }else{
                    console.log("not found friends")
                    socket.emit('error',{
                        msg:'No Contact Found'
                    })
                }

            }catch(error){
                console.log(error);
            }
        })

        socket.on('send_message',async(data)=>{
            const {sender,reciever,room,message}=data;
            console.log(`room :- ${room}\nReciever :${reciever}\nsender:- ${sender}\nmessage:-${message}`)
            try{
                
                const savedMessage=await ChatModel.create({
                    Room:room,
                    Sender:sender,
                    Reciever:reciever,
                    message:message
                })

                io.to(room).emit('recieve_message',savedMessage)
                io.to(userRoom(reciever)).emit('new_notification',savedMessage)

            }catch(error){
                console.log(error)
            }
        })

        socket.on('send_post_message',async(data)=>{
            try {
                const {sender,reciever,room,postId}=data;
                const savedMessage=await ChatModel.create({
                    Room:room,
                    Sender:sender,
                    Reciever:reciever,
                    msgType:'post',
                    postId:postId
                })

                io.to(room).emit('recieve_message',savedMessage)
                io.to(userRoom(reciever)).emit('new_notification',savedMessage)
            } catch (error) {
                console.log(error)
                
            }
        })

        
    })





}

module.exports=setupSocket;