using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class xunjian_TaskManage : System.Web.UI.Page
{
    TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();


    protected void Page_Load(object sender, EventArgs e)
    {
        switch (Request["action"])
        {
            case "get":
                GetData();
                break;
            
        }
    }

    private void GetData()
    {
        int Index = 1, Size = 10, _count;
        if (!string.IsNullOrEmpty(Request["page"]))
            Index = Convert.ToInt32(Request["page"]);

        if (!string.IsNullOrEmpty(Request["rows"]))
            Size = Convert.ToInt32(Request["rows"]);



        var infos = bll.GetTaskList(Index, Size, out _count, null, null);
        var _obj = new
        {
            total = _count,
            rows = infos.ToDictionary()
        };
        Response.Write(_obj.ObjectToJsonString());
        Response.End();
    }
}