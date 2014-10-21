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

public partial class tools_info : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        try
        {
            this.GetDepartment();
            this.GetSubstation();
        }
        catch (Exception ex)
        {

        }
    }


    #region  获得部门信息
    public void GetDepartment()
    {
        try
        {
            this.ddlDepartment.Items.Clear();

            DepartmentManage dm = new DepartmentManage(this.DBConnectionString);
            DBResultInfo dbResult = dm.GetDepartmentInfo(-1, string.Empty);

            DataSet ds = dbResult.dsResult;
            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataView dv = new DataView(ds.Tables[0], "", "name", DataViewRowState.CurrentRows);
                foreach (DataRowView dr in dv)
                {
                    DepartmentInfo di = dm.FillDepartmentInfo(dr);
                    li = new ListItem(di.PinYinCode + " " + di.Name + "(" + di.IndexCode + ")" + (di.Introduce.Equals(string.Empty) ? "_无简介" : ""), di.Id.ToString());
                    this.ddlDepartment.Items.Add(li);
                }
            }
            li = new ListItem("选择部门", "0");
            this.ddlDepartment.Items.Insert(0, li);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得所亭信息
    public void GetSubstation()
    {
        try
        {
            this.ddlSubstation.Items.Clear();

            RailwaySubstationManage sm = new RailwaySubstationManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetSubstationInfo(string.Empty, string.Empty, 0);

            DataSet ds = dbResult.dsResult;
            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataView dv = new DataView(ds.Tables[0], "", "name", DataViewRowState.CurrentRows);
                foreach (DataRowView dr in dv)
                {
                    RailwaySubstationInfo si = sm.FillSubstationInfo(dr);
                    li = new ListItem(si.PinYinCode + " " + si.Name + "(" + si.IndexCode + ")" + (si.Introduce.Equals(string.Empty) ? "_无简介" : ""), si.Id.ToString());
                    this.ddlSubstation.Items.Add(li);
                }
            }
            li = new ListItem("选择所亭", "0");
            this.ddlSubstation.Items.Insert(0, li);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    
    #region  获得单个部门信息
    public void GetDepartment(int id)
    {
        try
        {
            DepartmentManage dm = new DepartmentManage(this.DBConnectionString);
            DBResultInfo dbResult = dm.GetSingleDepartmentInfo(id);

            DataSet ds = dbResult.dsResult;
            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                DepartmentInfo di = dm.FillDepartmentInfo(dr);

                this.txtDepartmentIntroduce.Value = di.Introduce;
                this.txtDepartmentLatitude.Text = di.Latitude;
                this.txtDepartmentLongitude.Text = di.Longitude;
            }
            else
            {
                this.txtDepartmentIntroduce.Value = string.Empty;
                this.txtDepartmentLatitude.Text = string.Empty;
                this.txtDepartmentLongitude.Text = string.Empty;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得单个所亭信息
    public void GetSubstation(int id)
    {
        try
        {
            RailwaySubstationManage sm = new RailwaySubstationManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetSingleSubstationInfo(id);

            DataSet ds = dbResult.dsResult;
            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                RailwaySubstationInfo si = sm.FillSubstationInfo(dr);

                this.txtSubstationIntroduce.Value = si.Introduce;
                this.txtSubstationLatitude.Text = si.Latitude;
                this.txtSubstationLongitude.Text = si.Longitude;
            }
            else
            {
                this.txtSubstationIntroduce.Value = string.Empty;
                this.txtSubstationLatitude.Text = string.Empty;
                this.txtSubstationLongitude.Text = string.Empty;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    protected void ddlDepartment_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            int id = Convert.ToInt32(this.ddlDepartment.SelectedValue.ToString());
            this.GetDepartment(id);
        }
        catch (Exception ex) { Response.Write(ex.Message); }
    }

    protected void ddlSubstation_SelectedIndexChanged(object sender, EventArgs e)
    {

        try
        {
            int id = Convert.ToInt32(this.ddlSubstation.SelectedValue.ToString());
            this.GetSubstation(id);
        }
        catch (Exception ex) { Response.Write(ex.Message); }
    }

    #region  修改部门信息
    protected void btnUpdateDpartment_Click(object sender, EventArgs e)
    {
        string strLatitude = this.txtDepartmentLatitude.Text.Trim();
        string strLongitude = this.txtDepartmentLongitude.Text.Trim();
        string strIntroduce = this.txtDepartmentIntroduce.Value.Trim();
        int id = Convert.ToInt32(this.ddlDepartment.SelectedValue.ToString());
        string strName = this.ddlDepartment.SelectedItem.Text.Split('_')[0];

        if (strLatitude.Equals(string.Empty) && strLongitude.Equals(string.Empty) && strIntroduce.Equals(string.Empty))
        {
            return;
        }
        else
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(String.Format("update rp_department set latitude='{0}',longitude='{1}',introduce='{2}' where id = {3};",
                strLatitude, strLongitude, strIntroduce, id));
            int result = MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());
            if (result > 0)
            {
                this.lblDepartment.Text = strName + "修改成功";
                this.GetDepartment();
                this.ddlDepartment.SelectedValue = id.ToString();
            }
            else
            {
                this.lblDepartment.Text = strName + "修改失败";
            }
        }
    }
    #endregion

    #region  修改所亭信息
    protected void btnUpdateSubstation_Click(object sender, EventArgs e)
    {
        string strLatitude = this.txtSubstationLatitude.Text.Trim();
        string strLongitude = this.txtSubstationLongitude.Text.Trim();
        string strIntroduce = this.txtSubstationIntroduce.Value.Trim();
        int id = Convert.ToInt32(this.ddlSubstation.SelectedValue.ToString());
        string strName = this.ddlSubstation.SelectedItem.Text.Split('_')[0];

        if (strLatitude.Equals(string.Empty) && strLongitude.Equals(string.Empty) && strIntroduce.Equals(string.Empty))
        {
            return;
        }
        else
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append(String.Format("update rp_substation set latitude='{0}',longitude='{1}',introduce='{2}' where id = {3};",
                strLatitude, strLongitude, strIntroduce, id));
            int result = MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());
            if (result > 0)
            {
                this.lblSubstation.Text = strName + "修改成功";
                this.GetSubstation();
                this.ddlSubstation.SelectedValue = id.ToString();
            }
            else
            {
                this.lblSubstation.Text = strName + "修改失败";
            }
        }
    }
    #endregion

}
