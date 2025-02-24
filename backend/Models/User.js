import Joi from 'joi'; 
import mongoose from 'mongoose'; 
const { Schema } = mongoose; 


const UserSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
});
const UserModel = mongoose.model('users',UserSchema);
export default UserModel;