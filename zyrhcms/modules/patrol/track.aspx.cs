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

public partial class modules_patrol_track : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected int unitId = 0;
    protected string strDevCode = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.GetUserInfo();
        if (!IsPostBack)
        {
            this.unitId = Public.GetRequest("unitId", ui.UnitId);
            this.strDevCode = Public.GetRequest("devCode", string.Empty);
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
