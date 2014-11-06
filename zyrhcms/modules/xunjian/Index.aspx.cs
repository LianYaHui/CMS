using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Zyrh.BLL;
using Zyrh.Model;

public partial class modules_xunjian_Index : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected void Page_Load(object sender, EventArgs e)
    {
        Master.ShowPageMenu(MenuType.ManageMenu.GetHashCode(), Public.GetRequest("menuCode", string.Empty));
        Master.ShowPageTop(Public.GetRequest("showHeader", 1) == 1);
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        if (uc.CheckUserLogin())
        {
            ui = uc.GetLoginUserInfo();
            ui.UnitName = new ControlUnitManage(Public.CmsDBConnectionString).GetControlUnitName(ui.UnitId);
        }
        if (!uc.IsAdmin)
        {
            this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
        }
    }
    #endregion
}