const { isSignIn, isAuthenticated } = require("../controllers/auth");
const router = require("./product");
const {getToken, processPayment} = require('../controllers/paymentB')
router.get('/payment/gettoken/:userId', isSignIn, getToken)

router.post('/payment/braintree/:userId', isSignIn, isAuthenticated, processPayment)

module.exports = router