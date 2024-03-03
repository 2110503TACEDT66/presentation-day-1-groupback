const express = require('express');
const {getUsers,getUser,updateUser,deleteUser} = require('../controllers/users')


const router = express.Router();

const {protect,authoriz} = require('../middleware/auth');


router.route('/').get(protect,authoriz('admin'),getUsers);
router.route('/:id').get(getUser).put(protect,authoriz('admin','user'),updateUser).delete(protect,authoriz('admin','user'),deleteUser);


module.exports = router;