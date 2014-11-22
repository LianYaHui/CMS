<%@ WebHandler Language="C#" Class="CodeHandle" %>

using System;
using System.Web;
using FoxzyForMySql;
using TaskBLL;

public class CodeHandle : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/javascript";

        var q = context.Request;
        var db = new MySqlManageUtil();
        if (String.IsNullOrEmpty(q["id"]))
        {

            String sql = "select *,'closed' as state from codeinfo where CodeType=0";


            var dtSet = db.FillDataSet(sql, null, System.Data.CommandType.Text);

            context.Response.Write(dtSet.Tables[0].ToJsonString());
        }
        else
        {
            String sql = "select *,'open' as state from codeinfo where CodeType=" + q["id"];

            var dtSet = db.FillDataSet(sql, null, System.Data.CommandType.Text);

            context.Response.Write(dtSet.Tables[0].ToJsonString());
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}