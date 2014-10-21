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
using Zyrh.Model;
using Zyrh.DBUtility;

public partial class ajax_responsePlan : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int typeId = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        this.strAction = Public.GetRequest("action", string.Empty);

        switch (this.strAction)
        {
            case "getPlanType":
                Response.Write(this.GetPlanType());
                break;
            case "getPlanLevel":
                Response.Write(this.GetPlanLevel());
                break;
            case "getPlanModule":
                break;
            case "getPlanTypeModule":
                this.typeId = Public.GetRequest("typeId", 0);
                Response.Write(this.GetResponsePlanTypeModule(this.typeId));
                break;
            case "getResponsePlanList":
                Response.Write(this.GetResponsePlanList());
                break;
            default:
                Response.Write("ok");
                break;
        }
    }


    #region  获得应急预案信息
    public string GetResponsePlanList()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strSql = new StringBuilder();

            strSql.Append("select * from rp_response_plan rp ");

            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());

            strResult.Append("{result:1");
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append(String.Format("{{id:{0},name:'{1}',createTime:'{2}'}}", dr["id"], dr["plan_name"], dr["create_time"]));
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

    #region  获得应急预案类型
    public string GetPlanType()
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * from response_plan_type");

            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}',pid:'{2}',level:'{3}'", dr["type_id"], dr["type_name"], dr["parent_id"], dr["type_level"]));
                    strResult.Append("}");
                }
            }
            strResult.Append("]}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得应急预案严重等级
    public string GetPlanLevel()
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * from response_plan_level");
            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    //strResult.Append(String.Format("id:'{0}',name:'{1}',desc:'{2}',color:'{3}'", dr["level_id"], dr["level_name"], dr["level_desc"], dr["show_color"]));
                    strResult.Append(String.Format("id:'{0}',name:'{1}',desc:'{2}',background:'{3}'", dr["level_id"], dr["level_name"].ToString() + " " + dr["level_desc"].ToString(), dr["level_desc"], dr["show_color"]));
                    strResult.Append("}");
                }
            }
            strResult.Append("]}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得应急预案类型模块映射
    public string GetResponsePlanTypeModule(int typeId)
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(" select p.*,m.module_name,m.module_url ");
            strSql.Append(" from response_plan_module_map p ");
            strSql.Append(" left outer join response_plan_module m on p.module_id = m.module_id ");
            strSql.Append(" left outer join response_plan_type t on p.type_id = t.type_id ");
            strSql.Append(String.Format(" where p.type_id = {0}", typeId));
            strSql.Append(" order by p.sort_order ");
            strSql.Append(";");

            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
            strResult.Append("{result:1,list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:'{0}',name:'{1}',url:'{2}',sortOrder:'{3}',display:'{4}'",
                        dr["module_id"], dr["module_name"].ToString(), dr["module_url"], dr["sort_order"], dr["display"]));
                    strResult.Append("}");
                }
            }
            strResult.Append("]}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

}
