using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Xml;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using TaskBLL;
using Model;
using System.Linq;
using System.Data;

/// <summary>
/// ZyrhMobileService 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhMobileService")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhMobileService : System.Web.Services.WebService
{
    protected string strXmlHeader = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";

    public ZyrhMobileService()
    {

        FoxzyForMySql.MySqlManageUtil.ConncetionString = Public.CmsDBConnectionString;
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  创建XML
    private string BuildXmlItem(string strNodeName, string strContent, bool isTrans)
    {
        if (isTrans && !strContent.Equals(string.Empty))
        {
            return String.Format("<{0}><![CDATA[{1}]]></{2}>", strNodeName, strContent, strNodeName);
        }
        return String.Format("<{0}>{1}</{2}>", strNodeName, strContent, strNodeName);
    }
    #endregion

    #region  输出错误信息
    private string ResponseErrorInfo(Exception ex)
    {
        StringBuilder strItem = new StringBuilder();
        strItem.Append(this.BuildXmlItem("Status", "Failed", false));
        strItem.Append(this.BuildXmlItem("Msg", ex.Message, true));

        StringBuilder strXml = new StringBuilder();
        strXml.Append(strXmlHeader);
        strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

        return strXml.ToString();
    }


    String ResonseErrorInfoJSON(Exception ex)
    {
        var obj = new
        {
            Status = "Failed",
            Msg = ex.Message
        };

        return JsonConvert.SerializeObject(obj);
    }
    #endregion

    #region  用户登录
    [WebMethod(Description = "用户登录"
        + "<br />参数说明：<br />UserName: 用户名(用户名)，UserPwd: 密码(MD5加密后小写) - 设备登录密码,Version: 客户端程序版本"
        + "<br />返回结果: 返回XML格式的字符串。"
        + "<br />成功：<br /><div style=\"line-height:18px;background:#eee;font-size:12px;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?><br />"
        + "&lt;Result><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&lt;Status>Success&lt;/Status><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&lt;Msg>&lt;/Msg><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&lt;Token>32位校验码&lt;/Token><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&lt;Config><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;GpsIntervalTime>GPS采集时间间隔&lt;/GpsIntervalTime><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;GpsUpTime>GPS上报时间间隔&lt;/GpsUpTime><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;FileUploadUrl>图片、文件、录音的上传地址&lt;/FileUploadUrl><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Upgrade>是否需要升级：1-需要升级，0-不升级&lt;/Upgrade><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;UpgradeUrl>升级地址&lt;/UpgradeUrl><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Group>群ID，多个群以|分隔&lt;/Group><br />"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&lt;/Config><br />"
        + "&lt;/Result></div>"
        + "<div style=\"line-height:20px;\">"
        + "失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string UserLogin(string UserName, string UserPwd, string Version)
    {
        try
        {
            StringBuilder strItem = new StringBuilder();

            if (UserPwd.Length != 32)
            {
                UserPwd = Encrypt.MD5Encrypt(UserPwd).ToLower();
            }

            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty) || UserPwd.Equals(string.Empty))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "用户名密码不得为空", true));
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "用户名格式错误", true));
            }
            else
            {
                bool isSuccess = dc.DeviceLogin(UserName, UserPwd);
                if (isSuccess)
                {
                    //Insert
                    //生成默认群组

                    DeviceInfo info = dc.GetDeviceInfo(UserName);
                    TaskBLL.DeviceGroupBLL bll = new DeviceGroupBLL();
                    bll.BuilderGroup(info.UnitId);

                    //=============
                    string strLoginTime = Public.GetDateTime();
                    string strToken = dc.BuildDeviceLoginToken(UserName, strLoginTime);
                    string strLoginIp = new DomainIp().GetIpAddress();
                    if (dc.UpdateDeviceLoginStatus(UserName, strToken, strLoginTime, strLoginIp))
                    {
                        strItem.Append(this.BuildXmlItem("Status", "Success", false));
                        strItem.Append(this.BuildXmlItem("Msg", "", true));
                        strItem.Append(this.BuildXmlItem("Token", strToken, false));
                        strItem.Append("<Config>");
                        strItem.Append(this.BuildXmlItem("GpsIntervalTime", "30", false));
                        strItem.Append(this.BuildXmlItem("GpsUpTime", "30", false));
                        strItem.Append(this.BuildXmlItem("FileUploadUrl", this.GetFileUploadUrl(), true));
                        strItem.Append(this.BuildXmlItem("Upgrade", this.CheckIsNeedUpgrade(Version).ToString(), false));
                        strItem.Append(this.BuildXmlItem("UpgradeUrl", this.GetUpgradeUrl(Version), true));

                        //Update
                        DataTable tbGroup = bll.GetGroupByDeviceCode(UserName);
                        String strGroup = String.Join("|", tbGroup.Rows.OfType<DataRow>().Select(r => Convert.ToString(r["GroupID"])).ToArray());



                        strItem.Append(this.BuildXmlItem("Group", strGroup, false));

                        //End Update

                        strItem.Append("</Config>");

                        if (!Version.Equals(string.Empty))
                        {
                            //更新设备版本
                            new DeviceConfigManage(Public.CmsDBConnectionString).UpdateDeviceConfig(UserName, "device_version", Version);
                        }
                    }
                    else
                    {
                        strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                        strItem.Append(this.BuildXmlItem("Msg", "用户名不存在或密码错误", true));
                    }
                }
                else
                {
                    strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                    strItem.Append(this.BuildXmlItem("Msg", "用户名不存在或密码错误", true));
                }
            }

            StringBuilder strXml = new StringBuilder();
            strXml.Append(strXmlHeader);
            strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

            return strXml.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return this.ResponseErrorInfo(ex);
        }
    }
    #endregion

    #region  修改密码
    [WebMethod(Description = "<div style=\"line-height:20px;\">修改密码"
        + "<br />参数说明：<br />UserName: 用户名，Token: 校验码，OldPwd: 旧密码，NewPwd: 新密码"
        + "<br />返回结果：返回XML格式的字符串。"
        + "<br />成功：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "<br />失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string UpdatePassword(string UserName, string Token, string OldPwd, string NewPwd)
    {
        try
        {
            StringBuilder strItem = new StringBuilder();

            if (OldPwd.Length != 32)
            {
                OldPwd = Encrypt.MD5Encrypt(OldPwd).ToLower();
            }
            if (NewPwd.Length != 32)
            {
                NewPwd = Encrypt.MD5Encrypt(NewPwd).ToLower();
            }

            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty) || NewPwd.Equals(string.Empty))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "用户名密码不得为空", true));
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "用户名格式错误", true));
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "校验码错误", true));
            }
            else if (!dc.DeviceLogin(UserName, OldPwd))
            {
                //校验码错误
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "旧密码输入错误", true));
            }
            else
            {
                if (OldPwd.Equals(NewPwd))
                {
                    strItem.Append(this.BuildXmlItem("Status", "Success", false));
                    strItem.Append(this.BuildXmlItem("Msg", "", true));
                }
                else
                {
                    bool isSuccess = dc.UpdateDevicePwd(UserName, NewPwd);
                    if (isSuccess)
                    {
                        strItem.Append(this.BuildXmlItem("Status", "Success", false));
                        strItem.Append(this.BuildXmlItem("Msg", "", true));
                    }
                    else
                    {
                        strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                        strItem.Append(this.BuildXmlItem("Msg", "密码修改失败，请稍候再试。", true));
                    }
                }
            }

            StringBuilder strXml = new StringBuilder();
            strXml.Append(strXmlHeader);
            strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

            return strXml.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return this.ResponseErrorInfo(ex);
        }
    }
    #endregion

    #region  GPS上报
    [WebMethod(Description = "GPS上报"
        + "<br />参数说明：<br />UserName: 用户名(用户名)，Token: 校验码，GpsInfo: XML格式的GPS信息列表"
        + "<br />&lt;GpsInfo>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;Info>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Longitude>经度&lt;/Longitude>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Latitude>纬度&lt;/Latitude>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Electricity>电量&lt;/Electricity>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Time>采集时间&lt;/Time>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;/Info>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;Info>"
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;..."
        + "<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;/Info>"
        + "<br />&lt;/GpsInfo>"
        + "<div style=\"line-height:20px;\">"
        + "返回结果：返回XML格式的字符串。"
        + "<br />成功：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "<br />失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string GpsReport(string UserName, string Token, string GpsInfo)
    {
        try
        {
            ServerLog.WriteEventLog(HttpContext.Current.Request, "Mobile_GpsReport", String.Format("UserName:{0}, Token:{1}, GpsInfo:{2}", UserName, Token, GpsInfo));

            StringBuilder strItem = new StringBuilder();

            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "用户名不得为空", true));
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "用户名格式错误", true));
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "校验码错误", true));
            }
            else
            {
                List<DeviceGpsInfo> lstInfo = this.ParseGpsInfo(UserName, GpsInfo);
                string strResult = this.SaveGpsInfo(lstInfo);
                if (strResult.Equals(string.Empty))
                {
                    strItem.Append(this.BuildXmlItem("Status", "Success", false));
                    strItem.Append(this.BuildXmlItem("Msg", "", true));
                }
                else
                {
                    strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                    strItem.Append(this.BuildXmlItem("Msg", strResult, true));
                }
            }
            StringBuilder strXml = new StringBuilder();
            strXml.Append(strXmlHeader);
            strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

            return strXml.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return this.ResponseErrorInfo(ex);
        }
    }

    #region  解析GPS信息
    private List<DeviceGpsInfo> ParseGpsInfo(string strDevCode, string strGpsInfo)
    {
        try
        {
            MapCorrect mc = new MapCorrect(8);

            List<DeviceGpsInfo> lstInfo = new List<DeviceGpsInfo>();
            if (!strGpsInfo.Equals(string.Empty))
            {
                XmlDocument xml = new XmlDocument();
                xml.LoadXml(HttpContext.Current.Server.HtmlDecode(strGpsInfo));
                XmlNode root = xml.SelectSingleNode("GpsInfo");
                XmlNodeList nodeList = root.SelectNodes("Info");

                foreach (XmlNode xn in nodeList)
                {
                    DeviceGpsInfo info = new DeviceGpsInfo();
                    info.DevCode = strDevCode;

                    int nc = xn.ChildNodes.Count;
                    foreach (XmlNode x in xn)
                    {
                        switch (x.Name)
                        {
                            case "Longitude":
                                info.Longitude = x.InnerText;
                                break;
                            case "Latitude":
                                info.Latitude = x.InnerText;
                                break;
                            case "Electricity":
                                break;
                            case "Time":
                                info.ReceiveTime = x.InnerText;
                                break;
                            case "Speed":
                                info.Speed = DataConvert.ConvertValue(x.InnerText, 0.0f);
                                break;
                        }

                        //因手机上传的GPS经纬度是 火星坐标系(GCJ-02)，所以需要转换成 地球坐标系(WGS-84)
                        MapLatLng gps = mc.Revert(DataConvert.ConvertValue(info.Latitude, 0.0), DataConvert.ConvertValue(info.Longitude, 0.0));
                        info.Latitude = gps.Lat.ToString();
                        info.Longitude = gps.Lng.ToString();
                    }

                    lstInfo.Add(info);
                }
            }
            return lstInfo;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  保存GPS信息
    private string SaveGpsInfo(List<DeviceGpsInfo> lstInfo)
    {
        try
        {
            DeviceGpsManage dgm = new DeviceGpsManage(Public.CmsDBConnectionString, Public.GpsDBConnectionString);
            string strTableName = string.Empty;
            string strSql = string.Empty;
            foreach (DeviceGpsInfo info in lstInfo)
            {
                strTableName = dgm.BuildGpsTableName(DateTime.Parse(info.ReceiveTime).ToString("yyyyMMdd"));
                strSql = strSql = dgm.BuildGpsInsertSql(strTableName, info);
                dgm.InsertGpsInfo(Public.GpsDBConnectionString, strSql);
            }
            int c = lstInfo.Count;
            if (c > 0)
            {
                DeviceGpsInfo dgi = lstInfo[c - 1];

                //保存设备状态表中的GPS信息
                DeviceStatusInfo dsi = new DeviceStatusInfo();
                dsi.Latitude = dgi.Latitude;
                dsi.Longitude = dgi.Longitude;
                dsi.LastGpsTime = dgi.ReceiveTime;
                dsi.GpsType = 0; //手持终端 为2G设备
                dsi.GpsAddType = 0;
                dsi.Direction = dgi.Direction;
                dsi.Speed = dgi.Speed;
                dsi.Mileage = dgi.Mileage;
                dsi.AccStatus = dgi.AccStatus;
                dsi.AlarmInfo = dgi.AlarmInfo;
                dsi.IoStatus = dgi.IoStatus;
                dsi.DevCode = dgi.DevCode;

                DeviceStatusManage dsm = new DeviceStatusManage(Public.CmsDBConnectionString);
                dsm.UpdateDeviceStatusGps(dsi);
            }
            return string.Empty;
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
    #endregion

    #endregion

    #region  升级
    [WebMethod(Description = "<div style=\"line-height:20px;\">升级"
        + "<br />参数说明：<br />Version: 客户端当前程序版本"
        + "<br />返回结果：XML格式字符串<br />"
        + "<span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>"
        + "<br />&lt;Upgrade>是否需要升级：1-要升级，0-不需要升级&lt;/Upgrade>"
        + "<br />&lt;UpgradeUrl>升级文件的下载地址&lt;/UpgradeUrl>"
        + "<br />&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string Upgrade(string Version)
    {
        StringBuilder strItem = new StringBuilder();
        strItem.Append(this.BuildXmlItem("Status", "Success", false));
        strItem.Append(this.BuildXmlItem("Msg", "", true));

        strItem.Append(this.BuildXmlItem("Upgrade", this.CheckIsNeedUpgrade(Version).ToString(), false));
        strItem.Append(this.BuildXmlItem("UpgradeUrl", this.GetUpgradeUrl(Version), true));

        StringBuilder strXml = new StringBuilder();
        strXml.Append(strXmlHeader);
        strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

        return strXml.ToString();
    }
    #endregion

    #region  检测是否需要升级
    private int CheckIsNeedUpgrade(string strVersion)
    {
        string strCurVersion = Public.GetAppSetting("ApkVersion");
        if (strCurVersion.Equals(string.Empty) || strVersion.Equals(string.Empty))
        {
            return 0;
        }
        else if (strCurVersion.CompareTo(strVersion) == 1)
        {
            return 1;
        }
        return 0;
    }
    #endregion

    #region  获得上传文件的URL
    public string GetFileUploadUrl()
    {
        return String.Format("{0}/ws/MobileFileUpload.ashx?did=%s&token=%s&tid=%s&type=%s&ext=%s&data=%s&marked=%s&upmarked=%s", Public.GetRootUrl());
    }
    #endregion

    #region  获得升级文件的URL
    public string GetUpgradeUrl(string strVersion)
    {
        string strApkFileDir = Public.GetAppSetting("ApkFileDir");
        string strApkFileName = Public.GetAppSetting("ApkFileName");
        if (strApkFileDir.Equals(string.Empty) || strApkFileName.Equals(string.Empty))
        {
            return string.Empty;
        }
        return String.Format("{0}/{1}/{2}", Public.GetRootUrl(), strApkFileDir, strApkFileName).Replace("//", "/");
    }
    #endregion



    #region  任务下载
    [WebMethod(Description = "<div style=\"line-height:20px;\">任务下载（功能未完成）"
        + "<br />参数说明：UserName: 用户名，Token: 校验码"
        + "<br />成功：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "<br />&lt;Result>"
        + "<br />&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>"
        + "<br />&lt;TaskInfo>"

        + "<br />&lt;/TaskInfo>"
        + "<br />&lt;/Result>"
        + "</span>"
        + "<br />失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string TaskDownload(string UserName, string Token, int Tasksource)
    {
        String Status = String.Empty;
        String Msg = String.Empty;
        object list = null;

        try
        {
            TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                bll.InsertLog(Tasksource.ToString());

                var usertable = bll.GetTaskTableByUser(UserName, Tasksource);

                list = usertable.ToDictionary();
                Status = "Success";
            }



            var obj = new
            {
                Status = Status,
                Msg = Msg,
                TaskInfos = list
            };

            IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
            timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";

            String result = JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, timeFormat);
            bll.InsertLog("return JSON:" + result);
            return result;
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }
    #endregion

    #region  任务详情
    [WebMethod(Description = "<div style=\"line-height:20px;\">任务详情（功能未完成）"
        + "<br />参数说明：UserName: 用户名，Token: 校验码, TaskId: 任务ID"
        + "<br />成功：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "<br />&lt;Result>"
        + "<br />&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>"
        + "<br />&lt;TaskDetail>"

        + "<br />&lt;/TaskDetail>"
        + "<br />&lt;/Result>"
        + "</span>"
        + "<br />失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string TaskDetail(string UserName, string Token, int TaskId)
    {
        String Status = String.Empty;
        String Msg = String.Empty;
        object info = null;

        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                var usertable = bll.GetTaskTableByID(TaskId);

                if (usertable.Rows.Count == 0)
                {
                    return ResonseErrorInfoJSON(new Exception("找不到该ID的值"));
                }
                String std = Convert.ToString(usertable.Rows[0][0]);

                var FaultLeave = CodeReader.GetCodeByType(10000);//故障等级

                var FaultText = CodeReader.GetCodeByType(20000);//故障描述

                info = new
                {
                    Specifications = std,
                    FaultLeave = FaultLeave.ToDictionary(),
                    FaultText = FaultText.Rows.OfType<DataRow>()
                    .Select(r => Convert.ToString(r["text"]))
                };


                Status = "Success";

            }


            var obj = new
            {
                Status = Status,
                Msg = Msg,
                TaskInfo = info
            };

            return JsonConvert.SerializeObject(obj);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }
    #endregion

    #region  任务汇报
    [WebMethod(Description = "<div style=\"line-height:20px;\">任务汇报（功能未完成）"
        + "<br />参数说明：UserName: 用户名，Token: 校验码，TaskInfo: 任务信息"
        + "<br />成功：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "<br />失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string TaskReport(string UserName, string Token, string TaskInfo)
    {
        String Status = String.Empty;
        String Msg = String.Empty;

        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                bll.InsertLog(TaskInfo);


                //
                Status = "Success";
                //TODO


            }


            var obj = new
            {
                Status = Status,
                Msg = Msg
            };

            IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
            timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";

            return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, timeFormat);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }
    #endregion

    #region  更新任务
    [WebMethod(Description = "<div style=\"line-height:20px;\">更新任务（功能未完成）"
        + "<br />更新任务中的图片音视频信息"
        + "<br />参数说明：UserName: 用户名，Token: 校验码，TaskInfo: 任务信息"
        + "<br />成功：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Success&lt;/Status>&lt;Msg>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "<br />失败：<br /><span style=\"background:#eee;display:inline-block;\">"
        + "&lt;?xml version=\"1.0\" encoding=\"utf-8\" ?>"
        + "&lt;Result>&lt;Status>Failed&lt;/Status>&lt;Msg>&lt;![CDATA[错误信息]]>&lt;/Msg>&lt;/Result>"
        + "</span>"
        + "</div>"
    )]
    public string UpdateTask(string UserName, string Token, string TaskInfo)
    {
        String Status = String.Empty;
        String Msg = String.Empty;

        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                bll.InsertLog(TaskInfo);

                //进行检验
                Status = "Success";
                //TODO


            }


            var obj = new
            {
                Status = Status,
                Msg = Msg
            };

            IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
            timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";

            return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, timeFormat);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }
    #endregion

    #region  获取代码映射值
    [WebMethod]
    public string GetCodeValue(string UserName, string Token, int CodeType)
    {
        String Status = String.Empty;
        String Msg = String.Empty;
        List<Dictionary<String, Object>> dict = new List<Dictionary<String, Object>>();

        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                bll.InsertLog("GetCodeValue" + CodeType.ToString());


                var data = CodeReader.GetCodeTableByType(CodeType, UserName);
                dict = data.ToDictionary();

                //进行检验
                Status = "Success";
                //TODO

            }


            var obj = new
            {
                Status = Status,
                Msg = Msg,
                infos = dict
            };
            return JsonConvert.SerializeObject(obj);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }
    #endregion


    [WebMethod(Description = "<div style=\"line-height:20px;\">延迟的上报任务"
       + "<br />参数说明：UserName: 用户名，Token: 校验码，TaskInfos: 任务信息"
    )]
    public String UploadTask(string UserName, string Token, string TaskInfos)
    {
        String Status = String.Empty;
        String Msg = String.Empty;
        Dictionary<String, Object> info = TaskInfos.JsonStringToDictionary<Dictionary<String, Object>>();

        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                bll.InsertLog("in UploadTask:" + TaskInfos);

                //
                Status = "Success";
                //TODO

                String markID = Convert.ToString(info["mark"]);

                //图片
                IEnumerable<String> ImgUpinfo = Convert.ToString(info["pictureUrl"]).JsonStringToDictionary<IEnumerable<String>>();
                foreach (String url in ImgUpinfo)
                {
                    var imgInfo = new
                    {
                        ID = 0,
                        UpLoadType = Convert.ToInt32(TaskBLL.UpLoadFileType.Image),
                        UpLoadURL = url,
                        MarkID = markID,
                        UploadDate = DateTime.Now,
                        isEnable = true,
                        FileName = Helper.GetFileName(url, false)
                    };

                    bll.Insert("uploadtaskinfo", imgInfo);
                }





            }


            var obj = new
            {
                Status = Status,
                Msg = Msg
            };

            IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
            timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";

            return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, timeFormat);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }

    /// <summary>
    /// 获取该人员的上级的描述和评价
    /// </summary>
    /// <param name="UserName"></param>
    /// <param name="Token"></param>
    /// <param name="BeginNum"></param>
    /// <param name="EndNum"></param>
    /// <returns></returns>
    [WebMethod]
    public String GetTaskDesc(string UserName, string Token, int BeginNum, int EndNum)
    {
        String Status = String.Empty;
        String Msg = String.Empty;
        List<Dictionary<String, object>> infos = null;

        try
        {
            if (EndNum <= BeginNum)
                throw new Exception("开始的索引不能大于结束的索引");

            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);
            if (UserName.Equals(string.Empty))
            {
                Status = "Failed";
                Msg = "用户名不得为空";
            }
            else if (!dc.CheckDeviceCodeFormat(UserName))
            {
                //用户名格式错误
                Status = "Failed";
                Msg = "用户名格式错误";
            }
            else if (!dc.CheckDeviceToken(UserName, Token))
            {
                //校验码错误
                Status = "Failed";
                Msg = "校验码错误";
            }
            else
            {
                //
                Status = "Success";
                //TODO
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                var usertable = bll.GetTaskDesc(UserName, BeginNum, EndNum);

                infos = usertable.ToDictionary();
                Status = "Success";
            }


            var obj = new
            {
                Status = Status,
                Msg = Msg,
                Desc = infos
            };

            IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
            timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";

            return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, timeFormat);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }

    [WebMethod]
    public String DownGroupDevice(int GroupID)
    {
        String Status = String.Empty;
        String Msg = String.Empty;
        List<Dictionary<String, Object>> Deviceinfos = new List<Dictionary<string, object>>();

        try
        {

            TaskBLL.DeviceGroupBLL bll = new TaskBLL.DeviceGroupBLL();
            //


            Deviceinfos = bll.GetGroupDevice(GroupID).ToDictionary();
            //TODO
            Status = "Success";

            var obj = new
            {
                Status = Status,
                Msg = Msg,
                Deviceinfos = Deviceinfos
            };

            IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
            timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";

            return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, timeFormat);
        }
        catch (Exception ex) { return this.ResonseErrorInfoJSON(ex); }
    }


}