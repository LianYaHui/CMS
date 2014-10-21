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

public partial class modules_patrol_tree_point : System.Web.UI.Page
{
    protected int bodyW = 0;
    protected int bodyH = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.bodyW = Public.GetRequest("bodyW", 200);
        this.bodyH = Public.GetRequest("bodyH", 400);
    }
}
