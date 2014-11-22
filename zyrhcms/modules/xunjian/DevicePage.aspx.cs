using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_DevicePage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (Request["action"])
        {
            case "GetDrivice":
                var bll = new TaskBLL.BaseBLL();
                int Index = 1, Size = 10, _count;
                if (!string.IsNullOrEmpty(Request["page"]))
                    Index = Convert.ToInt32(Request["page"]);

                if (!string.IsNullOrEmpty(Request["rows"]))
                    Size = Convert.ToInt32(Request["rows"]);

                Index = Index < 1 ? 1 : Index;

                String Where = String.Format("control_unit_id={0}", Request["uid"]);

                var infos = bll.GetDeviceinfo(Index, Size, out _count, Where, null);

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