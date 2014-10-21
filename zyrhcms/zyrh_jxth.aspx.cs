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
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class zyrh_jxth : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strMenuCode = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;
    protected bool isThirdParty = false;
    protected int showHeader = 1;
    protected int lineId = 1;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    #region  初始化
    protected void InitialData()
    {
        try
        {
            this.strMenuCode = Public.RequestString("menucode", string.Empty);
            this.strUserName = Public.RequestString("user", string.Empty);
            this.strUserPwd = Public.RequestString("pwd", string.Empty);
            this.showHeader = Public.RequestString("showHeader", 0);
            //是否是第三方页面框架调用，如果是则隐藏页头
            this.isThirdParty = true; // Public.RequestString("tp", 0) == 1;


            if (this.strUserName.Equals(string.Empty))
            {
                this.strUserName = Public.RequestString("userName", string.Empty);
            }
            if (this.strUserPwd.Equals(string.Empty))
            {
                this.strUserPwd = Public.RequestString("userPwd", string.Empty);
            }
            if (this.strMenuCode.Equals(string.Empty))
            {
                this.strMenuCode = Public.RequestString("menuCode", string.Empty);
            }

            if (this.isThirdParty)
            {
                this.showHeader = 0;
            }

            if (!uc.CheckUserLogin() || (!this.strUserName.Equals(string.Empty) && !uc.GetLoginUserName().Equals(this.strUserName)))
            {
                if (!this.strUserName.Equals(string.Empty) && !this.strUserPwd.Equals(string.Empty))
                {
                    if (new UserLogin().Login(this.strUserName, this.strUserPwd.ToLower(), this.lineId) != "1")
                    {
                        this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
                        return;
                    }
                }
                else if (!this.strUserName.Equals(string.Empty))
                {
                    if (new UserLogin().Login(this.strUserName) != "1")
                    {
                        this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
                        return;
                    }
                }
            }
            //string strXmlFile = Server.MapPath(Public.WebDir + "/config/menu.config");
            string strXmlFile = Server.MapPath(String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetMenuConfigFileName()));
            CmsMenuInfo cmsMenu = new CmsMenuManage(Public.CmsDBConnectionString).GetCmsMenu(strXmlFile, strMenuCode);
            if (cmsMenu != null)
            {
                if (!cmsMenu.MenuPath.Equals(string.Empty))
                {
                    try
                    {
                        string strConnector = cmsMenu.MenuPath.IndexOf('?') >= 0 ? "&" : "?";
                        this.Server.Execute(String.Format("{0}{1}menuCode={2}&showHeader={3}",
                            Public.WebDir + cmsMenu.MenuPath, strConnector, this.strMenuCode, this.showHeader), false);
                    }
                    catch (System.Threading.ThreadAbortException threadEx)
                    {
                        //页面跳转，非系统错误，故不记录错误信息
                        //ServerLog.WriteErrorLog(threadEx, HttpContext.Current);
                    }
                }
                else
                {
                    //Response.Write("no path");
                    this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
                }
            }
            else
            {
                //Response.Write("无操作权限");
                this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}