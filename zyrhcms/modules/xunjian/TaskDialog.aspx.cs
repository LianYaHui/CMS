using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class xunjian_TaskDialog : System.Web.UI.Page
{
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

        int count = 0;


        if (String.IsNullOrEmpty(str_id))
            return;



    }
}