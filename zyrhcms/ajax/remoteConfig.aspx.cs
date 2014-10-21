using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Xml;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_remoteConfig : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected string strDevCode = string.Empty;
    protected string strField = string.Empty;
    protected string strParam = string.Empty;
    protected int devId = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        this.strAction = Public.RequestString("action", string.Empty);
        this.strDevCode = Public.RequestString("devCode", string.Empty);
        this.strField = Public.RequestString("field", string.Empty);
        this.strParam = Public.RequestString("param", string.Empty);
        
        switch (this.strAction)
        {
            case "getDevInfo":
                this.devId = Public.GetRequest("devId", 0);
                Response.Write(this.GetDeviceInfo(this.devId, this.strDevCode));
                break;
            case "getDeviceRemoteConfig":
                Response.Write(this.GetDeviceRemoteConfig(this.strDevCode, this.strAction, this.strField, this.strParam));
                break;
            case "getDeviceInfo":
            case "getDeviceVersion":
            case "getRS232":
            case "getRS485":
            case "getOsdSetting":
            case "getVideoSetting":
            case "getNetworkSetting":
            case "getDeviceRecordPlan":
            case "getDeviceCapturePlan":
            case "getStoreRecordPlan":
                Response.Write(this.GetDeviceRemoteConfig(this.strDevCode, this.strAction, this.strField, this.strParam));
                break;
            case "parseXmlProtocol":
                string strXml = Public.RequestString("xml", string.Empty);
                Response.Write(this.ParseDeviceRemoteConfig(strXml, this.strField));
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }
    }

    #region  获得设备信息
    protected string GetDeviceInfo(int devId, string strDevCode)
    {
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DeviceCameraManage cm = new DeviceCameraManage(this.DBConnectionString);

            strDev.Append("{result:1");
            strDev.Append(",dev:{");

            DBResultInfo dbResult = dm.GetDeviceInfo(devId, strDevCode);

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                DeviceInfo di = dm.FillDeviceInfo(dr);

                strDev.Append(String.Format("devId:'{0}',devName:'{1}',devCode:'{2}'", di.DevId, di.DevName, di.DevCode));
                strDev.Append(String.Format(",userName:'{0}',userPwd:'{1}'", di.UserName, di.UserPwd));

                strDev.Append(String.Format(",unitId:'{0}',unitName:'{1}',typeCode:'{2}',networkAddr:'{3}',networkPort:'{4}',cameraChannelCount:'{5}'",
                    di.UnitId, di.UnitName, di.TypeCode, di.NetworkAddr, di.NetworkPort, di.CameraChannelCount));
                //strDev.Append(String.Format(",serverIp:'{0}',serverPort:'{1}'", di.devPagServer.ServerIp, di.devPagServer.ServerPort));
            }
            strDev.Append("}");
            strDev.Append(",camera:[");

            dbResult = cm.GetDeviceCameraInfo(devId, strDevCode, -1);
            DataSet dsCamera = dbResult.dsResult;
            if (dsCamera != null && dsCamera.Tables[0] != null && dsCamera.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in dsCamera.Tables[0].Rows)
                {
                    DeviceCameraInfo dci = cm.FillDeviceCamera(dr);

                    strDev.Append(n > 0 ? "," : "");
                    strDev.Append("{");
                    strDev.Append(String.Format("cameraId:'{0}',cameraName:'{1}',channelNo:'{2}',devId:'{3}',connectType:'{4}',streamType:'{5}'", 
                        dci.CameraId, dci.CameraName, dci.ChannelNo, dci.DeviceId, dci.ConnectType, dci.StreamType));
                    strDev.Append("}");
                    n++;
                }
            }
            strDev.Append("]");
            strDev.Append("}");
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            //return String.Format("{{result:-1,dev:{{}},camera:[],config:{{}},error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));

            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备远程配置信息
    public string GetDeviceRemoteConfig(string strDevCode, string strAction, string strField, string strParam)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DBResultInfo dbResult = new DBResultInfo();
            if (!strField.Equals(string.Empty))
            {
                switch (strField)
                {
                    case "device_info":             //设备信息
                    case "device_version":          //设备版本
                    case "rs232_setting":           //rs232
                    case "rs485_setting":           //rs485
                    case "osd_setting":             //显示设置
                    case "video_setting":           //视频设置
                    case "network_setting":         //视频设置
                    case "device_record_plan":      //设备录像计划
                    case "device_capture_plan":     //设备抓拍计划
                    case "store_record_plan":       //中心录像计划
                        dbResult = new DeviceRemoteConfigManage(this.DBConnectionString).GetRemoteConfigInfoByField(strDevCode, strField);
                        break;
                }
            }
            else
            {
                switch (strAction)
                {
                    case "getDeviceInfo":                       //设备信息
                        strField = "device_info";
                        break;
                    case "getDeviceVersion":                    //设备版本
                        strField = "device_version";
                        break;
                    case "getOsdSetting":                       //显示设置
                        strField = "osd_setting";
                        break;
                    case "getVideoSetting":                     //视频设置
                        strField = "video_setting";
                        break;
                    case "getRS232":                            //rs232
                        strField = "rs232_setting";
                        break;
                    case "getRS485":                            //rs485
                        strField = "rs485_setting";
                        break;
                    case "getNetworkSetting":                   //网络设置
                        strField = "network_setting";
                        break;
                    case "getDeviceRecordPlan":                 //设备录像计划
                        strField = "device_record_plan";
                        break;
                    case "getDeviceCapturePlan":                //设备抓拍计划
                        strField = "device_capture_plan";
                        break;
                    case "getStoreRecordPlan":                  //中心录像计划
                        strField = "store_record_plan";
                        break;
                }
                dbResult = new DeviceRemoteConfigManage(this.DBConnectionString).GetRemoteConfigInfoByField(strDevCode, strField);
            }
            DataSet ds = dbResult.dsResult;
            string strConfigXml = string.Empty;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                strConfigXml = dr[0].ToString().Replace("\\", "\\\\").Replace("'", "\\\'");
            }
            return this.ParseDeviceRemoteConfig(strConfigXml, strField);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  解析设备远程配置信息
    public string ParseDeviceRemoteConfig(string strXml, string strField)
    {
        StringBuilder strResult = new StringBuilder();

        try
        {
            if (strXml.Equals(string.Empty))
            {
                //return String.Format("{{result:0, msg:'{0}'}}", "没有找到相关的配置信息");

                strResult.Append("{result:1");
                strResult.Append(String.Format(",field:'{0}'", strField));
                strResult.Append(",list:[]");
                strResult.Append("}");

                return strResult.ToString();
            }
            else
            {
                string[,] arrKeywFieldConvert;
                string[] arrKeywField;
                string[] arrParseField;
                string strXmlToJson = string.Empty;

                XmlDocument xml = new XmlDocument();
                XmlNode root;
                XmlNodeList nodeList;
                XmlNode node;
                xml.LoadXml(Server.HtmlDecode(strXml));

                switch (strField)
                {
                    case "device_info":
                        #region  设备信息
                        arrKeywFieldConvert = new string[16, 2] {
	                        {"device_id", "device_id"},
	                        {"device_name", "device_name"},
	                        {"device_type", "device_type"},
	                        {"serial_no", "serial_no"},
	                        {"channel_count", "channel_count"},
	                        {"disk_count", "disk_count"},
	                        {"alarm_in_count", "alarm_in_count"},
	                        {"alarm_out_count", "alarm_out_count"},
	                        {"rs232_count", "rs232_count"},
	                        {"rs485_count", "rs485_count"},
	                        {"network_port_count", "network_port_count"},
	                        {"auxout_count", "auxout_count"},
	                        {"audio_count", "audio_count"},
	                        {"major_scale", "major_scale"},
	                        {"minor_scale", "minor_scale"},
	                        {"audio_type", "audio_type"}
                        };
                        root = xml.SelectSingleNode("GetDeviceInfoRsp");
                        nodeList = root.SelectNodes("dev_info");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert);
                        #endregion
                        break;
                    case "device_version":
                        #region  设备版本
                        /*
                        arrKeywFieldConvert = new string[4] {
                            {"software", "software"},
                            {"dsp_software", "dsp_software"},
                            {"panel", "panel"},
                            {"hardware", "hardware"}
                        };
                        */
                        arrKeywField = new string[4] {"software","dsp_software","panel","hardware"};
                        root = xml.SelectSingleNode("GetDeviceVersionInfoRsp");
                        nodeList = root.SelectNodes("dev_version_info");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywField);
                        #endregion
                        break;
                    case "rs232_setting":
                        #region  RS232
                        arrKeywFieldConvert = new string[6, 2] {
	                        {"baud_rate", "baud_rate"},
	                        {"data_bit", "data_bit"},
	                        {"stop_bit", "stop_bit"},
	                        {"parity", "parity"},
	                        {"flow_control", "flow_control"},
	                        {"work_mode", "work_mode"}
                        };
                        root = xml.SelectSingleNode("GetRS232ConfigRsp");
                        nodeList = root.SelectNodes("cfg");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert);
                        #endregion
                        break;
                    case "rs485_setting":
                        #region  RS485
                        arrKeywFieldConvert = new string[7, 2] {
	                        {"baud_rate", "baud_rate"},
	                        {"data_bit", "data_bit"},
	                        {"stop_bit", "stop_bit"},
	                        {"parity", "parity"},
	                        {"flow_control", "flow_control"},
	                        {"decoder_type", "decoder_type"},
	                        {"decoder_id", "decoder_id"}
                        };
                        root = xml.SelectSingleNode("GetRS485ConfigRsp");
                        nodeList = root.SelectNodes("cfg");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert);
                        #endregion
                        break;
                    case "osd_setting":
                        #region  显示设置
                        arrKeywFieldConvert = new string[10, 2] {
	                        {"channel_name", "channel_name"},
	                        {"show_channel_name", "show_channel_name"},
	                        {"channel_name_x", "channel_name_x"},
	                        {"channel_name_y", "channel_name_y"},
	                        {"show_osd", "show_osd"},
	                        {"osd_x", "osd_x"},
	                        {"osd_y", "osd_y"},
	                        {"osd_layout", "osd_layout"},
	                        {"osd_mode", "osd_mode"},
	                        {"show_week", "show_week"}
                        };
                        root = xml.SelectSingleNode("GetOsdInfoRsp");
                        nodeList = root.SelectNodes("osd");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert);
                        #endregion
                        break;
                    case "video_setting":
                        #region  视频设置
                        arrKeywFieldConvert = new string[8, 2] {
	                        {"stream_mode", "stream_mode"},
	                        {"resolution", "resolution"},
	                        {"pic_quality", "pic_quality"},
	                        {"bitrate_type", "bitrate_type"},
	                        {"bitrate", "bitrate"},
	                        {"frame_rate", "frame_rate"},
	                        {"frame_order", "frame_order"},
	                        {"iframe_interval", "iframe_interval"}
                        };
                        root = xml.SelectSingleNode("GetVideoStreamingRsp");
                        nodeList = root.SelectNodes("video_streaming");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert);
                        #endregion
                        break;
                    case "network_setting":
                        #region  网络设置
                        arrKeywFieldConvert = new string[14, 2] {
	                        {"net_type", "net_type"},
	                        {"ip", "ip"},
	                        {"port", "port"},
	                        {"mask", "mask"},
	                        {"gateway", "gateway"},
	                        {"multicast", "multicast"},
	                        {"mac", "mac"},
	                        {"http_port", "http_port"},
                            {"mtu", "mtu"},
                            {"dns1", "dns1"},
                            {"dns2", "dns2"},
                            {"use_pppoe", "use_pppoe"},
                            {"pppoe_user", "pppoe_user"},
                            {"pppoe_pwd", "pppoe_pwd"}
                        };
                        root = xml.SelectSingleNode("GetNetAdaptorRsp");
                        nodeList = root.SelectNodes("net_info");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert);
                        #endregion
                        break;
                    case "device_record_plan":
                        #region  设备录像计划
                        arrKeywFieldConvert = new string[9, 2] {
	                        {"enable", "enabled"},
	                        {"delay_time", "delay_time"},
	                        {"pre_time", "pre_time"},
	                        {"keep_days", "keep_days"},
	                        {"redundancy", "redundancy"},
	                        {"audio_rec", "audio_rec"},
	                        {"rec_all_day", "rec_all_day"},
	                        {"allday_rec_type", "allday_rec_type"},
                            {"rec_time_span", "rec_time_span"}
                        };
                        root = xml.SelectSingleNode("GetRecordPlanRsp");
                        nodeList = root.SelectNodes("cfg");
                        arrParseField = new string[] { "rec_time_span" };
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, arrParseField);
                        #endregion
                        break;
                    case "device_capture_plan":
                        #region  设备抓拍计划
                        arrKeywFieldConvert = new string[9, 2] {
	                        {"enable", "enabled"},
	                        {"send_to", "send_to"},
	                        {"capture_type", "capture_type"},
	                        {"interval", "interval"},
	                        {"resolution", "resolution"},
	                        {"pic_quality", "pic_quality"},
	                        {"frequency", "frequency"},
	                        {"point_list", "point_list"},
                            {"span_list", "span_list"}
                        };
                        root = xml.SelectSingleNode("GetCapturePlanRsp");
                        nodeList = root.SelectNodes("cfg");
                        arrParseField = new string[] { "point_list", "span_list" };
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, arrParseField);
                        #endregion
                        break;
                    case "store_record_plan":
                        #region  中心录像计划
                        /*
                         * arrKeywFieldConvert = new string[9, 2] {
	                        {"enable", "enabled"},
	                        {"send_to", "send_to"},
	                        {"capture_type", "capture_type"},
	                        {"interval", "interval"},
	                        {"resolution", "resolution"},
	                        {"pic_quality", "pic_quality"},
	                        {"frequency", "frequency"},
	                        {"point_list", "point_list"},
                            {"span_list", "span_list"}
                        };
                        root = xml.SelectSingleNode("GetCapturePlanRsp");
                        nodeList = root.SelectNodes("cfg");
                        arrParseField = new string[] { "point_list", "span_list" };
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, arrParseField);
                        */
                        #endregion
                        break;
                    case "exception_setting":
                        #region  异常参数
                        arrKeywFieldConvert = new string[6, 2] {
	                        {"monitor_alarm", "monitor_alarm"},
	                        {"sound_alarm", "sound_alarm"},
	                        {"notify_center", "notify_center"},
	                        {"alarm_out", "alarm_out"},
	                        {"email", "sms_alarm"},
	                        {"alarm_out_cfg", "alarm_out_cfg"}
                        };
                        root = xml.SelectSingleNode("GetExceptionConfigRsp");
                        nodeList = root.SelectNodes("cfg");
                        nodeList = nodeList[0].SelectNodes("alarm_linkage");
                        arrParseField = new string[] { "alarm_out_cfg" };
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, arrParseField);
                        #endregion
                        break;
                    case "osd_custom":
                        #region  自定义OSD叠加
                        arrKeywFieldConvert = new string[4, 2] {
	                        {"osd", "osd"},
	                        {"enable", "enabled"},
	                        {"x", "x"},
	                        {"y", "y"}
                        };
                        root = xml.SelectSingleNode("GetCustomOsdRsp");
                        nodeList = root.SelectNodes("osd");
                        nodeList = nodeList[0].SelectNodes("osd_list");
                        if (nodeList.Count > 0)
                        {
                            nodeList = nodeList[0].SelectNodes("OsdString");
                        }
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);
                        #endregion
                        break;
                    case "video_mask":
                        #region  视频遮盖
                        arrKeywFieldConvert = new string[4, 2] {
	                        {"left", "x"},
	                        {"top", "y"},
	                        {"right", "cx"},
	                        {"bottom", "cy"}
                        };
                        root = xml.SelectSingleNode("GetMaskConfigRsp");
                        nodeList = root.SelectNodes("cfg");
                        nodeList = nodeList[0].SelectNodes("rc_list");
                        nodeList = nodeList[0].SelectNodes("Rect");

                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);
                        #endregion
                        break;
                    case "video_mask_enabled":
                        #region  视频遮盖可用性
                        arrKeywFieldConvert = new string[1, 2] {
	                        {"enabled", "enabled"}
                        };
                        root = xml.SelectSingleNode("GetMaskEnabledRsp");
                        //nodeList = root.SelectNodes("enabled");
                        //strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);

                        node = root.SelectSingleNode("enabled");
                        strXmlToJson = String.Format("{{enabled:'{0}'}}", node.InnerText);
                        #endregion
                        break;
                    case "mask_alarm":
                        #region  遮挡报警
                        arrKeywFieldConvert = new string[4, 2] {
	                        {"left", "x"},
	                        {"top", "y"},
	                        {"right", "cx"},
	                        {"bottom", "cy"}
                        };
                        root = xml.SelectSingleNode("GetMaskAlarmConfigRsp");
                        nodeList = root.SelectNodes("cfg");
                        nodeList = nodeList[0].SelectNodes("rc_list");
                        nodeList = nodeList[0].SelectNodes("Rect");

                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);
                        #endregion
                        break;
                    case "mask_alarm_enabled":
                        #region  遮挡报警可用性
                        arrKeywFieldConvert = new string[2, 2] {
	                        {"enabled", "enabled"},
                            {"sensitive", "sensitive"}
                        };
                        root = xml.SelectSingleNode("GetAlarmMaskEnabledRsp");
                        //nodeList = root.SelectNodes("cfg");
                        //strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);

                        strXmlToJson = "{";
                        node = root.SelectSingleNode("enabled");
                        strXmlToJson += String.Format("enabled:'{0}'", node.InnerText);
                        node = root.SelectSingleNode("sensitive");
                        strXmlToJson += String.Format(",sensitive:'{0}'", node.InnerText);
                        strXmlToJson += "}";

                        #endregion
                        break;
                    case "montion_detection":
                        #region  移动侦测
                        arrKeywFieldConvert = new string[4, 2] {
	                        {"left", "x"},
	                        {"top", "y"},
	                        {"right", "cx"},
	                        {"bottom", "cy"}
                        };
                        root = xml.SelectSingleNode("GetMontionConfigRsp");
                        nodeList = root.SelectNodes("cfg");
                        nodeList = nodeList[0].SelectNodes("rc_list");
                        nodeList = nodeList[0].SelectNodes("Rect");

                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);
                        #endregion
                        break;
                    case "montion_detection_enabled":
                        #region  移动侦测可用性
                        arrKeywFieldConvert = new string[2, 2] {
	                        {"enabled", "enabled"},
                            {"sensitive", "sensitive"}
                        };
                        root = xml.SelectSingleNode("GetMontionEnabledReq");
                        nodeList = root.SelectNodes("cfg");
                        strXmlToJson = this.ParseXmlItemContent(nodeList, arrKeywFieldConvert, null);
                        #endregion
                        break;
                }

                strResult.Append("{result:1");
                strResult.Append(String.Format(",field:'{0}'", strField));
                strResult.Append(",list:[");
                strResult.Append(strXmlToJson);
                strResult.Append("]");
                strResult.Append("}");

                return strResult.ToString();
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  解析XML内容列表
    public string ParseXmlItemContent(XmlNodeList nodeList, string[,] arrKeywField)
    {
        return this.ParseXmlItemContent(nodeList, arrKeywField, null);
    }

    public string ParseXmlItemContent(XmlNodeList nodeList, string[,] arrKeywField, string[] arrParseField)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strItem = new StringBuilder();
            string strContent = string.Empty;

            int n = 0;
            int c = arrKeywField.Length / 2;
            foreach (XmlNode xn in nodeList)
            {
                try
                {
                    int nc = xn.ChildNodes.Count;

                    //清除内容
                    strItem.Length = 0;

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    XmlNode x;
                    for (int i = 0; i < c; i++)
                    {
                        if (i < nc)
                        {
                            x = xn.SelectSingleNode(arrKeywField[i, 0]);
                            if (x == null)
                            {
                                strContent = string.Empty;
                            }
                            else
                            {
                                strContent = x.InnerXml.Replace("\n", "<br />");
                            }

                            if (arrParseField != null)
                            {
                                foreach (string str in arrParseField)
                                {
                                    if (str.Equals(x.Name))
                                    {
                                        strContent = this.ParseFieldContent(str, strContent);
                                        break;
                                    }
                                }
                            }
                        }
                        else
                        {
                            strContent = string.Empty;
                        }
                        strItem.Append(i > 0 ? "," : "");
                        strItem.Append(String.Format("{0}:'{1}'", arrKeywField[i, 1], strContent));
                    }
                    strItem.Append("}");

                    strResult.Append(strItem.ToString());
                }
                catch (Exception exx) { throw (exx); }
            }

            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  解析内容字段
    public string ParseFieldContent(string strField, string strContent)
    {
        if (strContent.Equals(string.Empty))
        {
            return strContent;
        }
        XmlDocument xml = new XmlDocument();
        strContent = String.Format("<{0}>{1}</{2}>", strField, strContent, strField);
        xml.LoadXml(Server.HtmlDecode(strContent));

        XmlNode root;
        XmlNodeList nodeList;

        StringBuilder strJson = new StringBuilder();
        int n = 0;

        switch (strField)
        {
            case "rec_time_span":       //设备录像时间列表
                #region 设备录像时间列表
                strJson.Append("[");
                root = xml.SelectSingleNode(strField);
                nodeList = root.SelectNodes("RecordTimeSpan");

                foreach (XmlNode xn in nodeList)
                {
                    strJson.Append(n++ > 0 ? "," : "");
                    strJson.Append("[");
                    XmlNodeList xnl = xn.ChildNodes;
                    strJson.Append(String.Format("{0}", xnl[0].InnerText));

                    XmlNodeList xnl_ = xnl[1].ChildNodes;
                    strJson.Append(String.Format(",'{0}','{1}'", xnl_[0].InnerText, xnl_[1].InnerText));

                    strJson.Append("]");
                }
                strJson.Append("]");
                #endregion
                break;
            case "point_list":          //设备抓图时间点列表
                #region  设备抓图时间点列表
                strJson.Append("[");
                root = xml.SelectSingleNode(strField);
                nodeList = root.SelectNodes("TYPE_STRING");
                foreach (XmlNode xn in nodeList)
                {
                    strJson.Append(n++ > 0 ? "," : "");
                    strJson.Append(String.Format("'{0}'", xn.InnerText));
                }
                strJson.Append("]");
                #endregion
                break;
            case "span_list":           //设备抓图时间段列表
                #region  设备抓图时间段列表
                strJson.Append("[");
                root = xml.SelectSingleNode(strField);
                nodeList = root.SelectNodes("TimeSpan");
                
                foreach (XmlNode xn in nodeList)
                {
                    strJson.Append(n++ > 0 ? "," : "");
                    XmlNodeList xnl = xn.ChildNodes;
                    strJson.Append(String.Format("['{0}','{1}']", xnl[0].InnerText, xnl[1].InnerText));
                }
                strJson.Append("]");
                #endregion
                break;
            case "alarm_out_cfg":       //报警输出配置
                strJson.Append("[");
                root = xml.SelectSingleNode(strField);
                nodeList = root.SelectNodes("AlarmOut");

                foreach (XmlNode xn in nodeList)
                {
                    strJson.Append(n++ > 0 ? "," : "");
                    XmlNodeList xnl = xn.ChildNodes;
                    strJson.Append(String.Format("['{0}','{1}']", xnl[0].InnerText, xnl[1].InnerText));
                }
                strJson.Append("]");
                break;
            case "rc_list":             //视频遮盖配置
                strJson.Append("[");
                root = xml.SelectSingleNode(strField);
                nodeList = root.SelectNodes("Rect");

                foreach (XmlNode xn in nodeList)
                {
                    strJson.Append(n++ > 0 ? "," : "");
                    XmlNodeList xnl = xn.ChildNodes;
                    strJson.Append(String.Format("[{0},{1},{2},{3}]",
                       DataConvert.ConvertValue(xnl[0].InnerText, 0), DataConvert.ConvertValue(xnl[1].InnerText, 0),
                       DataConvert.ConvertValue(xnl[2].InnerText, 0), DataConvert.ConvertValue(xnl[3].InnerText, 0)));
                }
                strJson.Append("]");
                break;
        }
        return strJson.ToString().Replace("'", "\\\'");
    }
    #endregion

    #region  解析XML内容列表
    public string ParseXmlItemContent(XmlNodeList nodeList, string[] arrKeywField)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strItem = new StringBuilder();
            string strContent = string.Empty;

            int n = 0;
            int c = arrKeywField.Length;
            foreach (XmlNode xn in nodeList)
            {
                try
                {
                    int nc = xn.ChildNodes.Count;

                    //清除内容
                    strItem.Length = 0;

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    XmlNode x;
                    for (int i = 0; i < c; i++)
                    {
                        if (i < nc)
                        {
                            x = xn.SelectSingleNode(arrKeywField[i]);
                            if (x == null)
                            {
                                strContent = string.Empty;
                            }
                            else
                            {
                                strContent = x.InnerXml.Replace("\n", "<br />");
                            }
                        }
                        else
                        {
                            strContent = string.Empty;
                        }
                        strItem.Append(i > 0 ? "," : "");
                        strItem.Append(String.Format("{0}:'{1}'", arrKeywField[i], strContent));
                    }
                    strItem.Append("}");

                    strResult.Append(strItem.ToString());
                }
                catch (Exception exx) { throw (exx); }
            }

            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

}