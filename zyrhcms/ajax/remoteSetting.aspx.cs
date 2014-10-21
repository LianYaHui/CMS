using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Xml;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.BLL.Server;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Model.Server;
using Google;
using Google.ProtocolBuffers;

public partial class ajax_remoteSetting : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserCenter uc = new UserCenter();
    protected DomainIp dip = new DomainIp();
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceRemoteSettingManage dsm = new DeviceRemoteSettingManage(Public.CmsDBConnectionString);
    protected WebProtocolWmp wps = new WebProtocolWmp();
    protected WmpProtocolBuild wpb = new WmpProtocolBuild();
    protected int wmpServerConnectFailed = -200;
    protected string strWmpServerConnectFailed = string.Empty;

    protected string strAction = string.Empty;
    protected string strDevCode = string.Empty;
    protected int channelNo = 0;
    protected string strSetting = string.Empty;
    protected string strParam = string.Empty;

    protected string strIdList = string.Empty;
    protected string strField = string.Empty;
    protected string strValue = string.Empty;

    protected int pageIndex = 0;
    protected int pageSize = 0;
    protected int status = -1;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        if (!IsPostBack)
        {
            this.InitialData();
        }
    }


    #region  初始化
    private void InitialData()
    {
        try
        {
            this.strAction = Public.RequestString("action", string.Empty);
            if (Config.ValidateRequestType() && !this.strAction.Equals(string.Empty))
            {
                if (!this.Request.RequestType.Equals("POST"))
                {
                    Response.Write("RequestType Error");
                    Response.End();
                }
            }
            if (Config.ValidateUrlReferrer() && !strAction.Equals(string.Empty))
            {
                if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
                {
                    Response.Write("UrlReferrer Error");
                    Response.End();
                }
            }
            if (!uc.CheckUserLogin() && !this.strAction.Equals(string.Empty))
            {
                Response.Write("{result:-1, msg:'您还没有登录或登录已超时。', error:'noauth'}");
                Response.End();
            }
            //this.strWmpServerConnectFailed = this.BuildWmpServerErrorPrompt(wmpServerConnectFailed, "WMP服务器", WmpSocketClient.strServerIp.Equals("127.0.0.1") ? Public.WebServerIp : WmpSocketClient.strServerIp, WmpSocketClient.iServerPort);

            
            this.strDevCode = Public.RequestString("devCode");
            this.strSetting = Public.RequestString("setting");
            this.strParam = Public.RequestString("param");

            switch (this.strAction)
            {
                case "getSettingLog":
                    this.strIdList = Public.RequestString("logIdList");
                    Response.Write(this.GetSettingLog(this.strIdList));
                    break;
                case "getRemoteConfig":
                    this.strField = Public.RequestString("field");
                    Response.Write(this.GetRemoteConfig(this.strDevCode, this.strField));
                    break;
                case "updateRemoteConfig":
                    this.strField = Public.RequestString("field");
                    this.strValue = Public.RequestString("value");
                    Response.Write(this.UpdateRemoteConfig(this.strDevCode, this.strField, this.strValue.Replace("'", "\'")));
                    break;
                case "getDeviceInfo":           //读取设备信息
                case "getDeviceVersion":        //读取设备版本
                case "getOsdSetting":           //读取显示设置
                case "getVideoSetting":         //读取视频设置
                case "getRS232Setting":         //读取RS232设置
                case "getRS485Setting":         //读取RS485设置
                case "getNetworkSetting":       //读取网络设置
                case "getDiskStatus":           //读取硬盘管理
                case "getDeviceRecordPlan":     //读取设备录像计划
                case "getDeviceCapturePlan":    //读取设备抓拍计划
                case "getExceptionSetting":     //读取异常参数设置
                case "getOsdCustom":            //读取自定义OSD叠加
                case "getVideoLost":            //读取视频丢失
                case "getVideoMask":            //读取视频遮盖设置
                case "getVideoMaskEnabled":
                case "getMaskAlarm":            //读取遮挡报警
                case "getMaskAlarmEnabled":
                case "getMontionDetection":     //读取移动侦测
                case "getMontionDetectionEnabled":
                    Response.Write(this.ReadDeviceInfo(this.strAction, this.strDevCode, this.strSetting, this.strParam));
                    break;
                case "rebootDevice":
                case "setDeviceInfo":
                case "setOsdSetting":
                case "setVideoSetting":
                case "setRS232Setting":
                case "setRS485Setting":
                case "setNetworkSetting":
                case "setDiskStatus":
                case "setDeviceRecordPlan":
                case "setDeviceCapturePlan":
                case "setExceptionSetting":
                case "setOsdCustom":
                case "setVideoLost":
                case "setVideoMask":
                case "setVideoMaskEnabled":
                case "setMaskAlarm":
                case "setMaskAlarmEnabled":
                case "setMontionDetection":
                case "setMontionDetectionEnabled":
                    Response.Write(this.SetRemoteConfig(this.strAction, this.strDevCode, this.strSetting, this.strParam));
                    break;
                case "getStoreRecordPlan":
                    this.channelNo = Public.RequestString("channelNo", 0);
                    Response.Write(this.ReadStoreRecordPlan(this.strDevCode, this.channelNo));
                    break;
                case "setStoreRecordPlan":
                    this.channelNo = Public.RequestString("channelNo", 0);
                    Response.Write(this.SetStoreRecordPlan(this.strDevCode, this.channelNo, this.strSetting));
                    break;
                default:
                    Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                    break;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            Response.Write(String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current)));
        }
    }
    #endregion


    public string BuildWmpServerErrorPrompt(int result, string strServerName, string strServerIp, int serverPort)
    {
        if (strServerIp.Equals(string.Empty))
        {
            return String.Format("{{result:{0}, msg:'{1} 不存在，请检查服务器程序是否运行。',error:''}}",
                result, strServerName);
        }
        else
        {
            return String.Format("{{result:{0}, msg:'{1}({2}:{3})连接失败，请检查服务器程序是否运行。',error:''}}",
                result, strServerName, strServerIp, serverPort);
        }
    }


    #region  获得设备配置/状态信息
    public string GetRemoteConfig(string strDevCode, string strField)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DBResultInfo dbResult = new DBResultInfo();
            switch (strField)
            {
                case "device_info":         //设备信息
                case "device_version":      //设备版本信息
                    dbResult = new DeviceRemoteConfigManage(this.DBConnectionString).GetRemoteConfigInfoByField(strDevCode, strField);
                    break;
                default:
                    dbResult = new DeviceRemoteConfigManage(this.DBConnectionString).GetRemoteConfigInfoByField(strDevCode, strField);
                    break;
            }
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append("{result:1");
                DataRow dr = ds.Tables[0].Rows[0];
                strResult.Append(String.Format(",content:'{0}'", dr[0].ToString().Replace("\\", "\\\\").Replace("'", "\\\'").Replace("\r\n", "<br />")));
                strResult.Append("}");
            }
            else
            {
                strResult.Append("{result:0");
                strResult.Append(String.Format(",msg:'{0}'({1})", "没有找到设备配置信息", strField));
                strResult.Append("}");
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  更新设备配置信息
    public string UpdateRemoteConfig(string strDevCodeList, string strField, string strSetting)
    {
        try
        {
            bool result = new DeviceRemoteConfigManage(this.DBConnectionString).UpdateRemoteConfig(strDevCodeList, strField, strSetting);

            return String.Format("{{result:{0},field:'{1}',content:'{2}'}}", result ? 1 : 0, strField, strSetting.Replace("\r\n", "<br />"));
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得操作设置记录
    public string GetSettingLog(string strLogIds)
    {
        try
        {
            DBResultInfo dbResult = dsm.GetRemoteSettingLog(strLogIds);
            DataSet dsLog = dbResult.dsResult;
            if (dsLog != null && dsLog.Tables[0] != null && dsLog.Tables[0].Rows.Count > 0)
            {
                StringBuilder arrLog = new StringBuilder();
                foreach (DataRow dr in dsLog.Tables[0].Rows)
                {
                    DeviceRemoteSettingInfo dsi = dsm.FillRemoteSettingInfo(dr);
                    arrLog.Append(",{");
                    arrLog.Append(String.Format("id:{0}", dsi.Id));
                    arrLog.Append(String.Format(",devId:{0}", dsi.DevId));
                    arrLog.Append(String.Format(",devIndexCode:'{0}'", dsi.DevCode));
                    arrLog.Append(String.Format(",devName:'{0}'", dsi.DevName));
                    arrLog.Append(String.Format(",devTypeCode:'{0}'", dsi.TypeCode));
                    arrLog.Append(String.Format(",downStatus:{0}", dsi.DownStatus));
                    arrLog.Append(String.Format(",downTime:'{0}'", dsi.DownTime));
                    arrLog.Append(String.Format(",functionCode:'{0}'", dsi.FunctionCode));
                    arrLog.Append(String.Format(",protocolContent:'{0}'", dsi.ProtocolContent.Replace("'", "\\\'").Replace("\r\n", "").Replace("\n", "").Replace("\t", "")));
                    arrLog.Append(String.Format(",responseStatus:{0}", dsi.ResponseStatus));
                    arrLog.Append(String.Format(",responseContent:'{0}'", dsi.ResponseContent.Replace("'", "\\\'").Replace("\r\n", "").Replace("\n", "").Replace("\t", "")));
                    arrLog.Append(String.Format(",responseTime:'{0}'", dsi.ResponseTime));
                    arrLog.Append(String.Format(",errorCode:'{0}'", dsi.ErrorCode));
                    arrLog.Append(String.Format(",createTime:'{0}'", dsi.CreateTime));
                    arrLog.Append("}");
                }
                return String.Format("{{result:1,list:[{0}]}}", arrLog.Length > 0 ? arrLog.ToString().Substring(1) : arrLog.ToString());
            }
            else
            {
                return String.Format("{{result:1,list:[]}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  添加设置记录
    public int InsertRemoteSetting(int devId, string strDevCode, string strTypeCode, string strFunctionCode, string strProtocolContent,
        int settingType, string strParameter, int timeout, int operatorId, string operatorIp, int parentId, int childQuantity)
    {
        try
        {
            DeviceRemoteSettingInfo dsi = new DeviceRemoteSettingInfo();

            dsi.DevId = devId;
            dsi.DevCode = strDevCode;
            dsi.TypeCode = strTypeCode;
            dsi.FunctionCode = strFunctionCode;
            dsi.ProtocolContent = strProtocolContent.Replace("'", "\'");
            dsi.SettingType = settingType;
            dsi.Parameter = strParameter;
            dsi.Timeout = timeout;
            dsi.CreateTime = Public.GetDateTime();
            dsi.OperatorId = operatorId;
            dsi.OperatorIp = operatorIp;
            dsi.ParentId = parentId;
            dsi.ChildQuantity = childQuantity;

            int logId = dsm.InsertRemoteSetting(dsi);

            return logId;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  发送指令协议
    public bool SendProtocol(int logId, byte[] arrCon, int cmd, int result, string strServerIp, int serverPort)
    {
        try
        {
            byte[] arrHeader = wps.CreateProtocolHeader(logId, arrCon.Length, cmd, result);
            byte[] arrFooter = wps.CreateProtocolFooter(arrCon);
            byte[] arrProtocol = wps.CreateProtocolContent(arrHeader, arrCon, arrFooter);

            try
            {
                return WmpSocketClient.SendProtocol(arrProtocol);
            }
            catch (Exception exx)
            {
                WmpSocketClient.ConnectServer(strServerIp, serverPort);
                return WmpSocketClient.SendProtocol(arrProtocol);
            }
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  读取设备信息
    public string ReadDeviceInfo(string strAction, string strDevCode, string strSetting, string strParam)
    {
        try
        {
            string strLogIdList = string.Empty;
            int logId = 0;
            byte[] arrCon = new byte[1];

            string ipAddr = dip.GetIpAddress();
            UserInfo ui = uc.GetLoginUserInfo();
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
            if (di == null)
            {
                return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
            }

            string strTypeCode = di.TypeCode;
            string strFunctionCode = string.Empty;
            string strProtocolContent = string.Empty;
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();

            wmp.Command cmd = wmp.Command.CMD_DAG_TRANSMIT;
            
            ByteString bsCon = ByteString.Empty;
            string[] arrConfig = new string[1];

            switch (strAction)
            {
                case "getDeviceInfo":           //读取设备信息
                    strFunctionCode = "getDeviceInfo";
                    cmd = wmp.Command.CMD_DEVICE_GET_DEVICEINFO;
                    break;
                case "getDeviceVersion":        //读取设备版本
                    strFunctionCode = "getDeviceVersion";
                    cmd = wmp.Command.CMD_DEVICE_GET_VERSIONINFO;
                    break;
                case "getOsdSetting":       //读取显示设置
                    strFunctionCode = "getOsdSetting";
                    cmd = wmp.Command.CMD_DEVICE_GET_OSDINFO;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadOsdSetting(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getVideoSetting":         //读取视频设置
                    strFunctionCode = "getVideoSetting";
                    cmd = wmp.Command.CMD_DEVICE_GET_VIDEO_STREAMING;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadVideoSetting(DataConvert.ConvertValue(arrConfig[0], 0), DataConvert.ConvertValue(arrConfig[1], 0));
                    break;
                case "getRS232Setting":         //读取RS232设置
                    strFunctionCode = "getRS232Setting";
                    cmd = wmp.Command.CMD_DEVICE_GET_RS232;
                    break;
                case "getRS485Setting":         //读取RS485设置
                    strFunctionCode = "getRS485Setting";
                    cmd = wmp.Command.CMD_DEVICE_GET_RS485;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadRS485Setting(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getNetworkSetting":       //读取网络设置
                    strFunctionCode = "getNetworkSetting";
                    cmd = wmp.Command.CMD_DEVICE_GET_NETADAPTOR;
                    break;
                case "getDeviceRecordPlan":     //读取设备录像计划
                    strFunctionCode = "getRecordPlan";
                    cmd = wmp.Command.CMD_DEVICE_GET_RECORDPLAN;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadDeviceRecordPlan(DataConvert.ConvertValue(arrConfig[0], 0), DataConvert.ConvertValue(arrConfig[1], 0));
                    break;
                case "getDeviceCapturePlan":    //读取设备抓图计划
                    strFunctionCode = "getRecordPlan";
                    cmd = wmp.Command.CMD_DEVICE_GET_CAPTUREPLAN;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadDeviceCapturePlan(DataConvert.ConvertValue(arrConfig[0], 0), DataConvert.ConvertValue(arrConfig[1], 0));
                    break;
                case "getDiskStatus":           //读取硬盘状态
                    strFunctionCode = "getDiskStatus";
                    cmd = wmp.Command.CMD_DEVICE_GET_DISK_STATUS;
                    break;
                case "getExceptionSetting":     //读取异常参数设置
                    strFunctionCode = "getExceptionSetting";
                    cmd = wmp.Command.CMD_DEVICE_GET_EXCEPTION;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadException(DataConvert.ConvertValue(arrConfig[0], 0), DataConvert.ConvertValue(arrConfig[1], 0));
                    break;
                case "getOsdCustom":            //读取自定义OSD叠加
                    strFunctionCode = "getOsdCustom";
                    cmd = wmp.Command.CMD_DEVICE_GET_CUSTOM_OSD;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadOsdCustom(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getVideoLost":            //读取视频丢失
                    strFunctionCode = "getVideoLost";
                    cmd = wmp.Command.CMD_DEVICE_GET_ALARM_VIDEOLOST;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadVideoLost(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getVideoMask":           //读取视频遮盖
                    strFunctionCode = "getVideoMask";
                    cmd = wmp.Command.CMD_DEVICE_GET_MASK;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadVideoMask(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getVideoMaskEnabled":           //读取视频遮盖可用性
                    strFunctionCode = "getVideoMaskEnabled";
                    cmd = wmp.Command.CMD_DEVICE_GET_MASK_ENABLED;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadVideoMaskEnabled(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getMaskAlarm":           //读取遮挡报警
                    strFunctionCode = "getMaskAlarm";
                    cmd = wmp.Command.CMD_DEVICE_GET_ALARM_MASK;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadMaskAlarm(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getMaskAlarmEnabled":           //读取遮挡报警可用性
                    strFunctionCode = "getMaskAlarmEnabled";
                    cmd = wmp.Command.CMD_DEVICE_GET_ALARM_MASK_ENABLED;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadMaskAlarmEnabled(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getMontionDetection":           //读取移动侦测
                    strFunctionCode = "getMontionDetection";
                    cmd = wmp.Command.CMD_DEVICE_GET_ALARM_MONTION;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadMotionDetetion(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
                case "getMontionDetectionEnabled":           //读取移动侦测可用性
                    strFunctionCode = "getMontionDetectionEnabled";
                    cmd = wmp.Command.CMD_DEVICE_GET_ALARM_MONTION_ENABLED;
                    arrConfig = strSetting.Split(',');
                    bsCon = wpb.ReadMotionDetetionEnabled(DataConvert.ConvertValue(arrConfig[0], 0));
                    break;
            }

            string strServerIp = string.Empty;
            int serverPort = 0;
            try
            {
                WmpServerInfo dag = null;

                if (Config.GetRedisEnabled())
                {
                    wmp.WmpCache wc = WmpRedis.ConnectRedis(Config.GetRedisServerIp(), Config.GetRedisServerPort());
                    if (wc != null)
                    {
                        WmpDeviceInfo wdi = WmpRedis.GetDeviceInfo(wc, di.DevCode);
                        if (wdi != null)
                        {
                            //先从Redis缓存中查找DAG
                            dag = WmpRedis.GetServer(wc, wdi.DagServerIndexCode, wdi.DagServerType, ui.LoginLineCode);
                        }
                        else
                        {
                            return String.Format("{{result:0,msg:'{0}',error:''}}", "设备离线");
                        }
                    }
                }
                if (null == dag)
                {
                    if (di.DagServerId == 0)
                    {
                        return String.Format("{{result:0,msg:'设备没有配置DAG服务器信息',error:''}}");
                    }
                    if (di.ServerLineId == 0)
                    {
                        return String.Format("{{result:0,msg:'设备没有选择服务器线路',error:''}}");
                    }
                    //从Redis缓存中查找DAG失败
                    //取DAG服务器登录线路IP
                    dag = this.GetDagServerIpInfo(di.DagServerId, di.ServerLineId);
                }
                if (null == dag)
                {
                    return String.Format("{{result:0,msg:'{0}不存在，请检查服务器程序是否运行',error:''}}", "DAG服务器");
                }

                strServerIp = dag.Ip;
                serverPort = dag.Port;

                WmpSocketClient.strServerIp = strServerIp;
                WmpSocketClient.iServerPort = serverPort;
                WmpSocketClient.ConnectServer();
            }
            catch (Exception e)
            {
                return this.BuildWmpServerErrorPrompt(wmpServerConnectFailed, "DAG服务器", strServerIp, serverPort);
            }
            logId = this.InsertRemoteSetting(di.DevId, strDevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType, strSetting, 30, ui.UserId, ipAddr, 0, 0);
            if (logId > 0)
            {
                strLogIdList = logId.ToString();

                wmp.dag.TransmitReq.Builder req_builder = new wmp.dag.TransmitReq.Builder();
                req_builder.Cmd = cmd;
                req_builder.DeviceId = strDevCode;
                req_builder.Token = string.Empty;
                req_builder.WsNotify = true;
                req_builder.Data = bsCon;

                wmp.dag.TransmitReq req = req_builder.Build();
                arrCon = req.ToByteArray();

                //bool isSuccess = this.SendProtocol(logId, arrCon, wmp.Command.CMD_DAG_TRANSMIT.GetHashCode(), 0, di.devPagServer.ServerIp, Public.WmpServerPort);
                bool isSuccess = this.SendProtocol(logId, arrCon, wmp.Command.CMD_DAG_TRANSMIT.GetHashCode(), 0, WmpSocketClient.strServerIp, WmpSocketClient.iServerPort);
                if (!isSuccess)
                {
                    return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败，稍后请重试");
                }
            }

            return String.Format("{{result:1,list:[{0}]}}", strLogIdList);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  设置设备信息
    public string SetRemoteConfig(string strAction, string strDevCode, string strSetting, string strParam)
    {
        try
        {
            string strLogIdList = string.Empty;
            int logId = 0;
            byte[] arrCon = new byte[1];
            ByteString bsCon = ByteString.Empty;

            string ipAddr = dip.GetIpAddress();
            UserInfo ui = uc.GetLoginUserInfo();
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
            if (di == null)
            {
                return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
            }

            string strTypeCode = di.TypeCode;
            string strFunctionCode = string.Empty;
            string strProtocolContent = string.Empty;
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();

            wmp.Command cmd = wmp.Command.CMD_DAG_TRANSMIT;

            strSetting = Server.HtmlDecode(strSetting);

            switch (strAction)
            {
                case "rebootDevice":        //重启设备
                    strFunctionCode = "rebootDevice";
                    cmd = wmp.Command.CMD_DEVICE_REBOOT;
                    break;
                    /*
                case "setDeviceInfo":           //设备信息
                    strFunctionCode = "setDeviceInfo";
                    cmd = wmp.Command.CMD_DEVICE_GET_DEVICEINFO;        
                    break;
                    */
                case "setOsdSetting":        //显示设置
                    strFunctionCode = "setOsdSetting";
                    cmd = wmp.Command.CMD_DEVICE_SET_OSDINFO;
                    bsCon = wpb.BuildOsdSetting(strSetting);
                    break;
                case "setVideoSetting":        //视频设置
                    strFunctionCode = "setVideoSetting";
                    cmd = wmp.Command.CMD_DEVICE_SET_VIDEO_STREAMING;
                    bsCon = wpb.BuildVideoSetting(strSetting);
                    break;
                case "setRS232Setting":         //RS232设置
                    strFunctionCode = "setRS232Setting";
                    cmd = wmp.Command.CMD_DEVICE_SET_RS232;
                    bsCon = wpb.BuildRS232Setting(strSetting);
                    break;
                case "setRS485Setting":         //RS485设置
                    strFunctionCode = "setRS485Setting";
                    cmd = wmp.Command.CMD_DEVICE_SET_RS485;
                    bsCon = wpb.BuildRS485Setting(strSetting);
                    break;
                case "setNetworkSetting":         //网络设置
                    strFunctionCode = "setNetworkSetting";
                    cmd = wmp.Command.CMD_DEVICE_SET_NETADAPTOR;
                    bsCon = wpb.BuildNetworkSetting(strSetting);
                    break;
                case "setDeviceRecordPlan":
                    strFunctionCode = "setDeviceRecordPlan";  //设备录像计划
                    cmd = wmp.Command.CMD_DEVICE_SET_RECORDPLAN;
                    bsCon = wpb.BuildDeviceRecordPlan(strSetting);
                    break;
                case "setDeviceCapturePlan":
                    strFunctionCode = "setDeviceCapturePlan";  //设备抓拍计划
                    cmd = wmp.Command.CMD_DEVICE_SET_CAPTUREPLAN;
                    bsCon = wpb.BuildCapturePlan(strSetting);
                    break;
                case "setExceptionSetting":
                    strFunctionCode = "setExceptionSetting";  //异常参数设置
                    cmd = wmp.Command.CMD_DEVICE_SET_EXCEPTION;
                    bsCon = wpb.BuildException(strSetting);
                    break;
                case "setOsdCustom":
                    strFunctionCode = "setOsdCustom";  //OSD叠加
                    cmd = wmp.Command.CMD_DEVICE_SET_CUSTOM_OSD;
                    bsCon = wpb.BuildOsdCustom(strSetting);
                    break;
                case "setVideoLost":
                    strFunctionCode = "setVideoLost";  //视频丢失
                    cmd = wmp.Command.CMD_DEVICE_SET_ALARM_VIDEOLOST;
                    bsCon = wpb.BuildVideoLost(strSetting);
                    break;
                case "setVideoMask":
                    strFunctionCode = "setVideoMask";  //视频遮盖
                    cmd = wmp.Command.CMD_DEVICE_SET_MASK;
                    bsCon = wpb.BuildVideoMask(strSetting);
                    break;
                case "setVideoMaskEnabled":
                    strFunctionCode = "setVideoMaskEnabled";  //视频遮盖
                    cmd = wmp.Command.CMD_DEVICE_SET_MASK_ENABLED;
                    bsCon = wpb.BuildVideoMaskEnabled(strSetting);
                    break;
                case "setMaskAlarm":
                    strFunctionCode = "setMaskAlarm";  //遮挡报警
                    cmd = wmp.Command.CMD_DEVICE_SET_ALARM_MASK;
                    bsCon = wpb.BuildMaskAlarm(strSetting);
                    break;
                case "setMaskAlarmEnabled":
                    strFunctionCode = "setMaskAlarmEnabled";  //遮挡报警
                    cmd = wmp.Command.CMD_DEVICE_SET_ALARM_MASK_ENABLED;
                    bsCon = wpb.BuildMaskAlarmEnabled(strSetting);
                    break;
                case "setMontionDetection":
                    strFunctionCode = "setMontionDetection";  //移动侦测
                    cmd = wmp.Command.CMD_DEVICE_SET_ALARM_MONTION;
                    bsCon = wpb.BuildMotionDetetion(strSetting);
                    break;
                case "setMontionDetectionEnabled":
                    strFunctionCode = "setMontionDetectionEnabled";  //移动侦测
                    cmd = wmp.Command.CMD_DEVICE_SET_ALARM_MONTION_ENABLED;
                    bsCon = wpb.BuildMotionDetetionEnabled(strSetting);
                    break;
            }

            string strServerIp = string.Empty;
            int serverPort = 0;
            try
            {
                WmpServerInfo dag = null;

                if (Config.GetRedisEnabled())
                {
                    wmp.WmpCache wc = WmpRedis.ConnectRedis(Config.GetRedisServerIp(), Config.GetRedisServerPort());
                    if (wc != null)
                    {
                        WmpDeviceInfo wdi = WmpRedis.GetDeviceInfo(wc, di.DevCode);
                        if (wdi != null)
                        {
                            //先从Redis缓存中查找DAG
                            dag = WmpRedis.GetServer(wc, wdi.DagServerIndexCode, wdi.DagServerType, ui.LoginLineCode);
                        }
                        else
                        {
                            return String.Format("{{result:0,msg:'{0}',error:''}}", "设备离线");
                        }
                    }
                }
                if (null == dag)
                {
                    if (di.DagServerId == 0)
                    {
                        return String.Format("{{result:0,msg:'设备没有配置DAG服务器信息',error:''}}");
                    }
                    if (di.ServerLineId == 0)
                    {
                        return String.Format("{{result:0,msg:'设备没有选择服务器线路',error:''}}");
                    }
                    //从Redis缓存中查找DAG失败
                    //取DAG服务器登录线路IP
                    dag = this.GetDagServerIpInfo(di.DagServerId, di.ServerLineId);
                }
                if (null == dag)
                {
                    return String.Format("{{result:0,msg:'{0}不存在，请检查服务器程序是否运行',error:''}}", "DAG服务器");
                }

                strServerIp = dag.Ip;
                serverPort = dag.Port;

                WmpSocketClient.strServerIp = strServerIp;
                WmpSocketClient.iServerPort = serverPort;
                WmpSocketClient.ConnectServer();
            }
            catch (Exception e)
            {
                return this.BuildWmpServerErrorPrompt(wmpServerConnectFailed, "DAG服务器", strServerIp, serverPort);
            }
            logId = this.InsertRemoteSetting(di.DevId, strDevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType, strSetting, 30, ui.UserId, ipAddr, 0, 0);
            if (logId > 0)
            {
                strLogIdList = logId.ToString();

                wmp.dag.TransmitReq.Builder req_builder = new wmp.dag.TransmitReq.Builder();
                req_builder.Cmd = cmd;
                req_builder.DeviceId = strDevCode;
                req_builder.Token = string.Empty;
                req_builder.WsNotify = true;
                req_builder.Data = bsCon;

                wmp.dag.TransmitReq req = req_builder.Build();
                arrCon = req.ToByteArray();

                //this.SendProtocol(logId, arrCon, cmd.GetHashCode(), 0);
                //bool isSuccess = this.SendProtocol(logId, arrCon, wmp.Command.CMD_DAG_TRANSMIT.GetHashCode(), 0, di.devPagServer.ServerIp, Public.WmpServerPort);
                bool isSuccess = this.SendProtocol(logId, arrCon, wmp.Command.CMD_DAG_TRANSMIT.GetHashCode(), 0, WmpSocketClient.strServerIp, WmpSocketClient.iServerPort);
                if (!isSuccess)
                {
                    return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败，稍后请重试");
                }
            }

            return String.Format("{{result:1,list:[{0}]}}", strLogIdList);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得DAG服务器线路信息
    private WmpServerInfo GetDagServerIpInfo(int serverId, int serverLineId)
    {
        try
        {
            WmpServerInfo info = null;
            ServerManage sm = new ServerManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = sm.GetServerIpList(serverId, serverLineId);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                ServerIpInfo sii = sm.FillServerIpInfo(ds.Tables[0].Rows[0]);
                info = new WmpServerInfo();
                info.Ip = sii.ServerIp;
                info.Port = sii.ServerPort;
            }
            return info;
        }
        catch (Exception ex) { return null; }
    }
    #endregion

    #region  读取中心录像计划
    public string ReadStoreRecordPlan(string strDevCode, int chnnaleNo)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DeviceCenterRecordPlanManage dcm = new DeviceCenterRecordPlanManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = dcm.GetDeviceCenterRecordPlan(-1, strDevCode, channelNo);

            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1");
            strResult.Append(String.Format(",devCode:'{0}'", strDevCode));
            strResult.Append(String.Format(",chnnaleNo:{0}", chnnaleNo));
            strResult.Append(",recordPlan:{");

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceCenterRecordPlan info = dcm.FillCenterRecordPlan(dr);
                    strResult.Append(String.Format("chnnaleCopy:'{0}'", info.ChannelCopy));
                    strResult.Append(String.Format(",weekdayCopy:'{0}'", info.WeekdayCopy));
                    strResult.Append(String.Format(",timeConfig:'{0}'", info.TimeConfig.Replace("#", ",").Replace("&", "|")));
                }
            }
            strResult.Append("}");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  设置中心录像计划
    public string SetStoreRecordPlan(string strDevCode, int chnnaleNo, string strSetting)
    {
        try
        {
            DeviceCenterRecordPlan info = new DeviceCenterRecordPlan();
            info.DevCode = strDevCode;
            info.ChannelNo = channelNo;

            ArrayList arrConfig = this.ParseSettingXml(strSetting);
            int c = 0;
            info.DevId = DataConvert.ConvertValue(arrConfig[c++], 0);
            info.WeekdayCopy = arrConfig[c++].ToString();
            info.ChannelCopy = arrConfig[c++].ToString();
            info.TimeConfig = arrConfig[c++].ToString().Replace(",", "#").Replace("|", "&");

            info.CreateTime = Public.GetDateTime();
            info.UpdateTime = Public.GetDateTime();

            string[] arrChannel = info.ChannelCopy.Split(',');
            //info.ServerId = 0;

            if (info.DevId <= 0)
            {
                return "{result:0}";
            }

            DeviceCenterRecordPlanManage dcm = new DeviceCenterRecordPlanManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = dcm.GetDeviceCenterRecordPlan(-1, strDevCode, -1);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataView dv = new DataView(ds.Tables[0], "channel_no=" + info.ChannelNo, "", DataViewRowState.CurrentRows);

                if (arrChannel.Length > 0)
                {
                    foreach (string str in arrChannel)
                    {
                        info.ChannelNo = DataConvert.ConvertValue(str, 0);
                        if (info.ChannelNo > 0)
                        {
                            dv = new DataView(ds.Tables[0], "channel_no=" + info.ChannelNo, "", DataViewRowState.CurrentRows);
                            if (dv.Count > 0)
                            {
                                dcm.UpdateCenterRecordPlan(info);
                            }
                            else
                            {
                                dcm.AddDeviceCenterRecordPlan(info);
                            }
                        }
                    }
                }
                else
                {
                    if (dv.Count > 0)
                    {
                        dcm.UpdateCenterRecordPlan(info);
                    }
                    else
                    {
                        dcm.AddDeviceCenterRecordPlan(info);
                    }
                }
            }
            else
            {
                if (arrChannel.Length > 0)
                {
                    foreach (string str in arrChannel)
                    {
                        info.ChannelNo = DataConvert.ConvertValue(str, 0);
                        if (info.ChannelNo > 0)
                        {
                            dcm.AddDeviceCenterRecordPlan(info);
                        }
                    }
                }
                else
                {
                    dcm.AddDeviceCenterRecordPlan(info);
                }
            }

            //向中心存储服务器发送指令
            string strServerIp = string.Empty;
            int serverPort = 0;
            bool isPush = Config.GetRecordPlanPush();
            if (isPush)
            {
                try
                {
                    //查询设备信息
                    DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
                    DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
                    if (di.CssServerId > 0)
                    {
                        ServerManage sm = new ServerManage(Public.CmsDBConnectionString);
                        int serverLineId = di.ServerLineId > 0 ? di.ServerLineId : 0;
                        //查询服务器线路
                        DBResultInfo dbResultServer = sm.GetServerIpList(di.CssServerId, serverLineId);
                        DataSet dsServer = dbResultServer.dsResult;
                        if (dsServer != null && dsServer.Tables[0] != null && dsServer.Tables[0].Rows.Count > 0)
                        {
                            ServerIpInfo sii = sm.FillServerIpInfo(dsServer.Tables[0].Rows[0]);
                            strServerIp = sii.ServerIp;
                            serverPort = sii.ServerPort;
                        }
                        if (!strServerIp.Equals(string.Empty) && serverPort > 0)
                        {
                            WmpSocketClient.strServerIp = strServerIp;
                            WmpSocketClient.iServerPort = serverPort;
                            if (WmpSocketClient.ConnectServer())
                            {
                                StringBuilder strData = new StringBuilder();
                                strData.Append("<UpdateRecordPlan>");
                                strData.Append("<DeviceList>");
                                strData.Append(String.Format("<DeviceCode>{0}</DeviceCode>", strDevCode));
                                strData.Append("</DeviceList>");
                                strData.Append("</UpdateRecordPlan>");
                                byte[] bytData = System.Text.Encoding.GetEncoding("gb2312").GetBytes(strData.ToString());

                                WmpSocketClient.SendProtocol(bytData);
                            }
                        }
                        else
                        {
                            return String.Format("{{result:0,msg:'{0}',error:'{1}'}}", 
                                "录像计划已保存，但该设备所配置CSS服务器的IP和端口有误，无法推送录像计划给服务器。",
                                "CSS服务器IP:" + strServerIp + ",CSS服务器端口:" + serverPort);
                        }
                    }
                    else
                    {
                        return String.Format("{{result:0,msg:'{0}'}}", "录像计划已保存，但该设备没有配置CSS服务器，无法推送录像计划给服务器。");
                    }
                }
                catch (Exception exx)
                {
                    return String.Format("{{result:0,msg:'Push:{0},ServerIp:{1},ServerPort:{2}',error:'{3}'}}",
                        "true", strServerIp, serverPort, exx.Message);
                }
            }
            if (isPush)
            {
                return String.Format("{{result:1,msg:'Push:{0},ServerIp:{1},ServerPort:{2}'}}", "true", strServerIp, serverPort);
            }
            else
            {
                return String.Format("{{result:1,msg:'Push:{0}'}}", "false");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  解析WEB客户端提交的XML内容
    /// <summary>
    /// 解析WEB客户端提交的XML内容
    /// 假设提交的内容格式关键字顺序都是正确的
    /// </summary>
    /// <param name="strSetting"></param>
    /// <returns></returns>
    public ArrayList ParseSettingXml(string strSetting)
    {
        try
        {
            ArrayList arrConfig = new ArrayList();

            XmlDocument xml = new XmlDocument();
            xml.LoadXml(Server.HtmlDecode(strSetting));
            XmlNode root = xml.SelectSingleNode("ZyrhRemoteConfig");
            XmlNode nodeConfig = root.SelectSingleNode("Config");
            XmlNodeList nodeList = nodeConfig.ChildNodes;

            foreach (XmlNode xn in nodeList)
            {
                arrConfig.Add(xn.InnerXml.ToString());
            }

            return arrConfig;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

}