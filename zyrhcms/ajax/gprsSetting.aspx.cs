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
using System.Text.RegularExpressions;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.DAL;
using Zyrh.DBUtility;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_gprsSetting : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserCenter uc = new UserCenter();
    protected DomainIp dip = new DomainIp();
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceSettingManage dsm = new DeviceSettingManage(Public.CmsDBConnectionString);
    protected WebProtocolGprs wps = new WebProtocolGprs();
    protected int gprsServerConnectFailed = -200;
    protected string strGprsServerConnectFailed = string.Empty;
    protected string strLedServerConnectFailed = string.Empty;
    protected int serverConnectFailed = -200;

    protected string strAction = string.Empty;
    protected string strMethod = string.Empty;
    protected string strDevCode = string.Empty;
    protected string strSetting = string.Empty;
    protected string strParam = string.Empty;
    protected int settingCount = -1;
    protected bool isBatch = false;
    protected bool isComplete = false;
    protected string strIdList = string.Empty;
    protected string strField = string.Empty;
    protected string strValue = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 0;
    protected int status = -1;
    protected int memoryNo = -1;

    protected string[] arrLedDevType = { "50116", "501161" };

    //流水号替换字符串
    protected string strSerialNumber = "[SerialNumber]";

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
            this.strGprsServerConnectFailed = String.Format("{{result:{0}, msg:'GPRS服务器({1}:{2})连接失败，请检查服务器程序是否运行。',error:''}}",
                gprsServerConnectFailed, GprsSocketClient.strServerIp.Equals("127.0.0.1") ? Public.WebServerIp : GprsSocketClient.strServerIp, GprsSocketClient.iServerPort);

            this.strLedServerConnectFailed = String.Format("{{result:{0}, msg:'LED服务器({1}:{2})连接失败，请检查服务器程序是否运行。',error:''}}",
                serverConnectFailed, LedSocketClient.strServerIp.Equals("127.0.0.1") ? Public.WebServerIp : LedSocketClient.strServerIp, LedSocketClient.iServerPort);

            this.strDevCode = Public.RequestString("devCode");
            this.strSetting = Public.RequestString("setting");
            this.settingCount = Public.RequestString("settingCount", -1);
            this.isBatch = Public.RequestString("batch", 0) == 1;
            this.isComplete = Public.RequestString("complete", 0) == 1;

            switch (this.strAction)
            {
                case "getSettingLog":
                    this.strIdList = Public.RequestString("logIdList");
                    Response.Write(this.GetSettingLog(this.strIdList));
                    break;
                case "getDeviceConfig":             //读取设备配置信息
                    this.strField = Public.RequestString("field");
                    Response.Write(this.GetDeviceConfig(this.strDevCode, this.strAction, this.strField));
                    break;
                case "getTimingCapture":            //读取设备配置信息
                case "getTimingMonitor":
                case "getTimingOnOff":
                case "getLedScreenTime":
                case "getManagerPhone":
                case "getDeviceVersion":
                case "getSaveInterval":
                case "getSaveQuantity":
                case "getVolume":
                case "getPatrolMode":
                case "getSecurity":
                case "getVoltagePower":
                case "getAccInterval":
                case "getMileage":
                case "getLedScreenSize":
                    this.strField = Public.RequestString("field");
                    Response.Write(this.GetDeviceConfig(this.strDevCode, this.strAction, this.strField));
                    break;
                case "updateDeviceConfig":
                    this.strField = Public.RequestString("field");
                    this.strValue = Public.RequestString("value");
                    Response.Write(this.UpdateDeviceConfig(this.strDevCode, this.strField, this.strValue.Replace("'", "\'")));
                    break;
                case "readVersion":                 //读取设备版本
                case "readVersionGps":              //读取巡检点
                case "readClock":                   //读取设备时钟
                case "readTts":                     //读取TTS播放文字
                case "readManagerPhone":            //读取管理员号码
                case "readVolume":                  //读取输出音量
                case "readPatrolPoint":             //读取巡检点
                case "readLedScreenStatus":         //读取LED屏开关状态
                case "readLedScreenTime":           //读取LED屏开关屏时间
                    Response.Write(this.ReadDeviceInfo(this.strAction, this.strDevCode, this.strSetting));
                    break;
                case "setClock":                    //设备校时
                case "setPatrolMode":               //设置巡检模式（1-手动/0-自动）
                case "setSecurity":                 //设置防盗报警（1-设防/0-撤防）
                case "setVoltageCalibrate":         //设备电压校准
                case "setScmReset":                 //设备主机复位
                case "setScmInitial":               //恢复初始化
                case "setPtzRestart":               //单独重启云台
                case "setVolume":                   //设置输出音量
                case "set3GOnline":                 //设置3G上下线（1-上线/0-下线）
                case "set3GOpen":                   //设置3G开关（1-打开/0-关闭）
                case "setManagerPhone":             //设置管理员号码
                case "setTimingMonitor":            //设置定时监控
                case "setTimingCapture":            //设置定时抓拍（过时的方法）
                case "setTimingCaptureCustomize":   //设置定时抓拍
                case "setSaveInterval":             //设置保存间隔
                case "setSaveQuantity":             //设置保存条数
                case "deletePatrolTask":            //删除巡检点（巡检任务）
                case "remoteUpdate":                //设备远程升级
                case "setAccOpenInterval":          //设置ACC开启时的GPS报送间隔
                case "setAccCloseInterval":         //设置ACC关闭时的GPS报送间隔
                case "cancelAllAlarm":              //取消所有报警
                case "setMileage":                  //里程初始化
                case "clearMileage":                //清空里程
                case "setPresetName":               //设置预置点名称
                case "setAllPresetName":            //设置全部预置点名称
                case "clearAllPresetName":          //清除全部预置点文字
                case "setLedScreenStatus":          //设置LED屏开关状态
                case "setLedScreenTime":            //设置LED屏开关屏时间
                    Response.Write(this.SetDeviceInfo(this.strAction, this.strDevCode, this.strSetting, this.settingCount, this.isComplete, this.isBatch));
                    break;
                case "setTts":                      //设置TTS播放文字
                    this.strParam = Public.RequestString("param");
                    Response.Write(this.SetTtsContent(this.strAction, this.strDevCode, this.strSetting, this.strParam));
                    break;
                case "getTts":
                    this.memoryNo = Public.RequestString("memoryNo", -1);
                    this.status = Public.RequestString("status", -1);
                    this.pageIndex = Public.RequestString("pageIndex", 0);
                    this.pageSize = Public.RequestString("pageSize", 0);
                    Response.Write(this.GetTtsContent(this.strDevCode, this.memoryNo, this.status, this.pageIndex, this.pageSize));
                    break;
                case "deleteTts":
                    this.memoryNo = Public.RequestString("memoryNo", -1);
                    this.strParam = Public.RequestString("param", "-1");
                    UserInfo ui = uc.GetLoginUserInfo();
                    Response.Write(this.DeleteDeviceTtsMemory(this.strDevCode, this.strSetting, this.memoryNo, Convert.ToInt32(this.strParam), ui.UserId));
                    break;
                case "setPatrolPoint":              //设置巡检点
                    this.strParam = Public.RequestString("param");
                    Response.Write(this.SetDevicePatrolPoint(this.strAction, this.strDevCode, this.strSetting, this.strParam));
                    break;
                case "setLedScreenSize":
                    this.strParam = Public.RequestString("param");
                    Response.Write(this.SetLedScreenSize(this.strAction, this.strDevCode, this.strSetting, this.strParam));                    
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

    #region  读取设备信息
    public string ReadDeviceInfo(string strAction, string strDevCode, string strSetting)
    {
        try
        {
            WebProtocol wp = new WebProtocol();
            ProtocolData pd = new ProtocolData();
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            int logId = 0;
            StringBuilder strLogIds = new StringBuilder();
            string strLogIdList = string.Empty;

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
            ///协议类型
            int ptype = WebProtocol.TypeEnum.SingleToSingle.GetHashCode();
            ///协议模式
            int pmodel = WebProtocol.ModelEnum.NoSequence.GetHashCode();
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();

            //2014-09-09 修改
            #region  检测是GPRS 还是 LED，连接不同的服务器程序端口
            bool isLed = false;
            string strConnectStatus = string.Empty;
            foreach (string str in arrLedDevType)
            {
                if (str.Equals(strTypeCode))
                {
                    isLed = true;
                    break;
                }
            }
            strConnectStatus = isLed ? this.ConnectLedServer() : this.ConnectGprsServer();
            if (!strConnectStatus.Equals(string.Empty))
            {
                return strConnectStatus;
            }
            #endregion

            switch (strAction)
            {
                case "readVersion":
                    switch (strTypeCode)
                    {
                        case "50116":
                            strFunctionCode = "157";
                            strProtocolContent = String.Format("A&*{0}*?*{1}#", strFunctionCode, strSerialNumber);
                            break;
                        case "50780":
                            strFunctionCode = "156";
                            strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                            break;
                        default:
                            strFunctionCode = "159";
                            strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                            break;
                    }
                    break;
                case "readVersionGps":
                    strFunctionCode = "AP07";
                    strProtocolContent = String.Format("({0}{1})", strDevCode.PadLeft(12, '0'), strFunctionCode);
                    break;
                case "readClock":
                    strFunctionCode = "175";
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    break;
                case "readTts":
                    strFunctionCode = "180";
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    break;
                case "readManagerPhone":
                    strFunctionCode = "181";
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    break;
                case "readVolume":
                    switch (strTypeCode)
                    {
                        case "50116":
                            strFunctionCode = "162";
                            strProtocolContent = String.Format("A&*{0}*?*{1}#", strFunctionCode, strSerialNumber);
                            break;
                        default:
                            strFunctionCode = "182";
                            strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                            break;
                    }
                    break;
                case "readPatrolTask":
                    strFunctionCode = "162";
                    string[] arrNumber = strSetting.Split('_');
                    strProtocolContent = String.Format("A&*{0}*{1}*{2}*#", strFunctionCode, arrNumber[0].PadLeft(3, '0'), arrNumber[1].PadLeft(3, '0'));
                    break;
                case "readLedScreenStatus":
                    strFunctionCode = "152";
                    strProtocolContent = String.Format("A&*{0}*?*{1}#", strFunctionCode, strSerialNumber);
                    break;
                case "readLedScreenTime":
                    strFunctionCode = "154";
                    strProtocolContent = String.Format("A&*{0}*?*{1}#", strFunctionCode, strSerialNumber);
                    break;
            }

            logId = this.InsertDeviceSetting(di.DevId, strDevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType,
                strSetting, 30, ui.UserId, ipAddr, 0, 0);
            if (logId > 0)
            {
                strLogIdList = logId.ToString();

                switch (strTypeCode)
                {
                    case "50116":
                        strProtocolContent = strProtocolContent.Replace(strSerialNumber, strLogIdList);
                        //LED协议包头A&后面不跟*号 2014-09-09修改
                        strProtocolContent = strProtocolContent.Replace("A&*", "A&");
                        break;
                }
                wp = this.FillProtocolData(ptype, pmodel, strDevCode, logId.ToString(), strProtocolContent, string.Empty, 30, this.GetDateTime());

                string strXml = wps.BuildProtocol(wp);

                bool isSend = isLed ? LedSocketClient.SendProtocol(strXml) : GprsSocketClient.SendProtocol(strXml);

                ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + ipAddr);

                if (!isSend)
                {
                    return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败");
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

    #region 设置设备信息
    public string SetDeviceInfo(string strAction, string strDevCode, string strSetting, int settingCount, bool isComplete, bool isBatch)
    {
        try
        {
            WebProtocol wp = new WebProtocol();
            ProtocolData pd = new ProtocolData();
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            int parentId = 0;
            int logId = 0;
            StringBuilder strLogIds = new StringBuilder();
            string strLogIdList = string.Empty;

            string ipAddr = dip.GetIpAddress();
            UserInfo ui = uc.GetLoginUserInfo();
            DeviceInfo di = new DeviceInfo();
            List<DeviceInfo> lstDev = new List<DeviceInfo>();

            DataSet dsDevList = new DataSet();
            DataView dvDev = new DataView();
            string[] arrDevList ={strDevCode};
            string strFilter = string.Empty;
            int n = 0;  

            if (!isBatch)
            {
                di = dm.GetDeviceBaseInfo(strDevCode);
                if (di == null)
                {
                    return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
                }
            }
            else
            {
                DBResultInfo dbDevList = dm.GetDeviceBaseInfoList(strDevCode);
                dsDevList = dbDevList.dsResult;
                if (dsDevList == null || dsDevList.Tables[0] == null || dsDevList.Tables[0].Rows.Count == 0)
                {
                    return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
                }
                string[] delimite = {","};
                arrDevList = strDevCode.Split(delimite, StringSplitOptions.RemoveEmptyEntries);
            }
            
            string strTypeCode = di.TypeCode;
            string strFunctionCode = string.Empty;
            string strProtocolContent = string.Empty;
            string strProtocolParameter = string.Empty;
            ///协议类型
            int ptype = WebProtocol.TypeEnum.SingleToSingle.GetHashCode();
            ///协议模式
            int pmodel = WebProtocol.ModelEnum.NoSequence.GetHashCode();
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();

            bool isMulti = false;
            string[] arrLogId = new string[1];
            string[] arrFunctionCode = new string[1];
            string[] arrProtocolContent = new string[1];
            string[] arrSetting = new string[1];
            StringBuilder strDeviceConfig = new StringBuilder();
            string[] arrDeviceConfig = new string[2];

            switch (strAction)
            {
                case "setDeviceClock":
                    strFunctionCode = "152";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, DateTime.Now.ToString("yyMMddHHmmss"));
                    break;
                case "setPatrolMode":
                    #region  设置巡检模式（手动/自动）
                    strFunctionCode = "158";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);

                    if (isBatch)
                    {
                        isMulti = true;
                        int t = dsDevList.Tables[0].Rows.Count;
                        arrLogId = new string[t];

                        foreach (string str in arrDevList)
                        {
                            strFilter = String.Format("index_code='{0}'", str);
                            dvDev = new DataView(dsDevList.Tables[0], strFilter, "", DataViewRowState.CurrentRows);

                            if (dvDev.Count > 0)
                            {
                                di = dm.FillDeviceBaseInfo(dvDev[0]);

                                if (!di.TypeCode.Equals("50105") && !di.TypeCode.Equals("50107"))
                                {
                                    continue;
                                }
                                lstDev.Add(di);

                                n++;
                            }
                        }
                        settingCount = n;
                    }
                    else
                    {
                        strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                    }
                    #endregion
                    break;
                case "setSecurity":
                    strFunctionCode = "161";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                    break;
                case "setManagerPhone":
                    #region  设置管理员号码
                    strFunctionCode = "164";
                    if (strSetting.Equals("AD"))
                    {
                        strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                        arrDeviceConfig[0] = "manager_phone";
                        arrDeviceConfig[1] = "";
                    }
                    else
                    {
                        isMulti = true;
                        string[] arrTemp = strSetting.Split(',');
                        int t = arrTemp.Length;

                        if (!isComplete && (t < settingCount || settingCount < 0))
                        {
                            //先全部删除
                            strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, "AD");
                            logId = this.SendGprsProtocol(di, strFunctionCode, strProtocolContent, strProtocolParameter, settingType, "AD", 30, ui.UserId, ipAddr, 0, 0, true, ptype, pmodel);
                            if (logId > 0)
                            {
                                strLogIds.Append(",");
                                strLogIds.Append(logId);
                            }
                            else if (logId == gprsServerConnectFailed)
                            {
                                return this.strGprsServerConnectFailed;
                            }
                        }
                        arrLogId = new string[t];
                        arrFunctionCode = new string[t];
                        arrProtocolContent = new string[t];
                        arrSetting = new string[t];
                        int mc = 0;
                        for (int m = 0; m < t; m++)
                        {
                            string[] arr = arrTemp[m].Split('_');
                            if (arr.Length > 1)
                            {
                                arrFunctionCode[m] = "164";
                                arrProtocolContent[m] = String.Format("A&*{0}*{1}*#", strFunctionCode, arr[0] + arr[1]);
                                arrSetting[m] = arr[0] + arr[1];
                                if (arrTemp[m].IndexOf("D") < 0)
                                {
                                    strDeviceConfig.Append(mc++ > 0 ? "," : "");
                                    strDeviceConfig.Append(String.Format("{{num:{0},phone:\\\'{1}\\\'}}", arr[0], arr[1]));
                                }
                            }
                        }

                        arrDeviceConfig[0] = "manager_phone";
                        arrDeviceConfig[1] = t > 0 && strDeviceConfig.Length > 0 ? "[" + strDeviceConfig.ToString() + "]" : "";
                    }
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    #endregion
                    break;
                case "setTimingCaptureCustomize": //165定制
                    #region  设置定时抓拍
                    strFunctionCode = "165";
                    if (strSetting.Equals("AA"))
                    {
                        strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                        arrDeviceConfig[0] = "timing_capture";
                        arrDeviceConfig[1] = "";
                    }
                    else
                    {
                        isMulti = true;
                        string[] arrTemp = strSetting.Split(',');
                        int t = arrTemp.Length;

                        if (!isComplete && (t < settingCount || settingCount < 0))
                        {
                            //先全部删除
                            strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, "AA");
                            logId = this.SendGprsProtocol(di, strFunctionCode, strProtocolContent, strProtocolParameter, settingType, "AA", 30, ui.UserId, ipAddr, 0, 0, true, ptype, pmodel);
                            if (logId > 0)
                            {
                                strLogIds.Append(",");
                                strLogIds.Append(logId);
                            }
                            else if (logId == gprsServerConnectFailed)
                            {
                                return this.strGprsServerConnectFailed;
                            }
                        }
                        arrLogId = new string[t];
                        arrFunctionCode = new string[t];
                        arrProtocolContent = new string[t];
                        arrSetting = new string[t];
                        int mc = 0;
                        string strTimeFormat = "000000{0}00";
                        for (int m = 0; m < t; m++)
                        {
                            string[] arr = arrTemp[m].Split('_');
                            if (arr.Length > 1)
                            {
                                arrFunctionCode[m] = "165";
                                string strTime = (arr[1].Equals("A") ? arr[1] : String.Format(strTimeFormat, arr[1].Replace(":", "")));
                                arrProtocolContent[m] = String.Format("A&*{0}*{1}*#", strFunctionCode, arr[0] + strTime);
                                arrSetting[m] = arr[0] + arr[1];
                                if (arrTemp[m].IndexOf("A") < 0)
                                {
                                    strDeviceConfig.Append(mc++ > 0 ? "," : "");
                                    strDeviceConfig.Append(String.Format("{{num:{0},time:\\\'{1}\\\'}}", arr[0], arr[1]));
                                }
                            }
                        }

                        arrDeviceConfig[0] = "timing_capture";
                        arrDeviceConfig[1] = t > 0 && strDeviceConfig.Length > 0 ? "[" + strDeviceConfig.ToString() + "]" : "";
                    }
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    #endregion
                    break;
                case "setTimingCapture":
                    #region  设置定时抓拍
                    string[] arrFunctionCodeConfig = { "153", "154", "155", "156", "157" };
                    //定时抓拍比较特殊，是5个指令
                    arrFunctionCode = new string[arrFunctionCodeConfig.Length];
                    arrProtocolContent = new string[arrFunctionCodeConfig.Length];
                    arrSetting = new string[arrFunctionCodeConfig.Length];

                    if (strSetting.Equals("AA"))
                    {
                        for (int i = 0; i < arrFunctionCodeConfig.Length; i++)
                        {
                            arrFunctionCode[i] = arrFunctionCodeConfig[i];
                            string strTime = "000000HHMM00";
                            arrProtocolContent[i] = String.Format("A&*{0}*{1}*#", arrFunctionCode[i], (i + 1) + strTime);
                            arrSetting[i] = (i + 1) + strTime;
                        }
                        arrDeviceConfig[0] = "timing_capture";
                        arrDeviceConfig[1] = "";
                    }
                    else
                    {
                        isMulti = true;
                        string[] arrTemp = strSetting.Split(',');
                        int t = arrTemp.Length;

                        //强制完全设置模式
                        isComplete = true;

                        if (!isComplete && (t < settingCount || settingCount < 0))
                        {
                            /*
                            //先全部删除
                            strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, "AA");
                            logId = this.SendGprsProtocol(di, strFunctionCode, strProtocolContent, strProtocolParameter, settingType, "AA", 30, ui.UserId, ipAddr, 0, 0, true, ptype, pmodel);
                            if (logId > 0)
                            {
                                strLogIds.Append(",");
                                strLogIds.Append(logId);
                            }
                            else if (logId == gprsServerConnectFailed)
                            {
                                return this.strGprsServerConnectFailed;
                            }
                            */
                        }
                        arrLogId = new string[t];
                        arrFunctionCode = new string[t];
                        arrProtocolContent = new string[t];
                        arrSetting = new string[t];
                        int mc = 0;
                        string strTimeFormat = "000000{0}00";
                        for (int m = 0; m < t; m++)
                        {
                            string[] arr = arrTemp[m].Split('_');
                            if (arr.Length > 1)
                            {
                                arrFunctionCode[m] = arrFunctionCodeConfig[m];
                                string strTime = String.Format(strTimeFormat, arr[1].Replace(":", ""));
                                arrProtocolContent[m] = String.Format("A&*{0}*{1}*#", arrFunctionCode[m], arr[0] + strTime);
                                arrSetting[m] = arr[0] + arr[1];
                                if (arrTemp[m].IndexOf("HHMM") < 0)
                                {
                                    strDeviceConfig.Append(mc++ > 0 ? "," : "");
                                    strDeviceConfig.Append(String.Format("{{num:{0},time:\\\'{1}\\\'}}", arr[0], arr[1]));
                                }
                            }
                        }

                        arrDeviceConfig[0] = "timing_capture";
                        arrDeviceConfig[1] = t > 0 && strDeviceConfig.Length > 0 ? "[" + strDeviceConfig.ToString() + "]" : "";
                    }
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    #endregion
                    break;
                case "setVoltageCalibrate":
                    strFunctionCode = "172";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                    break;
                case "setScmReset":
                    strFunctionCode = "173";
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    break;
                case "setScmInitial":
                    strFunctionCode = "177";
                    strProtocolContent = String.Format("A&*{0}*{1}#", strFunctionCode, "5248B100");
                    break;
                case "setPtzRestart":
                    strFunctionCode = "178";
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    break;
                case "setVolume":
                    #region  设置音量大小
                    switch (strTypeCode)
                    {
                        case "50116":
                            //TODO:
                            strFunctionCode = "162";
                            strProtocolContent = String.Format("A&*{0}*{1}*{2}#", strFunctionCode, strSetting, strSerialNumber);
                            break;
                        default:
                            strFunctionCode = "179";
                            strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                            break;
                    }

                    arrDeviceConfig[0] = "volume";
                    arrDeviceConfig[1] = strSetting;
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    #endregion
                    break;
                case "set3GOnline":
                    strFunctionCode = "180";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                    break;
                case "set3GOpen":
                    strFunctionCode = "181";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                    break;
                case "setTimingMonitor":
                    #region  设置定时监控
                    strFunctionCode = "182";
                    if (strSetting.Equals("AHHmmHHmm1"))
                    {
                        strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                        arrDeviceConfig[0] = "timing_monitor";
                        arrDeviceConfig[1] = "";
                    }
                    else
                    {
                        isMulti = true;
                        string[] arrTemp = strSetting.Split(',');
                        int t = arrTemp.Length;
                        if (!isComplete && (t < settingCount || settingCount < 0))
                        {
                            //先全部删除
                            strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, "AHHmmHHmm1");
                            logId = this.SendGprsProtocol(di, strFunctionCode, strProtocolContent, strProtocolParameter, settingType, "AHHmmHHmm1", 30, ui.UserId, ipAddr, 0, 0, true, ptype, pmodel);
                            if (logId > 0)
                            {
                                strLogIds.Append(",");
                                strLogIds.Append(logId);
                            }
                            else if (logId == gprsServerConnectFailed)
                            {
                                return this.strGprsServerConnectFailed;
                            }
                        }

                        arrLogId = new string[t];
                        arrFunctionCode = new string[t];
                        arrProtocolContent = new string[t];
                        arrSetting = new string[t];

                        int mc = 0;
                        for (int m = 0; m < t; m++)
                        {
                            string[] arr = arrTemp[m].Split('_');
                            if (arr.Length > 1)
                            {
                                arrFunctionCode[m] = "182";
                                if (arrTemp[m].IndexOf("HHmmHHmm") < 0)
                                {
                                    arrProtocolContent[m] = String.Format("A&*{0}*{1}*#", strFunctionCode, arr[0] + arr[1].Replace(":", "") + arr[2].Replace(":", "") + arr[3]);
                                    arrSetting[m] = arr[0] + arr[1];
                                }
                                else
                                {
                                    arrProtocolContent[m] = String.Format("A&*{0}*{1}*#", strFunctionCode, arr[0] + arr[1]);
                                    arrSetting[m] = arr[0] + arr[1];
                                }
                                if (arrTemp[m].IndexOf("HHmmHHmm") < 0)
                                {
                                    strDeviceConfig.Append(mc++ > 0 ? "," : "");
                                    strDeviceConfig.Append(String.Format("{{num:{0},open:\\\'{1}\\\',close:\\\'{2}\\\',type:{3}}}", arr[0], arr[1], arr[2], arr[3]));
                                }
                            }
                        }

                        arrDeviceConfig[0] = "timing_monitor";
                        arrDeviceConfig[1] = t > 0 && strDeviceConfig.Length > 0 ? "[" + strDeviceConfig.ToString() + "]" : "";
                    }
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    #endregion
                    break;
                case "setSaveInterval":
                    strFunctionCode = "152";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);

                    arrDeviceConfig[0] = "save_interval";
                    arrDeviceConfig[1] = strSetting;
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    break;
                case "setSaveQuantity":
                    strFunctionCode = "153";
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);

                    arrDeviceConfig[0] = "save_quantity";
                    arrDeviceConfig[1] = strSetting;
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    break;
                case "setAccOpenInterval": //设置ACC开启状态下 发送数据间隔
                    strFunctionCode = "AR05";
                    strProtocolContent = String.Format("({0}{1}{2})", strDevCode.PadLeft(12, '0'), strFunctionCode, Convert.ToString(Convert.ToInt32(strSetting), 16).PadLeft(4, '0'));

                    arrDeviceConfig[0] = "acc_open_interval";
                    arrDeviceConfig[1] = strSetting;
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    break;
                case "setAccCloseInterval": //设置ACC关闭状态下 发送数据间隔
                    strFunctionCode = "AR06";
                    strProtocolContent = String.Format("({0}{1}{2})", strDevCode.PadLeft(12, '0'), strFunctionCode, Convert.ToString(Convert.ToInt32(strSetting), 16).PadLeft(4, '0'));

                    arrDeviceConfig[0] = "acc_close_interval";
                    arrDeviceConfig[1] = strSetting;
                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    break;
                case "cancelAllAlarm": //取消所有报警信息
                    strFunctionCode = "AV02";
                    strProtocolContent = String.Format("({0}{1})", strDevCode.PadLeft(12, '0'), strFunctionCode);
                    break;
                case "setMileage":
                    strFunctionCode = "AX03";
                    strProtocolContent = String.Format("({0}{1}{2})", strDevCode.PadLeft(12, '0'), strFunctionCode, Convert.ToString(Convert.ToInt32(strSetting), 16).PadLeft(8, '0'));
                    break;
                case "clearMileage":
                    strFunctionCode = "AX01";
                    strProtocolContent = String.Format("({0}{1})", strDevCode.PadLeft(12, '0'), strFunctionCode);
                    break;
                case "deletePatrolTask":
                    strFunctionCode = "160";
                    strSetting = strSetting.ToUpper().Equals("ALL") ? "ALL" : strSetting.PadLeft(3, '0');
                    strProtocolContent = String.Format("A&*{0}*{1}*#", strFunctionCode, strSetting);
                    break;
                case "setPresetName":
                    strFunctionCode = "160";
                    string[] arrPresetName = strSetting.Split(',');
                    strProtocolContent = String.Format("A&*{0}*{1}{2}#", strFunctionCode, arrPresetName[0].PadLeft(3, '0'), arrPresetName[1]);

                    this.UpdatePresetName(strDevCode, 1, Convert.ToInt32(arrPresetName[0]), arrPresetName[1], ui.UserId);
                    break;
                case "setAllPresetName":
                    #region  设备预置点名称
                    strFunctionCode = "160";
                    isMulti = true;
                    string[] arrPreset = strSetting.Split('|');
                    int pt = arrPreset.Length;

                    arrLogId = new string[pt];
                    arrFunctionCode = new string[pt];
                    arrProtocolContent = new string[pt];
                    arrSetting = new string[pt];

                    for (int m = 0; m < pt; m++)
                    {
                        string[] arr = arrPreset[m].Split(',');
                        if (arr.Length > 1)
                        {
                            arrProtocolContent[m] = String.Format("A&*{0}*{1}#", strFunctionCode, arr[0].PadLeft(3, '0') + arr[1]);
                            arrSetting[m] = arr[0] + arr[1];
                        }
                    }

                    this.UpdateAllPresetName(strDevCode, 1, strSetting, ui.UserId);
                    #endregion
                    break;
                case "clearAllPresetName":
                    strFunctionCode = "162";
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    break;
                case "setLedScreenStatus":
                    strFunctionCode = strSetting.Equals("1") ? "152" : "153";
                    strProtocolContent = String.Format("A&*{0}*{1}*{2}#", strFunctionCode, string.Empty, strSerialNumber);
                    break;
                case "setLedScreenTime":
                    #region  设置开关屏时间
                    strFunctionCode = "154";
                    StringBuilder strTimeOnOff = new StringBuilder();

                    string[] arrLedTime = strSetting.Split(',');

                    int mc1 = 0;
                    for (int m = 0, c = arrLedTime.Length; m < c; m++)
                    {
                        string[] arr = arrLedTime[m].Split('_');
                        if (arr.Length > 1)
                        {
                            strTimeOnOff.Append(m > 0 ? "," : "");

                            if (arrLedTime[m].IndexOf("HHmmHHmm") < 0)
                            {
                                strTimeOnOff.Append(arr[1].Replace(":", "") + arr[2].Replace(":", ""));
                            }
                            else
                            {
                                strTimeOnOff.Append(arr[1]);
                            }

                            if (arrLedTime[m].IndexOf("HHmmHHmm") < 0)
                            {
                                strDeviceConfig.Append(mc1++ > 0 ? "," : "");
                                strDeviceConfig.Append(String.Format("{{num:{0},open:\\\'{1}\\\',close:\\\'{2}\\\'}}", arr[0], arr[1], arr[2]));
                            }
                        }
                    }
                    strProtocolContent = String.Format("A&*{0}*{1}*{2}#", strFunctionCode, strTimeOnOff.ToString(), strSerialNumber);

                    arrDeviceConfig[0] = "timing_on_off";
                    arrDeviceConfig[1] = arrLedTime.Length > 0 && strDeviceConfig.Length > 0 ? "[" + strDeviceConfig.ToString() + "]" : "";

                    this.UpdateDeviceConfig(strDevCode, arrDeviceConfig[0], arrDeviceConfig[1]);
                    #endregion
                    break;
                case "remoteUpdate":
                    #region  远程升级
                    switch (strTypeCode)
                    {
                        case "50116":
                            strFunctionCode = "158";
                            break;
                        case "50106":
                            strFunctionCode = "177";
                            break;
                        case "50107":
                            strFunctionCode = "199";
                            break;
                        case "50780":
                            strFunctionCode = "180";
                            break;
                    }
                    strProtocolContent = String.Format("A&*{0}*#", strFunctionCode);
                    strSetting = Server.MapPath(strSetting).Replace("\\", "\\\\");
                    strProtocolParameter = strSetting;
                    #endregion
                    break;
            }

            #region  创建记录并发送TCP
            if (!isBatch)
            {
                #region  单个操作
                if (!isMulti)
                {
                    logId = this.SendGprsProtocol(di, strFunctionCode, strProtocolContent, strProtocolParameter, settingType, strSetting, 30, ui.UserId, ipAddr, 0, 0, true, ptype, pmodel);
                    if (logId > 0)
                    {
                        strLogIdList = logId.ToString();
                    }
                    else if (logId == -1)
                    {
                        return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败");
                    }
                    else if (logId == gprsServerConnectFailed)
                    {
                        return this.strGprsServerConnectFailed;
                    }
                }
                else
                {
                    //2014-09-09 修改
                    #region  检测是GPRS 还是 LED，连接不同的服务器程序端口
                    bool isLed = false;
                    string strConnectStatus = string.Empty;
                    foreach (string str in arrLedDevType)
                    {
                        if (str.Equals(di.TypeCode))
                        {
                            isLed = true;
                            break;
                        }
                    }
                    strConnectStatus = isLed ? this.ConnectLedServer() : this.ConnectGprsServer();
                    if (!strConnectStatus.Equals(string.Empty))
                    {
                        return strConnectStatus;
                    }
                    #endregion

                    #region  多指令
                    parentId = this.InsertDeviceSetting(0, strDevCode, di.TypeCode, strFunctionCode, "", settingType, strSetting, 30, ui.UserId, ipAddr, 0, arrSetting.Length);
                    for (int i = 0, c = arrLogId.Length; i < c; i++)
                    {
                        logId = this.SendGprsProtocol(di, arrFunctionCode[i], arrProtocolContent[i], strProtocolParameter, settingType, arrSetting[i], 30, ui.UserId, ipAddr, parentId, 0, false, ptype, pmodel);
                        if (logId > 0)
                        {
                            arrLogId[i] = logId.ToString();

                            strLogIds.Append(",");
                            strLogIds.Append(logId);
                        }
                        else if (logId == gprsServerConnectFailed)
                        {
                            return this.strGprsServerConnectFailed;
                        }
                    }
                    if (strLogIds.Length > 0)
                    {
                        ptype = WebProtocol.TypeEnum.SingleToMulti.GetHashCode();
                        strLogIdList = strLogIds.ToString().Substring(1);
                        wp = this.FillProtocolMultiData(ptype, pmodel, strDevCode, arrLogId, arrProtocolContent, strProtocolParameter, 30, this.GetDateTime());
                        
                        string strXml = wps.BuildProtocol(wp);

                        bool isSend = isLed ? LedSocketClient.SendProtocol(strXml) : GprsSocketClient.SendProtocol(strXml);

                        ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + ipAddr);

                        if (!isSend)
                        {
                            return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败");
                        }
                    }
                    #endregion
                }
                #endregion
            }
            else
            {
                //2014-09-09 修改
                #region  检测是GPRS 还是 LED，连接不同的服务器程序端口
                bool isLed = false;
                string strConnectStatus = string.Empty;
                foreach (string str in arrLedDevType)
                {
                    if (str.Equals(di.TypeCode))
                    {
                        isLed = true;
                        break;
                    }
                }
                strConnectStatus = isLed ? this.ConnectLedServer() : this.ConnectGprsServer();
                if (!strConnectStatus.Equals(string.Empty))
                {
                    return strConnectStatus;
                }
                #endregion

                /*
                 * 多对一的操作 LED设备必须和其他设备分开操作，因为LED服务器程序是单独的程序
                 * 
                 * */
                #region  多对一
                parentId = this.InsertDeviceSetting(0, string.Empty, string.Empty, strFunctionCode, strProtocolContent, settingType, strSetting, 30, ui.UserId, ipAddr, 0, arrSetting.Length);
                for (int i = 0, c = lstDev.Count; i < c; i++)
                {
                    DeviceInfo dev = lstDev[i];

                    if (0 == i)
                    {
                        //2014-09-09 修改
                        #region  检测是GPRS 还是 LED，连接不同的服务器程序端口
                        foreach (string str in arrLedDevType)
                        {
                            if (str.Equals(dev.TypeCode))
                            {
                                isLed = true;
                                break;
                            }
                        }
                        strConnectStatus = isLed ? this.ConnectLedServer() : this.ConnectGprsServer();
                        if (!strConnectStatus.Equals(string.Empty))
                        {
                            return strConnectStatus;
                        }
                        #endregion
                    }

                    logId = this.InsertDeviceSetting(dev.DevId, dev.DevCode, dev.TypeCode, strFunctionCode, strProtocolContent, settingType, strProtocolParameter, 30, ui.UserId, ipAddr, parentId, 0);

                    //logId = this.SendGprsProtocol(lstDev[i], arrFunctionCode[i], arrProtocolContent[i], strProtocolParameter, settingType, arrSetting[i], 30, ui.UserId, ipAddr, parentId, 0, false, ptype, pmodel);
                    if (logId > 0)
                    {
                        arrLogId[i] = logId.ToString();

                        strLogIds.Append(",");
                        strLogIds.Append(logId);
                    }
                    else if (logId == serverConnectFailed)
                    {
                        //return this.strGprsServerConnectFailed;
                    }
                }

                if (strLogIds.Length > 0)
                {
                    ptype = WebProtocol.TypeEnum.MultiToSingle.GetHashCode();
                    strLogIdList = strLogIds.ToString().Substring(1);
                    wp = this.FillProtocolMultiData(ptype, pmodel, strDevCode, arrLogId, strProtocolContent, strProtocolParameter, 30, this.GetDateTime());
                    
                    string strXml = wps.BuildProtocol(wp);

                    bool isSend = isLed ? LedSocketClient.SendProtocol(strXml) : GprsSocketClient.SendProtocol(strXml);

                    ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + ipAddr);

                    if (!isSend)
                    {
                        return String.Format("{{result:0,msg:'{0}',error:''}}", "WEB指令发送失败");
                    }
                }
                #endregion

            }            
            #endregion

            return String.Format("{{result:1,list:[{0}]}}", strLogIdList);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  设置TTS播放文字
    public string SetTtsContent(string strAction, string strDevCode, string strSetting, string strParam)
    {
        try
        {
            WebProtocol wp = new WebProtocol();
            ProtocolData pd = new ProtocolData();
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            int logId = 0;
            StringBuilder strLogIds = new StringBuilder();
            string strLogIdList = string.Empty;

            string ipAddr = dip.GetIpAddress();
            UserInfo ui = uc.GetLoginUserInfo();
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
            if (di == null)
            {
                return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
            }

            string strTypeCode = di.TypeCode;
            string strFunctionCode = "176";
            string strProtocolContent = string.Empty;
            string strProtocolParameter = string.Empty;
            ///协议类型
            int ptype = WebProtocol.TypeEnum.SingleToSingle.GetHashCode();
            ///协议模式
            int pmodel = WebProtocol.ModelEnum.NoSequence.GetHashCode();
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();
            
            int txtLen = this.CalculateStringLength(strSetting, true);
            string[] arrParam = strParam.Split('_');
            int playTimes = Convert.ToInt32(arrParam[0], 10);
            int memoryNo = Convert.ToInt32(arrParam[2], 10);
            string strStartTime = arrParam[1];
            string[] arrTime = strStartTime.Split(':');

            strSetting = Server.HtmlDecode(strSetting).Replace("*", " ").Replace("#", " ");

            strProtocolContent = String.Format("A&*{0}*-{1}{2}{3}{4}{5}{6}#", strFunctionCode, playTimes.ToString().PadLeft(2, '0'),
                memoryNo, arrTime[0], arrTime[1], txtLen.ToString().PadLeft(4, '0'), strSetting);

            if (strSetting.ToUpper().Equals("ALL"))
            {
                this.DeleteTtsContent(di.DevCode, -1, -1, ui.UserId);
                strSetting = strSetting.ToUpper();
            }
            else if (strSetting.ToUpper().Equals("ADL"))
            {
                this.DeleteTtsContent(di.DevCode, memoryNo, -1, ui.UserId);
                strSetting = strSetting.ToUpper();
            }
            else
            {
                string strStartDate = DateTime.Now.ToString("yyyy-MM-dd");
                string strEndDate = "2099-12-31";
                this.AddTtsContent(di.DevId, strDevCode, memoryNo, strSetting, strStartDate, strEndDate, strStartTime, playTimes, ui.UserId);

                int nowId = DBConnection.GetMaxId(this.DBConnectionString, "device_memory", "id");
                //覆盖
                this.CovertTtsContent(di.DevCode, memoryNo, nowId, ui.UserId);
            }
            try
            {
                GprsSocketClient.ConnectServer();
            }
            catch (Exception e)
            {
                return this.strGprsServerConnectFailed;
            }
            logId = this.InsertDeviceSetting(di.DevId, strDevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType,
                strSetting, 30, ui.UserId, ipAddr, 0, 0);

            if (logId > 0)
            {
                strLogIdList = logId.ToString();

                wp = this.FillProtocolData(ptype, pmodel, strDevCode, logId.ToString(), Server.HtmlDecode(strProtocolContent), strProtocolParameter, 30, this.GetDateTime());

                string strXml = wps.BuildProtocol(wp);

                GprsSocketClient.SendProtocol(strXml);

                ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + ipAddr);
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

    #region  设置设备巡检点
    public string SetDevicePatrolPoint(string strAction, string strDevCode, string strSetting, string strParam)
    {
        try
        {
            string strLogIdList = string.Empty;


            return String.Format("{{result:1,list:[{0}]}}", strLogIdList);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  发送GPRS指令
    public int SendGprsProtocol(DeviceInfo di, string strFunctionCode, string strProtocolContent, string strProtocolParameter, int settingType, string strSetting,
        int timeout, int userId, string strIpAddr, int parentId, int childQuantity, bool isSend, int ptype, int pmodel)
    {
        try
        {
            //2014-09-09 修改
            #region  检测是GPRS 还是 LED，连接不同的服务器程序端口
            bool isLed = false;
            string strConnectStatus = string.Empty;
            foreach (string str in arrLedDevType)
            {
                if (str.Equals(di.TypeCode))
                {
                    isLed = true;
                    break;
                }
            }
            strConnectStatus = isLed ? this.ConnectLedServer() : this.ConnectGprsServer();
            if (!strConnectStatus.Equals(string.Empty))
            {
                return serverConnectFailed;
            }
            #endregion

            int logId = this.InsertDeviceSetting(di.DevId, di.DevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType,
                strSetting, timeout, userId, strIpAddr, parentId, childQuantity);
            if (logId > 0)
            {
                if (isSend)
                {
                    WebProtocol wp = new WebProtocol();
                    ProtocolData pd = new ProtocolData();

                    switch (di.TypeCode)
                    {
                        case "50116":
                            strProtocolContent = strProtocolContent.Replace(strSerialNumber, logId.ToString());
                            //LED协议包头A&后面不跟*号 2014-09-09修改
                            strProtocolContent = strProtocolContent.Replace("A&*", "A&");
                            break;
                    }
                    wp = this.FillProtocolData(ptype, pmodel, di.DevCode, logId.ToString(), strProtocolContent, strProtocolParameter, timeout, this.GetDateTime());

                    string strXml = wps.BuildProtocol(wp);

                    bool isSuccess = isLed ? LedSocketClient.SendProtocol(strXml) : GprsSocketClient.SendProtocol(strXml);

                    ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + strIpAddr);
                    if (!isSuccess)
                    {
                        return -1;
                    }
                }
                return logId;
            }
            return 0;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion
    

    #region  获得设备配置/状态信息
    public string GetDeviceConfig(string strDevCode, string strAction, string strField)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DBResultInfo dbResult = new DBResultInfo();
            if (!strField.Equals(string.Empty))
            {
                switch (strField)
                {
                    case "timing_capture":      //定时抓拍
                    case "timing_monitor":      //定时监控
                    case "timing_on_off":      //定时监控
                    case "manager_phone":       //管理员号码
                    case "device_version":      //设备版本
                    case "save_interval":       //保存间隔
                    case "save_quantity":       //保存条数
                    case "volume":              //输出音量（喇叭音量）
                        dbResult = new DeviceConfigManage(this.DBConnectionString).GetDeviceConfigInfoByField(strDevCode, strField);
                        break;
                    case "patrol_mode":         //巡检模式：手动/自动
                    case "security":            //防盗报警：设防/撤防
                    case "voltage_power":       //电压电量
                    case "mileage":             //里程
                        dbResult = new DeviceStatusManage(this.DBConnectionString).GetDeviceStatusInfoByField(strDevCode, strField);
                        break;
                }
            }
            else
            {
                #region  读取指定的设备信息字段
                switch (strAction)
                {
                    case "getTimingCapture":
                    case "getTimingMonitor":
                    case "getTimingOnOff":
                    case "getLedScreenTime":
                    case "getManagerPhone":
                    case "getDeviceVersion":
                    case "getSaveInterval":
                    case "getSaveQuantity":
                    case "getVolume":
                    case "getAccInterval":
                        switch (strAction)
                        {
                            case "getTimingCapture":
                                strField = "timing_capture";
                                break;
                            case "getTimingMonitor":
                                strField = "timing_monitor";
                                break;
                            case "getTimingOnOff":
                            case "getLedScreenTime":
                                strField = "timing_on_off";
                                break;
                            case "getManagerPhone":
                                strField = "manager_phone";
                                break;
                            case "getDeviceVersion":
                                strField = "device_version";
                                break;
                            case "getSaveInterval":
                                strField = "save_interval";
                                break;
                            case "getSaveQuantity":
                                strField = "save_quantity";
                                break;
                            case "getVolume":
                                strField = "volume";
                                break;
                            case "getAccInterval":
                                strField = "acc_open_interval,acc_close_interval";
                                break;
                        }
                        dbResult = new DeviceConfigManage(this.DBConnectionString).GetDeviceConfigInfoByField(strDevCode, strField);
                        break;
                    case "getLedScreenSize":
                        strField = "screen_rows,screen_cols,screen_fontsize,data_polarity,oe_polarity,color_type,scan_type";
                        dbResult = new DeviceConfigManage(this.DBConnectionString).GetDeviceConfigInfoByField(strDevCode, strField);
                        break;
                    case "getPatrolMode":
                    case "getSecurity":
                    case "getVoltagePower":
                    case "getMileage":
                        switch (strAction)
                        {
                            case "getPatrolMode":
                                strField = "patrol_mode";
                                break;
                            case "getSecurity":
                                strField = "security";
                                break;
                            case "getVoltagePower":
                                strField = "voltage_power";
                                break;
                            case "getMileage":
                                strField = "mileage";
                                break;
                        }
                        dbResult = new DeviceStatusManage(this.DBConnectionString).GetDeviceStatusInfoByField(strDevCode, strField);
                        break;
                }
                #endregion
            }
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append("{result:1");
                DataRow dr = ds.Tables[0].Rows[0];
                StringBuilder strContent = new StringBuilder();
                strContent.Append(dr[0].ToString().Replace("\\", "\\\\").Replace("'", "\\\'").Replace("\r\n", "<br />"));
                int c = strField.Split(',').Length;
                for (int i = 1; i < c; i++)
                {
                    strContent.Append(",");
                    strContent.Append(dr[i].ToString().Replace("\\", "\\\\").Replace("'", "\\\'").Replace("\r\n", "<br />"));
                }
                strResult.Append(String.Format(",content:'{0}'", strContent.ToString()));
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
    public string UpdateDeviceConfig(string strDevCodeList, string strField, string strSetting)
    {
        try
        {
            bool result = new DeviceConfigManage(this.DBConnectionString).UpdateDeviceConfig(strDevCodeList, strField, strSetting);

            return String.Format("{{result:{0},field:'{1}',content:'{2}'}}", result ? 1 : 0, strField, strSetting.Replace("\r\n", "<br />"));
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  更新设备配置信息
    public string UpdateDeviceConfig(string strDevCodeList, string[] arrField, string[] arrSetting)
    {
        try
        {
            bool result = new DeviceConfigManage(this.DBConnectionString).UpdateDeviceConfig(strDevCodeList, arrField, arrSetting);

            return String.Format("{{result:{0}}}", result ? 1 : 0);
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
            DBResultInfo dbResult = dsm.GetDeviceSettingLog(strLogIds);
            DataSet dsLog = dbResult.dsResult;
            if (dsLog != null && dsLog.Tables[0] != null && dsLog.Tables[0].Rows.Count > 0)
            {
                StringBuilder arrLog = new StringBuilder();
                foreach (DataRow dr in dsLog.Tables[0].Rows)
                {
                    DeviceSettingInfo dsi = dsm.FillDeviceSettingInfo(dr);
                    arrLog.Append(",{");
                    arrLog.Append(String.Format("id:{0}", dsi.Id));
                    arrLog.Append(String.Format(",devId:{0}", dsi.DevId));
                    arrLog.Append(String.Format(",devIndexCode:'{0}'", dsi.DevCode));
                    arrLog.Append(String.Format(",devName:'{0}'", dsi.DevName));
                    arrLog.Append(String.Format(",devTypeCode:'{0}'", dsi.TypeCode));
                    arrLog.Append(String.Format(",downStatus:{0}", dsi.DownStatus));
                    arrLog.Append(String.Format(",downTime:'{0}'", dsi.DownTime));
                    arrLog.Append(String.Format(",functionCode:'{0}'", dsi.FunctionCode));
                    arrLog.Append(String.Format(",protocolContent:'{0}'", dsi.ProtocolContent.Replace("'", "\\\'").Replace("\r\n", "<br />")));
                    arrLog.Append(String.Format(",responseStatus:{0}", dsi.ResponseStatus));
                    arrLog.Append(String.Format(",responseContent:'{0}'", dsi.ResponseContent));
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
    public int InsertDeviceSetting(int devId, string strDevCode, string strTypeCode, string strFunctionCode, string strProtocolContent,
        int settingType, string strParameter, int timeout, int operatorId, string operatorIp, int parentId, int childQuantity)
    {
        try
        {
            DeviceSettingInfo dsi = new DeviceSettingInfo();

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

            int logId = dsm.InsertDeviceSetting(dsi);

            return logId;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion


    #region  添加TTS播放文字
    public void AddTtsContent(int devId, string strDevCode, int memoryNo, string strContent, string strStartDate, string strEndDate, string strStartTime, 
        int playTimes, int operatorId)
    {
        try
        {
            DeviceMemoryInfo dmi = new DeviceMemoryInfo();
            dmi.DevId = devId;
            dmi.DevCode = strDevCode;
            dmi.MemoryNumber = memoryNo;
            dmi.MemoryType = "tts";
            dmi.MemoryContent = strContent.Replace("'", "\'");
            dmi.StartDate = strStartDate;
            dmi.EndDate = strEndDate;
            dmi.StartTime = strStartTime;
            dmi.PlayTimes = playTimes;
            dmi.Status = 0;
            dmi.OperatorId = operatorId;
            dmi.IsSync = 1;
            dmi.SyncTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            dmi.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            DeviceMemoryManage dmm = new DeviceMemoryManage(this.DBConnectionString);
            dmm.InsertDeviceMemory(dmm.BuildInsertDeviceMemorySql(dmi));
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  获得TTS播放文字
    public string GetTtsContent(string strDevCode, int memoryNo, int status, int pageIndex, int pageSize)
    {
        try
        {
            DeviceMemoryManage dmm = new DeviceMemoryManage(this.DBConnectionString);
            //更新已超时的第9段位 “即时播放”内容的状态为“已过期”，超时时间设置为180秒
            dmm.UpdateOverTimeDeviceMemory(strDevCode, 9, 5*60, 0);

            DBResultInfo dbResult = dmm.GetDeviceMemory(strDevCode, string.Empty, DeviceMemoryType.Tts.ToString().ToLower(), status, pageIndex, pageSize);
            DataSet ds = dbResult.dsResult;

            StringBuilder strResult = new StringBuilder();
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(String.Format(",now:'{0}'", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceMemoryInfo dmi = dmm.FillDeviceMemoryInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},memoryNo:{1},devId:{2},devCode:'{3}',memoryType:'{4}',memoryContent:'{5}'",
                        dmi.Id, dmi.MemoryNumber, dmi.DevId, dmi.DevCode, dmi.MemoryType, dmi.MemoryContent.Replace("'", "\'").Replace("\r\n", "<br />")));
                    strResult.Append(String.Format(",fileType:'{0}',filePath:'{1}',startDate:'{2}',endDate:'{3}',startTime:'{4}',playTimes:{5}",
                        dmi.FileType, dmi.FilePath, dmi.StartDate,dmi.EndDate, dmi.StartTime, dmi.PlayTimes));
                    strResult.Append(String.Format(",status:{0},deleted:{1},operatorId:{2},isSync:{3},syncTime:'{4}',createTime:'{5}',updateTime:'{6}'",
                        dmi.Status, dmi.Deleted, dmi.OperatorId, dmi.IsSync, dmi.SyncTime, dmi.CreateTime, dmi.UpdateTime));                    
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  覆盖TTS播放文字
    public int CovertTtsContent(string strDevCode, int memoryNo, int nowId, int operatorId)
    {
        try
        {
            DeviceMemoryManage dmm = new DeviceMemoryManage(this.DBConnectionString);
            DBResultInfo dbResult = dmm.CovertDeviceMemory(strDevCode, memoryNo, nowId, operatorId);
            return dbResult.iResult;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  删除TTS播放文字
    public int DeleteTtsContent(string strDevCode, int memoryNo, int id, int operatorId)
    {
        try
        {
            DeviceMemoryManage dmm = new DeviceMemoryManage(this.DBConnectionString);
            DBResultInfo dbResult = dmm.DeleteDeviceMemory(strDevCode, memoryNo, id, operatorId);
            return dbResult.iResult;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  删除TTS播放文字
    public string DeleteDeviceTtsMemory(string strDevCode, string strSetting, int memoryNo, int id, int operatorId)
    {
        try
        {
            WebProtocol wp = new WebProtocol();
            ProtocolData pd = new ProtocolData();
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            int logId = 0;
            StringBuilder strLogIds = new StringBuilder();
            string strLogIdList = string.Empty;

            string ipAddr = dip.GetIpAddress();
            UserInfo ui = uc.GetLoginUserInfo();
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
            if (di == null)
            {
                return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
            }

            ///协议类型
            int ptype = WebProtocol.TypeEnum.SingleToSingle.GetHashCode();
            ///协议模式
            int pmodel = WebProtocol.ModelEnum.NoSequence.GetHashCode();
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();
            string strFunctionCode = "176";
            string strProtocolContent = String.Format("A&*{0}*-{1}{2}{3}{4}{5}{6}#", strFunctionCode, "01", memoryNo < 0 ? 9 : memoryNo, "00", "00", "0003", strSetting.ToUpper());
            string strProtocolParameter = string.Empty;
            try
            {
                GprsSocketClient.ConnectServer();
            }
            catch (Exception e)
            {
                return this.strGprsServerConnectFailed;
            }
            logId = this.InsertDeviceSetting(di.DevId, strDevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType,
                strSetting.ToUpper(), 30, ui.UserId, ipAddr, 0, 0);

            if (logId > 0)
            {
                strLogIdList = logId.ToString();

                wp = this.FillProtocolData(ptype, pmodel, strDevCode, logId.ToString(), strProtocolContent, strProtocolParameter, 30, this.GetDateTime());

                string strXml = wps.BuildProtocol(wp);

                GprsSocketClient.SendProtocol(strXml);

                ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + ipAddr);
            }

            int result = this.DeleteTtsContent(strDevCode, memoryNo, id, operatorId);

            return String.Format("{{result:1,list:[{0}]}}", strLogIdList);
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  更新预置点名称
    public bool UpdatePresetName(string strDevCode, int channelNo, int presetNo, string strPresetName, int operatorId)
    {
        try
        {
            DeviceCameraManage dcm = new DeviceCameraManage(Public.CmsDBConnectionString);
            int cameraId = dcm.GetDeviceCameraId(strDevCode, channelNo);

            DevicePresetInfo info = new DevicePresetInfo();
            info.CameraId = cameraId;
            info.PresetNo = presetNo;
            info.PresetName = strPresetName;
            info.OperatorId = operatorId;
            info.UpdateTime = Public.GetDateTime();

            DevicePresetManage dpm = new DevicePresetManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = dpm.UpdateDevicePreset(info);

            return dbResult.iResult > 0;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  更新全部预置点名称
    public bool UpdateAllPresetName(string strDevCode, int channelNo, string strSetting, int operatorId)
    {
        try
        {
            DeviceCameraManage dcm = new DeviceCameraManage(Public.CmsDBConnectionString);
            int cameraId = dcm.GetDeviceCameraId(strDevCode, channelNo);

            string[] arrSetting = strSetting.Split('|');
            StringBuilder strSql = new StringBuilder();

            DevicePresetManage dpm = new DevicePresetManage(Public.CmsDBConnectionString);
            foreach (string str in arrSetting)
            {
                string[] arrTemp = str.Split(',');
                DevicePresetInfo info = new DevicePresetInfo();
                info.CameraId = cameraId;
                info.PresetNo = Convert.ToInt32(arrTemp[0]);
                info.PresetName = arrTemp[1];
                info.OperatorId = operatorId;
                info.UpdateTime = Public.GetDateTime();

                strSql.Append(dpm.BuildUpdateDevicePresetSql(info));
            }

            DBResultInfo dbResult = dpm.UpdateDevicePreset(strSql.ToString());

            return dbResult.iResult > 0;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion



    #region  设置LED屏大小
    public string SetLedScreenSize(string strAction, string strDevCode, string strSetting, string strParam)
    {
        try
        {

            this.strLedServerConnectFailed = String.Format("{{result:{0}, msg:'LED服务器({1}:{2})连接失败，请检查服务器程序是否运行。',error:''}}",
                serverConnectFailed, LedSocketClient.strServerIp.Equals("127.0.0.1") ? Public.WebServerIp : LedSocketClient.strServerIp, LedSocketClient.iServerPort);

            WebProtocol wp = new WebProtocol();
            ProtocolData pd = new ProtocolData();
            DeviceSettingInfo dsi = new DeviceSettingInfo();
            int logId = 0;
            StringBuilder strLogIds = new StringBuilder();
            string strLogIdList = string.Empty;

            string ipAddr = dip.GetIpAddress();
            UserInfo ui = uc.GetLoginUserInfo();
            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
            if (di == null)
            {
                return String.Format("{{result:0,list:[],msg:'设备不存在'}}");
            }

            string strTypeCode = di.TypeCode;
            string strFunctionCode = "161";
            string strProtocolContent = string.Empty;
            string strProtocolParameter = string.Empty;
            ///协议类型
            int ptype = WebProtocol.TypeEnum.SingleToSingle.GetHashCode();
            ///协议模式
            int pmodel = WebProtocol.ModelEnum.NoSequence.GetHashCode();
            ///设置类型
            int settingType = WebProtocol.SettingType.NormalSetting.GetHashCode();

            string[] arrScreen = strSetting.Split('|');
            string strScreenSize = String.Format("{0},{1},{2},{3},{4}{5}",
                arrScreen[0], arrScreen[1], arrScreen[2], arrScreen[3], arrScreen[4].PadLeft(2, '0'), arrScreen[5]
                );

            string[] arrField = { "screen_rows", "screen_cols", "data_polarity", "oe_polarity", "scan_type", "color_type", "screen_fontsize" };
            string[] arrContent = { arrScreen[0], arrScreen[1], arrScreen[2], arrScreen[3], arrScreen[4], arrScreen[5], arrScreen[6] };

            this.UpdateDeviceConfig(strDevCode, arrField, arrContent);

            if (arrScreen.Length >= 6)
            {
                //strProtocolContent = String.Format("A&*{0}*{1}*{2}#", strFunctionCode, strScreenSize, strSerialNumber);
                //LED协议包头A&后面不跟*号 2014-09-09修改
                strProtocolContent = String.Format("A&{0}*{1}*{2}#", strFunctionCode, strScreenSize, strSerialNumber);
            }

            try
            {
                LedSocketClient.ConnectServer();
            }
            catch (Exception e)
            {
                return this.strLedServerConnectFailed;
            }
            logId = this.InsertDeviceSetting(di.DevId, strDevCode, di.TypeCode, strFunctionCode, strProtocolContent, settingType,
                strSetting, 30, ui.UserId, ipAddr, 0, 0);

            if (logId > 0)
            {
                strLogIdList = logId.ToString();

                strProtocolContent = strProtocolContent.Replace(strSerialNumber, logId.ToString());

                wp = this.FillProtocolData(ptype, pmodel, strDevCode, logId.ToString(), Server.HtmlDecode(strProtocolContent), strProtocolParameter, 30, this.GetDateTime());

                string strXml = wps.BuildProtocol(wp);

                LedSocketClient.SendProtocol(strXml);

                ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strXml + "From:" + ipAddr);
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

    #region  连接服务器
    public string ConnectLedServer()
    {
        try
        {
            LedSocketClient.ConnectServer();
            return string.Empty;
        }
        catch (Exception e)
        {
            return this.strLedServerConnectFailed;
        }
    }

    public string ConnectGprsServer()
    {
        try
        {
            GprsSocketClient.ConnectServer();
            return string.Empty;
        }
        catch (Exception e)
        {
            return this.strGprsServerConnectFailed;
        }
    }
    #endregion


    #region  填充协议数据
    public WebProtocol FillProtocolData(int type, int model, string strDevCode, string strLogId, string strProtocolContent, 
        string strProtocolParameter, int timeout, string strSendTime)
    {
        try
        {
            WebProtocol wp = new WebProtocol();

            wp.Type = type;
            wp.Model = model;
            wp.DevCode = strDevCode;
            wp.ProtocolDataList.Add(new ProtocolData(strLogId, strProtocolContent));
            wp.ProtocolParameter = strProtocolParameter;
            wp.Timeout = timeout;
            wp.SendTime = strSendTime;

            return wp;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  填充协议数据(SingleToMulti)
    public WebProtocol FillProtocolMultiData(int type, int model, string strDevCode, string[] arrLogId, string[] arrProtocolContent, 
        string strProtocolParameter, int timeout, string strSendTime)
    {
        try
        {
            WebProtocol wp = new WebProtocol();

            wp.Type = type;
            wp.Model = model;
            wp.DevCode = strDevCode;
            if (arrLogId.Length > 1 && arrProtocolContent.Length == 1)
            {
                StringBuilder strLogIdList = new StringBuilder();
                int n = 0;
                foreach (string str in arrLogId)
                {
                    if (n++ > 0)
                    {
                        strLogIdList.Append(",");
                    }
                    strLogIdList.Append(str);
                }
                wp.ProtocolDataList.Add(new ProtocolData(strLogIdList.ToString(), arrProtocolContent[0]));
            }
            else
            {
                for (int i = 0, c = arrProtocolContent.Length; i < c; i++)
                {
                    wp.ProtocolDataList.Add(new ProtocolData(arrLogId[i], arrProtocolContent[i]));
                }
            }
            wp.ProtocolParameter = strProtocolParameter;
            wp.Timeout = timeout;
            wp.SendTime = strSendTime;

            return wp;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  填充协议数据(MultiToSingle)
    public WebProtocol FillProtocolMultiData(int type, int model, string strDevCode, string[] arrLogId, string strProtocolContent,
        string strProtocolParameter, int timeout, string strSendTime)
    {
        try
        {
            WebProtocol wp = new WebProtocol();

            wp.Type = type;
            wp.Model = model;
            wp.DevCode = strDevCode;

            StringBuilder strLogIdList = new StringBuilder();
            int n = 0;
            foreach (string str in arrLogId)
            {
                if (n++ > 0)
                {
                    strLogIdList.Append(",");
                }
                strLogIdList.Append(str);
            }

            wp.ProtocolDataList.Add(new ProtocolData(strLogIdList.ToString(), strProtocolContent));
            wp.ProtocolParameter = strProtocolParameter;
            wp.Timeout = timeout;
            wp.SendTime = strSendTime;

            return wp;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得当前日期时间
    public string GetDateTime()
    {
        return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    }
    #endregion

    #region  计算字符串长度(中文按两个字符计算)
    /// <summary>
    /// 计算字符串长度(中文按两个字符计算)
    /// </summary>
    /// <param name="strContent">字符串内容</param>
    /// <param name="isFiltrate">是否过滤HTML代码</param>
    /// <returns></returns>
    public int CalculateStringLength(string strContent, bool isFiltrate)
    {
        if (isFiltrate)
        {
            strContent = Regex.Replace(strContent, "<[^>]*>|&nbsp;", "");
        }
        int len = 0;
        char[] chars = strContent.ToCharArray();
        foreach (char c in chars)
        {
            len += Convert.ToInt32(c) > 255 ? 2 : 1;
        }
        return len;
    }
    #endregion

}