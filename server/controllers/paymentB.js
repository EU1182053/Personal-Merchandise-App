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
    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        // deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
      });
};
