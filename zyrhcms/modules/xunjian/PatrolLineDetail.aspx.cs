using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class modules_xunjian_PatrolLineDetail : System.Web.UI.Page
{
    TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

    protected void Page_Load(object sender, EventArgs e)
    {
        var _id = Request.QueryString["ID"] ?? "0";

        int __id = Convert.ToInt32(_id);

        formPatroLine.Attributes["data-id"] = _id;

        if (__id > 0)
        {
            //Edit
            var info = bll.GetPatrolLineByID(__id);

            if (info != null)
            {
                txt_LineName.Text = Convert.ToString(info["line_name"]);
            }
        }


    }
}