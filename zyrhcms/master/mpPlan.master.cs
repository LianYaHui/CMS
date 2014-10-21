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
using Zyrh.BLL;
using Zyrh.Model;

public partial class master_mpPlan : System.Web.UI.MasterPage
{
    protected UserCenter uc = new UserCenter();

    protected string strTitle = Public.GetAppSetting("WebName", string.Empty);
    /// <summary>
    /// 页面标题
    /// </summary>
    public string PageTitle
    {
        set { this.strTitle = value; }
    }
    protected bool showHeader = true;

    protected string strCode = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!uc.CheckUserLogin())
        {
            this.Server.Transfer(Public.WebDir + Public.NoAuthUrl, false);
            //this.Response.Redirect(Public.WebDir + Public.LoginUrl, false);
        }
        else
        {
            try
            {
                UserManage um = new UserManage(Public.CmsDBConnectionString);
                UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
                ui.LoginLineId = uc.GetLoginLineId();
                ui.LoginLineCode = uc.GetLoginLineCode();

                UserStatus us = new UserStatus();
                us.SessionId = uc.GetSessionId();
                us.UserId = ui.UserId;

                um.DeleteExpireUserStatus(30);

                //更新登录状态
                um.UpdateUserStatus(us);

                PageTop.LogoName = Config.GetWebLogoName();
                PageTop.LogoImage = Config.GetWebLogo();

                PageTop.UserName = ui.UserName;

                this.strCode = new UserLogin().ResponseLoginUserInfo(ui, uc.GetLoginLineId());

                this.strCode += this.ResponseBaseInfoConfig();
                this.strCode += "";
            }
            catch (Exception ex)
            {
                ServerLog.WriteErrorLog(ex, HttpContext.Current);
            }
        }
    }

    public void ShowPageTop(bool show)
    {
        PageTop.ShowPageTop = show;
    }

    public void ShowUserInfo(bool show)
    {
        PageTop.ShowUserInfo = show;
    }

    public void ShowPageMenu(int menuType, string cueMenuCode)
    {
        UserManage um = new UserManage(Public.CmsDBConnectionString);
        UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
        int network = Public.IsInLAN() ? NetworkType.InLAN.GetHashCode() : NetworkType.Internet.GetHashCode();
        PageTop.BuildMenu(menuType, network, cueMenuCode, false, ui);
    }

    public void ShowPageMenu(int menuType, string cueMenuCode, bool showImg)
    {
        UserManage um = new UserManage(Public.CmsDBConnectionString);
        UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
        int network = Public.IsInLAN() ? NetworkType.InLAN.GetHashCode() : NetworkType.Internet.GetHashCode();
        PageTop.BuildMenu(menuType, network, cueMenuCode, showImg, ui);
    }

    public string ResponseBaseInfoConfig()
    {
        try
        {
            StringBuilder strConfig = new StringBuilder();
            strConfig.Append("\r\n    <script type=\"text/javascript\">");
            strConfig.Append("\r\n    var baseInfoConfig = {");
            strConfig.Append(String.Format("webUrl:'{0}'", Public.GetAppSetting("BaseInfoWebHost")));
            strConfig.Append(String.Format(",webUrlInLAN:'{0}'", Public.GetAppSetting("BaseInfoWebHostInLAN")));
            strConfig.Append("};");
            strConfig.Append(new ThirdParty().GetPageUrlInfo());
            strConfig.Append("    </script>");

            return strConfig.ToString();
        }
        catch (Exception ex)
        {
            return string.Empty;
        }
    }

}
