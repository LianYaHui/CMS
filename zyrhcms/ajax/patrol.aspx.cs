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
using Zyrh.Common;
using Zyrh.DAL;
using Zyrh.Model;

public partial class ajax_patrol : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected GprsSocketClient wps = new GprsSocketClient();
    protected DomainIp dip = new DomainIp();
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected bool isDebug = false;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int unitId = 0;
    protected int typeId = -1;
    protected int areaId = -1;
    protected int lineId = -1;
    protected int isDelete = -1;
    protected int pointId = 0;
    protected bool getBaseInfo = false;
    protected bool getChild = false;
    protected string strKeywords = string.Empty;
    protected string strDevCode = string.Empty;
    protected string strStartDate = string.Empty;
    protected string strEndDate = string.Empty;
    protected string strUserIdList = string.Empty;

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
        this.unitId = Public.RequestString("unitId", 0);

        if (!uc.CheckUserLogin() && !this.strAction.Equals(string.Empty) && !this.isDebug)
        {
            Response.Write("{result:-1,error:'noauth'}");
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

        #region  Action
        switch (this.strAction)
        {
            #region  巡检点类型
            case "getPatrolPointType":
                this.isDelete = Public.RequestString("isDelete", -1);
                this.getBaseInfo = Public.RequestString("getBaseInfo", 0) == 1;
                Response.Write(this.GetPatrolPointType(this.isDelete, this.isDebug, this.getBaseInfo));
                break;
            case "getSinglePatrolType":
                this.typeId = Public.RequestString("typeId", 0);
                Response.Write(this.GetSinglePatrolType(this.typeId, this.isDebug));
                break;
            case "addPatrolType":
                PatrolPointTypeInfo ptAdd = new PatrolPointTypeInfo();
                ptAdd.TypeName = Public.RequestString("typeName", string.Empty);
                ptAdd.PatrolRadii = Public.RequestString("patrolRadii", 50);
                ptAdd.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                Response.Write(this.AddPatrolType(ptAdd));
                break;
            case "editPatrolType":
                PatrolPointTypeInfo ptEdit = new PatrolPointTypeInfo();
                ptEdit.TypeName = Public.RequestString("typeName", string.Empty);
                ptEdit.PatrolRadii = Public.RequestString("patrolRadii", 50);
                ptEdit.TypeId = Public.RequestString("typeId", 0);
                Response.Write(this.EditPatrolType(ptEdit));
                break;
            case "deletePatrolType":
                string strTypeIdList = Public.RequestString("typeIdList", string.Empty);
                Response.Write(this.DeletePatrolType(strTypeIdList));
                break;
            #endregion

            #region  巡检线路
            case "getPatrolLine":
                this.isDelete = Public.RequestString("isDelete", -1);
                this.lineId = Public.RequestString("lineId", -1);
                this.getChild = Public.RequestString("getChild", 0) == 1;
                Response.Write(this.GetPatrolLine(this.unitId, this.isDelete, this.pageIndex, this.pageSize, this.getChild, this.isDebug));
                break;
            case "getSinglePatrolLine":
                this.lineId = Public.RequestString("lineId", 0);
                Response.Write(this.GetSinglePatrolLine(this.lineId, this.isDebug));
                break;
            case "addPatrolLine":
                PatrolLineInfo plAdd = new PatrolLineInfo();
                plAdd.UnitId = Public.RequestString("unitId", 0);
                plAdd.LineName = Public.RequestString("lineName", string.Empty);
                plAdd.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                Response.Write(this.AddPatrolLine(plAdd));
                break;
            case "editPatrolLine":
                PatrolLineInfo plEdit = new PatrolLineInfo();
                plEdit.UnitId = Public.RequestString("unitId", 0);
                plEdit.LineName = Public.RequestString("lineName", string.Empty);
                plEdit.LineId = Public.RequestString("lineId", 0);
                Response.Write(this.EditPatrolLine(plEdit));
                break;
            case "deletePatrolLine":
                string strLineIdList = Public.RequestString("lineIdList", string.Empty);
                Response.Write(this.DeletePatrolLine(strLineIdList));
                break;
            case "getPatrolLinePoint":
                break;
            #endregion

            #region  巡检点
            case "getPatrolPoint":
                this.getBaseInfo = false;
                this.typeId = Public.RequestString("typeId", -1);
                this.areaId = Public.RequestString("areaId", -1);
                this.lineId = Public.RequestString("pLineId", -1);
                this.isDelete = Public.RequestString("isDelete", -1);
                this.strKeywords = Public.RequestString("keywords", string.Empty);
                this.getChild = Public.RequestString("getChild", 0) == 1;
                Response.Write(this.GetPatrolPoint(this.unitId, this.typeId, this.areaId, this.lineId, -1, this.isDelete, this.pageIndex, this.pageSize,
                    this.strKeywords, getChild, this.getBaseInfo, this.isDebug));
                break;
            case "getSinglePatrolPoint":
                this.pointId = Public.RequestString("pointId", 0);
                Response.Write(this.GetSinglePatrolPoint(this.pointId, this.isDebug));
                break;
            case "addPoint":
                PatrolPointInfo ppiAdd = new PatrolPointInfo();
                ppiAdd.PointName = Public.RequestString("pointName", string.Empty);
                ppiAdd.Latitude = Public.RequestString("latitude", string.Empty);
                ppiAdd.Longitude = Public.RequestString("longitude", string.Empty);
                ppiAdd.Radii = Public.RequestString("radii", 50);
                ppiAdd.UnitId = Public.RequestString("unitId", 0);
                ppiAdd.TypeId = Public.RequestString("typeId", 0);
                ppiAdd.LineId = Public.RequestString("lineId", 0);
                ppiAdd.SequenceIndex = Public.RequestString("sequenceIndex", 0);

                Response.Write(this.AddPoint(ppiAdd));
                break;
            case "editPoint":
                PatrolPointInfo ppiEdit = new PatrolPointInfo();
                ppiEdit.PointId = Public.RequestString("pointId", 0);
                ppiEdit.PointName = Public.RequestString("pointName", string.Empty);
                ppiEdit.Latitude = Public.RequestString("latitude", string.Empty);
                ppiEdit.Longitude = Public.RequestString("longitude", string.Empty);
                ppiEdit.Radii = Public.RequestString("radii", 50);
                ppiEdit.UnitId = Public.RequestString("unitId", 0);
                ppiEdit.TypeId = Public.RequestString("typeId", 0);
                ppiEdit.LineId = Public.RequestString("lineId", 0);
                ppiEdit.SequenceIndex = Public.RequestString("sequenceIndex", 0);

                Response.Write(this.EditPoint(ppiEdit));
                break;
            case "deletePoint":
                string strPointIdList = Public.RequestString("pointIdList", string.Empty);
                Response.Write(this.DeletePoint(strPointIdList));
                break;
            #endregion

            #region  巡检任务
            case "addPatrolTask":
                this.typeId = Public.RequestString("typeId", 0);
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.strStartDate = Public.RequestString("startDate", string.Empty);
                this.strEndDate = Public.RequestString("endDate", string.Empty);
                this.strUserIdList = Public.RequestString("userIdList", string.Empty);
                string strPatrolPoint = Public.RequestString("patrolPoint", string.Empty, false);
                string strPatrolShift = Public.RequestString("patrolShift", string.Empty, false);
                string strPatrolPlan = Public.RequestString("patrolPlan", string.Empty, false);

                //Response.Write(strPatrolPoint + "<br />");
                //Response.Write(strPatrolShift + "<br />");
                //Response.Write(strPatrolPlan + "<br />");
                Response.Write(this.AddPatrolTask(this.unitId, this.typeId, ui.UserId, this.strDevCode, this.strStartDate, this.strEndDate, this.strUserIdList, strPatrolPoint, strPatrolShift, strPatrolPlan));
                break;
            #endregion

            case "getPatrolTask":
                break;
            case "getPatrolArea":
                break;
            default:
                Response.Write("ok");
                break;
        }
        #endregion
    }

    #region  获得巡检点信息
    public string GetPatrolPoint(int unitId, int typeId, int areaId, int lineId, int addType, int isDelete, int pageIndex, int pageSize, 
        string strKeywords, bool getChild, bool getBaseInfo, bool isDebug)
    {
        int dataCount = 0;
        try
        {
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            StringBuilder strResult = new StringBuilder();
            PatrolPointManage ppm = new PatrolPointManage(this.DBConnectionString);
            DBResultInfo dbResult = ppm.GetPatrolPoint(strUnitIdList, typeId, areaId, lineId, addType, isDelete, pageIndex, pageSize, getBaseInfo, strKeywords);

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            strResult.Append("{result:1");
            strResult.Append(string.Format(",dataCount:'{0}'", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PatrolPointInfo pp = ppm.FillPatrolPoint(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("pointId:'{0}',pointName:'{1}',latitude:'{2}',longitude:'{3}',radii:'{4}',createTime:'{5}',addType:'{6}'",
                        pp.PointId, pp.PointName, pp.Latitude, pp.Longitude, pp.Radii, pp.CreateTime, pp.AddType));
                    strResult.Append(String.Format(",typeId:'{0}',typeName:'{1}',unitId:'{2}',unitName:'{3}',lineId:'{4}',lineName:'{5}'",
                        pp.TypeId, pp.PointType.TypeName, pp.UnitId, pp.ControlUnit.UnitName, pp.LineId, pp.PatrolLine.LineName));
                    strResult.Append("}");
                    n++;
                }
            }
            strResult.Append("]");
            if (isDebug)
            {
                strResult.Append(string.Format(",lineId:'{0}'", dbResult.iResult));
                strResult.Append(String.Format(",sql:'{0}'", Public.ReplaceSingleQuotes(dbResult.strSql)));
            }
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:'{0}',list:[],error:'{1}'}}", dataCount, Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得单个巡检点信息
    public string GetSinglePatrolPoint(int pointId, bool isDebug)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            PatrolPointManage ppm = new PatrolPointManage(this.DBConnectionString);
            DBResultInfo dbResult = ppm.GetPatrolPoint(pointId);

            DataSet ds = dbResult.dsResult;


            strResult.Append("{result:1");
            strResult.Append(",point:{");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                PatrolPointInfo pp = ppm.FillPatrolPoint(ds.Tables[0].Rows[0]);

                strResult.Append(String.Format("pointId:'{0}',pointName:'{1}',latitude:'{2}',longitude:'{3}',radii:'{4}',createTime:'{5}'",
                    pp.PointId, pp.PointName, pp.Latitude, pp.Longitude, pp.Radii, pp.CreateTime));
                strResult.Append(String.Format(",typeId:'{0}',typeName:'{1}',unitId:'{2}',unitName:'{3}',lineId:'{4}',lineName:'{5}'",
                    pp.TypeId, pp.PointType.TypeName, pp.UnitId, pp.ControlUnit.UnitName, pp.LineId, pp.PatrolLine.LineName));
            }
            strResult.Append("}");
            if (isDebug)
            {
                strResult.Append(String.Format(",sql:'{0}'", Public.ReplaceSingleQuotes(dbResult.strSql)));
            }
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,point:{{}},error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加巡检点
    public string AddPoint(PatrolPointInfo ppi)
    {
        try
        {
            ppi.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            PatrolPointManage ppm = new PatrolPointManage(this.DBConnectionString);
            if (ppm.CheckPointIsExist(-1, ppi.PointName) > 0)
            {
                return "{result:-2}";
            }
            else
            {
                if (!ppi.PointName.Equals(string.Empty) && ppi.TypeId > 0 && !ppi.Latitude.Equals(string.Empty) && !ppi.Longitude.Equals(string.Empty))
                {
                    DBResultInfo dbResult = ppm.InsertPatrolPoint(ppi);

                    int result = dbResult.iResult;

                    return String.Format("{{result:{0},yes:1}}", result > 0 ? 1 : 0);
                }
                else
                {
                    return "{result:0,no:1}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  修改巡检点
    public string EditPoint(PatrolPointInfo ppi)
    {
        try
        {
            ppi.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            PatrolPointManage ppm = new PatrolPointManage(this.DBConnectionString);
            if (ppm.CheckPointIsExist(ppi.PointId, ppi.PointName) > 0)
            {
                return "{result:-2}";
            }
            else
            {
                if (ppi.PointId > 0 && !ppi.PointName.Equals(string.Empty) && ppi.TypeId > 0 && !ppi.Latitude.Equals(string.Empty) && !ppi.Longitude.Equals(string.Empty))
                {
                    DBResultInfo dbResult = ppm.UpdatePatrolPoint(ppi);

                    int result = dbResult.iResult;

                    return String.Format("{{result:{0}}}", result > 0 ? 1 : 0);
                }
                else
                {
                    return "{result:0}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  删除巡检点
    public string DeletePoint(string strPointIdList)
    {
        try
        {
            PatrolPointManage ppm = new PatrolPointManage(this.DBConnectionString);
            if (!strPointIdList.Equals(string.Empty))
            {
                DBResultInfo dbResult = ppm.DeletePatrolPoint(strPointIdList);

                int result = dbResult.iResult;

                return String.Format("{{result:{0}, count:{1}}}", result > 0 ? 1 : 0, result);
            }
            else
            {
                return "{result:0}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得巡检点类型
    public string GetPatrolPointType(int isDelete, bool isDebug, bool getBaseInfo)
    {
        int dataCount = 0;
        try
        {
            StringBuilder strResult = new StringBuilder();
            PatrolPointTypeManage ppm = new PatrolPointTypeManage(this.DBConnectionString);
            DBResultInfo dbResult = ppm.GetPointTypeInfo(-1, isDelete, getBaseInfo);

            DataSet ds = dbResult.dsResult;

            strResult.Append("{result:1");
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                dataCount = ds.Tables[0].Rows.Count;

                int n = 0;
                if (getBaseInfo)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        PatrolPointTypeInfo pp = ppm.FillPatrolPointTypeBaseInfo(dr);
                        strResult.Append(n > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("typeId:'{0}',typeName:'{1}'", pp.TypeId, pp.TypeName));
                        strResult.Append("}");
                        n++;
                    }
                }
                else
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        PatrolPointTypeInfo pp = ppm.FillPatrolPointType(dr);
                        strResult.Append(n > 0 ? "," : "");
                        strResult.Append("{");
                        strResult.Append(String.Format("typeId:'{0}',typeName:'{1}',typeDesc:'{2}',typeImage:'{3}',patrolRadii:'{4}',isDelete:'{5}',createTime:'{6}',pointCount:'{7}'",
                            pp.TypeId, pp.TypeName, pp.TypeDesc, pp.TypeImage, pp.PatrolRadii, pp.IsDelete, pp.CreateTime, pp.PointCount));
                        strResult.Append("}");
                        n++;
                    }
                }
            }
            strResult.Append("]");
            strResult.Append(string.Format(",dataCount:'{0}'", dataCount));
            if (isDebug)
            {
                strResult.Append(String.Format(",sql:'{0}'", Public.ReplaceSingleQuotes(dbResult.strSql)));
            }
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:'{0}',list:[],error:'{1}'}}", dataCount, Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得单个巡检线路信息
    public string GetSinglePatrolType(int typeId, bool isDebug)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            PatrolPointTypeManage ptm = new PatrolPointTypeManage(this.DBConnectionString);
            DBResultInfo dbResult = ptm.GetPointTypeInfo(typeId, -1, false);

            DataSet ds = dbResult.dsResult;

            strResult.Append("{result:1");
            strResult.Append(",type:{");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                PatrolPointTypeInfo pp = ptm.FillPatrolPointType(ds.Tables[0].Rows[0]);

                strResult.Append(String.Format("typeId:'{0}',typeName:'{1}',typeDesc:'{2}',typeImage:'{3}',patrolRadii:'{4}',isDelete:'{5}',createTime:'{6}'",
                    pp.TypeId, pp.TypeName, pp.TypeDesc, pp.TypeImage, pp.PatrolRadii, pp.IsDelete, pp.CreateTime));
            }
            strResult.Append("}");
            if (isDebug)
            {
                strResult.Append(String.Format(",sql:'{0}'", Public.ReplaceSingleQuotes(dbResult.strSql)));
            }
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,line:{{}},error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加巡检点类型
    public string AddPatrolType(PatrolPointTypeInfo pti)
    {
        try
        {
            PatrolPointTypeManage ptm = new PatrolPointTypeManage(this.DBConnectionString);
            if (ptm.CheckPointTypeIsExist(pti.TypeName) > 0)
            {
                return "{result:-2}";
            }
            else
            {
                if (!pti.TypeName.Equals(string.Empty))
                {
                    DBResultInfo dbResult = ptm.InsertPointType(pti);

                    int result = dbResult.iResult;

                    return String.Format("{{result:{0},yes:1}}", result > 0 ? 1 : 0);
                }
                else
                {
                    return "{result:0,no:1}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  修改巡检点类型
    public string EditPatrolType(PatrolPointTypeInfo pti)
    {
        try
        {
            PatrolPointTypeManage ptm = new PatrolPointTypeManage(this.DBConnectionString);
            if (ptm.CheckPointTypeIsExist(pti.TypeId, pti.TypeName) > 0)
            {
                return "{result:-2}";
            }
            else
            {
                if (pti.TypeId > 0 && !pti.TypeName.Equals(string.Empty))
                {
                    DBResultInfo dbResult = ptm.UpdatePointType(pti);

                    int result = dbResult.iResult;

                    return String.Format("{{result:{0}}}", result > 0 ? 1 : 0);
                }
                else
                {
                    return "{result:0}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  删除巡检点类型
    public string DeletePatrolType(string strTypeIdList)
    {
        try
        {
            PatrolPointTypeManage ptm = new PatrolPointTypeManage(this.DBConnectionString);
            if (!strTypeIdList.Equals(string.Empty))
            {
                int result = ptm.DeletePointType(strTypeIdList);

                return String.Format("{{result:{0}, count:{1}}}", result > 0 ? 1 : 0, result);
            }
            else
            {
                return "{result:0}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    #region  获得巡检线路
    public string GetPatrolLine(int unitId, int isDelete, int pageIndex, int pageSize, bool getChild, bool isDebug)
    {
        int dataCount = 0;
        try
        {
            string strUnitIdList = getChild ? new ControlUnitManage(this.DBConnectionString).GetControlUnitIdList(unitId) : unitId.ToString();

            StringBuilder strResult = new StringBuilder();
            PatrolLineManage plm = new PatrolLineManage(this.DBConnectionString);
            DBResultInfo dbResult = plm.GetPatrolLineInfo(-1, strUnitIdList, isDelete, false, pageIndex, pageSize);

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            strResult.Append("{result:1");
            strResult.Append(string.Format(",dataCount:'{0}'", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PatrolLineInfo pl = plm.FillPatrolLine(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("lineId:'{0}',lineName:'{1}',createTime:'{2}'", pl.LineId, pl.LineName, pl.CreateTime));
                    strResult.Append(String.Format(",unitId:'{0}',unitName:'{1}',pointCount:'{2}',isDelete:'{3}'", 
                        pl.UnitId, pl.UnitName, pl.PointCount, pl.IsDelete));
                    strResult.Append("}");
                    n++;
                }
            }
            strResult.Append("]");
            if (isDebug)
            {
                strResult.Append(String.Format(",sql:'{0}'", Public.ReplaceSingleQuotes(dbResult.strSql)));
            }
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:'{0}',list:[],error:'{1}'}}", dataCount, Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得单个巡检线路信息
    public string GetSinglePatrolLine(int lineId, bool isDebug)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            PatrolLineManage plm = new PatrolLineManage(this.DBConnectionString);
            DBResultInfo dbResult = plm.GetPatrolLineInfo(lineId, string.Empty, -1, false);

            DataSet ds = dbResult.dsResult;


            strResult.Append("{result:1");
            strResult.Append(",line:{");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                PatrolLineInfo pl = plm.FillPatrolLine(ds.Tables[0].Rows[0]);

                strResult.Append(String.Format("lineId:'{0}',lineName:'{1}',createTime:'{2}'", pl.LineId, pl.LineName, pl.CreateTime));
                strResult.Append(String.Format(",unitId:'{0}',unitName:'{1}',pointCount:'{2}',isDelete:'{3}'",
                    pl.UnitId, pl.UnitName, pl.PointCount, pl.IsDelete));
            }
            strResult.Append("}");
            if (isDebug)
            {
                strResult.Append(String.Format(",sql:'{0}'", Public.ReplaceSingleQuotes(dbResult.strSql)));
            }
            strResult.Append("}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,line:{{}},error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加巡检线路
    public string AddPatrolLine(PatrolLineInfo pli)
    {
        try
        {
            PatrolLineManage plm = new PatrolLineManage(this.DBConnectionString);
            if (plm.CheckLineIsExist(-1, pli.LineName) > 0)
            {
                return "{result:-2}";
            }
            else
            {
                if (!pli.LineName.Equals(string.Empty) && pli.UnitId > 0)
                {
                    DBResultInfo dbResult = plm.InsertPatrolLine(pli);

                    int result = dbResult.iResult;

                    return String.Format("{{result:{0},yes:1}}", result > 0 ? 1 : 0);
                }
                else
                {
                    return "{result:0,no:1}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  修改巡检线路
    public string EditPatrolLine(PatrolLineInfo pli)
    {
        try
        {
            PatrolLineManage plm = new PatrolLineManage(this.DBConnectionString);
            if (plm.CheckLineIsExist(pli.LineId, pli.LineName) > 0)
            {
                return "{result:-2}";
            }
            else
            {
                if (pli.LineId > 0 && !pli.LineName.Equals(string.Empty) && pli.UnitId > 0)
                {
                    DBResultInfo dbResult = plm.UpdatePatrolLine(pli);

                    int result = dbResult.iResult;

                    return String.Format("{{result:{0}}}", result > 0 ? 1 : 0);
                }
                else
                {
                    return "{result:0}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  删除巡检线路
    public string DeletePatrolLine(string strLineIdList)
    {
        try
        {
            PatrolLineManage plm = new PatrolLineManage(this.DBConnectionString);
            if (!strLineIdList.Equals(string.Empty))
            {
                int result = plm.DeletePatrolLine(strLineIdList);

                return String.Format("{{result:{0}, count:{1}}}", result > 0 ? 1 : 0, result);
            }
            else
            {
                return "{result:0}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加巡检任务
    public string AddPatrolTask(int unitId, int typeId, int operatorId, string strDevCode, string strStartDate, string strEndDate, string strUserIdList, string strPatrolPoint, string strPatrolShift, string strPatrolPlan)
    {
        try
        {
            PatrolTaskInfo pti = new PatrolTaskInfo();
            pti.UnitId = unitId;
            pti.TypeId = typeId;
            pti.DevCode = strDevCode;
            pti.StartDate = strStartDate;
            pti.EndDate = strEndDate;
            pti.UserIdList = strUserIdList;
            pti.PatrolPoint = strPatrolPoint.Replace("'", "\\\'");
            pti.PatrolShift = strPatrolShift.Replace("'", "\\\'");
            pti.PatrolPlan = strPatrolPlan.Replace("'", "\\\'");
            pti.OperatorId = operatorId;
            pti.SendTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            pti.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            PatrolTaskManage taskManage = new PatrolTaskManage(this.DBConnectionString);
            string strSql = taskManage.BuildAddPatrolTaskSql(pti);
            int taskId = taskManage.AddPatrolTask(strSql);

            if (taskId > 0)
            {
                pti.TaskId = taskId;
                pti.PatrolPoint = strPatrolPoint;
                pti.PatrolShift = strPatrolShift;
                pti.PatrolPlan = strPatrolPlan;

                taskManage.DeletePatrolTaskPlainByAdd(strDevCode, string.Empty, 1, "Add_Delete");

                DBResultInfo dbResult = taskManage.AnalysisTaskPlan(pti, 1);

                try
                {
                    string strProtocol = String.Format("Task*{0}#", strDevCode);
                    string ipAddr = dip.GetIpAddress();
                    GprsSocketClient.SendProtocol(strProtocol);
                    ServerLog.WriteEventLog(HttpContext.Current.Request, "WebProtocolSend", "\r\n" + strProtocol + "From:" + ipAddr);
                }
                catch (Exception exx)
                {
                    ServerLog.WriteErrorLog(exx, HttpContext.Current);
                }
                //Response.Write(dbResult.strSql + "<br />");

                return String.Format("{{result:1,taskId:{0},taskPlan:{1}}}", taskId, dbResult.iResult);
            }
            else
            {
                return String.Format("{{result:0}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

}