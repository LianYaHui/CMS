using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_PatrolLineDetail : System.Web.UI.Page
{
    TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

    protected void Page_Load(object sender, EventArgs e)
    {
        var _id = Request.QueryString["ID"] ?? "0";
        var super_id = Request["sid"] ?? "0";
        txt_LineOrder.Text = Request["o"];


        int __id = Convert.ToInt32(_id);

        formPatroLine.Attributes["data-id"] = _id;
        formPatroLine.Attributes["data-sid"] = super_id;


        


        if (__id > 0)
        {
            //Edit
            var info = bll.GetPatrolLineByID(__id);

            if (info != null)
            {
                txt_LineName.Text = Convert.ToString(info["line_name"]);
                txt_beginX.Value = DataView.ToString(info["begin_latitude"]);
                txt_beginY.Value = DataView.ToString(info["begin_longitude"]);

                txt_endX.Value = DataView.ToString(info["end_latitude"]);
                txt_endY.Value = DataView.ToString(info["end_longitude"]);

                object superID = info["super_id"];


                formPatroLine.Attributes["data-sid"] = DataView.ToString(superID);

                //var superInfo = bll.GetPatrolLineByID(Convert.ToInt32(superID));

                //if (superInfo != null && Convert.ToInt32(superInfo["super_id"]) == 0)
                //{

                //}



                txt_LineOrder.Text = DataView.ToString(info["lineOrder"]);
            }
        }


    }
}