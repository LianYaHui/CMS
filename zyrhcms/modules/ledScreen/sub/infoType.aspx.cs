using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
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

public partial class modules_ledScreen_sub_infoType : System.Web.UI.Page
{

    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);

    protected int pageStart = 0;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected string strSearchField = string.Empty;
    protected string strKeywords = string.Empty;
    protected int enabled = -1;
    protected int typeId = 0;
    protected int parentId = 0;
    protected int level = -1;

    protected string strTitle = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.strTitle = Public.RequestString("title");

        if (!IsPostBack)
        {
            this.GetParentType();
            this.InitialData();
            this.GetInfoType();
        }
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        try
        {
            if (uc.CheckUserLogin())
            {
                ui = uc.GetLoginUserInfo();
                ui.UnitName = new ControlUnitManage(Public.CmsDBConnectionString).GetControlUnitName(ui.UnitId);
            }
            if (!uc.IsAdmin)
            {
                this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

    #region  初始化数据
    protected void InitialData()
    {
        this.parentId = Public.RequestString("parentId", 0);
        this.level = Public.RequestString("level", -1);
        this.enabled = Public.RequestString("enabled", -1);
        this.pageIndex = Public.RequestString("pageIndex", pageStart);
        this.pageSize = Public.RequestString("pageSize", 20);
        this.strSearchField = Public.RequestString("searchField");
        this.strKeywords = Public.RequestString("keywords");

        this.ddlParentId.SelectedValue = this.parentId.ToString();
        this.ddlLevel.SelectedValue = this.level.ToString();
        this.ddlEnabled.SelectedValue = this.enabled.ToString();
        this.ddlPageSize.SelectedValue = this.pageSize.ToString();
        this.ddlSearchField.SelectedValue = this.strSearchField;
        this.txtKeywords.Value = this.strKeywords;

    }
    #endregion


    #region  获得父级分类
    protected void GetParentType()
    {
        try
        {
            int maxLevel = tm.GetInfoTypeMaxLevel();
            for (int i = 0; i <= maxLevel; i++)
            {
                ListItem li = new ListItem(i.ToString(), i.ToString());
                this.ddlLevel.Items.Add(li);
            }
            this.ddlLevel.Items.Insert(0, new ListItem("选择分类级别", "-1"));

            DBResultInfo dbResult = tm.GetInfoTypeByLevel(1, -1, 0, maxLevel);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                new DropDownListTree().MakeTree(ds.Tables[0], "parent_id", "0", "type_id", "type_name", this.ddlParentId, -1, 1, true);

                this.ddlParentId.Items.Insert(0, new ListItem("选择父级分类", "-1"));
            }
            else
            {
                this.ddlParentId.Items.Clear();
                this.ddlParentId.Items.Add(new ListItem("选择父级分类", "-1"));
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  获得信息分类
    public void GetInfoType()
    {
        try
        {
            InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);

            this.pageSize = Convert.ToInt32(this.ddlPageSize.SelectedValue.ToString());
            this.parentId = DataConvert.ConvertValue(this.ddlParentId.SelectedValue.Trim(), 0);
            this.level = DataConvert.ConvertValue(this.ddlLevel.SelectedValue.Trim(), -1);
            this.enabled = DataConvert.ConvertValue(this.ddlEnabled.SelectedValue.Trim(), -1);
            this.strSearchField = this.ddlSearchField.SelectedValue.Trim();
            this.strKeywords = this.txtKeywords.Value.Trim();

            this.txtCurrentPageUrl.Value = this.BuildPageUrl(false);

            SearchField searchField = SearchField.None;
            switch (this.strSearchField)
            {
                case "Code":
                    searchField = SearchField.Code;
                    break;
                case "Name":
                    searchField = SearchField.Name;
                    break;
            }


            DBResultInfo dbResult = tm.GetInfoType(this.enabled,this.level, this.parentId, true, true, 
                searchField, this.strKeywords, SearchTactics.Or, this.pageIndex, this.pageSize);
            DataSet ds = dbResult.dsResult;

            List<InfoTypeInfo> lstInfo = new List<InfoTypeInfo>();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    InfoTypeInfo info = tm.FillInfoTypeInfo(dr);
                    if (info.ParentType.TypeName.Equals(string.Empty))
                    {
                        info.ParentType.TypeName = "-";
                    }
                    lstInfo.Add(info);
                }
            }

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                int dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());

                //分页标记
                PaginationParam param = new PaginationParam(dataCount, this.pageSize, this.pageIndex, this.pageStart, this.BuildPageUrl(true), this.BuildPageParam(true));
                param.HideUrl = true;
                param.MarkType = PaginationMarkType.Symbol;
                param.ShowDataCount = true;
                param.ShowPageCount = true;
                //param.ShowDataStat = true;

                this.divPagination.InnerHtml = new PaginationMark().BuildPaginationString(param);
            }

            this.rptList.DataSource = lstInfo;
            this.rptList.DataBind();
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion


    #region  创建当前页面URL
    protected string BuildPageUrl(bool isPage)
    {
        StringBuilder strUrl = new StringBuilder();
        strUrl.Append(String.Format("{0}", this.Request.Url.ToString().Split('?')[0]));
        if (!isPage)
        {
            strUrl.Append(String.Format("?title={0}&parentId={1}&enabled={2}&pageSize={3}&pageIndex={4}",
                this.strTitle, this.parentId, this.enabled, this.pageSize, this.pageIndex));
            strUrl.Append(String.Format("&searchField={0}&keywords={1}", this.strSearchField, this.strKeywords));
            strUrl.Append(String.Format("&level={0}", this.level));
        }
        return strUrl.ToString();
    }

    protected string BuildPageParam(bool isPage)
    {
        StringBuilder strParam = new StringBuilder();
        strParam.Append(String.Format("title={0}&parentId={1}&enabled={2}&pageSize={3}",
            this.strTitle, this.parentId, this.enabled, this.pageSize));
        strParam.Append(String.Format("&searchField={0}&keywords={1}", this.strSearchField, this.strKeywords));
        strParam.Append(String.Format("&level={0}", this.level));
        if (!isPage)
        {
            strParam.Append(String.Format("&pageIndex={0}", this.pageIndex));
        }
        return strParam.ToString();
    }
    #endregion

    #region  条件选择
    protected void ddlEnabled_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfoType();
    }
    protected void ddlParentId_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfoType();
    }
    protected void ddlLevel_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfoType();
    }
    #endregion

    #region  每页显示
    protected void ddlPageSize_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfoType();
    }
    #endregion

    #region  搜索信息分类
    protected void btnSearch_ServerClick(object sender, EventArgs e)
    {
        this.GetInfoType();
    }
    #endregion

}
