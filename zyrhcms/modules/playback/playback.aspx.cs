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
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class modules_playback1_playback : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceInfo di = new DeviceInfo();
    protected UserCenter uc = new UserCenter();
    protected string strDevCode = string.Empty;
    protected string strDevName = string.Empty;
    protected string strDevId = string.Empty;
    protected string strServerIp = string.Empty;
    protected string strServerPort = string.Empty;
    protected string strStoreServerIp = string.Empty;
    protected string strStoreServerPort = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;
    protected int lineId = 1;
    protected string strMaxDate = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");

    protected void Page_Load(object sender, EventArgs e)
    {
        Master.PageTitle = "录像回放";
        Master.ShowPageTop(false);
        if (!IsPostBack)
        {
            this.strDevCode = Public.RequestString("devCode");
            this.strUserName = Public.RequestString("user");
            this.strUserPwd = Public.RequestString("pwd");
            this.lineId = Public.RequestString("lineId", 1);

            this.InitialData();
            this.GetDeviceInfo(this.strDevCode);
        }
    }

    protected void InitialData()
    {
        try
        {
            if (!uc.CheckUserLogin() || (!this.strUserName.Equals(string.Empty) && !uc.GetLoginUserName().Equals(this.strUserName)))
            {
                if (this.strUserName.Equals(string.Empty) || this.strUserPwd.Equals(string.Empty))
                {
                    this.Response.Write("错误：对不起，您还没有登录！");
                    this.Response.End();
                }
                else if (!this.strUserName.Equals(string.Empty) && !this.strUserPwd.Equals(string.Empty))
                {
                    if (this.strUserPwd.Length != 32)
                    {
                        this.strUserPwd = Encrypt.HashEncrypt(this.strUserPwd, EncryptFormat.MD5).ToLower();
                    }
                    if (new UserLogin().Login(this.strUserName, this.strUserPwd.ToLower(), this.lineId) != "1")
                    {
                        this.Response.Write("错误：用户名不存在或密码错误！");
                        this.Response.End();
                    }
                }
            }
            else
            {
                if (this.strDevCode.Equals(string.Empty))
                {
                    this.Response.Write("错误：参数不正确，没有指定要录像回放的设备索引编号！");
                    this.Response.End();
                }
                else
                {
                    DeviceManage dm = new DeviceManage(this.DBConnectionString);
                    int isExist = dm.CheckDeviceIndexCodeIsExist(this.strDevCode);
                    if (isExist <= 0)
                    {
                        this.Response.Write("错误：设备不存在！");
                        this.Response.End();
                    }
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }

    #region  获得设备信息
    protected void GetDeviceInfo(string strDevCode)
    {
        try
        {
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
            this.strDevName = di.DevName;
            this.strDevId = di.DevId.ToString();
            this.strServerIp = di.DagServer.ServerIp;
            this.strServerPort = di.DagServer.ServerPort.ToString();
            this.strStoreServerIp = di.CagServer.ServerIp;
            this.strStoreServerPort = di.CagServer.ServerPort.ToString();
        }
        catch (Exception ex) { }
    }
    #endregion

}