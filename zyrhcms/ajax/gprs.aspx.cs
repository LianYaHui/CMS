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
using Zyrh.DAL;
using Zyrh.DAL.Device;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_gprs : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GprsDBConnectionString = Public.GprsDBConnectionString;
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected bool isDebug = false;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int status3G = -1;
    protected int status2G = -1;
    protected int unitId = 0;
    protected bool showAllData = false;
    protected string strDevTypeCode = string.Empty;
    protected string strDevCodeList = string.Empty;
    protected string strFilter = string.Empty;
    protected string strKeywords = string.Empty;
    protected string strDevCode = string.Empty;
    protected bool isDesc = true;

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
        
        this.isDebug = Public.RequestString("isDebug", 0) == 1;
        this.pageIndex = Public.RequestString("pageIndex", 0);
        this.pageSize = Public.RequestString("pageSize", 20);
        this.status3G = Public.RequestString("status3G", -1);
        this.status2G = Public.RequestString("status2G", -1);
        this.unitId = Public.RequestString("unitId", 0);

        if (!uc.CheckUserLogin() && !this.strAction.Equals(string.Empty) && !this.isDebug)
        {
            Response.Write("{result:-1, msg:'您还没有登录或登录已超时。', error:'noauth'}");
            Response.End();
        }
        else
        {
            ui = uc.GetLoginUserInfo();
        }
        if (this.unitId == 0)
        {
            this.unitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getDeviceConfig":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                string strField = Public.RequestString("field", string.Empty);
                Response.Write(this.GetDeviceConfig(this.strDevCode, strField));
                break;
            case "getDeviceGprsInfo":
                new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

                this.strDevTypeCode = Public.RequestString("typeCode", string.Empty);
                this.strDevCodeList = Public.RequestString("devCode", string.Empty);
                this.strFilter = Public.RequestString("filter", string.Empty);
                this.strKeywords = Public.RequestString("keywords", string.Empty);
                this.showAllData = Public.RequestString("showAllData", 0) == 1;
                Response.Write(this.GetDeviceGprsInfo(ui.UserName, this.showAllData, this.unitId, this.strDevTypeCode, this.strDevCodeList, this.status3G, this.status2G, this.strFilter, this.strKeywords, this.pageIndex, this.pageSize));
                break;
            case "getDeviceGprsLog":
                this.strDevTypeCode = Public.RequestString("typeCode", string.Empty);
                this.strDevCodeList = Public.RequestString("devCode", string.Empty);
                this.showAllData = Public.RequestString("showProtocol", 0) == 1;
                string strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                string strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                this.isDesc = Public.RequestString("isDesc", 1) == 1;
                Response.Write(this.GetDeviceGprsLog(ui.UserName, this.showAllData, this.unitId, this.strDevTypeCode, this.strDevCodeList, strStartTime, strEndTime, this.pageIndex, this.pageSize, this.isDesc));
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }

    }

    #region  获得设备配置信息
    protected string GetDeviceConfig(string strDevCode, string strField)
    {
        try
        {
            DeviceConfigManage dcm = new DeviceConfigManage(this.DBConnectionString);
            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);
            DBResultInfo dbResult;

            switch (strField)
            {
                case "patrol_mode":
                case "security":
                case "voltage_power":
                    dbResult = dsm.GetDeviceStatusInfoByField(strDevCode, strField);
                    break;
                default:
                    dbResult = dcm.GetDeviceConfigInfoByField(strDevCode, strField);
                    break;
            }

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                StringBuilder strResult = new StringBuilder();
                return String.Format("{{result:1,content:'{0}'}}", Public.ReplaceSingleQuotes(dr[0].ToString()));
            }
            else
            {
                return "{result:0,content:'',msg:'没有找到相关的内容'}";
            }
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备信息
    public string GetDeviceGprsInfo(string strUserName, bool showAllData, int unitId, string strDevTypeCode, string strDevCodeList, int status3G, int status2G, string strFilter, string strKeywords, int pageIndex, int pageSize)
    {
        try
        {
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DeviceConfigManage dcm = new DeviceConfigManage(this.DBConnectionString);
            DeviceGprsManage dgm = new DeviceGprsManage(this.DBConnectionString);

            ControlUnitManage unitm = new ControlUnitManage(this.DBConnectionString);
            DBResultInfo dbResult = unitm.GetControlUnitChildId(unitId);
            
            DataSet dsUnitList = dbResult.dsResult;// unitDBAccess.GetControlUnitChildId(controlUnitId);
            //Response.Write(dbResult.strSql);

            string strControlUnitIdList = string.Empty;
            if (dsUnitList != null && dsUnitList.Tables[0] != null && dsUnitList.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drUnit in dsUnitList.Tables[0].Rows)
                {
                    ControlUnitInfo cui = unitm.FillControlUnitId(drUnit);
                    strControlUnitIdList += "," + cui.UnitId;
                }
            }
            if (!strControlUnitIdList.Equals(string.Empty))
            {
                strControlUnitIdList = strControlUnitIdList.Substring(1);
            }

            DBResultInfo dbResult1 = dm.GetDeviceGprsInfo(strControlUnitIdList, strDevTypeCode, strDevCodeList, status3G, status2G, strFilter, strKeywords, pageIndex, pageSize);
            DataSet ds = dbResult1.dsResult;

            int dataCount = 0;

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                StringBuilder strDev = new StringBuilder();

                int i = 0;
                strDev.Append("{");
                strDev.Append(String.Format("result:1,dataCount:{0},list:[", dataCount));
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceInfo(dr);
                    DeviceConfigInfo dci = dcm.FillDeviceConfigInfoForGprs(dr);
                    DeviceGprsInfo dgi = dm.FillDeviceGprsInfo(dr);

                    strDev.Append(i > 0 ? "," : "");
                    strDev.Append("{");

                    string strParam = "devId:'{0}',devCode:'{1}',devName:'{2}',status:'{3}',typeCode:'{4}',typeName:'{5}',networkMode:'{6}'";
                    strDev.Append(String.Format(strParam, di.DevId, di.DevCode, di.DevName, di.devStatus.Status3G, di.TypeCode, di.TypeName, di.NetworkMode));

                    strParam = ",unitId:'{0}',unitName:'{1}',parentId:'{2}',parentName:'{3}',status3G:'{4}',statusTime3G:'{5}',status2G:'{6}',statusTime2G:'{7}'";
                    strDev.Append(String.Format(strParam, di.UnitId, di.UnitName, di.ParentId, string.Empty, di.devStatus.Status3G, di.devStatus.StatusTime2G, di.devStatus.Status2G, di.devStatus.StatusTime2G));

                    strParam = ",patrolMode:'{0}',security:'{1}',voltagePower:'{2}',timingCapture:'{3}',timingMonitor:'{4}',managerPhone:'{5}',latitude:'{6}',longitude:'{7}',gpsType:'{8}'";
                    strDev.Append(String.Format(strParam, di.devStatus.PatrolMode, di.devStatus.Security, di.devStatus.VoltagePower,
                        Public.ReplaceSingleQuotes(dci.TimingCapture), Public.ReplaceSingleQuotes(dci.TimingMonitor), 
                        Public.ReplaceSingleQuotes(dci.ManagerPhone), 
                        di.devStatus.Latitude, di.devStatus.Longitude, di.devStatus.GpsType));

                    strParam = ",phoneNumber2G:'{0}',phoneNumber3G:'{1}',heartbeat2G:'{2}',lastGprsTime:'{3}'";
                    strDev.Append(String.Format(strParam, dci.PhoneNumber2G, dci.PhoneNumber3G, Public.ConvertDateTime(di.devStatus.HeartbeatTime2G), Public.ConvertDateTime(di.devStatus.LastGprsTime)));

                    if (strUserName.Equals("admin") && showAllData)
                    {
                        strParam = ",ioStatus:'{0}',ptzStatus:'{1}',networkStandard:'{2}',signalStrenth:'{3}',dialupProcess:'{4}',pingTime:'{5}',platformRegisterStatus:'{6}',intercomStatus:'{7}'";
                        strDev.Append(String.Format(strParam, dgi.IOStatus, dgi.PTZStatus, dgi.NetworkStandard, dgi.SignalStrength, dgi.DialUpProcess, dgi.PingTime, dgi.PlatformRegisterStatus, dgi.IntercomStatus));
                    }
                    strDev.Append("}");
                    i++;
                }
                strDev.Append("]");
                strDev.Append("}");

                return strDev.ToString();
            }
            else
            {
                return String.Format("{{result:1,dataCount:{0},list:[]}}", dataCount);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得设备信息历史记录
    public string GetDeviceGprsLog(string strUserName, bool showProtocol, int unitId, string strDevTypeCode, string strDevCodeList, 
        string strStartTime, string strEndTime, int pageIndex, int pageSize, bool isDesc)
    {
        string strDevCode = strDevCodeList;
        StringBuilder strGprs = new StringBuilder();
        try
        {
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DeviceGprsManage dgm = new DeviceGprsManage(this.DBConnectionString, this.GprsDBConnectionString);

            if (strDevCodeList.Equals(string.Empty))
            {
                ControlUnitManage unitm = new ControlUnitManage(this.DBConnectionString);
                DBResultInfo dbResult = unitm.GetControlUnitChildId(unitId);

                DataSet dsUnitList = dbResult.dsResult;

                string strControlUnitIdList = string.Empty;
                if (dsUnitList != null && dsUnitList.Tables[0] != null && dsUnitList.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow drUnit in dsUnitList.Tables[0].Rows)
                    {
                        ControlUnitInfo cui = unitm.FillControlUnitId(drUnit);
                        strControlUnitIdList += "," + cui.UnitId;
                    }
                }
                if (!strControlUnitIdList.Equals(string.Empty))
                {
                    strControlUnitIdList = strControlUnitIdList.Substring(1);
                }

                if (strDevCodeList.Equals(string.Empty) && unitId > 0)
                {
                    strDevCodeList = dm.GetDeviceIndexCode(strControlUnitIdList, strFilter, strKeywords);
                    /*
                    if (dsDevCode != null && dsDevCode.Tables[0] != null && dsDevCode.Tables[0].Rows.Count > 0)
                    {
                        StringBuilder strDevList = new StringBuilder();
                        foreach (DataRow drDev in dsDevCode.Tables[0].Rows)
                        {
                            DeviceInfo di = dm.FillDeviceIndexCode(drDev);
                            strDevList.Append(",");
                            strDevList.Append(String.Format("'{0}'", di.DevCode));
                        }
                        if (strDevList.Length > 0)
                        {
                            strDevCodeList = strDevList.ToString().Substring(1);
                        }
                    }
                    */
                }

            }

            int dataCount = dgm.GetGprsLogTotal(strDevCodeList, strStartTime, strEndTime);

            List<DeviceGprsInfo> lstGprs = dgm.GetDeviceGprsLogInfo(strDevCodeList, string.Empty, strStartTime, strEndTime, pageIndex, pageSize, isDesc);

            if (lstGprs.Count > 0)
            {
                int n = 0;
                StringBuilder strDevs = new StringBuilder();
                DataSet dsDev = new DataSet();
                foreach (DeviceGprsInfo dgi in lstGprs)
                {
                    strDevs.Append(String.Format(",'{0}'", dgi.DevCode));
                }

                if (!strDevs.Equals(string.Empty))
                {
                    DBResultInfo dbResult = dm.GetDeviceBaseInfoList(strDevs.ToString().Substring(1));
                    dsDev = dbResult.dsResult;
                }
                strGprs.Append("{result:1");
                strGprs.Append(String.Format(",dataCount:{0}", dataCount));

                if (strDevCode.Equals(string.Empty))
                {
                    strGprs.Append(",list:[");
                    if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
                    {
                        foreach (DeviceGprsInfo dgi in lstGprs)
                        {
                            strGprs.Append(this.FillDeviceGprsResult(dgi, n, true, showProtocol, dsDev));
                            n++;
                        }
                    }
                    else
                    {
                        foreach (DeviceGprsInfo dgi in lstGprs)
                        {
                            strGprs.Append(this.FillDeviceGprsResult(dgi, n, true, showProtocol, null));
                            n++;
                        }
                    }
                    strGprs.Append("]");
                }
                else
                {
                    if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
                    {
                        DataView dv = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", strDevCode), "", DataViewRowState.CurrentRows);
                        if (dv.Count > 0)
                        {
                            DataRowView drv = dv[0];
                            DeviceInfo di = dm.FillDeviceBaseInfo(drv);
                            strGprs.Append(String.Format(",devCode:'{0}',devName:'{1}'", di.DevCode, di.DevName));
                        }
                        else
                        {
                            strGprs.Append(",devCode:'',devName:''");
                        }
                    }
                    else
                    {
                        strGprs.Append(",devCode:'',devName:''");
                    }
                    strGprs.Append(",list:[");
                    foreach (DeviceGprsInfo dgi in lstGprs)
                    {
                        strGprs.Append(this.FillDeviceGprsResult(dgi, n, false, showProtocol, null));
                        n++;
                    }
                    strGprs.Append("]");
                }
                strGprs.Append("}");
            }
            else
            {
                strGprs.Append(String.Format("{{result:1,dataCount:{0},list:[]}}", dataCount));
            }

            return strGprs.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  填充设备GPRS信息
    protected string FillDeviceGprsResult(DeviceGprsInfo dgi, int n, bool showDevInfo, bool showProtocol, DataSet dsDev)
    {
        try
        {
            StringBuilder strGprs = new StringBuilder();
            if (dgi != null)
            {
                strGprs.Append(n > 0 ? "," : "");
                strGprs.Append("{");
                strGprs.Append(String.Format("devCode:'{0}',batteryPower:'{1}',patrolMode:'{2}',status3G:'{3}'", dgi.DevCode, dgi.BatteryPower, dgi.PatrolMode, dgi.Status3G));
                strGprs.Append(String.Format(",receiveTime:'{0}',latitude:'{1}',longitude:'{2}',gprsId:'{3}',infoDate:'{4}'", Public.ConvertDateTime(dgi.ReceiveTime), dgi.Latitude, dgi.Longitude, dgi.GprsId, dgi.InfoDate));
                if (showProtocol)
                {
                    strGprs.Append(String.Format(",protocolContent:'{0}',createTime:'{1}'", dgi.ProtocolContent, Public.ConvertDateTime(dgi.CreateTime)));
                }
                if (showDevInfo)
                {
                    if (dsDev != null)
                    {
                        DataView dv = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", dgi.DevCode), "", DataViewRowState.CurrentRows);
                        if (dv.Count > 0)
                        {
                            DataRowView drv = dv[0];
                            DeviceInfo di = dm.FillDeviceBaseInfo(drv);
                            strGprs.Append(String.Format(",devName:'{0}'", di.DevName));
                        }
                        else
                        {
                            strGprs.Append(",devName:''");
                        }
                    }
                    else
                    {
                        strGprs.Append(",devName:''");
                    }
                }
                strGprs.Append("}");
            }
            return strGprs.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

}
