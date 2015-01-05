using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_UpLoadTask : System.Web.UI.Page
{
    TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

    protected void Page_Load(object sender, EventArgs e)
    {
        switch (Request["action"])
        {
            case "get":
                int Index = 1, Size = 10, _count;
                if (!string.IsNullOrEmpty(Request["page"]))
                    Index = Convert.ToInt32(Request["page"]);

                if (!string.IsNullOrEmpty(Request["rows"]))
                    Size = Convert.ToInt32(Request["rows"]);

                Index = Index > 0 ? Index : 1;
                var infos = bll.GetUserTaskMapping(Index, Size, out _count, null, null);

                var result = infos.ToDictionary();
                for (int i = 0; i < result.Count(); i++)
                {
                    var d = result[i];

                    var startDate = Convert.ToDateTime(d["TaskStartTime"]);
                    var endDate = Convert.ToDateTime(d["TaskEndTime"]);
                    int execStatus = 0;
                    object uploadID = d["ID"];

                    if (DateTime.Now < startDate) execStatus = 1;//未执行
                    if (DateTime.Now >= startDate && DateTime.Now <= endDate) execStatus = 2;//执行中
                    if (DateTime.Now > endDate && uploadID == null)
                        execStatus = 3;//未完成
                    if (uploadID is Int32)
                        execStatus = 4;//已完成

                    result[i].Add("execStatus", execStatus);
                }


                var _obj = new
                {
                    total = _count,
                    rows = result
                };
                Response.Write(_obj.ObjectToJsonString());
                Response.End();

                break;
        }
    }
}