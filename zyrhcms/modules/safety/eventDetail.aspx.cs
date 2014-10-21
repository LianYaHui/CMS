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
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;

public partial class modules_safety_eventDetail : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected int eventId = 0;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }
    
    protected void InitialData()
    {
        try
        {
            this.eventId = Public.RequestString("eventId", 0);
        }
        catch (Exception ex) { Response.Write(ex.Message); }
    }

}
