using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_DevicePage : System.Web.UI.Page
{
    TaskBLL.BaseBLL basebll = new TaskBLL.BaseBLL();
    TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

    protected String JsonData = "[]";



    protected void Page_Load(object sender, EventArgs e)
    {
        switch (Request["action"])
        {
            case "GetDrivice":

                GetData();
                break;
        }


        String taskID = Request["tid"];

        if (String.IsNullOrEmpty(taskID))
            return;

        var infos = bll.GetTaskDeviceByTaskID(Convert.ToInt32(taskID));

        var deviceIDs = from row in infos.Rows.OfType<DataRow>()
                        select Convert.ToString(row["DeviceID"]);

        if (deviceIDs.Count() == 0)
            return;

        var Deviceinfos = basebll.GetDeviceInfoByIDs(String.Join(",", deviceIDs.ToArray()));

        JsonData = Deviceinfos.ToJsonString();
    }

    private void GetData()
    {
        int Index = 1, Size = 10, _count;
        if (!string.IsNullOrEmpty(Request["page"]))
            Index = Convert.ToInt32(Request["page"]);

        if (!string.IsNullOrEmpty(Request["rows"]))
            Size = Convert.ToInt32(Request["rows"]);

        Index = Index < 1 ? 1 : Index;

        String Where = String.Format("control_unit_id={0}", Request["uid"]);

        var infos = basebll.GetDeviceinfo(Index, Size, out _count, Where, null);

        var _obj = new
        {
            total = _count,
            rows = infos.ToDictionary()
        };
        Response.Write(_obj.ObjectToJsonString());

        Response.End();
    }
}