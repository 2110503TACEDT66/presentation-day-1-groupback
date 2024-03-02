const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please add a name'],
        unique:true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required:[true,'Please add a address']
    },
    district:{
        type: String,
        required:[true,'Please add a district']
    },
    province:{
        type: String,
        required:[true,'Please add a province']
    },
    postalcode:{
        type: String,
        required:[true,'Please add a postalcode'],
        maxlength:[5,'Postal code can not be more than 5 digits']
    },
    tel:{
        type: String,
    },
    region:{
        type: String,
        required:[true,'Please add a region']
    }
},
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
);

//Cascade delete bookings when a hotel is deleted
HotelSchema.pre('deleteOne',{document:true , query : false},async function(next){
    console.log(`Bookings being removed from hotel ${this._id}`);
    await this.model('Booking').deleteMany({hotel:this._id});
    next();
});

//Reverse populate with virtuals
HotelSchema.virtual('bookings',{
    ref:'Booking',
    localField:'_id',
    foreignField:'hotel',
    justOne:false
});



module.exports = mongoose.model('Hotel',HotelSchema);