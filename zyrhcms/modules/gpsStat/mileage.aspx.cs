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

public partial class modules_gpsStat_mileage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Master.ShowPageTop(false);
        }
    }
}
