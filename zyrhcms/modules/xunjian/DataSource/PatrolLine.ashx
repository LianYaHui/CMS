<%@ WebHandler Language="C#" Class="PatrolLine" %>

using System;
using System.Web;
using TaskBLL;
using System.Collections.Generic;

public class PatrolLine : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        var q = context.Request;
        context.Response.ContentType = "text/javascript";
        var superID = Convert.ToInt32(q["id"] ?? "0");

        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

        var tb = bll.GetTreeLine(superID);

        var dict = tb.ToDictionary();



        for (int i = 0; i < dict.Count; i++)
        {
            var d = dict[i];
            if (Convert.ToInt32(d["chilenCount"]) > 0)
                d.Add("state", "closed");
            else
                d.Add("state", "open");
        }
        context.Response.Write(dict.ObjectToJsonString());
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}