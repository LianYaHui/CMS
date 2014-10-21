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

public partial class tools_ditu : System.Web.UI.Page
{
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();

    protected void Page_Load(object sender, EventArgs e)
    {
        //if (!uc.CheckUserLogin())
        //{
        //    this.Response.Redirect(Public.WebDir + (Request.UrlReferrer == null ? Public.LoginUrl : Public.NoAuthUrl), false);
        //}
    }
}