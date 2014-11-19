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
using Zyrh.BLL;
using Zyrh.BLL.Server;
using Zyrh.Model;
using Zyrh.Model.Server;
using Zyrh.Common;
using System.Linq;

public partial class login : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected string strPath = "";
    protected string[] arrCookie = new string[4];
    protected string strSaveLabel = "记住密码";
    protected string strSavePwdDisplay = "display:none;";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (uc.CheckUserLogin())
        {
            this.Response.Redirect(Public.WebDir + "/default.aspx", false);
        }
        /*
        if (new DomainIp().GetIpAddress() == "60.12.220.24")
        {
            string[] arrCookie = uc.ParseUserCookie(uc.GetUserCookie());
            for (int i = 0; i < arrCookie.Length; i++)
            {
                Response.Write(arrCookie[i] + ",");
            }
        }
        */


        if (Config.SaveAdminPassword())
        {
            this.strSaveLabel = "记住密码";
            this.strSavePwdDisplay = "";
        }
        else if (Config.SaveAdminName())
        {
            this.strSaveLabel = "记住用户名";
            this.strSavePwdDisplay = "";
        }

        this.CheckUserLogin();
    }


    #region  检测用户COOKIE 自动登录
    protected void CheckUserLogin()
    {
        try
        {
            if (!Config.AdminAutoLogin())
            {
                return;
            }
            this.arrCookie = uc.ParseUserCookie(uc.GetUserCookie());
            if (this.arrCookie.Length < 4)
            {
                return;
            }
            string strUserName = this.arrCookie[0];
            string strUserPwd = this.arrCookie[1];
            int lineId = DataConvert.ConvertValue(this.arrCookie[2], 0);
            bool isRemember = this.arrCookie[3].Equals("1");
            string strLoginTime = this.arrCookie[4];
            string strUserIp = this.arrCookie[5];
            bool isRememberPwd = !strUserPwd.Equals(string.Empty);
            bool isSaveName = Config.SaveAdminName();
            bool isSavePwd = Config.SaveAdminPassword();

            DateTime dtNow = DateTime.Now;
            DateTime dtLog = DateTime.Parse(strLoginTime);
            TimeSpan ts = dtNow - dtLog;

            string strLoginIp = new DomainIp().GetIpAddress();
            string strUserNamePattern = "^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$";
            string strUserPwdPattern = "^[\\w.]{3,25}$";
            bool vc = false;

            //若客户端IP改变 或者COOKIE时间超过24小时，则不启用自动登录
            if (!strUserIp.Equals(strLoginIp) || ts.TotalHours > 24)
            {
                return;
            }
            else if (!new Regex(strUserNamePattern).IsMatch(strUserName))
            {
                return;
            }
            else if (strUserPwd.Length != 32 && !new Regex(strUserPwdPattern).IsMatch(strUserPwd))
            {
                return;
            }

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(strUserName);

            if (strUserPwd.Length != 32)
            {
                strUserPwd = Encrypt.HashEncrypt(strUserPwd, EncryptFormat.MD5).ToLower();
            }
            int login = uc.UserLogin(ui, strUserPwd);

            if (1 == login)
            {
                //登录成功
                //修改登录时间
                um.UpdateUserLoginInfo(ui);

                UserStatus us = new UserStatus();
                us.SessionId = uc.GetSessionId();
                us.UserId = ui.UserId;
                us.LoginAddr = new DomainIp().GetIpAddress();
                string strPort = Request.ServerVariables["remote_port"].ToString();
                us.LoginPort = strPort.Equals(string.Empty) ? 0 : Convert.ToInt32(strPort);

                //记录登录状态
                um.InsertUserStatus(us);

                ui.LoginLineId = lineId;
                ui.LoginLineCode = new ServerLineManage(Public.CmsDBConnectionString).GetServerLineCode(ui.LoginLineId);

                //设置用户SESSION
                uc.SetUserSession(strUserName, ui.UserId, ui.UnitId, ui.RoleId, 60, ui.LoginLineId, ui.LoginLineCode);

                strUserName = isRemember && (isSaveName || isSavePwd) ? strUserName : string.Empty;
                strUserPwd = isRememberPwd && isSavePwd ? strUserPwd : string.Empty;
                isRemember = isRemember && (isSaveName || isSavePwd);
                uc.SetUserCookie(strUserName, strUserPwd, lineId, isRemember, Public.GetDateTime(), us.LoginAddr, 30);

                this.Response.Redirect(Public.WebDir + "/default.aspx", false);
            }
        }
        catch (Exception ex) { }
    }
    #endregion

}