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
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_config_config : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetConfigFileName());

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
            this.txtWebName.Value = this.RevertChar(dic["WebName"].ToString());
            this.txtCopyright.Value = this.RevertChar(dic["Copyright"].ToString());

            this.ddlDisabledContextMenu.Value = DataConvert.ConvertValue(dic["DisabledContextMenu"], 10).ToString();

            this.ddlSaveAdminName.Value = DataConvert.ConvertValue(dic["SaveAdminName"], 1).ToString();
            this.ddlSaveAdminPassword.Value = DataConvert.ConvertValue(dic["SaveAdminPassword"], 1).ToString();
            this.ddlAdminAutoLogin.Value = DataConvert.ConvertValue(dic["AdminAutoLogin"], 1).ToString();
            this.ddlLoginFailedTimes.Value = DataConvert.ConvertValue(dic["LoginFailedTimes"], 3).ToString();

            this.ddlValidateRequestType.Value = DataConvert.ConvertValue(dic["ValidateRequestType"], 1).ToString();
            this.ddlValidateUrlReferrer.Value = DataConvert.ConvertValue(dic["ValidateUrlReferrer"], 1).ToString();
            this.ddlValidateRequestToken.Value = DataConvert.ConvertValue(dic["ValidateRequestToken"], 1).ToString();
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

    #region  更新配置信息
    protected void UpdateConfig()
    {
        try
        {
            string strWebName = this.ConvertChar(this.txtWebName.Value.Trim());
            string strCopyright = this.ConvertChar(this.txtCopyright.Value.Trim());

            int disabledContextMenu = DataConvert.ConvertValue(this.ddlDisabledContextMenu.Value.Trim(), 1);

            int saveAdminName = DataConvert.ConvertValue(this.ddlSaveAdminName.Value.Trim(), 1);
            int saveAdminPassword = DataConvert.ConvertValue(this.ddlSaveAdminPassword.Value.Trim(), 1);
            int adminAutoLogin = DataConvert.ConvertValue(this.ddlAdminAutoLogin.Value.Trim(), 1);
            int loginFailedTimes = DataConvert.ConvertValue(this.ddlLoginFailedTimes.Value.Trim(), 3);

            int validateRequestType = DataConvert.ConvertValue(this.ddlSaveAdminPassword.Value.Trim(), 1);
            int validateUrlReferrer = DataConvert.ConvertValue(this.ddlValidateUrlReferrer.Value.Trim(), 1);
            int validateRequestToken = DataConvert.ConvertValue(this.ddlValidateRequestToken.Value.Trim(), 1);

            string strUserPwd = this.txtUserPwd.Value.Trim();
            string strUserName = uc.GetLoginUserName();
            if (!this.CheckUserPwd(strUserName, strUserPwd))
            {
                return;
            }

            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("WebName", strWebName);
            dic.Add("Copyright", strCopyright);

            dic.Add("DisabledContextMenu", disabledContextMenu.ToString());

            dic.Add("SaveAdminName", saveAdminName.ToString());
            dic.Add("SaveAdminPassword", saveAdminPassword.ToString());
            dic.Add("AdminAutoLogin", adminAutoLogin.ToString());
            dic.Add("LoginFailedTimes", loginFailedTimes.ToString());

            dic.Add("ValidateRequestType", validateRequestType.ToString());
            dic.Add("ValidateUrlReferrer", validateUrlReferrer.ToString());
            dic.Add("ValidateRequestToken", validateRequestToken.ToString());

            ConfigOperate co = new ConfigOperate();
            co.UpdateAppSettings(this.strConfigFileName, dic);

            this.GetConfig();

            this.lblError.InnerHtml = "提示：系统配置信息已经修改成功";
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnSave_ServerClick(object sender, EventArgs e)
    {
        this.UpdateConfig();
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