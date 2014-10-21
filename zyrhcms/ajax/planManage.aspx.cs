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
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;
using Zyrh.DBUtility;

public partial class ajax_planManage : System.Web.UI.Page
{

    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int id = 0;
    protected string strPlanIdList = string.Empty;
    protected string strKeywords = string.Empty;
    protected string strProfessionIdList = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 20;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        this.strAction = Public.RequestString("action", string.Empty);
        this.pageIndex = Public.RequestString("pageIndex", 0);
        this.pageSize = Public.RequestString("pageSize", 0);

        switch (this.strAction)
        {
            case "getResponsePlanList":
                Response.Write(this.GetResponsePlanList(this.pageIndex, this.pageSize));
                break;
            case "getResponsePlan":
                this.strProfessionIdList = Public.RequestString("professionIdList");
                this.strKeywords = Public.RequestString("keywords");
                Response.Write(this.GetResponsePlan(this.strProfessionIdList, string.Empty, this.strKeywords, this.pageIndex, this.pageSize));
                break;
            case "getSingleResponsePlan":
                this.id = Public.RequestString("id", 0);
                Response.Write(this.GetSingleResponsePlan(this.id));                
                break;
            case "deleteResponsePlan":
                this.strPlanIdList = Public.RequestString("planIdList");
                Response.Write(this.DeleteResponsePlan(strPlanIdList));
                break;
            default:
                Response.Write("ok");
                break;
        }
    }


    #region  获得应急预案信息
    public string GetResponsePlanList(int pageIndex, int pageSize)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            ResponsePlanManage rpm = new ResponsePlanManage(this.DBConnectionString);

            DBResultInfo dbResult = rpm.GetResponsePlan(string.Empty, string.Empty, string.Empty, SearchTactics.None, pageIndex, pageSize);

            DataSet ds = dbResult.dsResult;
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ResponsePlanInfo rpi = rpm.FillResponsePlanInfo(dr);

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append(String.Format("{{id:{0},name:'{1}',createTime:'{2}'}}",
                        rpi.Id, rpi.PlanName, rpi.CreateTime));
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


    #region  获得应急预案信息
    public string GetResponsePlan(string strProfessionIdList, string strDepartmentIdList, string strKeywords, int pageIndex, int pageSize)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            ResponsePlanManage rpm = new ResponsePlanManage(this.DBConnectionString);

            DBResultInfo dbResult = rpm.GetResponsePlan(strProfessionIdList, strDepartmentIdList, strKeywords, SearchTactics.And, pageIndex, pageSize);

            DataSet ds = dbResult.dsResult;
            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ResponsePlanInfo rpi = rpm.FillResponsePlanInfo(dr);

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append(String.Format("{{id:{0},name:'{1}',createTime:'{2}'}}",
                        rpi.Id, rpi.PlanName, rpi.CreateTime));
                }
            }
            else
            {
                if (!strKeywords.Equals(string.Empty))
                {
                    dbResult = rpm.GetResponsePlan(strProfessionIdList, strDepartmentIdList, strKeywords, SearchTactics.Or, pageIndex, pageSize);
                    ds = dbResult.dsResult;

                    if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                    {
                        int n = 0;
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            ResponsePlanInfo rpi = rpm.FillResponsePlanInfo(dr);

                            strResult.Append(n++ > 0 ? "," : "");
                            strResult.Append(String.Format("{{id:{0},name:'{1}',createTime:'{2}'}}",
                                rpi.Id, rpi.PlanName, rpi.CreateTime));
                        }
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


    #region  获得单个应急预案信息
    public string GetSingleResponsePlan(int id)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            ResponsePlanManage rpm = new ResponsePlanManage(this.DBConnectionString);

            DBResultInfo dbResult = rpm.GetSingleResponsePlan(id);

            DataSet ds = dbResult.dsResult;

            strResult.Append("{result:1");
            strResult.Append(",plan:{");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ResponsePlanInfo rpi = rpm.FillResponsePlanInfo(dr);

                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append(String.Format("id:{0},name:'{1}',content:'{2}',createTime:'{3}'",
                        rpi.Id, rpi.PlanName, Public.EscapeSingleQuotes(rpi.PlanContent), rpi.CreateTime));
                }
            }
            strResult.Append("}");
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

    #region  删除应急预案信息
    public string DeleteResponsePlan(string strPlanIdList)
    {
        try
        {
            if (strPlanIdList.Equals(string.Empty))
            {
                return "{result:0'}";
            }
            DBResultInfo dbResult = new ResponsePlanManage(this.DBConnectionString).DeleteResponsePlan(strPlanIdList);
            return String.Format("{{result:1,dataCount:{0}}}", dbResult.iResult);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

}