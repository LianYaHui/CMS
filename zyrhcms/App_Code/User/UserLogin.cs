using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text.RegularExpressions;
using System.Text;
using Zyrh.BLL;
using Zyrh.BLL.Server;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Server;

/// <summary>
/// UserLogin 的摘要说明
/// </summary>
public class UserLogin : Page
{
    public UserLogin()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  用户登录
    public string Login(string strUserName, string strUserPwdEncrypt, int lineId)
    {
        try
        {
            if (!new Regex("^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$").IsMatch(strUserName))
            {
                return "用户名格式错误！";
            }
            else if (!new Regex(@"^[a-zA-Z0-9]{32}$").IsMatch(strUserPwdEncrypt))
            {
                return "密码格式错误！";
            }

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserCenter uc = new UserCenter();
            UserInfo ui = um.GetUserInfo(strUserName);

            int login = strUserName.Equals(ui.UserName) ? uc.UserLogin(ui, strUserPwdEncrypt) : 0;
            if (login == 1)
            {
                //登录成功
                //修改登录时间
                um.UpdateUserLoginInfo(ui);

                UserStatus us = new UserStatus();
                us.SessionId = uc.GetSessionId();
                us.UserId = ui.UserId;
                us.LoginAddr = new DomainIp().GetIpAddress();
                string strPort = HttpContext.Current.Request.ServerVariables["remote_port"].ToString();
                us.LoginPort = strPort.Equals(string.Empty) ? 0 : Convert.ToInt32(strPort);

                //记录登录状态
                um.InsertUserStatus(us);

                ui.LoginLineId = lineId;
                ui.LoginLineCode = new ServerLineManage(Public.CmsDBConnectionString).GetServerLineCode(ui.LoginLineId);

                //设置用户SESSION
                uc.SetUserSession(strUserName, ui.UserId, ui.UnitId, ui.RoleId, 60, ui.LoginLineId, ui.LoginLineCode);

                return "1";
            }
            return "0";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return "0";
        }
    }
    #endregion

    #region  用户登录
    /// <summary>
    /// 只传递用户名，登录（江西通慧 客户订制）
    /// </summary>
    /// <param name="strUserName"></param>
    /// <returns></returns>
    public string Login(string strUserName)
    {
        try
        {
            if (!new Regex("^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$").IsMatch(strUserName))
            {
                return "用户名格式错误！";
            }

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserCenter uc = new UserCenter();
            UserInfo ui = um.GetUserInfo(strUserName);
            
            //int login = uc.UserLogin(ui, strUserPwdEncrypt);
            int login = strUserName.Equals(ui.UserName) ? uc.UserLogin(ui, ui.UserPwd) : 0;
            if (login == 1)
            {
                //登录成功
                //修改登录时间
                um.UpdateUserLoginInfo(ui);

                UserStatus us = new UserStatus();
                us.SessionId = uc.GetSessionId();
                us.UserId = ui.UserId;
                us.LoginAddr = new DomainIp().GetIpAddress();
                string strPort = HttpContext.Current.Request.ServerVariables["remote_port"].ToString();
                us.LoginPort = strPort.Equals(string.Empty) ? 0 : Convert.ToInt32(strPort);

                //记录登录状态
                um.InsertUserStatus(us);

                ui.LoginLineId = 1;
                ui.LoginLineCode = new ServerLineManage(Public.CmsDBConnectionString).GetServerLineCode(ui.LoginLineId);

                //设置用户SESSION
                uc.SetUserSession(strUserName, ui.UserId, ui.UnitId, ui.RoleId, 60, ui.LoginLineId, ui.LoginLineCode);

                return "1";
            }
            return "0";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return "0";
        }
    }
    #endregion

    #region  输出登录用户信息
    public string ResponseLoginUserInfo(UserInfo ui)
    {
        return this.ResponseLoginUserInfo(ui, 1);
    }

    public string ResponseLoginUserInfo(UserInfo ui, int loginLineId)
    {
        try
        {
            StringBuilder strJs = new StringBuilder();
            strJs.Append("\r\n    <script type=\"text/javascript\">\r\n");
            strJs.Append(String.Format("    var cmsPath = '{0}';var cmsUrl = '{1}';\r\n",
                Config.GetWebDir(), Config.GetCmsUrl()));
            string strText = "    var loginUser = {{"
                + "userId:{0},userName:'{1}',userPwd:'{2}',userUnit:{3},userRole:{4},userPriority:{5}"
                + ",loginLineId:{6},loginLineCode:{7},timeLimitedPlay:{8}}};\r\n";

            if (ui == null)
            {
                ui = new UserInfo();
            }
            strJs.Append(String.Format(strText, ui.UserId, ui.UserName, ui.UserPwd, ui.UnitId, ui.RoleId, ui.Priority, 
                ui.LoginLineId, ui.LoginLineCode, ui.TimeLimitedPreview));
            //strJs.Append(String.Format("var token = '{0}';\r\n", Token.GetToken()));
            strJs.Append("    </script>");

            return strJs.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return string.Empty;
        }
    }
    #endregion

}