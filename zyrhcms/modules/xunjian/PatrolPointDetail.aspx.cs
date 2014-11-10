using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;


public partial class modules_xunjian_PatrolPointDetail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();


        var _id = Request.QueryString["ID"] ?? "0";

        int __id = Convert.ToInt32(_id);

        formPatroPoint.Attributes["data-id"] = _id;

        if (__id > 0)
        {
            //Edit
            var info = bll.GetPatrolTypeByID(__id);

            if (info != null)
            {
                txt_PointName.Text = Convert.ToString(info["type_name"]);
                txt_PointDesc.Text = Convert.ToString(info["type_desc"]);
                txt_Ridio.Text = Convert.ToString(info["patrol_radii"]);
            }
        }


    }
}