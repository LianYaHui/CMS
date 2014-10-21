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
using Zyrh.Model;

public partial class _default : System.Web.UI.Page
{
    protected CmsMenuManage cmm = new CmsMenuManage(Public.CmsDBConnectionString);
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strUserName = string.Empty;
    protected string strXmlFile = string.Empty;
    protected string strMenuListClient = string.Empty;
    protected string strMenuListManage = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!uc.CheckUserLogin())
            {
                this.Response.Redirect(Config.WebDir + (Request.UrlReferrer == null ? Public.LoginUrl : Public.NoAuthUrl), false);
            }
            else
            {
                this.strUserName = uc.GetLoginUserName();
                this.strXmlFile = Server.MapPath(String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetMenuConfigFileName()));
                Master.PageTitle = Config.GetWebName();
                Master.ShowUserInfo(false);

                UserInfo ui = um.GetUserInfo(this.strUserName);

                if (!IsPostBack)
                {
                    int network = Public.IsInLAN() ? NetworkType.InLAN.GetHashCode() : NetworkType.Internet.GetHashCode();
                    this.strMenuListClient = cmm.BuildCmsMenu(cmm.GetCmsMenu(strXmlFile, MenuType.WebMenu.GetHashCode(), network), string.Empty, true, Public.WebDir, Public.ModulePageUrl, ui);
                    this.strMenuListManage = cmm.BuildCmsMenu(cmm.GetCmsMenu(strXmlFile, MenuType.ManageMenu.GetHashCode(), network), string.Empty, true, Public.WebDir, Public.ModulePageUrl, ui);
                }
            }
        }
        catch (Exception ex) { ServerLog.WriteErrorLog(ex, HttpContext.Current); }
    }

}