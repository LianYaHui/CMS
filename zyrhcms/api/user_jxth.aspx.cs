using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Text;
using System.Text.RegularExpressions;
using Zyrh.BLL;
using Zyrh.Model;

public partial class api_user_jxth : System.Web.UI.Page
{

    protected string strAction = string.Empty;
    protected string strUserName = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        try
        {
            if (!this.Request.RequestType.Equals("GET"))
            {
                Response.Write("{\"ifSuccess\":false, \"msg\":\"请求方式错误！\"}");
                Response.End();
            }
            this.strAction = Public.RequestString("action");
            this.strUserName = Public.RequestString("user");
            switch (this.strAction)
            {
                case "CheckUserIsExist":
                    Response.Write(this.CheckUser(this.strUserName));
                    break;
                default:
                    Response.Write(String.Format("ok,{0}", Public.GetDateTime()));
                    break;
            }
        }
        catch (Exception ex)
        {
            Response.Write(this.BuildResult(false, "应用程序错误！"));
        }
    }

    protected string CheckUser(string strUserName)
    {
        try
        {
            string strUserNamePattern = "^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$";
            if (!new Regex(strUserNamePattern).IsMatch(strUserName))
            {
                return this.BuildResult(false, "用户名格式错误！");
            }

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(strUserName);
            if (!um.CheckUser(ui, strUserName))
            {
                return this.BuildResult(false, "用户不存在！");
            }
            else
            {
                if (ui.Status == 0)
                {
                    return this.BuildResult(true, "");
                }
                else if (ui.Status == 1)
                {
                    return this.BuildResult(false, "用户帐户被冻结！");
                }
                else if (ui.Status == 2)
                {
                    return this.BuildResult(false, "用户帐户已注销！");
                }
                else if (!ui.ExpireTime.Equals(string.Empty) && DateTime.Compare(DateTime.Parse(ui.ExpireTime), DateTime.Now) == -1)
                {
                    return this.BuildResult(false, "用户帐户已过期！");
                }

                return this.BuildResult(false, "用户不存在！");
            }
        }
        catch (Exception ex)
        {
            return this.BuildResult(false, "应用程序错误2！");
        }
    }

    public string BuildResult(bool isSuccess, string strMsg)
    {
        return String.Format("{{\"ifSuccess\":{0}, \"msg\":\"{1}\"}}", isSuccess ? "true" : "false", strMsg);
    }

}