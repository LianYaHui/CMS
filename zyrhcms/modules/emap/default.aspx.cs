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

public partial class modules_emap_default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Master.ShowPageMenu(MenuType.WebMenu.GetHashCode(), Public.RequestString("menuCode"));
        Master.ShowPageTop(Public.RequestString("showHeader", 1) == 1);
    }
}
