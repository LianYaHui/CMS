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
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.DAL;
using Zyrh.DAL.Device;
using Zyrh.DBUtility;

public partial class ajax_treePatrolTask : System.Web.UI.Page
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
    protected int status2G = -1;
    protected int status3G = -1;
    protected bool showGroup = false;

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

        ui = uc.GetLoginUserInfo();
        if (this.controlUnitId == 0)
        {
            this.controlUnitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getTree":
                Response.Write(this.GetTreeData(this.controlUnitId, string.Empty, this.strTreeType, this.strFilter, this.strKeywords, this.status3G, this.status2G, this.showGroup));
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
    public string GetTreeData(int controlUnitId, string strDevTypeCode, string strTreeType, string strFilter, string strKeywords, int status3G, int status2G, bool showGroup)
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
                case "point":
                    strTree.Append(String.Format(",line:[{0}]", this.GetPatrolLine(controlUnitId.ToString(), 0)));
                    strTree.Append(String.Format(",point:[{0}]", this.GetPatrolPoint(controlUnitId.ToString(), -1, -1, -1, false)));
                    strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, controlUnitId.ToString(), string.Empty)));
                    break;
                case "user":
                    strTree.Append(String.Format(",user:[{0}]", this.GetUserList(controlUnitId, -1, false)));
                    strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, controlUnitId.ToString(), string.Empty)));
                    break;
                case "device":
                default:
                    strTree.Append(String.Format(",device:[{0}]", this.GetDeviceData(controlUnitId.ToString(), strDevTypeCode, status3G, status2G, strFilter, strKeywords)[0]));
                    strTree.Append(String.Format(",unit:[{0}]", this.GetUnitData(0, controlUnitId.ToString(), string.Empty)));
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
                    //strUnit.Append(String.Format("unitId:'{0}',unitName:'{1}',parentId:'{2}'", cui.UnitId, cui.UnitName, cui.ParentId));
                    strUnit.Append(String.Format("id:'{0}',name:'{1}',pid:'{2}'", cui.UnitId, cui.UnitName, cui.ParentId));
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

    #region  获得设备数据
    public string[] GetDeviceData(string strControlUnitIdList, string strDevTypeCode, int status3G, int status2G, string strFilter, string strKeywords)
    {
        string[] strResult = { "", "" };
        try
        {
            StringBuilder strDev = new StringBuilder();
            DeviceManage dm = new DeviceManage(this.DBConnectionString);

            DataSet dsDev = dm.GetDeviceInfo(strControlUnitIdList, strDevTypeCode, status3G, status2G, strFilter, strKeywords, 0, 0).dsResult;
            if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
            {
                if (!strKeywords.Equals(string.Empty) || status2G == 1)
                {
                    Hashtable htUnit = new Hashtable();
                    strControlUnitIdList = string.Empty;

                    foreach (DataRow drDev in dsDev.Tables[0].Rows)
                    {
                        DeviceInfo di = dm.FillDeviceBaseInfo(drDev);
                        strDev.Append(",{");
                        //strDev.Append(String.Format("devId:'{0}',devCode:'{1}',devName:'{2}',unitId:'{3}',unitName:'{4}',status:'{5}',status2G:'{6}'", di.DevId, di.DevCode, di.DevName, di.UnitId, di.UnitName, di.Status, di.Status2G));
                        strDev.Append(String.Format("id:'{0}',code:'{1}',name:'{2}',uid:'{3}',uname:'{4}',s:'{5}',s2:'{6}'", 
                            di.DevId, di.DevCode, di.DevName, di.UnitId, di.UnitName, di.devStatus.Status3G, di.devStatus.Status2G));
                        strDev.Append("}");

                        if (!htUnit.ContainsKey("unit" + di.UnitId))
                        {
                            //根据搜索到的设备信息重新组装 UNIT ID
                            strControlUnitIdList += "," + di.UnitId;
                            htUnit.Add("unit" + di.UnitId, di.UnitId);
                        }
                        if (!di.ParentTree.Equals(string.Empty))
                        {
                            string[] strParentTree = di.ParentTree.Replace(")(", ",").Replace("(", "").Replace(")", "").Split(',');
                            foreach (string str in strParentTree)
                            {
                                if (!htUnit.ContainsKey("unit" + str))
                                {
                                    //根据搜索到的设备信息重新组装 UNIT ID
                                    strControlUnitIdList += "," + str;
                                    htUnit.Add("unit" + str, str);
                                }
                            }
                        }
                    }
                    if (!strControlUnitIdList.Equals(string.Empty))
                    {
                        strControlUnitIdList = strControlUnitIdList.Substring(1);
                    }
                }
                else
                {
                    foreach (DataRow drDev in dsDev.Tables[0].Rows)
                    {
                        DeviceInfo di = dm.FillDeviceBaseInfo(drDev);
                        strDev.Append(",{");
                        strDev.Append(String.Format("id:'{0}',code:'{1}',name:'{2}',uid:'{3}',uname:'{4}',s:'{5}',s2:'{6}'", 
                            di.DevId, di.DevCode, di.DevName, di.UnitId, di.UnitName, di.devStatus.Status3G, di.devStatus.Status2G));
                        strDev.Append("}");
                    }
                }
            }
            else
            {
                strControlUnitIdList = String.Empty;
            }
            strResult[0] = strDev.Length > 0 ? strDev.ToString().Substring(1) : string.Empty;
            strResult[1] = strControlUnitIdList;

            return strResult;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
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
                    strDev.Append(String.Format("code:'{0}',name:'{1}',s2:{2},s3:{3}", di.DevCode, di.DevName, di.devStatus.Status2G, di.devStatus.Status3G));
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

    #region  获得用户列表
    public string GetUserList(int unitId, int status, bool getChild)
    {
        try
        {
            UserManage um = new UserManage(this.DBConnectionString);
            DBResultInfo dbResult = um.GetUserInfo(unitId, -1, status, -1, -1, 0, 0, getChild);
            DataSet dsUser = dbResult.dsResult;

            StringBuilder strUser = new StringBuilder();

            if (dsUser != null && dsUser.Tables[0] != null && dsUser.Tables[0].Rows.Count > 0)
            {
                DataView dv = new DataView(dsUser.Tables[0], "role_id = 3", "", DataViewRowState.CurrentRows);

                int n = 0;
                foreach (DataRowView dr in dv)
                {
                    UserInfo ui = um.FillUserInfo(dr);

                    strUser.Append(n++ > 0 ? "," : "");
                    strUser.Append("{");
                    strUser.Append(String.Format("id:'{0}',name:'{1}',realname:'{2}',status:'{3}'", ui.UserId, ui.UserName, ui.RealName, ui.Status));
                    strUser.Append(String.Format(",uid:'{0}',uname:'{1}',rid:'{2}',rname:'{3}'", ui.UnitId, ui.UnitName, ui.RoleId, ui.RoleName));
                    strUser.Append("}");
                }
            }

            return strUser.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return string.Empty;
        }
    }
    #endregion

}
