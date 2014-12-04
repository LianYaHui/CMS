<%@ WebHandler Language="C#" Class="GroupDeviceHandle" %>

using System;
using System.Web;
using TaskBLL;

public class GroupDeviceHandle : IHttpHandler
{
    TaskBLL.DeviceGroupBLL bll = new TaskBLL.DeviceGroupBLL();

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        var Request = context.Request;


        int Index = 1, Size = 10, _count;
        if (!string.IsNullOrEmpty(Request["page"]))
            Index = Convert.ToInt32(Request["page"]);

        if (!string.IsNullOrEmpty(Request["rows"]))
            Size = Convert.ToInt32(Request["rows"]);
        Index = Index > 0 ? Index : 1;
        var infos = bll.SelectGroup(Index, Size, out _count, null, null);

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