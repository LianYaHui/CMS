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
using Zyrh.DBUtility;

public partial class modules_safety_planEdit : System.Web.UI.Page
{

    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected int id = 0;
    protected string strAction = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.id = Public.RequestString("id", 0);
            this.strAction = Public.RequestString("action", "add");
            if (this.id > 0)
            {
                this.strAction = "edit";
            }
            this.txtPlanId.Value = this.id.ToString();
            this.txtAction.Value = this.strAction.ToString();

            this.GetResponsePlanInfo(this.id);
        }
    }

    protected void btnSubmit_ServerClick(object sender, EventArgs e)
    {
        int professionId = this.ddlProfessionType.Value.Equals(string.Empty) ? 0 : Convert.ToInt32(this.ddlProfessionType.Value.ToString());
        string strPlanName = this.txtPlanName.Value.Trim();
        string strPlanContent = this.txtPlanContent.Value.Trim().Replace("'", "\\\'");
        string strAction = this.txtAction.Value.Trim();

        if (strPlanName.Equals(string.Empty) || strPlanContent.Equals(string.Empty))
        {
            this.lblPrompt.Text = "请输入预案名称和预案内容";
            return;
        }

        this.lblPrompt.Text = "";
        int result = 0;

        if (strAction.Equals("add"))
        {
            result = this.AddResponsePlan(strPlanName, strPlanContent, professionId);
            if (result > 0)
            {
                this.lblPrompt.Text = "预案信息添加成功！";
            }
            else if (result == -2)
            {
                this.lblError.Text = "相同名称的预案信息已经存在，不能重复添加！";
            }
            else
            {
                this.lblError.Text = "预案信息添加失败，请稍候再试。";
            }
        }
        else
        {
            int id = Convert.ToInt32(this.txtPlanId.Value.Trim());
            result = this.UpdateResponsePlan(id, strPlanName, strPlanContent, professionId);
            if (result > 0)
            {
                this.lblPrompt.Text = "预案信息修改成功！";
            }
            else if (result == -2)
            {
                this.lblError.Text = "相同名称的预案信息已经存在，不能重复添加！";
            }
            else
            {
                this.lblError.Text = "预案信息修改失败，请稍候再试。";
            }
        }
    }

    #region  获得预案信息
    public void GetResponsePlanInfo(int id)
    {
        if (id > 0)
        {
            StringBuilder strSql = new StringBuilder();

            strSql.Append("select * from rp_response_plan rp where 1 = 1 ");
            strSql.Append(id > 0 ? String.Format(" and rp.id = '{0}' ", id) : string.Empty);

            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                this.txtPlanName.Value = dr["plan_name"].ToString();
                this.txtPlanContent.Value = dr["plan_content"].ToString();
                this.ddlProfessionType.Value = dr["profession_id"].ToString();
            }
        }
    }
    #endregion

    #region  新增预案信息
    public int AddResponsePlan(string strPlanName, string strPlanContent, int professionId)
    {
        try
        {
            if (this.CheckResponsePlanIsExist(strPlanName, professionId, 0))
            {
                return -2;
            }
            StringBuilder strSql = new StringBuilder();
            strSql.Append("insert into rp_response_plan(plan_name,plan_content,profession_id,create_time)");
            strSql.Append("values(");
            strSql.Append(String.Format("'{0}','{1}','{2}','{3}'", strPlanName, strPlanContent, professionId, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
            strSql.Append(");");

            return MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  编辑预案信息
    public int UpdateResponsePlan(int id, string strPlanName, string strPlanContent, int professionId)
    {
        try
        {
            if (this.CheckResponsePlanIsExist(strPlanName, professionId, id))
            {
                return -2;
            }
            StringBuilder strSql = new StringBuilder();
            strSql.Append("update rp_response_plan set ");
            strSql.Append(String.Format(" plan_name = '{0}',plan_content = '{1}',profession_id = '{2}' ", strPlanName, strPlanContent, professionId));
            strSql.Append(String.Format(" where id = '{0}'", id));
            strSql.Append(";");

            return MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    public bool CheckResponsePlanIsExist(string strPlanName, int professionId, int id)
    {
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(String.Format("select count(id) from rp_response_plan where plan_name = '{0}' ", strPlanName));
            strSql.Append(professionId > 0 ? String.Format(" and profession_id = '{0}' ", professionId) : string.Empty);
            strSql.Append(id > 0 ? String.Format(" and id <> '{0}' ", id) : string.Empty);

            return Convert.ToInt32(MySqlHelper.ExecuteScalar(this.DBConnectionString, strSql.ToString()).ToString()) > 0;
        }
        catch (Exception ex) { throw (ex); }
    }

}
