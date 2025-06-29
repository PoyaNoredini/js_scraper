const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/register-admin' , authController.adminRegister,adminMiddleware.mainAdminMiddleware);


module.exports = router;
