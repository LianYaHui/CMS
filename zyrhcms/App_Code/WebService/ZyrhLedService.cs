using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using Zyrh.BLL;
using Zyrh.BLL.Led;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Model.Led;

/// <summary>
/// led 的摘要说明
/// </summary>
[WebService(Namespace = "http://www.3gvs.net/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhLedService : System.Web.Services.WebService
{

    private string DBConnectionString = Public.CmsDBConnectionString;
    protected LEDScreen ls = new LEDScreen();

    public ZyrhLedService()
    {

    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    #region  更新信息发送状态
    [WebMethod]
    public bool UpdateInfoDownStatus(int logId, int downStatus, string strDownTime, string strInfoContent, string strErrorCode)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();
            strLog.Append(String.Format("logId:{0},downStatus:{1},strDownTime:{2},strInfoContent:{3},strErrorCode:{4}",
                logId, downStatus, strDownTime, strInfoContent, strErrorCode));
            ServerLog.WriteDebugLog(HttpContext.Current.Request, "UpdateInfoDownStatus", strLog.ToString());

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            DBResultInfo dbResult = im.UpdateDownStatus(logId, string.Empty, downStatus, strDownTime, strInfoContent, strErrorCode);

            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion
    
    #region  更新信息回复状态
    [WebMethod]
    public bool UpdateInfoResponseStatus(int logId, int responseStatus, string strResponseTime, string strResponseContent, string strErrorCode)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();
            strLog.Append(String.Format("logId:{0},responseStatus:{1},strResponseTime:{2},strResponseContent:{3},strErrorCode:{4}",
                logId, responseStatus, strResponseTime, strResponseContent, strErrorCode));
            ServerLog.WriteDebugLog(HttpContext.Current.Request, "UpdateInfoResponseStatus", strLog.ToString());

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            DBResultInfo dbResult = im.UpdateResponseStatus(logId, string.Empty, responseStatus, strResponseTime, strResponseContent, strErrorCode);

            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion
    
    #region  更新信息删除状态
    [WebMethod]
    public bool UpdateInfoDeleteStatus(int logId, int deleteStatus, string strDeleteTime)
    {
        try
        {
            StringBuilder strLog = new StringBuilder();
            strLog.Append(String.Format("logId:{0},deleteStatus:{1},strDeleteTime:{2}",
                logId, deleteStatus, strDeleteTime));
            ServerLog.WriteDebugLog(HttpContext.Current.Request, "UpdateInfoDeleteStatus", strLog.ToString());

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            DBResultInfo dbResult = im.UpdateDeleteStatus(logId, string.Empty, deleteStatus, strDeleteTime);

            return dbResult.iResult > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  获得要下发的信息
    [WebMethod]
    public List<LedInfoToDevice> GetInfo(int infoId)
    {
        try
        {
            List<LedInfoToDevice> lstInfo = new List<LedInfoToDevice>();

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            InfoTypeManage tm = new InfoTypeManage(this.DBConnectionString);

            string strCurrentTime = Public.GetDateTime();

            DBResultInfo dbResult = im.GetLedInfoDevice(-1, infoId, LedScreenInfoStatus.Validity.GetHashCode(), string.Empty, strCurrentTime, 0, 0);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                //过滤掉已经发送成功的有效信息
                string strFilter = "down_status <> 1 and response_status <> 1";
                DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);

                foreach (DataRowView dr in dv)
                {
                    LedScreenInfoDevice dev = im.FillInfoDevice(dr);

                    LedInfoToDevice info = new LedInfoToDevice();
                    info.LogId = dev.Id;
                    info.InfoId = dev.InfoId;
                    info.DevCode = dev.DeviceIndexCode;
                    info.DevTypeCode = dev.DeviceTypeCode;
                    info.MemoryNumber = dev.Info.MemoryNumber;
                    info.IsTiming = dev.Info.IsTiming;
                    info.StartTime = dev.Info.StartTime;
                    info.EndTime = dev.Info.EndTime;
                    info.TimeLimit = dev.Info.Indent;
                    info.Indent = dev.Info.Indent;
                    info.PlaySound = dev.Info.PlaySound;
                    info.PlayTimes = dev.Info.PlayTimes;
                    info.LightType = dev.Info.LightType;
                    info.Status = dev.Status;
                    info.CreateTime = dev.CreateTime;

                    if (dev.ScreenFontSize > 0)
                    {
                        info.ScreenRows = Convert.ToInt32(dev.ScreenCols / dev.ScreenFontSize);
                        info.ScreenCols = Convert.ToInt32(dev.ScreenRows / dev.ScreenFontSize);
                    }

                    info.InfoTypeId = tm.GetTopLevelTypeId(dev.Info.InfoType.ParentTree);

                    info.InfoContent = dev.Info.InfoContent;
                    /*
                    if (!info.DevTypeCode.Equals("501161"))
                    {
                        string strConvert = ls.ConvertContent(dev.Info.InfoContent, info.ScreenCols, dev.Info.Indent, false);
                        info.InfoContent = Base64Coding.EncodingForString(strConvert); 
                    }
                    else
                    {
                        info.InfoContent = dev.Info.InfoContent;
                    }
                    */

                    lstInfo.Add(info);
                }
            }
            return lstInfo;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }

    [WebMethod]
    public List<LedInfoToDevice> GetValidityInfo(string strDevCode)
    {
        try
        {
            List<LedInfoToDevice> lstInfo = new List<LedInfoToDevice>();

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            InfoTypeManage tm = new InfoTypeManage(this.DBConnectionString);
            string strCurrentTime = Public.GetDateTime();

            DBResultInfo dbResult = im.GetLedInfoDevice(-1, -1, LedScreenInfoStatus.Validity.GetHashCode(), strDevCode, strCurrentTime, 0, 0);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                //过滤掉已经发送成功的有效信息
                string strFilter = "down_status <> 1 and response_status <> 1";
                DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);

                foreach (DataRowView dr in dv)
                {
                    LedScreenInfoDevice dev = im.FillInfoDevice(dr);

                    LedInfoToDevice info = new LedInfoToDevice();
                    info.LogId = dev.Id;
                    info.InfoId = dev.InfoId;
                    info.DevCode = dev.DeviceIndexCode;
                    info.DevTypeCode = dev.DeviceTypeCode;
                    info.MemoryNumber = dev.Info.MemoryNumber;
                    info.IsTiming = dev.Info.IsTiming;
                    info.StartTime = dev.Info.StartTime;
                    info.EndTime = dev.Info.EndTime;
                    info.TimeLimit = dev.Info.Indent;
                    info.Indent = dev.Info.Indent;
                    info.PlaySound = dev.Info.PlaySound;
                    info.PlayTimes = dev.Info.PlayTimes;
                    info.LightType = dev.Info.LightType;
                    info.Status = dev.Status;
                    info.CreateTime = dev.CreateTime;

                    if (dev.ScreenFontSize > 0)
                    {
                        info.ScreenRows = Convert.ToInt32(dev.ScreenCols / dev.ScreenFontSize);
                        info.ScreenCols = Convert.ToInt32(dev.ScreenRows / dev.ScreenFontSize);
                    }

                    info.InfoTypeId = tm.GetTopLevelTypeId(dev.Info.InfoType.ParentTree);

                    info.InfoContent = dev.Info.InfoContent;

                    /*
                    if (!info.DevTypeCode.Equals("501161"))
                    {
                        //info.InfoContent = ls.ConvertContent(dev.Info.InfoContent, info.ScreenCols, dev.Info.Indent, false);
                        info.InfoContent = dev.Info.InfoContent;
                    }
                    else
                    {
                        info.InfoContent = dev.Info.InfoContent;
                    }
                    */

                    lstInfo.Add(info);
                }
            }
            return lstInfo;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    #region  获得要删除的信息
    [WebMethod]
    public List<DeviceInfoToRemove> GetDeleteInfo(int infoId)
    {
        try
        {
            List<DeviceInfoToRemove> lstInfo = new List<DeviceInfoToRemove>();

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            string strCurrentTime = Public.GetDateTime();
            string strStatusList = String.Format("{0},{1}", LedScreenInfoStatus.Cancel.GetHashCode(),LedScreenInfoStatus.Deleted.GetHashCode());
            
            DBResultInfo dbResult = im.GetDeviceToRemove(infoId, strStatusList, string.Empty, strCurrentTime);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                string strFilter = "delete_status <> 1 and delete_status <> 3";
                DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);
                foreach (DataRowView dr in dv)
                {
                    LedScreenInfoDevice dev = im.FillInfoDeviceToRemove(dr);

                    DeviceInfoToRemove info = new DeviceInfoToRemove();
                    info.LogId = dev.Id;
                    info.InfoId = dev.InfoId;
                    info.DevCode = dev.DeviceIndexCode;
                    info.DevTypeCode = dev.DeviceTypeCode;
                    info.MemoryNumber = dev.Info.MemoryNumber;
                    info.Status = dev.Status;

                    lstInfo.Add(info);
                }
            }
            return lstInfo;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }

    [WebMethod]
    public List<DeviceInfoToRemove> GetDeleteInfoByDevice(string strDevCode)
    {
        try
        {
            List<DeviceInfoToRemove> lstInfo = new List<DeviceInfoToRemove>();

            InfoDeviceManage im = new InfoDeviceManage(this.DBConnectionString);
            string strCurrentTime = Public.GetDateTime();
            string strStatusList = String.Format("{0},{1}", LedScreenInfoStatus.Cancel.GetHashCode(), LedScreenInfoStatus.Deleted.GetHashCode());

            DBResultInfo dbResult = im.GetDeviceToRemove(-1, strStatusList, strDevCode, strCurrentTime);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                string strFilter = "delete_status <> 1 and delete_status <> 3";
                DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);
                foreach (DataRowView dr in dv)
                {
                    LedScreenInfoDevice dev = im.FillInfoDeviceToRemove(dr);

                    DeviceInfoToRemove info = new DeviceInfoToRemove();
                    info.LogId = dev.Id;
                    info.InfoId = dev.InfoId;
                    info.DevCode = dev.DeviceIndexCode;
                    info.DevTypeCode = dev.DeviceTypeCode;
                    info.MemoryNumber = dev.Info.MemoryNumber;
                    info.Status = dev.Status;

                    lstInfo.Add(info);
                }
            }
            return lstInfo;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

}

#region  要下发的信息
public class LedInfoToDevice
{
    private int log_id = 0;
    public int LogId
    {
        get { return this.log_id; }
        set { this.log_id = value; }
    }

    private int info_id = 0;
    public int InfoId
    {
        get { return this.info_id; }
        set { this.info_id = value; }
    }

    private int type_id = 0;
    public int InfoTypeId
    {
        get { return this.type_id; }
        set { this.type_id = value; }
    }

    private string device_indexcode = string.Empty;
    public string DevCode
    {
        get { return this.device_indexcode; }
        set { this.device_indexcode = value; }
    }

    private string device_type = string.Empty;
    public string DevTypeCode
    {
        get { return this.device_type; }
        set { this.device_type = value; }
    }

    private int memory_number = 0;
    public int MemoryNumber
    {
        get { return this.memory_number; }
        set { this.memory_number = value; }
    }

    private string info_content = string.Empty;
    public string InfoContent
    {
        get { return this.info_content; }
        set { this.info_content = value; }
    }

    private int is_timing = 0;
    public int IsTiming
    {
        get { return this.is_timing; }
        set { this.is_timing = value; }
    }

    private string start_time = string.Empty;
    public string StartTime
    {
        get { return this.start_time; }
        set { this.start_time = value; }
    }

    private string end_time = string.Empty;
    public string EndTime
    {
        get { return this.end_time; }
        set { this.end_time = value; }
    }

    private int time_limit = 1;
    public int TimeLimit
    {
        get { return this.time_limit; }
        set { this.time_limit = value; }
    }

    private int indent = 0;
    public int Indent
    {
        get { return this.indent; }
        set { this.indent = value; }
    }

    private int play_sound = 0;
    public int PlaySound
    {
        get { return this.play_sound; }
        set { this.play_sound = value; }
    }

    private int play_times = 0;
    public int PlayTimes
    {
        get { return this.play_times; }
        set { this.play_times = value; }
    }

    private int light_type = 0;
    public int LightType
    {
        get { return this.light_type; }
        set { this.light_type = value; }
    }

    private int status = 0;
    public int Status
    {
        get { return this.status; }
        set { this.status = value; }
    }

    private int screen_rows = 0;
    public int ScreenRows
    {
        get { return this.screen_rows; }
        set { this.screen_rows = value; }
    }

    private int screen_cols = 0;
    public int ScreenCols
    {
        get { return this.screen_cols; }
        set { this.screen_cols = value; }
    }

    private string create_time = string.Empty;
    public string CreateTime
    {
        get { return this.create_time; }
        set { this.create_time = value; }
    }
}
#endregion

#region  删除的设备信息
public class DeviceInfoToRemove
{
    private int log_id = 0;
    public int LogId
    {
        get { return this.log_id; }
        set { this.log_id = value; }
    }

    private int info_id = 0;
    public int InfoId
    {
        get { return this.info_id; }
        set { this.info_id = value; }
    }

    private string device_indexcode = string.Empty;
    public string DevCode
    {
        get { return this.device_indexcode; }
        set { this.device_indexcode = value; }
    }
    
    private string device_type = string.Empty;
    public string DevTypeCode
    {
        get { return this.device_type; }
        set { this.device_type = value; }
    }

    private int memory_number = 0;
    public int MemoryNumber
    {
        get { return this.memory_number; }
        set { this.memory_number = value; }
    }

    private int status = 0;
    public int Status
    {
        get { return this.status; }
        set { this.status = value; }
    }
}
#endregion