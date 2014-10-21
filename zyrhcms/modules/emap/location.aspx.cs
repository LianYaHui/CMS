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

public partial class modules_emap_location : System.Web.UI.Page
{
    protected string strCallBack = string.Empty;
    protected string strLatLng = string.Empty;
    protected string strTitle = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Master.ShowPageTop(false);

        this.strCallBack = Public.RequestString("callBack");
        this.strLatLng = Public.RequestString("latLng");
        this.strTitle = Public.RequestString("title");

    }
}