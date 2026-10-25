const router = require("express").Router();
const DashboardController = require("../controllers/DashboardController");
const authentication=require('../middleware/authentication')
const upload=require('../middleware/upload')

router.get('/getuserlostdata',authentication,async(req,res)=>{
    await DashboardController.getUserLostData(req,res)
})

router.get('/getuserfounddata',authentication,async(req,res)=>{
    await DashboardController.getUserFoundData(req,res)
})

router.get('/getuserdata',authentication,async(req,res)=>{
    await DashboardController.getUserData(req,res)
})

router.get('/getlostitems',authentication,async(req,res)=>{
    await DashboardController.getLostItems(req,res)
})

router.get('/getfounditems',authentication,async(req,res)=>{
    await DashboardController.getFoundItems(req,res)
})

router.post("/additems",authentication,upload.array("images", 4),
    (req, res) => DashboardController.addItem(req, res)
);

router.post('/changestate',authentication,async(req,res)=>{
    await DashboardController.ChangeState(req,res)
})

router.post('/addfriend',authentication,async(req,res)=>{
    await DashboardController.addFriend(req,res)
})

router.post('/foundItem',authentication,async(req,res)=>{
    await DashboardController.FoundItem(req,res)
})

router.post('/claimItem',authentication,async(req,res)=>{
    await DashboardController.ClaimItem(req,res)
})

router.get('/getitem/:postId',authentication,async(req,res)=>{
    await DashboardController.getItem(req,res)
})

router.delete('/deleteitem/:id',authentication,async(req,res)=>{
    await DashboardController.deleteItem(req,res)
})

router.get('/getuserachievements',authentication,async(req,res)=>{
    await DashboardController.getUserAchievements(req,res)
})

module.exports=router;