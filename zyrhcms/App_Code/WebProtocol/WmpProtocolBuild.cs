using System;
using System.Data;
using System.Collections;
using System.Configuration;
using System.Web;
using System.Xml;
using Zyrh.BLL;
using Google;
using Google.ProtocolBuffers;
using Google.ProtocolBuffers.Collections;

/// <summary>
/// WmpProtocolBuild 的摘要说明
/// </summary>
public class WmpProtocolBuild
{
    public WmpProtocolBuild()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }


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
            xml.LoadXml(strSetting);
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


    #region  显示设置
    public ByteString ReadOsdSetting(int channelNo)
    {
        wmp.device.GetOsdInfoReq.Builder req_builder = new wmp.device.GetOsdInfoReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetOsdInfoReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildOsdSetting(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetOsdInfoReq.Builder req_builder = new wmp.device.SetOsdInfoReq.Builder();

        wmp.OsdInfo.Builder data_builder = new wmp.OsdInfo.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);

        data_builder.ChannelName = arrConfig[c++].ToString();
        data_builder.ShowChannelName = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.ChannelNameX = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.ChannelNameY = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.ShowOsd = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.OsdX = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.OsdY = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.OsdLayout = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.OsdMode = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.ShowWeek = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        req_builder.Osd = data_builder.Build();

        wmp.device.SetOsdInfoReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  视频设置
    public ByteString ReadVideoSetting(int channelNo, int streamType)
    {
        wmp.device.GetVideoStreamingReq.Builder req_builder = new wmp.device.GetVideoStreamingReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.StreamType = (wmp.StreamType)streamType;

        wmp.device.GetVideoStreamingReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildVideoSetting(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetVideoStreamingReq.Builder req_builder = new wmp.device.SetVideoStreamingReq.Builder();

        wmp.VideoStreaming.Builder data_builder = new wmp.VideoStreaming.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.StreamType = (wmp.StreamType)DataConvert.ConvertValue(arrConfig[c++], 0);
        /*
        switch (DataConvert.ConvertValue(arrConfig[0], 0))
        {
            case 0:
                req_builder.StreamType = wmp.StreamType.STREAM_MAIN;
                break;
            case 1:
                req_builder.StreamType = wmp.StreamType.STREAM_SUB;
                break;
        }
        */

        data_builder.StreamMode = (wmp.StreamMode)DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Resolution = (wmp.Resolution)DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.BitrateType = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Bitrate = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.FrameRate = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.PicQuality = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.FrameOrder = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.IframeInterval = DataConvert.ConvertValue(arrConfig[c++], 0);

        req_builder.VideoStreaming = data_builder.Build();

        wmp.device.SetVideoStreamingReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  设置RS232
    public ByteString BuildRS232Setting(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetRS232ConfigReq.Builder req_builder = new wmp.device.SetRS232ConfigReq.Builder();
        wmp.RS232Config.Builder data_builder = new wmp.RS232Config.Builder();

        data_builder.BaudRate = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.DataBit = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.StopBit = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Parity = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.FlowControl = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.WorkMode = DataConvert.ConvertValue(arrConfig[c++], 0);

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetRS232ConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  设置RS485
    public ByteString ReadRS485Setting(int channelNo)
    {
        wmp.device.GetRS485ConfigReq.Builder req_builder = new wmp.device.GetRS485ConfigReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetRS485ConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildRS485Setting(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetRS485ConfigReq.Builder req_builder = new wmp.device.SetRS485ConfigReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.RS485Config.Builder data_builder = new wmp.RS485Config.Builder();

        data_builder.BaudRate = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.DataBit = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.StopBit = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Parity = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.FlowControl = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.DecoderType = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.DecoderId = DataConvert.ConvertValue(arrConfig[c++], 0);

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetRS485ConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  网络设置
    public ByteString BuildNetworkSetting(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetNetAdaptorReq.Builder req_builder = new wmp.device.SetNetAdaptorReq.Builder();

        wmp.NetAdaptor.Builder data_builder = new wmp.NetAdaptor.Builder();
        data_builder.NetType = (wmp.NetAdaptorType)DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Ip = arrConfig[c++].ToString();
        data_builder.Port = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Mask = arrConfig[c++].ToString();
        data_builder.Gateway = arrConfig[c++].ToString();
        data_builder.Multicast = arrConfig[c++].ToString();
        data_builder.Mac = arrConfig[c++].ToString();
        data_builder.HttpPort = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Dns1 = arrConfig[c++].ToString();
        data_builder.Dns2 = arrConfig[c++].ToString();

        data_builder.UsePppoe = false;
        data_builder.PppoeUser = string.Empty;
        data_builder.PppoePwd = string.Empty;

        req_builder.NetInfo = data_builder.Build();

        wmp.device.SetNetAdaptorReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  设备录像计划
    public ByteString ReadDeviceRecordPlan(int channelNo, int week)
    {
        wmp.device.GetRecordPlanReq.Builder req_builder = new wmp.device.GetRecordPlanReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.Week = week;

        wmp.device.GetRecordPlanReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildDeviceRecordPlan(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetRecordPlanReq.Builder req_builder = new wmp.device.SetRecordPlanReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.Week = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.RecordPlan.Builder data_builder = new wmp.RecordPlan.Builder();
        data_builder.Enable = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.KeepDays = DataConvert.ConvertValue(arrConfig[c++], 0); //保存天数，天
        data_builder.PreTime = DataConvert.ConvertValue(arrConfig[c++], 0); //预录时间，秒
        data_builder.DelayTime = DataConvert.ConvertValue(arrConfig[c++], 0); //录像延迟，秒
        data_builder.Redundancy = DataConvert.ConvertValue(arrConfig[c++], 0) == 1; //是否冗余录像，true|false
        data_builder.AudioRec = DataConvert.ConvertValue(arrConfig[c++], 0) == 1; //是否记录音频，true|false
        data_builder.RecAllDay = DataConvert.ConvertValue(arrConfig[c++], 0) == 1; //是否全天录像，true|false
        data_builder.AlldayRecType = (wmp.RecordType)DataConvert.ConvertValue(arrConfig[c++], 0); //全天录像类型

        string[] arrPlan = arrConfig[c++].ToString().Split('|');
        int count = arrPlan.Length;

        foreach (string str in arrPlan)
        {
            string[] arrTime = str.Split(',');

            wmp.RecordTimeSpan.Builder plan_builder = new wmp.RecordTimeSpan.Builder();
            plan_builder.RecType = (wmp.RecordType)DataConvert.ConvertValue(arrTime[0], 0);

            wmp.TimeSpan.Builder span_builder = new wmp.TimeSpan.Builder();
            span_builder.Begin = arrTime[1];
            span_builder.End = arrTime[2];
            plan_builder.Span = span_builder.Build();

            data_builder.AddRecTimeSpan(plan_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetRecordPlanReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  设备抓图计划
    public ByteString ReadDeviceCapturePlan(int channelNo, int week)
    {
        wmp.device.GetCapturePlanReq.Builder req_builder = new wmp.device.GetCapturePlanReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.Week = week;

        wmp.device.GetCapturePlanReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildCapturePlan(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetCapturePlanReq.Builder req_builder = new wmp.device.SetCapturePlanReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.Week = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.CapturePlan.Builder data_builder = new wmp.CapturePlan.Builder();
        data_builder.Enable = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.SendTo = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.CaptureType = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Interval = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Resolution = (wmp.Resolution)DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.PicQuality = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Frequency = DataConvert.ConvertValue(arrConfig[c++], 0);

        string[] arrPoint = arrConfig[c++].ToString().Split('|');
        string[] arrSpan = arrConfig[c++].ToString().Split('|');
        foreach (string str in arrPoint)
        {
            data_builder.PointListList.Add(str);
            //data_builder.AddPointList(str);
        }
        foreach (string str in arrSpan)
        {
            string[] arrTime = str.Split(',');
            wmp.TimeSpan.Builder span_builder = new wmp.TimeSpan.Builder();
            span_builder.Begin = arrTime[0];
            span_builder.End = arrTime[1];

            data_builder.SpanListList.Add(span_builder.Build());
            //data_builder.AddSpanList(span_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetCapturePlanReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  异常参数设置
    public ByteString ReadException(int exType, int week)
    {
        wmp.device.GetExceptionConfigReq.Builder req_builder = new wmp.device.GetExceptionConfigReq.Builder();

        req_builder.ExType = (wmp.ExceptionType)exType;
        req_builder.Week = week;

        wmp.device.GetExceptionConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildException(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetExceptionConfigReq.Builder req_builder = new wmp.device.SetExceptionConfigReq.Builder();

        req_builder.ExType = (wmp.ExceptionType)DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.ExceptionConfig.Builder data_builder = new wmp.ExceptionConfig.Builder();

        wmp.AlarmLinkage.Builder al_builder = new wmp.AlarmLinkage.Builder();
        al_builder.MonitorAlarm = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        al_builder.SoundAlarm = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        al_builder.NotifyCenter = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        al_builder.Email = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        al_builder.AlarmOut = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        string[] arrOut = arrConfig[c++].ToString().Split('|');
        int count = arrOut.Length;

        foreach (string str in arrOut)
        {
            string[] arrChan = str.Split(',');

            wmp.AlarmOut.Builder out_builder = new wmp.AlarmOut.Builder();
            out_builder.AlarmOutChannel = DataConvert.ConvertValue(arrChan[0], 0);
            out_builder.Enable = DataConvert.ConvertValue(arrChan[1], 0) == 1;

            al_builder.AddAlarmOutCfg(out_builder.Build());
        }

        data_builder.AlarmLinkage = al_builder.Build();

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetExceptionConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion


    #region  自定义OSD叠加
    public ByteString ReadOsdCustom(int channelNo)
    {
        wmp.device.GetCustomOsdReq.Builder req_builder = new wmp.device.GetCustomOsdReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetCustomOsdReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildOsdCustom(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetCustomOsdReq.Builder req_builder = new wmp.device.SetCustomOsdReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.CustomOsd.Builder data_builder = new wmp.CustomOsd.Builder();

        string[] arrList = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrList)
        {
            string[] arrOsd = str.Split(',');

            wmp.OsdString.Builder osd_builder = new wmp.OsdString.Builder();

            osd_builder.Enable = DataConvert.ConvertValue(arrOsd[0], 0) == 1;
            osd_builder.Osd = arrOsd[1];
            osd_builder.X = DataConvert.ConvertValue(arrOsd[2], 0);
            osd_builder.Y = DataConvert.ConvertValue(arrOsd[3], 0);

            data_builder.AddOsdList(osd_builder.Build());
        }

        req_builder.Osd = data_builder.Build();

        wmp.device.SetCustomOsdReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  视频丢失
    public ByteString ReadVideoLost(int channelNo)
    {
        wmp.device.GetVideoLostConfigReq.Builder req_builder = new wmp.device.GetVideoLostConfigReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetVideoLostConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildVideoLost(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetVideoLostConfigReq.Builder req_builder = new wmp.device.SetVideoLostConfigReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        
        wmp.VideoLostConfig.Builder data_builder = new wmp.VideoLostConfig.Builder();

        data_builder.Enable = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetVideoLostConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion


    #region  移动侦测
    public ByteString ReadMotionDetetionEnabled(int channelNo)
    {
        wmp.device.GetMontionEnabledReq.Builder req_builder = new wmp.device.GetMontionEnabledReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetMontionEnabledReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildMotionDetetionEnabled(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetMontionEnabledReq.Builder req_builder = new wmp.device.SetMontionEnabledReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.Enabled = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        req_builder.Sensitive = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.device.SetMontionEnabledReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString ReadMotionDetetion(int channelNo)
    {
        wmp.device.GetMontionConfigReq.Builder req_builder = new wmp.device.GetMontionConfigReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetMontionConfigReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildMotionDetetion(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetMontionConfigReq.Builder req_builder = new wmp.device.SetMontionConfigReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.MontionConfig.Builder data_builder = new wmp.MontionConfig.Builder();

        string strConList = arrConfig[c++].ToString();
        if (!strConList.Equals(string.Empty))
        {
            string[] arrList = strConList.Split('|');

            foreach (string str in arrList)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }
                string[] arrRect = str.Split(',');

                wmp.Rect.Builder rect_builder = new wmp.Rect.Builder();
                rect_builder.Left = DataConvert.ConvertValue(arrRect[0], 0);
                rect_builder.Top = DataConvert.ConvertValue(arrRect[1], 0);
                rect_builder.Right = DataConvert.ConvertValue(arrRect[2], 0);
                rect_builder.Bottom = DataConvert.ConvertValue(arrRect[3], 0);

                data_builder.RcListList.Add(rect_builder.Build());
            }
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetMontionConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  遮挡报警
    public ByteString ReadMaskAlarmEnabled(int channelNo)
    {
        wmp.device.GetAlarmMaskEnabledReq.Builder req_builder = new wmp.device.GetAlarmMaskEnabledReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetAlarmMaskEnabledReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildMaskAlarmEnabled(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetAlarmMaskEnabledReq.Builder req_builder = new wmp.device.SetAlarmMaskEnabledReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.Enabled = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        req_builder.Sensitive = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.device.SetAlarmMaskEnabledReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString ReadMaskAlarm(int channelNo)
    {
        wmp.device.GetMaskAlarmConfigReq.Builder req_builder = new wmp.device.GetMaskAlarmConfigReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetMaskAlarmConfigReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildMaskAlarm(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetMaskAlarmConfigReq.Builder req_builder = new wmp.device.SetMaskAlarmConfigReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.MaskAlarmConfig.Builder data_builder = new wmp.MaskAlarmConfig.Builder();
                
        string strConList = arrConfig[c++].ToString();

        int maxCount = DataConvert.ConvertValue(arrConfig[c++], 0);
        int count = 0;

        if (!strConList.Equals(string.Empty))
        {
            string[] arrList = strConList.Split('|');
            count = arrList.Length;

            foreach (string str in arrList)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }
                string[] arrRect = str.Split(',');

                wmp.Rect.Builder rect_builder = new wmp.Rect.Builder();
                rect_builder.Left = DataConvert.ConvertValue(arrRect[0], 0);
                rect_builder.Top = DataConvert.ConvertValue(arrRect[1], 0);
                rect_builder.Right = DataConvert.ConvertValue(arrRect[2], 0);
                rect_builder.Bottom = DataConvert.ConvertValue(arrRect[3], 0);

                data_builder.RcListList.Add(rect_builder.Build());
            }
        }

        for (int i = count; i < maxCount; i++)
        {
            wmp.Rect.Builder rect_builder = new wmp.Rect.Builder();
            rect_builder.Left = 0;
            rect_builder.Top = 0;
            rect_builder.Right = 0;
            rect_builder.Bottom = 0;

            data_builder.RcListList.Add(rect_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetMaskAlarmConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  视频遮盖
    public ByteString ReadVideoMaskEnabled(int channelNo)
    {
        wmp.device.GetMaskEnabledReq.Builder req_builder = new wmp.device.GetMaskEnabledReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetMaskEnabledReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildVideoMaskEnabled(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetMaskEnabledReq.Builder req_builder = new wmp.device.SetMaskEnabledReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.Enabled = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        wmp.device.SetMaskEnabledReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString ReadVideoMask(int channelNo)
    {
        wmp.device.GetMaskConfigReq.Builder req_builder = new wmp.device.GetMaskConfigReq.Builder();

        req_builder.Channel = channelNo;

        wmp.device.GetMaskConfigReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildVideoMask(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetMaskConfigReq.Builder req_builder = new wmp.device.SetMaskConfigReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.MaskConfig.Builder data_builder = new wmp.MaskConfig.Builder();

        string strConList = arrConfig[c++].ToString();

        int maxCount = DataConvert.ConvertValue(arrConfig[c++], 0);
        int count = 0;
        if (!strConList.Equals(string.Empty))
        {
            string[] arrList = strConList.Split('|');
            count = arrList.Length;

            foreach (string str in arrList)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }
                string[] arrRect = str.Split(',');
                if (arrRect.Length >= 4)
                {
                    wmp.Rect.Builder rect_builder = new wmp.Rect.Builder();
                    rect_builder.Left = DataConvert.ConvertValue(arrRect[0], 0);
                    rect_builder.Top = DataConvert.ConvertValue(arrRect[1], 0);
                    rect_builder.Right = DataConvert.ConvertValue(arrRect[2], 0);
                    rect_builder.Bottom = DataConvert.ConvertValue(arrRect[3], 0);

                    data_builder.RcListList.Add(rect_builder.Build());
                }
            }            
        }

        for (int i = count; i < maxCount; i++)
        {
            wmp.Rect.Builder rect_builder = new wmp.Rect.Builder();
            rect_builder.Left = 0;
            rect_builder.Top = 0;
            rect_builder.Right = 0;
            rect_builder.Bottom = 0;

            data_builder.RcListList.Add(rect_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetMaskConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion


    #region  布防时间设置
    public ByteString ReadDeploymentTime(int channelNo, int week, int alarmType)
    {
        wmp.device.GetDeploymentTimeReq.Builder req_builder = new wmp.device.GetDeploymentTimeReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.AlarmType = (wmp.AlarmType)alarmType;
        req_builder.Week = week;

        wmp.device.GetDeploymentTimeReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildDeploymentTime(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetDeploymentTimeReq.Builder req_builder = new wmp.device.SetDeploymentTimeReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.Week = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.AlarmType = (wmp.AlarmType)DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.DeploymentTime.Builder data_builder = new wmp.DeploymentTime.Builder();

        string[] arrSpan = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrSpan)
        {
            string[] arrTime = str.Split(',');
            wmp.TimeSpan.Builder span_builder = new wmp.TimeSpan.Builder();
            span_builder.Begin = arrTime[0];
            span_builder.End = arrTime[1];

            data_builder.SpanListList.Add(span_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetDeploymentTimeReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion
    
    #region  报警联动
    public ByteString BuildAlarmLinkage(int channelNo, int alarmType)
    {
        wmp.device.GetAlarmLinkageReq.Builder req_builder = new wmp.device.GetAlarmLinkageReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.AlarmType = (wmp.AlarmType)alarmType;

        wmp.device.GetAlarmLinkageReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildAlarmLinkage(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetAlarmLinkageReq.Builder req_builder = new wmp.device.SetAlarmLinkageReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.AlarmType = (wmp.AlarmType)DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.AlarmLinkage.Builder data_builder = new wmp.AlarmLinkage.Builder();
        data_builder.MonitorAlarm = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.SoundAlarm = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.NotifyCenter = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.Email = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.AlarmOut = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        string[] arrSpan = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrSpan)
        {
            string[] arrChannel = str.Split(',');
            wmp.AlarmOut.Builder span_builder = new wmp.AlarmOut.Builder();
            span_builder.AlarmOutChannel = Convert.ToInt32(arrChannel[0]);
            span_builder.Enable = Convert.ToInt32(arrChannel[1]) == 1;

            data_builder.AlarmOutCfgList.Add(span_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetAlarmLinkageReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion
    
    #region  报警抓图
    public ByteString ReadAlarmCapture(int channelNo, int alarmType)
    {
        wmp.device.GetAlarmCaptureReq.Builder req_builder = new wmp.device.GetAlarmCaptureReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.AlarmType = (wmp.AlarmType)alarmType;

        wmp.device.GetAlarmCaptureReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildAlarmCapture(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetAlarmCaptureReq.Builder req_builder = new wmp.device.SetAlarmCaptureReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.AlarmType = (wmp.AlarmType)DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.AlarmCapture.Builder data_builder = new wmp.AlarmCapture.Builder();
        data_builder.Enable = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        data_builder.SendTo = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Frequency = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Interval = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Resolution = (wmp.Resolution)DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.PicQuality = DataConvert.ConvertValue(arrConfig[c++], 0);

        string[] arrSpan = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrSpan)
        {
            string[] arrChannel = str.Split(',');
            wmp.ChannelCapture.Builder span_builder = new wmp.ChannelCapture.Builder();
            span_builder.Channel = DataConvert.ConvertValue(arrChannel[0], 0);
            span_builder.Enable = DataConvert.ConvertValue(arrChannel[1], 0) == 1;
            //通道类型：1-模拟通道，2-数字通道
            span_builder.ChannelType = DataConvert.ConvertValue(arrChannel[2], 0);

            data_builder.ChannelCfgList.Add(span_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetAlarmCaptureReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  报警录像
    public ByteString ReadAlarmRecord(int channelNo, int alarmType)
    {
        wmp.device.GetAlarmRecordReq.Builder req_builder = new wmp.device.GetAlarmRecordReq.Builder();

        req_builder.Channel = channelNo;
        req_builder.AlarmType = (wmp.AlarmType)alarmType;

        wmp.device.GetAlarmRecordReq req = req_builder.Build();

        return req.ToByteString();
    }

    public ByteString BuildAlarmRecord(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetAlarmRecordReq.Builder req_builder = new wmp.device.SetAlarmRecordReq.Builder();

        req_builder.Channel = DataConvert.ConvertValue(arrConfig[c++], 0);
        req_builder.AlarmType = (wmp.AlarmType)DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.AlarmRecord.Builder data_builder = new wmp.AlarmRecord.Builder();

        string[] arrSpan = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrSpan)
        {
            string[] arrChannel = str.Split(',');
            wmp.ChannelRecord.Builder span_builder = new wmp.ChannelRecord.Builder();
            span_builder.Channel = DataConvert.ConvertValue(arrChannel[0], 0);
            span_builder.Enable = DataConvert.ConvertValue(arrChannel[1], 0) == 1;
            //通道类型：1-模拟通道，2-数字通道
            span_builder.ChannelType = DataConvert.ConvertValue(arrChannel[2], 0);

            data_builder.ChannelCfgList.Add(span_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetAlarmRecordReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion


    #region  报警输入
    public ByteString ReadAlarmIn(int alarmIn)
    {
        wmp.device.GetAlarmInConfigReq.Builder req_builder = new wmp.device.GetAlarmInConfigReq.Builder();

        req_builder.AlarmIn = alarmIn;

        wmp.device.GetAlarmInConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildAlarmIn(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;
        wmp.device.SetAlarmInConfigReq.Builder req_builder = new wmp.device.SetAlarmInConfigReq.Builder();

        req_builder.AlarmIn = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.AlarmInConfig.Builder data_builder = new wmp.AlarmInConfig.Builder();
        data_builder.AlarmInName = arrConfig[c++].ToString();
        data_builder.AlarmInType = DataConvert.ConvertValue(arrConfig[c++], 0);
        data_builder.Enable = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        //报警联动
        wmp.AlarmLinkage.Builder linkage_builder = new wmp.AlarmLinkage.Builder();
        linkage_builder.MonitorAlarm = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        linkage_builder.SoundAlarm = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        linkage_builder.NotifyCenter = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        linkage_builder.Email = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        linkage_builder.AlarmOut = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        string[] arrLinkage = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrLinkage)
        {
            string[] arrChannel = str.Split(',');
            wmp.AlarmOut.Builder span_builder = new wmp.AlarmOut.Builder();
            span_builder.AlarmOutChannel = Convert.ToInt32(arrChannel[0]);
            span_builder.Enable = Convert.ToInt32(arrChannel[1]) == 1;

            linkage_builder.AlarmOutCfgList.Add(span_builder.Build());
        }
        data_builder.AlarmLinkage = linkage_builder.Build();

        //云台联动
        wmp.PtzLinkage.Builder ptz_builder = new wmp.PtzLinkage.Builder();

        ptz_builder.PresetId = DataConvert.ConvertValue(arrConfig[c++], 0);
        ptz_builder.UsePreset = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        ptz_builder.CuriseId = DataConvert.ConvertValue(arrConfig[c++], 0);
        ptz_builder.UseCurise = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;
        ptz_builder.TrackId = DataConvert.ConvertValue(arrConfig[c++], 0);
        ptz_builder.UseTrack = DataConvert.ConvertValue(arrConfig[c++], 0) == 1;

        data_builder.PtzListList.Add(ptz_builder.Build());

        //报警录像
        string[] arrRecord = arrConfig[c++].ToString().Split('|');

        foreach (string str in arrRecord)
        {
            string[] arrChannel = str.Split(',');
            wmp.ChannelRecord.Builder span_builder = new wmp.ChannelRecord.Builder();
            span_builder.Channel = DataConvert.ConvertValue(arrChannel[0], 0);
            span_builder.Enable = DataConvert.ConvertValue(arrChannel[1], 0) == 1;
            //通道类型：1-模拟通道，2-数字通道
            span_builder.ChannelType = DataConvert.ConvertValue(arrChannel[2], 0);

            data_builder.RecListList.Add(span_builder.Build());
        }

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetAlarmInConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    #region  报警输出
    public ByteString ReadAlarmOut(int alarmOut)
    {
        wmp.device.GetAlarmOutConfigReq.Builder req_builder = new wmp.device.GetAlarmOutConfigReq.Builder();

        req_builder.AlarmOut = alarmOut;

        wmp.device.GetAlarmOutConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    public ByteString BuildAlarmOut(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);
        int c = 0;

        wmp.device.SetAlarmOutConfigReq.Builder req_builder = new wmp.device.SetAlarmOutConfigReq.Builder();

        req_builder.AlarmOut = DataConvert.ConvertValue(arrConfig[c++], 0);

        wmp.AlarmOutConfig.Builder data_builder = new wmp.AlarmOutConfig.Builder();
        data_builder.AlarmOutName = arrConfig[c++].ToString();
        data_builder.DelayTime = DataConvert.ConvertValue(arrConfig[c++], 0);

        req_builder.Cfg = data_builder.Build();

        wmp.device.SetAlarmOutConfigReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion


    #region  重启设备(未开发)
    public ByteString BuildReboot(string strSetting)
    {
        ArrayList arrConfig = this.ParseSettingXml(strSetting);

        wmp.device.RebootReq.Builder req_builder = new wmp.device.RebootReq.Builder();

        wmp.device.RebootReq req = req_builder.Build();

        return req.ToByteString();
    }
    #endregion

    
    #region  中心录像计划

    #endregion
    
}