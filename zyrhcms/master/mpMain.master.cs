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

public partial class master_mpMain : System.Web.UI.MasterPage
{
    protected UserCenter uc = new UserCenter();

    protected string strTitle = Config.GetWebName();
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
        try
        {
            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
            if (ui != null)
            {
                int network = Public.IsInLAN() ? NetworkType.InLAN.GetHashCode() : NetworkType.Internet.GetHashCode();
                PageTop.BuildMenu(menuType, network, cueMenuCode, false, ui);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }

    }

    public void ShowPageMenu(int menuType, string cueMenuCode, bool showImg)
    {
        try
        {
            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
            if (ui != null)
            {
                int network = Public.IsInLAN() ? NetworkType.InLAN.GetHashCode() : NetworkType.Internet.GetHashCode();
                PageTop.BuildMenu(menuType, network, cueMenuCode, showImg, ui);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }

}
