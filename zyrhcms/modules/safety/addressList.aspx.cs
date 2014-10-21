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

public partial class modules_safety_addressList : System.Web.UI.Page
{
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected string strCode = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        try
        {
            this.strAction = Public.RequestString("action");
            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
            this.strCode = new UserLogin().ResponseLoginUserInfo(ui);
        }
        catch (Exception ex) { }
    }

}
