using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Text.RegularExpressions;
using System.Data;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

/// <summary>
/// zyrh 的摘要说明
/// </summary>
[WebService(Namespace = "http://www.3gvs.net/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhOpenService : System.Web.Services.WebService
{

    public ZyrhOpenService()
    {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    #region  获得设备GPS实时信息
    #region
    [WebMethod(Description = "<b>获得设备GPS实时信息</b>"
        + "<br />输入参数说明：<br />"
        + "<div style=\"margin:5px 0;\"><pre>"
        + "<span>strDevCodeList:</span> "
        + "设备编号列表，可以填写多个，每个之间以逗号分隔，若为空表示获取全部设备"
        + "</pre></div>"
        + "输出结果说明："
        + "<div style=\"color:#00f;margin:5px 0;\"><pre>"
        + "&lt;GetDeviceGpsInfoResult&gt;<br />"
        + "    &lt;Status&gt;<span style=\"color:#000;\">int  状态：1-成功，0-无数据，-1 -错误</span>&lt;/Status&gt;<br />"
        + "    &lt;Message&gt;<span style=\"color:#000;\">string  错误信息描述</span>&lt;/Message&gt;<br />"
        + "    &lt;ListCount&gt;<span style=\"color:#000;\">int  数据条数</span>&lt;/ListCount&gt;<br />"
        + "    &lt;GpsInfoList&gt;<br />"
        + "        &lt;ZyrhDeviceGpsInfo&gt;<br />"
        + "            &lt;DevCode&gt;<span style=\"color:#000;\">string  设备编号</span>&lt;/DevCode&gt;<br />"
        + "            &lt;DevName&gt;<span style=\"color:#000;\">string  设备名称</span>&lt;/DevName&gt;<br />"
        + "            &lt;Latitude&gt;<span style=\"color:#000;\">string  纬度</span>&lt;/Latitude&gt;<br />"
        + "            &lt;Longitude&gt;<span style=\"color:#000;\">string  经度</span>&lt;/Longitude&gt;<br />"
        + "            &lt;Speed&gt;<span style=\"color:#000;\">float  速度，单位：km/h</span>&lt;/Speed&gt;<br />"
        + "            &lt;Direction&gt;<span style=\"color:#000;\">float  方向（角度），单位：度</span>&lt;/Direction&gt;<br />"
        + "            &lt;Mileage&gt;<span style=\"color:#000;\">float  里程，单位：km</span>&lt;/Mileage&gt;<br />"
        + "            &lt;AccStatus&gt;<span style=\"color:#000;\">int  acc 状态，1-开，0-关</span>&lt;/AccStatus&gt;<br />"
        + "            &lt;IoStatus&gt;<span style=\"color:#000;\">string  IO状态</span>&lt;/IoStatus&gt;<br />"
        + "            &lt;AlarmInfo&gt;<span style=\"color:#000;\">string  警情</span>&lt;/AlarmInfo&gt;<br />"
        + "            &lt;ReceiveTime&gt;<span style=\"color:#000;\">string  接收时间</span>&lt;/ReceiveTime&gt;<br />"
        + "        &lt;/ZyrhDeviceGpsInfo&gt;<br />"
        + "        ...<br />"
        + "    &lt;/GpsInfoList&gt;<br />"
        + "&lt;/GetDeviceGpsInfoResult&gt;<br />"
        + "</pre></div>"
    )]
    #endregion
    public ZyrhGpsResult GetDeviceGpsInfo(string strDevCodeList)
    {
        ZyrhGpsResult result = new ZyrhGpsResult();
        try
        {
            strDevCodeList = strDevCodeList.Replace("，", ",");

            List<ZyrhDeviceGpsInfo> lstInfo = new List<ZyrhDeviceGpsInfo>();

            DeviceStatusManage dsm = new DeviceStatusManage(Public.CmsDBConnectionString);

            string strField = "device_indexcode,device_name,latitude,longitude,direction,speed,mileage,last_gps_time,acc_status,io_status,alarm_info";
            DBResultInfo dbResult = dsm.GetDeviceStatusInfoByField(strDevCodeList, strField);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                result.Status = 1;
                result.ListCount = ds.Tables[0].Rows.Count;

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ZyrhDeviceGpsInfo info = new ZyrhDeviceGpsInfo();
                    info.DevCode = dr["device_indexcode"].ToString();
                    info.DevName = dr["device_name"].ToString();
                    info.Latitude = dr["latitude"].ToString();
                    info.Longitude = dr["longitude"].ToString();
                    info.Direction = DataConvert.ConvertValue(dr["direction"].ToString(), 0.0f);
                    info.Speed = DataConvert.ConvertValue(dr["speed"].ToString(), 0.0f);
                    info.Mileage = DataConvert.ConvertValue(dr["mileage"].ToString(), 0.0f);
                    info.ReceiveTime = Public.ConvertDateTime(dr["last_gps_time"].ToString());
                    info.AccStatus = DataConvert.ConvertValue(dr["acc_status"].ToString(), 0);
                    info.IoStatus = dr["io_status"].ToString();
                    info.AlarmInfo = dr["alarm_info"].ToString();

                    lstInfo.Add(info);
                }
                result.GpsInfoList = lstInfo;
            }
            else
            {
                result.Status = 0;
                result.Message = "没有找到相关的设备GPS信息";

                return result;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);

            result.Status = -1;
            result.Message = "服务器程序异常";
        }
        return result;
    }
    #endregion

    #region  获得设备GPS历史记录信息
    #region
    [WebMethod(Description = "<b>获得设备GPS历史记录信息</b>"
        + "<br/>输入参数说明：<br />"
        + "<div style=\"margin:5px 0;\"><pre>"
        + "<span>strDevCode:</span> "
        + "单个设备编号<br />"
        + "<span>strStartTime:</span> "
        + "开始时间<br />"
        + "<span>strEndTime:</span> "
        + "结束时间<br />"
        + "<span>pageIndex:</span> "
        + "分页码，从0开始，分页码 请根据返回结果中的ListCount 计算，分页码错误将不返回数据<br />"
        + "<span>pageSize:</span> "
        + "每页显示条数<br />"
        + "备注：<br />"
        + "时间间隔最大不得超过31天<br />"
        + "若pageIndex=0并且pageSize=0 表示获取所有数据 不分页"
        + "</pre></div>"
        + "输出结果说明："
        + "<div style=\"color:#00f;margin:5px 0;\"><pre>"
        + "&lt;GetDeviceGpsLogInfoResult&gt;<br />"
        + "    &lt;Status&gt;<span style=\"color:#000;\">int  状态：1-成功，0-无数据，-1 -错误</span>&lt;/Status&gt;<br />"
        + "    &lt;Message&gt;<span style=\"color:#000;\">string  错误信息描述</span>&lt;/Message&gt;<br />"
        + "    &lt;ListCount&gt;<span style=\"color:#000;\">int  数据条数</span>&lt;/ListCount&gt;<br />"
        + "    &lt;GpsLogInfoList&gt;<br />"
        + "        &lt;ZyrhDeviceGpsLogInfo&gt;<br />"
        + "            &lt;Latitude&gt;<span style=\"color:#000;\">string  纬度</span>&lt;/Latitude&gt;<br />"
        + "            &lt;Longitude&gt;<span style=\"color:#000;\">string  经度</span>&lt;/Longitude&gt;<br />"
        + "            &lt;Speed&gt;<span style=\"color:#000;\">float  速度，单位：km/h</span>&lt;/Speed&gt;<br />"
        + "            &lt;Direction&gt;<span style=\"color:#000;\">float  方向（角度），单位：度</span>&lt;/Direction&gt;<br />"
        + "            &lt;Mileage&gt;<span style=\"color:#000;\">float  里程，单位：km</span>&lt;/Mileage&gt;<br />"
        + "            &lt;AccStatus&gt;<span style=\"color:#000;\">int  acc 状态，1-开，0-关</span>&lt;/AccStatus&gt;<br />"
        + "            &lt;IoStatus&gt;<span style=\"color:#000;\">string  IO状态</span>&lt;/IoStatus&gt;<br />"
        + "            &lt;AlarmInfo&gt;<span style=\"color:#000;\">string  警情</span>&lt;/AlarmInfo&gt;<br />"
        + "            &lt;ReceiveTime&gt;<span style=\"color:#000;\">string  接收时间</span>&lt;/ReceiveTime&gt;<br />"
        + "        &lt;/ZyrhDeviceGpsLogInfo&gt;<br />"
        + "        ...<br />"
        + "    &lt;/GpsLogInfoList&gt;<br />"
        + "&lt;/GetDeviceGpsLogInfoResult&gt;<br />"
        + "</pre></div>"
    )]
    #endregion
    public ZyrhGpsLogResult GetDeviceGpsLogInfo(string strDevCode, string strStartTime, string strEndTime, int pageIndex, int pageSize)
    {
        ZyrhGpsLogResult result = new ZyrhGpsLogResult();
        int maxDays = 31;
        try
        {
            string strDevCodeCopy = strDevCode;

            if (strDevCode.StartsWith(","))
            {
                strDevCode = strDevCode.Substring(1);
            }
            if (strDevCode.IndexOf(',') > 0)
            {
                strDevCode = strDevCode.Split(',')[0];
            }
            if (strDevCode.Equals(string.Empty) || strStartTime.Equals(string.Empty) || strEndTime.Equals(string.Empty))
            {
                result.Status = -1;
                result.Message = String.Format("参数输入错误，请检查参数。strDevCode: {0}, strStartTime: {1}, strEndTime: {2}", strDevCode, strStartTime, strEndTime);

                return result;
            }
            else
            {
                try
                {
                    DateTime dtStart = DateTime.Parse(strStartTime);
                    DateTime dtEnd = DateTime.Parse(strEndTime);
                    TimeSpan ts = dtEnd - dtStart;

                    if (Math.Abs(ts.TotalDays) > maxDays)
                    {
                        result.Status = -1;
                        result.Message = String.Format("时间间隔不得超过{0}天。strStartTime: {1}, strEndTime: {2}", maxDays, strStartTime, strEndTime);

                        return result;
                    }
                    else if (dtStart.CompareTo(dtEnd) > 0)
                    {
                        strStartTime = dtEnd.ToString("yyyy-MM-dd HH:mm:ss");
                        strEndTime = dtStart.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                }
                catch (Exception exx)
                {
                    result.Status = -1;
                    result.Message = String.Format("参数输入错误，请检查参数。strStartTime: {0}, strEndTime: {1}", strStartTime, strEndTime);

                    return result;
                }
            }
            List<ZyrhDeviceGpsLogInfo> lstInfo = new List<ZyrhDeviceGpsLogInfo>();

            DeviceGpsManage dsm = new DeviceGpsManage(Public.CmsDBConnectionString, Public.GpsDBConnectionString);
            List<DeviceGpsInfo> lstGps = dsm.GetDeviceGpsLogInfo(strDevCode, string.Empty, strStartTime, strEndTime, pageIndex, pageSize, true);
            int dataCount = dsm.GetGpsLogTotal(strDevCode, strStartTime, strEndTime);

            if (lstGps.Count > 0)
            {
                result.Status = 1;
                result.ListCount = dataCount;

                foreach (DeviceGpsInfo gps in lstGps)
                {
                    ZyrhDeviceGpsLogInfo info = new ZyrhDeviceGpsLogInfo();
                    info.Latitude = gps.Latitude;
                    info.Longitude = gps.Longitude;
                    info.Direction = gps.Direction;
                    info.Speed = gps.Speed;
                    info.Mileage = gps.Mileage;
                    info.IoStatus = gps.IoStatus;
                    info.AccStatus = gps.AccStatus;
                    info.AlarmInfo = gps.AlarmInfo.ToString();
                    info.ReceiveTime = Public.ConvertDateTime(gps.ReceiveTime);

                    lstInfo.Add(info);
                }
                result.GpsLogInfoList = lstInfo;
            }
            else
            {
                result.Status = 0;
                result.Message = "没有找到相关的设备GPS历史记录信息";

                return result;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);

            result.Status = -1;
            result.Message = "服务器程序异常";
        }
        return result;
    }
    #endregion

}

#region  返回结果
public class ZyrhGpsResult
{
    private int status = 0;
    public int Status
    {
        get { return this.status; }
        set { this.status = value; }
    }

    private string msg = string.Empty;
    public string Message
    {
        get { return this.msg; }
        set { this.msg = value; }
    }

    private int dataCount = 0;
    public int ListCount
    {
        get { return this.dataCount; }
        set { this.dataCount = value; }
    }

    private List<ZyrhDeviceGpsInfo> lstGpsInfo = null;
    public List<ZyrhDeviceGpsInfo> GpsInfoList
    {
        get { return this.lstGpsInfo; }
        set { this.lstGpsInfo = value; }
    }
}
public class ZyrhGpsLogResult
{
    private int status = 0;
    public int Status
    {
        get { return this.status; }
        set { this.status = value; }
    }

    private string msg = string.Empty;
    public string Message
    {
        get { return this.msg; }
        set { this.msg = value; }
    }

    private int dataCount = 0;
    public int ListCount
    {
        get { return this.dataCount; }
        set { this.dataCount = value; }
    }

    private List<ZyrhDeviceGpsLogInfo> lstGpsLogInfo = null;
    public List<ZyrhDeviceGpsLogInfo> GpsLogInfoList
    {
        get { return this.lstGpsLogInfo; }
        set { this.lstGpsLogInfo = value; }
    }
}
#endregion

#region  设备GPS信息
public class ZyrhDeviceGpsInfo
{
    private string device_indexcode = string.Empty;
    public string DevCode
    {
        get { return this.device_indexcode; }
        set { this.device_indexcode = value; }
    }

    private string device_name = string.Empty;
    public string DevName
    {
        get { return this.device_name; }
        set { this.device_name = value; }
    }

    private string latitude = string.Empty;
    public string Latitude
    {
        get { return this.latitude; }
        set { this.latitude = value; }
    }

    private string longitude = string.Empty;
    public string Longitude
    {
        get { return this.longitude; }
        set { this.longitude = value; }
    }

    private float speed = 0.0f;
    public float Speed
    {
        get { return this.speed; }
        set { this.speed = value; }
    }

    private float direction = 0.0f;
    public float Direction
    {
        get { return this.direction; }
        set { this.direction = value; }
    }

    private float mileage = 0.0f;
    public float Mileage
    {
        get { return this.mileage; }
        set { this.mileage = value; }
    }

    private int acc_status = 0;
    public int AccStatus
    {
        get { return this.acc_status; }
        set { this.acc_status = value; }
    }

    private string io_status = string.Empty;
    public string IoStatus
    {
        get { return this.io_status; }
        set { this.io_status = value; }
    }

    private string alarm_info = string.Empty;
    public string AlarmInfo
    {
        get { return this.alarm_info; }
        set { this.alarm_info = value; }
    }

    private string receive_time = string.Empty;
    public string ReceiveTime
    {
        get { return this.receive_time; }
        set { this.receive_time = value; }
    }

}
#endregion

#region  设备GPS信息
public class ZyrhDeviceGpsLogInfo
{
    private string latitude = string.Empty;
    public string Latitude
    {
        get { return this.latitude; }
        set { this.latitude = value; }
    }

    private string longitude = string.Empty;
    public string Longitude
    {
        get { return this.longitude; }
        set { this.longitude = value; }
    }

    private float speed = 0.0f;
    public float Speed
    {
        get { return this.speed; }
        set { this.speed = value; }
    }

    private float direction = 0.0f;
    public float Direction
    {
        get { return this.direction; }
        set { this.direction = value; }
    }

    private float mileage = 0.0f;
    public float Mileage
    {
        get { return this.mileage; }
        set { this.mileage = value; }
    }

    private int acc_status = 0;
    public int AccStatus
    {
        get { return this.acc_status; }
        set { this.acc_status = value; }
    }

    private string io_status = string.Empty;
    public string IoStatus
    {
        get { return this.io_status; }
        set { this.io_status = value; }
    }

    private string alarm_info = string.Empty;
    public string AlarmInfo
    {
        get { return this.alarm_info; }
        set { this.alarm_info = value; }
    }

    private string receive_time = string.Empty;
    public string ReceiveTime
    {
        get { return this.receive_time; }
        set { this.receive_time = value; }
    }

}
#endregion