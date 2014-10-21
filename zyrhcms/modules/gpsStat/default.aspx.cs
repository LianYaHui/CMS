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
using System.Text.RegularExpressions;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class modules_gpsStat_default : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strMaxDate = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Master.ShowPageMenu(MenuType.WebMenu.GetHashCode(), Public.GetRequest("menuCode", string.Empty));
            Master.ShowPageTop(Public.GetRequest("showHeader", 1) == 1);

            this.GetUserInfo();
        }
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        if (uc.CheckUserLogin())
        {
            ui = uc.GetLoginUserInfo();
        }
    }
    #endregion
}
