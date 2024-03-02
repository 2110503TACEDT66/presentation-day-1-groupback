const express = require('express');
const {getBookings,getBooking,addBooking,updateBooking,deleteBooking} = require('../controllers/bookings')

const {protect,authoriz} = require('../middleware/auth');

const router = express.Router({mergeParams:true});

router.route('/').get(protect,getBookings).post(protect,authoriz('admin','user'),addBooking);
router.route('/:id').get(protect,getBooking).put(protect,authoriz('admin','user'),updateBooking).delete(protect,authoriz('admin','user'),deleteBooking);

module.exports = router;