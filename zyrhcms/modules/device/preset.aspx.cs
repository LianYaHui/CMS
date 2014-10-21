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
using Zyrh.Model.Device;
using Zyrh.BLL;
using Zyrh.BLL.Device;

public partial class modules_device_preset : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Master.PageTitle = "设备通道预置点";
        Master.ShowPageTop(false);
    }
}
