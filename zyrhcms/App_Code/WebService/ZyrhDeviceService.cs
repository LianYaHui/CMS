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
using Zyrh.Model;
using Zyrh.Model.Device;

/// <summary>
/// ZyrhDeviceService 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhDeviceService")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhDeviceService : System.Web.Services.WebService
{
    protected string strXmlHeader = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";

    public ZyrhDeviceService()
    {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
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
    #endregion
        

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    #region  获得设备信息列表
    private string GetDeviceInfoList(string strDevCodeList)
    {
        try
        {
            StringBuilder strItem = new StringBuilder();
            StringBuilder strSub = new StringBuilder();

            strItem.Append(this.BuildXmlItem("Status", "Success", false));
            strItem.Append(this.BuildXmlItem("Msg", "", true));

            strItem.Append("<DeviceList>");

            DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);


            if (strDevCodeList.EndsWith(","))
            {
                //strDevCodeList = strDevCodeList.Substring(0, strDevCodeList.Length - 1);
            }
            DBResultInfo dbResult = dm.GetDeviceBaseInfoList(strDevCodeList, string.Empty);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceBaseInfo(dr);
                    strSub.Length = 0;

                    strSub.Append(this.BuildXmlItem("DeviceCode", di.DevCode, false));
                    strSub.Append(this.BuildXmlItem("Status3G", di.devStatus.Status3G.ToString(), false));
                    strSub.Append(this.BuildXmlItem("Status2G", di.devStatus.Status2G.ToString(), false));
                    strSub.Append(this.BuildXmlItem("Latitude", di.devStatus.Latitude, false));
                    strSub.Append(this.BuildXmlItem("Longitude", di.devStatus.Longitude, false));
                    strSub.Append(this.BuildXmlItem("GpsTime", di.devStatus.LastGpsTime, false));

                    strItem.Append(this.BuildXmlItem("Device", strSub.ToString(), false));
                }
            }
            strItem.Append("</DeviceList>");

            StringBuilder strXml = new StringBuilder();
            strXml.Append(strXmlHeader);
            strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

            return strXml.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得设备列表
    [WebMethod(Description = "获取设备列表<br />参数说明：arrDevCodeList - 设备编号数组")]
    public string GetDeviceList(string[] arrDevCodeList)
    {
        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);

            StringBuilder strDevCodeList = new StringBuilder();
            foreach (string str in arrDevCodeList)
            {
                if (dc.CheckDeviceCodeFormat(str))
                {
                    strDevCodeList.Append(",");
                    strDevCodeList.Append(str);
                }
            }
            if (strDevCodeList.Length > 0)
            {
                return this.GetDeviceInfoList(strDevCodeList.ToString().Substring(1));
            }
            else
            {
                return this.GetDeviceInfoList(string.Empty);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return this.ResponseErrorInfo(ex);
        }
    }
    #endregion

    #region  获得单个设备信息
    [WebMethod(Description = "获取单个设备信息<br />参数说明：strDevCode - 设备编号")]
    public string GetDeviceInfo(string strDevCode)
    {
        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);

            StringBuilder strItem = new StringBuilder();

            bool isPass = false;

            if (!dc.CheckDeviceCodeFormat(strDevCode))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "设备编号格式错误", true));
            }
            else if (!dc.CheckDeviceIsExist(strDevCode))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "设备不存在", true));
            }
            else
            {
                isPass = true;
            }
            if (!isPass)
            {
                StringBuilder strXml = new StringBuilder();
                strXml.Append(strXmlHeader);
                strXml.Append(this.BuildXmlItem("Result", strItem.ToString(), false));

                return strXml.ToString();
            }

            return this.GetDeviceInfoList(strDevCode);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return this.ResponseErrorInfo(ex);
        }
    }
    #endregion

    #region  获得设备GPS历史记录
    [WebMethod(Description = "获取单个设备GPS列表<br />参数说明：<br />strDevCode: 设备编号<br />strStartTime:开始时间(时间格式：yyyy-MM-dd HH:mm:ss)<br />"
        + "strEndTime: 结束时间<br />pageIndex: 分页码<br />pageSize: 每页条数<br />isDesc: 是否降序排序，true-降序，false-升序")]
    public string GetGpsLog(string strDevCode, string strStartTime, string strEndTime, int pageIndex, int pageSize, bool isDesc)
    {
        try
        {
            DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);

            StringBuilder strItem = new StringBuilder();
            StringBuilder strSub = new StringBuilder();

            if (pageIndex < 0 || pageSize < 0)
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "无效的分页页码", true));
            }
            else if (!dc.CheckDeviceCodeFormat(strDevCode))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "设备编号格式错误", true));
            }
            else if (!dc.CheckDeviceIsExist(strDevCode))
            {
                strItem.Append(this.BuildXmlItem("Status", "Failed", false));
                strItem.Append(this.BuildXmlItem("Msg", "设备不存在", true));
            }
            else
            {
                DeviceGpsManage dgm = new DeviceGpsManage(Public.CmsDBConnectionString, Public.GpsDBConnectionString);
                string strFieldList = "";
                if (strStartTime.Equals(string.Empty))
                {
                    strStartTime = String.Format("{0} 0:00:00", Public.GetDate());
                }
                if (strEndTime.Equals(string.Empty))
                {
                    strEndTime = String.Format("{0} 23:59:59", Public.GetDate());
                }

                strItem.Append(this.BuildXmlItem("Status", "Success", false));
                strItem.Append(this.BuildXmlItem("Msg", "", true));
                strItem.Append(this.BuildXmlItem("DeviceCode", strDevCode, false));

                strItem.Append(this.BuildXmlItem("DataCount", dgm.GetGpsLogTotal(strDevCode, strStartTime, strEndTime).ToString(), false));
                strItem.Append("<GpsList>");

                List<DeviceGpsInfo> lstGps = dgm.GetDeviceGpsLogInfo(strDevCode, strFieldList, strStartTime, strEndTime, pageIndex, pageSize, isDesc);
                if (lstGps.Count > 0)
                {
                    foreach (DeviceGpsInfo info in lstGps)
                    {
                        strSub.Length = 0;

                        strSub.Append(this.BuildXmlItem("Latitude", info.Latitude, false));
                        strSub.Append(this.BuildXmlItem("Longitude", info.Longitude, false));
                        strSub.Append(this.BuildXmlItem("ReceiveTime", Public.ConvertDateTime(info.ReceiveTime), false));

                        strItem.Append(this.BuildXmlItem("Gps", strSub.ToString(), false));
                    }
                }
                strItem.Append("</GpsList>");
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

}