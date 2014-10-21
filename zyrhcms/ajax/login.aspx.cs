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
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Server;

public partial class ajax_login : System.Web.UI.Page
{
    protected Encrypt encrypt = new Encrypt();

    protected string strAction = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;
    protected string strVCode = string.Empty;
    protected int lineId = 0;
    protected bool isRememberPwd = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

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

        switch (this.strAction)
        {
            case "getServerLine":
                int isDisplay = Public.RequestString("isDisplay", 1);
                Response.Write(this.GetServerLine(isDisplay));
                break;
            case "userLogin":
                this.strUserName = Public.RequestString("userName", string.Empty);
                this.strUserPwd = Public.RequestString("userPwd", string.Empty);
                this.lineId = Public.RequestString("lineId", 0);
                this.isRememberPwd = Public.RequestString("rememberPwd", 0) == 1;
                this.strVCode = Public.RequestString("vcode", string.Empty);
                Response.Write(this.UserLogin(this.strUserName, this.strUserPwd, this.lineId, this.isRememberPwd));
                break;
            case "userLoginKeep":
                this.strUserName = Public.RequestString("userName", string.Empty);
                this.strUserPwd = Public.RequestString("userPwd", string.Empty);
                this.lineId = Public.RequestString("lineId", 0);
                Response.Write(this.UserLoginKeep(this.strUserName, this.strUserPwd, this.lineId));
                break;
            case "getUserCookie":
                Response.Write(this.GetUserCookie());
                break;
            case "checkVerifyCode":
                this.strVCode = Public.RequestString("vcode", string.Empty);
                Response.Write(this.CheckVerifyCode(strVCode));
                break;
            case "checkIsNeedVerifyCode":
                this.strUserName = Public.RequestString("userName", string.Empty);
                Response.Write(this.GetCheckIsNeedVerifyCode(strUserName));
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }

        Response.Flush();
        Response.End();
    }

    #region 获得登录线路
    private string GetServerLine(int isDisplay)
    {
        try
        {
            StringBuilder strLine = new StringBuilder();
            ServerLineManage sm = new ServerLineManage(Public.CmsDBConnectionString);
            List<ServerLineInfo> lstLine = new List<ServerLineInfo>();
            DataSet ds = sm.GetServerLine(isDisplay);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ServerLineInfo info = sm.FillServerLineInfo(dr);
                    if (i++ > 0)
                    {
                        strLine.Append(",");
                    }
                    strLine.Append("{");
                    strLine.Append(String.Format("id:{0},name:'{1}',code:'{2}',remark:'{3}'",
                        info.Id, info.LineName, info.LineCode, Public.FilterJsonValue(info.Remark)));
                    strLine.Append("}");
                }
                return String.Format("{{result:1,list:[{0}]}}", strLine);
            }
            return "{result:0,msg:'没有找到服务器线路信息',error:'',list:[]}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  用户登录
    protected string UserLogin(string strUserName, string strUserPwd, int lineId, bool isRememberPwd)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            string strUserNamePattern = "^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$";
            string strUserPwdPattern = "^[\\w.]{3,25}$";

            bool vc = false;

            if (!new Regex(strUserNamePattern).IsMatch(strUserName))
            {
                return "{result:0, msg:'用户名格式输入错误！'}";
            }
            else if (strUserPwd.Length != 32 && !new Regex(strUserPwdPattern).IsMatch(strUserPwd))
            {
                return "{result:0, msg:'密码格式输入错误！'}";
            }
            else if (this.CheckIsNeedVerifyCode(strUserName) && !this.ValidateVerifyCode(strVCode))
            {
                vc = this.CheckIsNeedVerifyCode(strUserName);
                return String.Format("{{result:-2, msg:'验证码输入错误！',error:'',vc:{0}}}", vc ? "true" : "false");
            }

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserCenter uc = new UserCenter();
            UserInfo ui = um.GetUserInfo(strUserName);

            if (strUserPwd.Length != 32)
            {
                strUserPwd = Encrypt.HashEncrypt(strUserPwd, EncryptFormat.MD5).ToLower();
            }
            int login = uc.UserLogin(ui, strUserPwd);
            if (login == 1)
            {
                bool isSaveName = Config.SaveAdminName();
                bool isSavePwd = Config.SaveAdminPassword();

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

                strUserName = isRememberPwd && (isSaveName || isSavePwd) ? strUserName : string.Empty;
                strUserPwd = isRememberPwd && isSavePwd ? strUserPwd : string.Empty;
                uc.SetUserCookie(strUserName, strUserPwd, lineId, isRememberPwd, Public.GetDateTime(), us.LoginAddr, 30);

                UserCenter.SetLoginFailedTimes(strUserName, true);

                UserCenter.ClearUserVerifyCode();

                return String.Format("{{result:1}}");
            }
            else if (login > 0)
            {
                UserCenter.SetLoginFailedTimes(strUserName, false);
                UserCenter.ClearUserVerifyCode();

                return String.Format("{{result:{0}}}", login);
            }
            else
            {
                UserCenter.SetLoginFailedTimes(strUserName, false);
                vc = this.CheckIsNeedVerifyCode(strUserName);

                return String.Format("{{result:0,msg:'用户名不存在或密码错误',vc:{0}}}", vc ? "true" : "false");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion
    
    #region  用户登录状态保持
    protected string UserLoginKeep(string strUserName, string strUserPwd, int lineId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            if (!new Regex("^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$").IsMatch(strUserName))
            {
                return "{result:0, msg:'用户名格式输入错误！'}";
            }
            else if (!new Regex(@"^(\w){32}$").IsMatch(strUserPwd))
            {
                return "{result:0, msg:'密码格式输入错误！'}";
            }

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserCenter uc = new UserCenter();
            UserInfo ui = um.GetUserInfo(strUserName);

            int login = uc.UserLogin(ui, strUserPwd);
            if (login == 1)
            {
                UserStatus us = new UserStatus();
                us.SessionId = uc.GetSessionId();
                us.UserId = ui.UserId;
                us.LoginAddr = new DomainIp().GetIpAddress();
                string strPort = Request.ServerVariables["remote_port"].ToString();
                us.LoginPort = strPort.Equals(string.Empty) ? 0 : Convert.ToInt32(strPort);

                ui.LoginLineId = lineId;
                ui.LoginLineCode = new ServerLineManage(Public.CmsDBConnectionString).GetServerLineCode(ui.LoginLineId);

                //设置用户SESSION
                uc.SetUserSession(strUserName, ui.UserId, ui.UnitId, ui.RoleId, 60, ui.LoginLineId, ui.LoginLineCode);

                return String.Format("{{result:1,userPwd:'{0}',sessionId:'{1}'}}", strUserPwd, us.SessionId);
            }
            else if (login > 0)
            {
                return String.Format("{{result:{0}}}", login);
            }
            else
            {
                return "{result:0,msg:'用户名不存在或密码错误'}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得用户COOKIE
    public string GetUserCookie()
    {
        try
        {
            UserCenter uc = new UserCenter();
            string[] arrCookie = uc.ParseUserCookie(uc.GetUserCookie());
            StringBuilder strResult = new StringBuilder();

            strResult.Append("[");
            for (int i = 0; i < arrCookie.Length; i++)
            {
                strResult.Append(i > 0 ? "," : "");
                strResult.Append(String.Format("'{0}'", arrCookie[i]));
            }
            strResult.Append("]");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  检测是否需要验证码
    public string GetCheckIsNeedVerifyCode(string strUserName)
    {
        return String.Format("{{result:1,vc:{0}}}", UserCenter.CheckIsNeedVerifyCode(strUserName, Config.LoginFailedTimes()) ? "true" : "false");
    }
    #endregion

    #region  检测是否需要验证码
    public bool CheckIsNeedVerifyCode(string strUserName)
    {
        return UserCenter.CheckIsNeedVerifyCode(strUserName, Config.LoginFailedTimes());
    }
    #endregion


    #region  检测验证码是否正确
    public string CheckVerifyCode(string strVerifyCode)
    {
        if (this.ValidateVerifyCode(strVerifyCode))
        {
            return "{result:1,msg:'OK',error:''}";
        }
        return "{result:0,msg:'验证码错误',error:''}";
    }
    #endregion

    #region  检测验证码是否正确
    public bool ValidateVerifyCode(string strVerifyCode)
    {
        return UserCenter.CheckUserVerifyCode(strVerifyCode);
    }
    #endregion

}