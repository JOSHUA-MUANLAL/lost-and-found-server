const { UserModel } = require("../database/UserSchema");
const { ItemModel } = require("../database/ItemSchema");
const bcrypt=require('bcrypt')
const secretKey = 'joshua';

class DahboardController{
    async getUserLostData(req,res){
        try{
            let userEmail=req.userdetail.email;
            let result=await ItemModel.find({PostBy:userEmail,Type:'lost'});
            if(result){
                console.log("User Items Found");
                res.status(202).json(result);
            }else{
                console.log("No Item Found")
                res.status(404).json({message:"No User Item Found"})
            }


        }catch(error){
            console.log('Failed to get User data');
        }
    }

     async getUserFoundData(req,res){
        try{
            let userEmail=req.userdetail.email;
            let result=await ItemModel.find({PostBy:userEmail,Type:'found'});
            if(result){
                console.log("User Items Found");
                res.status(202).json(result);
            }else{
                console.log("No Item Found")
                res.status(404).json({message:"No User Item Found"})
            }


        }catch(error){
            console.log('Failed to get User data');
        }
    }

    async getLostItems(req,res){
        try{
            console.log("getting items")
            let userEmail=req.userdetail.email;
            let result=await ItemModel.find({PostBy:{$ne:userEmail},State:false,Type:'lost'});
            if(result){
                
                res.status(200).json(result);
            }


        }catch(error){
            console.log(`failed to get item :- ${error}`)
        }
    }

    async getFoundItems(req,res){
        try{
            console.log("getting found items")
            let userEmail=req.userdetail.email;
            let result=await ItemModel.find({PostBy:{$ne:userEmail},State:false,Type:'found'});
            if(result){
                
                res.status(200).json(result);
            }else{
                res.status(404).json({message:"no item found"})
            }


        }catch(error){
            console.log(`failed to get item :- ${error}`)
        }
    }

    async getItem(req,res){
        try{
            const postId=req.params.postId;
           
            const result=await ItemModel.findOne({_id:postId});
            if(result){
                res.status(200).json(result)
            }else{
                res.status(404).json({message:"Failed to get post data"})
            }

        }catch(error){
            console.log(`Failed to get item ${error}`)
            return res.status(500).json({
            message: "Failed to fetch item"
        });
        }
    }

    async addItem(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const userEmail = req.userdetail.email;
        console.log(userEmail)

        const {
            title,
            description,
            reward,
            type,
            status,
            latitude,
            longitude
        } = req.body;

        if (!title || !description || !type || !latitude || !longitude) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        if (!["lost", "found"].includes(type)) {
            return res.status(400).json({
                message: "Invalid item type"
            });
        }

        const images = (req.files || []).map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));

        if (images.length === 0) {
            return res.status(400).json({
                message: "Please upload at least one image"
            });
        }

        const otp=Math.floor(100000+Math.random()*900000)

        

        const newItem = new ItemModel({
            ItemName: title,
            Description: description,
            PostBy: userEmail,
            Type: type,
            Prize: Number(reward),
            State: false,
           

            Location: [latitude,longitude],

            Image:images,
            OTP:otp
        });

        console.log(newItem)

        await newItem.save();

        return res.status(200).json({
            message: "Item added successfully"
        });

    } catch (error) {
        console.log("Failed to add items:", error);

        return res.status(500).json({
            message: "Failed to add item"
        });
    }
}

    async FoundItem(req,res){
        try{
            const userEmail=req.userdetail.email;
            const itemID=req.body.id;
            const otp=req.body.Otp;
            const item=await ItemModel.findById({_id:itemID})

            if(!item){
                res.status(404).json({message:'Couldnt find item'})
            }

            if(item.OTP!=Number(otp)){
                res.status(404).json({message:'Invalid otp'})
            }

            item.State=true;
            item.FoundBy.Email=userEmail;
            item.FoundBy.Name=req.userdetail.name;
            item.OTP=undefined;
            item.save()

            const user = await UserModel.findOneAndUpdate(
                {Email:userEmail},
                {
                    $push: {
                    FoundItem: {
                        ItemId: itemID
                    }
                    },
                    $inc: {
                    Points: 6
                    }
                },
                { new: true }
                );

                if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
                }

            return res.status(200).json({
                message: 'Item updated successfully',
                item
            });



        }catch(error){
            console.log('failed to change state');
            res.status(404).json({message:"Failed to change state"})
        }
    }

    async ClaimItem(req,res){
        try{
            const userEmail=req.userdetail.email;
            const itemID=req.body.id;
            const otp=req.body.Otp;
            const item=await ItemModel.findById({_id:itemID})

            if(!item){
                console.log('Couldnt find item')
                res.status(404).json({message:'Couldnt find item'})
            }

            if(item.OTP!=Number(otp)){
                console.log(`${item.Type}!=${otp}`)
                console.log('Invalid otp')
                res.status(404).json({message:'Invalid otp'})
            }

            item.State=true;
            item.FoundBy.Email=item.PostBy;
            const result=await UserModel.findOne({Email:item.PostBy})
            item.FoundBy.Name=result.Name;
            item.OTP=undefined;
            item.save()

            const user = await UserModel.findOneAndUpdate(
                {Email:item.PostBy},
                {
                    $push: {
                    FoundItem: {
                        ItemId: itemID
                    }
                    },
                    $inc: {
                    Points: 3
                    }
                },
                { new: true }
                );

                if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
                }

            return res.status(200).json({
                message: 'Item updated successfully',
                item
            });



        }catch(error){
            console.log(`'failed to change state'${error}`);
            res.status(404).json({message:"Failed to change state"})
        }
    }

   
async addFriend(req, res) {
    try {
        console.log('adding friend')
        const userEmail = req.userdetail.email;
        const femail = req.body.email;
        console.log(`create room for ${userEmail} and ${femail}`)

        if (userEmail === femail) {
            return res.status(400).json({
                message: "You cannot add yourself"
            });
        }

        const user1 = await UserModel.findOne({
            Email: userEmail
        });

        const user2 = await UserModel.findOne({
            Email: femail
        });

        if (!user1 || !user2) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check whether they already have each other as contacts
        const user1HasUser2 =
            user1.Contact?.Email === user2.Email;

        const user2HasUser1 =
            user2.Contact?.Email === user1.Email;

        if (user1HasUser2 && user2HasUser1) {
            console.log('already Friends')
            return res.status(202).json({
                message: "Already friends",
                contact: {
                    email: user2.Email,
                    name: user2.Name,
                    room: user1.Contact.Room
        }
    });
        }

        // Generate the same room ID for both users
        const room = [user1.Email, user2.Email]
            .sort((a, b) => a.localeCompare(b))
            .join("_");

        // Save each other's contact details
        user1.Contact = {
            Email: user2.Email,
            Name: user2.Name,
            Room: room
        };

        user2.Contact = {
            Email: user1.Email,
            Name: user1.Name,
            Room: room
        };

        await Promise.all([
            user1.save(),
            user2.save()
        ]);
        console.log(' Friends success')

        return res.status(200).json({
            message: "Friend added successfully",
             contact: {
        email: user2.Email,
        name: user2.Name,
        room
    }
        });

    } catch (error) {
        console.error("Failed to add friend:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async deleteItem(req,res){
    try{
        const pw=req.body.pw;
        const id=req.params.id;
        const userEmail=req.userdetail.email;

        const result=await UserModel.findOne({Email:userEmail});
        if(result){

            let compare=await bcrypt.compare(pw,result.Password);
            if(compare){
                const item=await ItemModel.findOneAndDelete({_id:id,PostBy:userEmail})
                if(item){
                    res.status(200).json({message:"Item Deleted Success"})
                }else{
                    res.status(404).json({message: "Item not found or unauthorized"})
                }
            }else{
                res.status(404).json({message:'password doesnt match'})
            }
            
        }


    }catch(error){
        console.log(error);
        res.status(404).json({message:"failed to delete"})
    }
}





}

module.exports= new DahboardController;