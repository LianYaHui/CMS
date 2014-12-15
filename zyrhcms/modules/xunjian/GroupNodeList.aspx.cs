using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_GroupNodeList : System.Web.UI.Page
{
    TaskBLL.DeviceGroupBLL bll = new TaskBLL.DeviceGroupBLL();

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
                var infos = bll.SelectGroupNode(Index, Size, out _count, Server.UrlDecode(Request["w"]), "id desc");

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