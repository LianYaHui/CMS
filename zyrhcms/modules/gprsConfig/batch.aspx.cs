using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Text.RegularExpressions;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class modules_gprsConfig_batch : System.Web.UI.Page
{

    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceInfo di = new DeviceInfo();
    protected UserCenter uc = new UserCenter();
    protected string strDevCode = string.Empty;
    protected string strDevName = string.Empty;
    protected string strDevId = string.Empty;
    protected string strChannelCount = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;
    protected int lineId = 1;

    protected void Page_Load(object sender, EventArgs e)
    {
        Master.PageTitle = "GPRS批量设置";
        Master.ShowPageTop(false);
        if (!IsPostBack)
        {
            this.strDevCode = Public.RequestString("devCode");
            this.strUserName = Public.RequestString("user");
            this.strUserPwd = Public.RequestString("pwd");
            this.lineId = Public.RequestString("lineId", 1);

            this.InitialData();
        }

    }

    #region  初始化
    protected void InitialData()
    {
        try
        {
            if (!uc.CheckUserLogin() || (!this.strUserName.Equals(string.Empty) && !uc.GetLoginUserName().Equals(this.strUserName)))
            {
                if (this.strUserName.Equals(string.Empty) || this.strUserPwd.Equals(string.Empty))
                {
                    this.Response.Write("错误：对不起，您还没有登录！");
                    this.Response.Flush();
                    this.Response.End();
                }
                else if (!this.strUserName.Equals(string.Empty) && !this.strUserPwd.Equals(string.Empty))
                {
                    if (this.strUserPwd.Length != 32)
                    {
                        this.strUserPwd = Encrypt.HashEncrypt(this.strUserPwd, EncryptFormat.MD5).ToLower();
                    }
                    string strResult = new UserLogin().Login(this.strUserName, this.strUserPwd.ToLower(), this.lineId);
                    if (new UserLogin().Login(this.strUserName, this.strUserPwd.ToLower(), this.lineId) != "1")
                    {
                        this.Response.Write("错误：用户名不存在或密码错误！");
                        this.Response.Flush();
                        this.Response.End();
                    }
                }
            }
            else
            {
                if (this.strDevCode.Equals(string.Empty))
                {
                    this.Response.Write("错误：参数不正确，没有指定要预览的设备索引编号！");
                    this.Response.Flush();
                    this.Response.End();
                }
                else
                {
                    DeviceManage dm = new DeviceManage(this.DBConnectionString);
                    DBResultInfo dbDevList = dm.GetDeviceBaseInfoList(strDevCode);
                    DataSet dsDevList = dbDevList.dsResult;
                    if (dsDevList == null || dsDevList.Tables[0] == null || dsDevList.Tables[0].Rows.Count == 0)
                    {
                        this.Response.Write("错误：设备不存在！");
                        this.Response.Flush();
                        this.Response.End();
                    }
                    else
                    {
                        this.txtDevCodeList.Value = strDevCode;

                        this.GetDeviceInfo(strDevCode);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

    #region  获得设备信息
    public void GetDeviceInfo(string strDevCodeList)
    {
        try
        {
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DBResultInfo dbDevList = dm.GetDeviceBaseInfoList(strDevCodeList);
            DataSet dsDevList = dbDevList.dsResult;
            StringBuilder strResult = new StringBuilder();

            if (dsDevList != null && dsDevList.Tables[0] != null && dsDevList.Tables[0].Rows.Count > 0)
            {
                strResult.Append("<table>");
                foreach (DataRow dr in dsDevList.Tables[0].Rows)
                {
                    DeviceInfo info = dm.FillDeviceBaseInfo(dr);

                    strResult.Append("<tr>");

                    strResult.Append(String.Format("<td><label><input type=\"checkbox\" name=\"chbDevCode\" value=\"{0}\" checked=\"checked\" />{1}({2}) [{3}]</label></td>",
                        info.DevCode, info.DevName, info.DevCode, info.TypeCode));

                    strResult.Append("</tr>");
                }
                strResult.Append("</table>");

                this.divDev.InnerHtml = strResult.ToString();
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
