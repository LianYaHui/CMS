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
using Zyrh.Model;
using Zyrh.Model.Led;

public partial class modules_ledScreen_sub_infoPublish : System.Web.UI.Page
{
    protected bool isPublishAlarm = false;
    protected int parentId = -1;
    protected bool isCopy = false;
    protected int id = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.isPublishAlarm = Public.RequestString("publishAlarm", 0) == 1;
            this.isCopy = Public.RequestString("copy", 0) == 1;
            this.id = Public.RequestString("id", 0);
            if (this.isPublishAlarm)
            {
                this.parentId = LedInfoType.Emergency.GetHashCode();
            }
        }
    }
}
