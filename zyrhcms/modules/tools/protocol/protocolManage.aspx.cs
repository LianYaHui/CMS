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

public partial class modules_tools_protocol_protocolManage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.ShowDeviceType();
            this.ShowDeviceFunction();
        }
    }

    #region  获得设备类型
    public DataSet GetDeviceType()
    {
        try
        {
            string strSql = "select * from device_type;";

            return MySqlHelper.ExecuteDataSet(Public.CmsDBConnectionString, strSql);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  显示设备类型
    protected void ShowDeviceType()
    {
        try
        {
            DataSet ds = this.GetDeviceType();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                ListItem li = new ListItem();
                this.ddlDeviceType.Items.Clear();
                this.ddlDeviceTypeCode.Items.Clear();
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    li = new ListItem(dr["type_code"].ToString() + "_" + dr["type_name"].ToString(), dr["type_code"].ToString());
                    this.ddlDeviceType.Items.Add(li);

                    this.ddlDeviceTypeCode.Items.Add(li);
                }
                li = new ListItem("请选择", "");
                this.ddlDeviceType.Items.Insert(0, li);
                this.ddlDeviceTypeCode.Items.Insert(0, li);
            }
            else
            {
                this.ddlDeviceType.Items.Clear();
                this.ddlDeviceTypeCode.Items.Clear();
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = ex.Message;
        }
    }
    #endregion

    #region  获得功能配置
    public DataSet GetDeviceFunction(string strTypeCode, int id)
    {
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(" select * from device_function where 1=1 ");
            if (!strTypeCode.Equals(string.Empty))
            {
                strSql.Append(String.Format(" and device_type_code = '{0}' ", strTypeCode));
            }

            if (id > 0)
            {
                strSql.Append(String.Format(" and id = '{0}' ", id));
            }
            strSql.Append(" order by device_type_code,function_code ");
            return MySqlHelper.ExecuteDataSet(Public.CmsDBConnectionString, strSql.ToString());
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  显示功能配置
    protected void ShowDeviceFunction()
    {
        try
        {
            string strTypeCode = this.ddlDeviceTypeCode.SelectedValue.ToString();
            DataSet ds = this.GetDeviceFunction(strTypeCode, 0);
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                this.gvFunction.DataSource = ds.Tables[0];
                this.gvFunction.DataBind();
            }
            else
            {
                this.gvFunction.DataSource = null;
                this.gvFunction.DataBind();
            }
            this.lblPrompt.Text = "";
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = ex.Message;
        }
    }
    #endregion

    #region  添加、更新功能配置
    protected void btnUpdate_Click(object sender, EventArgs e)
    {
        try
        {
            this.txtSql.Text = "";
            StringBuilder strSql = new StringBuilder();

            string strDevTypeCode = this.ddlDeviceType.SelectedValue.ToString();
            string strFunctionCode = this.txtFunctionCode.Text.Trim();
            string strFunctionName = this.txtFunctionName.Text.Trim();
            string strProtocol = this.txtProtocol.Text.Trim();
            string strProtocolDemo = this.txtProtocolDemo.Text.Trim();
            string strParamQuantity = this.txtParameterQuantity.Text.Trim();
            string strParamDesc = this.txtParameterDesc.Text.Trim();
            string strResponseCode = this.txtResponseCode.Text.Trim();
            int timeout = Convert.ToInt32(this.txtTimeout.Text.Trim());
            int isEnabled = Convert.ToInt32(this.ddlEnabled.SelectedValue);

            int id = Convert.ToInt32(this.txtId.Text.Trim());

            if (id == 0)
            {
                if (this.CheckFunctionIsExist(strDevTypeCode, strFunctionCode) == 0)
                {
                    strSql.Append("insert into device_function(function_code,device_type_code,function_name,protocol,parameter_quantity,parameter_desc,protocol_demo,response_code,timeout,is_enabled,create_time)");
                    strSql.Append("values(");
                    strSql.Append(String.Format("'{0}','{1}','{2}','{3}','{4}',", strFunctionCode, strDevTypeCode, strFunctionName, strProtocol, strParamQuantity));
                    strSql.Append(String.Format("'{0}','{1}','{2}','{3}','{4}','{5}'", strParamDesc, strProtocolDemo, strResponseCode, timeout, isEnabled, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                    strSql.Append(");");
                    this.txtSql.Text = strSql.ToString();
                    if (MySqlHelper.ExecuteNonQuery(Public.CmsDBConnectionString, strSql.ToString()) > 0)
                    {
                        if (!this.chbContinue.Checked)
                        {
                            this.Response.Redirect("protocolManage.aspx", false);
                        }
                    }
                    else
                    {
                        this.lblPrompt.Text = "功能配置添加失败";
                    }
                    this.ShowDeviceFunction();
                }
                else
                {
                    this.lblPrompt.Text = "功能配置已存在";
                }
            }
            else
            {
                strSql.Append("update device_function set ");
                strSql.Append(String.Format(" function_code = '{0}', function_name = '{1}', device_type_code = '{2}',", strFunctionCode, strFunctionName, strDevTypeCode));
                strSql.Append(String.Format(" protocol = '{0}', parameter_quantity = '{1}', parameter_desc = '{2}',", strProtocol, strParamQuantity, strParamDesc));
                strSql.Append(String.Format(" protocol_demo = '{0}', response_code = '{1}', timeout = '{2}', is_enabled = '{3}' ", strProtocolDemo, strResponseCode, timeout, isEnabled));
               
                strSql.Append(String.Format(" where id = '{0}';", id));
                if (MySqlHelper.ExecuteNonQuery(Public.CmsDBConnectionString, strSql.ToString()) > 0)
                {
                    this.Response.Redirect("protocolManage.aspx", false);
                }
                else
                {
                    this.lblPrompt.Text = "功能配置修改失败";
                }
                this.ShowDeviceFunction();
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = ex.Message;
        }
    }
    #endregion


    protected void btnLoad_Click(object sender, EventArgs e)
    {
        this.ShowDeviceFunction();
    }

    #region  检测功能配置是否存在
    protected int CheckFunctionIsExist(string devTypeCode, string functionCode)
    {
        try
        {
            string strSql = String.Format(" select count(id) as dc from device_function where device_type_code = '{0}' and function_code = '{1}'; ", devTypeCode, functionCode);

            return Convert.ToInt32(MySqlHelper.ExecuteScalar(Public.CmsDBConnectionString, strSql).ToString());
        }
        catch (Exception ex)
        {
            return 1;
        }
    }
    #endregion

    protected void gvFunction_SelectedIndexChanging(object sender, GridViewSelectEventArgs e)
    {
        try
        {
            int id = Convert.ToInt32(this.gvFunction.DataKeys[e.NewSelectedIndex]["id"].ToString());

            this.txtId.Text = id.ToString();

            DataSet ds = this.GetDeviceFunction("", id);
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                this.txtFunctionCode.Text = dr["function_code"].ToString();
                this.txtFunctionName.Text = dr["function_name"].ToString();
                this.ddlDeviceType.SelectedValue = dr["device_type_code"].ToString();
                this.txtProtocol.Text = dr["protocol"].ToString();
                this.txtParameterQuantity.Text = dr["parameter_quantity"].ToString();
                this.txtParameterDesc.Text = dr["parameter_desc"].ToString();
                this.txtProtocolDemo.Text = dr["protocol_demo"].ToString();
                this.txtResponseCode.Text = dr["response_code"].ToString();
                this.txtTimeout.Text = dr["timeout"].ToString();
                this.ddlEnabled.SelectedValue = dr["is_enabled"].ToString();
            }
            else
            {
                //this.txtFunctionCode.Text = dr["function_code"].ToString();
                //this.txtFunctionName.Text = dr["function_name"].ToString();
                //this.ddlDeviceType.SelectedValue = dr["device_type_code"].ToString();
                //this.txtProtocol.Text = dr["protocol"].ToString();
                //this.txtParameterQuantity.Text = dr["parameter_quantity"].ToString();
                //this.txtParameterDesc.Text = dr["parameter_desc"].ToString();
                //this.txtProtocolDemo.Text = dr["protocol_demo"].ToString();
                //this.txtResponseCode.Text = dr["response_code"].ToString();
                //this.txtTimeout.Text = dr["timeout"].ToString();
                //this.txtIsEnabled.Text = dr["is_enabled"].ToString();
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = ex.Message;
        }
    }
    protected void btnCancel_Click(object sender, EventArgs e)
    {
        this.txtId.Text = "0";
    }
}
