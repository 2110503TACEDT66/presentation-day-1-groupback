const express = require('express');
const {getHotels,getHotel,createHotels,updateHotel,deleteHotel} = require('../controllers/hotels')

//Include other resource routers
const bookingRouter = require('./bookings');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:hotelId/bookings/',bookingRouter);

router.route('/').get(getHotels).post(protect,authorize('admin'),createHotels);
router.route('/:id').get(getHotel).put(protect,authorize('admin'),updateHotel).delete(protect,authorize('admin'),deleteHotel);


module.exports = router;