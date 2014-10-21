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

public partial class modules_responsePlan_sub_preview : System.Web.UI.Page
{
    protected string strUserName = "mas";
    protected string strUserPwd = "827CCB0EEA8A706C4C34A16891F84E7B";
    protected string strDevCode = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strDevCode = Public.GetRequest("devCode", string.Empty);
    }
}
