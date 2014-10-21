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
using Zyrh.DBUtility;

/// <summary>
/// ZyrhPictureAlarm 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhPictureAlarmService")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhPictureAlarm : System.Web.Services.WebService
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GprsDBConnectionString = Public.GprsDBConnectionString;
    protected string PicDBConnectionString = Public.PicDBConnectionString;
    protected DeviceManage dm;
    protected DeviceConfigManage dcm;
    protected DeviceGprsManage dgm;
    protected ServerManage sm;

    public ZyrhPictureAlarm()
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

    #region  获得设备编号列表
    [WebMethod(Description = "获得设备编号")]
    public ArrayList GetDeviceBaseInfo()
    {
        try
        {
            ArrayList arrDev = new ArrayList();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);

            string strDevCodeList = dm.GetDeviceIndexCode(string.Empty, string.Empty, string.Empty);
            string[] arr = strDevCodeList.Split(',');
            foreach (string str in arr)
            {
                arrDev.Add(str);
            }
            return arrDev;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    #endregion

    #region  获得设备预置点配置信息
    [WebMethod(Description = "获得设备预置点配置信息")]
    public List<PresetConfigInfo> GetDevicePresetInfo(string strDevCode)
    {
        try
        {
            List<PresetConfigInfo> lstPresetConfig = new List<PresetConfigInfo>();

            PresetConfigManage pcm = new PresetConfigManage(this.DBConnectionString);

            DBResultInfo dbResult = pcm.GetPresetConfig(strDevCode, 0, 0, 0, 0);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PresetConfigInfo pci = pcm.FillPresetConfigInfo(dr);
                    lstPresetConfig.Add(pci);
                }
            }

            return lstPresetConfig;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    #region  获得预置点感兴趣区域
    [WebMethod(Description = "获得预置点感兴趣区域")]
    public List<PresetConfigInterestArea> GetPresetConfigInterestArea(string strDevCode, int channelNo, int presetNo)
    {
        try
        {
            List<PresetConfigInterestArea> lstPresetConfig = new List<PresetConfigInterestArea>();

            PresetConfigManage pcm = new PresetConfigManage(this.DBConnectionString);

            DBResultInfo dbResult = pcm.GetPresetConfigInterestArea(strDevCode, channelNo, presetNo, 0, 0);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PresetConfigInterestArea pci = pcm.FillPresetConfigInterestArea(dr);
                    lstPresetConfig.Add(pci);
                }
            }

            return lstPresetConfig;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    #region  获得设备抓图
    [WebMethod(Description = "根据设备编号通道编号预置点编号 获得设备抓图（指定时间段内），strDevCode:空值表示不指定；channelNo:0-表示不指定；presetNo:0-表示不指定；status:0-未分析，1-已分析，-1表示全部")]
    public List<UploadFileInfoForServer> GetUploadFileInfo(string strDevCode, int channelNo, int presetNo, string strStartTime, string strEndTime, int status)
    {
        try
        {
            return this.GetDeviceUploadFileInfo(strDevCode, channelNo, presetNo, strStartTime, strEndTime, status);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    #region  获得所有设备抓图
    [WebMethod(Description = "获得指定时间段内所有设备抓图 strStartTime:yyyy-MM-dd HH:mm:ss；strEndTime:yyyy-MM-dd HH:mm:ss；status:0-未分析，1-已分析，-1表示全部")]
    public List<UploadFileInfoForServer> GetAllUploadFileInfo(string strStartTime, string strEndTime, int status)
    {
        try
        {
            return this.GetDeviceUploadFileInfo(string.Empty, 0, 0, strStartTime, strEndTime, status);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion


    #region  获得设备抓图信息
    public List<UploadFileInfoForServer> GetDeviceUploadFileInfo(string strDevCode, int channelNo, int presetNo, string strStartTime, string strEndTime, int status)
    {
        try
        {
            List<UploadFileInfoForServer> lstFile = new List<UploadFileInfoForServer>();
            DeviceUploadFileManage ufm = new DeviceUploadFileManage(this.PicDBConnectionString);

            DateTime dtStart = DateTime.Parse(strStartTime);
            DateTime dtEnd = DateTime.Parse(strEndTime);
            int months = (dtEnd.Year - dtStart.Year) * 12 + (dtEnd.Month - dtStart.Month);

            for (int i = 0; i <= months; i++)
            {
                string strTableName = "upload_file_info_" + dtEnd.AddMonths(-i).ToString("yyyyMM");
                if (!DBConnection.CheckTableIsExists(this.PicDBConnectionString, strTableName))
                {
                    continue;
                }
                DBResultInfo dbResult = ufm.GetUploadFileInfo(strTableName, strDevCode, channelNo, presetNo, status, strStartTime, strEndTime, 0, -1, -1, 0, 0);
                DataSet ds = dbResult.dsResult;
                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        UploadFileInfoForServer ufi = ufm.FillUploadFileBaseInfo(dr);
                        lstFile.Add(ufi);
                    }
                }
            }
            return lstFile;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion


    #region  获得参考图
    [WebMethod(Description = "获得参考图")]
    public List<ReferencePictureInfo> GetReferencePicture(string strDevCode, int channelNo, int presetNo, int addType)
    {
        try
        {
            List<ReferencePictureInfo> lstFile = new List<ReferencePictureInfo>();
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);

            DBResultInfo dbResult = rpm.GetReferencePictureInfo(strDevCode, channelNo, presetNo, addType);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ReferencePictureInfo rpi = rpm.FillReferencePicture(dr);
                    lstFile.Add(rpi);
                }
            }
            return lstFile;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    #region  批量添加参考图
    [WebMethod(Description = "批量添加参考图")]
    public int BatchAddReferencePicture(ReferencePictureInfoForServer[] lstPicture)
    {
        try
        {
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);
            int c = lstPicture.Length;
            int n = 0;
            int i = 0;
            int t = 0;
            StringBuilder strSql = new StringBuilder();
            foreach (ReferencePictureInfoForServer pic in lstPicture)
            {
                ReferencePictureInfo rpi = new ReferencePictureInfo();
                rpi.DevCode = pic.DevCode;
                rpi.ChannelNo = pic.ChannelNo;
                rpi.PresetNo = pic.PresetNo;
                rpi.PicturePath = pic.PicturePath;
                rpi.DevId = pic.DevId;
                rpi.CameraId = pic.CameraId;
                rpi.PresetId = pic.PresetId;

                strSql.Append(rpm.BuildAddReferencePictureSql(rpi));

                if (i >= 99 || t >= c - 1)
                {
                    n += rpm.AddReferencePicture(strSql.ToString());

                    //清除SQL语句，防止重复添加
                    strSql.Length = 0;
                    i = 0;
                }
                else
                {
                    i++;
                }
                t++;
            }
            return n;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return -1;
        }
    }
    #endregion

    #region  删除参考图
    [WebMethod(Description = "删除参考图，strIdList：参考图ID列表，以英文逗号分隔，示例：1,2,3,6,8")]
    public bool DeleteReferencePicture(string strIdList)
    {
        try
        {
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);
            return rpm.DeleteReferencePicture(strIdList) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  添加图片报警信息
    [WebMethod(Description = "添加图片报警信息")]
    public int AddPictureAlarm(string strMonth, PictureAlarmInfo pai)
    {
        try
        {
            try
            {
                PresetConfigManage pcm = new PresetConfigManage(this.DBConnectionString);
                PictureAlarmManage pam = new PictureAlarmManage(this.PicDBConnectionString);

                string strTableName = pam.BuildPictureAlarmTableName(strMonth);// "picture_alarm_log_" + strMonth;
                if (!pam.CheckDataTableIsExist(strTableName))
                {
                    pam.CreatePictureAlarmTable(strTableName);
                }

                if (pai.AlarmTime.Equals(string.Empty))
                {
                    pai.AlarmTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                }
                if (pai.CreateTime.Equals(string.Empty))
                {
                    pai.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                }
                if (pai.UpdateTime.Equals(string.Empty))
                {
                    pai.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                }
                string strSql = pam.BuildAddPictureAlarmSql(strTableName, pai);
                string strConfig = string.Empty;

                int rid = pam.AddPictureAlarm(strSql);
                int alarmLogId = rid > 0 ? DBConnection.GetMaxId(this.PicDBConnectionString, strTableName, "id") : 0;

                PresetConfigInfo pci = new PresetConfigInfo();
                pci.DevCode = pai.DevCode;
                pci.ChannelNo = pai.ChannelNo;
                pci.PresetNo = pai.PresetNo;
                pci.AlarmType = pai.AlarmType;
                pci.AlarmLevel = pai.AlarmLevel;
                pci.AlarmTime = pai.AlarmTime;
                pci.AlarmInfo = pai.AlarmInfo;
                pci.AlarmArea = pai.AlarmArea;
                //报警记录ID
                pci.AlarmLogId = alarmLogId;
                pci.AlarmMonth = strMonth;
                pci.AlarmInterestArea = pai.InterestArea;
                pci.ReferencePicuture = pai.ReferencePath;
                pci.AlarmPicture = pai.PicturePath;
                pci.ReferenceDomain = pai.ReferenceDomain;
                pci.CreateTime = pai.CreateTime;
                pci.UpdateTime = pai.UpdateTime;

                if (pcm.CheckPresetConfigIsExist(pai.DevCode, pai.ChannelNo, pai.PresetNo))
                {
                    strConfig = pcm.BuildUpdatePresetConfigPictureAlaarmSql(pci);
                }
                else
                {
                    strConfig = pcm.BuildAddPresetConfigPictureAlaarmSql(pci);
                }
                pcm.UpdatePresetConfigPictureAlarm(strConfig);

                return alarmLogId;
            }
            catch (Exception ex)
            {
                ServerLog.WriteErrorLog(ex, HttpContext.Current);
                return -1;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return -1;
        }
    }
    #endregion

    #region  更新上传图片为已分析
    [WebMethod(Description = "更新上传图片为已分析 strMonth:图片存储的月份（格式：201304）；id:图片ID")]
    public bool UpdatePictureStatus(string strMonth, int id)
    {
        try
        {
            DeviceUploadFileManage ufm = new DeviceUploadFileManage(this.PicDBConnectionString);
            int status = 1;
            string strTableName = ufm.BuildUploadFileTableName(strMonth);// "upload_file_info_" + strMonth;

            return ufm.UpdateFileStatus(strTableName, id, status) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  批量更新上传图片为已分析
    [WebMethod(Description = "批量更新上传图片为已分析 strMonth:图片存储的月份（格式：201304）；strIdList:图片ID列表，以英文逗号分隔，示例：1,2,3,6,8")]
    public bool BatchUpdatePictureStatus(string strMonth, string strIdList)
    {
        try
        {
            DeviceUploadFileManage ufm = new DeviceUploadFileManage(this.PicDBConnectionString);
            int status = 1;
            string strTableName = ufm.BuildUploadFileTableName(strMonth);// "upload_file_info_" + strMonth;

            return ufm.BatchUpdateFileStatus(strTableName, strIdList, status) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  获得抓拍图物理目录根目录
    [WebMethod(Description = "获得抓拍图物理目录根目录  返回空值表示获取目录失败，可能CMS平台运行不正常")]
    public string GetCapturePictureDir()
    {
        try
        {
            return new CmsApi().GetCapturePictureDir();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return string.Empty;
        }
    }
    #endregion

    #region  获得当前时间
    private string GetDateTime()
    {
        return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    }
    #endregion

    #region  更新图像比对服务器心跳时间
    [WebMethod(Description = "更新图像比对服务器心跳时间，更新频率：60秒")]
    public bool UpdateImageServerHeartBeat(string strUpdateTime)
    {
        try
        {
            if (strUpdateTime.Equals(string.Empty)) strUpdateTime = this.GetDateTime();
            this.sm = new ServerManage(this.DBConnectionString);
            return true;
            //return this.sm.UpdateServerStatus(ServerTypeEnum.ImageServer.GetHashCode(), 1, strUpdateTime) > 0;
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
        this.sm = new ServerManage(this.DBConnectionString);
        return true;
        //return this.sm.UpdateServerStatus(serverType.GetHashCode(), 1, strUpdateTime) > 0;
    }
    #endregion

    #region  批量添加图片报警信息  未完成
    public int BatchAddPictureAlarm(string strMonth, PictureAlarmInfo[] lstAlarm)
    {
        try
        {
            try
            {
                PresetConfigManage pcm = new PresetConfigManage(this.DBConnectionString);
                PictureAlarmManage pam = new PictureAlarmManage(this.PicDBConnectionString);

                int c = lstAlarm.Length;
                int n = 0;
                int i = 0;
                StringBuilder strSql = new StringBuilder();
                StringBuilder strSql1 = new StringBuilder();
                string strTableName = "upload_file_info_" + strMonth;
                if (!pam.CheckDataTableIsExist(strTableName))
                {
                    pam.CreatePictureAlarmTable(strTableName);
                }

                foreach (PictureAlarmInfo pai in lstAlarm)
                {
                    PresetConfigInfo pci = new PresetConfigInfo();
                    pci.AlarmType = pai.AlarmType;
                    pci.AlarmLevel = pai.AlarmType;
                    pci.AlarmInfo = pai.AlarmInfo;
                    pci.AlarmArea = pai.AlarmArea;


                    strSql.Append(pam.BuildAddPictureAlarmSql(strTableName, pai));

                    if (pcm.CheckPresetConfigIsExist(pai.DevCode, pai.ChannelNo, pai.PresetNo))
                    {
                        strSql1.Append(pcm.BuildUpdatePresetConfigPictureAlaarmSql(pci));
                    }
                    else
                    {
                        strSql1.Append(pcm.BuildAddPresetConfigPictureAlaarmSql(pci));
                    }

                    if (i >= 99 || i >= c - 1)
                    {
                        n += pam.AddPictureAlarm(strSql.ToString());

                        pcm.UpdatePresetConfigPictureAlarm(strSql1.ToString());

                        //清除SQL语句，防止重复添加
                        strSql.Length = 0;
                        strSql1.Length = 0;
                        i = 0;
                    }
                    else
                    {
                        i++;
                    }
                }
                return n;
            }
            catch (Exception ex)
            {
                ServerLog.WriteErrorLog(ex, HttpContext.Current);
                return -1;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return -1;
        }
    }
    #endregion

}
