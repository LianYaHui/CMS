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

public partial class modules_ledScreen_sub_ledScreen : System.Web.UI.Page
{

    protected string strContent = string.Empty;
    protected int rows = 5;
    protected int cols = 10;
    protected int indent = 4;
    protected int simple = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Request["content"] != null)
            {
                this.strContent = Server.UrlDecode(Request["content"].ToString());
            }
            this.rows = Public.RequestString("rows", 5);
            this.cols = Public.RequestString("cols", 10);
            this.indent = Public.RequestString("indent", 4);

            this.simple = Public.RequestString("simple", 0);
        }
    }
}
