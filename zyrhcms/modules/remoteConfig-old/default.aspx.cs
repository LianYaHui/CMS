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

public partial class modules_remoteConfig_default : System.Web.UI.Page
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
    protected string strDevInfo = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Master.PageTitle = "远程配置";
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
            if (!uc.CheckUserLogin())
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
                    int isExist = 0;
                    if (this.strDevCode.IndexOf(',') < 0)
                    {
                        isExist = dm.CheckDeviceIndexCodeIsExist(this.strDevCode);
                    }
                    else
                    {
                        isExist = dm.CheckDeviceIndexCodeListIsExist(string.Empty, this.strDevCode);
                    }
                    if (isExist <= 0)
                    {
                        this.Response.Write("错误：设备不存在！");
                        this.Response.Flush();
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
            //加载第一个设备的基本信息
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode.Split(',')[0]);

            StringBuilder strDev = new StringBuilder();
            strDev.Append("<script type=\"text/javascript\">\r\n");
            strDev.Append("var devInfo = {");
            strDev.Append(String.Format("devId:{0},devCode:'{1}',devName:'{2}',channelCount:{3},typeCode:{4},networkMode:'{5}'",
                di.DevId, di.DevCode, di.DevName, di.CameraChannelCount, di.TypeCode, di.NetworkMode));
            strDev.Append(String.Format(",pagServerIp:'{0}',pagServerPort:'{1}',storeServerIp:'{2}',storeServerPort:'{3}'",
                di.devPagServer.ServerIp, di.devPagServer.ServerPort, di.devStoreServer.ServerIp, di.devStoreServer.ServerPort));
            strDev.Append("};");
            strDev.Append("\r\n</script>");

            this.strDevInfo = strDev.ToString();
        }
        catch (Exception ex) { }
    }
    #endregion

}
