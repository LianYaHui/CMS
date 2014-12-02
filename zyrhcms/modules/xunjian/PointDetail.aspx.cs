using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_PointDetail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int temp = 0;
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

        var typeSource = bll.GetPatrolType(1, 100000, out temp, null, null);
        slt_type_pd.DataSource = typeSource;
        slt_type_pd.DataTextField = "type_name";
        slt_type_pd.DataValueField = "type_id";
        slt_type_pd.DataBind();


        String _id = Request["id"];
        int LineID = Convert.ToInt32(Request["line_id"] ?? "0");

        if (!String.IsNullOrEmpty(_id))
        {
            var info = bll.GetPatrolPointByID(Convert.ToInt32(_id));

            if (info == null) return;

            txt_PointName_pd.Value = DataView.ToString(info["point_name"]);
            txt_longitude_pd.Value = DataView.ToString(info["longitude"]);
            txt_latitude_pd.Value = DataView.ToString(info["latitude"]);
            txt_radio_pd.Value = DataView.ToString(info["radii"]);
            PointForm.Attributes["data-id"] = _id;
            LineID = Convert.ToInt32(info["line_id"]);
        }


    }
}