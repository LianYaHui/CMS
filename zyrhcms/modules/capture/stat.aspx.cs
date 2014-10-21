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

public partial class modules_capture_stat : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strCode = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Config.ValidateUrlReferrer())
        {
            if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
            {
                Response.Write("UrlReferrer Error");
                Response.End();
            }
        }
        if (!uc.CheckUserLogin())
        {
            this.Server.Transfer(Public.WebDir + "/common/aspx/noauth.aspx", false);
        }

        if (!IsPostBack)
        {
            UserManage um = new UserManage(Public.CmsDBConnectionString);
            ui = um.GetUserInfo(uc.GetLoginUserName());
            this.strCode = new UserLogin().ResponseLoginUserInfo(ui);
        }
    }
}
