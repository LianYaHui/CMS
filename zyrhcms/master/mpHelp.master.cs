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

public partial class master_mpHelp : System.Web.UI.MasterPage
{
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
        try
        {

            PageTop.LogoName = Config.GetWebLogoName();
            PageTop.LogoImage = Config.GetWebLogo();

            PageTop.ShowUserInfo = false;

        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }

    public void ShowPageTop(bool show)
    {
        PageTop.ShowPageTop = show;
    }

}