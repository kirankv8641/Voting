const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define the person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save', async function() {
    const user = this;

    //Hash the password only if it has been modified (or is new)
    if (!user.isModified('password')) return ;
    try {
        //hash password generation
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashPassword = await bcrypt.hash(user.password, salt);

        //replace the plain text password with the hashed one
        user.password = hashPassword;
    } catch (err) {
        console.log('BCRYPT ERROR:', err);
        throw err;
    }
});

userSchema.methods.comparePassword=async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}
const User = mongoose.model('User', userSchema);
module.exports = User;