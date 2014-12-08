using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_GroupDetail : System.Web.UI.Page
{
    TaskBLL.DeviceGroupBLL bll = new TaskBLL.DeviceGroupBLL();

    protected void Page_Load(object sender, EventArgs e)
    {
        var _id = Request.QueryString["gid"] ?? "0";
        int __id = Convert.ToInt32(_id);

        GroupForm.Attributes["data-id"] = _id;

        if (__id > 0)
        {
            //Edit
            var info = bll.GetGroupInfo(__id);

            if (info != null)
            {
                txt_GroupName_gd.Value = Convert.ToString(info["GroupName"]);
            }
        }
    }
}