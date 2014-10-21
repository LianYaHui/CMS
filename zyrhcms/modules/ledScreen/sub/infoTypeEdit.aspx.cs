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
using Zyrh.BLL.Led;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Led;

public partial class modules_ledScreen_sub_infoTypeEdit : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strPageTitle = "";
    protected string strAction = "add";
    protected int parentId = 0;
    protected int typeId = 0;
    protected bool isEdit = false;
    protected bool isSetFocus = true;
    protected bool isTopLevel = true;
    protected string strUsedMemoryNumber = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strAction = Public.RequestString("action", "add");
        this.txtAction.Value = this.strAction;
        this.strPageTitle = this.strAction.Equals("edit") ? "编辑分类信息" : "新增分类信息";

        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        this.typeId = Public.RequestString("typeId", 0);
        this.txtTypeId.Value = this.typeId.ToString();
        this.parentId = Public.RequestString("parentId", 0);
        this.txtParentId.Value = this.parentId.ToString();

        this.isTopLevel = this.parentId <= 0;

        this.strAction = this.txtAction.Value.Trim();
        this.isEdit = this.strAction.Equals("edit") && this.typeId > 0;
        if (this.isEdit)
        {
            this.GetInfoType(this.typeId);
        }

        this.GetUsedMemoryNumber(this.typeId, this.parentId);
    }

    #region  获取被分配的存储区位
    protected void GetUsedMemoryNumber(int typeId, int parentId)
    {
        string strMemoryNumber = new InfoTypeConfigManage(Public.CmsDBConnectionString).GetMemoryNumber(typeId);
        string[] arr = strMemoryNumber.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        StringBuilder strResult = new StringBuilder();
        int n = 0;
        foreach (string str in arr)
        {
            strResult.Append(n++ > 0 ? "," : "");
            strResult.Append(str);
        }
        this.strUsedMemoryNumber = strResult.ToString();
    }
    #endregion


    #region  获得公告信息
    protected void GetInfoType(int typeId)
    {
        try
        {
            InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = tm.GetSingleInfoType(typeId);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                InfoTypeInfo info = tm.FillInfoTypeInfo(dr);

                this.parentId = info.ParentId;
                this.txtParentId.Value = this.parentId.ToString();

                this.isTopLevel = this.parentId <= 0;

                this.txtTypeId.Value = info.TypeId.ToString();
                this.txtTypeName.Value = info.TypeName;
                this.txtTypeCode.Value = info.TypeCode;
                this.ddlEnabled.Value = info.Enabled.ToString();
                this.txtSortOrder.Value = info.SortOrder.ToString();

                this.txtMemoryNumberList.Value = info.TypeConfig.MemoryNumber;
                this.txtValidityHour.Value = info.TypeConfig.ValidityHour.ToString();
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  编辑分类信息
    protected void UpdateInfoType()
    {
        try
        {
            InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);
            InfoTypeConfigManage tcm = new InfoTypeConfigManage(Public.CmsDBConnectionString);

            this.typeId = DataConvert.ConvertValue(this.txtTypeId.Value.Trim(), 0);
            this.parentId = DataConvert.ConvertValue(this.txtParentId.Value.Trim(), 0);
            this.strAction = this.txtAction.Value.Trim();
            this.isEdit = this.strAction.Equals("edit") && this.typeId > 0;
            string strTypeCode = this.txtTypeCode.Value.Trim();
            string strTypeName = this.txtTypeName.Value.Trim();
            int sortOrder = DataConvert.ConvertValue(this.txtSortOrder.Value.Trim(), 0);
            int enabled = DataConvert.ConvertValue(this.ddlEnabled.Value.Trim(), 0);

            string strMemoryNumberList = this.txtMemoryNumberList.Value.Trim();
            int validityHour = DataConvert.ConvertValue(this.txtValidityHour.Value.Trim(), 0);

            InfoTypeInfo info = new InfoTypeInfo();
            info.TypeId = this.typeId;
            info.ParentId = this.parentId;
            info.Level = tm.GetInfoTypeLevel(this.parentId) + 1;
            info.TypeName = Public.FilterString(strTypeName);
            info.TypeCode = Public.FilterString(strTypeCode);
            info.SortOrder = sortOrder;
            info.Enabled = enabled;

            InfoTypeConfigInfo config = new InfoTypeConfigInfo();
            config.TypeId = this.typeId;
            config.MemoryNumber = strMemoryNumberList;
            config.ValidityHour = validityHour;

            UserInfo ui = uc.GetLoginUserInfo();
            info.OperatorId = ui.UserId;

            if (this.isEdit)
            {
                tm.UpdateInfoType(info);

                //更新上级分类目录树
                tm.UpdateInfoTypeParentTree(typeId);
            }
            else
            {
                info.CreateTime = Public.GetDateTime();

                tm.AddInfoType(info);

                //获取最新添加的分类ID
                typeId = tm.GetMaxId();
                //更新上级分类目录树
                tm.UpdateInfoTypeParentTree(typeId);

                config.TypeId = typeId;
            }

            if (tcm.CheckTypeConfigIsExist(typeId) > 0)
            {
                tcm.UpdateInfoTypeConfig(config);
            }
            else
            {
                tcm.AddInfoTypeConfig(config);
            }

            //获取当前分类的顶级分类ID（若当前为顶级分类，则两者相同）
            int topTypeId = tm.GetTopLevelTypeId(tm.GetTypeParentTree(typeId));
            string strTopMemoryNumber = tcm.GetMemoryNumberWithType(topTypeId);
            tcm.UpdateMemoryNumber(topTypeId, strTopMemoryNumber);

            if (this.isEdit)
            {
                this.ShowPrompt("分类信息更新成功", this.Request.Url.ToString(), true);
            }
            else
            {
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
        this.UpdateInfoType();
    }
    #endregion

    #region  显示提示信息
    public void ShowPrompt(string strPrompt, string strUrl, bool isClose)
    {
        this.isSetFocus = false;

        string strClose = isClose ? "true" : "false";
        string strFunc = isClose ? "parent.closeEditType" : "null";
        this.lblPrompt.InnerHtml = String.Format("<script>var isSetFocus = false; page.showPromptWin('{0}','{1}',{2},{3});</script>",
            strPrompt, strUrl, strClose, strFunc);
    }
    #endregion


}
