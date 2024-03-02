const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please add a name']
    },
    tel:{
        type: String,
        required:[true,'Please add a phone number']
    },
    email:{
        type: String,
        required:[true,'Please add a email'],
        unique : true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,33}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3,}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[],
        minlength:6,
        select : false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
},
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
);

//Encrypt password using bcrypt
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});

//Cascade delete bookings when a user is deleted
UserSchema.pre('deleteOne',{document:true , query : false},async function(next){
    console.log(`Bookings being removed from user ${this._id}`);
    await this.model('Booking').deleteMany({user:this._id});
    next();
});

//Reverse populate with virtuals
UserSchema.virtual('mybookings',{
    ref:'Booking',
    localField:'_id',
    foreignField:'user',
    justOne:false
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


module.exports = mongoose.model('User',UserSchema);