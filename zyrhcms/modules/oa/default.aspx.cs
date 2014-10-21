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

public partial class modules_oa_default : System.Web.UI.Page
{
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected void Page_Load(object sender, EventArgs e)
    {
        Master.ShowPageMenu(MenuType.ManageMenu.GetHashCode(), Public.GetRequest("menuCode", string.Empty));
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        try
        {
            if (uc.CheckUserLogin())
            {
                ui = um.GetUserInfo(uc.GetLoginUserName());
                //ui = uc.GetLoginUserInfo();
            }
        }
        catch (Exception ex) { }
    }
    #endregion
}
