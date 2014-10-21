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
using Zyrh.DAL;
using Zyrh.DAL.Device;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.DBUtility;

public partial class ajax_tree : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected int controlUnitId = 0;
    protected string strUnitName = string.Empty;
    protected string strTreeType = string.Empty;
    protected string strFilter = string.Empty;
    protected string strKeywords = string.Empty;
    protected string statusType = string.Empty;
    protected int status2G = -1;
    protected int status3G = -1;
    protected bool showGroup = false;
    protected string strDevCode = string.Empty;
    protected string strNetworkModeList = string.Empty;
    protected string strDevTypeCode = string.Empty;

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

        this.controlUnitId = Public.RequestString("controlUnitId", 0);
        this.strTreeType = Public.RequestString("treeType", "device");
        this.strFilter = "name";
        this.strKeywords = Public.RequestString("keywords", string.Empty);
        this.statusType = Public.RequestString("statusType");
        this.status2G = Public.RequestString("status2G", -1);
        this.status3G = Public.RequestString("status3G", -1);
        this.showGroup = Public.RequestString("showGroup", 0) == 1;
        this.strDevCode = Public.RequestString("devCode");
        this.strNetworkModeList = Public.RequestString("networkMode");
        this.strDevTypeCode = Public.RequestString("devTypeCode");        

        ui = uc.GetLoginUserInfo();
        if (this.controlUnitId == 0)
        {
            this.controlUnitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getTree":
                Response.Write(this.GetTreeData(this.controlUnitId, this.strDevTypeCode, this.strTreeType, this.strFilter, this.strKeywords,
                    this.statusType, this.status3G, this.status2G, this.showGroup, this.strNetworkModeList));
                break;
            case "getDevTree":
                Response.Write(this.GetDevTreeData(this.strTreeType, this.strDevCode, this.strNetworkModeList));
                break;
            case "getDevStatus":
                string strDevList = Public.RequestString("devList", string.Empty);
                Response.Write(this.GetDevStatus(strDevList));
                break;
            default:
                Response.Write("ok");
                break;
        }

    }

    #region  获得树结构数据
    public string GetTreeData(int controlUnitId, string strDevTypeCode, string strTreeType, string strFilter, string strKeywords,
        string strStatusType, int status3G, int status2G, bool showGroup, string strNetworkModeList)
    {
        try
        {
            StringBuilder strTree = new StringBuilder();
            StringBuilder strTemp = new StringBuilder();
            strTree.Append("{");
            strTree.Append(String.Format("uid:'{0}'", controlUnitId));
            
            string strControlUnitIdList = this.GetUnitIdList(controlUnitId);

            switch (strTreeType)
            {
                case "unit":
                    strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(controlUnitId, strControlUnitIdList, strKeywords)));
                    break;
                case "region":
                    break;
                case "camera":
                    string strDevIdList = string.Empty;

                    if (!strKeywords.Equals(string.Empty))
                    {
                        string[] arrCamera = this.GetCameraData(string.Empty, string.Empty, strNetworkModeList, -1, -1, strFilter, strKeywords);

                        strTree.Append(String.Format(",camera:[{0}]", arrCamera[0]));
                        strDevIdList = arrCamera[1];

                        string[] arrDev = this.GetDeviceData(strControlUnitIdList, strDevTypeCode, strNetworkModeList, string.Empty, strDevIdList, status3G, status2G, strFilter, strKeywords);
                        strTree.Append(String.Format(",device:[{0}]", arrDev[0]));

                        strControlUnitIdList = arrDev[1];
                        strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, strControlUnitIdList, string.Empty)));
                    }
                    else
                    {
                        strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, strControlUnitIdList, string.Empty)));
                        string[] arrDev = this.GetDeviceData(strControlUnitIdList, strDevTypeCode, strNetworkModeList, string.Empty, string.Empty, status3G, status2G, strFilter, strKeywords);
                        strTree.Append(String.Format(",device:[{0}]", arrDev[0]));
                        strTree.Append(String.Format(",camera:[{0}]", this.GetCameraData(string.Empty, arrDev[2], strNetworkModeList, -1, -1, strFilter, strKeywords)));
                    }
                    break;
                case "point":
                    strTree.Append(String.Format(",line:[{0}]", this.GetPatrolLine(strControlUnitIdList, 0)));
                    strTree.Append(String.Format(",point:[{0}]", this.GetPatrolPoint(strControlUnitIdList, -1, -1, -1, false)));
                    strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, strControlUnitIdList, string.Empty)));
                    break;
                case "user":
                    strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, strControlUnitIdList, string.Empty)));
                    break;
                case "device":
                default:
                    if (!strKeywords.Equals(string.Empty) || status2G == 1 || status3G == 1)
                    {
                        string[] arrDev = this.GetDeviceData(strControlUnitIdList, strDevTypeCode, strNetworkModeList, string.Empty, string.Empty, status3G, status2G, strFilter, strKeywords);

                        strTree.Append(String.Format(",device:[{0}]", arrDev[0]));
                        strControlUnitIdList = arrDev[1];
                        if (strControlUnitIdList.Equals(string.Empty))
                        {
                            strControlUnitIdList = controlUnitId.ToString();
                        }
                        strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, strControlUnitIdList, string.Empty)));
                    }
                    else
                    {
                        strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, strControlUnitIdList, string.Empty)));
                        strTree.Append(String.Format(",device:[{0}]", this.GetDeviceData(strControlUnitIdList, strDevTypeCode, strNetworkModeList, string.Empty, string.Empty, status3G, status2G, strFilter, strKeywords)[0]));
                    }
                    break;
            }
            strTree.Append(String.Format(",region:[{0}]", ""));
            if (showGroup)
            {
                strTree.Append(",group:{");
                strTree.Append("group:[");
                strTree.Append(String.Format("{{id:'{0}',name:'{1}',pid:'{2}'}}", "0", "我的分组", "-1"));
                strTree.Append("]");
                strTree.Append(",camera:[]");
                strTree.Append("}");
            }
            strTree.Append("}");
            return strTree.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,unit:[],region:[],device:[],camera:[],msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得单个设备树结构数据
    public string GetDevTreeData(string strTreeType, string strDevCode, string strNetworkModeList)
    {
        try
        {
            StringBuilder strTree = new StringBuilder();
            StringBuilder strTemp = new StringBuilder();
            strTree.Append("{");
            switch (strTreeType)
            {
                case "camera":
                    string strDevIdList = string.Empty;
                    string[] arrDev = this.GetDeviceData(string.Empty, string.Empty, strNetworkModeList, strDevCode, string.Empty, -1, -1, string.Empty, string.Empty);
                    strTree.Append(String.Format("device:[{0}]", arrDev[0]));
                    strTree.Append(String.Format(",camera:[{0}]", this.GetCameraData(string.Empty, arrDev[2], strNetworkModeList, -1, -1, strFilter, strKeywords)));
                    break;
                case "device":
                default:
                    string[] arrDev1 = this.GetDeviceData(string.Empty, string.Empty, strNetworkModeList, strDevCode, string.Empty, -1, -1, string.Empty, string.Empty);
                    strTree.Append(String.Format("device:[{0}]", arrDev1[0]));
                    strTree.Append(String.Format(",camera:[{0}]", this.GetCameraData(string.Empty, arrDev1[2], strNetworkModeList, -1, -1, strFilter, strKeywords)));
                    break;
            }
            strTree.Append("}");
            return strTree.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,unit:[],region:[],device:[],camera:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得组织单元ID列表
    public string GetUnitIdList(int controlUnitId)
    {
        try
        {
            string strControlUnitIdList = string.Empty;

            ControlUnitManage unitm = new ControlUnitManage(this.DBConnectionString);
            DBResultInfo dbResult = unitm.GetControlUnitChildId(controlUnitId);

            DataSet dsUnitList = dbResult.dsResult;
            if (dsUnitList != null && dsUnitList.Tables[0] != null && dsUnitList.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drUnit in dsUnitList.Tables[0].Rows)
                {
                    ControlUnitInfo cui = unitm.FillControlUnitId(drUnit);

                    strControlUnitIdList += "," + cui.UnitId.ToString();
                }
            }
            if (!strControlUnitIdList.Equals(string.Empty))
            {
                strControlUnitIdList = strControlUnitIdList.Substring(1);
            }
            return strControlUnitIdList;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得组织单元数据
    public string GetUnitData(int controlUnitId, string strControlUnitIdList, string strKeywords)
    {
        try
        {
            StringBuilder strUnit = new StringBuilder();
            ControlUnitManage unitm = new ControlUnitManage(this.DBConnectionString);
            DataSet dsUnit = new DataSet();
            if (strControlUnitIdList.IndexOf(',') < 0 && strKeywords.Equals(string.Empty))
            {
                dsUnit = unitm.GetControlUnit(Convert.ToInt32(strControlUnitIdList));
            }
            else
            {
                dsUnit = unitm.GetControlUnit(strControlUnitIdList, strKeywords);
            }
            if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
            {
                if (strKeywords.Equals(string.Empty))
                {
                    strUnit.Append(this.FillUnitData(dsUnit.Tables[0], unitm));
                }
                else
                {
                    Hashtable htUnit = new Hashtable();
                    string[] arrUnit = strControlUnitIdList.Split(',');
                    foreach (string str in arrUnit)
                    {
                        if (!htUnit.ContainsKey(str))
                        {
                            htUnit.Add(str, str);
                        }
                    }

                    StringBuilder strParentTree = new StringBuilder();
                    Hashtable htNew = new Hashtable();

                    foreach (DataRow dr in dsUnit.Tables[0].Rows)
                    {
                        ControlUnitInfo cui = unitm.FillControlUnit(dr);

                        string[] strTree = cui.ParentTree.Replace(")(", ",").Replace("(", "").Replace(")", "").Split(',');
                        foreach (string str in strTree)
                        {
                            if (htUnit.ContainsKey(str) && !htNew.ContainsKey(str))
                            {
                                strParentTree.Append(",");
                                strParentTree.Append(str);
                            }
                        }
                    }
                    if (strParentTree.Length > 0)
                    {
                        dsUnit = unitm.GetControlUnit(strParentTree.ToString().Substring(1), string.Empty);
                        if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
                        {
                            strUnit.Append(this.FillUnitData(dsUnit.Tables[0], unitm));
                        }
                    }
                }
            }
            else
            {
                dsUnit = unitm.GetControlUnit(controlUnitId);
                if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
                {
                    strUnit.Append(this.FillUnitData(dsUnit.Tables[0], unitm));
                }
            }
            return strUnit.Length > 0 ? strUnit.ToString().Substring(1) : string.Empty;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  填充组织单元数据
    public string FillUnitData(DataTable dtUnit, ControlUnitManage unitm)
    {
        try
        {
            StringBuilder strUnit = new StringBuilder();
            if (dtUnit != null && dtUnit.Rows.Count > 0)
            {
                foreach (DataRow dr in dtUnit.Rows)
                {
                    ControlUnitInfo cui = unitm.FillControlUnit(dr);

                    strUnit.Append(",{");
                    strUnit.Append(String.Format("id:'{0}',code:'{1}',name:'{2}',pid:'{3}'", cui.UnitId, cui.UnitCode, cui.UnitName, cui.ParentId));
                    strUnit.Append("}");
                }
            }
            return strUnit.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得监控区域数据

    #endregion

    #region  获得设备数据
    public string[] GetDeviceData(string strControlUnitIdList, string strDevTypeCode, string strNetworkModeList, string strDevCodeList, string strDevIdList, 
        int status3G, int status2G, string strFilter, string strKeywords)
    {
        string[] strResult = { "", "", "" };
        StringBuilder strUnitIdList = new StringBuilder();
        StringBuilder strNewDevIdList = new StringBuilder();
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);

            Hashtable htUnitId = new Hashtable();
            string[] arrUnitId = strControlUnitIdList.Split(',');
            foreach (string str in arrUnitId)
            {
                if (!htUnitId.Contains(str))
                {
                    htUnitId.Add(str, str);
                }
            }

            DataSet dsDev = dm.GetDeviceInfo(strControlUnitIdList, strDevTypeCode, strNetworkModeList, strDevCodeList, strDevIdList, status3G, status2G, strFilter, strKeywords, 0, 0).dsResult;
            if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
            {
                if (!strKeywords.Equals(string.Empty) || status2G == 1)
                {
                    Hashtable htUnit = new Hashtable();

                    foreach (DataRow drDev in dsDev.Tables[0].Rows)
                    {
                        DeviceInfo di = dm.FillDeviceBaseInfo(drDev);
                        strDev.Append(",{");
                        strDev.Append(String.Format("id:'{0}',code:'{1}',name:'{2}',uid:'{3}',uname:'{4}',s3:'{5}',s2:'{6}',type:'{7}',nmode:'{8}',audioType:'{9}'",
                            di.DevId, di.DevCode, di.DevName, di.UnitId, di.UnitName, di.devStatus.Status3G, di.devStatus.Status2G, di.TypeCode, di.NetworkMode, di.AudioType));
                        strDev.Append("}");

                        if (!htUnit.ContainsKey("unit" + di.UnitId))
                        {
                            htUnit.Add("unit" + di.UnitId, di.UnitId);

                            if (htUnitId.Contains(di.UnitId.ToString()))
                            {
                                //根据搜索到的设备信息重新组装 UNIT ID
                                strUnitIdList.Append(",");
                                strUnitIdList.Append(di.UnitId);
                            }
                        }
                        if (!di.ParentTree.Equals(string.Empty))
                        {
                            string[] strParentTree = di.ParentTree.Replace(")(", ",").Replace("(", "").Replace(")", "").Split(',');
                            foreach (string str in strParentTree)
                            {
                                if (!htUnit.ContainsKey("unit" + str))
                                {
                                    htUnit.Add("unit" + str, str);
                                    if (htUnitId.Contains(str))
                                    {
                                        //根据搜索到的设备信息重新组装 UNIT ID
                                        strUnitIdList.Append(",");
                                        strUnitIdList.Append(str);
                                    }
                                }
                            }
                        }

                        strNewDevIdList.Append(",");
                        strNewDevIdList.Append(di.DevId);
                    }
                }
                else
                {
                    foreach (DataRow drDev in dsDev.Tables[0].Rows)
                    {
                        DeviceInfo di = dm.FillDeviceBaseInfo(drDev);
                        strDev.Append(",{");
                        strDev.Append(String.Format("id:'{0}',code:'{1}',name:'{2}',uid:'{3}',uname:'{4}',s3:'{5}',s2:'{6}',type:'{7}',nmode:'{8}',audioType:'{9}'",
                            di.DevId, di.DevCode, di.DevName, di.UnitId, di.UnitName, di.devStatus.Status3G, di.devStatus.Status2G, di.TypeCode, di.NetworkMode, di.AudioType));
                        strDev.Append("}");

                        strNewDevIdList.Append(",");
                        strNewDevIdList.Append(di.DevId);
                    }
                }
            }
            strResult[0] = strDev.Length > 0 ? strDev.ToString().Substring(1) : string.Empty;
            strResult[1] = strUnitIdList.Length > 0 ? strUnitIdList.ToString().Substring(1) : string.Empty;
            strResult[2] = strNewDevIdList.Length > 0 ? strNewDevIdList.ToString().Substring(1) : string.Empty;

            return strResult;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得监控通道数据
    public string[] GetCameraData(string strRegionIdList, string strDevIdList, string strNetworkModeList, int channelNo, int cameraType, string strFilter, string strKeywords)
    {
        string[] strResult = { "", "" };
        StringBuilder strNewDevIdList = new StringBuilder();
        StringBuilder strCamera = new StringBuilder();

        DeviceCameraManage dcm = new DeviceCameraManage(this.DBConnectionString);
        DataSet dsCamera = dcm.GetCamaraList(-1, -1, false, string.Empty, strDevIdList, strNetworkModeList, channelNo, cameraType, strFilter, strKeywords, 0, 0).dsResult;
        if (dsCamera != null && dsCamera.Tables[0] != null && dsCamera.Tables[0].Rows.Count > 0)
        {
            if (!strKeywords.Equals(string.Empty))
            {
                Hashtable htDev = new Hashtable();

                foreach (DataRow drCamera in dsCamera.Tables[0].Rows)
                {
                    DeviceCameraInfo dci = dcm.FillCameraInfo(drCamera);

                    strCamera.Append(",{");
                    strCamera.Append(String.Format("id:'{0}',name:'{1}',did:'{2}',dname:'{3}',dcode:'{4}',channel:'{5}',uid:'{6}',rid:'{7}'",
                        dci.CameraId, dci.CameraName, dci.DeviceId, dci.DevName, dci.DevCode, dci.ChannelNo, dci.UnitId, dci.RegionId));
                    strCamera.Append("}");

                    if (!htDev.ContainsKey("dev" + dci.DeviceId))
                    {
                        //根据搜索到的监控通道信息重新组装 DEV ID
                        strNewDevIdList.Append(",");
                        strNewDevIdList.Append(dci.DeviceId);
                        htDev.Add("dev" + dci.DeviceId, dci.DeviceId);
                    }
                }
                strResult[1] = strNewDevIdList.Length > 0 ? strNewDevIdList.ToString().Substring(1) : string.Empty;
            }
            else
            {
                foreach (DataRow drCamera in dsCamera.Tables[0].Rows)
                {
                    DeviceCameraInfo dci = dcm.FillCameraInfo(drCamera);
                    strCamera.Append(",{");
                    strCamera.Append(String.Format("id:'{0}',name:'{1}',did:'{2}',dname:'{3}',dcode:'{4}',channel:'{5}',uid:'{6}',rid:'{7}'",
                        dci.CameraId, dci.CameraName, dci.DeviceId, dci.DevName, dci.DevCode, dci.ChannelNo, dci.UnitId, dci.RegionId));
                    strCamera.Append("}");
                }
                strResult[1] = strDevIdList;
            }
        }

        strResult[0] = strCamera.Length > 0 ? strCamera.ToString().Substring(1) : string.Empty;

        return strResult;
    }
    #endregion

    #region  获得设备状态
    public string GetDevStatus(string strDevList)
    {
        try
        {
            DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = dm.GetDeviceStatusListById(strDevList);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                StringBuilder strDev = new StringBuilder();
                strDev.Append("{result:1,list:[");
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceStatusInfo(dr);
                    strDev.Append(i > 0 ? "," : "");
                    strDev.Append("{");
                    strDev.Append(String.Format("id:'{0}',code:'{1}',name:'{2}',s2:{3},s3:{4},type:'{5}',nmode:'{6}'", 
                        di.DevId, di.DevCode, di.DevName, di.devStatus.Status2G, di.devStatus.Status3G, di.TypeCode, di.NetworkMode));
                    strDev.Append("}");
                    i++;
                }
                strDev.Append("]");
                strDev.Append("}");

                return strDev.ToString();
            }
            return "{result:0,list:[]}";
        }
        catch (Exception ex)
        {
            return String.Format("{{result:0,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得巡检线路
    public string GetPatrolLine(string strUnitIdList, int isDelete)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            PatrolLineManage plm = new PatrolLineManage(this.DBConnectionString);
            DBResultInfo dbResult = plm.GetPatrolLineInfo(-1, strUnitIdList, isDelete, false, 0, 0);

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PatrolLineInfo pl = plm.FillPatrolLine(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}'", pl.LineId, pl.LineName));
                    strResult.Append(String.Format(",uid:'{0}',uname:'{1}',pc:'{2}',isDel:'{3}'",
                        pl.UnitId, pl.UnitName, pl.PointCount, pl.IsDelete));
                    strResult.Append("}");
                    n++;
                }
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return string.Empty;
        }
    }
    #endregion


    #region  获得巡检点信息
    public string GetPatrolPoint(string strUnitIdList, int typeId, int lineId, int addType, bool getBaseInfo)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            PatrolPointManage ppm = new PatrolPointManage(this.DBConnectionString);
            DBResultInfo dbResult = ppm.GetPatrolPoint(strUnitIdList, typeId, -1, lineId, addType, 0, 0, 0, getBaseInfo, string.Empty);

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PatrolPointInfo pp = ppm.FillPatrolPoint(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}',lat:'{2}',lng:'{3}',radii:'{4}',addtype:'{5}'",
                        pp.PointId, pp.PointName, pp.Latitude, pp.Longitude, pp.Radii, pp.AddType));
                    strResult.Append(String.Format(",tid:'{0}',tname:'{1}',uid:'{2}',uname:'{3}',lid:'{4}',lname:'{5}'",
                        pp.TypeId, pp.PointType.TypeName, pp.UnitId, pp.ControlUnit.UnitName, pp.LineId, pp.PatrolLine.LineName));
                    strResult.Append("}");
                    n++;
                }
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return string.Empty;
        }
    }
    #endregion

}
