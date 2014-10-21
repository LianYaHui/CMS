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

public partial class modules_ledScreen_sub_infoLog : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected int isLog = 0;
    protected int pageStart = 0;
    protected int pageIndex = 0;
    protected int pageSize = 10;
    protected string strSearchField = string.Empty;
    protected string strKeywords = string.Empty;
    protected int typeId = 0;
    protected int parentId = 0;
    protected int infoStatus = -1;
    protected int sendStatus = -1;
    protected int isTiming = -1;

    protected string strTitle = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strTitle = Public.RequestString("title");
        this.isLog = Public.RequestString("isLog", 0);

        if (!IsPostBack)
        {
            this.GetInfoType();
            this.InitialData();
            this.GetInfo();
        }
    }
    
    #region  初始化数据
    protected void InitialData()
    {
        this.typeId = Public.RequestString("typeId", 0);
        this.infoStatus = Public.RequestString("infoStatus", -1);
        this.sendStatus = Public.RequestString("sendStatus", -1);
        this.isTiming = Public.RequestString("isTiming", -1);
        this.pageIndex = Public.RequestString("pageIndex", pageStart);
        this.pageSize = Public.RequestString("pageSize", 10);
        this.strSearchField = Public.RequestString("searchField");
        this.strKeywords = Public.RequestString("keywords");

        this.ddlInfoStatus.Visible = this.isLog == 1;
        this.ddlType.SelectedValue = this.typeId.ToString();
        this.ddlInfoStatus.SelectedValue = this.infoStatus.ToString();
        this.ddlSendStatus.SelectedValue = this.sendStatus.ToString();
        this.ddlTiming.SelectedValue = this.isTiming.ToString();

        this.ddlPageSize.SelectedValue = this.pageSize.ToString();
        this.ddlSearchField.SelectedValue = this.strSearchField;
        this.txtKeywords.Value = this.strKeywords;
    }
    #endregion


    #region  获得信息分类
    protected void GetInfoType()
    {
        try
        {
            InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = tm.GetInfoType(1, -1, -1);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                new DropDownListTree().MakeTree(ds.Tables[0], "parent_id", "0", "type_id", "type_name", this.ddlType, -1, 1, true);

                this.ddlType.Items.Insert(0, new ListItem("选择信息分类", "-1"));
            }
            else
            {
                this.ddlType.Items.Clear();
                this.ddlType.Items.Add(new ListItem("选择信息分类", "-1"));
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  获得信息
    protected void GetInfo()
    {
        InfoManage im = new InfoManage(Public.CmsDBConnectionString);
        this.pageSize = DataConvert.ConvertValue(this.ddlPageSize.SelectedValue.Trim(), 10);
        this.typeId = DataConvert.ConvertValue(this.ddlType.SelectedValue.Trim(), -1);
        this.infoStatus = DataConvert.ConvertValue(this.ddlInfoStatus.SelectedValue.Trim(), -1);
        this.sendStatus = DataConvert.ConvertValue(this.ddlSendStatus.SelectedValue.Trim(), -1);
        this.isTiming = DataConvert.ConvertValue(this.ddlTiming.SelectedValue.Trim(),-1);
        this.strSearchField = this.ddlSearchField.SelectedValue.Trim();
        this.strKeywords = this.txtKeywords.Value.Trim();

        if (this.isLog != 1)
        {
            this.infoStatus = 0;
        }

        this.txtCurrentPageUrl.Value = this.BuildPageUrl(false);

        SearchField searchField = SearchField.None;
        switch (this.strSearchField)
        {
            case "Content":
                searchField = SearchField.Content;
                break;
        }

        DBResultInfo dbResult = im.GetLecScreenInfo(-1, this.typeId, true, this.isTiming, this.sendStatus, this.infoStatus,
            string.Empty, string.Empty, this.isLog == 1, this.strKeywords, searchField, SearchTactics.Or,
            this.pageIndex - this.pageStart, this.pageSize);
        DataSet ds = dbResult.dsResult;

        List<LedScreenInfo> lstInfo = new List<LedScreenInfo>();
        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                LedScreenInfo info = im.FillInfo(dr);
                info.StartTime = Public.ConvertDateTime(info.StartTime);
                info.EndTime = Public.ConvertDateTime(info.EndTime);
                info.CreateTime = Public.ConvertDateTime(info.CreateTime);

                lstInfo.Add(info);
            }
        }

        if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
        {
            // 因为这里统计的时候用了  group by
            int dataCount = ds.Tables[1].Rows.Count;// Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());

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
    #endregion

    #region  获得信息状态
    public string ParseInfoStatus(int status)
    {
        string[] strStatus = {
            "<span style=\"color:#008000;\">有效</span>",
            "<span style=\"color:#008000;\">-</span>",
            "<span style=\"color:#f90;\">已覆盖</span>",
            "<span style=\"color:#f00;\">已取消</span>",
            "<span style=\"color:#f00;\">已删除</span>",
            "<span style=\"color:#999;\">已过期</span>"
        };
        if (status >= 0 && status <= 5)
        {
            return strStatus[status];
        }
        return "-";
    }
    public string ParseSendStatus(int status)
    {
        string[] strStatus = {
            "<span style=\"color:#666;\">未发送</span>",
            "<span style=\"color:#008000;\">发送成功</span>",
            "<span style=\"color:#f00;\">发送失败</span>"
        };
        if (status >= 0 && status <= 2)
        {
            return strStatus[status];
        }
        return "-";
    }
    #endregion

    #region  创建当前页面URL
    protected string BuildPageUrl(bool isPage)
    {
        StringBuilder strUrl = new StringBuilder();
        strUrl.Append(String.Format("{0}", this.Request.Url.ToString().Split('?')[0]));
        if (!isPage)
        {
            strUrl.Append(String.Format("?title={0}&typeId={1}&infoStatus={2}&pageSize={3}&pageIndex={4}",
                this.strTitle, this.typeId, this.infoStatus, this.pageSize, this.pageIndex));
            strUrl.Append(String.Format("&searchField={0}&keywords={1}", this.strSearchField, this.strKeywords));
            strUrl.Append(String.Format("&isTiming={0}&sendStatus={1}", this.isTiming, this.sendStatus));
            strUrl.Append(String.Format("&isLog={0}", this.isLog));
        }
        return strUrl.ToString();
    }

    protected string BuildPageParam(bool isPage)
    {
        StringBuilder strParam = new StringBuilder();
        strParam.Append(String.Format("title={0}&typeId={1}&infoStatus={2}&pageSize={3}",
            this.strTitle, this.typeId, this.infoStatus, this.pageSize));
        strParam.Append(String.Format("&searchField={0}&keywords={1}", this.strSearchField, this.strKeywords));;
        strParam.Append(String.Format("&isTiming={0}&sendStatus={1}", this.isTiming, this.sendStatus));
        strParam.Append(String.Format("&isLog={0}", this.isLog));
        if (!isPage)
        {
            strParam.Append(String.Format("&pageIndex={0}", this.pageIndex));
        }
        return strParam.ToString();
    }
    #endregion

    #region  条件选择
    protected void ddlType_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfo();
    }
    protected void ddlInfoStatus_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfo();
    }
    protected void ddlSendStatus_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfo();
    }
    protected void ddlTiming_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfo();
    }    
    #endregion

    #region  每页显示
    protected void ddlPageSize_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfo();
    }
    #endregion

    #region  搜索信息分类
    protected void btnSearch_ServerClick(object sender, EventArgs e)
    {
        this.GetInfo();
    }
    #endregion

}
