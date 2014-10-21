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

public partial class modules_safety_control_DateTime : System.Web.UI.Page
{
    protected string strAction = string.Empty;
    protected int eid = -1;
    protected int step = -1;
    protected int sub = -1;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.Initial();
        }
    }

    public void Initial()
    {
        this.strAction = Public.RequestString("action");
        this.eid = Public.RequestString("eid", -1);
        this.step = Public.RequestString("step", -1);
        this.sub = Public.RequestString("sub", -1);
    }
}
