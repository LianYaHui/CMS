using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using Zyrh.Tools;

/// <summary>
/// ZyrhSmsService 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhSmsService")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhSmsService : System.Web.Services.WebService
{
    public ZyrhSmsService()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod(Description = "获取短信内容")]
    public SmsContentWS GetSmsContent(int id)
    {
        try
        {
            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.DBResult dbResult = sm.GetSmsSendLog(string.Empty, id);
            DataSet ds = dbResult.dsResult;

            SmsContentWS sc = new SmsContentWS();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                Zyrh.Tools.Model.SmsInfo info = sm.FillSmsInfo(ds.Tables[0].Rows[0]);
                sc.PhoneNumber = info.PhoneNumber;
                sc.SmsContent = info.SmsContent;
                sc.SmsTime = info.SmsTime;
                sc.SendType = info.SendType;
            }

            return sc;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }

    [WebMethod(Description = "获取多个短信内容列表")]
    public List<SmsContentWS> GetSmsContentList(int[] arrId)
    {
        try
        {
            StringBuilder strIdList = new StringBuilder();
            int n = 0;
            foreach (int id in arrId)
            {
                strIdList.Append(n++ > 0 ? "," : "");
                strIdList.Append(id.ToString());
            }
            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.DBResult dbResult = sm.GetSmsSendLog(string.Empty, strIdList.ToString());
            DataSet ds = dbResult.dsResult;

            List<SmsContentWS> lstInfo = new List<SmsContentWS>();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    SmsContentWS sc = new SmsContentWS();

                    Zyrh.Tools.Model.SmsInfo info = sm.FillSmsInfo(dr);
                    sc.PhoneNumber = info.PhoneNumber;
                    sc.SmsContent = info.SmsContent;
                    sc.SmsTime = info.SmsTime;
                    sc.SendType = info.SendType;

                    lstInfo.Add(sc);
                }
            }

            return lstInfo;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }

    [WebMethod(Description = "更新短信发送状态")]
    public bool UpdateSmsSendStatus(int id, int sendStatus, string strSendTime, string strSendNumber, string strSendResult)
    {
        try
        {
            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.SmsInfo info = new Zyrh.Tools.Model.SmsInfo();
            info.SendTime = Public.ConvertDateTime(strSendTime);
            info.SendStatus = sendStatus;
            info.SendNumber = strSendNumber;
            info.SendResult = strSendResult;
            info.Id = id;

            if (info.SendTime.Equals(string.Empty))
            {
                info.SendTime = Public.GetDateTime();
            }

            Zyrh.Tools.Model.DBResult dbResult = sm.UpdateSmsSendStatus(string.Empty, info);

            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }

    [WebMethod(Description = "新增短信接收（保存服务器接收到的短信）")]
    public bool AddSmsReceive(string strPhoneNumber, string strReceiveNumber, string strSmsContent, string strReceiveTime)
    {
        try
        {
            Zyrh.Tools.BLL.SmsManage sm = new Zyrh.Tools.BLL.SmsManage(Public.ToolsDBConnectionString);
            Zyrh.Tools.Model.SmsReceiveInfo info = new Zyrh.Tools.Model.SmsReceiveInfo();
            info.PhoneNumber = strPhoneNumber;
            info.ReceiveNumber = strReceiveNumber;
            info.SmsContent = strSmsContent;
            info.ReceiveTime = Public.ConvertDateTime(strReceiveTime);
            info.CreateTime = Public.GetDateTime();

            if (info.ReceiveTime.Equals(string.Empty))
            {
                info.ReceiveTime = Public.GetDateTime();
            }

            Zyrh.Tools.Model.DBResult dbResult = sm.AddSmsReceive(string.Empty, info);

            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }

}

public class SmsContentWS
{
    private int id = 0;
    public int Id
    {
        get { return this.id; }
        set { this.id = value; }
    }

    private string phone_number = string.Empty;
    public string PhoneNumber
    {
        get { return this.phone_number; }
        set { this.phone_number = value; }
    }

    private string sms_content = string.Empty;
    public string SmsContent
    {
        get { return this.sms_content; }
        set { this.sms_content = value; }
    }

    private string sms_time = string.Empty;
    public string SmsTime
    {
        get { return this.sms_time; }
        set { this.sms_time = value; }
    }

    private int send_type = 0;
    public int SendType
    {
        get { return this.send_type; }
        set { this.send_type = value; }
    }
}

public class SmsReceiveWS
{
    private string phoneNumber = string.Empty;
    public string PhoneNumber
    {
        get { return this.phoneNumber; }
        set { this.phoneNumber = value; }
    }

    private string smsContent = string.Empty;
    public string SmsContent
    {
        get { return this.smsContent; }
        set { this.smsContent = value; }
    }

    private string receiveTime = string.Empty;
    public string ReceiveTime
    {
        get { return this.receiveTime; }
        set { this.receiveTime = value; }
    }

}