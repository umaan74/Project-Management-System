// Purpose: kaunsa user kis organization ka member hai aur us organization mein uska role kya hai.
import mongoose from 'mongoose';
 
const organizationMember_Schema=new mongoose.Schema({
    organizationId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId
    },
    userId:{
        type:String,
    }
})