const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/authController');
const User = require('../models/user');

const router = express.Router();
router.get('/login', authController.getLogIn);
router.post('/login',
[
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'رمز مرور خاطئ.')
    .isLength({ min: 3 })    
    .trim()
],
 authController.postLogIn);

router.post('/log-out', authController.postLogOut);
router.get('/sign-up', authController.getSignUp);

router.post('/sign-up',
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .custom((value, { req }) => {      
      return User.findOne({
        email: value
      }).then(user => {
        if (user) {
          return Promise.reject(
            'This email is already in use.'
          );
        }
      });
    })
    .normalizeEmail(),
    body(
      'password',
      'The password must be at least 3 characters long.'
    )
    .isLength({
      min: 3
    })    
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match.');
      }
      return true;
    })
  ],
  authController.postSignUp);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset-password', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

router.get('/appusers/testpost',authController.testpost);

module.exports = router;