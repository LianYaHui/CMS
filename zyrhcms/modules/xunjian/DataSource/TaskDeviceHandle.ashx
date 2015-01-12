<%@ WebHandler Language="C#" Class="TaskDeviceHandle" %>

using System;
using System.Web;
using TaskBLL;

public class TaskDeviceHandle : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";


        int Index = 1, Size = 10, _count;
        var Request = context.Request;

        if (!string.IsNullOrEmpty(Request["page"]))
            Index = Convert.ToInt32(Request["page"]);

        if (!string.IsNullOrEmpty(Request["rows"]))
            Size = Convert.ToInt32(Request["rows"]);

        Index = Index < 1 ? 1 : Index;

        String Where = String.Format(" and d.control_unit_id={0}", Request["uid"]);


        TaskBLL.BaseBLL basebll = new TaskBLL.BaseBLL();
        var infos = basebll.GetTaskDeivce(Index, Size, out _count, Where, null);

        var _obj = new
        {
            total = _count,
            rows = infos.ToDictionary()
        };
        context.Response.Write(_obj.ObjectToJsonString());

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}