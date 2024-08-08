import mongoose,{Schema,Document} from 'mongoose';

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message []
}

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"invalid username"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"invalid email"],
        unique:true,
        match:[/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"invalid password"]
    },
    verifyCode:{
        type:String,
        required:[true,"verification code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verification code expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})
const UserModel=(mongoose.models.User as mongoose.
    Model<User>)||mongoose.model<User>('User',UserSchema)

export default UserModel