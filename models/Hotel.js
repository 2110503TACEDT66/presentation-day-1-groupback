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
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        set: (val) => parseFloat(val.toFixed(1))
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

HotelSchema.virtual('stars').get(function() {
    const rating = parseFloat(this.rating);
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let starsRepresentation = "★".repeat(fullStars);
    if (halfStar) {
        starsRepresentation += "✬";
    }
    starsRepresentation += "☆".repeat(emptyStars);
    return starsRepresentation;
});



module.exports = mongoose.model('Hotel',HotelSchema);