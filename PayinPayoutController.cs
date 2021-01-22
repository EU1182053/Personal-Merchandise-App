using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace Growtel_Web_API_New.Controllers
{
    [RoutePrefix("api/PayinPayout")]
    public class PayinPayoutController : ApiController
    {
        //Connection String
        string str = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:\htdocs\Growtel\Growtel\Database\growtel.mdb;";

        private DataTable RefreshTable(string v)
        {
            OleDbConnection con = new OleDbConnection(str);
            con.Open();
            OleDbDataAdapter da = new OleDbDataAdapter(v, con);
            DataTable dt = new DataTable();

            da.Fill(dt);

            con.Close();



            return dt;
        }


        // New Payin & Payout Calls



        //** Payout Calls 

        // Add Payout Entry
        [Route("AddPayout1")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPayout1(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                var PayoutId = 0;

                int fBranch = 1;

                int fVendor = Convert.ToInt32(keyValue["fVendor"].ToString());
                string sPerson = sPerson = keyValue["sPerson"].ToString();

                // Bills & PAyments
                int fPayoutType = Convert.ToInt32(keyValue["fPayoutType"].ToString());

                //Cash / Card / Cheque
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());

                DateTime dtDate = Convert.ToDateTime(keyValue["dtDate"].ToString());
                string sAmount = keyValue["sAmount"].ToString();
                string sComment = keyValue["sComment"].ToString();
                int user = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;

                //If Payout = Credit Then Insert Into Pending Payout Table Else In Payout Entry Table
                if (fPaymentMode == 7)
                {
                    string query = "insert into hPendingPayout(fBranch,fPayout,fPayoutType,fPaymentMode,sPerson,fVendor,dtDate,sAmount,sComment,iIsPaid,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayout,@fPayoutType,@fPaymentMode,@sPerson,@fVendor,@dtDate,@sAmount,@sComment,@iIsPaid,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query, con);

                        com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;
                        com.Parameters.Add("@fPayout", OleDbType.Integer).Value = PayoutId;
                        com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = fPayoutType;
                        com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                        com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                        com.Parameters.Add("@fVendor", OleDbType.Integer).Value = fVendor;
                        com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                        com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sAmount;
                        com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;
                        com.Parameters.Add("@iIsPaid", OleDbType.Integer).Value = 0;
                        com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                        com.Parameters.Add("@iUpdatedBy", OleDbType.Int eger).Value = user;
                        com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                        com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                        con.Open();
                        var rows = com.ExecuteNonQuery();
                        con.Close();
                    }
                }
                else
                {
                    string query2 = "Select @@Identity";
                    string query = "insert into hPayoutEntry(fBranch,fPayoutType,fPaymentMode,sPerson,fVendor,dtDate,sAmount,sComment,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayoutType,@fPaymentMode,@sPerson,@fVendor,@dtDate,@sAmount,@sComment,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query, con);

                        com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;

                        com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = fPayoutType;
                        com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                        com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                        com.Parameters.Add("@fVendor", OleDbType.Integer).Value = fVendor;
                        com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                        com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sAmount;
                        com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;
                        com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                        com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                        com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                        com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                        con.Open();
                        var rows = com.ExecuteNonQuery();
                        com.CommandText = query2;
                        PayoutId = (int)com.ExecuteScalar();
                        con.Close();
                    }
                }

                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Added Sucessfully",
                    PayoutId = PayoutId
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get Payout 
        [Route("getPayout1")]
        [HttpGet]
        public HttpResponseMessage getPayout1()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.*,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hPayoutPayment pp, hMasterPaymentMode pm,hAccount a, hMasterVendor v, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayout = pp.iId   and pp.fPayoutAccount=a.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    var Payoutid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                    tableobj.iId = Payoutid;
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();

                    ////To Get Payout Payment Details
                    //DataTable dtPayout = new DataTable();
                    //dtPayout = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayoutPayment p, hMasterPaymentMode pm,hAccount a, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and p.fPaymentMode=pm.iId and p.iActive = 1 and p.fPayout=" + Payoutid);
                    //
                    //var PaymentMode = "";
                    //
                    //for (int j = 0; j < dtPayout.Rows.Count; j++)
                    //{
                    //    var mop = dtPayout.Rows[j]["sMOP"].ToString();
                    //
                    //    if (j == 0)
                    //    {
                    //        PaymentMode = mop;
                    //    }
                    //    else
                    //    {
                    //        PaymentMode += "," + mop;
                    //    }
                    //}
                    //
                    //tableobj.sAccount.PaymentMode = PaymentMode;

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payout By Id
        [Route("getPayoutById1/{id}")]
        [HttpGet]
        public HttpResponseMessage getPayoutById1(int id)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.iId = pp.fPayout  and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.iId=" + id, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payout By Keyword
        [Route("getPayoutByKeyword1/{keyword}")]
        [HttpGet]
        public HttpResponseMessage getPayoutByKeyword1(string keyword)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId  and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and (v.sVendorName LIKE '%" + keyword + "%' or p.sPerson LIKE '%" + keyword + "%' or pm.sMOP LIKE '%" + keyword + "%' or pt.sName LIKE '%" + keyword + "%') ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    var Payoutid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                    tableobj.iId = Payoutid;
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    //To Get Payout Payment Details
                    DataTable dtPayout = new DataTable();
                    dtPayout = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayoutPayment p, hMasterPaymentMode pm,hAccount a, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and p.fPaymentMode=pm.iId and p.iActive = 1 and p.fPayout=" + Payoutid);

                    var PaymentMode = "";

                    for (int j = 0; j < dtPayout.Rows.Count; j++)
                    {
                        var mop = dtPayout.Rows[j]["sMOP"].ToString();

                        if (j == 0)
                        {
                            PaymentMode = mop;
                        }
                        else
                        {
                            PaymentMode += "," + mop;
                        }
                    }

                    tableobj.PaymentMode = PaymentMode;

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Delete Payout **
        [Route("DeletePayout1")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeletePayout1(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                DateTime date = DateTime.Now;

                int UserId = Convert.ToInt32(keyValue["UserId"].ToString());

                int iActive = 0;

                string query = "update hPayoutEntry set iActive='" + iActive + "',dtUpdatedBy='" + UserId + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iActive", OleDbType.VarChar).Value = iActive;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }



                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayoutPayment Where fPayout=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();

                //To Revert Amount Back To Account
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Double amount = Convert.ToDouble(dt.Rows[i]["fAmount"].ToString());
                    Double fPayoutAccount = Convert.ToDouble(dt.Rows[i]["fPayoutAccount"].ToString());

                    int fPaymentMode = Convert.ToInt32(dt.Rows[i]["fPaymentMode"].ToString());
                    int iIsChequeCleared = Convert.ToInt32(dt.Rows[i]["iIsChequeCleared"].ToString());

                    if (fPaymentMode == 1 && iIsChequeCleared == 0)
                    {

                    }
                    else
                    {
                        OleDbConnection con11 = new OleDbConnection(str);
                        con1.Open();
                        OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayoutAccount, con11);

                        DataTable dt11 = new DataTable();

                        da11.Fill(dt11);

                        con1.Close();
                        Double amount11 = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());

                        amount = amount11 + amount;

                        string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayoutAccount;

                        using (OleDbConnection con2 = new OleDbConnection(str))
                        {
                            OleDbCommand com2 = new OleDbCommand(query2, con2);

                            com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                            con2.Open();
                            var rows = com2.ExecuteNonQuery();

                            con2.Close();
                        }

                    }
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Deleted Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        //** Pending Payout


        // Get Pending Payout By Vendor Id
        [Route("getPendingPayoutByVendorId/{Vendorid}")]
        [HttpGet]
        public HttpResponseMessage getPendingPayoutByVendorId(int Vendorid)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPendingPayout p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayout = 0 and p.fPayoutType=pt.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fVendor=" + Vendorid, con);

                DataTable dt = new DataTable();

                int PayableAmount = 0;

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    var Amount = Convert.ToInt32(dt.Rows[i]["sAmount"].ToString());

                    PayableAmount += Amount;

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata,
                    PayableAmount = PayableAmount
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Add Pending Payout Payment
        [Route("AddPendingPayoutPayment")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPendingPayoutPayment(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fBranch = 1;

                int fPayout = 0;

                // Bills & PAyments
                int fPayoutType = Convert.ToInt32(keyValue["fPayoutType"].ToString());

                //Cash / Card / Cheque
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());

                int fVendor = Convert.ToInt32(keyValue["fVendor"].ToString());
                //string sPerson = sPerson = keyValue["sPerson"].ToString();

                //To Get Vendor
                DataTable dtVendor = new DataTable();
                dtVendor = RefreshTable("select * from hMasterVendor where iId =" + fVendor + " and iActive=1");

                var sPerson = dtVendor.Rows[0]["sContactPerson"].ToString();

                string sPayableAmount = keyValue["sPayableAmount"].ToString();
                string sComment = keyValue["sComment"].ToString();

                string sChequeNo = keyValue["sChequeNo"].ToString();
                DateTime sChequeDate = Convert.ToDateTime(keyValue["sChequeDate"].ToString());
                int iIsChequeCleared = 0;

                int fPayoutAccount = Convert.ToInt32(keyValue["fPayoutAccount"].ToString());
                int user = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;


                //To Check Payout Already Exist Or Not
                DataTable dtPayoutEntry = new DataTable();
                dtPayoutEntry = RefreshTable("Select * FROM hPayoutEntry Where iActive = 1 and iId=" + fPayout);

                if (dtPayoutEntry.Rows.Count == 0)
                {
                    //To Add Entry In Payout Entry
                    string query2 = "Select @@Identity";
                    string query = "insert into hPayoutEntry(fBranch,fPayoutType,fPaymentMode,sPerson,fVendor,dtDate,sAmount,sComment,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayoutType,@fPaymentMode,@sPerson,@fVendor,@dtDate,@sAmount,@sComment,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query, con);

                        com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;

                        com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = fPayoutType;
                        com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                        com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                        com.Parameters.Add("@fVendor", OleDbType.Integer).Value = fVendor;
                        com.Parameters.Add("@dtDate", OleDbType.Date).Value = DateTime.Today.Date;
                        com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sPayableAmount;
                        com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;
                        com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                        com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                        com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                        com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                        con.Open();
                        var rows = com.ExecuteNonQuery();
                        com.CommandText = query2;
                        fPayout = (int)com.ExecuteScalar();
                        con.Close();


                        //To Add Payout Id In Pending Payout Table
                        string querys = "update hPendingPayout set fPayout='" + fPayout + "', iIsPaid = 1,iUpdatedBy='" + user + "' where iIsPaid = 0 and fVendor = " + fVendor;


                        using (OleDbConnection con1 = new OleDbConnection(str))
                        {
                            OleDbCommand com1 = new OleDbCommand(querys, con1);

                            con1.Open();

                            var rows1 = com1.ExecuteNonQuery();

                            con1.Close();
                        }

                    }
                }


                //To Add Entry In Payout Payment Table
                string query1 = "insert into hPayoutPayment(fPayout,fPayoutType,fPaymentMode,fAmount,sChequeNo,sChequeDate,iIsChequeCleared,fPayoutAccount,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fPayout,@fPayoutType,@fPaymentMode,@fAmount,@sChequeNo,@sChequeDate,@iIsChequeCleared,@fPayoutAccount,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query1, con);

                    com.Parameters.Add("@fPayout", OleDbType.Integer).Value = fPayout;
                    com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = fPayoutType;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                    com.Parameters.Add("@fAmount", OleDbType.VarChar).Value = sPayableAmount;
                    com.Parameters.Add("@sChequeNo", OleDbType.VarChar).Value = sChequeNo;
                    com.Parameters.Add("@sChequeDate", OleDbType.Date).Value = sChequeDate;
                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = iIsChequeCleared;
                    com.Parameters.Add("@fPayoutAccount", OleDbType.Integer).Value = fPayoutAccount;
                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }


                //To Subtract Money From Account
                if (fPaymentMode != 1)
                {
                    OleDbConnection con1 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId=" + fPayoutAccount, con1);

                    DataTable dt = new DataTable();

                    da.Fill(dt);

                    con1.Close();

                    Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                    amount = amount - Convert.ToDouble(sPayableAmount);

                    string query2 = "update hAccount set sAmount=" + amount + " where iId = " + fPayoutAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }
                }


                //To Get Payable Amount
                DataTable dtPayout = new DataTable();
                dtPayout = RefreshTable("select * from hPayoutEntry where iId =" + fPayout + " and iActive=1");

                var PayableAmount = Convert.ToDouble(dtPayout.Rows[0]["sAmount"].ToString());

                DataTable dtpaymentdone = new DataTable();
                dtpaymentdone = RefreshTable("select * from hPayoutPayment where fPayout =" + fPayout + " and iActive=1");

                double PaidAmount = 0.00;

                if (dtpaymentdone.Rows.Count > 0)
                {
                    for (int i = 0; i < dtpaymentdone.Rows.Count; i++)
                    {
                        PaidAmount = PaidAmount + double.Parse(dtpaymentdone.Rows[i]["fAmount"].ToString());
                    }
                }


                if (PaidAmount >= PayableAmount)
                {

                    var obj = new
                    {
                        Status = "Success",
                        Message = "Payout Payment Added Sucessfully"
                    };

                    return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

                }
                else
                {
                    var obj = new
                    {
                        Status = "Part Payment",
                        Message = "Total Bill Not Paid Yet"
                    };

                    return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);
                }

            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        //** Payout Payment


        //Get Payment Details By Payout Id
        [Route("getPaymentDetailsByPayout/{Payoutid}")]
        [HttpGet]
        public HttpResponseMessage getPaymentDetailsByPayout(int Payoutid)
        {
            dynamic orderdata = new JArray();
            dynamic orderobj = new JObject();
            try
            {
                DataTable dtpayment = new DataTable();

                //dtpayment = RefreshTable("select hOrder.*, hMasterTable.sTableNo from hOrder INNER JOIN hMasterTable on hMasterTable.iId=hOrder.fTable where hOrder.fTable =" + Table + " and hOrder.iIsBillPaid=0 and hOrder.iACtive=1");
                //dtpayment = RefreshTable("select * from hPayoutEntry where iId =" + Payoutid + " and hOrder.iActive=1");
                dtpayment = RefreshTable("Select p.*,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterVendor v, hMasterPaymentMode pm, hPayoutType pt Where p.fPayoutType=pt.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.iId=" + Payoutid);


                for (int i = 0; i < dtpayment.Rows.Count; i++)
                {
                    orderobj = new JObject();

                    orderobj.iId = Int32.Parse(dtpayment.Rows[0]["iId"].ToString());
                    orderobj.fPayoutType = dtpayment.Rows[0]["fPayoutType"].ToString();
                    orderobj.sName = dtpayment.Rows[0]["sName"].ToString();
                    orderobj.fPaymentMode = dtpayment.Rows[0]["fPaymentMode"].ToString();
                    orderobj.sMOP = dtpayment.Rows[0]["sMOP"].ToString();
                    orderobj.sPerson = dtpayment.Rows[0]["sPerson"].ToString();
                    orderobj.fVendor = dtpayment.Rows[0]["fVendor"].ToString();
                    orderobj.sVendorName = dtpayment.Rows[0]["sVendorName"].ToString();
                    orderobj.dtDate = dtpayment.Rows[0]["dtDate"].ToString();
                    orderobj.sAmount = dtpayment.Rows[0]["sAmount"].ToString();
                    orderobj.sComment = dtpayment.Rows[0]["sComment"].ToString();


                    DataTable dtpaymentdone = new DataTable();
                    dtpaymentdone = RefreshTable("select * from hPayoutPayment where fPayout =" + Payoutid + "and iActive=1");

                    double OutStanding = 0.00;

                    if (dtpaymentdone.Rows.Count > 0)
                    {
                        //To Get Remaining Amount
                        double amount = 0.00;

                        for (int a = 0; a < dtpaymentdone.Rows.Count; a++)
                        {
                            amount = amount + Convert.ToDouble(dtpaymentdone.Rows[a]["fAmount"].ToString());
                        }

                        OutStanding = Convert.ToDouble(dtpayment.Rows[0]["sAmount"].ToString()) - amount;

                        orderobj.OutStanding = OutStanding.ToString();
                    }
                    else
                    {
                        OutStanding = Convert.ToDouble(dtpayment.Rows[0]["sAmount"].ToString());

                        orderobj.OutStanding = OutStanding.ToString();
                    }

                    orderobj.PayableAmount = OutStanding;

                    orderdata.Add(orderobj);
                }


                var obj = new
                {
                    status = "Success",
                    data = orderdata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Add Payout Payment
        [Route("AddPayoutPayment")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPayoutPayment(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fPayout = Convert.ToInt32(keyValue["fPayout"].ToString());

                // Bills & PAyments
                int fPayoutType = Convert.ToInt32(keyValue["fPayoutType"].ToString());

                //Cash / Card / Cheque
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());

                string sChequeNo = keyValue["sChequeNo"].ToString();
                string sChequeDate = keyValue["sChequeDate"].ToString();
                int iIsChequeCleared = 0;

                string fAmount = keyValue["fAmount"].ToString();
                int fPayoutAccount = Convert.ToInt32(keyValue["fPayoutAccount"].ToString());
                int user = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;

                string query = "insert into hPayoutPayment(fPayout,fPayoutType,fPaymentMode,fAmount,sChequeNo,sChequeDate,iIsChequeCleared,fPayoutAccount,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fPayout,@fPayoutType,@fPaymentMode,@fAmount,@sChequeNo,@sChequeDate,@iIsChequeCleared,@fPayoutAccount,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@fPayout", OleDbType.Integer).Value = fPayout;
                    com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = fPayoutType;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                    com.Parameters.Add("@fAmount", OleDbType.VarChar).Value = fAmount;
                    com.Parameters.Add("@sChequeNo", OleDbType.VarChar).Value = sChequeNo;
                    com.Parameters.Add("@sChequeDate", OleDbType.VarChar).Value = sChequeDate;
                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = iIsChequeCleared;
                    com.Parameters.Add("@fPayoutAccount", OleDbType.Integer).Value = fPayoutAccount;
                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                //To Subtract Money From Account
                if (fPaymentMode != 1)
                {
                    OleDbConnection con1 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId=" + fPayoutAccount, con1);

                    DataTable dt = new DataTable();

                    da.Fill(dt);

                    con1.Close();

                    Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                    amount = amount - Convert.ToDouble(fAmount);

                    string query2 = "update hAccount set sAmount=" + amount + " where iId = " + fPayoutAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }
                }


                //To Get Payable Amount
                DataTable dtPayout = new DataTable();
                dtPayout = RefreshTable("select * from hPayoutEntry where iId =" + fPayout + " and iActive=1");

                var PayableAmount = Convert.ToDouble(dtPayout.Rows[0]["sAmount"].ToString());

                DataTable dtpaymentdone = new DataTable();
                dtpaymentdone = RefreshTable("select * from hPayoutPayment where fPayout =" + fPayout + " and iActive=1");

                double PaidAmount = 0.00;

                if (dtpaymentdone.Rows.Count > 0)
                {
                    for (int i = 0; i < dtpaymentdone.Rows.Count; i++)
                    {
                        PaidAmount = PaidAmount + double.Parse(dtpaymentdone.Rows[i]["fAmount"].ToString());
                    }
                }


                if (PaidAmount >= PayableAmount)
                {

                    var obj = new
                    {
                        Status = "Success",
                        Message = "Payout Payment Added Sucessfully"
                    };

                    return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

                }
                else
                {
                    var obj = new
                    {
                        Status = "Part Payment",
                        Message = "Total Bill Not Paid Yet"
                    };

                    return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);
                }


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get All Payments By Payout Id 
        [Route("getPayoutPaymentsByPayoutId/{Payoutid}")]
        [HttpGet]
        public HttpResponseMessage getPayoutPaymentsByPayoutId(int Payoutid)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.*,pm.sMOP,a.sAccount FROM hPayoutPayment p, hMasterPaymentMode pm, hAccount a Where p.fPayoutAccount=a.iId and p.fPaymentMode=pm.iId and p.iActive = 1 and p.fPayout=" + Payoutid, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    var iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.fAmount = dt.Rows[i]["fAmount"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();

                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();


                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
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
                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }




        //** PayIn Calls 



        // Add Payin     
        [Route("AddPayin1")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPayin1(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                var PayinId = 0;

                int fBranch = 1;
                int fPayinType = Convert.ToInt32(keyValue["fPayinType"].ToString());
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());
                string sPerson = keyValue["sPerson"].ToString();
                string dtDate = keyValue["dtDate"].ToString();
                string sAmount = keyValue["sAmount"].ToString();
                string sComment = keyValue["sComment"].ToString();
                int user = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;

                string query2 = "Select @@Identity";
                string query = "insert into hPayinEntry(fBranch,fPayinType,fPaymentMode,sPerson,dtDate,sAmount,sComment,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayinType,@fPaymentMode,@sPerson,@dtDate,@sAmount,@sComment,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;

                    com.Parameters.Add("@fPayinType", OleDbType.Integer).Value = fPayinType;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;

                    com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                    com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                    com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sAmount;
                    com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;

                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;


                    con.Open();
                    var rows = com.ExecuteNonQuery();
                    com.CommandText = query2;
                    PayinId = (int)com.ExecuteScalar();
                    con.Close();
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payin Added Sucessfully",
                    PayinId = PayinId
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get Payin
        [Route("getPayin1")]
        [HttpGet]
        public HttpResponseMessage getPayin1()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.*,pm.sMOP,pt.sName FROM hPayinEntry p, hMasterPaymentMode pm, hPayinType pt Where p.fPayinType=pt.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    var Payinid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                    tableobj.iId = Payinid;
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    //To Get Payout Payment Details
                    /*                    DataTable dtPayin = new DataTable();
                                        dtPayin = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayinPayment p, hMasterPaymentMode pm,hAccount a, hPayinType pt Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayin=" + Payinid);

                                        var PaymentMode = "";

                                        for (int j = 0; j < dtPayin.Rows.Count; j++)
                                        {
                                            var mop = dtPayin.Rows[j]["sMOP"].ToString();

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


                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payin By Id
        [Route("getPayinById1/{id}")]
        [HttpGet]
        public HttpResponseMessage getPayinById1(int id)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sPerson,p.dtDate,p.sAmount,p.sComment,pm.sMOP,pt.sName FROM hPayinEntry p, hMasterPaymentMode pm, hPayinType pt   Where p.fPayinType=pt.iId and p.fPaymentMode=pm.iId and  p.iActive = 1  and p.iId=" + id, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();


                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payin By Keyword
        [Route("getPayinByKeyword1/{keyword}")]
        [HttpGet]
        public HttpResponseMessage getPayinByKeyword1(string keyword)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sPerson,p.dtDate,p.sAmount,p.sComment,pm.sMOP,pt.sName FROM hPayinEntry p, hMasterPaymentMode pm, hPayinType pt   Where p.fPayinType=pt.iId and p.fPaymentMode=pm.iId and  p.iActive = 1  and ( p.sPerson LIKE '%" + keyword + "%' or pm.sMOP LIKE '%" + keyword + "%' or pt.sName LIKE '%" + keyword + "%') ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Delete payin
        [Route("DeletePayin1")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeletePayin1(HttpRequestMessage request)
        {

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                int UserId = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;

                int iActive = 0;

                string query = "update hPayinEntry set iActive='" + iActive + "',dtUpdatedBy='" + UserId + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iActive", OleDbType.VarChar).Value = iActive;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }


                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayinPayment  Where fPayin=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();


                //To Remove Amount From Account
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Double amount = Convert.ToDouble(dt.Rows[i]["fAmount"].ToString());
                    Double fPayinAccount = Convert.ToDouble(dt.Rows[i]["fPayinAccount"].ToString());
                    int fPaymentMode = Convert.ToInt32(dt.Rows[i]["fPaymentMode"].ToString());
                    int iIsChequeCleared = Convert.ToInt32(dt.Rows[i]["iIsChequeCleared"].ToString());

                    if (fPaymentMode == 1 && iIsChequeCleared == 0)
                    {

                    }
                    else
                    {
                        OleDbConnection con11 = new OleDbConnection(str);
                        con1.Open();
                        OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayinAccount, con11);

                        DataTable dt11 = new DataTable();

                        da11.Fill(dt11);

                        con1.Close();
                        Double amount11 = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());

                        amount = amount11 - amount;

                        string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayinAccount;

                        using (OleDbConnection con2 = new OleDbConnection(str))
                        {
                            OleDbCommand com2 = new OleDbCommand(query2, con2);

                            com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                            con2.Open();
                            var rows = com2.ExecuteNonQuery();

                            con2.Close();
                        }
                    }
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payin Deleted Sucessfully"
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }



        //** PayIn Payment


        //Get Payment Details By Payin Id
        [Route("getPaymentDetailsByPayin/{Payinid}")]
        [HttpGet]
        public HttpResponseMessage getPaymentDetailsByPayin(int Payinid)
        {
            dynamic orderdata = new JArray();
            dynamic orderobj = new JObject();
            try
            {
                DataTable dtpayment = new DataTable();

                dtpayment = RefreshTable("Select p.*,pt.sName,pm.sMOP FROM hPayinEntry p, hMasterPaymentMode pm, hPayinType pt Where p.fPayinType=pt.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.iId=" + Payinid);

                for (int i = 0; i < dtpayment.Rows.Count; i++)
                {
                    orderobj = new JObject();

                    orderobj.iId = Int32.Parse(dtpayment.Rows[0]["iId"].ToString());
                    orderobj.fPayinType = dtpayment.Rows[0]["fPayinType"].ToString();
                    orderobj.sName = dtpayment.Rows[0]["sName"].ToString();
                    orderobj.fPayinType = dtpayment.Rows[0]["fPaymentMode"].ToString();
                    orderobj.sMOP = dtpayment.Rows[0]["sMOP"].ToString();
                    orderobj.sPerson = dtpayment.Rows[0]["sPerson"].ToString();
                    orderobj.dtDate = dtpayment.Rows[0]["dtDate"].ToString();
                    orderobj.sAmount = dtpayment.Rows[0]["sAmount"].ToString();
                    orderobj.sComment = dtpayment.Rows[0]["sComment"].ToString();

                    DataTable dtpaymentdone = new DataTable();
                    dtpaymentdone = RefreshTable("select * from hPayinPayment where fPayin =" + Payinid + "and iActive=1");

                    double OutStanding = 0.00;

                    if (dtpaymentdone.Rows.Count > 0)
                    {
                        //To Get Remaining Amount
                        double amount = 0.00;

                        for (int a = 0; a < dtpaymentdone.Rows.Count; a++)
                        {
                            amount = amount + Convert.ToDouble(dtpaymentdone.Rows[a]["fAmount"].ToString());
                        }

                        OutStanding = Convert.ToDouble(dtpayment.Rows[0]["sAmount"].ToString()) - amount;

                        orderobj.OutStanding = OutStanding.ToString();
                    }
                    else
                    {
                        OutStanding = Convert.ToDouble(dtpayment.Rows[0]["sAmount"].ToString());

                        orderobj.OutStanding = OutStanding.ToString();
                    }

                    orderobj.PayableAmount = OutStanding;

                    orderdata.Add(orderobj);
                }


                var obj = new
                {
                    status = "Success",
                    data = orderdata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Add Payin Payment
        [Route("AddPayinPayment")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPayinPayment(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fPayin = Convert.ToInt32(keyValue["fPayin"].ToString());

                //Cash / Card / Cheque
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());

                string sChequeNo = keyValue["sChequeNo"].ToString();
                string sChequeDate = keyValue["sChequeDate"].ToString();
                int iIsChequeCleared = 0;

                string fAmount = keyValue["fAmount"].ToString();
                int fPayinAccount = Convert.ToInt32(keyValue["fPayinAccount"].ToString());
                int user = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;

                string query = "insert into hPayinPayment(fPayin,fPaymentMode,fAmount,sChequeNo,sChequeDate,iIsChequeCleared,fPayinAccount,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fPayout,@fPaymentMode,@fAmount,@sChequeNo,@sChequeDate,@iIsChequeCleared,@fPayoutAccount,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@fPayin", OleDbType.Integer).Value = fPayin;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                    com.Parameters.Add("@fAmount", OleDbType.VarChar).Value = fAmount;
                    com.Parameters.Add("@sChequeNo", OleDbType.VarChar).Value = sChequeNo;
                    com.Parameters.Add("@sChequeDate", OleDbType.VarChar).Value = sChequeDate;
                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = iIsChequeCleared;
                    com.Parameters.Add("@fPayinAccount", OleDbType.Integer).Value = fPayinAccount;
                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                //To Add Monet To Account
                if (fPaymentMode != 1)
                {
                    OleDbConnection con1 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId=" + fPayinAccount, con1);

                    DataTable dt = new DataTable();

                    da.Fill(dt);

                    con1.Close();

                    Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                    amount = amount + Convert.ToDouble(fAmount);

                    string query2 = "update hAccount set sAmount=" + amount + " where iId = " + fPayinAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }

                }


                //To Get Payable Amount
                DataTable dtPayout = new DataTable();
                dtPayout = RefreshTable("select * from hPayinEntry where iId =" + fPayin + " and iActive=1");

                var PayableAmount = Convert.ToDouble(dtPayout.Rows[0]["sAmount"].ToString());

                DataTable dtpaymentdone = new DataTable();
                dtpaymentdone = RefreshTable("select * from hPayinPayment where fPayin =" + fPayin + " and iActive=1");

                double PaidAmount = 0.00;

                if (dtpaymentdone.Rows.Count > 0)
                {
                    for (int i = 0; i < dtpaymentdone.Rows.Count; i++)
                    {
                        PaidAmount = PaidAmount + double.Parse(dtpaymentdone.Rows[i]["fAmount"].ToString());
                    }
                }


                if (PaidAmount >= PayableAmount)
                {

                    var obj = new
                    {
                        Status = "Success",
                        Message = "Payin Payment Added Sucessfully"
                    };

                    return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

                }
                else
                {
                    var obj = new
                    {
                        Status = "Part Payment",
                        Message = "Total Bill Not Paid Yet"
                    };

                    return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);
                }


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get All Payments By fPayin Id 
        [Route("getPayinPaymentsByfPayinId/{fPayinid}")]
        [HttpGet]
        public HttpResponseMessage getPayinPaymentsByfPayinId(int fPayinid)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.*,pm.sMOP,a.sAccount FROM hPayinPayment p, hMasterPaymentMode pm, hAccount a Where p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fPayin=" + fPayinid, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    var iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.fAmount = dt.Rows[i]["fAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
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

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }



        //** Cheque Clearance [New]


        // Get Payout Cheque Entries
        [Route("getPayoutChequeEntries1")]
        [HttpGet]
        public HttpResponseMessage getPayoutChequeEntries1()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.*,pe.fPayoutType,pe.fVendor,pe.dtDate,pe.sPerson,pm.sMOP,a.sAccount,v.sVendorName,pt.sName FROM hPayoutPayment p, hPayoutEntry pe,hMasterPaymentMode pm,hAccount a, hMasterVendor v, hPayoutType pt Where pe.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and pe.fVendor=v.iId and p.fPaymentMode=pm.iId and p.iActive = 1 and p.fPayout=pe.iId and p.fPaymentMode=1 and p.iIsChequeCleared = 0", con);// and p.iIsChequeCleared != 1


                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();


                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.fAmount = dt.Rows[i]["fAmount"].ToString();
                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Payout Cheque Clearence
        [Route("PayoutCheque1")]
        [HttpPost]
        public async Task<HttpResponseMessage> PayoutCheque1(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                var date = Convert.ToString(DateTime.Now);

                int UserId = Convert.ToInt32(keyValue["UserId"].ToString());

                string query = "update hPayoutPayment set iIsChequeCleared='" + 1 + "', dtChequeClearanceDate='" + date + "',dtUpdatedBy='" + UserId + "'  where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@dtChequeClearanceDate", OleDbType.VarChar).Value = date;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();

                }


                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayoutPayment  Where  iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();
                Double amount = Convert.ToDouble(dt.Rows[0]["fAmount"].ToString());
                Double fPayoutAccount = Convert.ToDouble(dt.Rows[0]["fPayoutAccount"].ToString());


                OleDbConnection con11 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayoutAccount, con11);

                DataTable dt11 = new DataTable();

                da11.Fill(dt11);

                con1.Close();
                Double amount11 = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());

                amount = amount11 - amount;

                string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayoutAccount;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com2 = new OleDbCommand(query2, con2);

                    com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                    con2.Open();
                    var rows = com2.ExecuteNonQuery();

                    con2.Close();
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Cheque Cleared Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get PayIn Cheque Entries
        [Route("getPayinChequeEntries1")]
        [HttpGet]
        public HttpResponseMessage getPayinChequeEntries1()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.*,pe.fPayinType,pe.sPerson,pe.dtDate,pm.sMOP,a.sAccount,pt.sName FROM hPayinPayment p, hPayinEntry pe, hMasterPaymentMode pm,hAccount a, hPayinType pt   Where pe.fPayinType=pt.iId and p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fPayin=pe.iId and p.fPaymentMode=1 and p.iIsChequeCleared = 0", con);// and p.iIsChequeCleared != 1

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.fAmount = dt.Rows[i]["fAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Payin Cheque Clearence
        [Route("PayinCheque1")]
        [HttpPost]
        public async Task<HttpResponseMessage> PayinCheque1(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                var date = Convert.ToString(DateTime.Now);

                int UserId = Convert.ToInt32(keyValue["UserId"].ToString());

                string query = "update hPayinPayment set iIsChequeCleared='" + 1 + "', dtChequeClearanceDate='" + date + "',dtUpdatedBy='" + UserId + "'  where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@dtChequeClearanceDate", OleDbType.VarChar).Value = date;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayinPayment  Where  iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();
                Double amount = Convert.ToDouble(dt.Rows[0]["fAmount"].ToString());
                Double fPayinAccount = Convert.ToDouble(dt.Rows[0]["fPayinAccount"].ToString());

                OleDbConnection con11 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayinAccount, con11);

                DataTable dt11 = new DataTable();

                da11.Fill(dt11);

                con1.Close();
                Double amount11 = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());

                amount = amount11 + amount;

                string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayinAccount;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com2 = new OleDbCommand(query2, con2);

                    com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                    con2.Open();
                    var rows = com2.ExecuteNonQuery();

                    con2.Close();
                }

                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Cheque Cleared Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }



        // Transaction Calls 

        // Transfer Balance     
        [Route("AddTransaction")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddTransaction(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fBranch = 1;
                int fAccount = Convert.ToInt32(keyValue["fAccount"].ToString());
                int tAccount = Convert.ToInt32(keyValue["tAccount"].ToString());
                string dtDate = keyValue["dtDate"].ToString();
                string sAmount = keyValue["sAmount"].ToString();
                string sComment = keyValue["sComment"].ToString();

                int user = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;

                string query = "insert into hAccountTransactions(fBranch,fAccount,tAccount,dtDate,sAmount,sComment,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fAccount,@tAccount,@dtDate,@sAmount,@sComment,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;

                    com.Parameters.Add("@fAccount", OleDbType.Integer).Value = fAccount;
                    com.Parameters.Add("@tAccount", OleDbType.VarChar).Value = tAccount;
                    com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                    com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sAmount;
                    com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;

                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;


                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

             
                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId="+ fAccount, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();

                Double amount=Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                amount = amount - Convert.ToDouble(sAmount);

                string query2 = "update hAccount set sAmount=" + amount + " where iId = " + fAccount;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com2 = new OleDbCommand(query2, con2);

                    com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                    con2.Open();
                    var rows = com2.ExecuteNonQuery();

                    con2.Close();
                }


                OleDbConnection con3 = new OleDbConnection(str);
                con3.Open();
                OleDbDataAdapter da3 = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId=" + tAccount, con1);

                DataTable dt3 = new DataTable();

                da3.Fill(dt3);

                con3.Close();

                Double amount3 = Convert.ToDouble(dt3.Rows[0]["sAmount"].ToString());
                amount3 = amount3 + Convert.ToDouble(sAmount);

                string query4 = "update hAccount set sAmount=" + amount3 + " where iId = " + tAccount;

                using (OleDbConnection con4 = new OleDbConnection(str))
                {
                    OleDbCommand com4 = new OleDbCommand(query4, con4);

                    com4.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount3;

                    con4.Open();
                    var rows = com4.ExecuteNonQuery();

                    con4.Close();
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Transaction Added Sucessfully"
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get Transcactions
        [Route("getTransaction")]
        [HttpGet]
        public HttpResponseMessage getTransaction()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select t.iId,t.fBranch,t.fAccount,t.tAccount,t.dtDate,t.sAmount,t.sComment,a.sAccount,a1.sAccount FROM hAccountTransactions t, hAccount a , hAccount a1  Where t.fAccount=a.iId and t.tAccount=a1.iId and  t.iActive = 1 ORDER BY t.iId DESC", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();
                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fBranch = dt.Rows[i]["fBranch"].ToString();
                    tableobj.fAccount = dt.Rows[i]["a.sAccount"].ToString();
                    tableobj.tAccount = dt.Rows[i]["a1.sAccount"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payin By Id
        [Route("getTransactionById/{id}")]
        [HttpGet]
        public HttpResponseMessage getTransactionById(int id)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select t.iId,t.fBranch,t.fAccount,t.tAccount,t.dtDate,t.sAmount,t.sComment,a.sAccount,a1.sAccount FROM hAccountTransactions t, hAccount a , hAccount a1  Where t.fAccount=a.iId and t.tAccount=a1.iId and  t.iActive = 1 and t.iId=" + id, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fBranch = dt.Rows[i]["fBranch"].ToString();
                    tableobj.fAccount = dt.Rows[i]["a.sAccount"].ToString();
                    tableobj.tAccount = dt.Rows[i]["a1.sAccount"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }



        //get Transaction By Keyword
        [Route("getTransactionByKeyword")]
        [HttpPost]
        public async Task<HttpResponseMessage> getKitchenTransactionByDate(HttpRequestMessage request)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();

            try
            {
                var details = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(details);

                DateTime FromDate = Convert.ToDateTime(keyValue["FromDate"].ToString());
                FromDate = FromDate.Date;

                DateTime ToDate = Convert.ToDateTime(keyValue["ToDate"].ToString());
                ToDate = ToDate.Date;

                string keyword = keyValue["keyword"].ToString();

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select t.iId,t.fBranch,t.fAccount,t.tAccount,t.dtDate,t.sAmount,t.sComment,a.sAccount,a1.sAccount FROM hAccountTransactions t, hAccount a , hAccount a1  Where t.fAccount=a.iId and t.tAccount=a1.iId and  t.iActive = 1 and t.dtDate >= #" + FromDate + "# and t.dtDate <= #" + ToDate + "#" + " and ( a.sAccount LIKE '%" + keyword + "%' or a1.sAccount LIKE '%" + keyword + "%' or t.sComment LIKE '%" + keyword + "%') ORDER BY t.iId DESC", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fBranch = dt.Rows[i]["fBranch"].ToString();
                    tableobj.fAccount = dt.Rows[i]["a.sAccount"].ToString();
                    tableobj.tAccount = dt.Rows[i]["a1.sAccount"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }

        //get Transaction By Date
        [Route("getTransactionByDate")]
        [HttpPost]
        public async Task<HttpResponseMessage> getTransactionByDate(HttpRequestMessage request)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();

            try
            {
                var details = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(details);

                DateTime FromDate = Convert.ToDateTime(keyValue["FromDate"].ToString());
                FromDate = FromDate.Date;

                DateTime ToDate = Convert.ToDateTime(keyValue["ToDate"].ToString());
                ToDate = ToDate.Date;


                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select t.iId,t.fBranch,t.fAccount,t.tAccount,t.dtDate,t.sAmount,t.sComment,a.sAccount,a1.sAccount FROM hAccountTransactions t, hAccount a , hAccount a1  Where t.fAccount=a.iId and t.tAccount=a1.iId and  t.iActive = 1 and t.dtDate >= #" + FromDate + "# and t.dtDate <= #" + ToDate + "#" + "ORDER BY t.iId DESC", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fBranch = dt.Rows[i]["fBranch"].ToString();
                    tableobj.fAccount = dt.Rows[i]["a.sAccount"].ToString();
                    tableobj.tAccount = dt.Rows[i]["a1.sAccount"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }

        // Get Transaction By Keyword
        [Route("getTransactionByKeyword/{keyword}")]
        [HttpGet]
        public HttpResponseMessage getTransactionByKeyword(string keyword)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select t.iId,t.fBranch,t.fAccount,t.tAccount,t.dtDate,t.sAmount,t.sComment,a.sAccount,a1.sAccount FROM hAccountTransactions t, hAccount a , hAccount a1  Where t.fAccount=a.iId and t.tAccount=a1.iId and  t.iActive = 1 and ( t.dtDate LIKE '%" + Convert.ToDateTime(keyword).Date + "%' or a.sAccount LIKE '%" + keyword + "%' or a1.sAccount LIKE '%" + keyword + "%' or t.sComment LIKE '%" + keyword + "%') ORDER BY t.iId DESC", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fBranch = dt.Rows[i]["fBranch"].ToString();
                    tableobj.fAccount = dt.Rows[i]["a.sAccount"].ToString();
                    tableobj.tAccount = dt.Rows[i]["a1.sAccount"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Delete Transaction
        [Route("DeleteTransactions")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeleteTransactions(HttpRequestMessage request)
        {  
          try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                int UserId = Convert.ToInt32(keyValue["UserId"].ToString());
                DateTime date = DateTime.Now;
                int iActive = 0;

                string query = "update hAccountTransactions set iActive='" + iActive + "',dtUpdatedBy='" + UserId + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iActive", OleDbType.VarChar).Value = iActive;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }


                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccountTransactions  Where iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();

                Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                int fAccount = Convert.ToInt32(dt.Rows[0]["fAccount"].ToString());
                int tAccount = Convert.ToInt32(dt.Rows[0]["tAccount"].ToString());

                OleDbConnection con11 = new OleDbConnection(str);
                con11.Open();
                OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where iId=" + fAccount, con11);

                DataTable dt11 = new DataTable();

                da11.Fill(dt11);

                con11.Close();

                Double famount = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());
                famount = famount + amount;

                string query2 = "update hAccount set sAmount='" + famount + "' where iId = " + fAccount;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com2 = new OleDbCommand(query2, con2);

                    com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = famount;

                    con2.Open();
                    var rows = com2.ExecuteNonQuery();

                    con2.Close();
                }

                OleDbConnection con111 = new OleDbConnection(str);
                con111.Open();
                OleDbDataAdapter da111 = new OleDbDataAdapter("Select * FROM hAccount  Where iId=" + tAccount, con111);

                DataTable dt111 = new DataTable();

                da111.Fill(dt111);

                con111.Close();

                Double tamount = Convert.ToDouble(dt111.Rows[0]["sAmount"].ToString());
                tamount = tamount-amount;

                string query21 = "update hAccount set sAmount='" + tamount + "' where iId = " + tAccount;

                using (OleDbConnection con21 = new OleDbConnection(str))
                {
                    OleDbCommand com21 = new OleDbCommand(query21, con21);

                    com21.Parameters.Add("@sAmount", OleDbType.VarChar).Value = tamount;

                    con21.Open();
                    var rows = com21.ExecuteNonQuery();

                    con21.Close();
                }

                var obj = new
                {
                    Status = "Success",
                    Message = "Transaction Deleted Sucessfully"
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }




        //** Other Master


        // Get Account
        [Route("getAccount")]
        [HttpGet]
        public HttpResponseMessage getAccount()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payout Type
        [Route("getPayoutType")]
        [HttpGet]
        public HttpResponseMessage getPayoutType()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayoutType  Where iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();
                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.sName = dt.Rows[i]["sName"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payin Type
        [Route("getPayinType")]
        [HttpGet]
        public HttpResponseMessage getPayinType()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayinType  Where iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();
                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.sName = dt.Rows[i]["sName"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Borrowed Money Entries
        [Route("getBorrowedMoneyEntries")]
        [HttpGet]
        public HttpResponseMessage getBorrowedMoneyEntries()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayin  Where iActive = 1 && fPayinType=1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Advance Payment Entries
        [Route("getAdvancePaymentEntries")]
        [HttpGet]
        public HttpResponseMessage getAdvancePaymentEntries()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayout  Where iActive = 1 && fPayoutType=2 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }




        //** Material Bills **//


        //Add Material Bill
        [Route("AddMaterialBill")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddMaterialBill(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fPendingPayout = 0;
                int fVendor = Convert.ToInt32(keyValue["fVendor"].ToString());
                string sBillNo = keyValue["sBillNo"].ToString();

                DateTime dtDate = Convert.ToDateTime(keyValue["dtDate"].ToString()).Date;

                DateTime date = DateTime.Now;
                int user = Convert.ToInt32(keyValue["UserId"].ToString());

                //To Send Final Amount In Pending Payout Table If Payment Mode is Credit
                string FinalAmount = keyValue["FinalAmount"].ToString();

                //To Add Multiple Bills At Once
                var MaterialBills = keyValue["MaterialBills"];


                //To Add Entry In Pending Payout

                //To Get Contact Person By Vendor
                DataTable dtVendor = new DataTable();
                dtVendor = RefreshTable("select * from hMasterVendor where iId =" + fVendor + " and iActive=1");

                var sPerson = dtVendor.Rows[0]["sContactPerson"].ToString();

                var sComment = "Vendor Bills";

                string query2 = "Select @@Identity";
                string query1 = "insert into hPendingPayout(fBranch,fPayout,fPayoutType,fPaymentMode,sPerson,fVendor,dtDate,sAmount,sComment,iIsPaid,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayout,@fPayoutType,@fPaymentMode,@sPerson,@fVendor,@dtDate,@sAmount,@sComment,@iIsPaid,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query1, con);

                    com.Parameters.Add("@fBranch", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@fPayout", OleDbType.Integer).Value = 0;
                    com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = 7;
                    com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                    com.Parameters.Add("@fVendor", OleDbType.Integer).Value = fVendor;
                    com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                    com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = FinalAmount;
                    com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;
                    com.Parameters.Add("@iIsPaid", OleDbType.Integer).Value = 0;
                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;

                    con.Open();
                    var rows = com.ExecuteNonQuery();
                    com.CommandText = query2;
                    fPendingPayout = (int)com.ExecuteScalar();
                    con.Close();
                }


                DataTable dtMaterialBills = getTable(MaterialBills);

                for (int i = 0; i < dtMaterialBills.Rows.Count; i++)
                {
                    var fMaterial = Convert.ToInt32(dtMaterialBills.Rows[i]["fMaterial"].ToString());
                    var fUnit = Convert.ToInt32(dtMaterialBills.Rows[i]["fUnit"].ToString());
                    var sPrice = Convert.ToInt32(dtMaterialBills.Rows[i]["sPrice"].ToString());
                    var sQuantity = Convert.ToInt32(dtMaterialBills.Rows[i]["sQuantity"].ToString());

                    var ExpiryDate = dtMaterialBills.Rows[i]["dtExpiryDate"].ToString();
                    var dtExpiryDate = "";

                    if (ExpiryDate != "")
                    {
                        dtExpiryDate = Convert.ToDateTime(ExpiryDate).ToString();
                    }


                    //fVendor, dtDate, fPaymentMode, (FinalAmount), [fMaterial, fUnit, sQuantity, sPrice, sTotalAmount]
                    string query = "insert into hMaterialBills(fPendingPayout,fVendor,sBillNo,dtDate,fMaterial,fUnit,sPrice,sQuantity,dtExpiryDate,dtCreatedOn,dtUpdatedOn,dtCreatedBY,dtUpdatedBy,iVersion,iActive) Values (fPendingPayout,@fVendor,@sBillNo,@dtDate,@fMaterial,@fUnit,@sPrice,@sQuantity,@dtExpiryDate,@dtCreatedOn,@dtUpdatedOn,@dtCreatedBY,@dtUpdatedBy,@iVersion,@iActive)";

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query, con);

                        com.Parameters.Add("@fPendingPayout", OleDbType.Integer).Value = fPendingPayout;
                        com.Parameters.Add("@fVendor", OleDbType.Integer).Value = fVendor;
                        com.Parameters.Add("@sBillNo", OleDbType.VarChar).Value = sBillNo;
                        com.Parameters.Add("@dtDate", OleDbType.Date).Value = dtDate;

                        com.Parameters.Add("@fMaterial", OleDbType.Integer).Value = fMaterial;
                        com.Parameters.Add("@fUnit", OleDbType.Integer).Value = fUnit;
                        com.Parameters.Add("@sPrice", OleDbType.Integer).Value = sPrice;
                        com.Parameters.Add("@sQuantity", OleDbType.VarChar).Value = sQuantity;
                        com.Parameters.Add("@dtExpiryDate", OleDbType.VarChar).Value = dtExpiryDate;

                        com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                        com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;

                        com.Parameters.Add("@dtCreatedBY", OleDbType.VarChar).Value = user;
                        com.Parameters.Add("@dtUpdatedBy", OleDbType.VarChar).Value = user;
                        com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                        com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;


                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }


                    //Check Inv Type Of Hotel And Add Accordingly

                    //To Get Hotel Details
                    DataTable dtHotel = new DataTable();
                    dtHotel = RefreshTable("select * from hHotel where iActive=1");

                    int fInventoryType = Convert.ToInt32(dtHotel.Rows[0]["fInventoryType"].ToString());

                    //To Get Material Stock
                    DataTable dtMaterial = new DataTable();
                    dtMaterial = RefreshTable("select * from hMasterMaterial where iActive=1 and iId =" + fMaterial);

                    //To Add In Kitchen & Main Stock If inv type = 1 Else Add in Only Main Stock
                    if (fInventoryType == 1)
                    {
                        //Single Layer Inverntory

                        int sMainStock = Convert.ToInt32(dtMaterial.Rows[0]["sMainStock"].ToString());
                        int sKitchenStock = Convert.ToInt32(dtMaterial.Rows[0]["sKitchenStock"].ToString());

                        sMainStock += Convert.ToInt32(sQuantity);
                        sKitchenStock += Convert.ToInt32(sQuantity);

                        string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "',sKitchenStock='" + sKitchenStock + "' where iId = " + fMaterial;

                        using (OleDbConnection con = new OleDbConnection(str))
                        {
                            OleDbCommand com = new OleDbCommand(query10, con);

                            con.Open();
                            var rows = com.ExecuteNonQuery();

                            con.Close();
                        }


                        //To Add Entry In Material Transaction Table ( Kitchen Transactions )

                        //dtDate, fMaterial, fUnit, sQuantity, dtExpiryDate
                        string query0 = "insert into hMaterialTransaction(dtDate,fMaterial,fUnit,sQuantity,dtExpiryDate,dtCreatedOn,dtUpdatedOn,dtCreatedBY,dtUpdatedBy,iVersion,iActive) Values (@dtDate,@fMaterial,@fUnit,@sQuantity,@dtExpiryDate,@dtCreatedOn,@dtUpdatedOn,@dtCreatedBY,@dtUpdatedBy,@iVersion,@iActive)";

                        using (OleDbConnection con = new OleDbConnection(str))
                        {
                            OleDbCommand com = new OleDbCommand(query0, con);

                            com.Parameters.Add("@dtDate", OleDbType.Date).Value = dtDate;

                            com.Parameters.Add("@fMaterial", OleDbType.Integer).Value = fMaterial;
                            com.Parameters.Add("@fUnit", OleDbType.Integer).Value = fUnit;
                            com.Parameters.Add("@sQuantity", OleDbType.VarChar).Value = sQuantity;
                            com.Parameters.Add("@dtExpiryDate", OleDbType.VarChar).Value = dtExpiryDate;

                            com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                            com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;

                            com.Parameters.Add("@dtCreatedBY", OleDbType.VarChar).Value = user;
                            com.Parameters.Add("@dtUpdatedBy", OleDbType.VarChar).Value = user;
                            com.Parameters.Add("@iVersion", OleDbType.Integer).Value = 1;
                            com.Parameters.Add("@iActive", OleDbType.Integer).Value = 1;


                            con.Open();
                            var rows = com.ExecuteNonQuery();

                            con.Close();
                        }

                    }
                    else
                    {
                        //Multi Layer Inventory

                        int sMainStock = Convert.ToInt32(dtMaterial.Rows[0]["sMainStock"].ToString());

                        sMainStock += Convert.ToInt32(sQuantity);


                        string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "' where iId = " + fMaterial;

                        using (OleDbConnection con = new OleDbConnection(str))
                        {
                            OleDbCommand com = new OleDbCommand(query10, con);

                            con.Open();
                            var rows = com.ExecuteNonQuery();

                            con.Close();
                        }
                    }

                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Material Bill Added Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        //Get Material
        [Route("getMaterialBill")]
        [HttpGet]
        public HttpResponseMessage getMaterialBill()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select mb.*, mm.sMaterialName, mu.sUnit, mv.sVendorName, mv.sContactPerson  FROM hMaterialbills mb, hMasterMaterial mm, hMasterUnit mu, hMasterVendor mv Where mb.fMaterial = mm.iId and mb.fVendor = mv.iId and mb.fUnit = mu.iId and mb.iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                //fVendor, dtDate, (FinalAmount), [fMaterial, fUnit, sQuantity, sPrice] sMaterialName 
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sBillNo = dt.Rows[i]["sBillNo"].ToString();

                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.sContactPerson = dt.Rows[i]["sContactPerson"].ToString();

                    tableobj.fMaterial = dt.Rows[i]["fMaterial"].ToString();
                    tableobj.sMaterialName = dt.Rows[i]["sMaterialName"].ToString();

                    tableobj.fUnit = dt.Rows[i]["fUnit"].ToString();
                    tableobj.sUnit = dt.Rows[i]["sUnit"].ToString();

                    tableobj.sQuantity = dt.Rows[i]["sQuantity"].ToString();
                    tableobj.sPrice = dt.Rows[i]["sPrice"].ToString();
                    tableobj.dtExpiryDate = dt.Rows[i]["dtExpiryDate"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Get Material By Id
        [Route("getMaterialBillById/{id}")]
        [HttpGet]
        public HttpResponseMessage getMaterialBillById(int id)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select mb.*, mm.sMaterialName, mu.sUnit, mv.sVendorName, mv.sContactPerson  FROM hMaterialbills mb, hMasterMaterial mm, hMasterUnit mu, hMasterVendor mv Where mb.fMaterial = mm.iId and mb.fVendor = mv.iId and mb.fUnit = mu.iId and mb.iActive = 1 and mb.iId=" + id, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[0]["iId"].ToString());
                    tableobj.dtDate = dt.Rows[0]["dtDate"].ToString();
                    tableobj.sBillNo = dt.Rows[0]["sBillNo"].ToString();

                    tableobj.fVendor = dt.Rows[0]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[0]["sVendorName"].ToString();
                    tableobj.sContactPerson = dt.Rows[0]["sContactPerson"].ToString();

                    tableobj.fMaterial = dt.Rows[0]["fMaterial"].ToString();
                    tableobj.sMaterialName = dt.Rows[0]["sMaterialName"].ToString();

                    tableobj.fUnit = dt.Rows[0]["fUnit"].ToString();
                    tableobj.sUnit = dt.Rows[0]["sUnit"].ToString();

                    tableobj.sQuantity = dt.Rows[0]["sQuantity"].ToString();
                    tableobj.sPrice = dt.Rows[0]["sPrice"].ToString();
                    tableobj.dtExpiryDate = dt.Rows[0]["dtExpiryDate"].ToString();
                }

                var obj = new
                {
                    status = "Success",
                    data = tableobj
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Edit Material
        [Route("EditMaterialBill")]
        [HttpPost]
        public async Task<HttpResponseMessage> EditMaterialBill(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());

                int fVendor = Convert.ToInt32(keyValue["fVendor"].ToString());

                DateTime dtDate = Convert.ToDateTime(keyValue["dtDate"].ToString()).Date;

                int fMaterial = Convert.ToInt32(keyValue["fMaterial"].ToString());
                int fUnit = Convert.ToInt32(keyValue["fUnit"].ToString());
                int sPrice = Convert.ToInt32(keyValue["sPrice"].ToString());
                int sQuantity = Convert.ToInt32(keyValue["sQuantity"].ToString());

                string ExpiryDate = keyValue["dtExpiryDate"].ToString();
                var dtExpiryDate = "";

                if (ExpiryDate != "")
                {
                    dtExpiryDate = Convert.ToDateTime(ExpiryDate).ToString();
                }

                int user = Convert.ToInt32(keyValue["UserId"].ToString());

                DateTime date = DateTime.Now;



                //To Delete Old Quantity from Stock
                DataTable dtMaterialBill = new DataTable();
                dtMaterialBill = RefreshTable("select * from hMaterialBills where iId = " + iId);

                int fOldMaterial = Convert.ToInt32(dtMaterialBill.Rows[0]["fMaterial"].ToString());
                int sOldQuantity = Convert.ToInt32(dtMaterialBill.Rows[0]["sQuantity"].ToString());
                int sOldPrice = Convert.ToInt32(dtMaterialBill.Rows[0]["sPrice"].ToString());
                int sOldTotalAmount = sOldPrice * sOldQuantity;

                int fPendingPayout = Convert.ToInt32(dtMaterialBill.Rows[0]["fPendingPayout"].ToString());


                //Check Inv Type Of Hotel And Add Accordingly

                //To Get Hotel Details
                DataTable dtHotel = new DataTable();
                dtHotel = RefreshTable("select * from hHotel where iActive=1");

                int fInventoryType = Convert.ToInt32(dtHotel.Rows[0]["fInventoryType"].ToString());


                //To Get Material Stock
                DataTable dtMaterial = new DataTable();
                dtMaterial = RefreshTable("select * from hMasterMaterial where iActive=1 and iId =" + fOldMaterial);

                //To Remove In Kitchen & Main Stock If inv type = 1 Else Rewmove in Only Main Stock
                if (fInventoryType == 1)
                {
                    //Single Layer Inverntory

                    int sMainStock = Convert.ToInt32(dtMaterial.Rows[0]["sMainStock"].ToString());
                    int sKitchenStock = Convert.ToInt32(dtMaterial.Rows[0]["sKitchenStock"].ToString());

                    sMainStock -= Convert.ToInt32(sOldQuantity);
                    sKitchenStock -= Convert.ToInt32(sOldQuantity);


                    string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "',sKitchenStock='" + sKitchenStock + "' where iId = " + fOldMaterial;

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query10, con);

                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }


                    string query0 = "update hMaterialTransaction set dtDate='" + dtDate + "',fMaterial='" + fMaterial + "',fUnit='" + fUnit + "',sQuantity='" + sQuantity + "',dtExpiryDate='" + dtExpiryDate + "', dtUpdatedBy='" + user + "' where iId=" + iId;

                    using (OleDbConnection con1 = new OleDbConnection(str))
                    {
                        OleDbCommand com1 = new OleDbCommand(query0, con1);

                        con1.Open();

                        var rows1 = com1.ExecuteNonQuery();

                        con1.Close();
                    }
                }
                else
                {
                    //Multi Layer Inventory

                    int sMainStock = Convert.ToInt32(dtMaterial.Rows[0]["sMainStock"].ToString());

                    sMainStock -= Convert.ToInt32(sOldQuantity);


                    string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "' where iId = " + fOldMaterial;

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query10, con);

                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }
                }

                //To Subtract old Amount From Pending Payout

                DataTable dtPendingPayout = new DataTable();
                dtPendingPayout = RefreshTable("select * from hPendingPayout where iId=" + fPendingPayout);

                int sAmount = Convert.ToInt32(dtPendingPayout.Rows[0]["sAmount"].ToString());

                int NewAmount = sAmount - sOldTotalAmount;

                string query1 = "update hPendingPayout set sAmount='" + NewAmount + "', iUpdatedBy='" + user + "' where iId=" + fPendingPayout;

                using (OleDbConnection con1 = new OleDbConnection(str))
                {
                    OleDbCommand com1 = new OleDbCommand(query1, con1);

                    con1.Open();

                    var rows1 = com1.ExecuteNonQuery();

                    con1.Close();
                }


                //To Update In Material Bills Table
                string query = "update hMaterialBills set fVendor='" + fVendor + "',dtDate='" + dtDate + "',fMaterial='" + fMaterial + "',fUnit='" + fUnit + "',sPrice='" + sPrice + "',sQuantity='" + sQuantity + "',dtExpiryDate='" + dtExpiryDate + "',dtUpdatedBy='" + user + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }


                //To Add New Quantity

                //To Get Material Stock
                DataTable dtNewMaterial = new DataTable();
                dtNewMaterial = RefreshTable("select * from hMasterMaterial where iActive=1 and iId =" + fMaterial);

                //To Add In Kitchen & Main Stock If inv type = 1 Else Add in Only Main Stock
                if (fInventoryType == 1)
                {
                    //Single Layer Inverntory

                    int sMainStock = Convert.ToInt32(dtNewMaterial.Rows[0]["sMainStock"].ToString());
                    int sKitchenStock = Convert.ToInt32(dtNewMaterial.Rows[0]["sKitchenStock"].ToString());

                    sMainStock += Convert.ToInt32(sQuantity);
                    sKitchenStock += Convert.ToInt32(sQuantity);

                    string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "',sKitchenStock='" + sKitchenStock + "' where iId = " + fMaterial;

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query10, con);

                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }
                }
                else
                {
                    //Multi Layer Inventory

                    int sMainStock = Convert.ToInt32(dtNewMaterial.Rows[0]["sMainStock"].ToString());

                    sMainStock += Convert.ToInt32(sQuantity);


                    string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "' where iId = " + fMaterial;

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query10, con);

                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }
                }



                //To Add New Amount In Pending Payout

                DataTable dtPendingPayout1 = new DataTable();
                dtPendingPayout1 = RefreshTable("select * from hPendingPayout where iId=" + fPendingPayout);

                int sAmount1 = Convert.ToInt32(dtPendingPayout1.Rows[0]["sAmount"].ToString());

                int sTotalAmount = sPrice * sQuantity;

                int NewAmount1 = sAmount1 + sTotalAmount;

                string query2 = "update hPendingPayout set sAmount='" + NewAmount1 + "', iUpdatedBy='" + user + "' where iId=" + fPendingPayout;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com1 = new OleDbCommand(query2, con2);

                    con2.Open();

                    var rows1 = com1.ExecuteNonQuery();

                    con2.Close();
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Material Bill Updated Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        //Delete Material
        [Route("DeleteMaterialBill")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeleteMaterialBill(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                DateTime date = DateTime.Now;

                int user = Convert.ToInt32(keyValue["UserId"].ToString());

                int iActive = 0;

                string query = "update hMaterialBills set iActive=" + iActive + ",dtUpdatedBy='" + user + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iActive", OleDbType.VarChar).Value = iActive;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                //To Delete from Stock
                DataTable dtMaterialBill = new DataTable();
                dtMaterialBill = RefreshTable("select * from hMaterialBills where iId = " + iId);

                int fOldMaterial = Convert.ToInt32(dtMaterialBill.Rows[0]["fMaterial"].ToString());
                int sOldQuantity = Convert.ToInt32(dtMaterialBill.Rows[0]["sQuantity"].ToString());
                int sOldPrice = Convert.ToInt32(dtMaterialBill.Rows[0]["sPrice"].ToString());
                int sOldTotalAmount = sOldPrice * sOldQuantity;

                int fPendingPayout = Convert.ToInt32(dtMaterialBill.Rows[0]["fPendingPayout"].ToString());

                //Check Inv Type Of Hotel And Add Accordingly

                //To Get Hotel Details
                DataTable dtHotel = new DataTable();
                dtHotel = RefreshTable("select * from hHotel where iActive=1");

                int fInventoryType = Convert.ToInt32(dtHotel.Rows[0]["fInventoryType"].ToString());

                //To Get Material Stock
                DataTable dtMaterial = new DataTable();
                dtMaterial = RefreshTable("select * from hMasterMaterial where iActive=1 and iId =" + fOldMaterial);

                //To Remove In Kitchen & Main Stock If inv type = 1 Else Rewmove in Only Main Stock
                if (fInventoryType == 1)
                {
                    //Single Layer Inverntory

                    int sMainStock = Convert.ToInt32(dtMaterial.Rows[0]["sMainStock"].ToString());
                    int sKitchenStock = Convert.ToInt32(dtMaterial.Rows[0]["sKitchenStock"].ToString());

                    sMainStock -= Convert.ToInt32(sOldQuantity);
                    sKitchenStock -= Convert.ToInt32(sOldQuantity);

                    string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "',sKitchenStock='" + sKitchenStock + "' where iId = " + fOldMaterial;

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query10, con);

                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }

                    //To Delete From Kitchen Transaction

                    string query0 = "update hMaterialTransaction set iActive = 0 where iId=" + iId;

                    using (OleDbConnection con1 = new OleDbConnection(str))
                    {
                        OleDbCommand com1 = new OleDbCommand(query0, con1);

                        con1.Open();

                        var rows1 = com1.ExecuteNonQuery();

                        con1.Close();
                    }
                }
                else
                {
                    //Multi Layer Inventory

                    int sMainStock = Convert.ToInt32(dtMaterial.Rows[0]["sMainStock"].ToString());

                    sMainStock -= Convert.ToInt32(sOldQuantity);


                    string query10 = "update hMasterMaterial set sMainStock='" + sMainStock + "' where iId = " + fOldMaterial;

                    using (OleDbConnection con = new OleDbConnection(str))
                    {
                        OleDbCommand com = new OleDbCommand(query10, con);

                        con.Open();
                        var rows = com.ExecuteNonQuery();

                        con.Close();
                    }
                }


                //To Subtract old Amount From Pending Payout

                DataTable dtPendingPayout = new DataTable();
                dtPendingPayout = RefreshTable("select * from hPendingPayout where iId=" + fPendingPayout);

                int sAmount = Convert.ToInt32(dtPendingPayout.Rows[0]["sAmount"].ToString());

                int NewAmount = sAmount - sOldTotalAmount;

                string query1 = "update hPendingPayout set sAmount='" + NewAmount + "', iUpdatedBy='" + user + "' where iId=" + fPendingPayout;

                using (OleDbConnection con1 = new OleDbConnection(str))
                {
                    OleDbCommand com1 = new OleDbCommand(query1, con1);

                    con1.Open();

                    var rows1 = com1.ExecuteNonQuery();

                    con1.Close();
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Material Bill Deleted Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        //To Get Lowest Price Of Material (Among Last 10 Entries)
        [Route("getLowestPriceByMaterial/{Materialid}")]
        [HttpGet]
        public HttpResponseMessage getLowestPriceByMaterial(int Materialid)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                //OleDbDataAdapter da = new OleDbDataAdapter("Select Top 10 mb.*, mm.sMaterialName FROM hMaterialbills mb, hMasterMaterial mm Where mb.fMaterial = mm.iId and mb.iActive = 1 and mb.fMaterial=" + Materialid + " ORDER BY mb.iId DESC", con);
                
                OleDbDataAdapter da = new OleDbDataAdapter("Select mb.sPrice, mb.dtDate From hMaterialBills mb where mb.sPrice = (SELECT min(sPrice) FROM hMaterialBills) and mb.fMaterial" + Materialid, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.dtDate = dt.Rows[0]["dtDate"].ToString();

                    tableobj.sPrice = dt.Rows[0]["sPrice"].ToString();
                }

                var obj = new
                {
                    status = "Success",
                    data = tableobj
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Get Material Bill By Vendor & Bill No
        [Route("getMaterialBillByBillNo/{Vendorid}/{BillNo}")]
        [HttpGet]
        public HttpResponseMessage getMaterialBillByBillNo(int Vendorid, string BillNo)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select mb.*, mm.sMaterialName, mu.sUnit, mv.sVendorName, mv.sContactPerson  FROM hMaterialbills mb, hMasterMaterial mm, hMasterUnit mu, hMasterVendor mv Where mb.fMaterial = mm.iId and mb.fVendor = mv.iId and mb.fUnit = mu.iId and mb.iActive = 1 and mb.fVendor=" + Vendorid + " mb.sBillNo=" + BillNo, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[0]["iId"].ToString());
                    tableobj.dtDate = dt.Rows[0]["dtDate"].ToString();
                    tableobj.sBillNo = dt.Rows[0]["sBillNo"].ToString();

                    tableobj.fVendor = dt.Rows[0]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[0]["sVendorName"].ToString();
                    tableobj.sContactPerson = dt.Rows[0]["sContactPerson"].ToString();

                    tableobj.fMaterial = dt.Rows[0]["fMaterial"].ToString();
                    tableobj.sMaterialName = dt.Rows[0]["sMaterialName"].ToString();

                    tableobj.fUnit = dt.Rows[0]["fUnit"].ToString();
                    tableobj.sUnit = dt.Rows[0]["sUnit"].ToString();

                    tableobj.sQuantity = dt.Rows[0]["sQuantity"].ToString();
                    tableobj.sPrice = dt.Rows[0]["sPrice"].ToString();
                    tableobj.dtExpiryDate = dt.Rows[0]["dtExpiryDate"].ToString();
                }

                var obj = new
                {
                    status = "Success",
                    data = tableobj
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Get Bills By Vendor Id
        [Route("getBillsByVendorId/{Vendorid}")]
        [HttpGet]
        public HttpResponseMessage getBillsByVendorId(int Vendorid)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select mb.*, mm.sMaterialName, mu.sUnit, mv.sVendorName, mv.sContactPerson  FROM hMaterialbills mb, hMasterMaterial mm, hMasterUnit mu, hMasterVendor mv Where mb.fMaterial = mm.iId and mb.fVendor = mv.iId and mb.fUnit = mu.iId and mb.iActive = 1 and mb.fVendor=" + Vendorid, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sBillNo = dt.Rows[i]["sBillNo"].ToString();

                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.sContactPerson = dt.Rows[i]["sContactPerson"].ToString();

                    tableobj.fMaterial = dt.Rows[i]["fMaterial"].ToString();
                    tableobj.sMaterialName = dt.Rows[i]["sMaterialName"].ToString();

                    tableobj.fUnit = dt.Rows[i]["fUnit"].ToString();
                    tableobj.sUnit = dt.Rows[i]["sUnit"].ToString();

                    tableobj.sQuantity = dt.Rows[i]["sQuantity"].ToString();
                    tableobj.sPrice = dt.Rows[i]["sPrice"].ToString();
                    tableobj.dtExpiryDate = dt.Rows[i]["dtExpiryDate"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }





        //** Reports [Extra] [Main Available In Reports Controller]


        //Get PayIn Report
        [Route("getPayInReport")]
        [HttpPost]
        public async Task<HttpResponseMessage> getPayInReport(HttpRequestMessage request)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();

            try
            {
                var details = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(details);

                var FromDate = Convert.ToDateTime(keyValue["FromDate"].ToString());
                FromDate = FromDate.Date;

                var ToDate = Convert.ToDateTime(keyValue["ToDate"].ToString()).AddDays(1);
                ToDate = ToDate.Date;

                //fPayInType
                int fPayinType = Convert.ToInt32(keyValue["fPayinType"].ToString());

                if (fPayinType != 0)
                {

                    DataTable dt = new DataTable();
                    dt = RefreshTable("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sPerson,p.dtDate,p.sAmount,p.sComment,pm.sMOP,pt.sName FROM hPayinEntry p, hMasterPaymentMode pm, hPayinType pt   Where p.fPayinType=pt.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fPayinType=" + fPayinType + " and p.dtCreatedOn >= #" + FromDate + "# and p.dtCreatedOn <= #" + ToDate + "#");// and p.dtDate >= " + FromDate + " and p.dtDate <= " + ToDate

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        tableobj = new JObject();

                        var Payinid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                        tableobj.iId = Payinid;
                        tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                        tableobj.sName = dt.Rows[i]["sName"].ToString();
                        tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                        tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                        tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                        tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                        tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                        tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                        tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                        //To Get Payout Payment Details
/*                        DataTable dtPayin = new DataTable();
                        dtPayin = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayinPayment p, hMasterPaymentMode pm,hAccount a, hPayinType pt Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayin=" + Payinid);

                        var PaymentMode = "";

                        for (int j = 0; j < dtPayin.Rows.Count; j++)
                        {
                            var mop = dtPayin.Rows[j]["sMOP"].ToString();

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

                        tabledata.Add(tableobj);

                    }

                }
                else
                {

                    DataTable dt = new DataTable();
                    dt = RefreshTable("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.dtDate,p.sAmount,p.fPayinAccount,p.sComment,pm.sMOP,a.sAccount,pt.sName FROM hPayin p, hMasterPaymentMode pm,hAccount a, hPayinType pt Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.dtCreatedOn >= #" + FromDate + "# and p.dtCreatedOn <= #" + ToDate + "#");// and p.dtDate >= " + FromDate + " and p.dtDate <= " + ToDate

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        tableobj = new JObject();

                        var Payinid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                        tableobj.iId = Payinid;
                        tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                        tableobj.sName = dt.Rows[i]["sName"].ToString();
                        //tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                        //tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                        tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                        tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                        tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                        tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                        //To Get Payout Payment Details
                        DataTable dtPayin = new DataTable();
                        dtPayin = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayinPayment p, hMasterPaymentMode pm,hAccount a, hPayinType pt Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayin=" + Payinid);

                        var PaymentMode = "";

                        for (int j = 0; j < dtPayin.Rows.Count; j++)
                        {
                            var mop = dtPayin.Rows[j]["sMOP"].ToString();

                            if (j == 0)
                            {
                                PaymentMode = mop;
                            }
                            else
                            {
                                PaymentMode += "," + mop;
                            }
                        }

                        tableobj.sAccount.PaymentMode = PaymentMode;

                        tabledata.Add(tableobj);

                    }
                }


                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Get PayOut Report
        [Route("getPayOutReport")]
        [HttpPost]
        public async Task<HttpResponseMessage> getPayOutReport(HttpRequestMessage request)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();

            try
            {
                var details = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(details);

                var FromDate = Convert.ToDateTime(keyValue["FromDate"].ToString());
                FromDate = FromDate.Date;

                var ToDate = Convert.ToDateTime(keyValue["ToDate"].ToString()).AddDays(1);
                ToDate = ToDate.Date;

                //fPayoutType
                int fPayoutType = Convert.ToInt32(keyValue["fPayoutType"].ToString());

                //fVendor
                int fVendor = Convert.ToInt32(keyValue["fVendor"].ToString());

                if (fPayoutType != 0 && fVendor != 0)
                {
                    DataTable dt = new DataTable();
                    dt = RefreshTable("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fVendor = " + fVendor + " and p.fPayoutType = " + fPayoutType + " and p.dtCreatedOn >= #" + FromDate + "# and p.dtCreatedOn <= #" + ToDate + "#");// and p.dtDate >= " + FromDate + " and p.dtDate <= " + ToDate

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        tableobj = new JObject();

                        var Payoutid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                        tableobj.iId = Payoutid;
                        tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                        tableobj.sName = dt.Rows[i]["sName"].ToString();
                        tableobj.sComment = dt.Rows[i]["sComment"].ToString();
                        tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                        tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                        tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                        tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                        tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                        tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                        tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                        tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();

                        //To Get Payout Payment Details
/*                        DataTable dtPayout = new DataTable();
                        dtPayout = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayoutPayment p, hMasterPaymentMode pm,hAccount a, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayout=" + Payoutid);

                        var PaymentMode = "";

                        for (int j = 0; j < dtPayout.Rows.Count; j++)
                        {
                            var mop = dtPayout.Rows[j]["sMOP"].ToString();

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

                        tabledata.Add(tableobj);

                    }
                }
                else if (fPayoutType != 0 && fVendor == 0)
                {
                    DataTable dt = new DataTable();
                    dt = RefreshTable("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fPayoutType = " + fPayoutType + "  and p.dtCreatedOn >= #" + FromDate + "# and p.dtCreatedOn <= #" + ToDate + "#");// and p.dtDate >= " + FromDate + " and p.dtDate <= " + ToDate

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        tableobj = new JObject();

                        var Payoutid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                        tableobj.iId = Payoutid;
                        tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                        tableobj.sName = dt.Rows[i]["sName"].ToString();
                        tableobj.sComment = dt.Rows[i]["sComment"].ToString();
                        tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                        tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                        tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                        tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                        tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                        tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                        tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                        tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();

                        //To Get Payout Payment Details
/*                        DataTable dtPayout = new DataTable();
                        dtPayout = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayoutPayment p, hMasterPaymentMode pm,hAccount a, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayout=" + Payoutid);

                        var PaymentMode = "";

                        for (int j = 0; j < dtPayout.Rows.Count; j++)
                        {
                            var mop = dtPayout.Rows[j]["sMOP"].ToString();

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

                        tabledata.Add(tableobj);

                    }
                }
                else if (fPayoutType == 0 && fVendor != 0)
                {
                    DataTable dt = new DataTable();
                    dt = RefreshTable("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fVendor = " + fVendor + " and p.dtCreatedOn >= #" + FromDate + "# and p.dtCreatedOn <= #" + ToDate + "#");// and p.dtDate >= " + FromDate + " and p.dtDate <= " + ToDate

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        tableobj = new JObject();

                        var Payoutid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                        tableobj.iId = Payoutid;
                        tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                        tableobj.sName = dt.Rows[i]["sName"].ToString();
                        tableobj.sComment = dt.Rows[i]["sComment"].ToString();
                        tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                        tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                        tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                        tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                        tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                        tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                        tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                        tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();

                        //To Get Payout Payment Details
/*                        DataTable dtPayout = new DataTable();
                        dtPayout = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayoutPayment p, hMasterPaymentMode pm,hAccount a, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayout=" + Payoutid);

                        var PaymentMode = "";

                        for (int j = 0; j < dtPayout.Rows.Count; j++)
                        {
                            var mop = dtPayout.Rows[j]["sMOP"].ToString();

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

                        tabledata.Add(tableobj);

                    }
                }
                else
                {
                    DataTable dt = new DataTable();
                    dt = RefreshTable("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.sComment,pm.sMOP,v.sVendorName,pt.sName FROM hPayoutEntry p, hMasterPaymentMode pm, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1  and p.dtCreatedOn >= #" + FromDate + "# and p.dtCreatedOn <= #" + ToDate + "#");// and p.dtDate >= " + FromDate + " and p.dtDate <= " + ToDate

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        tableobj = new JObject();

                        var Payoutid = Int32.Parse(dt.Rows[i]["iId"].ToString());

                        tableobj.iId = Payoutid;
                        tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                        tableobj.sName = dt.Rows[i]["sName"].ToString();
                        tableobj.sComment = dt.Rows[i]["sComment"].ToString();
                        tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                        tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                        tableobj.PaymentMode = dt.Rows[i]["sMOP"].ToString();
                        tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                        tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                        tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                        tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                        tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();

                        //To Get Payout Payment Details
/*                        DataTable dtPayout = new DataTable();
                        dtPayout = RefreshTable("Select p.*,pm.sMOP,a.sAccount,pt.sName FROM hPayoutPayment p, hMasterPaymentMode pm,hAccount a, hPayoutType pt Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and pe.fPaymentMode=pm.iId and pe.iActive = 1 and pe.fPayout=" + Payoutid);

                        var PaymentMode = "";

                        for (int j = 0; j < dtPayout.Rows.Count; j++)
                        {
                            var mop = dtPayout.Rows[j]["sMOP"].ToString();

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

                        tabledata.Add(tableobj);

                    }
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }






        // Old PayIn & PayOut Calls

        // Payout Calls 

        // Add Payout     
        [Route("AddPayout")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPayout(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fBranch = 1;

                int fVendor = Convert.ToInt32(keyValue["fVendor"].ToString());
                string sPerson = sPerson = keyValue["sPerson"].ToString();

                // Bills & PAyments
                int fPayoutType = Convert.ToInt32(keyValue["fPayoutType"].ToString());

                //Cash / Card / Cheque
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());

                string sChequeNo = keyValue["sChequeNo"].ToString();
                string sChequeDate = keyValue["sChequeDate"].ToString();
                int iIsChequeCleared = 0;

                string dtDate = keyValue["dtDate"].ToString();
                string sAmount = keyValue["sAmount"].ToString();
                int fPayoutAccount = Convert.ToInt32(keyValue["fPayoutAccount"].ToString());
                string sComment = keyValue["sComment"].ToString();
                int user = 1;
                DateTime date = DateTime.Now;

                string query = "insert into hPayout(fBranch,fPayoutType,fPaymentMode,sChequeNo,sChequeDate,iIsChequeCleared,sPerson,fVendor,dtDate,sAmount,fPayoutAccount,sComment,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayoutType,@fPaymentMode,@sChequeNo,@sChequeDate,@iIsChequeCleared,@sPerson,@fVendor,@dtDate,@sAmount,@fPayoutAccount,@sComment,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;

                    com.Parameters.Add("@fPayoutType", OleDbType.Integer).Value = fPayoutType;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;
                    com.Parameters.Add("@sChequeNo", OleDbType.VarChar).Value = sChequeNo;
                    com.Parameters.Add("@sChequeDate", OleDbType.VarChar).Value = sChequeDate;
                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = iIsChequeCleared;
                    com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                    com.Parameters.Add("@fVendor", OleDbType.Integer).Value = fVendor;
                    com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                    com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sAmount;
                    com.Parameters.Add("@fPayoutAccount", OleDbType.Integer).Value = fPayoutAccount;
                    com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;
                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = user;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                //To Subtract Money From Account
                if (fPaymentMode != 1)
                {
                    OleDbConnection con1 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId=" + fPayoutAccount, con1);

                    DataTable dt = new DataTable();

                    da.Fill(dt);

                    con1.Close();

                    Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                    amount = amount - Convert.ToDouble(sAmount);

                    string query2 = "update hAccount set sAmount=" + amount + " where iId = " + fPayoutAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }
                }

                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Added Sucessfully"
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get Payout
        [Route("getPayout")]
        [HttpGet]
        public HttpResponseMessage getPayout()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.fPayoutAccount,p.sComment,pm.sMOP,a.sAccount,v.sVendorName,pt.sName FROM hPayout p, hMasterPaymentMode pm,hAccount a, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payout By Id
        [Route("getPayoutById/{id}")]
        [HttpGet]
        public HttpResponseMessage getPayoutById(int id)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.fPayoutAccount,p.sComment,pm.sMOP,a.sAccount,v.sVendorName,pt.sName FROM hPayout p, hMasterPaymentMode pm,hAccount a, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.iId=" + id, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payout By Keyword
        [Route("getPayoutByKeyword/{keyword}")]
        [HttpGet]
        public HttpResponseMessage getPayoutByKeyword(string keyword)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.fPayoutAccount,p.sComment,pm.sMOP,a.sAccount,v.sVendorName,pt.sName FROM hPayout p, hMasterPaymentMode pm,hAccount a, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and (v.sVendorName LIKE '%" + keyword + "%' or p.sPerson LIKE '%" + keyword + "%' or a.sAccount LIKE '%" + keyword + "%' or pm.sMOP LIKE '%" + keyword + "%' or pt.sName LIKE '%" + keyword + "%') ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Delete Payout
        [Route("DeletePayout")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeletePayout(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                DateTime date = DateTime.Now;

                int iActive = 0;

                string query = "update hPayout set iActive='" + iActive + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iActive", OleDbType.VarChar).Value = iActive;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }



                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayout  Where  iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();
                Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                Double fPayoutAccount = Convert.ToDouble(dt.Rows[0]["fPayoutAccount"].ToString());
                int fPaymentMode = Convert.ToInt32(dt.Rows[0]["fPaymentMode"].ToString());
                int iIsChequeCleared = Convert.ToInt32(dt.Rows[0]["iIsChequeCleared"].ToString());

                if (fPaymentMode == 1 && iIsChequeCleared == 0)
                {

                }
                else
                {
                    OleDbConnection con11 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayoutAccount, con11);

                    DataTable dt11 = new DataTable();

                    da11.Fill(dt11);

                    con1.Close();
                    Double amount11 = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());

                    amount = amount11 + amount;

                    string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayoutAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }

                }

                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Deleted Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Payin Calls 

        // Add Payin     
        [Route("AddPayin")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddPayin(HttpRequestMessage request)
        {
            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int fBranch = 1;
                int fPayinType = Convert.ToInt32(keyValue["fPayinType"].ToString());
                int fPaymentMode = Convert.ToInt32(keyValue["fPaymentMode"].ToString());
                string sChequeNo = keyValue["sChequeNo"].ToString();
                string sChequeDate = keyValue["sChequeDate"].ToString();
                int iIsChequeCleared = 0;
                string sPerson = keyValue["sPerson"].ToString();
                string dtDate = keyValue["dtDate"].ToString();
                string sAmount = keyValue["sAmount"].ToString();
                int fPayinAccount = Convert.ToInt32(keyValue["fPayinAccount"].ToString());
                string sComment = keyValue["sComment"].ToString();
                int user = 1;
                DateTime date = DateTime.Now;

                string query = "insert into hPayin(fBranch,fPayinType,fPaymentMode,sChequeNo,sChequeDate,iIsChequeCleared,sPerson,dtDate,sAmount,fPayinAccount,sComment,dtCreatedOn,dtUpdatedOn,iCreatedBy,iUpdatedBy,iVersion,iActive)" + " Values (@fBranch,@fPayinType,@fPaymentMode,@sChequeNo,@sChequeDate,@iIsChequeCleared,@sPerson,@dtDate,@sAmount,@fPayinAccount,@sComment,@dtCreatedOn,@dtUpdatedOn,@iCreatedBy,@iUpdatedBy,@iVersion,@iActive)";

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@fBranch", OleDbType.Integer).Value = fBranch;

                    com.Parameters.Add("@fPayinType", OleDbType.Integer).Value = fPayinType;
                    com.Parameters.Add("@fPaymentMode", OleDbType.Integer).Value = fPaymentMode;

                    com.Parameters.Add("@sChequeNo", OleDbType.VarChar).Value = sChequeNo;
                    com.Parameters.Add("@sChequeDate", OleDbType.VarChar).Value = sChequeDate;
                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = iIsChequeCleared;
                    com.Parameters.Add("@sPerson", OleDbType.VarChar).Value = sPerson;
                    com.Parameters.Add("@dtDate", OleDbType.VarChar).Value = dtDate;
                    com.Parameters.Add("@sAmount", OleDbType.VarChar).Value = sAmount;
                    com.Parameters.Add("@fPayinAccount", OleDbType.Integer).Value = fPayinAccount;
                    com.Parameters.Add("@sComment", OleDbType.VarChar).Value = sComment;

                    com.Parameters.Add("@dtCreatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@dtUpdatedOn", OleDbType.Date).Value = date;
                    com.Parameters.Add("@iCreatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iUpdatedBy", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iVersion", OleDbType.Integer).Value = user;
                    com.Parameters.Add("@iActive", OleDbType.Integer).Value = user;


                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                //To Add Monet To Account
                if (fPaymentMode != 1)
                {
                    OleDbConnection con1 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hAccount  Where iActive = 1 and iId=" + fPayinAccount, con1);

                    DataTable dt = new DataTable();

                    da.Fill(dt);

                    con1.Close();

                    Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                    amount = amount + Convert.ToDouble(sAmount);

                    string query2 = "update hAccount set sAmount=" + amount + " where iId = " + fPayinAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }

                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payin Added Sucessfully"
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get Payin
        [Route("getPayin")]
        [HttpGet]
        public HttpResponseMessage getPayin()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.dtDate,p.sAmount,p.fPayinAccount,p.sComment,pm.sMOP,a.sAccount,pt.sName FROM hPayin p, hMasterPaymentMode pm,hAccount a, hPayinType pt   Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payin By Id
        [Route("getPayinById/{id}")]
        [HttpGet]
        public HttpResponseMessage getPayinById(int id)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.dtDate,p.sAmount,p.fPayinAccount,p.sComment,pm.sMOP,a.sAccount,pt.sName FROM hPayin p, hMasterPaymentMode pm,hAccount a, hPayinType pt   Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1  and p.iId=" + id, con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();


                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        // Get Payin By Keyword
        [Route("getPayinByKeyword/{keyword}")]
        [HttpGet]
        public HttpResponseMessage getPayinByKeyword(string keyword)
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.dtDate,p.sAmount,p.fPayinAccount,p.sComment,pm.sMOP,a.sAccount,pt.sName FROM hPayin p, hMasterPaymentMode pm,hAccount a, hPayinType pt   Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1  and ( p.sPerson LIKE '%" + keyword + "%' or a.sAccount LIKE '%" + keyword + "%' or pm.sMOP LIKE '%" + keyword + "%' or pt.sName LIKE '%" + keyword + "%') ", con);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();


                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);
                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Delete payin
        [Route("DeletePayin")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeletePayin(HttpRequestMessage request)
        {

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                DateTime date = DateTime.Now;

                int iActive = 0;

                string query = "update hPayin set iActive='" + iActive + "' where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iActive", OleDbType.VarChar).Value = iActive;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }


                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayin  Where  iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();
                Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                Double fPayinAccount = Convert.ToDouble(dt.Rows[0]["fPayinAccount"].ToString());
                int fPaymentMode = Convert.ToInt32(dt.Rows[0]["fPaymentMode"].ToString());
                int iIsChequeCleared = Convert.ToInt32(dt.Rows[0]["iIsChequeCleared"].ToString());

                if (fPaymentMode == 1 && iIsChequeCleared == 0)
                {

                }
                else
                {
                    OleDbConnection con11 = new OleDbConnection(str);
                    con1.Open();
                    OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayinAccount, con11);

                    DataTable dt11 = new DataTable();

                    da11.Fill(dt11);

                    con1.Close();
                    Double amount11 = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());

                    amount = amount11 - amount;

                    string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayinAccount;

                    using (OleDbConnection con2 = new OleDbConnection(str))
                    {
                        OleDbCommand com2 = new OleDbCommand(query2, con2);

                        com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                        con2.Open();
                        var rows = com2.ExecuteNonQuery();

                        con2.Close();
                    }
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payin Deleted Sucessfully"
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }





        // Cheque Clearence calls


        // Get Payout Cheque Entries
        [Route("getPayoutChequeEntries")]
        [HttpGet]
        public HttpResponseMessage getPayoutChequeEntries()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayoutType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.fVendor,p.dtDate,p.sAmount,p.fPayoutAccount,p.sComment,pm.sMOP,a.sAccount,v.sVendorName,pt.sName FROM hPayout p, hMasterPaymentMode pm,hAccount a, hMasterVendor v, hPayoutType pt   Where p.fPayoutType=pt.iId and p.fPayoutAccount=a.iId and p.fVendor=v.iId and p.fPaymentMode=pm.iId and p.iActive = 1 and p.fPaymentMode=1", con);// and p.iIsChequeCleared != 1


                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();


                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayoutType = dt.Rows[i]["fPayoutType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.fVendor = dt.Rows[i]["fVendor"].ToString();
                    tableobj.sVendorName = dt.Rows[i]["sVendorName"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayoutAccount = dt.Rows[i]["fPayoutAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Payout Cheque Clearence
        [Route("PayoutCheque")]
        [HttpPost]
        public async Task<HttpResponseMessage> PayoutCheque(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                var date = Convert.ToString(DateTime.Now);

                string query = "update hPayout set iIsChequeCleared='" + 1 + "', dtChequeClearanceDate='" + date + "'  where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@dtChequeClearanceDate", OleDbType.VarChar).Value = date;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();

                }


                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayout  Where  iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();
                Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                Double fPayoutAccount = Convert.ToDouble(dt.Rows[0]["fPayoutAccount"].ToString());


                OleDbConnection con11 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayoutAccount, con11);

                DataTable dt11 = new DataTable();

                da11.Fill(dt11);

                con1.Close();
                Double amount11 = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());

                amount = amount11 - amount;

                string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayoutAccount;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com2 = new OleDbCommand(query2, con2);

                    com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                    con2.Open();
                    var rows = com2.ExecuteNonQuery();

                    con2.Close();
                }


                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Cheque Cleared Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }


        // Get PayIn Cheque Entries
        [Route("getPayinChequeEntries")]
        [HttpGet]
        public HttpResponseMessage getPayinChequeEntries()
        {
            dynamic tabledata = new JArray();
            dynamic tableobj = new JObject();
            try
            {

                OleDbConnection con = new OleDbConnection(str);
                con.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select p.iId,p.fBranch,p.fPayinType,p.fPaymentMode,p.sChequeNo,p.sChequeDate,p.iIsChequeCleared,p.sPerson,p.dtDate,p.sAmount,p.fPayinAccount,p.sComment,pm.sMOP,a.sAccount,pt.sName FROM hPayin p, hMasterPaymentMode pm,hAccount a, hPayinType pt   Where p.fPayinType=pt.iId and p.fPayinAccount=a.iId and p.fPaymentMode=pm.iId and  p.iActive = 1 and p.fPaymentMode=1", con);// and p.iIsChequeCleared != 1

                DataTable dt = new DataTable();

                da.Fill(dt);

                con.Close();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    tableobj = new JObject();

                    tableobj.iId = Int32.Parse(dt.Rows[i]["iId"].ToString());
                    tableobj.fPayinType = dt.Rows[i]["fPayinType"].ToString();
                    tableobj.sName = dt.Rows[i]["sName"].ToString();
                    tableobj.fPayinType = dt.Rows[i]["fPaymentMode"].ToString();
                    tableobj.sMOP = dt.Rows[i]["sMOP"].ToString();
                    tableobj.sChequeNo = dt.Rows[i]["sChequeNo"].ToString();
                    tableobj.sChequeDate = dt.Rows[i]["sChequeDate"].ToString();
                    tableobj.iIsChequeCleared = dt.Rows[i]["iIsChequeCleared"].ToString();
                    tableobj.sPerson = dt.Rows[i]["sPerson"].ToString();
                    tableobj.dtDate = dt.Rows[i]["dtDate"].ToString();
                    tableobj.sAmount = dt.Rows[i]["sAmount"].ToString();
                    tableobj.fPayinAccount = dt.Rows[i]["fPayinAccount"].ToString();
                    tableobj.sAccount = dt.Rows[i]["sAccount"].ToString();
                    tableobj.sComment = dt.Rows[i]["sComment"].ToString();

                    var fPaymentMode = dt.Rows[i]["fPaymentMode"].ToString();

                    if (fPaymentMode == "1")
                    {
                        tableobj.PaymentDetails = "MOP :" + dt.Rows[i]["sMOP"].ToString() + "/\r\n ChequeNo :" + dt.Rows[i]["sChequeNo"].ToString() + "/\r\n ChequeDate :" + dt.Rows[i]["sChequeDate"].ToString();
                    }
                    else
                    {
                        tableobj.PaymentDetails = dt.Rows[i]["sMOP"].ToString();
                    }

                    tabledata.Add(tableobj);

                }

                var obj = new
                {
                    status = "Success",
                    data = tabledata
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);

            }
            catch (Exception e)
            {
                var obj = new
                {
                    status = "Failure",
                    data = e.Message
                };

                return Request.CreateErrorResponse(HttpStatusCode.OK, e.Message);
            }
        }


        //Payin Cheque Clearence
        [Route("PayinCheque")]
        [HttpPost]
        public async Task<HttpResponseMessage> PayinCheque(HttpRequestMessage request)
        {
            dynamic userarray = new JArray();
            dynamic userobject = new JObject();

            try
            {
                var categorydetails = await request.Content.ReadAsStringAsync();

                var serializer = new JavaScriptSerializer();
                var keyValue = serializer.Deserialize<Dictionary<string, object>>(categorydetails);

                int iId = Convert.ToInt32(keyValue["iId"].ToString());
                var date = Convert.ToString(DateTime.Now);

                string query = "update hPayin set iIsChequeCleared='" + 1 + "', dtChequeClearanceDate='" + date + "'  where iId = " + iId;

                using (OleDbConnection con = new OleDbConnection(str))
                {
                    OleDbCommand com = new OleDbCommand(query, con);

                    com.Parameters.Add("@iIsChequeCleared", OleDbType.Integer).Value = 1;
                    com.Parameters.Add("@dtChequeClearanceDate", OleDbType.VarChar).Value = date;

                    con.Open();
                    var rows = com.ExecuteNonQuery();

                    con.Close();
                }

                OleDbConnection con1 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("Select * FROM hPayin  Where  iId=" + iId, con1);

                DataTable dt = new DataTable();

                da.Fill(dt);

                con1.Close();
                Double amount = Convert.ToDouble(dt.Rows[0]["sAmount"].ToString());
                Double fPayinAccount = Convert.ToDouble(dt.Rows[0]["fPayinAccount"].ToString());

                OleDbConnection con11 = new OleDbConnection(str);
                con1.Open();
                OleDbDataAdapter da11 = new OleDbDataAdapter("Select * FROM hAccount  Where  iId=" + fPayinAccount, con11);

                DataTable dt11 = new DataTable();

                da11.Fill(dt11);

                con1.Close();
                Double amount11 = Convert.ToDouble(dt11.Rows[0]["sAmount"].ToString());

                amount = amount11 + amount;

                string query2 = "update hAccount set sAmount='" + amount + "' where iId = " + fPayinAccount;

                using (OleDbConnection con2 = new OleDbConnection(str))
                {
                    OleDbCommand com2 = new OleDbCommand(query2, con2);

                    com2.Parameters.Add("@sAmount", OleDbType.VarChar).Value = amount;

                    con2.Open();
                    var rows = com2.ExecuteNonQuery();

                    con2.Close();
                }

                var obj = new
                {
                    Status = "Success",
                    Message = "Payout Cheque Cleared Sucessfully",
                    data = userobject
                };

                return Request.CreateResponse(HttpStatusCode.OK, obj, JsonMediaTypeFormatter.DefaultMediaType);


            }
            catch (Exception ex)
            {
                var obj = new
                {
                    Status = "Error",
                    StatusCode = "501",
                    Message = ex.Message
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, obj, JsonMediaTypeFormatter.DefaultMediaType);
            }
        }




        //Functions

        // Array (getTable) 
        private DataTable getTable(object userdata)
        {
            ArrayList arr = new ArrayList();
            arr = (ArrayList)userdata;
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();

            for (int i = 0; i < arr.Count; i++)
            {
                object current = arr[i];
                var popups = (Dictionary<string, object>)current;
                list.Add(popups);
            }
            DataTable result = new DataTable();
            if (list.Count == 0)
                return result;

            var columnNames = list.SelectMany(dict => dict.Keys).Distinct();
            result.Columns.AddRange(columnNames.Select(c => new DataColumn(c)).ToArray());
            foreach (Dictionary<string, object> item in list)
            {
                var row = result.NewRow();
                foreach (var key in item.Keys)
                {
                    row[key] = item[key];
                }

                result.Rows.Add(row);
            }

            return result;
        }



    }
}
