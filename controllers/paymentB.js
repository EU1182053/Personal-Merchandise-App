const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "vn32sctyj4bpdfws",
  publicKey: "tqmj3np3dzzwbx7q",
  privateKey: "5291b2d7daf678d78e311d72fdaa80d6",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) { 
      return res.json(err);
    } else {
      res.json(response);
    }
  });
};
exports.processPayment = (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amountFromTheClient = req.body.amount;

  // Input validation
  if (!nonceFromTheClient || !amountFromTheClient) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true,
    },
  }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Transaction failed. Please try again." });
    }
    if (result.success) { 
      return res.status(200).json({
        success: true,
        transaction: result.transaction,
      });
    } 
    else {
      return res.status(400).json({
        success: false,
        error: result.message,
      });
    }
  });
}; 
