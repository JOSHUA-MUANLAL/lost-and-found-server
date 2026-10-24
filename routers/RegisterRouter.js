const router = require("express").Router();
const mongoose=require('mongoose');
const validate=require('../middleware/sendmail')
const authentication=require('../middleware/authentication')
const RegisterController=require('../controllers/RegisterController')

router.post('/generateOtp',async(req,res)=>{
    await RegisterController.GenerateOtp(req,res)
})

router.post('/verifyOtp',async(req,res)=>{
    await RegisterController.verifyOtp(req,res)
})

router.post('/RegisterUser',async(req,res)=>{
    console.log("reachedd here")
    await RegisterController.RegisterUser(req,res)
})

module.exports=router;