const router = require("express").Router();
const LoginController = require("../controllers/LoginController");
const authentication=require('../middleware/authentication')

router.post('/login',async(req,res)=>{
    await LoginController.UserLogin(req,res)
})

module.exports=router;