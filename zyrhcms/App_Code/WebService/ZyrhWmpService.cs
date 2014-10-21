using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.DBUtility;

/// <summary>
/// ZyrhWMP 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhWmpService")]
///[WebService(Namespace = "http://www.3gvs.net/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhWmpService : System.Web.Services.WebService
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GpsDBConnectionString = Public.GpsDBConnectionString;
    protected DeviceStatusManage dsm = new DeviceStatusManage(Public.CmsDBConnectionString);

    public ZyrhSoapHeader soapHeader = new ZyrhSoapHeader();

    public ZyrhWmpService()
    {
    }

    [System.Web.Services.Protocols.SoapHeader("soapHeader")]
    [WebMethod(Description = "")]
    public string HelloWorld()
    {
        return "Hello World";
    }

    #region  客户端登录登出验证
    /// <summary>
    /// 设备、客户端登录验证
    /// </summary>
    /// <param name="strName">用户名（设备ID、客户端ID等）</param>
    /// <param name="strPassword">密码（设备密码，用户登录密码）</param>
    /// <param name="clientType">客户端类型（1:设备,2:客户端）</param>
    /// <param name="needValidate">是否需要验证用户名和密码，若不验证，则始终返回 验证成功</param>
    /// <returns></returns>
    [WebMethod(Description = "客户端登录验证<div class=\"param\">"
        + "输入参数说明<br />"
        + "clientType:客户端类型,1-设备,2-客户端;) </div>"
        + "<div class=\"result\">返回值(int)：1 -成功，0 -失败，用户名不存在或密码错误，-1 -数据库异常或WS服务异常</div>"
    )]
    public int ClientLogin(string strName, string strPassword, int clientType, bool needValidate, 
        string strSourceIp, int sourcePort, string strServerIp, int serverPort)
    {
        needValidate = false;
        try
        {
            StringBuilder strSql = new StringBuilder();
            if (clientType == 1)
            {
                strSql.Append(String.Format("select count(device_id) from device_info di where index_code = '{0}' ", strName));
                if (needValidate)
                {
                    strSql.Append(String.Format(" and user_pwd = '{0}' ", strPassword));
                }
                strSql.Append(";");
            }
            else
            {
                strSql.Append(String.Format("select count(user_id) from user_info ui where name = '{0}' ", strName));
                if (needValidate)
                {
                    strSql.Append(String.Format(" and pwd = '{0}' ", strPassword.Length == 32 ? strPassword : Encrypt.HashEncrypt(strPassword, EncryptFormat.MD5).ToLower()));
                }
                strSql.Append(";");
            }
            string strLogContent = String.Format("Name:{0},Password:{1},ClientType:{2},NeedValidate:{3},SourceIp:{4},SourcePort:{5},ServerIp:{6},ServerPort:{7}\r\nSql:{8}",
                strName, strPassword, clientType, needValidate, strSourceIp, sourcePort, strServerIp, serverPort, strSql.ToString());
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_ClientLoginRequest", strLogContent);
            
            int result= Convert.ToInt32(MySqlHelper.ExecuteScalar(this.DBConnectionString, strSql.ToString()).ToString());
            
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_ClientLoginResponse", result.ToString());
            
            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_ClientLoginResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }

    /// <summary>
    /// 客户端登出
    /// </summary>
    /// <param name="strDevCode">设备编号（设备登出）</param>
    /// <param name="strName">用户名（用户登出）</param>
    /// <param name="clientType">客户端类型</param>
    /// <returns></returns>
    [WebMethod(Description = "客户端登出"
        + "<div class=\"result\">返回值(int)：1 -成功，0 -失败，-1 -数据库异常或WS服务异常</div>"
    )]
    public int Logout(string strDevCode, string strName, int clientType)
    {
        ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_ClientLogoutRequest", String.Format("客户端登出，类型：{0}，设备：{1}，用户名：{2}", clientType, strDevCode, strName));
            
        return 1;
    }
    #endregion

    #region  更新设备心跳及在线状态
    /// <summary>
    /// 更新设备在线状态
    /// </summary>
    /// <param name="strDeviceIdList">设备编号列表，以逗号分隔</param>
    /// <param name="status">状态：0-不在线，1-在线</param>
    /// <returns></returns>
    [WebMethod(Description = "更新设备在线状态<div class=\"param\">"
        + "输入参数说明<br />"
        + "strDevCodeList: 设备索引编号列表，多个设备以逗号分隔;<br />status: 设备状态，1-在线，0-离线;) </div>"
        + "<div class=\"result\">返回值(int)：>=1 -成功，0 -失败，设备不存在，-1 -数据库异常或WS服务异常</div>"
    )]
    public int UpdateDeviceStatus(string strDevCodeList, int status)
    {
        try
        {
            string[] arrDev = strDevCodeList.Split(',');
            StringBuilder strSql = new StringBuilder();
            foreach (string str in arrDev)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }
                DeviceStatusInfo dsi = new DeviceStatusInfo();
                dsi.Status3G = status;
                dsi.StatusTime3G = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                dsi.StatusType3G = 0;
                dsi.DevCode = str;

                strSql.Append(dsm.BuildUpdateDeviceStatusBy3G(dsi));
            }

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceStatusRequest", String.Format("DeviceCodeList:{0},Status:{1}", strDevCodeList, status));
            
            DBResultInfo dbResult = dsm.UpdateDeviceStatusHeartbeat(strSql.ToString());
            int result = dbResult.iResult;
            
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceStatusResponse", result.ToString());

            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceStatusResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }

    /// <summary>
    /// 更新设备心跳
    /// </summary>
    /// <param name="strDeviceIdList">设备编号列表，以逗号分隔</param>
    /// <returns></returns>
    [WebMethod(Description = "更新设备心跳"
       + "<div class=\"result\">返回值(int)：>=1 -成功，0 -失败，设备不存在，-1 -数据库异常或WS服务异常</div>"
    )]
    public int UpdateDeviceHeartbeat(string strDevCodeList)
    {
        try
        {
            string[] arrDev = strDevCodeList.Split(',');
            int status = 1;
            string strDateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            StringBuilder strSql = new StringBuilder();
            foreach (string str in arrDev)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }
                DeviceStatusInfo dsi = new DeviceStatusInfo();
                dsi.Status3G = status;
                dsi.StatusTime3G = strDateTime;
                dsi.StatusType3G = 0;
                dsi.HeartbeatTime3G = strDateTime;
                dsi.DevCode = str;

                strSql.Append(dsm.BuildUpdateDeviceStatusBy3G(dsi));
            }

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceHeartbeatRequest", String.Format("DeviceCodeList:{0},Status:{1}", strDevCodeList, status));

            DBResultInfo dbResult = dsm.UpdateDeviceStatusHeartbeat(strSql.ToString());
            int result = dbResult.iResult;
            
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceHeartbeatResponse", result.ToString());

            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceHeartbeatResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }
    #endregion

    #region  设置所有设备离线
    [WebMethod(Description = "设置所有设备离线（服务器程序退出之前调用）"
       + "<div class=\"result\">返回值(int)：>=0 -成功（被更新状态的设备的数量），-1 -数据库异常或WS服务异常</div>"
    )]
    public int SetAllDeviceOffline()
    {
        try
        {
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_SetAllDeviceOfflineRequest", "");

            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);
            DBResultInfo dbResult = dsm.UpdateAllDeviceStatusBy3G(0, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DeviceStatusType.Server.GetHashCode());

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_SetAllDeviceOfflineResponse", dbResult.iResult.ToString());
            return dbResult.iResult;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_SetAllDeviceOfflineResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }
    #endregion

    #region  设置超时设备离线
    [WebMethod(Description = "设置超时设备离线（服务器程序启动之后调用）"
      + "<div class=\"result\">返回值(int)：>=0 -成功（被更新状态的设备的数量），-1 -数据库异常或WS服务异常</div>"
    )]
    public int SetOvertimeDeviceOffline()
    {
        try
        {
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_SetOvertimeDeviceOfflineRequest", "");

            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);
            DBResultInfo dbResult = dsm.UpdateOvertimeDeviceStatus3G(0, 1, DeviceStatusType.Server.GetHashCode(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_SetOvertimeDeviceOfflineResponse", dbResult.iResult.ToString());
            return dbResult.iResult;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_SetOvertimeDeviceOfflineResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }
    #endregion

    #region  更新设备IP地址和端口
    [WebMethod(Description = "更新设备IP地址和端口"
        + "<div class=\"result\">返回值(int)：>=1 -成功，0 -失败，设备不存在，-1 -数据库异常或WS服务异常</div>"
    )]
    public int UpdateDeviceIp(string strDevCode, string strDevIp, int devPort)
    {
        try
        {
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceIpRequest", String.Format("strDevCode:{0},strDevIp:{1},devPort:{2}", strDevCode, strDevIp, devPort));

            DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
            int result = dm.UpdateDeviceIpPort(strDevCode, strDevIp, devPort);

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceIpResponse", String.Format("result:{0}", result));

            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_UpdateDeviceIpResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }
    #endregion

    #region  GPS信息上报
    [WebMethod(Description = "GPS信息上报"
       + "<div class=\"result\">返回值(int)：>=1 -成功，0 -失败，-1 -数据库异常或WS服务异常</div>"
    )]
    public int AddGpsInfo(GpsInfo[] arrGpsInfo)
    {
        try
        {
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_GpsReport", "测试");

            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString);
            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);

            int result = 0;
            foreach (GpsInfo gps in arrGpsInfo)
            {
                DeviceGpsInfo dgi = new DeviceGpsInfo();
                dgi.GpsType = 1; //1-3G
                dgi.DevCode = gps.DevCode;

                dgi.Latitude = gps.Latitude;
                dgi.Longitude = gps.Longitude;

                dgi.DivisionEW = gps.DivisionEW;
                dgi.DivisionNS = gps.DivisionNS;
                dgi.Speed = gps.Speed;
                dgi.Direction = gps.Direction;
                dgi.Mileage = gps.Mileage;

                dgi.ReceiveTime = gps.ReceiveTime;
                if (dgi.ReceiveTime.Equals(string.Empty))
                {
                    dgi.ReceiveTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                }

                string strTableName = dgm.BuildGpsTableName(DateTime.Parse(dgi.ReceiveTime).ToString("yyyyMMdd"));
                string strSql = string.Empty;


                if (dgm.CreateGpsTable(this.GpsDBConnectionString, strTableName))
                {
                    strSql = dgm.BuildGpsInsertSql(strTableName, dgi);
                    ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_Gps", String.Format("Sql:{0}", strSql));
                    result += dgm.InsertGpsInfo(this.GpsDBConnectionString, strSql);
                }

                if (dgm.CheckGpsBaseInfoIsExist(dgi.DevCode))
                {
                    strSql = dgm.BuildGpsBaseInfoUpdateSql(dgi);
                    dgm.UpdateGpsBaseInfo(strSql);
                }
                else
                {
                    strSql = dgm.BuildGpsBaseInfoInsertSql(dgi);
                    dgm.InsertGpsBaseInfo(strSql);
                }

                //保存设备状态表中的GPS信息
                DeviceStatusInfo dsi = new DeviceStatusInfo();
                //dsi.Latitude = dgi.Latitude.Equals(string.Empty) ? string.Empty : GpsLatLng.IntegerConvertLatLng(int.Parse(dgi.Latitude), 8).ToString();
                //dsi.Longitude = dgi.Longitude.Equals(string.Empty) ? string.Empty : GpsLatLng.IntegerConvertLatLng(int.Parse(dgi.Longitude), 8).ToString();
                dsi.Latitude = dgi.Latitude;
                dsi.Longitude = dgi.Longitude; 
                dsi.LastGpsTime = dgi.ReceiveTime;
                dsi.GpsType = dgi.GpsType;
                dsi.GpsAddType = 0;
                dsi.Direction = dgi.Direction;
                dsi.Speed = dgi.Speed;
                dsi.Mileage = dgi.Mileage;
                dsi.DevCode = dgi.DevCode;

                dsm.UpdateDeviceStatusGps(dsi);
            }

            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_GpsResponse", result.ToString());
            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            ServerLog.WriteEventLog(HttpContext.Current.Request, "WMP_GpsResponse", String.Format("{0},Error:{1}", -1, ex.Message));
            return -1;
        }
    }
    #endregion

    #region  报警信息上报
    [WebMethod(Description = "报警信息上报")]
    public int AddAlarmInfo(AlarmInfo[] arrAlarmInfo)
    {
        foreach (AlarmInfo alarm in arrAlarmInfo)
        {

        }
        return 0;
    }
    #endregion

    #region  添加流量时长使用记录
    /// <summary>
    /// 添加流量使用记录
    /// </summary>
    /// <param name="strDevCode">设备编号</param>
    /// <param name="fluxkb">流量使用量（增量）</param>
    /// <returns></returns>
    [WebMethod(Description = "添加流量使用记录")]
    public int AddFluxUseLog(string strDevCode, int fluxkb)
    {
        return 0;
    }

    /// <summary>
    /// 添加时长使用记录
    /// </summary>
    /// <param name="strDevCode">设备编号</param>
    /// <param name="duration">时长使用量（增量） 单位：秒</param>
    /// <returns></returns>
    [WebMethod(Description = "添加时长使用记录")]
    public int AddDurationUseLog(string strDevCode, int duration)
    {
        return 0;
    }
    #endregion

    #region  设备短信上报
    /// <summary>
    /// 设备短信上报
    /// </summary>
    /// <param name="arrSmsInfo"></param>
    /// <returns></returns>
    [WebMethod (Description="设备短信上报")]
    public int AddDeviceSms(DeviceSmsInfo[] arrSmsInfo)
    {
        foreach (DeviceSmsInfo sms in arrSmsInfo)
        {

        }
        return 0;
    }
    #endregion

    #region  添加用户操作日志
    /// <summary>
    /// 添加用户操作日志
    /// </summary>
    /// <param name="strUserName">用户名</param>
    /// <param name="strLogType">日志类型</param>
    /// <param name="strLogInfo">日志信息</param>
    /// <returns></returns>
    [WebMethod(Description = "添加用户操作日志")]
    public int AddOperatorLog(string strUserName, string strDevCode, string strLogType, string strLogInfo)
    {
        return 0;
    }
    #endregion

    #region  透明通道上传
    /// <summary>
    /// 透明通道上传
    /// </summary>
    /// <param name="strDevCode">设备编号</param>
    /// <param name="strClientId">客户端ID</param>
    /// <param name="upOrDown">上行或下行 0-上行，1-下行</param>
    /// <param name="strProtocol">透明协议内容</param>
    /// <returns></returns>
    [WebMethod(Description = "透明通道上传(upOrDown:上行或下行 0-上行，1-下行)")]
    public int TransparentChannelUpload(string strDevCode, string strClientId, int upOrDown, string strProtocol)
    {
        return 0;
    }
    #endregion


    #region  更新远程配置指令下发状态
    /// <summary>
    /// 更新远程配置指令下发状态
    /// </summary>
    /// <param name="sid">记录ID(流水号)</param>
    /// <param name="downStatus">下发状态：0-未发送，1-成功，2-失败</param>
    /// <param name="strDownTime">下发时间，时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <param name="strProtocolContent">下发给设备的协议内容</param>
    /// <param name="strErrorCode">错误代码，若无错误则为空值</param>
    /// <returns>返回值 true-更新成功，false-更新失败</returns>
    [WebMethod(Description = "更新远程配置指令下发状态"
        + "<div>"
        + "参数说明：<br />"
        + "sid: 流水号<br />"
        + "downStatus: 下发状态，0-未发送，1-发送成功，2-发送失败<br />"
        + "strDownTime: 下发时间，时间格式：yyyy-MM-dd HH:mm:ss<br />"
        + "strProtocolContent: 下发给设备的协议内容(JSON或XML格式的设备协议内容)<br />"
        + "strErrorCode: 错误代码，若无错误则为空值<br />"
        + "</div>"
    )]
    public bool UpdateRemoteSettingDownStatus(int sid, string strDevCode, int downStatus, string strDownTime, string strProtocolContent, string strErrorCode)
    {
        try
        {
            this.WriteLogByRemoteSetting("down", sid, downStatus, strDownTime, string.Empty, strErrorCode);

            DeviceRemoteSettingManage dsm = new DeviceRemoteSettingManage(Public.CmsDBConnectionString);
            DeviceRemoteSettingInfo dsi = new DeviceRemoteSettingInfo();
            dsi.Id = sid;
            dsi.DownStatus = downStatus;
            dsi.DownTime = Public.GetDateTime();// strDownTime;
            dsi.ProtocolContent = Server.UrlDecode(strProtocolContent);
            dsi.ErrorCode = strErrorCode.Equals("0") ? string.Empty : strErrorCode;

            bool result = dsm.UpdateRemoteSettingDownStatus(dsi) > 0;

            this.UpdateDeviceRemoteConfig(sid, strDevCode, strProtocolContent.Replace("'", "\'"), "Request");

            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新远程配置设备回复状态及回复信息
    /// <summary>
    /// 更新远程配置设备回复状态及回复信息
    /// </summary>
    /// <param name="sid">记录ID(流水号)</param>
    /// <param name="responseStatus">回复状态：0-未回复，1-成功，2-失败</param>
    /// <param name="strResponseTime">回复时间，时间格式：yyyy-MM-dd HH:mm:ss</param>
    /// <param name="strResponseContent">回复内容，即回复的协议数据内容</param>
    /// <param name="strErrorCode">错误代码，若无错误则为空值</param>
    /// <returns>返回值 true-更新成功，false-更新失败</returns>
    [WebMethod(Description = "更新远程配置设备回复状态及回复信息"
        + "<div>"
        + "参数说明：<br />"
        + "sid: 流水号<br />"
        + "responseStatus: 回复状态，0-未回复，1-回复成功，2-回复失败<br />"
        + "strResponseTime: 回复时间，时间格式：yyyy-MM-dd HH:mm:ss<br />"
        + "strResponseContent: 设备回复的协议内容(JSON或XML格式的设备协议内容)<br />"
        + "strErrorCode: 错误代码，若无错误则为空值<br />"
        + "</div>"
    )]
    public bool UpdateRemoteSettingResponse(int sid, string strDevCode, int responseStatus, string strResponseTime, string strResponseContent, string strErrorCode)
    {
        try
        {
            this.WriteLogByRemoteSetting("response", sid, responseStatus, strResponseTime, strResponseContent, strErrorCode);

            DeviceRemoteSettingManage dsm = new DeviceRemoteSettingManage(Public.CmsDBConnectionString);
            DeviceRemoteSettingInfo dsi = new DeviceRemoteSettingInfo();
            dsi.Id = sid;
            dsi.ResponseStatus = responseStatus;
            dsi.ResponseTime = Public.GetDateTime();//strResponseTime;
            dsi.ResponseContent = Server.UrlDecode(strResponseContent);
            dsi.ErrorCode = strErrorCode.Equals("0") ? string.Empty : strErrorCode;

            bool result = dsm.UpdateRemoteSettingResponseStatus(dsi) > 0;

            this.UpdateDeviceRemoteConfig(sid, strDevCode, strResponseContent.Replace("'", "\'"), "Response");

            return result;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  更新设备远程配置
    public void UpdateDeviceRemoteConfig(int sid, string strDevCode, string strConfig, string strAction)
    {
        try
        {
            DeviceRemoteConfigManage dcm = new DeviceRemoteConfigManage(this.DBConnectionString);
            DeviceRemoteSettingManage dsm = new DeviceRemoteSettingManage(this.DBConnectionString);

            DBResultInfo dbResult = dsm.GetRemoteSettingLog(sid);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DeviceRemoteSettingInfo dsi = dsm.FillRemoteSettingInfo(ds.Tables[0].Rows[0]);
                if (strDevCode.Equals(string.Empty))
                {
                    strDevCode = dsi.DevCode;
                }
                string strField = string.Empty;
                /*
                 * 读取类的指令，应该保存的是设备回复上来的协议内容
                 * 设置类的指令，应该保存的是平台下发到设备的协议内容
                 */
                if (strAction.Equals("Request"))
                {
                    //设置类的指令
                    //TO DO

                }
                else
                {
                    //读取类的指令
                    switch (dsi.FunctionCode)
                    {
                        case "getDeviceInfo":
                            strField = "device_info";
                            break;
                        case "getDeviceVersion":
                            strField = "device_version";
                            break;
                        case "getRS232Setting":
                            strField = "rs232_setting";
                            break;
                        case "getRS485Setting":
                            strField = "rs485_setting";
                            break;
                        case "getNetworkSetting":
                            strField = "network_setting";
                            break;
                        case "getVideoSetting":
                            strField = "video_setting";
                            break;
                        case "getOsdSetting":
                            strField = "osd_setting";
                            break;
                    }
                }
                if (!strField.Equals(string.Empty))
                {
                    dcm.UpdateRemoteConfig(strDevCode, strField, Server.UrlDecode(strConfig));
                }
            }
        }
        catch (Exception ex) { }
    }
    #endregion

    //以下方法为记录日志

    #region  远程配置下发设置的日志
    public bool WriteLogByRemoteSetting(string strLogType, int sid, int status, string strTime, string strContent, string strErrorCode)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();
            string strEventName = string.Empty;

            strLog.Append("\r\n<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n");
            switch (strLogType)
            {
                case "down":
                    strEventName = "RemoteSettingDown";
                    strLog.Append("<RemoteSettingDown>");
                    strLog.Append(String.Format("<SettingId>{0}</SettingId>", sid));
                    strLog.Append(String.Format("<DownStatus>{0}</DownStatus>", status));
                    strLog.Append(String.Format("<DownTime>{0}</DownTime>", strTime));
                    strLog.Append(String.Format("<ErrorCode>{0}</ErrorCode>", strErrorCode));
                    strLog.Append("</RemoteSettingDown>");
                    break;
                case "response":
                    strEventName = "RemoteSettingResponse";
                    strLog.Append("<RemoteSettingResponse>");
                    strLog.Append(String.Format("<SettingId>{0}</SettingId>", sid));
                    strLog.Append(String.Format("<ResponseStatus>{0}</ResponseStatus>", status));
                    strLog.Append(String.Format("<ResponseTime>{0}</ResponseTime>", strTime));
                    strLog.Append(String.Format("<ResponseContent><![CDATA[{0}]]></ResponseContent>", strContent));
                    strLog.Append(String.Format("<ErrorCode>{0}</ErrorCode>", strErrorCode));
                    strLog.Append("</RemoteSettingResponse>");
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

}