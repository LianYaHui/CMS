using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Zyrh.Model;
using Zyrh.BLL;
using Zyrh.BLL.Device;

/// <summary>
/// DeviceStatusWebCheck 的摘要说明
/// </summary>
public class DeviceStatusWebCheck
{
    protected DeviceStatusManage dsm = new DeviceStatusManage(Public.CmsDBConnectionString);

    public DeviceStatusWebCheck()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public void UpdateOvertimeDeviceStatus3G()
    {
        try
        {
            int status = 0; //设备状态，0-离线，1-在线
            int seconds3g = Public.GetAppSetting("DeviceTimeoutTime3G", 180); //超时时间，默认为180秒
            int seconds2g = Public.GetAppSetting("DeviceTimeoutTime2G", 180); //超时时间，默认为180秒
            int statusType = 1; //更新类型，0-服务器更新，1-WEB维护更新

            //更新超时的设备3G状态为离线
            DBResultInfo dbResult3G = dsm.UpdateOvertimeDeviceStatus3G(status, seconds3g, 1, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WebUpdateDevice3gStatus", dbResult3G.iResult.ToString());

            //更新超时的设备2G状态为离线
            DBResultInfo dbResult2G = dsm.UpdateOvertimeDeviceStatus2G(status, seconds2g, 1, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WebUpdateDevice2gStatus", dbResult2G.iResult.ToString());
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }

}
