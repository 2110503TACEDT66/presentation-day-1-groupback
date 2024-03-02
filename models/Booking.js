const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    /*bookingDate:{
        type:Date,
        required:true
    },*/
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.checkIn; // Ensures checkOut is greater than checkIn
            },
            message: 'Check-out date must be after check-in date'
        }
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    hotel:{
        type:mongoose.Schema.ObjectId,
        ref:'Hotel',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Booking',BookingSchema);