using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.DAL;
using Zyrh.DBUtility;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Tools;

public partial class ajax_sms : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserCenter uc = new UserCenter();
    protected DomainIp dip = new DomainIp();

    protected string strAction = string.Empty;
    protected string strIdList = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        if (!IsPostBack)
        {
            
            this.InitialData();
        }
    }

    #region  初始化
    private void InitialData()
    {
        try
        {
            this.strAction = Public.RequestString("action", string.Empty);
            if (Config.ValidateRequestType() && !this.strAction.Equals(string.Empty))
            {
                if (!this.Request.RequestType.Equals("POST"))
                {
                    Response.Write("RequestType Error");
                    Response.End();
                }
            }
            if (Config.ValidateUrlReferrer() && !strAction.Equals(string.Empty))
            {
                if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
                {
                    Response.Write("UrlReferrer Error");
                    Response.End();
                }
            }
            if (!uc.CheckUserLogin() && !this.strAction.Equals(string.Empty))
            {
                Response.Write("{result:-1, msg:'您还没有登录或登录已超时。', error:'noauth'}");
                Response.End();
            }

            switch (this.strAction)
            {
                case "getSmsSendLog":
                    Response.Write(this.GetSmsSendLog(Public.RequestString("logIdList")));
                    break;
                case "getSmsSendList":
                    Response.Write(this.GetSmsSendList(
                        Public.RequestString("phoneNumber"),
                        Public.RequestString("sendNumber"),
                        Public.RequestString("sendType", -1),
                        Public.RequestString("sendStatus", -1),
                        Public.RequestString("startTime"),
                        Public.RequestString("endTime"),
                        Public.RequestString("keywords"),
                        Public.RequestString("searchType"),
                        Public.RequestString("pageIndex", 0),
                        Public.RequestString("pageSize", 20),
                        Public.RequestString("isDesc", 1) == 1
                        ));
                    break;
                case "addSmsSend":
                    Response.Write(this.AddSmsSend(
                        Public.RequestString("phoneNumber"),
                        Server.HtmlDecode(Public.RequestString("smsContent")),
                        Public.RequestString("smsTime", Public.GetDateTime()),
                        Public.RequestString("model", 1),
                        Public.RequestString("dataType", 1),
                        Public.RequestString("response", 1),
                        Public.RequestString("isP2P", 0) == 1
                        ));
                    break;
                case "getSmsReceiveList":
                    Response.Write(this.GetSmsReceiveList(
                        Public.RequestString("phoneNumber"),
                        Public.RequestString("receiveNumber"),
                        Public.RequestString("startTime"),
                        Public.RequestString("endTime"),
                        Public.RequestString("keywords"),
                        Public.RequestString("searchType"),
                        Public.RequestString("pageIndex", 0),
                        Public.RequestString("pageSize", 20),
                        Public.RequestString("isDesc", 1) == 1
                        ));
                    break;
                case "getSoundRecordList":
                    Response.Write(this.GetSoundRecordList(
                        Public.RequestString("startTime"),
                        Public.RequestString("endTime"),
                        Public.RequestString("inOut", -1),
                        Public.RequestString("phoneNumber"),
                        Public.RequestString("targetNumber"),
                        Public.RequestString("pageIndex", 0),
                        Public.RequestString("pageSize", 20),
                        Public.RequestString("isDesc", 1) == 1
                    ));
                    break;
                case "deleteSoundRecordFile":
                    Response.Write(this.DeleteSoundRecordFile(
                        Public.RequestString("date"),
                        Public.RequestString("id", 0)
                    ));
                    break;
                default:
                    Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                    break;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            Response.Write(String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current)));
        }
    }
    #endregion

    #region  获得短信发送记录
    public string GetSmsSendLog(string strIdList)
    {
        try
        {
            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.DBResult dbResult = sm.GetSmsSendLog(string.Empty, strIdList);
            DataSet ds = dbResult.dsResult;

            StringBuilder strResult = new StringBuilder();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append("{result:1");
                strResult.Append(",list:[");

                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    Zyrh.Tools.Model.SmsInfo info = sm.FillSmsInfo(dr);

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0}", info.Id));
                    strResult.Append(String.Format(",phoneNumber:'{0}',sendStatus:{1},sendTime:'{2}',sendResult:'{3}',sendNumber:'{4}'",
                        info.PhoneNumber, info.SendStatus, info.SendTime, info.SendResult, info.SendNumber));
                    strResult.Append("}");
                }
                strResult.Append("]}");

                return strResult.ToString();
            }
            else
            {
                return String.Format("{{result:0,msg:'没有找到相关的短信发送记录',error:''}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得短信发送列表
    public string GetSmsSendList(string strPhoneNumber, string strSendNumber, int sendType, int sendStatus, 
        string strStartTime, string strEndTime, string strKeywords, string strSearchType,
        int pageIndex, int pageSize, bool isDesc)
    {
        try
        {
            Zyrh.Tools.DAL.SmsSearchType searchType = Zyrh.Tools.DAL.SmsSearchType.None;
            switch (strSearchType)
            {
                case "PhoneNumber":
                    searchType = Zyrh.Tools.DAL.SmsSearchType.PhoneNumber;
                    break;
                case "SmsContent":
                    searchType = Zyrh.Tools.DAL.SmsSearchType.SmsContent;
                    break;
            }
            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.DBResult dbResult = sm.GetSmsSendLog(string.Empty, strPhoneNumber, strSendNumber, sendType, 
                sendStatus, strStartTime, strEndTime, strKeywords, searchType, pageIndex, pageSize, isDesc);
            DataSet ds = dbResult.dsResult;

            StringBuilder strResult = new StringBuilder();
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append("{result:1");
                strResult.Append(String.Format(",dataCount:{0}", dataCount));
                strResult.Append(",list:[");

                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    Zyrh.Tools.Model.SmsInfo info = sm.FillSmsInfo(dr);

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0}", info.Id));
                    strResult.Append(String.Format(",phoneNumber:'{0}',sendStatus:{1},sendTime:'{2}',sendResult:'{3}',sendNumber:'{4}'",
                        info.PhoneNumber, info.SendStatus, Public.ConvertDateTime(info.SendTime, "-"), info.SendResult, info.SendNumber));
                    strResult.Append(String.Format(",smsTime:'{0}',parentId:{1},childQuantity:{2},createTime:'{3}'",
                        Public.ConvertDateTime(info.SmsTime, "-"), info.ParentId, info.ChildQuantity, Public.ConvertDateTime(info.CreateTime)));
                    strResult.Append(String.Format(",smsContent:'{0}'", Public.FilterJsonValue(info.SmsContent)));
                    strResult.Append("}");
                }
                strResult.Append("]}");

                return strResult.ToString();
            }
            else
            {
                return String.Format("{{result:0,msg:'没有找到相关的短信发送记录',error:''}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得短信发送列表
    public string GetSmsReceiveList(string strPhoneNumber, string strReceiveNumber, string strStartTime, string strEndTime,
        string strKeywords, string strSearchType, int pageIndex, int pageSize, bool isDesc)
    {
        try
        {
            Zyrh.Tools.DAL.SmsSearchType searchType = Zyrh.Tools.DAL.SmsSearchType.None;
            switch (strSearchType)
            {
                case "PhoneNumber":
                    searchType = Zyrh.Tools.DAL.SmsSearchType.PhoneNumber;
                    break;
                case "SmsContent":
                    searchType = Zyrh.Tools.DAL.SmsSearchType.SmsContent;
                    break;
            }

            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.DBResult dbResult = sm.GetSmsReceiveLog(string.Empty, strPhoneNumber, strReceiveNumber,
                strStartTime, strEndTime, strKeywords, searchType, pageIndex, pageSize, isDesc);
            DataSet ds = dbResult.dsResult;

            StringBuilder strResult = new StringBuilder();
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append("{result:1");
                strResult.Append(String.Format(",dataCount:{0}", dataCount));
                strResult.Append(",list:[");

                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    Zyrh.Tools.Model.SmsReceiveInfo info = sm.FillSmsReceiveInfo(dr);

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0}", info.Id));
                    strResult.Append(String.Format(",phoneNumber:'{0}',receiveNumber:'{1}',receiveTime:'{2}',createTime:'{3}'",
                        info.PhoneNumber, info.ReceiveNumber, Public.ConvertDateTime(info.ReceiveTime), Public.ConvertDateTime(info.CreateTime)));
                    strResult.Append(String.Format(",smsContent:'{0}'", Public.FilterJsonValue(info.SmsContent)));
                    strResult.Append("}");
                }
                strResult.Append("]}");

                return strResult.ToString();
            }
            else
            {
                return String.Format("{{result:0,msg:'没有找到相关的短信接收记录',error:''}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  发送短信
    public string AddSmsSend(string strPhoneNumber, string strSmsContent, string strSmsTime, int model, int dataType, 
        int response, bool isP2P)
    {
        try
        {
            SmsSocketClient.ConnectServer();
        }
        catch (Exception exx)
        {
            string strMsg = String.Format("SMS服务器（{0}:{1}）连接失败，请检查服务器程序是否运行", SmsSocketClient.strServerIp, SmsSocketClient.iServerPort);

            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", strMsg, Public.BuildExceptionCode(exx, HttpContext.Current));
        }
        try
        {
            int type = 1;
            string strLogIdList = string.Empty;
            string strParamList = string.Empty;

            if (strPhoneNumber.Equals(string.Empty) || strSmsContent.Equals(string.Empty))
            {
                return String.Format("{{result:0,msg:'{0}',error:''}}", "手机号码为空或短信内容为空");
            }

            string[] arrTemp = strPhoneNumber.Split(',');
            ArrayList arrPhone = new ArrayList();
            StringBuilder strIds = new StringBuilder();
            StringBuilder strParams = new StringBuilder();
            bool isMulti = false;
            string strNumber = string.Empty;
            string strNewSmsContent = string.Empty;

            foreach (string num in arrTemp)
            {
                if (num.Equals(string.Empty))
                {
                    continue;
                }
                arrPhone.Add(num);
            }

            if (arrPhone.Count == 1)
            {
                strLogIdList = this.AddSmsInfo(strPhoneNumber, strSmsContent, strSmsTime, model, 0, 0).ToString();
                strParamList = String.Format("'{0}_{1}'", strPhoneNumber, Public.FilterJsonValue(String.Format(strSmsContent, strPhoneNumber)));
            }
            else if (arrPhone.Count > 1)
            {
                isMulti = true;

                int parentId = this.AddSmsInfo(string.Empty, strSmsContent, strSmsTime, model, 0, arrPhone.Count);

                foreach (string str in arrPhone)
                {
                    strIds.Append(",");
                    strIds.Append(this.AddSmsInfo(str, strSmsContent, strSmsTime, model, parentId, 0).ToString());
                    strParams.Append(String.Format(",'{0}_{1}'", str, Public.FilterJsonValue(String.Format(strSmsContent, str))));
                }
                if (strIds.Length > 0)
                {
                    strLogIdList = strIds.ToString().Substring(1);
                    strParamList = strParams.ToString().Substring(1);
                }
            }
            else
            {
                return String.Format("{{result:0,msg:'{0}',error:''}}", "手机号码错误");
            }

            bool isSuccess = false;
            string ipAddr = new DomainIp().GetIpAddress();

            if (isMulti && isP2P)
            {
                //逐条发送
                string[] arrIdList = strLogIdList.Split(',');
                for (int i = 0, c = arrIdList.Length; i < c; i++)
                {
                    try
                    {
                        //格式化短信内容（目的是在短信内容中增加手机号码）
                        strNewSmsContent = String.Format(strSmsContent, arrPhone[i].ToString());

                        WebSmsProtocol wsp = this.FillProtocolData(arrPhone[i].ToString(), strNewSmsContent, strSmsTime, model, type, dataType, response, arrIdList[i]);

                        string strXml = new WebProtocolSms().BuildSmsProtocol(wsp);

                        isSuccess = SmsSocketClient.SendProtocol(strXml);

                        ServerLog.WriteEventLog(HttpContext.Current.Request, "SmsProtocolSend", "\r\n" + strXml + "From:" + ipAddr);
                    }
                    catch (Exception exxx)
                    {
                        continue;
                    }
                }
            }
            else
            {
                type = isMulti ? 2 : 1;

                //批量发送
                WebSmsProtocol wsp = this.FillProtocolData(strPhoneNumber, strSmsContent, strSmsTime, model, type, dataType, response, strLogIdList);

                string strXml = new WebProtocolSms().BuildSmsProtocol(wsp);

                isSuccess = SmsSocketClient.SendProtocol(strXml);

                ServerLog.WriteEventLog(HttpContext.Current.Request, "SmsProtocolSend", "\r\n" + strXml + "From:" + ipAddr);
            }          

            if (!isSuccess)
            {
                return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败");
            }

            return String.Format("{{result:1,list:[{0}],param:[{1}]}}", strLogIdList, strParamList);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  添加短信发送记录
    public int AddSmsInfo(string strPhoneNumber, string strSmsContent, string strSmsTime, int sendType, int parentId, int childQuantity)
    {
        try
        {
            Zyrh.Tools.Model.SmsInfo sms = new Zyrh.Tools.Model.SmsInfo();
            sms.PhoneNumber = strPhoneNumber;
            sms.SmsContent = String.Format(strSmsContent, strPhoneNumber);
            sms.SmsTime = strSmsTime;
            sms.SendType = sendType;
            sms.ParentId = parentId;
            sms.ChildQuantity = childQuantity;
            sms.CreateTime = Public.GetDateTime();

            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.DBResult dbResult = sm.AddSmsLog(string.Empty, sms);
            return dbResult.iResult;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  填充协议数据
    public WebSmsProtocol FillProtocolData(string strPhoneNumber, string strSmsContent, string strSmsTime, int model, int type,
        int dataType, int response, string strIdList)
    {
        try
        {
            WebSmsProtocol info = new WebSmsProtocol();
            info.PhoneNumber = strPhoneNumber;
            info.SmsContentList.Add(new SmsContent(strIdList, strSmsContent));
            info.Model = model;
            info.Type = type;
            info.DataType = dataType;
            info.Response = response;
            info.SendTime = Public.GetDateTime();
            info.Timeout = 30;

            return info;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得电话录音文件
    public string GetSoundRecordList(string strStartTime, string strEndTime, int inOut, string strPhoneNumber,
        string strTargetNumber, int pageIndex, int pageSize, bool isDesc)
    {
        try
        {
            Zyrh.Tools.BLL.SoundRecordManage srm = new Zyrh.Tools.BLL.SoundRecordManage(Public.ToolsDBConnectionString);
            int dataCount = srm.GetSoundRecordTotal(strStartTime, strEndTime, strTargetNumber, strPhoneNumber, inOut, -1, -1);
            List<Zyrh.Tools.Model.SoundRecordInfo> lstInfo = srm.GetSoundRecordList(strStartTime, strEndTime, strTargetNumber,
                strPhoneNumber, inOut, -1, -1, pageIndex, pageSize, isDesc);

            StringBuilder strResult = new StringBuilder();
            if (lstInfo.Count == 0)
            {
                return String.Format("{{result:0,msg:'没有找到相关的电话录音文件记录',error:''}}");
            }
            else
            {
                string strFileDir = String.Format("{0}/{1}/", Public.WebDir, Public.SoundRecordFileDir).Replace("//", "/");

                strResult.Append("{result:1");
                strResult.Append(String.Format(",dataCount:{0}", dataCount));
                strResult.Append(String.Format(",fileDir:'{0}'", strFileDir));
                strResult.Append(",list:[");
                int n = 0;
                foreach (Zyrh.Tools.Model.SoundRecordInfo info in lstInfo)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("startTime:'{0}',endTime:'{1}',duration:{2},inOut:{3}",
                        Public.ConvertDateTime(info.StartTime), Public.ConvertDateTime(info.EndTime), info.Duration, info.InOut));
                    strResult.Append(String.Format(",phoneNumber:'{0}',targetNumber:'{1}',filePath:'{2}',fileSize:'{3}'",
                        info.PhoneNumber, info.TargetNumber, info.FilePath, this.ShowFileSize(this.GetRecordFileSize(info.FilePath, info.FileSize))));
                    strResult.Append(String.Format(",createTime:'{0}',id:{1}",
                        Public.ConvertDateTime(info.CreateTime), info.Id));
                    strResult.Append("}");
                }
                strResult.Append("]");
                strResult.Append("}");
            }

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  删除电话录音记录
    protected string DeleteSoundRecordFile(string strDate, int id)
    {
        try
        {
            Zyrh.Tools.BLL.SoundRecordManage srm = new Zyrh.Tools.BLL.SoundRecordManage(Public.ToolsDBConnectionString);
            string strTableName = srm.BuildTableName(strDate.Replace("-", "").Substring(0, 6));
            Zyrh.Tools.Model.DBResult dbResult = srm.DeleteSoundRecord(strTableName, id);
            if (dbResult.iResult > 0)
            {
                return "{result:1}";
            }
            else
            {
                return "{result:0,msg:'电话录音记录删除失败',error:''}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得录音文件大小
    public int GetRecordFileSize(string strFilePath, int fileSize)
    {
        try
        {
            if (fileSize > 0)
            {
                return fileSize;
            }
            string strRealPath = Server.MapPath(String.Format("{0}/{1}", Public.SoundRecordFileDir, strFilePath));
            if (!File.Exists(strRealPath))
            {
                return -1;
            }
            FileInfo file = new FileInfo(strRealPath);

            return Convert.ToInt32(file.Length);
        }
        catch (Exception ex)
        {
            //ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return -1;
        }
    }
    #endregion
    
    #region  显示文件大小
    public string ShowFileSize(int fs)
    {
        if (-1 == fs)
        {
            return "-1";
        }
        string strResult = string.Empty;
        double d = Convert.ToDouble(fs);
        string strUnit = string.Empty;

        if (fs > (1024 * 1024))
        {
            d = Math.Round(d / 1024 / 1024, 2);

            strUnit = "MB";
        }
        else if (fs > 1024)
        {
            d = Math.Round(d / 1024, 2);
            strUnit = "KB";
        }
        else
        {
            d = Math.Round(d / 1024, 2);
            strUnit = "KB";
        }

        return String.Format("{0} {1}", d, strUnit);
    }
    #endregion

}