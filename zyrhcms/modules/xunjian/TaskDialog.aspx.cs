using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class xunjian_TaskDialog : System.Web.UI.Page
{
    protected String JsonPoint = "[]";


    protected void Page_Load(object sender, EventArgs e)
    {
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();


        String str_id = Request.QueryString["id"];
        taskManageForm.Attributes["data-id"] = str_id;

        slt_taskDegree.DataSource = CodeReader.GetCodeTableByType(40000, "");
        slt_taskDegree.DataValueField = "Code";
        slt_taskDegree.DataTextField = "Value";
        slt_taskDegree.DataBind();

        slt_taskType.DataSource = CodeReader.GetCodeTableByType(30000, "");
        slt_taskType.DataValueField = "Code";
        slt_taskType.DataTextField = "Value";
        slt_taskType.DataBind();

        slt_taskCategory.DataSource = CodeReader.GetCodeTableByType(50000, "");
        slt_taskCategory.DataValueField = "Code";
        slt_taskCategory.DataTextField = "Value";
        slt_taskCategory.DataBind();

        int __count = 0;
        slt_taskSpecies.DataSource = bll.SelectTaskSpecies(1, 10000, out __count, null, null);
        slt_taskSpecies.DataValueField = "Species_ID";
        slt_taskSpecies.DataTextField = "Species_Name";
        slt_taskSpecies.DataBind();


        if (String.IsNullOrEmpty(str_id))
            return;

        var info = bll.GetTaskByID(Convert.ToInt32(str_id));

        if (info == null)
            return;

        txt_taskName.Text = DataView.ToString(info["TaskName"]);
        txt_beginDate.Value = DataView.ToDateString(info["TaskStartTime"], "yyyy-MM-dd");
        txt_EndDate.Value = DataView.ToDateString(info["TaskEndTime"], "yyyy-MM-dd");

        slt_taskCategory.Value = DataView.ToString(info["TaskCategory"]);
        slt_taskDegree.Value = DataView.ToString(info["TaskDegree"]);
        slt_taskType.Value = DataView.ToString(info["TaskType"]);


        slt_taskSpecies.Value = DataView.ToString(info["SpeciesID"]);

        String where = " and p.point_id=" + DataView.ToInt32(info["PointID"], 0);
        var pointInfo = bll.GetPatrolPoint(1, 1000, out __count, where, null);

        JsonPoint = pointInfo.ToJsonString();
    }
}