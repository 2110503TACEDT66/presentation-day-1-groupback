const express = require('express');
const {getUsers,getUser,updateUser,deleteUser} = require('../controllers/users')


const router = express.Router();

const {protect,authorize} = require('../middleware/auth');


router.route('/').get(protect,authorize('admin'),getUsers);
router.route('/:id').get(protect,authorize('admin'),getUser).put(protect,authorize('admin','user'),updateUser).delete(protect,authorize('admin','user'),deleteUser);


module.exports = router;