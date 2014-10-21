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

public partial class modules_config_sub_phone : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetConfigFileName());
    protected string strKeyName = "";
    protected string strPageTitle = "电话短信号码设置";

    protected string strTitle = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.CheckUserRole();

        if (!IsPostBack)
        {
            this.strTitle = Public.RequestString("title");
            this.GetConfig();
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

    #region  获得配置信息
    protected void GetConfig()
    {
        try
        {
            ConfigOperate co = new ConfigOperate();
            Dictionary<string, string> dic = co.GetAppSettings(this.strConfigFileName);
            this.txtSoundRecordPhoneNumberList.Text = dic["SoundRecordPhoneNumberList"].ToString();
            this.txtSmsPhoneNumberList.Text = dic["SmsPhoneNumberList"].ToString();
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

    #region  更新电话号码
    protected void UpdatePhoneNumber()
    {
        string strUserPwd = this.txtUserPwd.Value.Trim();
        string strUserName = uc.GetLoginUserName();

        if (!this.CheckUserPwd(strUserName, strUserPwd))
        {
            return;
        }

        string strSoundRecordPhoneNumberList = this.ConvertChar(this.txtSoundRecordPhoneNumberList.Text.Trim()).Replace("，", ",").Replace("/", ",").Replace("|", ",").Replace(".", ",");
        string strSmsPhoneNumberList = this.ConvertChar(this.txtSmsPhoneNumberList.Text.Trim()).Replace("，", ",").Replace("/", ",").Replace("|", ",").Replace(".", ",");
        Dictionary<string, string> dic = new Dictionary<string, string>();
        dic.Add("SoundRecordPhoneNumberList", strSoundRecordPhoneNumberList);
        dic.Add("SmsPhoneNumberList", strSmsPhoneNumberList);

        ConfigOperate co = new ConfigOperate();
        co.UpdateAppSettings(this.strConfigFileName, dic);

        this.GetConfig();

        this.lblError.InnerHtml = "提示：电话号码信息已经修改成功";
    }
    #endregion

    protected void btnUpdate_ServerClick(object sender, EventArgs e)
    {
        this.UpdatePhoneNumber();
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