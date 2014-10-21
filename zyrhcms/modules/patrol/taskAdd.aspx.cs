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
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class modules_patrol_taskAdd : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected DeviceConfigManage dcm = new DeviceConfigManage(Public.CmsDBConnectionString);
    protected DeviceConfigInfo dci = new DeviceConfigInfo();
    protected int bodyH = 406;
    protected string devCode = string.Empty;
    protected string strAction = string.Empty;
    protected bool isBatch = false;
    protected string strCode = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        UserManage um = new UserManage(Public.CmsDBConnectionString);
        ui = um.GetUserInfo(uc.GetLoginUserName());
        this.strCode = new UserLogin().ResponseLoginUserInfo(ui);

    }

}
