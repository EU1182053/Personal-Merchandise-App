// Add Payout Entry

exports.AddPayout1 = (req, res) => {
  var PayoutId = 0;
  var fBranch = 1;
  var fVendor = req.body.fVendor;
  var sPerson = req.body.sPerson;
  var fPayoutType = req.body.fPayoutType;
  var fPaymentMode = req.body.fPaymentMode;
  var dtDate = req.body.dtDate;
  var sAmount = req.body.sAmount;
  var sComment = req.body.sComment;
  var user = req.body.UserId;
  var datetime = new Date();
  var date = datetime.getDate();

  if (fPaymentMode == 7) {
    var pendingpayout_data = new hPendingPayout({
      fPendingPayout: fPendingPayout,
      fVendor: fVendor,
      sBillNo: sBillNo,
      dtDate: dtDate,
      fMaterial: fMaterial,
      fUnit: fUnit,
      sQuantity: sQuantity,
      sPrice: sPrice,
      sAmount: sAmount,
      dtCreatedOn: date,
      dtUpdatedOn: date,
      iCreatedBy: user,
      iUpdatedBy: user,
      iVersion: 1,
      iActive: 1,
    });

    pendingpayout_data.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });
  } else {
    var query2 = "";
    var pendingpayout_data = new hPendingPayout({
      fPendingPayout: fPendingPayout,
      fVendor: fVendor,
      sBillNo: sBillNo,
      dtDate: dtDate,
      fMaterial: fMaterial,
      fUnit: fUnit,
      sQuantity: sQuantity,
      sPrice: sPrice,
      sAmount: sAmount,
      dtCreatedOn: date,
      dtUpdatedOn: date,
      iCreatedBy: user,
      iUpdatedBy: user,
      iVersion: 1,
      iActive: 1,
    });
    pendingpayout_data.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });
  }
  (err, obj) => {
    if (err) {
      res.send({
        Status: "Error",
        Message: "501",
        Message: err,
      });
    } else {
      res.send({
        Status: "Success",
        Message: "Payout Added Successfully",
        PayoutId: PayoutId,
      });
    }
  };
};

// Get Payout 

exports.getPayout1 = async (req, res) => {
  var tabledata = [];
  var tableobj = [];
  try {
    var payoutentry_data = await hPayoutEntry.find({ iActive: 1 });



    for (i = 0; payoutentry_data.length; i++) {
      var fPayoutType = payoutentry_data[i].fPayoutType;
      var fPayout = payoutentry_data[i].fPayout;
      var fPayoutAccount = payoutentry_data[i].fPayoutAccount;
      var fVendor = payoutentry_data[i].fVendor;
      var fPaymentMode = payoutentry_data[i].fPaymentMode;

      var payouttype_data = await hPayoutType.findById({ _id: fPayoutType });
      var payoutpayment_data = await hPayoutPayment.findById({ _id: fPayout });
      var account_data = await hAccount.findById({ _id: fPayoutAccount });
      var vendor_data = await hMasterVendor.findById({ _id: fVendor });
      var paymentmode_data = await hMasterPaymentMode.findById({
        _id: fPaymentMode,
      });
      tableobj = new JSON();

      var PayoutId = Number(dt[i].iId);
      tableobj.iId = PayoutId;
      tableobj.fPayoutType = dt[i].fPayoutType;
      tableobj.sName = dt[i].sName;
      tableobj.sComment = dt[i].sComment;
      tableobj.fPaymentMode = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.PaymentMode = dt[i].sMOP;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.fVendor = dt[i].fVendor;
      tableobj.sVendorName = dt[i].sVendorName;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "success",
      data: tabledata,
    });
  } catch {
    (err, obj) => {
      if (err)
        res.send({
          Status: "Failure",
          data: err,
        });
    };
  }
};
// Get Payout By Id

exports.getPayoutById1 = async (req, res, id) => {
  var tabledata = [];
  var tableobj = [];
  try {
    var payoutentry_data = await hPayoutEntry.find({ iActive: 1 });



    for (i = 0; payoutentry_data.length; i++) {
      // var fBranch = payoutentry_data[i].fBranch;
      var fPayoutType = payoutentry_data[i].fPayoutType;
      var fPaymentMode = payoutentry_data[i].fPaymentMode;
      var fVendor = payoutentry_data[i].fVendor;

      // var sPerson = payoutentry_data[i].sPerson;
      // var sAmount = payoutentry_data[i].sAmount;
      // var sComment = payoutentry_data[i].sComment;
      // var sVendorName = payoutentry_data[i].sVendorName;
      // var sName = payoutentry_data[i].sName;

      var payouttype_data = await hPayoutType.findById({ _id: fPayoutType });
      var vendor_data = await hMasterVendor.findById({ _id: fVendor });
      var paymentmode_data = await hMasterPaymentMode.findById({
        _id: fPaymentMode,
      });
      tableobj = [];

      tableobj.iId = Number(dt[i].iId);
      tableobj.fPayoutType = dt[i].fPayoutType;
      tableobj.sName = dt[i].sName;
      tableobj.fPaymentMode = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.fVendor = dt[i].fVendor;
      tableobj.sVendorName = dt[i].sVendorName;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "success",
      data: tabledata,
    });
  } catch {
    (err, obj) => {
      if (err)
        res.send({
          Status: "Failure",
          data: err,
        });
    };
  }
};
// Get Payout By Keyword

exports.getPayoutByKeyword1 = (req, res, keyword) => {
  var tabledata = [];
  var tableobj = [];
  try {
    var keyword = req.params.keyword;

    var query = {
      sVendorName: new RegExp(keyword),
      sPerson: new RegExp(keyword),
      sMOP: new RegExp(keyword),
      sName: new RegExp(keyword),

      iActive: 1,
    };

    for (i = 0; i < payoutentry_data.length; i++) {
      tableobj = []
      var fPayoutType = payoutentry_data[i].fPayoutType;
      var fVendor = payoutentry_data[i].fVendor;
      var fPaymentMode = payoutentry_data[i].fPaymentMode;

      var payouttype_data = await hPayoutType.findById({ _id: fPayoutType });
      var vendor_data = await hMasterVendor.findById({ _id: fVendor });
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode });
      tableobj.iId = Payoutid;
      tableobj.fPayoutType = dt[i].fPayoutType
      tableobj.sName = dt[i].sName
      tableobj.fPaymentMode = dt[i].fPaymentMode
      tableobj.sMOP = dt[i].sMOP
      tableobj.sPerson = dt[i].sPerson
      tableobj.fVendor = dt[i].fVendor
      tableobj.sVendorName = dt[i].sVendorName
      tableobj.dtDate = dt[i].dtDate
      tableobj.sAmount = dt[i].sAmount
      tableobj.sComment = dt[i].sComment
      //To Get Payout Payment Details

      var dtPayout = []

      var payoutentry_data = await hPayoutEntry.find({ iActive: 1 });

      var fPayoutType = payoutentry_data[i].fPayoutType;
      var fPayoutAccount = payoutentry_data[i].fPayoutAccount;
      var fPaymentMode = payoutentry_data[i].fPaymentMode;

      var payouttype_data = await hPayoutType.findById({ _id: fPayoutType });
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode });

      var PaymentMode = ""
      for (i = 0; j < dtPayout.length; j++) {
        var mop = dtPayout[j].sMOP
        if (j == 0) {
          PaymentMode = mop;
        }
        else {
          PaymentMode += "," + mop;
        }
      }
      tableobj.PaymentMode = PaymentMode;
      tabledata.Add(tableobj);
    }
    res.send({
      Status: "success",
      data: tabledata,
    });


  } catch (err) {
    res.send({
      Status: "Failure",
      data: err,
    });

  }
};
//Delete Payout **

exports.DeletePayout1 = async (req, res) => {
  var userarray = [];
  var userobject = [];
  try {
    var iId = Number(req.body.iId)
    var UserId = Number(req.body.UserId)
    var iActive = 0
    var query = await hPayoutEntry.findByIdAndUpdate({ _id: iId },
      {
        iActive: iActive,
        dtUpdatedBy: UserId
      })

    var dt = await hPayoutPayment.findById({ fPayout: iId })


    //To Revert Amount Back To Account

    for (i = 0; i < dt.length; i++) {
      var amount = Number(dt[i].fAmount)
      var fPayoutAccount = Number(dt[i].fPayoutAccount)

      var fPaymentMode = Number(dt[i].fPaymentMode)
      var iIsChequeCleared = Number(dt[i].iIsChequeCleared)
      if (fPaymentMode == 1 && iIsChequeCleared == 0) {

      }
      else {

        var da = await hAccount.findById({ iId: fPayoutAccount })

        var amount11 = Number(dt11[i].sAmount);
        amount = amount11 + amount;
        var query2 = await hAccount.findByIdAndUpdate({ iId: fPayoutAccount }, { sAmount: amount })


      }
    }
    res.send({
      Status: "success",
      data: userobject,
    });

  }
  catch (err) {
    res.send({
      Status: "Failure",
      data: err,
    });

  }
}

// Get Pending Payout By Vendor Id

exports.getPendingPayoutByVendorId = async (req, res, Vendorid) => {
  var tabledata = [];
  var tableobj = [];
  try {
    var pendingpayment_data = await hPendingPayout.findById({ iActive: 1 })



    let dt = []
    var PayableAmount = 0
    for (i = 0; i < pendingpayment_data.length; i++) {
      var fPayoutType = payoutentry_data[i].fPayoutType;
      // var fPayout = payoutentry_data[i].fPayout;
      var fVendor = payoutentry_data[i].fVendor;
      var fPaymentMode = payoutentry_data[i].fPaymentMode;

      var payouttype_data = await hPayoutType.findById({ _id: fPayoutType })
      var vendor_data = await hMasterVendor.findById({ _id: fVendor });
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode });
      tableobj = [];

      tableobj.iId = Number(dt[i].iId);
      tableobj.fPayoutType = dt[i].fPayoutType;
      tableobj.sName = dt[i].sName;
      tableobj.fPaymentMode = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.fVendor = dt[i].fVendor;
      tableobj.sVendorName = dt[i].sVendorName;
      tableobj.dtDate = dt[i].dtDate
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      var Amount = Number(dt[i].sAmount);

      PayableAmount += Amount;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "success",
      data: tabledata,
    });

  }

  catch (err) {
    res.send({
      Status: "Failure",
      data: err,
    });
  }
}
// Add Pending Payout Payment

exports.AddPendingPayoutPayment = async (req, res) => {
  try {
    let fBranch = 1;

    let fPayout = 0;

    // Bills & PAyments
    let fPayoutType = Number(req.body.fPayoutType);

    //Cash / Card / Cheque
    let fPaymentMode = Number(req.body.fPaymentMode);

    let fVendor = Number(req.body.fVendor);
    //var sPerson = sPerson = req.body.sPerson;

    //To Get Vendor
    let dtVendor = [];
    var dtVendor = await hMasterVendor.findById({ iId: fVendor, iActive: 1 })

    var sPerson = dtVendor[0].sContactPerson

    let sPayableAmount = req.body.sPayableAmount
    let sComment = req.body.sCommen;

    let sChequeNo = req.body.sChequeNo
    // DateTime sChequeDate = Convert.ToDateTime(req.body.sChequeDate);
    let iIsChequeCleared = 0;

    let fPayoutAccount = Number(req.body.fPayoutAccount);
    let user = req.body.UserId
    // DateTime date = DateTime.Now;

    //To Check Payout Already Exist Or Not
    let dtPayoutEntry = []
    dtPayoutEntry = hPayoutEntry.find({ iActive: 1, iId: fPayout })
    if (dtPayoutEntry.length == 0) {
      //To Add Entry In Payout Entry

      var query = new hPayoutEntry({
        fBranch: fBranch,
        fPayoutType: fPayoutType,
        fPaymentMode: fPaymentMode,
        sPerson: sPerson,
        fVendor: fVendor,
        dtDate: dtDate,
        sAmount: sPayableAmount,
        sComment: sComment,
        dtCreatedOn: date,
        dtUpdatedOn: date,
        iCreatedBy: user,
        iUpdatedBy: user,
        iVersion: 1,
        iActive: 1,
      })
      hPayoutEntry.save(function (err, data) {
        if (err) res.json(err);
        else {
        }
      });
      //To Add Payout Id In Pending Payout Table
      let qeurys = hPendingPayout.findByIdAndUpdate(
        { iIsPaid: 0, fVendor: fVendor },
        {
          fPayout: fPayout,
          iIsPaid: 1,
          iUpdatedBy: user
        })
    }
    //To Add Entry In Payout Payment Table
    var query = new hPayoutPayment({

      fPayoutType: fPayoutType,
      fPaymentMode: fPaymentMode,
      fAmount: fAmount,
      sChequeNo: sChequeNo,
      sChequeDate: sChequeDate,
      iIsChequeCleared: iIsChequeCleared,
      fPayoutAccount: fPayoutAccount,

      dtCreatedOn: date,
      dtUpdatedOn: date,
      iCreatedBy: user,
      iUpdatedBy: user,
      iVersion: 1,
      iActive: 1,
    })
    hPayoutPayment.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });
    //To Subtract Money From Account
    if (fPaymentMode != 1) {
      var dt = await hAccount.find({ iActive: 1, iId: fPayoutAccount })





      var amount = Number(dt[0].sAmount);
      amount = amount - Number(sPayableAmount);

      var query2 = await hAccount.findByIdAndUpdate({ iId: fPayoutAccount }, { sAmount: amount })
    }

    //To Get Payable Amount
    let dtPayout = []
    dtPayout = await hPayoutEntry.find({ iId: fPayout, iActive: 1 })

    var PayableAmount = Number(dtPayout[0].sAmount);

    let dtpaymentdone = []
    dtpaymentdone = await hPayoutPayment.find({ fPayout: fPayout, iActive: 1 })
    let PaidAmount = 0.00;
    if (dtpaymentdone.length > 0) {
      for (i = 0; i < dtpaymentdone.length; i++) {
        PaidAmount = PaidAmount + Number(dtpaymentdone[i].fAmount);
      }
    }


    if (PaidAmount >= PayableAmount) {
      res.send({
        Status: "success",
        Message: "Payout Payment Added Sucessfully",
      });

    }
    else {
      res.send({
        Status: "Part Payment",
        Message: "Total Bill Not Paid Yet",
      });
    }
  } catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err,
    });
  }
}
//Get Payment Details By Payout Id

exports.getPaymentDetailsByPayout = async (req, res, Payoutid) => {
  var orderdata = []
  var orderobj = []
  try {
    let dtpayment = []
    dtpayment = await hPayoutEntry.find({ iActive: 1 })



    for (i = 0; i < dtpayment.length; i++) {
      var orderobj = []
      orderobj.iId = Number(dtpayment[i].iId);
      orderobj.fPayoutType = dtpayment[i].fPayoutType
      orderobj.sName = dtpayment[i].sName
      orderobj.fPaymentMode = dtpayment[i].fPaymentMode
      orderobj.sMOP = dtpayment[i].sMOP
      orderobj.sPerson = dtpayment[i].sPerson
      orderobj.fVendor = dtpayment[i].fVendor
      orderobj.sVendorName = dtpayment[i].sVendorName
      orderobj.dtDate = dtpayment[i].dtDate
      orderobj.sAmount = dtpayment[i].sAmount
      orderobj.sComment = dtpayment[i].sComment

      let dtpaymentdone = []
      dtpaymentdone = await hPayoutPayment.find({ iActive: 1, fPayout: Payoutid })
      var OutStanding = 0.00;

      if (dtpaymentdone.length > 0) {
        //To Get Remaining Amount
        let amount = 0.00;


        for (a = 0; a < dtpaymentdone.length; a++) {
          amount = amount + Number(dtpaymentdone[a].fAmount);
        }

        OutStanding = Number(dtpayment[0].sAmount) - amount;

        orderobj.OutStanding = OutStanding;
      }
      else {
        OutStanding = Number(dtpayment[0].sAmount);

        orderobj.OutStanding = OutStanding;
      }

      orderobj.PayableAmount = OutStanding;

      orderdata.push(orderobj);
    }
    res.send({
      Status: "Success",
      data: orderdata,
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      data: err,
    });
  }
}
// Add Payout Payment

exports.AddPayoutPayment = async (req, res) => {
  try {


    let fPayout = Number(req.body.fPayout);

    // Bills & PAyments
    let fPayoutType = Number(req.body.fPayoutType);

    //Cash / Card / Cheque
    let fPaymentMode = Number(req.body.fPaymentMode);

    let sChequeNo = req.body.sChequeNo;
    let sChequeDate = req.body.sChequeDate;
    let iIsChequeCleared = 0;

    var fAmount = req.body.fAmount;
    let fPayoutAccount = Number(req.body.fPayoutAccount);
    let user = Number(req.body.UserId);
    // DateTime date = DateTime.Now;

    var query = new hPayoutPayment({
      fPayout: fPayout,
      fPayoutType: fPayoutType,
      fPaymentMode: fPaymentMode,
      fAmount: fAmount,
      sChequeNo: sChequeNo,
      sChequeDate: sChequeDate,
      iIsChequeCleared: iIsChequeCleared,
      fPayoutAccount: fPayoutAccount,
      dtCreatedOn: date,
      dtUpdatedOn: date,
      iCreatedBy: user,
      iUpdatedBy: user,
      iVersion: 1,
      iActive: 1,
    })
    hPayoutPayment.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });
    if (fPaymentMode != 1) {
      var da = await hAccount.find({ iId: fPayoutAccount, iActive: 1 })

      const amount = (dt[0].sAmount);
      amount = amount - (fAmount);

      var query2 = await hAccount.findByIdAndUpdate({ iId: fPayoutAccount }, { sAmount: amount })

      //To Get Payable Amount
      let dtPayout = []
      dtPayout = await hPayoutPayment.find({ fPayout: fPayout, iActive: 1 })
      let PaidAmount = 0.00;

      if (dtpaymentdone.length > 0) {
        for (i = 0; i < dtpaymentdone.length; i++) {
          PaidAmount = PaidAmount + Number(dtpaymentdone[i].fAmount);
        }

      }
      if (PaidAmount >= PayableAmount) {

        res.send({
          Status: "Success",
          Message: "Payout Payment Added Sucessfully",
        });

      }
      else {
        res.send({
          Status: "Part Payment",
          Message: "Total Bill Not Paid Yet",
        });
      }
    }
  } catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    });
  }
}
// Get All Payments By Payout Id 

exports.getPayoutPaymentsByPayoutId = async (req, res, Payoutid) => {
  let tabledata = []
  let tableobj = []
  try {
    var dt = await hPayoutPayment.find({ iActive: 1, fPayout: Payoutid })


    for (i = 0; i < dt.length; i++) {
      var fPayoutAccount = payoutpayment_data[0].fPayoutAccount
      var fPaymentMode = payoutpayment_data[0].fPaymentMode

      var payoutaccount_data = await hAccount.findById({ _id: fPayoutAccount })
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode })

      tableobj = [];

      var iIsChequeCleared = dt[i].iIsChequeCleared;
      var fPaymentMode = dt[i].fPaymentMode;

      tableobj.iId = (dt[i].iId);
      tableobj.fPaymentMode = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.fAmount = dt[i].fAmount;
      tableobj.sChequeNo = dt[i].sChequeNo;
      tableobj.sChequeDate = dt[i].sChequeDate;
      tableobj.iIsChequeCleared = dt[i].iIsChequeCleared;

      tableobj.fPayoutAccount = dt[i].fPayoutAccount;
      tableobj.sAccount = dt[i].sAccount;
      if (fPaymentMode == "1") {
        tableobj.PaymentDetails = "MOP :" + dt[i].sMOP + "/\r\n ChequeNo :" + dt[i].sChequeNo + "/\r\n ChequeDate :" + dt[i].sChequeDate;
      }
      else {
        tableobj.PaymentDetails = dt[i].sMOP;
      }

      /*
          if (iIsChequeCleared == "1" && fPaymentMode == "1")
          {
              tableobj.ChequeStatus = "Cheque Cleared";
          }
          else
          {
              tableobj.ChequeStatus = "Cheque Not Cleared";
          }
      */
      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata,
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    });
  }
}

// Add Payin     
exports.AddPayin1 = async (req, res) => {
  try {
    var PayinId = 0;

    let fBranch = 1;
    let fPayinType = Number(req.body.fPayinType);
    let fPaymentMode = Number(req.body.fPaymentMode);
    var sPerson = req.body.sPerson;
    var dtDate = req.body.dtDate;
    var sAmount = req.body.sAmount;
    var sComment = req.body.sComment;
    let user = Number(req.body.UserId);
    // DateTime date = DateTime.Now;

    var query = await hPayinEntry({
      fPayinType: fPayinType,
      fBranch: fBranch,
      fPaymentMode: fPaymentMode,
      sPerson: sPerson,
      dtDate: sChequeNo,
      sAmount: sAmount,
      sComment: sComment,


      dtCreatedOn: date,
      dtUpdatedOn: date,
      iCreatedBy: user,
      iUpdatedBy: user,
      iVersion: 1,
      iActive: 1,

    })
    hPayinEntry.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });
    res.send({
      Status: "Success",
      Message: "Payin Added Successfully",
      PayinId: PayinId
    });
  } catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    });
  }
}
// Get Payin
exports.getPayin1 = (req, res) => {
  let tabledata = []
  let tableobj = []
  try {

    var dt = await hPayinEntry.find({ iActive: 1 })


    for (i = 0; i < dt.length; i++) {
      var fPayinType = payinentry_data[i].fPayinType
      var fPaymentMode = payinentry_data[i].fPaymentMode

      var payintype_data = await hPayinType.findById({ _id: fPayinType })
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode })
      tableobj = []

      var Payinid = (dt[i].iId);

      tableobj.iId = Payinid;
      tableobj.fPayinType = dt[i].fPayinType;
      tableobj.sName = dt[i].sName;
      tableobj.fPayinType = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.PaymentMode = dt[i].sMOP;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      //To Get Payout Payment Details
      /*                    DataTable dtPayin = new DataTable();
                          dtPayin = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayinPayment p, hMasterPaymentMode pm,hAccount a, hPayinType pt Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayin=" + Payinid);
  
                          var PaymentMode = "";
  
                          for (int j = 0; j < dtPayin.Count; j++)
                          {
                              var mop = dtPayin[j].sMOP;
  
                              if (j == 0)
                              {
                                  PaymentMode = mop;
                              }
                              else
                              {
                                  PaymentMode += "," + mop;
                              }
                          }
  
                          tableobj.sAccount.PaymentMode = PaymentMode;*/
      tabledata.push(tableobj);

    }
    res.send({
      Status: "Success",
      data: tabledata
    });

  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    });

  }
}


// Get Payin By Id
exports.getPayinById1 = (req, res, id) => {
  let tabledata = []
  let tableobj = []

  try {

    var dt = await hPayinEntry.find({ iActive: 1, _id: id })

    for (i = 0; i < dt.length; i++) {
      var fPayinType = payinentry_data[i].fPayinType
      var fPaymentMode = payinentry_data[i].fPaymentMode

      var payintype_data = await hPayinType.findById({ _id: fPayinType })
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode })
      tableobj = []

      tableobj.iId = (dt[i].iId);
      tableobj.fPayinType = dt[i].fPayinType;
      tableobj.sName = dt[i].sName;
      tableobj.fPayinType = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;


      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata
    });

  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    });
  }
}

// Get Payin By Keyword
exports.getPayinByKeyword1 = async (req, res, keyword) => {
  let tabledata = []
  let tableobj = []
  try {
    let dt = []
    var keyword = req.params.keyword

    var query = {
      sPerson: new RegExp(keyword),
      sMOP: new RegExp(keyword),
      sName: new RegExp(keyword),
      iActive: 1
    }
    for (i = 0; i < dt.length; i++) {
      tableobj = [];

      tableobj.iId = (dt[i].iId);
      tableobj.fPayinType = dt[i].fPayinType;
      tableobj.sName = dt[i].sName;
      tableobj.fPayinType = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata
    });

  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    });
  }
}
//Delete payin
exports.DeletePayin1 = (req, res) => {
  try {
    let iId = (req.body.iId);
    let UserId = (req.body.UserId);
    // DateTime date = DateTime.Now;

    var query = await hPayinEntry.findByIdAndUpdate(
      { iId: iId },
      { iActive: 1, dtUpdatedBy: UserId })

    var dt = await hPayinPayment.find({ fPayin: fPayin })

    //To Remove Amount From Account
    for (i = 0; i < dt.length; i++) {
      let amount = Number(dt[i].fAmount);
      let fPayinAccount = Number(dt[i].fPayinAccount);
      let fPaymentMode = Number(dt[i].fPaymentMode);
      let iIsChequeCleared = Number(dt[i].iIsChequeCleared);

      if (fPaymentMode == 1 && iIsChequeCleared == 0) {

      }
      else {

        var da11 = await hAccount.find({ iId: fPayinAccount })
        let amount11 = Number(da11[0].sAmount);

        amount = amount11 - amount;
        var query2 = await hAccount.findByIdAndUpdate(
          { iId: fPayinAccount },
          { sAmount: amount })
      }
    }
    res.send({
      Status: "Success",
      Message: "Payin Deleted Sucessfully"
    });
  } catch
  (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    });
  }
}

//Get Payment Details By Payin Id
exports.getPaymentDetailsByPayin = async (req, res, Payinid) => {
  let orderdata = []
  let orderobj = []
  try {
    let dtpayment = []
    dtpayment = await hPayinEntry.find({ iActive: 1, iId: Payinid })



    for (i = 0; i < dtpayment.length; i++) {
      var fPayinType = payinentry_data[i].fPayinType
      var fPaymentMode = payinentry_data[i].fPaymentMode

      var payintype_data = await hPayinType.findById({ _id: fPayinType })
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode })
      orderobj = [];

      orderobj.iId = Number(dtpayment[i].iId);
      orderobj.fPayinType = dtpayment[i].fPayinType;
      orderobj.sName = dtpayment[i].sName;
      orderobj.fPayinType = dtpayment[i].fPaymentMode;
      orderobj.sMOP = dtpayment[i].sMOP;
      orderobj.sPerson = dtpayment[i].sPerson;
      orderobj.dtDate = dtpayment[i].dtDate;
      orderobj.sAmount = dtpayment[i].sAmount;
      orderobj.sComment = dtpayment[i].sComment;

      let dtpaymentdone = [];
      dtpaymentdone = await hPayinPayment.find({ iActive: 1, fPayin: Payinid })

      let OutStanding = 0.00;

      if (dtpaymentdone.length > 0) {
        //To Get Remaining Amount
        let amount = 0.00;

        for (a = 0; a < dtpaymentdone.length; a++) {
          amount = amount + Number(dtpaymentdone[a].fAmount);
        }

        OutStanding = (dtpayment[i].sAmount) - amount;

        orderobj.OutStanding = OutStanding;
      }
      else {
        OutStanding = (dtpayment[i].sAmount);

        orderobj.OutStanding = OutStanding;
      }

      orderobj.PayableAmount = OutStanding;

      orderdata.push(orderobj);
    }
    res.send({
      Status: "Success",
      data: orderdata
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    });
  }
}

// Add Payin Payment
exports.AddPayinPayment = async (req, res) => {
  try {
    let fPayin = (req.body.fPayin);

    //Cash / Card / Cheque
    let fPaymentMode = (req.body.fPaymentMode);

    var sChequeNo = req.body.sChequeNo;
    var sChequeDate = req.body.sChequeDate;
    let iIsChequeCleared = 0;

    var fAmount = req.body.fAmount;
    let fPayinAccount = (req.body.fPayinAccount);
    let user = (req.body.UserId);
    // DateTime date = DateTime.Now;
    var query = new hPayinPayment({
      fPayin: fPayin,
      fAmount: fAmount,
      fPaymentMode: fPaymentMode,
      sChequeNo: sChequeNo,
      sChequeDate: sChequeDate,
      iIsChequeCleared: iIsChequeCleared,
      fPayinAccount: sPayableAmount,
      dtCreatedOn: date,
      dtUpdatedOn: date,
      iCreatedBy: user,
      iUpdatedBy: user,
      iVersion: 1,
      iActive: 1,
    })
    hPayoutEntry.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });
    //To Add Monet To Account
    if (fPaymentMode != 1) {
      let dt = []
      var da = await hAccount.find({ iId: fPayinAccount, iActive: 1 })
      let amount = Number(dt[0].sAmount);
      amount = amount + Number(fAmount);

      var query2 = await hAccount.findByIdAndUpdate(
        { iId: fPayinAccount },
        { sAmount: amount })

      //To Get Payable Amount
      let dtPayout = []
      dtPayout = await hPayinEntry.find({ iActive: 1, iId: fPayin })

      let PaidAmount = 0.00
      if (dtpaymentdone.length > 0) {
        for (i = 0; i < dtpaymentdone.length; i++) {
          PaidAmount = PaidAmount + Number(dtpaymentdone[i].fAmount);
        }
      }
      if (PaidAmount >= PayableAmount) {

        res.send({
          Status: "Success",
          Message: "Payin Payment Added Sucessfully"
        });
      }
      else {
        res.send({
          Status: "Part Payment",
          Message: "Total Bill Not Paid Yet"
        });
      }
    }
  }
  catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    })
  }
}

// Get All Payments By fPayin Id 
exports.getPayinPaymentsByfPayinId = async (req, res, fPayinid) => {
  var tabledata = []
  var tableobj = []
  try {

    var dt = await hPayinPayment.find({ iActive: 1, iId: fPayinid })


    for (i = 0; i < dt.length; i++) {
      var fPayinType = payinpayment_data[i].fPayinType
      var fPaymentMode = payinpayment_data[i].fPaymentMode

      var payinaccount_data = await hAccount.findById({ _id: fPayinType })
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode })
      tableobj = [];

      var iIsChequeCleared = dt[i].iIsChequeCleared;
      var fPaymentMode = dt[i].fPaymentMode;

      tableobj.iId = (dt[i].iId);
      tableobj.fPaymentMode = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.fAmount = dt[i].fAmount;
      tableobj.fPayinAccount = dt[i].fPayinAccount;
      tableobj.sAccount = dt[i].sAccount;

      if (fPaymentMode == "1") {
        tableobj.PaymentDetails = "MOP :" + dt[i].sMOP + "/\r\n ChequeNo :" + dt[i].sChequeNo + "/\r\n ChequeDate :" + dt[i].sChequeDate;
      }
      else {
        tableobj.PaymentDetails = dt[i].sMOP;
      }

      /*
                          if (iIsChequeCleared == "1" && fPaymentMode == "1")
                          {
                              tableobj.ChequeStatus = "Cheque Cleared";
                          }
                          else
                          {
                              tableobj.ChequeStatus = "Cheque Not Cleared";
                          }*/

      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata
    });


  } catch (err) {
    res.send({
      Status: "Failure",
      StatusCode: "501",
      data: err
    })
  }
}

// Get Payout Cheque Entries
exports.getPayoutChequeEntries1 = async (req, res) => {
  try {
    let tabledata = []
    let tableobj = []

    var dt = await hPayoutPayment.find({ iActive: 1, iIsChequeCleared: 0 })



    for (i = 0; i < dt.length; i++) {
      var fPayoutType = payoutpayment_data[i].fPayoutType
      var fPayoutAccount = payoutpayment_data[i].fPayoutAccount
      var fVendor = payoutpayment_data[i].fVendor
      var fPaymentMode = payoutpayment_data[i].fPaymentMode
      var fPayout = payoutpayment_data[i].fPayout

      var payouttype_data = await hPayoutType.findById({ _id: fPayoutType })
      var payoutaccount = await hAccount.findById({ _id: fPayoutAccount })
      var vendor_data = await hMasterVendor.findById({ _id: fVendor })
      var paymentmode_data = await hMasterPaymentMode.findById({ _id: fPaymentMode })
      var payout_data = await hPayoutEntry.findById({ _id: fPayout })
      tableobj = [];


      tableobj.iId = (dt[i].iId);
      tableobj.fPayoutType = dt[i].fPayoutType;
      tableobj.sName = dt[i].sName;
      tableobj.fPaymentMode = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.sChequeNo = dt[i].sChequeNo;
      tableobj.sChequeDate = dt[i].sChequeDate;
      tableobj.iIsChequeCleared = dt[i].iIsChequeCleared;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.fVendor = dt[i].fVendor;
      tableobj.sVendorName = dt[i].sVendorName;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.fAmount = dt[i].fAmount;
      tableobj.fPayoutAccount = dt[i].fPayoutAccount;

      var fPaymentMode = dt[i].fPaymentMode;

      if (fPaymentMode == "1") {
        tableobj.PaymentDetails = "MOP :" + dt[i].sMOP + "/\r\n ChequeNo :" + dt[i].sChequeNo + "/\r\n ChequeDate :" + dt[i].sChequeDate;
      }
      else {
        tableobj.PaymentDetails = dt[i].sMOP;
      }

      tabledata.push(tableobj);

    }
    res.send({
      Status: "Success",
      data: tabledata
    });

  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    })

  }
}

exports.PayoutCheque1 = async (req, res) => {
  let userarray = []
  let userobject = []
  try {
    let iId = (req.body.iId);
    var date = (DateTime.Now);

    let UserId = (req.body.UserId);

    var query = await hPayoutPayment.findByIdAndUpdate(
      { iId: iId },
      { iIsChequeCleared: 1, dtChequeClearanceDate: date, dtUpdatedBy: UserId })

    var dt = await hPayoutPayment.find({ iId: iId })

    let amount = Number(dt[0].fAmount);
    let fPayoutAccount = (dt[0].fPayoutAccount);

    var da11 = await hAccount.find({ iId: fPayoutAccount })


    let amount11 = (da11[0].sAmount);

    amount = amount11 - amount;
    var query2 = await hAccount.find(
      { iId: fPayoutAccount },
      { sAmount: amount }
    )
    res.send({
      Status: "Success",
      data: userobject,
      Message: "Payout Cheque Cleared Sucessfully"
    });


  } catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    })
  }
}

// Get PayIn Cheque Entries
exports.getPayinChequeEntries1 = async (req, res) => {
  let tabledata = []
  let tableobj = []
  try {
    var dt = await hPayinPayment.find({ iActive: 1 })



    for (i = 0; i < dt.Count; i++) {
      var fPaymentMode = payinpayment_data[i].fPaymentMode
      var fPayinType = payinpayment_data[i].fPayinType
      var fPayinAccount = payinpayment_data[i].fPayinAccount
      var fPayin = payinpayment_data[i].fPayin

      var payintype_data = await hPayinType.findById({ iId: fPayinType })
      var payinaccount_data = await hAccount.findById({ iId: fPayinAccount })
      var paymentmode_data = await hMasterPaymentMode.findById({ iId: fPaymentMode })
      var payinentry_data = await hPayinEntry.findById({ iId: fPayin })
      tableobj = new JObject();

      tableobj.iId = Int32.Parse(dt[i].iId);
      tableobj.fPayinType = dt[i].fPayinType;
      tableobj.sName = dt[i].sName;
      tableobj.fPayinType = dt[i].fPaymentMode;
      tableobj.sMOP = dt[i].sMOP;
      tableobj.sChequeNo = dt[i].sChequeNo;
      tableobj.sChequeDate = dt[i].sChequeDate;
      tableobj.iIsChequeCleared = dt[i].iIsChequeCleared;
      tableobj.sPerson = dt[i].sPerson;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.fAmount = dt[i].fAmount;
      tableobj.fPayinAccount = dt[i].fPayinAccount;

      var fPaymentMode = dt[i].fPaymentMode;

      if (fPaymentMode == "1") {
        tableobj.PaymentDetails = "MOP :" + dt[i].sMOP + "/\r\n ChequeNo :" + dt[i].sChequeNo + "/\r\n ChequeDate :" + dt[i].sChequeDate;
      }
      else {
        tableobj.PaymentDetails = dt[i].sMOP;
      }
      tabledata.push(tableobj);
    }

    res.send({
      Status: "Success",
      data: tabledata,
      // Message: "Payout Cheque Cleared Sucessfully"
    });

  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    })

  }
}

//Payin Cheque Clearence
exports.PayinCheque1 = async (req, res) => {
  var userarray = []
  var userobject = []
  try {

    let iId = (req.body.iId);
    var datetime = new Date();
    var date = datetime.getDate();

    let UserId = Number(req.body.UserId);

    var query = await hPayinPayment.findByIdAndUpdate(
      { _id: iId },
      { iIsChequeCleared: 1, dtChequeClearanceDate: date, dtUpdatedBy: UserId })

    var dt = await hPayinPayment.findById({ iId: iId })
    let amount = Number(dt[0].fAmount);
    let fPayinAccount = Number(dt[0].fPayinAccount);

    var dt11 = await hAccount.findById({ iId: fPayinAccount })
    let amount11 = Number(dt11[0].sAmount);

    amount = amount11 + amount;

    var query2 = await hAccount.findById(
      { iId: iId },
      { sAmount: amount })

    res.send({
      Status: "Success",
      data: tabledata,
      // Message: "Payout Cheque Cleared Sucessfully"
    });
  } catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    })
  }
}

// Transfer Balance     
exports.AddTransaction = async (req, res) => {
  try {
    let fBranch = 1;
    let fAccount = Number(req.body.fAccount);
    let tAccount = Number(req.body.tAccount);
    var dtDate = req.dtDate;
    var sAmount = req.sAmount;
    var sComment = req.sComment;

    let user = Number(req.UserId);
    var datetime = new Date();
    var date = datetime.getDate();

    var query = await hAccountTransactions({
      fBranch: fBranch,
      fAccount: fAccount,
      tAccount: tAccount,
      dtDate: dtDate,
      sAmount: sAmount,
      sComment: sComment,
      dtCreatedOn: dtCreatedOn,
      dtUpdatedOn: dtUpdatedOn,
      iCreatedBy: iCreatedBy,
      iUpdatedBy: iUpdatedBy,
      iVersion: iVersion,
      iActive: iActive,
    })
    hAccountTransactions.save(function (err, data) {
      if (err) res.json(err);
      else {
      }
    });

    var dt = await hAccount.find({ iActive: 1, iId: fAccount })
    let amount = Number(dt[0].sAmount);
    amount = amount - Number(sAmount);

    var query2 = await hAccount.findByIdAndUpdate(
      { iId: fAccount },
      { sAmount: amount })

    var dt3 = await hAccount.find({ iActive: 1, iId: tAccount })

    let amount3 = Number(dt3[0].sAmount)
    amount3 = amount3 + Number(sAmount)

    var query4 = await hAccount.findByIdAndUpdate(
      { iId: tAccount },
      { sAmount: amount3 }
    )
    res.send({
      Status: "Success",
      data: tabledata,
      Message: "Transaction Added Sucessfully"
    });
  } catch (err) {
    res.send({
      Status: "Error",
      StatusCode: "501",
      Message: err
    })
  }
}
// Get Transcactions
exports.getTransaction = async (req, res) => {
  let tabledata = [];
  let tableobj = [];
  try {
    var dt = await hAccountTransactions.find({ iActive: 1 }).sort({ iId: -1 })

    for (i = 0; i < dt.Count; i++) {
      var fAccount = dt[i].fAccount
      var tAccount = dt[i].tAccount

      var faccount_data = await hAccount.findById({ _id: fAccount })
      var taccount_data = await hAccount.findById({ _id: tAccount })

      tableobj = [];
      tableobj.iId = Number(dt[i].iId);
      tableobj.fBranch = dt[i].fBranch;
      tableobj.fAccount = dt[i].a.sAccount;
      tableobj.tAccount = dt[i].a1.sAccount;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata,
      // Message: "Transaction Added Sucessfully"
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    })
  }
}

// Get Payin By Id
exports.getTransactionById = (req, res, id) => {
  let tabledata = []
  let tableobj = []
  try {
    var dt = await hAccountTransactions.find({ iActive: 1, iId: id })

    for (i = 0; i < dt.Rows.Count; i++) {
      var fAccount = dt[i].fAccount
      var tAccount = dt[i].tAccount

      var faccount_data = await hAccount.findById({ iId: fAccount })
      var taccount_data = await hAccount.findById({ iId: tAccount })

      tableobj = [];

      tableobj.iId = (dt.Rows[i].iId);
      tableobj.fBranch = dt.Rows[i].fBranch;
      tableobj.fAccount = dt.Rows[i].a.sAccount;
      tableobj.tAccount = dt.Rows[i].a1.sAccount;
      tableobj.dtDate = dt.Rows[i].dtDate;
      tableobj.sAmount = dt.Rows[i].sAmount;
      tableobj.sComment = dt.Rows[i].sComment;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata,
      // Message: "Transaction Added Sucessfully"
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    })
  }
}
//get Transaction By Keyword

exports.getTransactionByKeyword = (req, res) => {
  var tabledata = []
  var tableobj = []
  try {

    var FromDate = req.body.FromDate
    FromDate = FromDate.getDate()

    var ToDate = req.body.FromDate
    ToDate = FromDate.getDate()

    var keyword = req.body.keyword

    var dt = await hAccountTransactions.find({ iActive: 1, dtDate: { $gte: FromDate }, dtDate: { $lte: ToDate } }).sort({ iId: -1 })
    for (i = 0; i < dt.Rows.Count; i++) {

      var query = {
        sAccount: new RegExp(keyword),
        sAccount: new RegExp(keyword),
        sComment: new RegExp(keyword),


      }
      var fAccount = dt[i].fAccount
      var tAccount = dt[i].fAccount

      var faccount_data = await hAccount.findById({ iId: fAccount })
      var taccount_data = await hAccount.findById({ iId: tAccount })

      tableobj = []

      tableobj.iId = Number(dt[i].iId);
      tableobj.fBranch = dt[i].fBranch;
      tableobj.fAccount = dt[i].a.sAccount;
      tableobj.tAccount = dt[i].a1.sAccount;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      tabledata.push(tableobj);

    }
    res.send({
      Status: "Success",
      data: tabledata,
      // Message: "Transaction Added Sucessfully"
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    })
  }
}

exports.getTransactionByDate = async (req, res) => {
  var tabledata = []
  var tableobj = []
  try {

    var FromDate = req.body.FromDate
    FromDate = FromDate.getDate()

    var ToDate = req.body.FromDate
    ToDate = FromDate.getDate()

    var keyword = req.body.keyword

    var dt = await hAccountTransactions.find({ iActive: 1, dtDate: { $gte: FromDate }, dtDate: { $lte: ToDate } }).sort({ iId: -1 })
    for (i = 0; i < dt.Rows.Count; i++) {


      var fAccount = dt[i].fAccount
      var tAccount = dt[i].fAccount

      var faccount_data = await hAccount.findById({ iId: fAccount })
      var taccount_data = await hAccount.findById({ iId: tAccount })

      tableobj = new JObject();

      tableobj.iId = (dt[i].iId);
      tableobj.fBranch = dt[i].fBranch;
      tableobj.fAccount = dt[i].a.sAccount;
      tableobj.tAccount = dt[i].a1.sAccount;
      tableobj.dtDate = dt[i].dtDate;
      tableobj.sAmount = dt[i].sAmount;
      tableobj.sComment = dt[i].sComment;

      tabledata.push(tableobj);
    }
    res.send({
      Status: "Success",
      data: tabledata,
      // Message: "Transaction Added Sucessfully"
    });
  } catch (err) {
    res.send({
      Status: "Failure",
      // StatusCode: "501",
      data: err
    })
  }
}

