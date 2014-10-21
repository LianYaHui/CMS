using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.BLL.Server;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Model.Server;

/// <summary>
/// ZyrhWebService 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhWebService")]
///[WebService(Namespace = "http://www.3gvs.net")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhWebService : System.Web.Services.WebService
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GprsDBConnectionString = Public.GprsDBConnectionString;
    protected string PicDBConnectionString = Public.PicDBConnectionString;
    protected DeviceManage dm;
    protected DeviceConfigManage dcm;
    protected DeviceStatusManage dsm;
    protected DeviceGprsManage dgm;
    protected ServerManage sm;

    public ZyrhWebService()
    {
        this.dm = new DeviceManage(this.DBConnectionString);
        this.dcm = new DeviceConfigManage(this.DBConnectionString);
        this.dsm = new DeviceStatusManage(this.DBConnectionString);
        this.dgm = new DeviceGprsManage(this.DBConnectionString);
        this.sm = new ServerManage(this.DBConnectionString);

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    private string GetDateTime()
    {
        return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    #region  解析WEB下发的协议XML文档
    /// <summary>
    /// 解析WEB下发的协议XML文档
    /// </summary>
    /// <param name="strXmlData">WEB下发的协议内容XML文档</param>
    /// <returns></returns>
    [WebMethod(Description = "解析WEB下发的协议XML文档")]
    public WebProtocol ParseWebProtocol(string strXmlData)
    {
        return new WebProtocolGprs().ParseProtocol(strXmlData);
    }
    #endregion

    #region  解析WEB下发的多个协议XML文档
    /// <summary>
    /// 解析WEB下发的多个协议XML文档
    /// </summary>
    /// <param name="strXmlData">WEB下发的多个协议XML文档</param>
    /// <returns></returns>
    [WebMethod(Description = "解析WEB下发的多个协议XML文档")]
    public List<WebProtocol> ParseMultiWebProtocol(string strXmlData)
    {
        return new WebProtocolGprs().ParseMultiProtocol(strXmlData);
    }
    #endregion

    #region  更新设备设置下发状态
    /// <summary>
    /// 更新设备设置下发状态
    /// </summary>
    /// <param name="sid">记录ID(SettingLogId)</param>
    /// <param name="downStatus">下发状态：0-未发送，1-成功，2-失败</param>
    /// <param name="strDownTime">下发时间，时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <param name="strErrorCode">错误代码，若无错误则为空值</param>
    /// <returns>返回值 true-更新成功，false-更新失败</returns>
    [WebMethod(Description = "更新设备设置下发状态（downStatus：0-未发送，1-成功，2-失败）")]
    public bool UpdateDeviceSettingDownStatus(int sid, int downStatus, string strDownTime, string strErrorCode)
    {
        try
        {
            this.WriteLogByDeviceSetting("down", sid, downStatus, strDownTime, string.Empty, strErrorCode);

            DeviceSettingManage dsm = new DeviceSettingManage(Public.CmsDBConnectionString);
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            dsi.Id = sid;
            dsi.DownStatus = downStatus;
            dsi.DownTime = Public.GetDateTime();//strDownTime;
            dsi.ErrorCode = strErrorCode;

            return dsm.UpdateDeviceSettingDownStatus(dsi) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新设备设置回复状态
    /// <summary>
    /// 更新设备设置回复状态
    /// </summary>
    /// <param name="sid">记录ID(SettingLogId)</param>
    /// <param name="responseStatus">回复状态：0-未回复，1-成功，2-失败</param>
    /// <param name="strResponseTime">回复时间，时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <param name="strResponseContent">回复内容，即回复的协议数据内容</param>
    /// <param name="strErrorCode">错误代码，若无错误则为空值</param>
    /// <returns>返回值 true-更新成功，false-更新失败</returns>
    [WebMethod(Description = "更新设备设置回复状态（responseStatus：0-未回复，1-成功，2-失败）")]
    public bool UpdateDeviceSettingResponse(int sid, int responseStatus, string strResponseTime, string strResponseContent, string strErrorCode)
    {
        try
        {
            this.WriteLogByDeviceSetting("response", sid, responseStatus, strResponseTime, strResponseContent, strErrorCode);

            DeviceSettingManage dsm = new DeviceSettingManage(Public.CmsDBConnectionString);
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            dsi.Id = sid;
            dsi.ResponseStatus = responseStatus;
            dsi.ResponseTime = Public.GetDateTime();//strResponseTime;
            dsi.ResponseContent = strResponseContent;
            dsi.ErrorCode = strErrorCode;

            return dsm.UpdateDeviceSettingResponseStatus(dsi) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新设备2G状态
    /// <summary>
    /// 更新设备2G状态 status:1-在线;0-离线
    /// </summary>
    /// <param name="strDevCode">设备索引编号</param>
    /// <param name="status">设备状态：1-在线，0-离线</param>
    /// <param name="strUpdateTime">更新时间 时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <returns>返回值 true-成功，false-失败</returns>
    [WebMethod(Description = "更新设备2G状态 status:1-在线;0-离线")]
    public bool UpdateDeviceStatus(string strDevCode, int status, string strUpdateTime)
    {
        try
        {
            this.WriteLogByUpdateDeviceStatus(strDevCode, status, strUpdateTime);

            if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();

            DeviceStatusInfo dsi = new DeviceStatusInfo();
            dsi.Status2G = status;
            dsi.DevCode = strDevCode;
            dsi.StatusTime2G = strUpdateTime;
            dsi.StatusType2G = 0;

            DBResultInfo dbResult = dsm.UpdateDeviceStatusBy2G(dsi);
            bool result = dbResult.iResult > 0;

            ServerLog.WriteEventLog(HttpContext.Current.Request, "UpdateDeviceStatus", String.Format("({0})DeviceStatus更新{1}", strDevCode, result ? "成功" : "失败"), true, false);
            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion
   
    #region  批量更新设备2G状态
    /// <summary>
    /// 批量更新设备2G状态
    /// </summary>
    /// <param name="strDevCode">设备索引编号</param>
    /// <param name="status">设备状态：1-在线，0-不在线</param>
    /// <param name="strUpdateTime">更新时间 时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <returns>返回值 true-成功，false-失败</returns>
    [WebMethod(Description = "批量更新设备2G状态")]
    public bool BatchUpdateDeviceStatus(string[] strDevCodeList, int status, string strUpdateTime)
    {
        try
        {
            string strBatchDevCode = "";
            foreach (string str in strDevCodeList)
            {
                if (!str.Equals(string.Empty))
                {
                    strBatchDevCode += "," + str;
                }
            }
            if (!strBatchDevCode.Equals(string.Empty))
            {
                strBatchDevCode = strBatchDevCode.Substring(1);
            }
            this.WriteLogByUpdateDeviceStatus(strBatchDevCode, status, strUpdateTime);

            if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();

            StringBuilder strSql = new StringBuilder();

            for (int i = 0; i < strDevCodeList.Length; i++)
            {
                DeviceStatusInfo dsi = new DeviceStatusInfo();
                dsi.Status2G = status;
                dsi.DevCode = strDevCodeList[i];
                dsi.StatusTime2G = Public.GetDateTime();//strUpdateTime;
                dsi.StatusType2G = 0;

                strSql.Append(dsm.BuildUpdateDeviceStatusBy2G(dsi));
            }
            DBResultInfo dbResult = dsm.UpdateDeviceStatusHeartbeat(strSql.ToString());

            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新全部设备2G状态
    /// <summary>
    /// 更新全部设备2G状态
    /// </summary>
    /// <param name="status">2G状态：1-在线，0-离线</param>
    /// <param name="strUpdateTime"></param>
    /// <returns></returns>
    [WebMethod(Description = "更新全部设备2G状态（当服务器被关闭之前，更新全部设备为离线） status:1-在线;0-离线")]
    public bool UpdateAllDeviceStatus(int status, string strUpdateTime)
    {
        try
        {
            this.WriteLogByUpdateDeviceStatus("All Device", status, strUpdateTime);

            if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();

            DBResultInfo dbResult = dsm.UpdateAllDeviceStatusBy2G(status, strUpdateTime, 0);
            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion
    
    #region  更新已超时的设备2G状态
    /// <summary>
    /// 更新已超时的设备2G状态
    /// </summary>
    /// <param name="status"></param>
    /// <param name="minutes"></param>
    /// <param name="strUpdateTime"></param>
    /// <returns></returns>
    [WebMethod(Description = "更新已超时的设备2G状态（服务器启动后，将已超时的设备状态更新为离线） status:1-在线;0-离线 minutes:超时时间，单位：分钟")]
    public int UpdateOvertimeDeviceStatus(int status, int minutes, string strUpdateTime)
    {
        try
        {
            this.WriteLogByUpdateDeviceStatus("Overtime Device", status, strUpdateTime);

            return dsm.UpdateOvertimeDeviceStatus2G(status, minutes, 0, strUpdateTime).iResult;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  更新设备心跳时间
    /// <summary>
    /// 更新设备心跳时间
    /// </summary>
    /// <param name="strDevCode">设备索引编号</param>
    /// <param name="strHeartBeatTime">设备最后心跳时间 时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <returns>返回值 true-成功，false-失败</returns>
    [WebMethod(Description = "更新设备心跳时间（时间格式：yyyy-MM-dd HH:mm:ss）")]
    public bool UpdateDeviceHeartBeat(string strDevCode, string strHeartBeatTime)
    {
        try
        {
            this.WriteLogByUpdateDeviceHeartBeat(strDevCode, strHeartBeatTime);

            if (strHeartBeatTime.Equals(string.Empty)) strHeartBeatTime = this.GetDateTime();

            DeviceStatusInfo dsi = new DeviceStatusInfo();
            dsi.HeartbeatTime2G = strHeartBeatTime;
            dsi.DevCode = strDevCode;

            DBResultInfo dbResult = dsm.UpdateDeviceHeartbeatBy2G(dsi);
            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新GPRS服务器心跳时间
    [WebMethod(Description = "更新GPRS服务器心跳时间，更新频率：60秒")]
    public bool UpdateGprsServerHeartBeat(string strUpdateTime)
    {
        try
        {
            /*
            if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();
            return sm.UpdateServerStatus(ServerTypeEnum.GprsServer.GetHashCode(), 1, strUpdateTime) > 0;
            */
            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新图像比对服务器心跳时间
    [WebMethod(Description = "更新图像比对服务器心跳时间，更新频率：60秒")]
    public bool UpdateImageServerHeartBeat(string strUpdateTime)
    {
        try
        {
            if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();
            return true;
            //return sm.UpdateServerStatus(ServerTypeEnum.ImageServer.GetHashCode(), 1, strUpdateTime) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion
    
    #region  更新服务器心跳时间
    [WebMethod(Description = "更新服务器心跳时间，更新频率：60秒（strServerCode：GprsServer:30001,ImageServer:30002）")]
    public bool UpdateServerHeartBeat(ServerTypeEnum serverType, string strUpdateTime)
    {
        if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();
        return true;
        //return sm.UpdateServerStatus(serverType.GetHashCode(), 1, strUpdateTime) > 0;
    }
    #endregion

    #region  创建GPRS数据表
    [WebMethod(Description = "创建GPRS数据表")]
    public string CreateGprsTable(string strTableName)
    {
        try
        {
            if (dgm.CreateGprsTable(this.GprsDBConnectionString, strTableName))
            {
                return strTableName + " 已存在";
            }
            else
            {
                return strTableName + " 创建失败";
            }
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
    #endregion

    #region  添加设备GPRS上报信息
    /// <summary>
    /// 添加设备GPRS上报信息
    /// </summary>
    /// <param name="deviceGprsInfo"></param>
    /// <returns></returns>
    [WebMethod(Description = "添加设备GPRS上报信息")]
    public bool AddDeviceGprsInfo(DeviceGprsInfo deviceGprsInfo)
    {
        try
        {
            DeviceGprsInfo info = deviceGprsInfo;

            this.WriteLogByAddDeviceGprsInfo(info);

            DeviceInfo di = dm.GetDeviceBaseInfo(info.DevCode);
            info.Status3G = di.devStatus.Status3G;
            info.StatusTime3G = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            string strSqlGprs = "";

            string strTableName = dgm.BuildGprsTableName(DateTime.Parse(info.ReceiveTime).ToString("yyyyMMdd"));//"gprs" + DateTime.Parse(info.ReceiveTime).ToString("yyyyMMdd");
            if (dgm.CreateGprsTable(this.GprsDBConnectionString, strTableName))
            {
                strSqlGprs = dgm.BuildGprsInsertSql(strTableName, info);
                dgm.InsertGprsInfo(this.GprsDBConnectionString, strSqlGprs);
            }

            if (dgm.CheckGprsBaseInfoIsExist(info.DevCode))
            {
                strSqlGprs = dgm.BuildGprsBaseUpdateSql(info);
                dgm.UpdateGprsBaseInfo(strSqlGprs);
            }
            else
            {
                strSqlGprs = dgm.BuildGprsBaseInsertSql(info);
                dgm.InsertGprsBaseInfo(strSqlGprs);
            }

            DeviceStatusInfo dsi = new DeviceStatusInfo();
            dsi.DevCode = info.DevCode;
            dsi.PatrolMode = info.PatrolMode;
            dsi.Security = info.SecurityStatus;
            dsi.VoltagePower = info.BatteryPower;
            dsi.PtzStatus = info.PTZStatus;
            dsi.IoStatus = info.IOStatus;
            dsi.Mileage = info.Mileage;
            dsi.AccStatus = info.AccStatus;
            dsi.AlarmInfo = DataConvert.ConvertValue(info.AlarmInfo, -1);
            dsi.IoStatus = info.IOStatus;

            dsi.LastGprsTime = info.ReceiveTime;
            dsi.GprsProtocol = info.ProtocolContent.Replace("'", "\\\'");
            DBResultInfo dbResultStatus = dsm.UpdateDeviceStatusGprs(dsi);

            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  批量添加设备GPRS上报信息
    /// <summary>
    /// 批量添加设备GPRS上报信息
    /// </summary>
    /// <param name="deviceGprsInfoList"></param>
    /// <returns></returns>
    [WebMethod(Description = "批量添加设备GPRS上报信息")]
    public bool BatchAddDeviceGprsInfo(List<DeviceGprsInfo> deviceGprsInfoList)
    {
        try
        {
            ServerLog.WriteEventLog(HttpContext.Current.Request, "BatchGprsMessage", "Gprs记录开始", false, false);
            for (int i = 0, c = deviceGprsInfoList.Count; i < c; i++)
            {
                DeviceGprsInfo info = deviceGprsInfoList[i];

                this.WriteLogByAddDeviceGprsInfo(info);

                DeviceInfo di = dm.GetDeviceBaseInfo(info.DevCode);
                if (di == null)
                {
                    ServerLog.WriteEventLog(HttpContext.Current.Request, "GprsMessageError", info.DevCode + " 设备不存在", false, false);
                    continue;
                }
                info.Status3G = di.devStatus.Status3G;
                info.StatusTime3G = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                string strSqlGprs = "";

                string strTableName = dgm.BuildGprsTableName(DateTime.Parse(info.ReceiveTime).ToString("yyyyMMdd"));
                if (dgm.CreateGprsTable(this.GprsDBConnectionString, strTableName))
                {
                    strSqlGprs = dgm.BuildGprsInsertSql(strTableName, info);

                    //ServerLog.WriteDebugLog(HttpContext.Current.Request, "SQLDEBUG", strSqlGprs);

                    dgm.InsertGprsInfo(this.GprsDBConnectionString, strSqlGprs);
                }
                ServerLog.WriteEventLog(HttpContext.Current.Request, "GprsMessage", "Gprs记录完成", false, false);

                if (dgm.CheckGprsBaseInfoIsExist(info.DevCode))
                {
                    strSqlGprs = dgm.BuildGprsBaseUpdateSql(info);
                    dgm.UpdateGprsBaseInfo(strSqlGprs);
                    ServerLog.WriteEventLog(HttpContext.Current.Request, "GprsMessage", "BaseInfo更新完成", false, false);
                }
                else
                {
                    strSqlGprs = dgm.BuildGprsBaseInsertSql(info);
                    dgm.InsertGprsBaseInfo(strSqlGprs);
                    ServerLog.WriteEventLog(HttpContext.Current.Request, "GprsMessage", "BaseInfo添加完成", false, false);
                }

                DeviceStatusInfo dsi = new DeviceStatusInfo();
                dsi.DevCode = info.DevCode;
                dsi.PatrolMode = info.PatrolMode;
                dsi.Security = info.SecurityStatus;
                dsi.VoltagePower = info.BatteryPower;
                dsi.PtzStatus = info.PTZStatus;
                dsi.IoStatus = info.IOStatus;
                dsi.Mileage = info.Mileage;
                dsi.AccStatus = info.AccStatus;
                dsi.AlarmInfo = DataConvert.ConvertValue(info.AlarmInfo, -1);
                dsi.IoStatus = info.IOStatus;
                
                dsi.LastGprsTime = info.ReceiveTime;
                dsi.GprsProtocol = info.ProtocolContent.Replace("'", "\\\'");
                DBResultInfo dbResultStatus = dsm.UpdateDeviceStatusGprs(dsi);

                ServerLog.WriteEventLog(HttpContext.Current.Request, "GprsMessage", "DeviceStatus更新完成", true, false);
            }
            ServerLog.WriteEventLog(HttpContext.Current.Request, "BatchGprsMessage", "Gprs记录结束", false, false);
            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  获得长时间无用户登录的在线设备
    [WebMethod(Description = "获得长时间无用户登录的在线设备，用于定时关闭设备")]
    public ArrayList GetDevIndexCodeWithoutUserLogin()
    {
        try
        {
            ArrayList arrDev = new ArrayList();
            ArrayList arrUnit = new ArrayList();

            ControlUnitManage cum = new ControlUnitManage(this.DBConnectionString);
            DeviceManage dm = new DeviceManage(this.DBConnectionString);

            string strHeartBeatTime = DateTime.Now.AddMinutes(-30).ToString("yyyy-MM-dd HH:mm:ss");
            int status = 1; //1-表示在线设备

            //获得当前有用户登录的组织机构ID列表
            DBResultInfo dbUnit = cum.GetControlUnitWithLoginUser(strHeartBeatTime);
            DataSet dsUnit = dbUnit.dsResult;
            if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drUnit in dsUnit.Tables[0].Rows)
                {
                    arrUnit.Add(drUnit[0].ToString());
                }
            }

            DBResultInfo dbDev = dm.GetOnlineDevice(status, -1);
            DataSet dsDev = dbDev.dsResult;
            if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
            {
                if (arrUnit.Count > 0)
                {
                    foreach (DataRow drDev in dsDev.Tables[0].Rows)
                    {
                        string strUnitId = drDev[1].ToString();
                        string strParentTree = drDev[2].ToString();
                        bool isLogin = false;

                        foreach (string str in arrUnit)
                        {
                            if (str.Equals(strUnitId) || strParentTree.IndexOf("(" + str + ")") >= 0)
                            {
                                isLogin = true;
                                break;
                            }
                        }
                        if (!isLogin)
                        {
                            arrDev.Add(drDev[0].ToString());
                        }
                    }
                }
                else
                {
                    foreach (DataRow drDev in dsDev.Tables[0].Rows)
                    {
                        arrDev.Add(drDev[0].ToString());
                    }
                }
            }

            return arrDev;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    //以下方法为记录日志

    #region  设备下发设置的日志
    public bool WriteLogByDeviceSetting(string strLogType, int sid, int status, string strTime, string strContent, string strErrorCode)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();
            string strEventName = string.Empty;

            strLog.Append("\r\n<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n");
            switch (strLogType)
            {
                case "down":
                    strEventName = "DeviceSettingDown";
                    strLog.Append("<DeviceSettingDown>");
                    strLog.Append(String.Format("<SettingId>{0}</SettingId>", sid));
                    strLog.Append(String.Format("<DownStatus>{0}</DownStatus>", status));
                    strLog.Append(String.Format("<DownTime>{0}</DownTime>", strTime));
                    strLog.Append(String.Format("<ErrorCode>{0}</ErrorCode>", strErrorCode));
                    strLog.Append("</DeviceSettingDown>");
                    break;
                case "response":
                    strEventName = "DeviceSettingResponse";
                    strLog.Append("<DeviceSettingResponse>");
                    strLog.Append(String.Format("<SettingId>{0}</SettingId>", sid));
                    strLog.Append(String.Format("<ResponseStatus>{0}</ResponseStatus>", status));
                    strLog.Append(String.Format("<ResponseTime>{0}</ResponseTime>", strTime));
                    strLog.Append(String.Format("<ResponseContent><![CDATA[{0}]]></ResponseContent>", strContent));
                    strLog.Append(String.Format("<ErrorCode>{0}</ErrorCode>", strErrorCode));
                    strLog.Append("</DeviceSettingResponse>");
                    break;
            }

            ServerLog.WriteEventLog(HttpContext.Current.Request, strEventName, strLog.ToString(), true, false);

            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新设备心跳的日志
    public bool WriteLogByUpdateDeviceHeartBeat(string strDevCode, string strHeartBeatTime)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();

            strLog.Append("\r\n<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n");
            strLog.Append("<UpdateDeviceHeartBeat>");
            strLog.Append(String.Format("<DevCode>{0}</DevCode>", strDevCode));
            strLog.Append(String.Format("<HeartBeatTime>{0}</HeartBeatTime>", strHeartBeatTime));
            strLog.Append("</UpdateDeviceHeartBeat>");

            ServerLog.WriteEventLog(HttpContext.Current.Request, "UpdateDeviceHeartBeat", strLog.ToString(), true, false);

            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新设备2G状态的日志
    public bool WriteLogByUpdateDeviceStatus(string strDevCode, int status, string strUpdateTime)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();

            strLog.Append("\r\n<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n");
            strLog.Append("<UpdateDeviceStatus>");
            strLog.Append(String.Format("<DevCode>{0}</DevCode>", strDevCode));
            strLog.Append(String.Format("<Status>{0}</Status>", status));
            strLog.Append(String.Format("<UpdateTime>{0}</UpdateTime>", strUpdateTime));
            strLog.Append("</UpdateDeviceStatus>");

            ServerLog.WriteEventLog(HttpContext.Current.Request, "UpdateDeviceStatus", strLog.ToString(), true, false);

            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  添加GPRS上报信息的日志
    public bool WriteLogByAddDeviceGprsInfo(DeviceGprsInfo gprsInfo)
    {
        try
        {
            if (gprsInfo != null)
            {
                StringBuilder strLog = new StringBuilder();

                strLog.Append("\r\n<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n");
                strLog.Append("<GprsMessage>\r\n");
                strLog.Append(String.Format("<DevCode>{0}</DevCode>\r\n", gprsInfo.DevCode));
                strLog.Append(String.Format("<PatrolMode>{0}</PatrolMode>\r\n", gprsInfo.PatrolMode));
                strLog.Append(String.Format("<BatteryPower>{0}</BatteryPower>\r\n", gprsInfo.BatteryPower));
                strLog.Append(String.Format("<Security>{0}</Security>\r\n", gprsInfo.SecurityStatus));
                strLog.Append(String.Format("<IOStatus>{0}</IOStatus>\r\n", gprsInfo.IOStatus));
                strLog.Append(String.Format("<NetworkStandard>{0}</NetworkStandard>\r\n", gprsInfo.NetworkStandard));
                strLog.Append(String.Format("<SignalStrength>{0}</SignalStrength>\r\n", gprsInfo.SignalStrength));

                strLog.Append(String.Format("<DialUpProcess>{0}</DialUpProcess>\r\n", gprsInfo.DialUpProcess));
                strLog.Append(String.Format("<PingTime>{0}</PingTime>\r\n", gprsInfo.PingTime));
                strLog.Append(String.Format("<PlatformRegisterStatus>{0}</PlatformRegisterStatus>\r\n", gprsInfo.PlatformRegisterStatus));
                strLog.Append(String.Format("<IntercomStatus>{0}</IntercomStatus>\r\n", gprsInfo.IntercomStatus));
                strLog.Append(String.Format("<Status3G>{0}</Status3G>\r\n", gprsInfo.Status3G));
                strLog.Append(String.Format("<PTZStatus>{0}</PTZStatus>\r\n", gprsInfo.PTZStatus));
                strLog.Append(String.Format("<PTZPower>{0}</PTZPower>\r\n", gprsInfo.PTZPower));

                strLog.Append(String.Format("<Protocol><![CDATA[{0}]]></Protocol>\r\n", gprsInfo.ProtocolContent));
                strLog.Append(String.Format("<ReceiveTime>{0}</ReceiveTime>\r\n", gprsInfo.ReceiveTime));
                strLog.Append("</GprsMessage>");

                ServerLog.WriteEventLog(HttpContext.Current.Request, "GprsMessage", strLog.ToString(), true, false);

                return true;
            } 
            return false;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

}

