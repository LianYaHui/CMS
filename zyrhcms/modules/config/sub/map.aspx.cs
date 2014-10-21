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
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_config_map : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetConfigFileName());
    protected string strKeyName = "MapCenter";
    protected string strPageTitle = "LOGO图片设置";
    protected string strFileDir = String.Format("{0}{1}/", Config.WebDir, Config.ImageDir);

    protected string strTitle = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.CheckUserRole();
        
        if (!IsPostBack)
        {
            this.strTitle = Public.RequestString("title");
            this.InitialData();
        }
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        if (uc.CheckUserLogin())
        {
            ui = uc.GetLoginUserInfo();
        }
    }
    #endregion


    #region  检测用户权限
    public void CheckUserRole()
    {
        try
        {
            if (!uc.CheckUserLogin())
            {
                this.Server.Transfer(Public.WebDir + Public.NoAuthUrl, false);
            }

            if (!uc.IsFounder)
            {
                Response.Write("您没有权限设置系统配置");
                Response.Flush();
                Response.End();
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion


    #region  初始化
    public void InitialData()
    {
        try
        {
            this.txtLatLng.Value = Config.GetAppSetting("MapCenter");

            for (int i = 18; i >= 3; i--)
            {
                ListItem li = new ListItem(i.ToString(), i.ToString());
                this.ddlMapZoom.Items.Add(li);
            }
            this.ddlMapZoom.Value = Config.GetAppSetting("MapZoom");

            this.ddlMapType.Value = Config.GetAppSetting("MapType");
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  验证帐户密码
    protected bool CheckUserPwd(string strUserName, string strUserPwd)
    {
        try
        {
            if (strUserPwd.Equals(string.Empty))
            {
                return false;
            }
            if (strUserPwd.Length != 32 && !UserCenter.CheckUserPwdFormat(strUserPwd))
            {
                this.lblUserPwd.InnerHtml = "密码格式输入错误！";
                return false;
            }
            UserInfo ui = new UserManage(Public.CmsDBConnectionString).GetUserInfo(strUserName);
            int login = uc.UserLogin(ui, strUserPwd);
            if (login == 1)
            {
                this.lblUserPwd.InnerHtml = "";
                return true;
            }
            else if (login > 0)
            {
                this.lblUserPwd.InnerHtml = "帐户已注销或受限！";
                return false;
            }
            else
            {
                this.lblUserPwd.InnerHtml = "密码输入错误！";
                return false;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  设置地图
    public void SetMap()
    {
        try
        {
            string strUserPwd = this.txtUserPwd.Value.Trim();
            string strUserName = uc.GetLoginUserName();
            string strMapCenter = this.txtLatLng.Value.Trim();
            int zoom = DataConvert.ConvertValue(this.ddlMapZoom.Value.ToString(), 12);
            string strMapType = this.ddlMapType.Value.ToString();

            if (!this.CheckUserPwd(strUserName, strUserPwd))
            {
                return;
            }
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("MapCenter", strMapCenter);
            dic.Add("MapZoom", zoom.ToString());
            dic.Add("MapType", strMapType);

            ConfigOperate co = new ConfigOperate();
            co.UpdateAppSettings(this.strConfigFileName, dic);

            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnSave_ServerClick(object sender, EventArgs e)
    {
        this.SetMap();
    }

    protected string ConvertChar(string strContent)
    {
        return HttpUtility.HtmlEncode(strContent).Replace("\r\n", "");//.Replace("&", "&amp;").Replace("\"", "&quot;").Replace("\r\n", "");
    }

    protected string RevertChar(string strContent)
    {
        return HttpUtility.HtmlDecode(strContent);//.Replace("&amp;", "&").Replace("&quot;", "\"");
    }

}