const express = require('express');
const userController = require('./../db/users/userController');


const router = new express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);



module.exports = router;