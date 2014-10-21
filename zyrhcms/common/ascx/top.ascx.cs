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

public partial class common_ascx_top : System.Web.UI.UserControl
{
    private string strLogoImage = string.Empty;
    public string LogoImage
    {
        get { return this.strLogoImage; }
        set { this.strLogoImage = value; }
    }

    private string strLogoName = string.Empty;
    public string LogoName
    {
        get { return this.strLogoName; }
        set { this.strLogoName = value; }
    }

    private string strUserName = "";
    public string UserName
    {
        get { return this.strUserName; }
        set { this.strUserName = value; }
    }

    private bool showPageTop = true;
    public bool ShowPageTop
    {
        get { return this.showPageTop; }
        set { this.showPageTop = value; }
    }

    private bool showUserInfo = true;
    public bool ShowUserInfo
    {
        get { return this.showUserInfo; }
        set { this.showUserInfo = value; }
    }

    private int menuType = 0;
    public int MenuType
    {
        get { return this.menuType; }
        set { this.menuType = value; }
    }

    private bool loadMenu = false;
    public bool LoadMenu
    {
        get { return this.loadMenu; }
        set { this.loadMenu = value; }
    }

    protected string strMenuString = string.Empty;
    
    protected void Page_Load(object sender, EventArgs e)
    {
            
    }

    public void BuildMenu(int menuType, int network, string curMenuCode, bool showImg, UserInfo ui)
    {
        try
        {
            this.menuType = menuType;
            this.loadMenu = true;
            CmsMenuManage cmm = new CmsMenuManage(Public.CmsDBConnectionString);
            string strXmlFile = Server.MapPath(String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetMenuConfigFileName()));
            this.strMenuString = cmm.BuildCmsMenu(cmm.GetCmsMenu(strXmlFile, menuType, network), curMenuCode, showImg, Public.WebDir, Public.ModulePageUrl, ui);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }

}
