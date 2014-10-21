using System;
using System.Web;
using System.Collections;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using Zyrh.DBUtility;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

/// <summary>
/// ZyrhRecordService 的摘要说明
/// </summary>
public class ZyrhRecordService : System.Web.Services.WebService
{
    public ZyrhRecordService()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod(Description = "获取设备录像计划，strDevCode:设备索引编号，如果获取全部设备，可以为空；如果有多个设备编号，每个之间以英文逗号“,”分隔;serverId:服务器ID，若为0表示不选择服务器")]
    public string GetRecordPlan(string strDevCode, int serverId)
    {
        try
        {
            StringBuilder strXml = new StringBuilder();

            strXml.Append(new RecordPlanManage().GetRecordPlan(strDevCode, serverId));

            return strXml.ToString();
        }
        catch (Exception ex)
        {
            return "error";
        }
    }

    #region  获得设备编号
    private string GetDeviceCodeList(string strDevCode)
    {
        try
        {
            StringBuilder strNewDevCode = new StringBuilder();
            Hashtable htDev = new Hashtable();
            string strCode = string.Empty;

            if (strDevCode.Equals(string.Empty))
            {
                DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
                strDevCode = dm.GetDeviceIndexCode(string.Empty, string.Empty, string.Empty);
            }

            string[] delimiter = { "," };
            string[] arrDevCode = strDevCode.Split(delimiter, StringSplitOptions.RemoveEmptyEntries);
            foreach (string str in arrDevCode)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }
                strCode = str.Replace("'", "");
                if (!htDev.Contains(strCode))
                {
                    htDev.Add(strCode, strCode);
                    strNewDevCode.Append(String.Format(",{0}", strCode));
                }
            }
            if (strNewDevCode.Length > 0)
            {
                strDevCode = strNewDevCode.ToString().Substring(1);
            }

            return strDevCode;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    [WebMethod(Description = "获取中心录像计划"
        + "<br />参数说明：<br />"
        + "serverId: 服务器ID，输入-1表示获取所有服务器<br />"
        + "strDevCode: 设备索引编号，可以多个，每个编号之间以英文逗号分隔，如果编号为空表示获取全部设备<br />"
        + "channelNo: 通道编号(从1开始)，输入-1表示获取全部通道<br />"
        + "resultType: 结果输出类型，1-标准输出，2-完整输出<br />"
        + "返回结果：<br />"
        + "成功: 返回XML格式字符串<br />"
        + "失败：返回 None（无录像计划）<br />"
        + "错误：返回 Error "
    )]
    public string GetCenterRecordPlan(int serverId, string strDevCode, int channelNo, int resultType)
    {
        try
        {
            bool isAll = resultType == 2;
            StringBuilder strNewDevCode = new StringBuilder();
            string[] delimiter = { "," };

            string strDevCodeList = this.GetDeviceCodeList(strDevCode);
            if (strDevCodeList.Equals(string.Empty))
            {
                return "None";
            }
            bool isMulti = !strDevCodeList.Equals(string.Empty) && strDevCodeList.Split(',').Length > 1;
            string[] arrDevCode = strDevCodeList.Split(',');

            StringBuilder strResult = new StringBuilder();
            DeviceCenterRecordPlanManage drm = new DeviceCenterRecordPlanManage(Public.CmsDBConnectionString);
            //DBResultInfo dbResult = drm.GetDeviceCenterRecordPlan(serverId, strDevCode, channelNo);
            //暂时先屏蔽serverId
            DBResultInfo dbResult = drm.GetDeviceCenterRecordPlan(-1, strDevCode, channelNo);
            DataSet ds = dbResult.dsResult;

            DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
            DBResultInfo dbResultDev = dm.GetDeviceBaseInfoList(string.Empty);
            DataSet dsDev = dbResultDev.dsResult;
            bool isHasDev = false;
            int serverLineId = 0;

            if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
            {
                isHasDev = true;
            }

            DeviceCameraManage dcm = new DeviceCameraManage(Public.CmsDBConnectionString);
            DBResultInfo dbResultCamera = dcm.GetDeviceCameraInfo(-1, string.Empty, -1);
            DataSet dsCamera = dbResultCamera.dsResult;
            bool isHasCamera = false;
            if (dsCamera != null && dsCamera.Tables[0] != null && dsCamera.Tables[0].Rows.Count > 0)
            {
                isHasCamera = true;
            }

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append("<RecordPlan>");
                strResult.Append("<DeviceList>");
                if (isMulti)
                {
                    foreach (string strCode in arrDevCode)
                    {
                        DataView dv = new DataView(ds.Tables[0], String.Format("device_indexcode='{0}'", strCode), "", DataViewRowState.CurrentRows);
                        if (dv.Count > 0)
                        {
                            if (isHasDev)
                            {
                                DataView dvDev = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", strCode), "", DataViewRowState.CurrentRows);
                                if (dvDev.Count > 0)
                                {
                                    DeviceInfo di = dm.FillDeviceBaseInfo(dvDev[0]);
                                    if (di.ServerLine.LineCode >= 0)
                                    {
                                        serverLineId = di.ServerLine.LineCode;
                                    }
                                }
                            }
                            strResult.Append("<Device>");
                            strResult.Append(String.Format("<DeviceCode>{0}</DeviceCode>", strCode));
                            strResult.Append(String.Format("<ServerLineId>{0}</ServerLineId>", serverLineId));
                            strResult.Append("<ChannelList>");
                            foreach (DataRowView drv in dv)
                            {
                                DeviceCameraInfo camera = new DeviceCameraInfo();
                                DeviceCenterRecordPlan info = drm.FillCenterRecordPlan(drv);
                                if (isHasCamera)
                                {
                                    DataView dvCamera = new DataView(dsCamera.Tables[0], String.Format("index_code='{0}' and channel_no = {1}", info.DevCode, info.ChannelNo), "", DataViewRowState.CurrentRows);

                                    if (dvCamera.Count > 0)
                                    {
                                        camera = dcm.FillDeviceCamera(dvCamera[0]);
                                    }
                                }
                                strResult.Append(drm.ParseRecordTimeConfig(strDevCode, info, camera, isAll));
                            }
                            strResult.Append("</ChannelList>");
                            strResult.Append("</Device>");
                        }
                    }
                }
                else
                {
                    DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);
                    if (di !=null)
                    {
                        if (di.ServerLine.LineCode >= 0)
                        {
                            serverLineId = di.ServerLine.LineCode;
                        }
                    }

                    strResult.Append("<Device>");
                    strResult.Append(String.Format("<DeviceCode>{0}</DeviceCode>", strDevCode));
                    strResult.Append(String.Format("<ServerLineId>{0}</ServerLineId>", serverLineId));
                    strResult.Append("<ChannelList>");
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DeviceCameraInfo camera = new DeviceCameraInfo();
                        DeviceCenterRecordPlan info = drm.FillCenterRecordPlan(dr);
                        if (isHasCamera)
                        {
                            DataView dvCamera = new DataView(dsCamera.Tables[0], String.Format("index_code='{0}' and channel_no = {1}", info.DevCode, info.ChannelNo), "", DataViewRowState.CurrentRows);

                            if (dvCamera.Count > 0)
                            {
                                camera = dcm.FillDeviceCamera(dvCamera[0]);
                            }
                        }
                        strResult.Append(drm.ParseRecordTimeConfig(strDevCode, info, camera, isAll));
                    }
                    strResult.Append("</ChannelList>");
                    strResult.Append("</Device>");
                }
                strResult.Append("</DeviceList>");
                strResult.Append("</RecordPlan>");
            }
            else
            {
                strResult.Append("None");
            }

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return "Error";
        }
    }
}
