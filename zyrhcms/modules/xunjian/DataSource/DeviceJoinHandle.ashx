<%@ WebHandler Language="C#" Class="DeviceJoinHandle" %>

using System;
using System.Web;
using TaskBLL;

public class DeviceJoinHandle : IHttpHandler
{
    TaskBLL.DeviceGroupBLL bll = new TaskBLL.DeviceGroupBLL();
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        var Request = context.Request;

        string GroupID = Request["gid"];

        if (String.IsNullOrEmpty(GroupID))
            return;



        var _obj = bll.GetGroupDeviceinfo(Convert.ToInt32(GroupID)).ToDictionary();
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