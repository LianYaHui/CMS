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
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_gps : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GpsDBConnectionString = Public.GpsDBConnectionString;
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected bool isDebug = false;
    protected string strDevTypeCode = string.Empty;
    protected string strDevCodeList = string.Empty;
    protected string strDevCode = string.Empty;
    protected int unitId = 0;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected string strStartTime = string.Empty;
    protected string strEndTime = string.Empty;
    protected string strDate = string.Empty;
    protected int manual = -1;
    protected int gpsType = -1;
    protected bool isDesc = true;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";
        if (!IsPostBack)
        {
            this.InitialData();
        }

    }

    #region  初始化数据
    protected void InitialData()
    {
        try
        {
            this.strAction = Public.RequestString("action");
            this.unitId = Public.RequestString("unitId", 0);
            this.pageIndex = Public.RequestString("pageIndex", 0);
            this.pageSize = Public.RequestString("pageSize", 20);

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
            if (!uc.CheckUserLogin() && !this.strAction.Equals(string.Empty) && !this.isDebug)
            {
                Response.Write("{result:-1, msg:'您还没有登录或登录已超时。', error:'noauth'}");
                Response.End();
            }
            else
            {
                ui = uc.GetLoginUserInfo();
            }
            if (unitId == 0)
            {
                unitId = ui.UnitId;
            }
            switch (this.strAction)
            {
                case "getDeviceGpsLog":
                    this.strDevTypeCode = Public.RequestString("typeCode");
                    this.strDevCodeList = Public.RequestString("devCode");
                    this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                    this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                    this.manual = Public.RequestString("manual", -1);
                    this.gpsType = -1;
                    this.isDesc = Public.RequestString("isDesc", 1) == 1;
                    Response.Write(this.GetDeviceGprsLog(ui.UserName, this.unitId, this.strDevCodeList, this.strStartTime, this.strEndTime,
                        this.manual, this.gpsType, this.isDesc, this.pageIndex, this.pageSize));
                    break;
                case "getDeviceGpsGuide":
                    this.strDevCodeList = Public.RequestString("devCode");
                    this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                    this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                    int showType = Public.RequestString("showType", -1);
                    Response.Write(this.GetDeviceGpsGuide(this.strDevCodeList, this.strStartTime, this.strEndTime, showType));
                    break;
                case "getGpsDeviceList":
                    this.strDate = Public.RequestString("date");
                    Response.Write(this.GetGpsDeviceList(this.strDate));
                    break;
                case "getDeviceGpsTrack":
                    this.strDevCode = Public.RequestString("devCode");
                    this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                    this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                    this.manual = Public.RequestString("manual", -1);
                    this.gpsType = -1;
                    this.isDesc = Public.RequestString("isDesc", 1) == 1;
                    Response.Write(this.GetDeviceGpsTrack(this.strDevCode, this.strStartTime, this.strEndTime, this.manual, this.gpsType, this.isDesc));
                    break;
                case "getDeviceGpsMileageStat":
                    this.strDevCode = Public.RequestString("devCode");
                    this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                    this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                    Response.Write(this.GetDeviceGpsMileageStat(this.unitId, this.strDevCode, this.strStartTime, this.strEndTime, this.pageIndex, this.pageSize));
                    break;
                case "exportDeviceGpsMileageStat":
                    bool isIE = Public.RequestString("isIE", 1) == 1;
                    this.strDevCode = Public.RequestString("devCode");
                    this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                    this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                    this.ExportDevGpsStatToExecl(this.unitId, this.strDevCode, this.strStartTime, this.strEndTime, isIE);
                    break;
                default:
                    Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                    break;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            Response.Write(String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current)));
        }
    }
    #endregion

    #region  获得设备GPS信息历史记录
    public string GetDeviceGprsLog(string strUserName, int unitId, string strDevCodeList, string strStartTime, string strEndTime,
        int manaul, int gpsType, bool isDesc, int pageIndex, int pageSize)
    {
        string strDevCode = strDevCodeList;
        StringBuilder strGps = new StringBuilder();
        try
        {
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString, this.GpsDBConnectionString);

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
                    strDevCodeList = dm.GetDeviceIndexCode(strControlUnitIdList, "index_code", string.Empty);
                }
            }

            int dataCount = dgm.GetGpsLogTotal(strDevCodeList, strStartTime, strEndTime, manual, gpsType);

            List<DeviceGpsInfo> lstGps = dgm.GetDeviceGpsLogInfo(strDevCodeList, string.Empty, strStartTime, strEndTime, manual, gpsType, pageIndex, pageSize, isDesc);

            if (lstGps.Count > 0)
            {
                int n = 0;
                StringBuilder strDevs = new StringBuilder();
                DataSet dsDev = new DataSet();
                foreach (DeviceGpsInfo dgi in lstGps)
                {
                    strDevs.Append(String.Format(",'{0}'", dgi.DevCode));
                }

                if (!strDevs.Equals(string.Empty))
                {
                    DBResultInfo dbResult = dm.GetDeviceBaseInfoList(strDevs.ToString().Substring(1));
                    dsDev = dbResult.dsResult;
                }
                strGps.Append("{result:1");
                strGps.Append(String.Format(",dataCount:{0}", dataCount));

                if (strDevCode.Equals(string.Empty))
                {
                    strGps.Append(",list:[");
                    if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
                    {
                        foreach (DeviceGpsInfo dgi in lstGps)
                        {
                            strGps.Append(this.FillDeviceGpsResult(dgi, n, false, dsDev));
                            n++;
                        }
                    }
                    else
                    {
                        foreach (DeviceGpsInfo dgi in lstGps)
                        {
                            strGps.Append(this.FillDeviceGpsResult(dgi, n, false, null));
                            n++;
                        }
                    }
                    strGps.Append("]");
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
                            strGps.Append(String.Format(",devCode:'{0}',devName:'{1}'", di.DevCode, di.DevName));
                        }
                        else
                        {
                            strGps.Append(",devCode:'',devName:''");
                        }
                    }
                    else
                    {
                        strGps.Append(",devCode:'',devName:''");
                    }
                    strGps.Append(",list:[");
                    foreach (DeviceGpsInfo dgi in lstGps)
                    {
                        strGps.Append(this.FillDeviceGpsResult(dgi, n, false, null));
                        n++;
                    }
                    strGps.Append("]");
                }
                strGps.Append("}");
            }
            else
            {
                strGps.Append(String.Format("{{result:1,dataCount:{0},list:[]}}", dataCount));
            }

            return strGps.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备GPS轨迹记录
    public string GetDeviceGpsTrack(string strDevCode, string strStartTime, string strEndTime, int manual, int gpsType, bool isDesc)
    {
        StringBuilder strGps = new StringBuilder();
        try
        {
            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString, this.GpsDBConnectionString);

            int dataCount = dgm.GetGpsLogTotal(strDevCode, strStartTime, strEndTime);

            List<DeviceGpsInfo> lstGps = dgm.GetDeviceGpsLogInfo(strDevCode, string.Empty, strStartTime, strEndTime, manual, gpsType, 0, 0, isDesc);

            if (lstGps.Count > 0)
            {
                strGps.Append("{result:1");
                strGps.Append(String.Format(",devCode:'{0}'", strDevCode));
                strGps.Append(String.Format(",dataCount:{0}", dataCount));
                strGps.Append(",list:[");

                int n = 0;
                foreach (DeviceGpsInfo dgi in lstGps)
                {
                    if (dgi.Latitude.Equals(string.Empty) || dgi.Longitude.Equals(string.Empty))
                    {
                        continue;
                    }
                    strGps.Append(n++ > 0 ? "," : "");
                    strGps.Append("[");
                    strGps.Append(String.Format("{0}", dgi.GpsId));
                    /*
                    之前的3G设置的GPS信息中 经纬度、角度、速度 这4个数据是经过换算的
                    现在已经不换算了
                    if (dgi.GpsType == 1)
                    {
                        strGps.Append(String.Format(",'{0}','{1}'", this.ParseLatLng(dgi.Latitude), this.ParseLatLng(dgi.Longitude)));
                    }
                    else
                    {
                        strGps.Append(String.Format(",'{0}','{1}'", dgi.Latitude, dgi.Longitude));
                    }
                    strGps.Append(String.Format(",'{0}',{1},{2},{3},'{4}'", Public.ConvertDateTime(dgi.ReceiveTime),
                        this.ParseSpeed(dgi.Speed), this.ParseDirection(dgi.Direction), dgi.Manual, Public.ConvertDateTime(dgi.CreateTime)));
                    */
                    strGps.Append(String.Format(",'{0}','{1}'", dgi.Latitude, dgi.Longitude));
                    strGps.Append(String.Format(",'{0}',{1},{2},{3},'{4}'", Public.ConvertDateTime(dgi.ReceiveTime),
                        dgi.Speed, dgi.Direction, dgi.Manual, Public.ConvertDateTime(dgi.CreateTime)));
                    strGps.Append("]");
                }
                strGps.Append("]");
                strGps.Append("}");
            }
            else
            {
                strGps.Append(String.Format("{{result:1,dataCount:{0},list:[]}}", dataCount));
            }

            return strGps.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得GPS历史记录向导（统计哪些日期有GPS记录）
    protected string GetDeviceGpsGuide(string strDevCodeList, string strStartTime, string strEndTime, int showType)
    {
        try
        {
            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString, this.GpsDBConnectionString);

            StringBuilder strResult = new StringBuilder();
            DateTime dtStart = DateTime.Parse(strStartTime);
            DateTime dtEnd = DateTime.Parse(strEndTime);
            TimeSpan ts = dtEnd - dtStart;
            int days = ts.Days;
            bool isDesc = days < 0;

            strResult.Append("{result:1");
            strResult.Append(String.Format(",days:{0}", Math.Abs(days)));
            strResult.Append(",list:[");
            int num = 0;
            for (int i = 0, c = Math.Abs(days); i <= c; i++)
            {
                DateTime dt = dtStart.AddDays(isDebug ? -i : i);
                string strTableName = dgm.BuildGpsTableName(dt.ToString("yyyyMMdd"));

                int count = dgm.GetGpsLogCount(strTableName, strDevCodeList, dt.ToString("yyyy-MM-dd 0:00:00"), dt.ToString("yyyy-MM-dd 23:59:59"));
                if (1 == showType)
                {
                    if (count > 0)
                    {
                        strResult.Append(num++ > 0 ? "," : "");
                        strResult.Append(String.Format("['{0}',{1}]", dt.ToString("yyyy-MM-dd"), count));
                    }
                }
                else
                {
                    strResult.Append(num++ > 0 ? "," : "");
                    strResult.Append(String.Format("['{0}',{1}]", dt.ToString("yyyy-MM-dd"), count));
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  填充设备GPS信息
    protected string FillDeviceGpsResult(DeviceGpsInfo dgi, int n, bool showDevInfo, DataSet dsDev)
    {
        try
        {
            StringBuilder strGps = new StringBuilder();
            if (dgi != null)
            {
                strGps.Append(n > 0 ? "," : "");
                strGps.Append("{");
                if (showDevInfo)
                {
                    strGps.Append(String.Format("devCode:'{0}'", dgi.DevCode));
                }
                strGps.Append(String.Format("gpsId:{0},gpsType:{1}", dgi.GpsId, dgi.GpsType));
                /*
                if (dgi.GpsType == 1)
                {
                    strGps.Append(String.Format(",latitude:'{0}',longitude:'{1}'", this.ParseLatLng(dgi.Latitude), this.ParseLatLng(dgi.Longitude)));
                }
                else
                {
                    strGps.Append(String.Format(",latitude:'{0}',longitude:'{1}'", dgi.Latitude, dgi.Longitude));
                }

                strGps.Append(String.Format(",speed:{0},direction:{1},manual:{2},receiveTime:'{3}',createTime:'{4}'",
                   this.ParseSpeed(dgi.Speed), this.ParseDirection(dgi.Direction), dgi.Manual, 
                   Public.ConvertDateTime(dgi.ReceiveTime), Public.ConvertDateTime(dgi.CreateTime)));
                */
                strGps.Append(String.Format(",latitude:'{0}',longitude:'{1}'", dgi.Latitude, dgi.Longitude));
                
                strGps.Append(String.Format(",speed:{0},direction:{1},manual:{2},receiveTime:'{3}',createTime:'{4}'",
                   dgi.Speed, dgi.Direction, dgi.Manual, Public.ConvertDateTime(dgi.ReceiveTime), Public.ConvertDateTime(dgi.CreateTime)));
                strGps.Append("}");
            }
            return strGps.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  GPS数据内容解析
    public string ParseLatLng(string strLatLng)
    {
        double latlng = double.Parse(strLatLng) / 360000;
        return Math.Round(latlng, 8, MidpointRounding.AwayFromZero).ToString();
    }

    public string ParseSpeed(float speed)
    {
        if (speed > 0)
        {
            return (double.Parse(speed.ToString()) / 100000).ToString();
        }
        return speed.ToString();
    }

    public string ParseDirection(float direction)
    {
        if (direction > 0)
        {
            return (double.Parse(direction.ToString()) / 100).ToString();
        }
        return direction.ToString();
    }
    #endregion

    #region  获得GPS设备列表
    public string GetGpsDeviceList(string strDate)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            DeviceGpsManage dgm = new DeviceGpsManage(Public.CmsDBConnectionString, Public.GpsDBConnectionString);
            DBResultInfo dbResult = dgm.GetGpsDeviceList(strDate);
            DataSet ds = dbResult.dsResult;
            int n = 0;

            strResult.Append("{result:1");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append(String.Format(",dataCount:{0}", ds.Tables[0].Rows.Count));
                strResult.Append(",list:[");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append(String.Format("{{dev:'{0}',count:{1}}}", dr[0].ToString(), dr[1].ToString()));
                }
                strResult.Append("]");
            }
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得设备GPS里程统计
    protected string GetDeviceGpsMileageStat(int unitId, string strDevCodeList, string strStartTime, string strEndTime, int pageIndex, int pageSize)
    {
        try
        {
            string strUnitIdList = new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId);
            if (strDevCodeList.Equals(string.Empty))
            {
                strDevCodeList = new DeviceManage(DBConnectionString).GetDeviceIndexCode(strUnitIdList).Replace("'", "");
            }
            int dataCount = strDevCodeList.Split(',').Length;
            strDevCodeList = this.DevCodePagination(strDevCodeList, dataCount, pageIndex, pageSize);

            List<DeviceGpsStat> lstGps = new DeviceGpsManage(DBConnectionString, GpsDBConnectionString).GetDeviceGpsMileageStat(strUnitIdList, strDevCodeList, strStartTime, strEndTime, pageIndex, pageSize);
            StringBuilder strResult = new StringBuilder();

            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            int n = 0;
            foreach (DeviceGpsStat gps in lstGps)
            {
                strResult.Append(n++ > 0 ? "," : "");
                strResult.Append("{");
                /*
                strResult.Append(String.Format("devCode:'{0}',minMileage:{1},maxMileage:{2},mileage:{3},fuelConsumption:{4},fuelConsumptionRate:{5}",
                    gps.DevCode, gps.MinMileage, gps.MaxMileage, Math.Round((double)gps.Mileage, 3), Math.Round((double)gps.FuelConsumption, 2), gps.FuelConsumptionRate));
                strResult.Append(String.Format(",minMileageTime:'{0}',maxMileageTime:'{1}'",
                    Public.ConvertDateTime(gps.MinMileageTime), Public.ConvertDateTime(gps.MaxMileageTime)));
                */

                strResult.Append(String.Format("code:'{0}',min:{1},max:{2},mileage:{3},fuel:{4},fuelRate:{5}",
                    gps.DevCode, gps.MinMileage, gps.MaxMileage, Math.Round((double)gps.Mileage, 3), Math.Round((double)gps.FuelConsumption, 2), gps.FuelConsumptionRate));
                strResult.Append(String.Format(",minTime:'{0}',maxTime:'{1}'",
                    Public.ConvertDateTime(gps.MinMileageTime), Public.ConvertDateTime(gps.MaxMileageTime)));
                strResult.Append(String.Format(",name:'{0}',uname:'{1}'",
                    gps.DevName, gps.UnitName));
                strResult.Append("}");
            }
            strResult.Append("]");
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  设备编号分页处理
    public string DevCodePagination(string strDevCodeList, int dataCount, int pageIndex, int pageSize)
    {
        int pageStart = pageIndex*pageSize;

        if (dataCount <= pageStart)
        {
            return strDevCodeList;
        }
        else
        {
            StringBuilder strResult = new StringBuilder();
            string[] arrDev = strDevCodeList.Split(',');
            for (int i = 0; i < pageSize; i++)
            {
                if (pageStart + i >= dataCount) break;
                strResult.Append(i > 0 ? "," : "");
                strResult.Append(arrDev[pageStart + i]);
            }
            return strResult.ToString();
        }
    }
    #endregion

    #region  导出设备GPS里程统计
    public void ExportDevGpsStatToExecl(int unitId, string strDevCodeList, string strStartTime, string strEndTime, bool isIE)
    {
        try
        {
            string strUnitIdList = new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId);
            if (strDevCodeList.Equals(string.Empty))
            {
                strDevCodeList = new DeviceManage(DBConnectionString).GetDeviceIndexCode(strUnitIdList).Replace("'", "");
            }

            List<DeviceGpsStat> lstGps = new DeviceGpsManage(DBConnectionString, GpsDBConnectionString).GetDeviceGpsMileageStat(strUnitIdList, strDevCodeList, strStartTime, strEndTime, 0, 0);
            StringBuilder strResult = new StringBuilder();
            int n=0;
            strResult.Append("<table cellpadding=\"0\" cellspacing=\"0\" border=\"1\" style=\"text-align:center;\">");
            strResult.Append("<tr style=\"height:24px;font-weight:bold;\">");
            strResult.Append(this.BuildRowCell("序号"));
            strResult.Append(this.BuildRowCell("设备编号"));
            strResult.Append(this.BuildRowCell("设备名称"));
            strResult.Append(this.BuildRowCell("里程(km/h)"));
            strResult.Append(this.BuildRowCell("油耗(L)"));
            strResult.Append(this.BuildRowCell("起始里程(km/h)"));
            strResult.Append(this.BuildRowCell("起始时间"));
            strResult.Append(this.BuildRowCell("结束里程(km/h)"));
            strResult.Append(this.BuildRowCell("结束时间"));
            strResult.Append(this.BuildRowCell("百公里油耗"));
            strResult.Append(this.BuildRowCell("组织机构"));
            strResult.Append("</tr>");

            foreach (DeviceGpsStat gps in lstGps)
            {
                strResult.Append("<tr style=\"height:20px;\">");
                strResult.Append(this.BuildRowCell(++n));
                strResult.Append(this.BuildRowCell(gps.DevCode));
                strResult.Append(this.BuildRowCell(gps.DevName));
                strResult.Append(this.BuildRowCell(Math.Round((double)gps.Mileage, 3)));
                strResult.Append(this.BuildRowCell(Math.Round((double)gps.FuelConsumption, 2)));
                strResult.Append(this.BuildRowCell(gps.MinMileage));
                strResult.Append(this.BuildRowCell(gps.MinMileageTime));
                strResult.Append(this.BuildRowCell(gps.MaxMileage));
                strResult.Append(this.BuildRowCell(gps.MaxMileageTime));
                strResult.Append(this.BuildRowCell(gps.FuelConsumptionRate));
                strResult.Append(this.BuildRowCell(gps.UnitName));
                strResult.Append("</tr>");
            }
            strResult.Append("</table>");

            string strFileName = String.Format("设备GPS里程统计{0}.xls", DateTime.Now.ToString("yyyyMMddHHmmss"));
            string strSheetName = "GPS里程统计";
            string strContent = strResult.ToString();

            FileOperate.ExportExcel(strFileName, strSheetName, strContent, Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

    #region  创建单元格
    public string BuildRowCell(object objCellValue)
    {
        StringBuilder strRowCell = new StringBuilder();
        strRowCell.Append(String.Format("<td style=\"text-align:center;\">{0}</td>", objCellValue.ToString()));
        return strRowCell.ToString();
    }
    #endregion

}