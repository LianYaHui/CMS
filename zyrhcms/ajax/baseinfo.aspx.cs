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
using System.Xml;
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;
using Zyrh.Model.Device;
using Zyrh.DBUtility;
using Zyrh.DAL;

public partial class ajax_baseinfo : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int id = 0;
    protected string strLineIndexCode = string.Empty;
    protected string strRegionIndexCode = string.Empty;
    protected string strDeptIndexCode = string.Empty;
    protected string strTensionLengthIndexCode = string.Empty;
    protected string strTypeIdList = string.Empty;
    protected string strDeptIdList = string.Empty;
    protected string strKeywords = string.Empty;
    protected string strLineIdList = string.Empty;
    protected string strPlanType = string.Empty;
    protected string strWorkPlace = string.Empty;
    protected string strIndexCodeList = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 0;
    protected int parentId = -1;
    protected int level = -1;
    protected int upDownLine = 0;

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
        this.strAction = Public.RequestString("action");
        this.pageIndex = Public.RequestString("pageIndex", 0);
        this.pageSize = Public.RequestString("pageSize", 0);

        switch (strAction)
        {
            case "getDepartment":
                this.id = Public.RequestString("id", 0);
                string strLevelList = Public.RequestString("levelList");
                Response.Write(this.GetDepartmentInfo(this.id, strLevelList));
                break;
            case "getRailwayLine":
                Response.Write(this.GetRailwayLine());
                break;
            case "getUpDownLine":
                Response.Write(this.GetRailwayUpDownLine());
                break;
            case "getLineRegionList":
                this.strLineIndexCode = Public.RequestString("lineIndexCode");
                this.strDeptIndexCode = Public.RequestString("deptIndexCode");
                Response.Write(this.GetRailwayLineRegion(this.strLineIndexCode, this.strDeptIndexCode));
                break;
            case "getTensionLengthList":
                this.strRegionIndexCode = Public.RequestString("regionIndexCode");
                this.strDeptIndexCode = Public.RequestString("deptIndexCode");
                this.upDownLine = Public.RequestString("upDownLine", 0);
                Response.Write(this.GetRailwayTensionLength(this.strRegionIndexCode, this.strDeptIndexCode, this.upDownLine));                
                break;
            case "getDeviceType":
                this.parentId = Public.RequestString("parentId", -1);
                this.level = Public.RequestString("level", -1);
                Response.Write(this.GetRailwayDeviceType(this.parentId, this.level));
                break;
            case "getPillarList":
                this.strTensionLengthIndexCode = Public.RequestString("tensionLengthIndexCode");
                float kilometerPostStart = Convert.ToSingle(Public.RequestString("kilometerPostStart", "0.0"));
                float kilometerPostEnd = Convert.ToSingle(Public.RequestString("kilometerPostEnd", "0.0"));
                Response.Write(this.GetRailwayPillar(this.strTensionLengthIndexCode, kilometerPostStart, kilometerPostEnd));
                break;
            case "getSubstationList":
                this.strLineIndexCode = Public.RequestString("lineIndexCode");
                this.strTypeIdList = Public.RequestString("typeIdList");
                Response.Write(this.GetRailwaySubstation(this.strLineIndexCode, this.strTypeIdList));
                break;
            case "getStationList":
                this.strKeywords = Public.RequestString("keywords");
                this.strLineIdList = Public.RequestString("lineIdList");
                this.strTypeIdList = Public.RequestString("typeIdList");
                this.pageIndex = Public.RequestString("pageIndex", 0);
                this.pageSize = Public.RequestString("pageSize", 0);
                Response.Write(this.GetRailwayStation(this.strKeywords, this.strLineIdList, this.strTypeIdList, this.pageIndex, this.pageSize));
                break;
            case "getLandmarkType":
                bool isInLAN = Public.RequestString("isInLAN", 0) == 1;
                Response.Write(this.GetLandmarkTypeInfo(isInLAN));     
                break;
            case "getLandmarkList":
                this.strTypeIdList = Public.RequestString("typeIdList");
                this.strDeptIdList = Public.RequestString("deptIdList");
                Response.Write(this.GetLandmarkInfo(this.strTypeIdList, this.strDeptIdList, false));
                break;
            case "getWorkLandmark":
                int typeId = Public.RequestString("typeId",0);
                string strDeptIndexCodeList = Public.RequestString("indexCodeList");
                Response.Write(this.GetDepartmentLocation(typeId, strDeptIndexCodeList));
                break;
            case "getWorkPlanLocation":
                this.strPlanType = Public.RequestString("planType");
                this.strIndexCodeList = Public.RequestString("indexCodeList");
                this.strWorkPlace = Public.RequestString("workPlace");
                Response.Write(this.GetWorkPlanLocation(this.strPlanType, this.strIndexCodeList, this.strWorkPlace));
                break;
            case "getWorkPlanWorkPlace":
                this.strPlanType = Public.RequestString("planType");
                this.strWorkPlace = Public.RequestString("workPlace");
                Response.Write(this.GetWorkPlanWorkPlace(this.strPlanType, this.strWorkPlace));
                break;
            case "getDepartmentLocation":
                this.strIndexCodeList = Public.RequestString("indexCodeList");
                this.strPlanType = Public.RequestString("planType");
                Response.Write(this.GetWorkPlanDepartmentLocation(this.strIndexCodeList, this.strPlanType, "2,3"));
                break;
            case "getDepartmentBoundary":
                this.strDeptIndexCode = Public.RequestString("deptIndexCode");
                Response.Write(this.GetDepartmentBoundary(this.strDeptIndexCode));
                break;
            default:
                Response.Write("ok");
                break;
        }
    }
    #endregion


    #region  获得部门信息
    protected string GetDepartmentInfo(int id, string strLevelList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            DepartmentManage depManage = new DepartmentManage(this.DBConnectionString);

            DBResultInfo dbResult = depManage.GetDepartmentInfo(id, strLevelList);
            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DepartmentInfo depInfo = depManage.FillDepartmentInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}',code:'{2}',pid:'{3}',level:'{4}'",
                        depInfo.Id, depInfo.Name, depInfo.IndexCode, depInfo.ParentId, depInfo.Level));
                    strResult.Append(String.Format(",latitude:'{0}',longitude:'{1}',left:{2},top:{3}",
                        depInfo.Latitude, depInfo.Longitude, depInfo.LeftPos, depInfo.TopPos));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得铁路线路信息
    protected string GetRailwayLine()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayLineManage lineManage = new RailwayLineManage(this.DBConnectionString);
            DBResultInfo dbResult = lineManage.GetLineInfo();

            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayLineInfo lineInfo = lineManage.FillRailwayLine(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',number:'{1}',name:'{2}',sortOrder:'{3}'",
                        lineInfo.Id, lineInfo.LineNumber, lineInfo.LineName, lineInfo.SortOrder));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得铁路线路上下行信息
    protected string GetRailwayUpDownLine()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayUpDownLineManage lineManage = new RailwayUpDownLineManage(this.DBConnectionString);
            DBResultInfo dbResult = lineManage.GetUpDownLineInfo();

            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayUpDownLineInfo lineInfo = lineManage.FillUpDownLine(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}'", lineInfo.Id, lineInfo.Name));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得铁路线路区间信息
    protected string GetRailwayLineRegion(string strLineIndexCode, string strDeptIndexCode)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayLineRegionManage regionManage = new RailwayLineRegionManage(this.DBConnectionString);
            DepartmentManage deptManage = new DepartmentManage(this.DBConnectionString);

            string strDeptIndexCodeList = deptManage.GetDepartmentIndexCodeList(strDeptIndexCode);

            DBResultInfo dbResult = regionManage.GetLineRegionBaseInfo(strLineIndexCode, strDeptIndexCodeList);

            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayLineRegionInfo regionInfo = regionManage.FillLineRegionBaseInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("code:'{0}',name:'{1}'", regionInfo.IndexCode, regionInfo.RegionName));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion
    
    #region  获得铁路线路锚段信息
    protected string GetRailwayTensionLength(string strRegionIndexCode, string strDeptIndexCode, int upDownLine)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayTensionLengthManage tlManage = new RailwayTensionLengthManage(this.DBConnectionString);
            DepartmentManage deptManage = new DepartmentManage(this.DBConnectionString);

            string strDeptIndexCodeList = deptManage.GetDepartmentIndexCodeList(strDeptIndexCode);

            DBResultInfo dbResult = tlManage.GetTensionLengthBaseInfo(strRegionIndexCode, strDeptIndexCodeList, upDownLine);

            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1");
            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.Replace("'", "\'")));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayTensionLengthInfo info = tlManage.FillTensionLengthBaseInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("code:'{0}',name:'{1}'", info.IndexCode, info.Name));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得铁路设备分类
    public string GetRailwayDeviceType(int parentId, int level)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayDeviceTypeManage dtManage = new RailwayDeviceTypeManage(this.DBConnectionString);

            DBResultInfo dbResult = dtManage.GetDeviceType(parentId, level);

            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1");
            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.Replace("'", "\'")));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayDeviceTypeInfo dt = dtManage.FillDeviceTypeInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},typeId:{1},typeCode:'{2}',typeName:'{3}'", dt.Id,  dt.TypeId, dt.TypeCode, dt.TypeName));
                    strResult.Append(String.Format(",level:{0},parentId:{1},createTime:'{2}'",
                        dt.Level, dt.ParentId, dt.CreateTime));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得铁路供电支柱信息
    public string GetRailwayPillar(string strTensionLengthIndexCode, float kilometerPostStart, float kilometerPostEnd)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayPillarManage pillarManage = new RailwayPillarManage(this.DBConnectionString);

            DBResultInfo dbResult = pillarManage.GetPillarInfo(string.Empty, strTensionLengthIndexCode, kilometerPostStart, kilometerPostEnd);

            DataSet ds = dbResult.dsResult;
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            strResult.Append("{result:1");
            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.Replace("'", "\'")));
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayPillarInfo pillar = pillarManage.FillPillarInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("code:'{0}',name:'{1}', pid:'{2}'", pillar.PillarCode, pillar.PillarName, pillar.TensionLengthIndexcode));
                    strResult.Append(String.Format(",kilometerPost:{0},latitude:'{1}',longitude:'{2}',upDown:{3}", 
                        pillar.KilometerPost, pillar.Latitude, pillar.Longitude, pillar.UpDown));
                    strResult.Append(String.Format(",createTime:'{0}'", pillar.CreateTime));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得铁路所亭信息
    public string GetRailwaySubstation(string strLineIndexCodeList, string strTypeIdList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwaySubstationManage substationManage = new RailwaySubstationManage(this.DBConnectionString);

            DBResultInfo dbResult = substationManage.GetSubstationInfo(strLineIndexCodeList, strTypeIdList);

            DataSet ds = dbResult.dsResult;
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            strResult.Append("{result:1");
            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.Replace("'", "\'")));
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwaySubstationInfo substation = substationManage.FillSubstationInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("code:'{0}',name:'{1}',pinyin:'{2}'", 
                        substation.IndexCode, substation.Name, substation.PinYinCode));
                    strResult.Append(String.Format(",typeId:{0},latitude:'{1}',longitude:'{2}',lineIndexCode:'{3}'",
                        substation.TypeId, substation.Latitude, substation.Longitude, substation.LineIndexCode));
                    strResult.Append(String.Format(",left:{0},top:{1}", substation.LeftPos, substation.TopPos));
                    strResult.Append(String.Format(",createTime:'{0}'", substation.CreateTime));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得车站信息
    public string GetRailwayStation(string strKeywords, string strLineIdList, string strTypeIdList, int pageIndex, int pageSize)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayStationManage stationManage = new RailwayStationManage(this.DBConnectionString);

            DBResultInfo dbResult = stationManage.GetStationInfo(strKeywords, strLineIdList, strTypeIdList, pageIndex, pageSize);

            DataSet ds = dbResult.dsResult;
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            strResult.Append("{result:1");
            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.Replace("'", "\'")));
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayStationInfo station = stationManage.FillRailwayStationInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}'", station.Id, station.Name));
                    strResult.Append(String.Format(",lineId:{0},latitude:'{1}',longitude:'{2}',left:{3},top:{4},pinyin:'{5}'",
                        station.LineId, station.Latitude, station.Longitude, station.LeftPos, station.TopPos, station.PinYinCode));
                    strResult.Append(String.Format(",createTime:'{0}'", station.CreateTime));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得地标类型信息
    public string GetLandmarkTypeInfo(bool isInLAN)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            LandmarkManage landmarkManage = new LandmarkManage(this.DBConnectionString);

            DBResultInfo dbResult = landmarkManage.GetLandmarkTypeInfo();
            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");

            ControlUnitManage cum = new ControlUnitManage(this.DBConnectionString);
            DeviceManage di = new DeviceManage(this.DBConnectionString);

            int deptId = 2;
            int unitId = 2;
            string strUnitIdList = cum.GetControlUnitIdList(unitId);
            int dataCount = 0;
            int dataType = 1;

            if (!isInLAN)
            {
                //设备
                dbResult = di.GetDeviceBaseInfoList(string.Empty, strUnitIdList);
                DataSet dsDev = dbResult.dsResult;

                dataCount = this.GetDataCount(dsDev);
                strResult.Append(String.Format("{{type:{0},name:'视频设备',dataCount:{1}}}", dataType++, dataCount));
                strResult.Append(",");
            }
            else
            {
                dataType++;
            }
            //车站
            RailwayStationManage sm = new RailwayStationManage(this.DBConnectionString);
            DataSet dsStation = sm.GetStationInfo(string.Empty, string.Empty, string.Empty, 0, 0).dsResult;
            dataCount = this.GetDataCount(dsStation);
            strResult.Append(String.Format("{{type:{0},name:'车站',dataCount:{1}}}", dataType++, dataCount));

            //车间
            DepartmentManage depm = new DepartmentManage(this.DBConnectionString);
            DataSet dsDept = depm.GetDepartmentInfo(deptId, "2").dsResult;
            dataCount = this.GetDataCount(dsDept);
            strResult.Append(String.Format(",{{type:{0},name:'车间',dataCount:{1}}}", dataType++, dataCount));

            //工班
            dsDept = depm.GetDepartmentInfo(deptId, "3").dsResult;
            dataCount = this.GetDataCount(dsDept);
            strResult.Append(String.Format(",{{type:{0},name:'工班',dataCount:{1}}}", dataType++, dataCount));

            //所亭
            RailwaySubstationManage ssm = new RailwaySubstationManage(this.DBConnectionString);
            DataSet dsSubstation = ssm.GetSubstationInfo(string.Empty, string.Empty).dsResult;
            string[] arrSubstationTypeName = { "变电所", "分区所", "AT所", "开闭所" };
            int[] arrSubstationTypeId = { 20100, 20200, 20300, 20400 };

            if (dsSubstation != null && dsSubstation.Tables[0] != null && dsSubstation.Tables[0].Rows.Count > 0)
            {
                for (int i = 0, c = arrSubstationTypeId.Length; i < c; i++)
                {
                    DataView dv = new DataView(dsSubstation.Tables[0], "type_id=" + arrSubstationTypeId[i], "", DataViewRowState.CurrentRows);
                    dataCount = this.GetDataCount(dv);
                    strResult.Append(String.Format(",{{type:{0},name:'{1}',dataCount:{2}}}", dataType++, arrSubstationTypeName[i], dataCount));
                }
            }
            else
            {
                for (int i = 0, c = arrSubstationTypeId.Length; i < c; i++)
                {
                    strResult.Append(String.Format(",{{type:{0},name:'{1}',dataCount:0}}", dataType++, arrSubstationTypeName[i]));
                }
            }

            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得数据条数
    public int GetDataCount(DataSet ds)
    {
        try
        {
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }
            else
            {
                dataCount = 0;
            }
            return dataCount;
        }
        catch (Exception ex) { throw (ex); }
    }

    public int GetDataCount(DataView dv)
    {
        try
        {
            int dataCount = 0;
            if (dv != null && dv.Count > 0)
            {
                dataCount = dv.Count;
            }
            else
            {
                dataCount = 0;
            }
            return dataCount;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  获得地标数据
    public string GetLandmarkData(int type, bool onlyShowPos)
    {
        try
        {
            DepartmentManage depm = null;
            DataSet dsDept = null;
            RailwaySubstationManage ssm = null;
            DataSet dsSubstation = null;
            string[] arrSubstationTypeId = { "20100", "20200", "20300", "20400" };

            StringBuilder strResult = new StringBuilder();
            int deptId = 2;
            int n = 0;
            switch (type)
            {
                case 2:
                    //车站
                    RailwayStationManage sm = new RailwayStationManage(this.DBConnectionString);
                    DataSet dsStation = sm.GetStationInfo(string.Empty, string.Empty, string.Empty, 0, 0).dsResult;
                    if (dsStation != null && dsStation.Tables[0] != null && dsStation.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in dsStation.Tables[0].Rows)
                        {
                            RailwayStationInfo rsi = sm.FillRailwayStationInfo(dr);
                            strResult.Append(n++ > 0 ? "," : "");
                            strResult.Append("{");
                            strResult.Append(String.Format("id:{0},lineId:{1},code:'{2}',name:'{3}',lat:'{4}',lng:'{5}',left:{6},top:{7},pinyin:'{8}'",
                                rsi.Id, rsi.LineId, rsi.Id, rsi.Name, rsi.Latitude, rsi.Longitude, rsi.LeftPos, rsi.TopPos, rsi.PinYinCode));
                            strResult.Append("}");

                        }
                    }
                    break;
                case 3: //车间
                    depm = new DepartmentManage(this.DBConnectionString);
                    dsDept = depm.GetDepartmentInfo(deptId, "2").dsResult;
                    strResult.Append(this.ParseDepartmentInfo(depm, dsDept));
                    break;
                case 4: //工班
                    depm = new DepartmentManage(this.DBConnectionString);
                    dsDept = depm.GetDepartmentInfo(deptId, "3").dsResult;
                    strResult.Append(this.ParseDepartmentInfo(depm, dsDept));
                    break;
                case 5: //变电所
                    ssm = new RailwaySubstationManage(this.DBConnectionString);
                    dsSubstation = ssm.GetSubstationInfo(string.Empty, arrSubstationTypeId[0]).dsResult;
                    strResult.Append(this.ParseSubstationInfo(ssm, dsSubstation));
                    break;
                case 6: //分区所
                    ssm = new RailwaySubstationManage(this.DBConnectionString);
                    dsSubstation = ssm.GetSubstationInfo(string.Empty, arrSubstationTypeId[1]).dsResult;
                    strResult.Append(this.ParseSubstationInfo(ssm, dsSubstation));
                    break;
                case 7: //AT所
                    ssm = new RailwaySubstationManage(this.DBConnectionString);
                    dsSubstation = ssm.GetSubstationInfo(string.Empty, arrSubstationTypeId[2]).dsResult;
                    strResult.Append(this.ParseSubstationInfo(ssm, dsSubstation));
                    break;
                case 8: //开闭所
                    ssm = new RailwaySubstationManage(this.DBConnectionString);
                    dsSubstation = ssm.GetSubstationInfo(string.Empty, arrSubstationTypeId[3]).dsResult;
                    strResult.Append(this.ParseSubstationInfo(ssm, dsSubstation));
                    break;
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
    #endregion

    #region  解析部门信息
    public string ParseDepartmentInfo(DepartmentManage depm, DataSet dsDept)
    {
        try
        {
            int n = 0;
            StringBuilder strResult = new StringBuilder();
            if (dsDept != null && dsDept.Tables[0] != null && dsDept.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsDept.Tables[0].Rows)
                {
                    DepartmentInfo di = depm.FillDepartmentInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},code:'{1}',name:'{2}',lat:'{3}',lng:'{4}',left:{5},top:{6}",
                        di.Id, di.IndexCode, di.Name, di.Latitude, di.Longitude, di.LeftPos, di.TopPos));
                    strResult.Append("}");
                }
            }
            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  解析所亭信息
    public string ParseSubstationInfo(RailwaySubstationManage rsm, DataSet dsSubstation)
    {
        try
        {
            int n = 0;
            StringBuilder strResult = new StringBuilder();
            if (dsSubstation != null && dsSubstation.Tables[0] != null && dsSubstation.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsSubstation.Tables[0].Rows)
                {
                    RailwaySubstationInfo rsi = rsm.FillSubstationInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},code:'{1}',name:'{2}',lat:'{3}',lng:'{4}',left:{5},top:{6}",
                        rsi.Id, rsi.IndexCode, rsi.Name, rsi.Latitude, rsi.Longitude, rsi.LeftPos, rsi.TopPos));
                    strResult.Append("}");
                }
            }
            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  获得地标类型信息
    public string GetLandmarkInfo(string strTypeIdList, string strDeptIdList, bool onlyShowPos)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            if (strTypeIdList.Equals(string.Empty))
            {
                return "{result:0}";
            }

            strResult.Append("{result:1");
            strResult.Append(",landmark:[");
            string[] arrType = strTypeIdList.Split(',');
            int typeId = 0;
            int n = 0;
            for (int i = 0, c = arrType.Length; i < c; i++)
            {
                typeId = Convert.ToInt32(arrType[i]);
                strResult.Append(n++ > 0 ? "," : "");
                strResult.Append("{");
                strResult.Append(String.Format("type:{0}", arrType[i]));
                strResult.Append(",list:[");
                switch (typeId)
                {
                    case 2: //车站
                    case 3: //车间
                    case 4: //工班
                    case 5: //变电所
                    case 6: //分区所
                    case 7: //AT所
                    case 8: //开闭所
                        strResult.Append(this.GetLandmarkData(typeId, onlyShowPos));
                        break;
                }
                strResult.Append("]");
                strResult.Append("}");
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得工班坐标信息
    public string GetDepartmentLocation(int typeId, string strIndexCodeList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strSql = new StringBuilder();
            int level = typeId == 4 ? 3 : 2;
            strSql.Append("select index_code,name,left_pos,top_pos,latitude,longitude from rp_department d ");
            strSql.Append(String.Format(" where `level` = {0} and index_code in({1}) ", level, strIndexCodeList));

            DataSet ds = Zyrh.DBUtility.MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
            strResult.Append("{result:1");
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("code:'{0}',name:'{1}',lat:'{2}',lng:'{3}',left:{4},top:{5}",
                        dr["index_code"], dr["name"], dr["latitude"], dr["longitude"], dr["left_pos"], dr["top_pos"]));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return "{result:-1,error:'" + Public.ReplaceSingleQuotes( ex.Message) + "'}";
        }
    }
    #endregion

    #region  获得施工计划部门、作业地点坐标
    public string GetWorkPlanLocation(string strPlanType, string strIndexCodeList, string strWorkPlace)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strSql = new StringBuilder();
            DataSet ds = null;
            int n = 0;
            string strKeywords = string.Empty;
            string[] strDelimiter = { " " };

            switch (strPlanType)
            {
                case "JCW":
                    strSql.Append("select index_code,name,latitude,longitude,left_pos,top_pos from rp_department p ");
                    strSql.Append(String.Format(" where p.`level` = 3 and index_code in({0});", strIndexCodeList));
                    strKeywords = this.ParseWorkPlaceKeywords(strWorkPlace);
                    if (!strKeywords.Equals(string.Empty))
                    {
                        strSql.Append("select id,name,latitude,longitude,left_pos,top_pos from rp_station s where type_id = 0 ");
                        strSql.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and s.name = '{0}' ", strDelimiter, SearchTactics.Or));
                        strSql.Append(";");
                    }
                    ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
                    break;
                case "BD":
                    strKeywords = this.ParseWorkPlaceKeywords(strWorkPlace);
                    if (!strKeywords.Equals(string.Empty))
                    {
                        strSql.Append("select id,index_code,name,latitude,longitude,left_pos,top_pos from rp_substation s where 1 = 1 ");
                        strSql.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and s.name = '{0}' ", strDelimiter, SearchTactics.Or));
                        strSql.Append(";");
                        ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
                    }
                    break;
                case "DL":
                    break;
            }
            strResult.Append("{result:1");
            strResult.Append(",list:[");

            if (strPlanType == "JCW")
            {
                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    n = 0;
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        strResult.Append(n++ > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("type: 4, code:'{0}',name:'{1}',lat:'{2}',lng:'{3}',left:{4},top:{5}",
                            dr["index_code"], dr["name"], dr["latitude"], dr["longitude"], dr["left_pos"], dr["top_pos"]));
                        strResult.Append("}");
                    }
                }
                int c = strResult.Length;

                if (ds != null && ds.Tables.Count > 1 && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                {
                    n = 0;
                    foreach (DataRow dr in ds.Tables[1].Rows)
                    {
                        strResult.Append(n++ > 0 ? "," : c > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("type: 2, id:'{0}',name:'{1}',lat:'{2}',lng:'{3}',left:{4},top:{5}",
                            dr["id"], dr["name"], dr["latitude"], dr["longitude"], dr["left_pos"], dr["top_pos"]));
                        strResult.Append("}");
                    }
                }
            }
            else if (strPlanType == "BD")
            {

                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    n = 0;
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        strResult.Append(n++ > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("type: 5, id:'{0}',name:'{1}',lat:'{2}',lng:'{3}',left:{4},top:{5}",
                            dr["id"], dr["name"], dr["latitude"], dr["longitude"], dr["left_pos"], dr["top_pos"]));
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
            return "{result:-1,error:'" + Public.ReplaceSingleQuotes(ex.Message) + "'}";
        }
    }
    #endregion

    #region  解析作业地点关键字
    public string ParseWorkPlaceKeywords(string strWorkPlace)
    {
        try
        {
            if (strWorkPlace.Equals(string.Empty))
            {
                return string.Empty;
            }
            string[] strDelimiter = { "-" };

            StringBuilder strResult = new StringBuilder();
            string[] arrPlace = strWorkPlace.Split(strDelimiter, StringSplitOptions.RemoveEmptyEntries);

            string[] strSubDelimiter = { "(", "（" };
            int n=0;
            foreach (string str in arrPlace)
            {
                strResult.Append(n++ > 0 ? " " : "");
                strResult.Append(str.Split(strSubDelimiter, StringSplitOptions.RemoveEmptyEntries)[0]);
            }

            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion
    
    #region  获得施工计划作业地点
    public string GetWorkPlanWorkPlace(string strPlanType, string strWorkPlace)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strSql = new StringBuilder();
            int n = 0;
            string[] strDelimiter = { " " };

            string strKeywords = this.ParseWorkPlaceKeywords(strWorkPlace);
            if (!strKeywords.Equals(string.Empty))
            {
                strSql.Append("select id,name,latitude,longitude,left_pos,top_pos from rp_station s where type_id = 0 ");
                strSql.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and s.name = '{0}' ", strDelimiter, SearchTactics.Or));
                strSql.Append(";");
            }
            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
            
            strResult.Append("{result:1");
            strResult.Append(",list:[");

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("type: 2, id:'{0}',name:'{1}',lat:'{2}',lng:'{3}',left:{4},top:{5}",
                        dr["id"], dr["name"], dr["latitude"], dr["longitude"], dr["left_pos"], dr["top_pos"]));
                    strResult.Append("}");
                }
            }

            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return "{result:-1,error:'" + Public.ReplaceSingleQuotes(ex.Message) + "'}";
        }
    }
    #endregion
    

    #region  获得施工计划部门信息
    public string GetWorkPlanDepartmentLocation(string strIndexCodeList, string strPlanType, string strLevelList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            DepartmentManage depManage = new DepartmentManage(this.DBConnectionString);

            DBResultInfo dbResult = depManage.GetDepartmentInfoByIndexCode(strIndexCodeList, strLevelList);
            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DepartmentInfo depInfo = depManage.FillDepartmentInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}',code:'{2}',pid:'{3}',level:'{4}'",
                        depInfo.Id, depInfo.Name, depInfo.IndexCode, depInfo.ParentId, depInfo.Level));
                    strResult.Append(String.Format(",lat:'{0}',lng:'{1}',left:{2},top:{3}",
                        depInfo.Latitude, depInfo.Longitude, depInfo.LeftPos, depInfo.TopPos));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得地标类型信息
    /*
    public string GetLandmarkTypeInfo()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            LandmarkManage landmarkManage = new LandmarkManage(this.DBConnectionString);

            DBResultInfo dbResult = landmarkManage.GetLandmarkTypeInfo();
            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    LandmarkTypeInfo landmarkType = landmarkManage.FillLandmarkTypeInfo(dr);
                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},name:'{1}',icon:'{2}',dataCount:{3}",
                        landmarkType.TypeId, landmarkType.TypeName, landmarkType.Icon, landmarkType.DataCount));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    */
    #endregion

    #region  获得地标类型信息
    /*
    public string GetLandmarkInfo(string strTypeIdList, string strDeptIdList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            MapCorrect map = new MapCorrect();

            LandmarkManage landmarkManage = new LandmarkManage(this.DBConnectionString);

            DBResultInfo dbResult = landmarkManage.GetLandmarkInfo(strTypeIdList, strDeptIdList);
            DataSet ds = dbResult.dsResult;
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    LandmarkInfo landmark = landmarkManage.FillLandmarkInfo(dr);
                    MapLatLng latLng = map.Offset(double.Parse(landmark.Latitude), double.Parse(landmark.Longitude));

                    strResult.Append(i++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},type:{1},name:'{2}',lat:'{3}',lng:'{4}',icon:'{5}'",
                        landmark.Id, landmark.TypeId, landmark.Name, latLng.Lat, latLng.Lng, landmark.LandmarkType.Icon));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    */
    #endregion


    #region  获得部门管界信息
    public string GetDepartmentBoundary(string strDeptIndexCodeList)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            strResult.Append("{result:1");
            strResult.Append(",list:[");
            if (!strDeptIndexCodeList.Equals(string.Empty))
            {
                DepartmentBoundaryManage dbm = new DepartmentBoundaryManage(this.DBConnectionString);
                DBResultInfo dbResult = dbm.GetDepartmentBoundaryInfo(-1, strDeptIndexCodeList);
                DataSet ds = dbResult.dsResult;

                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    int n = 0;
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DepartmentBoundaryInfo dbi = dbm.FillDepartmentBoundaryInfo(dr);

                        strResult.Append(n++ > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("deptIndexCode:'{0}',deptName:'{1}',latitude:'{2}',longitude:'{3}',boundary:{4}",
                            dbi.DeptIndexCode, dbi.DeptName, dbi.Latitude, dbi.Longitude, dbi.Boundary.Equals(string.Empty) ? "[]" : dbi.Boundary));
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
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

}
