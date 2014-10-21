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
using System.Data;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class modules_organize_devTypeEdit : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected DeviceTypeManage dtm = new DeviceTypeManage(Public.CmsDBConnectionString);

    protected string strPageTitle = "";
    protected string strAction = "add";

    protected int id = 0;
    protected bool isEdit = false;
    protected bool isSetFocus = true;

    protected string strUsedMemoryNumber = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {

        this.strAction = Public.RequestString("action", "add");
        this.txtAction.Value = this.strAction;
        this.strPageTitle = this.strAction.Equals("edit") ? "编辑设备分类" : "新增设备分类";

        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        this.id = Public.RequestString("id", 0);
        this.txtId.Value = this.id.ToString();

        this.strAction = this.txtAction.Value.Trim();
        this.isEdit = this.strAction.Equals("edit") && this.id > 0;
        if (this.isEdit)
        {
            this.GetDeviceType(this.id);
        }
    }

    #region  获得设备分类
    public void GetDeviceType(int id)
    {
        try
        {
            DBResultInfo dbResult = dtm.GetSingleDeviceType(id);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DeviceTypeInfo info = dtm.FillDeviceTypeInfo(ds.Tables[0].Rows[0]);

                this.txtTypeCode.Value = info.TypeCode;
                this.txtTypeName.Value = info.TypeName;
                this.txtTypeDesc.Value = info.TypeDesc;
                this.txtNetworkMode.Value = info.NetworkMode;
                this.txtSortOrder.Value = info.Sequence.ToString();
                this.ddlEnabled.Value = info.IsDisplay.ToString();
                this.txtPresetQuanlity.Value = info.PresetQuantity.ToString();
                this.ddlDecodeLibrary.Value = info.DecodeLibrary;
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  编辑设备分类
    public void UpdateDeviceType()
    {
        try
        {
            this.strAction = this.txtAction.Value.Trim();
            this.id = DataConvert.ConvertValue(this.txtId.Value.Trim(), 0);
            string strTypeCode = this.txtTypeCode.Value.Trim();
            string strTypeName = this.txtTypeName.Value.Trim();
            string strTypeDesc = this.txtTypeDesc.Value.Trim();
            string strNetworkMode = this.txtNetworkMode.Value.Trim();
            int presetQuanlity = DataConvert.ConvertValue(this.txtPresetQuanlity.Value.Trim(), 0);
            string strDecodeLibrary = this.ddlDecodeLibrary.Value.Trim();
            int sortOrder = DataConvert.ConvertValue(this.txtSortOrder.Value.Trim(), 0);
            int isDisplay = DataConvert.ConvertValue(this.ddlEnabled.Value.Trim(), 1);

            this.isEdit = this.strAction.Equals("edit") && this.id > 0;

            DeviceTypeInfo info = new DeviceTypeInfo();
            info.Id = this.id;
            info.TypeCode = strTypeCode;
            info.TypeName = strTypeName;
            info.TypeDesc = strTypeDesc;
            info.NetworkMode = strNetworkMode;
            info.PresetQuantity = presetQuanlity;
            info.Sequence = sortOrder;
            info.DecodeLibrary = strDecodeLibrary;
            info.IsDisplay = isDisplay;
            info.CreateTime = Public.GetDateTime();

            if (dtm.CheckDeviceTypeCodeIsExist(info.TypeCode, info.Id))
            {
                this.lblPrompt.InnerHtml = "已经存在相同编号的设备分类，不能重复";
                return;
            }
            else if (dtm.CheckDeviceTypeNameIsExist(info.TypeName, info.Id))
            {
                this.lblPrompt.InnerHtml = "已经存在相同名称的设备分类，不能重复";
                return;
            }

            if (this.isEdit)
            {
                dtm.UpdateDeviceTypeBaseInfo(info);

                this.ShowPrompt("分类信息更新成功", this.Request.Url.ToString(), true);
            }
            else
            {
                dtm.AddDeviceType(info);

                this.ShowPrompt("分类信息添加成功", this.Request.Url.ToString(), !this.chbContinue.Checked);
            }            
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  编辑
    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        try
        {
            ui = uc.GetLoginUserInfo();
            string strSuperAdminName = "admin";

            if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
            {
                this.UpdateDeviceType();
            }
            else
            {
                this.ShowPrompt("无操作权限，只有系统管理员才能编辑设备分类", this.Request.Url.ToString(), false);
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  显示提示信息
    public void ShowPrompt(string strPrompt, string strUrl, bool isClose)
    {
        this.isSetFocus = false;

        string strClose = isClose ? "true" : "false";
        string strFunc = isClose ? "parent.closeEditDeviceType" : "null";
        this.lblPrompt.InnerHtml = String.Format("<script>var isSetFocus = false; page.showPromptWin('{0}','{1}',{2},{3});</script>",
            strPrompt, strUrl, strClose, strFunc);
    }
    #endregion


}
