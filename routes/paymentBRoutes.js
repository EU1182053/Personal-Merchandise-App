const { isSignIn } = require("../controllers/auth");
const router = require("./product");
const {getToken, processPayment} = require('../controllers/paymentB')
router.get('/payment/gettoken/:userId', isSignIn, getToken)

router.post('/payment/braintree/:userId', isSignIn, processPayment)

module.exports = router