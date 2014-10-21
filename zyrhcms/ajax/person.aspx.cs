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

public partial class ajax_person : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected string strDeptIndexCode = string.Empty;
    protected string strDepartmentTypeList = string.Empty;
    protected string strSearchType = string.Empty;
    protected string strKeywords = string.Empty;
    protected int isLeader = -1;
    protected int pageIndex = 0;
    protected int pageSize = 0;

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
            case "getAddressList":
                this.strDepartmentTypeList = Public.RequestString("deptType");
                this.strSearchType = Public.RequestString("searchType");
                this.strKeywords = Public.RequestString("keywords");
                this.isLeader = Public.RequestString("isLeader", -1);
                Response.Write(this.GetAddressList(this.strDepartmentTypeList, this.strSearchType, this.strKeywords, this.isLeader, this.pageIndex, this.pageSize));
                break;
            case "getDepartmentPerson":
                Response.Write(this.GetDepartmentPerson(this.strDeptIndexCode));
                break;
            default:
                Response.Write("ok");
                break;
        }
    }
    #endregion


    #region  获得通讯录列表
    public string GetAddressList(string strDepartmentTypeList, string strSearchType, string strKeywords, int isLeader, int pageIndex, int pageSize)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strCon = new StringBuilder();
            if (!strDepartmentTypeList.Equals(string.Empty))
            {
                strCon.Append(String.Format(" and d.dept_type in({0}) ", strDepartmentTypeList));
            }
            if (!strKeywords.Equals(string.Empty))
            {
                switch (strSearchType)
                {
                    case "jobNumber":
                        strCon.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and p.job_number like '%{0}%' ", SearchTactics.Or));
                        //strCon.Append(String.Format(" and p.job_number like '%{0}%' ", strKeywords));
                        break;
                    case "realName":
                        //strCon.Append(String.Format(" and p.real_name like '%{0}%' ", strKeywords));
                        strCon.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and p.real_name like '%{0}%' ", SearchTactics.Or));
                        break;
                    case "telephone":
                        //strCon.Append(String.Format(" and p.telephone like '%{0}%' ", strKeywords));
                        strCon.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and p.telephone like '%{0}%' ", SearchTactics.Or));
                        break;
                    case "mobile":
                        //strCon.Append(String.Format(" and p.mobile like '%{0}%' ", strKeywords));
                        strCon.Append(DBSearchCondition.SplitBuildSearchCondition(strKeywords, " and p.mobile like '%{0}%' ", SearchTactics.Or));
                        break;
                }
            }
            strCon.Append(isLeader >= 0 ? String.Format(" and jn.is_leader = {0} ", isLeader) : string.Empty);

            StringBuilder strSql = new StringBuilder();
            strSql.Append("select pd.name as parent_dept_name,d.name as dept_name,d.parent_tree,");
            strSql.Append(" GROUP_CONCAT(jn.name order by pj.part_time,pj.id) as job_name,");
            strSql.Append(" GROUP_CONCAT(pj.job_id order by pj.part_time,pj.id) as job_id,");
            strSql.Append(" pe.name as education,pp.name as political,");
            strSql.Append(" p.* ");
            strSql.Append(" from rp_personnel p ");
            strSql.Append(" left outer join rp_department d on p.dept_indexcode = d.index_code ");
            strSql.Append(" left outer join rp_department pd on d.parent_id = pd.id ");
            strSql.Append(" left outer join rp_person_education pe on p.education_id = pe.id ");
            strSql.Append(" left outer join rp_person_political pp on p.political_id = pp.id ");
            strSql.Append(" left outer join rp_personnel_jobname pj on p.id = pj.person_id ");
            strSql.Append(" left outer join rp_job_name jn on pj.job_id = jn.id ");
            strSql.Append(" where 1 = 1 ");
            strSql.Append(strCon.ToString());
            strSql.Append(" group by p.id ");
            strSql.Append(" order by p.id");
            if (pageIndex >= 0 && pageSize > 0)
            {
                strSql.Append(String.Format(" limit {0},{1}", pageIndex * pageSize, pageSize));
            }
            strSql.Append(";");

            strSql.Append("select p.id from rp_personnel p ");
            strSql.Append(" left outer join rp_department d on p.dept_indexcode = d.index_code ");
            strSql.Append(" left outer join rp_department pd on d.parent_id = pd.id ");
            strSql.Append(" left outer join rp_personnel_jobname pj on p.id = pj.person_id ");
            strSql.Append(" left outer join rp_job_name jn on pj.job_id = jn.id ");
            strSql.Append(" where 1 = 1 ");
            strSql.Append(strCon.ToString());
            strSql.Append(" group by p.id ");
            strSql.Append(";");


            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
            int dataCount = 0;

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                //dataCount = Convert.ToInt32(ds.Tables[1].Rows[0]["dataCount"].ToString());
                dataCount = ds.Tables[1].Rows.Count;
            }

            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("deptIndexCode:'{0}',deptName:'{1}',parentTree:'{2}'",
                        dr["dept_indexcode"], dr["dept_name"], dr["parent_tree"]));
                    strResult.Append(String.Format(",id:{0},jobNumber:'{1}',wageNumber:'{2}',realName:'{3}',sex:'{4}',telephone:'{5}',mobile:'{6}'",
                        dr["id"], dr["job_number"], dr["wage_number"], dr["real_name"], dr["sex"], dr["telephone"], dr["mobile"]));
                    strResult.Append(String.Format(",jobName:'{0}',jobId:'{1}'",
                        dr["job_name"], dr["job_id"]));
                    strResult.Append(String.Format(",birthday:'{0}',entryTime:'{1}',education:'{2}',political:'{3}'",
                        dr["birthday"], dr["entry_time"], dr["education"], dr["political"]));
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


    #region  获得部门人员树菜单
    protected string GetDepartmentPerson(string strDeptIndexCode)
    {
        try
        {
            StringBuilder strTree = new StringBuilder();

            strTree.Append("{");
            strTree.Append(String.Format("deptIndexCode:'{0}'", strDeptIndexCode));
            strTree.Append(String.Format(",department:[{0}]", this.GetDepartment()));
            strTree.Append(String.Format(",person:[{0}]", this.GetPerson(this.strSearchType, this.strKeywords)));
            strTree.Append("}");

            return strTree.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,department:[],person:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得部门信息
    protected string GetDepartment()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strSql = new StringBuilder();

            strSql.Append("select d.* from rp_department d ");
            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},code:'{1}',name:'{2}',pid:{3},level:{4}",
                        dr["id"], dr["index_code"], dr["name"], dr["parent_id"], dr["level"]));
                    strResult.Append("}");
                }
            }

            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  获得人员信息
    protected string GetPerson(string strSearchType, string strKeywords)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strCon = new StringBuilder();
            if (!strKeywords.Equals(string.Empty))
            {
                switch (strSearchType)
                {
                    case "jobNumber":
                        strCon.Append(String.Format(" and p.job_number like '%{0}%' ", strKeywords));
                        break;
                    case "realName":
                        strCon.Append(String.Format(" and p.real_name like '%{0}%' ", strKeywords));
                        break;
                    case "telephone":
                        strCon.Append(String.Format(" and p.telephone like '%{0}%' ", strKeywords));
                        break;
                    case "mobile":
                        strCon.Append(String.Format(" and p.mobile like '%{0}%' ", strKeywords));
                        break;
                }
            }

            StringBuilder strSql = new StringBuilder();
            strSql.Append("select pd.name as parent_dept_name,d.id as dept_id,d.name as dept_name,d.parent_tree,");
            strSql.Append(" GROUP_CONCAT(jn.name order by pj.part_time,pj.id) as job_name,");
            strSql.Append(" GROUP_CONCAT(pj.job_id order by pj.part_time,pj.id) as job_id,");
            strSql.Append(" pe.name as education,pp.name as political,");
            strSql.Append(" p.* ");
            strSql.Append(" from rp_personnel p ");
            strSql.Append(" left outer join rp_department d on p.dept_indexcode = d.index_code ");
            strSql.Append(" left outer join rp_department pd on d.parent_id = pd.id ");
            strSql.Append(" left outer join rp_person_education pe on p.education_id = pe.id ");
            strSql.Append(" left outer join rp_person_political pp on p.political_id = pp.id ");
            strSql.Append(" left outer join rp_personnel_jobname pj on p.id = pj.person_id ");
            strSql.Append(" left outer join rp_job_name jn on pj.job_id = jn.id ");
            strSql.Append(" where 1 = 1 ");
            strSql.Append(strCon.ToString());
            strSql.Append(" group by p.id ");
            strSql.Append(" order by p.id");
            strSql.Append(";");
            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},code:'{1}',name:'{2}',pid:{3},pname:'{4}'",
                        dr["id"], dr["job_number"], dr["real_name"], dr["dept_id"], dr["dept_name"]));
                    strResult.Append(String.Format(",jobName:'{0}'",
                        dr["job_name"]));
                    strResult.Append("}");
                }
            }

            return strResult.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

}
