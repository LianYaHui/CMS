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
using Zyrh.Model;
using Zyrh.BLL;

public partial class common_aspx_userinfo : System.Web.UI.Page
{

    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!uc.CheckUserLogin())
        {
            Response.Write("您还没有登录或登录已超时");
            Response.End();
        }
        if (!IsPostBack)
        {
            this.GetUserInfo();
        }
    }

    #region  获得用户信息
    public void GetUserInfo()
    {
        try
        {
            this.ui = um.GetUserInfo(uc.GetLoginUserName());
        }
        catch (Exception ex) { }
    }
    #endregion

}
