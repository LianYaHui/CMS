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
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;
using Zyrh.Model.Device;
using Zyrh.DBUtility;
using Zyrh.DAL;

public partial class modules_safety_editPerson : System.Web.UI.Page
{

    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected int id = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.id = Public.RequestString("id", 0);
            this.txtId.Value = this.id.ToString();
            this.GetPersonInfo(this.id);
        }
    }

    #region  获得人员信息
    private void GetPersonInfo(int id)
    {
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select p.*,d.name as dept_name from rp_personnel p left outer join rp_department d on p.dept_indexcode=d.index_code where p.id = " + id);

            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                this.txtDeptName.Text = dr["dept_name"].ToString();
                this.txtJobNumber.Text = dr["job_number"].ToString();
                this.txtRealName.Text = dr["real_name"].ToString();
                this.txtTelephone.Text = dr["telephone"].ToString();
                this.txtMobile.Text = dr["mobile"].ToString();
                this.txtIntroduce.Text = dr["introduce"].ToString();

                DataSet dsJob = this.GetJobName();
                this.FillJobName(dsJob, this.ddlJob);
                this.FillJobName(dsJob, this.ddlJobPart);
                this.FillJobName(dsJob, this.ddlJobPart1);

                this.ShowJobName(Convert.ToInt32(this.txtId.Value.Trim()));
            }
            else
            {
                this.txtDeptName.Text = string.Empty;
                this.txtJobNumber.Text = string.Empty;
                this.txtRealName.Text = string.Empty;
                this.txtTelephone.Text = string.Empty;
                this.txtMobile.Text = string.Empty;
                this.txtIntroduce.Text = string.Empty;
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = "出错了：" + ex.Message;
        }
    }
    #endregion

    #region  填充职名
    private DataSet GetJobName()
    {
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * from rp_job_name order by code;");
            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());

            return ds;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }

    private void FillJobName(DataSet ds, System.Web.UI.WebControls.DropDownList ddl)
    {
        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                ListItem li = new ListItem(dr["code"].ToString() + " " + dr["name"].ToString(), dr["id"].ToString());
                ddl.Items.Add(li);
            }
        }

        ListItem li1 = new ListItem("选择职名", "0");
        ddl.Items.Insert(0, li1);
    }
    #endregion

    #region  显示职名
    protected void ShowJobName(int personId)
    {
        string strSql = String.Format("select * from rp_personnel_jobname where person_id = {0} order by part_time,id;", personId);

        DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql.ToString());
        int n = 0;
        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                if (0 == n)
                {
                    this.ddlJob.SelectedValue = dr["job_id"].ToString();
                }
                else if (1 == n)
                {
                    this.ddlJobPart.SelectedValue = dr["job_id"].ToString();
                }
                else if (2 == n)
                {
                    this.ddlJobPart1.SelectedValue = dr["job_id"].ToString();
                }
                n++;
            }
        }
    }
    #endregion

    #region  更新职名
    protected void UpdateJobName(int personId, ArrayList arrJobId)
    {
        try
        {
            string strSql = String.Format("select count(id) from rp_personnel_jobname where person_id = {0};", personId);
            int count = Convert.ToInt32(MySqlHelper.ExecuteScalar(this.DBConnectionString, strSql).ToString());
            int result = 0;

            if (count > 1 || arrJobId.Count > 1 || (count > 0 && arrJobId.Count == 0))
            {
                strSql = String.Format("delete from rp_personnel_jobname where person_id = {0};", personId);
                MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql);
                int n = 0;
                foreach (int id in arrJobId)
                {
                    if (0 == n)
                    {
                        strSql = String.Format("insert into rp_personnel_jobname(person_id, job_id)values({0},{1});", personId, id);
                    }
                    else
                    {
                        strSql = String.Format("insert into rp_personnel_jobname(person_id, job_id,part_time)values({0},{1},{2});", personId, id, 1);
                    }
                    result = Convert.ToInt32(MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql).ToString());
                    n++;
                }
            }
            else
            {
                if (count > 0)
                {
                    foreach (int id in arrJobId)
                    {
                        strSql = String.Format("update rp_personnel_jobname set job_id = {0} where person_id = {1};", id, personId);
                        result = Convert.ToInt32(MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql).ToString());
                    }
                }
                else
                {
                    foreach (int id in arrJobId)
                    {
                        strSql = String.Format("insert into rp_personnel_jobname(person_id, job_id)values({0},{1});", personId, id);
                        result = Convert.ToInt32(MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql).ToString());
                    }
                }
            }
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  编辑人员信息
    protected void btnSave_Click(object sender, EventArgs e)
    {
        this.EditPerson();   
    }
    #endregion

    #region  编辑人员
    protected void EditPerson()
    {
        try
        {
            int id = Convert.ToInt32(this.txtId.Value.Trim());
            string strJobNumber = this.txtJobNumber.Text.Trim();
            string strRealName = this.txtRealName.Text.Trim();
            string strTelephone = this.txtTelephone.Text.Trim();
            string strMobile = this.txtMobile.Text.Trim();
            string strIntroduce = this.txtIntroduce.Text.Trim();

            int jobId = Convert.ToInt32(this.ddlJob.SelectedValue.ToString());
            int jobPartId = Convert.ToInt32(this.ddlJobPart.SelectedValue.ToString());
            int jobPartId1 = Convert.ToInt32(this.ddlJobPart1.SelectedValue.ToString());

            if (jobId == 0 && (jobPartId > 0 || jobPartId1 > 0))
            {
                this.lblPrompt.Text = "必须先选择职名才能选择兼职";
                return;
            }
            ArrayList arrJob = new ArrayList();
            if (jobId > 0)
            {
                arrJob.Add(jobId);
            }
            if (jobPartId > 0)
            {
                arrJob.Add(jobPartId);
            }
            if (jobPartId1 > 0)
            {
                arrJob.Add(jobPartId1);
            }

            this.UpdateJobName(id, arrJob);

            StringBuilder strSql = new StringBuilder();
            strSql.Append(String.Format("update rp_personnel set telephone = '{0}',mobile='{1}',introduce='{2}' where id = {3};",
                strTelephone, strMobile, strIntroduce, id));

            int result = MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());

            if (result > 0)
            {
                this.lblPrompt.Text = strRealName + "信息修改成功";
            }
            else
            {
                this.lblPrompt.Text = strRealName + "信息修改失败";
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = "出错了：" + ex.Message;
        }
    }
    #endregion

}
