const express=require('express')
const app=express()
const cors=require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const http=require('http')

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



const registerroute=require('./routers/RegisterRouter')
const loginrouter=require('./routers/LoginRouter')
const dashboardrouter=require('./routers/DashboardRouter')
const setupSocket=require('./chat/ChatSocket')


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
setupSocket(io)


app.get('/',()=>{
    console.log("joshua")
    

})

app.use('/registration',registerroute)
app.use('/login',loginrouter)
app.use('/dashboard',dashboardrouter)

server.listen(3000,'0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
  })