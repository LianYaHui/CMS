<%@ WebHandler Language="C#" Class="UnitTree" %>

using System;
using System.Web;
using TaskBLL;
using System.Collections.Generic;

public class UnitTree : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/javascript";

        String _UnitID = context.Request["id"];
        String where; 

        if (String.IsNullOrEmpty(_UnitID))
        {
            where = "parent_id=0";
        }
        else
        {
            where = String.Format("parent_id={0}", _UnitID);
        }

        var infos = new TaskBLL.BaseBLL().GetUnitInfo(where);
        var dict = new List<Dictionary<String, Object>>();

        foreach (System.Data.DataRow row in infos.Rows)
        {
            Dictionary<String, Object> d = new Dictionary<string, object>();

            d.Add("id", row["control_unit_id"]);
            d.Add("text", row["name"]);

            if (Convert.ToInt32(row["ChilenNum"]) > 0)
            {
                d.Add("state", "closed");
            }
            else
            {
                d.Add("state", "open");
            }

            dict.Add(d);
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