const express = require('express');
const {getHotels,getHotel,createHotels,updateHotel,deleteHotel} = require('../controllers/hotels')

//Include other resource routers
const bookingRouter = require('./bookings');

const router = express.Router();

const {protect,authoriz} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:hotelId/bookings/',bookingRouter);

router.route('/').get(getHotels).post(protect,authoriz('admin'),createHotels);
router.route('/:id').get(getHotel).put(protect,authoriz('admin'),updateHotel).delete(protect,authoriz('admin'),deleteHotel);


module.exports = router;