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

public partial class modules_alarm_default : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected int[] days = { 0, 0 };

    protected void Page_Load(object sender, EventArgs e)
    {
        Master.ShowPageMenu(MenuType.WebMenu.GetHashCode(), Public.GetRequest("menuCode", string.Empty));
        Master.ShowPageTop(Public.GetRequest("showHeader", 1) == 1);
        this.GetUserInfo();
        this.days[0] = Convert.ToInt32(Public.GetAppSetting("PictureAlarmDaysStart", "0"));
        this.days[1] = Convert.ToInt32(Public.GetAppSetting("PictureAlarmDaysEnd", "0"));
        /*
        if (DateTime.Now.Hour < 10)
        {
            this.days[0] -= 1;
            this.days[1] -= 1;
        }
        */
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
