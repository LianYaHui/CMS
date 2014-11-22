using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_PatrolPointManage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

        switch (Request["action"])
        {
            case "get":
                int Index = 1, Size = 10, _count;
                if (!string.IsNullOrEmpty(Request["page"]))
                    Index = Convert.ToInt32(Request["page"]);

                if (!string.IsNullOrEmpty(Request["rows"]))
                    Size = Convert.ToInt32(Request["rows"]);
                Index = Index > 0 ? Index : 1;
                var infos = bll.GetPatrolType(Index, Size, out _count, null, null);

                var _obj = new
                {
                    total = _count,
                    rows = infos.ToDictionary()
                };
                Response.Write(_obj.ObjectToJsonString());
                Response.End();
                break;
        }
    }
}