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
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.BLL.Server;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Model.Server;

public partial class ajax_device : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceStatusManage dsm = new DeviceStatusManage(Public.CmsDBConnectionString);
    protected DeviceCameraManage cameraManage = new DeviceCameraManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected int unitId = 0;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected string strDevTypeCode = string.Empty;
    protected string strFilter = string.Empty;
    protected string strKeywords = string.Empty;
    protected string strDevCode = string.Empty;
    protected int devId = 0;
    protected int cameraId = 0;
    protected int channelNo = 0;
    protected int presetId = 0;
    protected int presetNo = 0;
    protected int deleted = 0;
    protected bool getChild = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

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

        this.unitId = Public.RequestString("unitId", 0);
        this.pageIndex = Public.RequestString("pageIndex", 0);
        this.pageSize = Public.RequestString("pageSize", 20);

        
        ui = uc.GetLoginUserInfo();
        if (this.unitId == 0)
        {
            this.unitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getDeviceType":
                Response.Write(this.GetDeviceType());
                break;
            case "getDeviceTypeInfo":
                Response.Write(this.GetDeviceTypeInfo(
                    Public.RequestString("id", 0),
                    Public.RequestString("pageIndex", 0),
                    Public.RequestString("pageSize", 0)
                    ));
                break;
            case "getDeviceFunction":
                this.strDevTypeCode = Public.RequestString("devTypeCode", string.Empty);
                Response.Write(this.GetDeviceFunction(this.strDevTypeCode, this.pageIndex, this.pageSize));
                break;
            case "getDeviceList":
                new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

                this.strDevTypeCode = Public.RequestString("devTypeCode", string.Empty);
                this.strFilter = Public.RequestString("filter", string.Empty);
                this.strKeywords = Public.RequestString("keywords", string.Empty);
                this.getChild = Public.RequestString("getChild", 0) == 1;

                Response.Write(this.GetDeviceList(this.unitId, this.getChild, this.strDevTypeCode,
                    Public.RequestString("status3g", -1),
                    Public.RequestString("status2g", -1),
                    Public.RequestString("hasIp", -1),
                    this.strFilter, this.strKeywords, this.pageIndex, this.pageSize)
                );
                break;
            case "getDeviceBaseInfoList":
                new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.strDevTypeCode = Public.RequestString("devTypeCode", string.Empty);
                this.getChild = Public.RequestString("getChild", 1) == 1;
                Response.Write(this.GetDeviceBaseInfoList(this.strDevCode, this.unitId, this.getChild, this.strDevTypeCode));
                break;
            case "getDeviceNameList":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.strDevTypeCode = Public.RequestString("devTypeCode", string.Empty);
                Response.Write(this.GetDeviceNameList(this.strDevCode, this.unitId, true, this.strDevTypeCode));
                break;
            case "getSingleDeviceBaseInfo":
                new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

                this.strDevCode = Public.RequestString("devCode", string.Empty);
                Response.Write(this.GetSingleDeviceBaseInfo(this.strDevCode));
                break;
            case "getDeviceInfo":
                new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.devId = Public.RequestString("devId", 0);
                Response.Write(this.GetDeviceInfo(this.devId, this.strDevCode));
                break;
            case "getDeviceGps":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.strDevTypeCode = Public.RequestString("devTypeCode", string.Empty);
                Response.Write(this.GetDeviceGpsList(this.strDevCode, this.unitId, true, this.strDevTypeCode));
                break;
            case "addDevice":
                DeviceInfo devAdd = new DeviceInfo();
                devAdd.UnitId = Public.RequestString("unitId", 0);
                devAdd.TypeCode = Public.RequestString("typeCode", string.Empty);
                devAdd.DevCode = Public.RequestString("devCode", string.Empty);
                devAdd.DevName = Public.RequestString("devName", string.Empty);
                devAdd.CameraChannelCount = Public.RequestString("cameraChannelCount", 0);
                devAdd.DagServerId = Public.RequestString("dagServerId", 0);
                devAdd.CssServerId = Public.RequestString("cssServerId", 0);
                devAdd.ServerLineId = Public.RequestString("serverLineId", 0);
                devAdd.UserName = Public.RequestString("userName", "admin");
                devAdd.UserPwd = Public.RequestString("userPwd", "12345");
                devAdd.SequenceIndex = Public.RequestString("sequenceIdx", 0);
                devAdd.AudioType = Public.RequestString("audioType", 0);
                devAdd.BitStreamType = Public.RequestString("bitStreamType", 0);
                devAdd.OperatorId = ui.UserId;

                DeviceStatusInfo dsiAdd = new DeviceStatusInfo();
                dsiAdd.Latitude = Public.RequestString("latitude", string.Empty);
                dsiAdd.Longitude = Public.RequestString("longitude", string.Empty);
                dsiAdd.DevPwd = Public.RequestString("devPwd", string.Empty);

                devAdd.devStatus = dsiAdd;

                DeviceConfigInfo dciAdd = new DeviceConfigInfo();
                dciAdd.PhoneNumber2G = Public.RequestString("phoneNumber2G", string.Empty);
                dciAdd.PhoneNumber3G = Public.RequestString("phoneNumber3G", string.Empty);
                dciAdd.DeviceRemark = Public.RequestString("devRemark", string.Empty);
                dciAdd.FuelConsumption = Public.RequestString("fuelConsumption", 0.0f);

                devAdd.devConfig = dciAdd;

                Response.Write(this.AddDeviceInfo(devAdd, devAdd.devConfig, devAdd.devStatus));
                break;
            case "editDevice":
                DeviceInfo devEdit = new DeviceInfo();
                devEdit.DevId = Public.RequestString("devId", 0);
                devEdit.UnitId = Public.RequestString("unitId", 0);
                devEdit.TypeCode = Public.RequestString("typeCode", string.Empty);
                devEdit.DevCode = Public.RequestString("devCode", string.Empty);
                devEdit.DevName = Public.RequestString("devName", string.Empty);
                devEdit.CameraChannelCount = Public.RequestString("cameraChannelCount", 0);
                devEdit.DagServerId = Public.RequestString("dagServerId", 0);
                devEdit.CssServerId = Public.RequestString("cssServerId", 0);
                devEdit.ServerLineId = Public.RequestString("serverLineId", 0);
                devEdit.UserName = Public.RequestString("userName", "admin");
                devEdit.UserPwd = Public.RequestString("userPwd", "12345");
                devEdit.SequenceIndex = Public.RequestString("sequenceIdx", 0);
                devEdit.AudioType = Public.RequestString("audioType", 0);
                devEdit.BitStreamType = Public.RequestString("bitStreamType", 0);
                devEdit.OperatorId = ui.UserId;

                DeviceStatusInfo dsiEdit = new DeviceStatusInfo();
                dsiEdit.Latitude = Public.RequestString("latitude", string.Empty);
                dsiEdit.Longitude = Public.RequestString("longitude", string.Empty);
                dsiEdit.DevPwd = Public.RequestString("devPwd", string.Empty);

                devEdit.devStatus = dsiEdit;

                DeviceConfigInfo dciEdit = new DeviceConfigInfo();
                dciEdit.PhoneNumber2G = Public.RequestString("phoneNumber2G", string.Empty);
                dciEdit.PhoneNumber3G = Public.RequestString("phoneNumber3G", string.Empty);
                dciEdit.DeviceRemark = Public.RequestString("devRemark", string.Empty);
                dciEdit.FuelConsumption = Public.RequestString("fuelConsumption", 0.0f);

                devEdit.devConfig = dciEdit;

                Response.Write(this.UpdateDeviceInfo(devEdit, devEdit.devConfig, devEdit.devStatus));
                break;
            case "deleteDevice":
                string strDevIdList = Public.RequestString("devIdList", string.Empty);
                Response.Write(this.DeleteDeviceInfo(strDevIdList));
                break;
            case "getCameraList":
                this.strDevTypeCode = Public.RequestString("devTypeCode", string.Empty);
                this.strFilter = Public.RequestString("filter", string.Empty);
                this.strKeywords = Public.RequestString("keywords", string.Empty);
                this.getChild = Public.RequestString("getChild", 0) == 1;
                Response.Write(this.GetCameraList(this.unitId, this.getChild, this.strDevTypeCode, this.strFilter, this.strKeywords, this.pageIndex, this.pageSize));
                break;
            case "getCameraInfo":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.channelNo = Public.RequestString("channelNo", 0);
                this.cameraId = Public.RequestString("cameraId", 0);
                Response.Write(this.GetCameraInfo(this.cameraId));
                break;
            case "editCamera":
                DeviceCameraInfo cameraEdit = new DeviceCameraInfo();
                cameraEdit.CameraId = Public.RequestString("cameraId", 0);
                cameraEdit.CameraName = Public.RequestString("cameraName", string.Empty);
                cameraEdit.PtzControlType = Public.RequestString("ptzControlType", 0);
                cameraEdit.PtzType = Public.RequestString("ptzType", 0);
                cameraEdit.CameraType = Public.RequestString("cameraType", 0);
                cameraEdit.ConnectType = Public.RequestString("connectType", 0);
                cameraEdit.Pixel = Public.RequestString("pixel", 0);
                cameraEdit.StreamType = Public.RequestString("streamType", 0);
                cameraEdit.Sound = Public.RequestString("sound", 0);

                Response.Write(this.UpdateCameraInfo(cameraEdit));
                break;
            case "getPresetInfo":
                this.cameraId = Public.RequestString("cameraId", 0);
                this.presetNo = Public.RequestString("presetNo", 0);
                this.deleted = Public.RequestString("deleted", -1);
                Response.Write(this.GetCameraPresetInfo(this.cameraId, this.presetNo, this.deleted));
                break;
            case "getDevicePresetInfo":
                this.devId = Public.RequestString("devId", 0);
                this.channelNo = Public.RequestString("channelNo", 0);
                this.deleted = Public.RequestString("deleted", -1);
                int min = Public.RequestString("min", 0);
                int max = Public.RequestString("max", 0);
                Response.Write(this.GetDevicePresetInfo(this.devId, this.channelNo, this.deleted, min, max));
                break;
            case "updatePresetInfo":
                DevicePresetInfo presetEdit = new DevicePresetInfo();
                presetEdit.CameraId = Public.RequestString("cameraId", 0);
                presetEdit.PresetNo = Public.RequestString("presetNo", 0);
                presetEdit.Deleted = Public.RequestString("deleted", 0);
                presetEdit.PresetName = Public.RequestString("presetName");
                presetEdit.OperatorId = ui.UserId;
                Response.Write(this.UpdateDevicePreset(presetEdit));
                break;
            case "deletePresetInfo":
                this.cameraId = Public.RequestString("cameraId", 0);
                this.presetNo = Public.RequestString("presetNo", 0);
                this.deleted = Public.RequestString("deleted", 1);
                Response.Write(this.DeleteDevicePreset(this.cameraId, this.presetNo, deleted));
                break;
            case "getDevPreviewParam":
                this.devId = Public.RequestString("devId", 0);
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.channelNo = Public.RequestString("channelNo", 0);
                int loginLineId = Public.RequestString("loginLineId", 1);
                Response.Write(this.GetDevicePreviewParam(this.devId, this.strDevCode, this.channelNo, loginLineId));
                break;
            case "getDeviceIcon":
                Response.Write(this.GetDeviceIcon());
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }

    }

    #region  获得设备类型
    protected string GetDeviceType()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DeviceTypeManage dtm = new DeviceTypeManage(this.DBConnectionString);
            DataSet ds = dtm.GetDeviceType(string.Empty);
            strResult.Append("{\"result\":1");
            strResult.Append(",\"list\":[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceTypeInfo dti = dtm.FillDeviceTypeInfo(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("\"typeCode\":\"{0}\",\"typeName\":\"{1}\",\"typeDesc\":\"{2}\"", dti.TypeCode, dti.TypeName, dti.TypeDesc));
                    strResult.Append("}");
                    n++;
                }
            }
            strResult.Append("]");
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion
    
    #region  获得设备类型
    protected string GetDeviceTypeInfo(int id, int pageIndex, int pageSize)
    {
        try
        {
            DeviceTypeManage dtm = new DeviceTypeManage(this.DBConnectionString);
            DBResultInfo dbResult = dtm.GetDeviceType(id, string.Empty, string.Empty, -1, pageIndex, pageSize);
            DataSet ds = dbResult.dsResult;
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            StringBuilder strResult = new StringBuilder();
            strResult.Append("{\"result\":1");
            strResult.Append(String.Format(",\"dataCount\":{0}", dataCount));
            strResult.Append(",\"list\":[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceTypeInfo dti = dtm.FillDeviceTypeInfo(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("\"id\":{0},\"typeCode\":\"{1}\",\"typeName\":\"{2}\",\"typeDesc\":\"{3}\",\"networkMode\":\"{4}\",\"isDisplay\":{5}",
                        dti.Id, dti.TypeCode, dti.TypeName, dti.TypeDesc, dti.NetworkMode, dti.IsDisplay));
                    strResult.Append(String.Format(",\"createTime\":\"{0}\"",
                        Public.ConvertDateTime(dti.CreateTime)));
                    strResult.Append("}");
                    n++;
                }
            }
            strResult.Append("]");
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion
    

    #region  获得设备基本信息列表
    protected string GetDeviceBaseInfoList(string strDevCodeList, int unitId, bool getChild, string strDevTypeCode)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            DBResultInfo dbResult = dm.GetDeviceBaseInfoList(strDevCodeList, strUnitIdList);
            DataSet ds = dbResult.dsResult;

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strDev.Append("{\"result\":1");
                strDev.Append(String.Format(",\"dataCount\":{0}", dataCount));
                strDev.Append(",\"list\":[");
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceBaseInfo(dr);
                    strDev.Append(n > 0 ? "," : "");
                    strDev.Append("{");
                    strDev.Append(String.Format("\"devId\":\"{0}\",\"devName\":\"{1}\",\"devCode\":\"{2}\",\"typeCode\":\"{3}\",\"typeName\":\"{4}\",\"unitId\":\"{5}\",\"unitName\":\"{6}\",\"networkMode\":\"{7}\"",
                        di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode), di.TypeCode,
                        Public.FilterJsonValue(di.TypeName), di.UnitId, Public.FilterJsonValue(di.UnitName), di.NetworkMode));
                    strDev.Append(String.Format(",\"latitude\":\"{0}\",\"longitude\":\"{1}\",\"lastGpsTime\":\"{2}\",\"direction\":{3},\"speed\":{4}",
                        di.devStatus.Latitude, di.devStatus.Longitude, di.devStatus.LastGpsTime, di.devStatus.Direction, di.devStatus.Speed));
                    strDev.Append(String.Format(",\"status2G\":\"{0}\",\"status3G\":\"{1}\",\"heartbeatTime3g\":\"{2}\"",
                        di.devStatus.Status2G, di.devStatus.Status3G, di.devStatus.HeartbeatTime3G));
                    //strDev.Append(String.Format(",\"networkAddr\":\"{0}\",\"networkPort\":\"{1}\",\"userName\":\"{2}\",\"userPwd\":\"{3}\",\"cameraChannelCount\":\"{4}\",\"registerType\":\"{5}\"",
                    //    di.NetworkAddr, di.NetworkPort, Public.FilterJsonValue(di.UserName), di.UserPwd, di.CameraChannelCount, di.RegisterType));

                    strDev.Append("}");
                    n++;
                }
                strDev.Append("]");
                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":0");
                strDev.Append(String.Format(",\"msg\":\"{0}\"", "没有找到设备信息"));
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备信息
    protected string GetDeviceList(int unitId, bool getChild, string strDevTypeCode, int status3g, int status2g, int hasIp,
        string strFilter, string strKeywords, int pageIndex, int pageSize)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            DBResultInfo dbResult = dm.GetDeviceInfoForManage(strUnitIdList, strDevTypeCode, status3g, status2g, hasIp, strFilter, strKeywords, pageIndex, pageSize);
            DataSet ds = dbResult.dsResult;

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strDev.Append("{\"result\":1");
                strDev.Append(String.Format(",\"dataCount\":{0}", dataCount));
                strDev.Append(",\"list\":[");
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceInfoForManage(dr);
                    strDev.Append(n > 0 ? "," : "");
                    strDev.Append("{");
                    strDev.Append(String.Format("\"devId\":\"{0}\",\"devName\":\"{1}\",\"devCode\":\"{2}\",\"typeName\":\"{3}\",\"networkAddr\":\"{4}\",\"networkPort\":\"{5}\",\"networkMode\":\"{6}\"",
                    di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode), Public.FilterJsonValue(di.TypeName), di.NetworkAddr, di.NetworkPort, di.NetworkMode));
                    strDev.Append(String.Format(",\"unitId\":\"{0}\",\"unitName\":\"{1}\",\"typeCode\":\"{2}\",\"userName\":\"{3}\",\"userPwd\":\"{4}\"",
                    di.UnitId, Public.FilterJsonValue(di.UnitName), di.TypeCode, Public.FilterJsonValue(di.UserName), di.UserPwd));
                    strDev.Append(String.Format(",\"cameraChannelCount\":{0},\"alarmInCount\":{1},\"alarmOutCount\":{2},\"registerType\":{3}",
                        di.CameraChannelCount, di.AlarmInCount, di.AlarmOutCount, di.RegisterType));
                    strDev.Append(String.Format(",\"dagServerId\":{0},\"cssServerId\":{1},\"serverLineId\":{2}",
                        di.DagServerId, di.CssServerId, di.ServerLineId));
                    strDev.Append(String.Format(",\"audioType\":{0},\"bitStreamType\":{1}",
                        di.AudioType, di.BitStreamType));
                    strDev.Append(String.Format(",\"status3g\":{0},\"status2g\":{1}",
                        di.devStatus.Status3G, di.devStatus.Status2G));
                    strDev.Append("}");
                    n++;
                }
                strDev.Append("]");
                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":1");
                strDev.Append(String.Format(",\"dataCount\":\"0\"", dataCount));
                strDev.Append(",\"list\":[]");
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备基本信息列表
    protected string GetSingleDeviceBaseInfo(string strDevCode)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            DeviceInfo di = dm.GetDeviceBaseInfo(strDevCode);

            if (di != null)
            {
                strDev.Append("{\"result\":1");
                strDev.Append(",\"dev\":{");

                strDev.Append(String.Format("\"devId\":\"{0}\",\"devName\":\"{1}\",\"devCode\":\"{2}\",\"typeCode\":\"{3}\",\"typeName\":\"{4}\",\"unitId\":\"{5}\",\"unitName\":\"{6}\",\"networkMode\":\"{7}\",\"audioType\":\"{8}\"",
                    di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode), di.TypeCode,
                    Public.FilterJsonValue(di.TypeName), di.UnitId, Public.FilterJsonValue(di.UnitName), di.NetworkMode, di.AudioType));
                strDev.Append(String.Format(",\"latitude\":\"{0}\",\"longitude\":\"{1}\",\"lastGpsTime\":\"{2}\",\"direction\":{3},\"speed\":{4}",
                    di.devStatus.Latitude, di.devStatus.Longitude, Public.ConvertDateTime(di.devStatus.LastGpsTime), di.devStatus.Direction, di.devStatus.Speed));
                strDev.Append(String.Format(",\"status2G\":\"{0}\",\"status3G\":\"{1}\",\"heartbeatTime3g\":\"{2}\"",
                    di.devStatus.Status2G, di.devStatus.Status3G, Public.ConvertDateTime(di.devStatus.HeartbeatTime3G)));

                strDev.Append("}");

                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":0");
                strDev.Append(String.Format(",\"msg\":\"{0}\"", "没有找到设备信息"));
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得单个设备
    protected string GetDeviceInfo(int devId, string strDevCode)
    {
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);

            DBResultInfo dbResult = dm.GetSingleDeviceInfoForManage(devId, strDevCode);
            DataSet ds = dbResult.dsResult;

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strDev.Append("{\"result\":1");
                DataRow dr = ds.Tables[0].Rows[0];
                DeviceInfo di = dm.FillDeviceInfoForManage(dr);

                strDev.Append(",\"dev\":{");
                strDev.Append(String.Format("\"devId\":\"{0}\",\"devName\":\"{1}\",\"devCode\":\"{2}\",\"typeName\":\"{3}\",\"networkAddr\":\"{4}\",\"networkPort\":{5},\"networkMode\":\"{6}\"",
                    di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode), Public.FilterJsonValue(di.TypeName), di.NetworkAddr, di.NetworkPort, di.NetworkMode));
                strDev.Append(String.Format(",\"unitId\":\"{0}\",\"unitName\":\"{1}\",\"typeCode\":\"{2}\",\"userName\":\"{3}\",\"userPwd\":\"{4}\"",
                    di.UnitId, Public.FilterJsonValue(di.UnitName), di.TypeCode, Public.FilterJsonValue(di.UserName), di.UserPwd));
                strDev.Append(String.Format(",\"cameraChannelCount\":{0},\"alarmInCount\":{1},\"alarmOutCount\":{2},\"registerType\":{3}",
                    di.CameraChannelCount, di.AlarmInCount, di.AlarmOutCount, di.RegisterType));
                strDev.Append(String.Format(",\"dagServerId\":{0},\"cssServerId\":{1},\"serverLineId\":{2},\"serverLineCode\":{3}",
                    di.DagServerId, di.CssServerId, di.ServerLineId, di.ServerLine.LineCode));
                strDev.Append(String.Format(",\"audioType\":{0},\"bitStreamType\":{1}",
                    di.AudioType, di.BitStreamType));
                //strDev.Append(String.Format(",\"dagServerIp\":\"{0}\",\"serverPort\":\"{1}\",\"serverName\":\"{2}\"",
                //    di.devPagServer.ServerIp, di.devPagServer.ServerPort, di.devPagServer.ServerName));
                //strDev.Append(String.Format(",\"storeServerIp\":\"{0}\",\"storeServerPort\":\"{1}\",\"storeServerName\":\"{2}\"",
                //    di.devStoreServer.ServerIp, di.devStoreServer.ServerPort, di.devStoreServer.ServerName));
                strDev.Append("}");
                strDev.Append(",\"config\":{");
                strDev.Append(String.Format("\"phoneNumber2G\":\"{0}\",\"phoneNumber3G\":\"{1}\",\"latitude\":\"{2}\",\"longitude\":\"{3}\",\"gpsType\":\"{4}\",\"devRemark\":\"{5}\",\"fuelConsumption\":\"{6}\"",
                    di.devConfig.PhoneNumber2G, di.devConfig.PhoneNumber3G, di.devStatus.Latitude, di.devStatus.Longitude, di.devStatus.GpsType,
                    Public.FilterJsonValue(di.devConfig.DeviceRemark), di.devConfig.FuelConsumption));
                strDev.Append("}");
                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":1");
                strDev.Append(",\"dev\":{}");
                strDev.Append(",\"config\":{}");
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得设备名称列表
    protected string GetDeviceNameList(string strDevCodeList, int unitId, bool getChild, string strDevTypeCode)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            DBResultInfo dbResult = dm.GetDeviceBaseInfoList(strDevCodeList, strUnitIdList);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strDev.Append("{\"result\":1");
                strDev.Append(String.Format(",\"dataCount\":{0}", dataCount));
                strDev.Append(",\"list\":[");
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceBaseInfo(dr);
                    strDev.Append(n > 0 ? "," : "");
                    strDev.Append("{");
                    strDev.Append(String.Format("\"id\":{0},\"name\":\"{1}\",\"code\":\"{2}\"",
                        di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode)));
                    strDev.Append("}");
                    n++;
                }
                strDev.Append("]");
                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":0");
                strDev.Append(String.Format(",\"msg\":\"{0}\"", "没有找到设备信息"));
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得单个设备(视频预览参数)
    protected string GetDevicePreviewParam(int devId, string strDevCode, int channelNo, int loginLineId)
    {
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);

            DBResultInfo dbResult = dm.GetSingleDeviceInfoForManage(devId, strDevCode);
            DataSet ds = dbResult.dsResult;

            string strCameraInfo = this.GetDeviceCameraInfo(devId, channelNo);

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                DeviceInfo di = dm.FillDeviceInfoForManage(dr);
                WmpServerInfo cag = null;

                if (Config.GetRedisEnabled())
                {
                    //取CAG服务器信息
                    wmp.WmpCache wc = WmpRedis.ConnectRedis(Config.GetRedisServerIp(), Config.GetRedisServerPort());
                    if (wc != null)
                    {
                        //先从Redis缓存中查找CAG
                        cag = WmpRedis.GetCagServer(wc, ui.LoginLineCode);
                    }
                }
               
                if (null == cag)
                {
                    //从Redis缓存中查找CAG失败
                    //取CAG服务器登录线路IP
                    cag = this.GetCagServerIpInfo(ui.LoginLineId);
                }
                if (null == cag)
                {
                    return String.Format("{{\"result\":0,\"msg\":\"{0}不存在，请检查服务器程序是否运行\",\"error\":\"\"}}", "CAG服务器");
                }
                strDev.Append("{\"result\":1");
                strDev.Append(",\"dev\":{");
                strDev.Append(String.Format("\"devId\":\"{0}\",\"devName\":\"{1}\",\"devCode\":\"{2}\",\"typeName\":\"{3}\",\"networkAddr\":\"{4}\",\"networkPort\":{5},\"networkMode\":\"{6}\"",
                    di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode), Public.FilterJsonValue(di.TypeName), di.NetworkAddr, di.NetworkPort, di.NetworkMode));
                strDev.Append(String.Format(",\"unitId\":\"{0}\",\"unitName\":\"{1}\",\"typeCode\":\"{2}\",\"userName\":\"{3}\",\"userPwd\":\"{4}\"",
                    di.UnitId, Public.FilterJsonValue(di.UnitName), di.TypeCode, Public.FilterJsonValue(di.UserName), di.UserPwd));
                strDev.Append(String.Format(",\"cameraChannelCount\":{0},\"alarmInCount\":{1},\"alarmOutCount\":{2},\"registerType\":{3}",
                    di.CameraChannelCount, di.AlarmInCount, di.AlarmOutCount, di.RegisterType));
                strDev.Append(String.Format(",\"dagServerId\":{0},\"cssServerId\":{1},\"serverLineId\":{2},\"serverLineCode\":{3}",
                    di.DagServerId, di.CssServerId, di.ServerLineId, di.ServerLine.LineCode));
                strDev.Append(String.Format(",\"audioType\":{0},\"bitStreamType\":{1}",
                    di.AudioType, di.BitStreamType));

                //取CAG服务器信息
                strDev.Append(String.Format(",\"cagServerIp\":\"{0}\",\"cagServerPort\":{1}", cag.Ip, cag.UdpPort));

                //strDev.Append(String.Format(",\"dagServerIp\":\"{0}\",\"serverPort\":\"{1}\",\"serverName\":\"{2}\"",
                //    di.devPagServer.ServerIp, di.devPagServer.ServerPort, di.devPagServer.ServerName));
                //strDev.Append(String.Format(",\"storeServerIp\":\"{0}\",\"storeServerPort\":\"{1}\",\"storeServerName\":\"{2}\"",
                //    di.devStoreServer.ServerIp, di.devStoreServer.ServerPort, di.devStoreServer.ServerName));
                strDev.Append("}");
                strDev.Append(String.Format(",\"camera\":[{0}]", strCameraInfo));
                strDev.Append(",\"config\":{");
                strDev.Append(String.Format("\"phoneNumber2G\":\"{0}\",\"phoneNumber3G\":\"{1}\",\"latitude\":\"{2}\",\"longitude\":\"{3}\",\"gpsType\":\"{4}\",\"devRemark\":\"{5}\",\"fuelConsumption\":\"{6}\"",
                    di.devConfig.PhoneNumber2G, di.devConfig.PhoneNumber3G, di.devStatus.Latitude, di.devStatus.Longitude, di.devStatus.GpsType,
                    Public.FilterJsonValue(di.devConfig.DeviceRemark), di.devConfig.FuelConsumption));
                strDev.Append("}");
                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":1");
                strDev.Append(",\"dev\":{}");
                strDev.Append(",\"camera\":[]");
                strDev.Append(",\"config\":{}");
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dev:{{}},config:{{}},error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得CAG服务器线路信息
    private WmpServerInfo GetCagServerIpInfo(int serverLineId)
    {
        try
        {
            WmpServerInfo info = null;
            ServerManage sm = new ServerManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = sm.GetServerIpList(-1, serverLineId, ZyrhServerType.CAG.GetHashCode());
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                ServerIpInfo sii = sm.FillServerIpInfo(ds.Tables[0].Rows[0]);
                info = new WmpServerInfo();
                info.Ip = sii.ServerIp;
                info.UdpPort = sii.ServerPort;
            }
            return info;
        }
        catch (Exception ex) { return null; }
    }
    #endregion

    #region  获得设备监控点通道
    public string GetDeviceCameraInfo(int devId, int channelNo)
    {
        try
        {
            CameraManage cm = new CameraManage(this.DBConnectionString);
            DBResultInfo dbResult = cm.GetCameraInfo(devId.ToString(), channelNo, -1);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                StringBuilder strResult = new StringBuilder();

                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceCameraInfo dci = cm.FillCameraInfo(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("\"cameraId\":{0},\"channelNo\":{1},\"cameraName\":\"{2}\",\"streamType\":{3},\"connectType\":{4}",
                        dci.CameraId, dci.ChannelNo, dci.CameraName, dci.StreamType, dci.ConnectType));
                    strResult.Append("}");
                    n++;
                }
                return strResult.ToString();
            }
            else
            {
                return string.Empty;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion


    #region  获得设备GPS列表
    protected string GetDeviceGpsList(string strDevCodeList, int unitId, bool getChild, string strDevTypeCode)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            DBResultInfo dbResult = dm.GetDeviceBaseInfoList(strDevCodeList, strUnitIdList);
            DataSet ds = dbResult.dsResult;

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strDev.Append("{\"result\":1");
                strDev.Append(String.Format(",\"dataCount\":{0}", dataCount));
                strDev.Append(",\"list\":[");
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceBaseInfo(dr);
                    strDev.Append(n > 0 ? "," : "");
                    strDev.Append("{");
                    strDev.Append(String.Format("\"id\":\"{0}\",\"name\":\"{1}\",\"code\":\"{2}\",\"tcode\":\"{3}\",\"tname\":\"{4}\",\"uid\":\"{5}\",\"uname\":\"{6}\",\"mode\":\"{7}\"",
                        di.DevId, Public.FilterJsonValue(di.DevName), Public.FilterJsonValue(di.DevCode), di.TypeCode,
                        Public.FilterJsonValue(di.TypeName), di.UnitId, Public.FilterJsonValue(di.UnitName), di.NetworkMode));
                    strDev.Append(String.Format(",\"lat\":\"{0}\",\"lng\":\"{1}\",\"gpstime\":\"{2}\",\"speed\":{3},\"dir\":{4}",
                        di.devStatus.Latitude, di.devStatus.Longitude, di.devStatus.LastGpsTime, di.devStatus.Speed, di.devStatus.Direction));
                    strDev.Append(String.Format(",\"s2\":\"{0}\",\"s3\":\"{1}\",\"hbtime\":\"{2}\",\"v\":\"{3}\",\"io\":\"{4}\",\"alarm\":\"{5}\",\"acc\":\"{6}\"",
                        di.devStatus.Status2G, di.devStatus.Status3G, di.devStatus.HeartbeatTime3G,
                        di.devStatus.VoltagePower, di.devStatus.IoStatus, di.devStatus.AlarmInfo, di.devStatus.AccStatus));

                    strDev.Append("}");
                    n++;
                }
                strDev.Append("]");
                strDev.Append("}");
            }
            else
            {
                strDev.Append("{\"result\":0");
                strDev.Append(String.Format(",\"msg\":\"{0}\"", "没有找到设备信息"));
                strDev.Append("}");
            }
            return strDev.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    
    #region  添加设备
    protected string AddDeviceInfo(DeviceInfo di, DeviceConfigInfo dci, DeviceStatusInfo dsi)
    {
        try
        {
            if (!di.DevCode.Equals(string.Empty) && !di.DevName.Equals(string.Empty) && di.UnitId > 0 && !di.TypeCode.Equals(string.Empty))
            {
                if (!dm.CheckDeviceCodeFormat(di.DevCode))
                {
                    return String.Format("{{\"result\":0,\"msg\":\"设备编号格式错误\",\"error\":\"\"}}");
                }
                if (dm.CheckDeviceIndexCodeIsExist(-1, di.DevCode) > 0)
                {
                    return String.Format("{{\"result\":-2}}");
                }
                StringBuilder strResult = new StringBuilder();
                di.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                di.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                if (di.UserName.Equals(string.Empty))
                {
                    di.UserName = "admin";
                }
                if (di.UserPwd.Equals(string.Empty))
                {
                    di.UserPwd = "12345";
                }

                DBResultInfo dbResult = dm.AddDevice(di);
                int did = dbResult.iResult;
                string strSql = dbResult.strSql;
                
                if (did > 0)
                {
                    di.DevId = did;

                    #region  创建设备配置信息
                    DeviceConfigManage dcm = new DeviceConfigManage(this.DBConnectionString);
                    dci.DevId = did;
                    dci.DevCode = di.DevCode;
                    dci.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    dci.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                    //创建设备配置信息
                    if (dcm.CheckDeviceConfigIsExist(dci.DevId) > 0)
                    {
                        dcm.UpdateDeviceConfig(dci, dci.DevCode, dci.DevId);
                    }
                    else
                    {
                        if (dcm.CheckDeviceConfigIsExist(dci.DevCode) > 0)
                        {
                            dcm.UpdateDeviceConfig(dci, dci.DevCode, 0);
                        }
                        else
                        {
                            dcm.InsertDeviceConfig(dci);
                        }
                    }
                    #endregion

                    #region  创建设备状态信息
                    //创建设备状态信息
                    dsi.DevCode = di.DevCode;
                    dsi.DevId = di.DevId;
                    if (!dsi.DevPwd.Equals(string.Empty))
                    {
                        dsi.DevPwd = Encrypt.HashEncrypt(dsi.DevPwd, EncryptFormat.MD5).ToLower();
                    }
                    if (dsm.CheckDeviceStatusIsExist(dsi.DevId, string.Empty) > 0)
                    {
                        dsm.UpdateDeviceStatusBaseInfo(dsi, strDevCode, di.DevId);
                    }
                    else
                    {
                        if (dsm.CheckDeviceStatusIsExist(0, dsi.DevCode) > 0)
                        {
                            dsm.UpdateDeviceStatusBaseInfo(dsi, strDevCode, 0);
                        }
                        else
                        {
                            dsm.AddDeviceStatus(dsi);
                        }
                    }
                    #endregion

                    #region  创建设备远程配置信息
                    DeviceRemoteConfigManage drm = new DeviceRemoteConfigManage(this.DBConnectionString);
                    //更新或创建设备远程配置信息
                    if (drm.CheckDeviceRemoteConfigIsExist(di.DevId) > 0)
                    {
                        drm.UpdateRemoteConfig(di.DevCode, di.DevId);
                    }
                    else
                    {
                        if (drm.CheckDeviceRemoteConfigIsExist(dci.DevCode) <= 0)
                        {
                            drm.InsertRemoteConfig(di.DevId, di.DevCode, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                        }
                    }
                    #endregion

                    #region  创建设备服务器映射
                    //先删除设备服务器映射
                    DeviceServerMapManage dsmm = new DeviceServerMapManage(this.DBConnectionString);
                    dsmm.DeleteDeviceServerMapByDevice(di.DevId);

                    DeviceServerMapInfo info = new DeviceServerMapInfo();
                    if (di.DagServerId > 0)
                    {
                        info.DeviceId = di.DevId;
                        info.ServerId = di.DagServerId;
                        info.OperatorId = di.OperatorId;
                        info.CreateTime = Public.GetDateTime();

                        dsmm.AddDeviceServerMap(info);
                    }
                    if (di.CssServerId > 0)
                    {
                        info.DeviceId = di.DevId;
                        info.ServerId = di.CssServerId;
                        info.OperatorId = di.OperatorId;
                        info.CreateTime = Public.GetDateTime();

                        dsmm.AddDeviceServerMap(info);
                    }
                    #endregion

                    ///添加监控点通道
                    this.AddDeviceCamera(di.DevId, di.DevName, di.CameraChannelCount, di.OperatorId);

                    return String.Format("{{\"result\":1}}");
                }
                return String.Format("{{\"result\":0,\"yes\":1}}");
            }
            else
            {
                return String.Format("{{\"result\":0,\"no\":1}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  编辑设备
    protected string UpdateDeviceInfo(DeviceInfo di, DeviceConfigInfo dci, DeviceStatusInfo dsi)
    {
        try
        {
            if (di.DevId > 0 && di.UnitId > 0 && !di.DevCode.Equals(string.Empty) && !di.DevName.Equals(string.Empty))
            {
                if (!dm.CheckDeviceCodeFormat(di.DevCode))
                {
                    return String.Format("{{\"result\":0,\"msg\":\"设备编号格式错误\",\"error\":\"\"}}");
                }
                if (dm.CheckDeviceIndexCodeIsExist(di.DevId, di.DevCode) > 0)
                {
                    return String.Format("{{\"result\":-2}}");
                }
                StringBuilder strResult = new StringBuilder();
                di.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                DBResultInfo dbResult = dm.UpdateDeviceInfo(di);
                int result = dbResult.iResult;
                if (result > 0)
                {

                    #region  创建或更新设备配置信息
                    DeviceConfigManage dcm = new DeviceConfigManage(this.DBConnectionString);
                    dci.DevId = di.DevId;
                    dci.DevCode = di.DevCode;
                    dci.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    dci.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                    //创建设备配置信息
                    if (dcm.CheckDeviceConfigIsExist(dci.DevId) > 0)
                    {
                        dcm.UpdateDeviceConfig(dci, dci.DevCode, dci.DevId);
                    }
                    else
                    {
                        if (dcm.CheckDeviceConfigIsExist(dci.DevCode) > 0)
                        {
                            dcm.UpdateDeviceConfig(dci, dci.DevCode, 0);
                        }
                        else
                        {
                            dcm.InsertDeviceConfig(dci);
                        }
                    }
                    #endregion

                    #region  创建或更新设备状态信息
                    //创建设备状态信息
                    dsi.DevCode = di.DevCode;
                    dsi.DevId = di.DevId;
                    if (!dsi.DevPwd.Equals(string.Empty))
                    {
                        dsi.DevPwd = Encrypt.HashEncrypt(dsi.DevPwd, EncryptFormat.MD5).ToLower();
                    }

                    if (dsm.CheckDeviceStatusIsExist(dsi.DevId, string.Empty) > 0)
                    {
                        dsm.UpdateDeviceStatusBaseInfo(dsi, di.DevCode, di.DevId);
                    }
                    else
                    {
                        if (dsm.CheckDeviceStatusIsExist(0, dsi.DevCode) > 0)
                        {
                            dsm.UpdateDeviceStatusBaseInfo(dsi, di.DevCode, 0);
                        }
                        else
                        {
                            dsm.AddDeviceStatus(dsi);
                        }
                    }
                    #endregion

                    #region  创建或更新设备远程配置信息
                    DeviceRemoteConfigManage drm = new DeviceRemoteConfigManage(this.DBConnectionString);
                    //更新或创建设备远程配置信息
                    if (drm.CheckDeviceRemoteConfigIsExist(di.DevId) > 0)
                    {
                        drm.UpdateRemoteConfig(di.DevCode, di.DevId);
                    }
                    else
                    {
                        if (drm.CheckDeviceRemoteConfigIsExist(dci.DevCode) <= 0)
                        {
                            drm.InsertRemoteConfig(di.DevId, di.DevCode, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                        }
                    }
                    #endregion

                    #region  创建或更新设备服务器映射
                    DeviceServerMapManage dsmm = new DeviceServerMapManage(this.DBConnectionString);
                    //先删除设备服务器映射
                    dsmm.DeleteDeviceServerMapByDevice(di.DevId);

                    DeviceServerMapInfo info = new DeviceServerMapInfo();
                    if (di.DagServerId > 0)
                    {
                        info.DeviceId = di.DevId;
                        info.ServerId = di.DagServerId;
                        info.OperatorId = di.OperatorId;
                        info.CreateTime = Public.GetDateTime();

                        dsmm.AddDeviceServerMap(info);
                    }
                    if (di.CssServerId > 0)
                    {
                        info.DeviceId = di.DevId;
                        info.ServerId = di.CssServerId;
                        info.OperatorId = di.OperatorId;
                        info.CreateTime = Public.GetDateTime();

                        dsmm.AddDeviceServerMap(info);
                    }
                    #endregion

                    ///编辑监控点通道
                    this.UpdateDeviceCamera(di.DevId, di.DevName, di.CameraChannelCount, di.OperatorId);

                    return String.Format("{{\"result\":1}}");
                }
                return String.Format("{{\"result\":0,\"yes\":1}}");
            }
            else
            {
                return String.Format("{{\"result\":0,\"no\":1}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  检测 是否是所辖设备
    protected string CheckDeviceIsIn(string strDevIdList, int userUnitId)
    {
        StringBuilder strResult = new StringBuilder();

        string strUnitIdList = new ControlUnitManage(Public.CmsDBConnectionString).GetControlUnitIdList(userUnitId);
        DBResultInfo dbResult = dm.GetDeviceBaseInfoList(string.Empty, strUnitIdList);
        DataSet ds = dbResult.dsResult;
        DeviceCenter dc = new DeviceCenter(Public.CmsDBConnectionString);

        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            string[] arrDevice = strDevIdList.Split(',');
            foreach (string str in arrDevice)
            {
                if (str.Equals(string.Empty) || !dc.CheckDeviceCodeFormat(str))
                {
                    continue;
                }

                DataView dv = new DataView(ds.Tables[0], "device_id=" + str, "", DataViewRowState.CurrentRows);
                if (dv.Count > 0)
                {
                    strResult.Append(",");
                    strResult.Append(str);
                }
            }
        }
        return strResult.Length > 0 ? strResult.ToString().Substring(1) : string.Empty;
    }
    #endregion
        

    #region  删除设备
    public string DeleteDeviceInfo(string strDevIdList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            if (!uc.CheckUserLogin())
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'您还没有登录，无权限删除设备信息！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            else if (!uc.IsAdmin)
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'当前帐户无权限删除设备信息！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            strDevIdList = this.CheckDeviceIsIn(strDevIdList, ui.UnitId);
            if (strDevIdList.Equals(string.Empty))
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'注意：您只能删除当前帐户所辖的设备信息！'");
                strResult.Append("}");

                return strResult.ToString();
            }

            ///删除设备监控点通道
            cameraManage.DeleteDeviceCamera(strDevIdList, 0);

            int result = dm.DeleteDevice(strDevIdList);
            if (result > 0)
            {
                //设备设备配置
                DeviceConfigManage dcm = new DeviceConfigManage(this.DBConnectionString);
                dcm.DeleteDeviceConfig(strDevIdList);

                //设备设备状态
                DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);
                dsm.DeleteDeviceStatus(strDevIdList, string.Empty);

                //删除设备服务器映射
                DeviceServerMapManage dsmm = new DeviceServerMapManage(this.DBConnectionString);
                dsmm.DeleteDeviceServerMap(string.Empty, strDevIdList, string.Empty);

            }
            return String.Format("{{\"result\":1,\"count\":{0}}}", result);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备功能
    protected string GetDeviceFunction(string strDevTypeCode, int pageIndex, int pageSize)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  添加监控点通道
    public string AddDeviceCamera(int devId, string strDevName, int channelCount, int operatorId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            for (int i = 0; i < channelCount; i++)
            {
                DeviceCameraInfo dci = new DeviceCameraInfo();
                dci.DeviceId = devId;
                dci.ChannelNo = (i + 1);
                dci.CameraName = strDevName + "通道";
                dci.OperatorId = operatorId;
                dci.CameraType = 3; //0-枪机/1-半球/2-快球/3-云台
                dci.ConnectType = 0; //0-UDP/1-TCP/2-MCAST/3-RTP
                dci.StreamType = 1; //0-主码流 1-子码流
                dci.Sound = 0;

                if (!this.CheckDeviceCameraIsExist(dci.DeviceId, dci.ChannelNo))
                {
                    cameraManage.AddDeviceSingleCamera(dci);
                }
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  修改监控点通道
    public string UpdateDeviceCamera(int devId, string strDevName, int channelCount, int operatorId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            //删除多余的监控点
            cameraManage.DeleteDeviceCamera(devId.ToString(), channelCount);

            for (int i = 0; i < channelCount; i++)
            {
                DeviceCameraInfo dci = new DeviceCameraInfo();
                dci.DeviceId = devId;
                dci.ChannelNo = (i + 1);
                dci.CameraName = strDevName + "通道";
                dci.OperatorId = operatorId;
                //dci.CameraType = 3; //0-枪机/1-半球/2-快球/3-云台
                //dci.ConnectType = 0; //0-UDP/1-TCP/2-MCAST/3-RTP
                //dci.StreamType = 1; //0-主码流 1-子码流
                //dci.Sound = 0;

                if (!this.CheckDeviceCameraIsExist(dci.DeviceId, dci.ChannelNo))
                {
                    DBResultInfo dbResult = cameraManage.AddDeviceSingleCamera(dci);
                    strResult.Append(dbResult.strSql);
                }
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  检测监控点通道是否存在 
    public bool CheckDeviceCameraIsExist(int devId, int channelNo)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            return cameraManage.CheckDeviceCameraIsExist(devId, channelNo) > 0;
        }
        catch (Exception ex)
        {
            return true;
        }
    }
    #endregion

    #region  删除监控点通道
    public string DeleteDeviceCamera(int devId, int channelCount)
    {
        StringBuilder strResult = new StringBuilder();
        cameraManage.DeleteDeviceCamera(devId.ToString(), channelCount);
        return strResult.ToString();
    }
    #endregion


    #region  获得设备监控点列表
    protected string GetCameraList(int unitId, bool getChild, string strDevTypeCode, string strFilter, string strKeywords, int pageIndex, int pageSize)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strCamera = new StringBuilder();
            DeviceCameraManage dcm = new DeviceCameraManage(this.DBConnectionString);
            DBResultInfo dbResult = dcm.GetCamaraList(-1, unitId, getChild, string.Empty, string.Empty, -1, -1, pageIndex, pageSize);
            DataSet ds = dbResult.dsResult;

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strCamera.Append("{\"result\":1");
                strCamera.Append(String.Format(",\"dataCount\":\"{0}\"", dataCount));
                strCamera.Append(",\"list\":[");
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceCameraInfo dci = dcm.FillCameraInfo(dr);
                    strCamera.Append(n > 0 ? "," : "");
                    strCamera.Append("{");
                    strCamera.Append(String.Format("\"cameraId\":\"{0}\",\"cameraName\":\"{1}\",\"channelNo\":\"{2}\",\"cameraType\":\"{3}\",\"connectType\":\"{4}\",\"streamType\":\"{5}\"",
                        dci.CameraId, Public.FilterJsonValue(dci.CameraName), dci.ChannelNo, dci.CameraType, dci.ConnectType, dci.StreamType));
                    strCamera.Append(String.Format(",\"devId\":\"{0}\",\"devCode\":\"{1}\",\"devName\":\"{2}\",\"networkAddr\":\"{3}\",\"networkPort\":\"{4}\"",
                        dci.DeviceId, dci.DevCode, dci.DevName, dci.NetworkAddr, dci.NetworkPort));
                    strCamera.Append(String.Format(",\"unitId\":\"{0}\",\"unitName\":\"{1}\"", dci.UnitId, dci.UnitName));
                    strCamera.Append("}");
                    n++;
                }
                strCamera.Append("]");
                strCamera.Append("}");
            }
            else
            {
                strCamera.Append("{\"result\":1");
                strCamera.Append(String.Format(",\"dataCount\":\"0\"", dataCount));
                strCamera.Append(",\"list\":[]");
                strCamera.Append("}");
            }
            return strCamera.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得单个监控点信息
    protected string GetCameraInfo(int cameraId)
    {
        try
        {
            StringBuilder strCamera = new StringBuilder();
            DeviceCameraManage dcm = new DeviceCameraManage(this.DBConnectionString);

            DBResultInfo dbResult = dcm.GetCameraInfo(cameraId);
            DataSet ds = dbResult.dsResult;

            //Response.Write(dbResult.strSql);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strCamera.Append("{\"result\":1");
                strCamera.Append(",\"camera\":{");
                int n = 0;
                DataRow dr = ds.Tables[0].Rows[0];
                DeviceCameraInfo dci = dcm.FillCameraInfo(dr);

                strCamera.Append(String.Format("\"cameraId\":\"{0}\",\"cameraName\":\"{1}\",\"channelNo\":\"{2}\",\"cameraType\":\"{3}\",\"connectType\":\"{4}\",\"streamType\":\"{5}\"",
                    dci.CameraId, Public.FilterJsonValue(dci.CameraName), dci.ChannelNo, dci.CameraType, dci.ConnectType, dci.StreamType));
                strCamera.Append(String.Format(",\"ptzControlType\":\"{0}\",\"ptzType\":\"{1}\",\"pixel\":\"{2}\",\"sound\":\"{3}\"",
                    dci.PtzControlType, dci.PtzType, dci.Pixel, dci.Sound));
                strCamera.Append(String.Format(",\"devId\":\"{0}\",\"devCode\":\"{1}\",\"devName\":\"{2}\",\"networkAddr\":\"{3}\",\"networkPort\":\"{4}\",\"latitude\":\"{5}\",\"longitude\":\"{6}\"",
                    dci.DeviceId, dci.DevCode, dci.DevName, dci.NetworkAddr, dci.NetworkPort, dci.Latitude, dci.Longitude));
                strCamera.Append(String.Format(",\"unitId\":\"{0}\",\"unitName\":\"{1}\"", dci.UnitId, dci.UnitName));

                strCamera.Append("}");

                strCamera.Append("}");
            }
            else
            {
                strCamera.Append("{\"result\":1");
                strCamera.Append(",\"camera\":{}");
                strCamera.Append("}");
            }
            return strCamera.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  编辑监控点
    protected string UpdateCameraInfo(DeviceCameraInfo dci)
    {
        try
        {
            if (dci.CameraId > 0 && !dci.CameraName.Equals(string.Empty))
            {
                StringBuilder strResult = new StringBuilder();

                DBResultInfo dbResult = cameraManage.UpdateDeviceCamera(dci);
                int result = dbResult.iResult;
                if (result > 0)
                {
                    return String.Format("{{\"result\":1}}");
                }
                return String.Format("{{\"result\":0,\"yes\":1}}");
            }
            else
            {
                return String.Format("{{\"result\":0,\"no\":1}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得预置点信息 
    public string GetCameraPresetInfo(int cameraId, int presetNo, int deleted)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DevicePresetManage dpm = new DevicePresetManage(this.DBConnectionString);

            DBResultInfo dbResult = dpm.GetPresetInfo(cameraId, -1, presetNo, deleted, 0, 0);
            DataSet ds = dbResult.dsResult;
            strResult.Append("{\"result\":1");
            strResult.Append(String.Format(",\"cameraId\":{0},\"presetNo\":{1},\"deleted\":{2}", cameraId, presetNo, deleted));
            strResult.Append(",\"list\":[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DevicePresetInfo dpi = dpm.FillDevicePresetInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("\"id\":{0},\"no\":{1},\"name\":\"{2}\",\"deleted\":{3}", dpi.PresetId, dpi.PresetNo, dpi.PresetName, dpi.Deleted));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备预置点信息
    public string GetDevicePresetInfo(int devId, int channelNo, int deleted)
    {
        return this.GetDevicePresetInfo(devId, channelNo, deleted, 0, 0);
    }

    public string GetDevicePresetInfo(int devId, int channelNo, int deleted, int min, int max)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DevicePresetManage dpm = new DevicePresetManage(this.DBConnectionString);

            DBResultInfo dbResult = dpm.GetDevicePresetInfo(devId.ToString(), channelNo, deleted, 0, 0);
            DataSet ds = dbResult.dsResult;
            strResult.Append("{\"result\":1");
            strResult.Append(String.Format(",\"devId\":{0},\"channelNo\":{1},\"deleted\":{2}", devId, channelNo, deleted));
            strResult.Append(",\"list\":[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                if (min > 0 && max > 0)
                {
                    string strFilter = String.Format("preset_no < {0} or preset_no > {1}", min, max);
                    DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);
                    foreach (DataRowView drv in dv)
                    {
                        DevicePresetInfo dpi = dpm.FillDevicePresetInfo(drv);
                        strResult.Append(n++ > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("\"id\":{0},\"no\":{1},\"name\":\"{2}\",\"deleted\":{3}", dpi.PresetId, dpi.PresetNo, dpi.PresetName, dpi.Deleted));
                        strResult.Append("}");
                    }
                }
                else
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DevicePresetInfo dpi = dpm.FillDevicePresetInfo(dr);
                        strResult.Append(n++ > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("\"id\":{0},\"no\":{1},\"name\":\"{2}\",\"deleted\":{3}", dpi.PresetId, dpi.PresetNo, dpi.PresetName, dpi.Deleted));
                        strResult.Append("}");
                    }
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  更新预置点信息
    public string UpdateDevicePreset(DevicePresetInfo dpi)
    {
        try
        {
            DevicePresetManage dpm = new DevicePresetManage(this.DBConnectionString);
            
            dpi.CreateTime = Public.GetDateTime();
            dpi.UpdateTime = Public.GetDateTime();

            DBResultInfo dbResult = dpm.CheckPresetIsExist(dpi.CameraId, dpi.PresetNo);
            if (dbResult.iResult > 0)
            {
                if (dpm.CheckPresetNameIsExist(dpi.CameraId, dpi.PresetName, dpi.PresetNo).iResult > 0)
                {
                    return "{\"result\":-2}";
                }
                dbResult = dpm.UpdateDevicePreset(dpi);
            }
            else
            {
                if (dpm.CheckPresetNameIsExist(dpi.CameraId, dpi.PresetName, 0).iResult > 0)
                {
                    return "{\"result\":-2}";
                }
                dbResult = dpm.AddDevicePreset(dpi);
            }

            return String.Format("{{\"result\":{0}}}", dbResult.iResult > 0 ? 1 : 0);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  删除预置点
    public string DeleteDevicePreset(int cameraId, int presetNo, int deleted)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            DevicePresetManage dpm = new DevicePresetManage(this.DBConnectionString);

            DBResultInfo dbResult = dpm.DeleteDevicePreset(cameraId.ToString(), presetNo.ToString(), "预置点", deleted);

            return String.Format("{{\"result\":{0}}}", dbResult.iResult > 0 ? 1 : 0);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得设备ICON图标
    public string GetDeviceIcon()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), "devicon.config");
            string strFilePath = Server.MapPath(strConfigFileName);
            XmlDocument doc = new XmlDocument();
            doc.Load(strFilePath);

            XmlNodeList xnl = doc.SelectNodes("/config/icon");

            strResult.Append("{\"result\":1");

            strResult.Append(",\"list\":[");
            if (xnl != null)
            {
                int n = 0;
                foreach (XmlNode xn in xnl)
                {
                    XmlAttribute code = xn.Attributes["code"];
                    XmlAttribute status = xn.Attributes["status"];
                    if (n++ > 0)
                    {
                        strResult.Append(",");
                    }
                    strResult.Append(String.Format("{{\"type\":\"{0}\",\"status\":{1},\"path\":\"{2}\"}}", 
                        code.Value.Trim(), status.Value.Trim(), xn.InnerText.Trim()));
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

}
