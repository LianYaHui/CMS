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

public partial class modules_gprsConfig_tools_setPatrolTaskTree : System.Web.UI.Page
{
    protected int unitId = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.unitId = Public.RequestString("unitId", 0);
    }
}
