﻿using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class modules_responsePlan_default : System.Web.UI.Page
{
    protected string strImgPathDir = Public.WebDir + "/skin/default/images/responsePlan";
    protected void Page_Load(object sender, EventArgs e)
    {
        Master.ShowPageMenu(9, Public.GetRequest("menuCode", string.Empty));
        Master.ShowPageTop(Public.GetRequest("showHeader", 1) == 1);
    }
}
