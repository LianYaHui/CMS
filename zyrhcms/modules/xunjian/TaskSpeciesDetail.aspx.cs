using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_TaskSpeciesDetail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();


        String str_id = Request.QueryString["id"];
        SpeciesForm.Attributes["data-id"] = str_id;


        if (String.IsNullOrEmpty(str_id))
            return;

        var info = bll.GetTaskSpecies(Convert.ToInt32(str_id));

        if (info == null)
            return;

        txt_SpeciesName_ts.Value = DataView.ToString(info["Species_Name"]);
        txt_taskDesc_ts.Value = DataView.ToString(info["TaskDesc"]);
        txt_taskStandard_ts.Value = DataView.ToString(info["OperationStandard"]);
        txt_Url_ts.Value = DataView.ToString(info["HelpWebUrl"]);
    }
}