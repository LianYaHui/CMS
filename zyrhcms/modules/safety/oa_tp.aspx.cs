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

public partial class modules_safety_oa_tp : System.Web.UI.Page
{
    protected string strImgPathDir = Public.WebDir + "/skin/default/images/railway/";
    protected bool isInLAN = Public.IsInLAN();
    protected string strMenuCode = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.strMenuCode = Public.RequestString("menuCode");

        Master.ShowPageMenu(MenuType.ThirdMenu.GetHashCode(), this.strMenuCode);
        Master.ShowPageTop(Public.RequestString("showHeader", 0) == 1);
    }
}
