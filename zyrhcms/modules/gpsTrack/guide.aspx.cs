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
using Zyrh.DBUtility;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;

public partial class modules_gpsTrack_guide : System.Web.UI.Page
{
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected string strDevCode = string.Empty;
    protected string strPageCode = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.strDevCode = Public.RequestString("devCode");
            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());

            this.strPageCode = new UserLogin().ResponseLoginUserInfo(ui);
        }
    }
   
}