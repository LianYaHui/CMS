﻿<%@ Application Language="C#" %>
<%@ Import Namespace="System.Timers" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="Zyrh.BLL" %>
<%@ Import Namespace="Zyrh.BLL.Device" %>
<%@ Import Namespace="Zyrh.Model" %>

<script RunAt="server">
        
    void Application_Start(object sender, EventArgs e)
    {
        // 在应用程序启动时运行的代码    
    }

    void Application_End(object sender, EventArgs e)
    {
        //  在应用程序关闭时运行的代码
    }

    void Application_Error(object sender, EventArgs e)
    {
        var ex = Server.GetLastError();
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
        bll.InsertLog(ex.ToString());
        // 在出现未处理的错误时运行的代码
    }

    void Session_Start(object sender, EventArgs e)
    {
        // 在新会话启动时运行的代码
        try
        {
            new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

            TaskBLL.DBUtil.ConnetionString = Public.CmsDBConnectionString;
        }
        catch (Exception ex) { }
    }

    void Session_End(object sender, EventArgs e)
    {
        // 在会话结束时运行的代码。 
        // 注意: 只有在 Web.config 文件中的 sessionstate 模式设置为
        // InProc 时，才会引发 Session_End 事件。如果会话模式设置为 StateServer 
        // 或 SQLServer，则不会引发该事件。

    }       
</script>
