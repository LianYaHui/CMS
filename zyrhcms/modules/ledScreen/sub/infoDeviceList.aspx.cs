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

public partial class modules_ledScreen_sub_infoDeviceList : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected int pageStart = 0;
    protected int pageIndex = 0;
    protected int pageSize = 10;
    protected string strSearchField = string.Empty;
    protected string strKeywords = string.Empty;
    protected int infoId = 0;
    protected int status = -1;
    protected int isLog = 0;

    protected string strTitle = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strTitle = Public.RequestString("title", "信息终端列表");
        this.infoId = Public.RequestString("infoId", 0);
        this.isLog = Public.RequestString("isLog", 0);

        this.txtInfoId.Value = this.infoId.ToString();
        this.txtIsLog.Value = this.isLog.ToString();

        if (!IsPostBack)
        {
            this.InitialData();
            this.GetInfoDevice();
        }
    }

    #region  初始化数据
    protected void InitialData()
    {
        this.pageIndex = Public.RequestString("pageIndex", pageStart);
        this.pageSize = Public.RequestString("pageSize", 10);

        this.ddlPageSize.SelectedValue = this.pageSize.ToString();
    }
    #endregion


    #region  获得信息
    protected void GetInfoDevice()
    {
        InfoDeviceManage im = new InfoDeviceManage(Public.CmsDBConnectionString);
        this.pageSize = DataConvert.ConvertValue(this.ddlPageSize.SelectedValue.Trim(), 10);

        this.txtCurrentPageUrl.Value = this.BuildPageUrl(false);

        DBResultInfo dbResult = im.GetLedInfoDevice(-1, this.infoId, -1, string.Empty, string.Empty, this.pageIndex - this.pageStart, this.pageSize);
        DataSet ds = dbResult.dsResult;

        List<LedScreenInfoDevice> lstInfo = new List<LedScreenInfoDevice>();
        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                LedScreenInfoDevice info = im.FillInfoDevice(dr);
                info.CreateTime = Public.ConvertDateTime(info.CreateTime);
                info.DownTime = info.DownTime.Equals(string.Empty) ? "-" : Public.ConvertDateTime(info.DownTime);
                info.ResponseTime = info.ResponseTime.Equals(string.Empty) ? "-" : Public.ConvertDateTime(info.ResponseTime);
                info.DeleteTime = info.DeleteTime.Equals(string.Empty) ? "-" : Public.ConvertDateTime(info.DeleteTime);
                
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

    public string ParseOperateStatus(int status, int type)
    {
        string[] strStatus = {
            String.Format("<span style=\"color:#666;\">{0}</span>", type == 1 ? "未下发" : "未回复"),
            "<span style=\"color:#008000;\">成功</span>",
            "<span style=\"color:#f00;\">失败</span>"
        };
        if (status >= 0 && status <= 2)
        {
            return strStatus[status];
        }
        return "-";
    }
    public string ParseDeleteStatus(int status)
    {
        string[] strStatus = {
            "<span style=\"color:#666;\"></span>",
            "<span style=\"color:#008000;\">成功</span>",
            "<span style=\"color:#f00;\">失败</span>",
            "<span style=\"color:#f00;\">覆盖</span>"
        };
        if (status >= 0 && status <= 3)
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
            strUrl.Append(String.Format("?title={0}&infoId={1}&status={2}&pageSize={3}&pageIndex={4}",
                this.strTitle, this.infoId, this.status, this.pageSize, this.pageIndex));
            strUrl.Append(String.Format("?isLog={0}", this.isLog));
        }
        return strUrl.ToString();
    }

    protected string BuildPageParam(bool isPage)
    {
        StringBuilder strParam = new StringBuilder();
        strParam.Append(String.Format("title={0}&infoId={1}&status={2}&pageSize={3}",
            this.strTitle, this.infoId, this.status, this.pageSize));
        strParam.Append(String.Format("?isLog={0}", this.isLog));
        if (!isPage)
        {
            strParam.Append(String.Format("&pageIndex={0}", this.pageIndex));
        }
        return strParam.ToString();
    }
    #endregion

    #region  每页显示
    protected void ddlPageSize_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.GetInfoDevice();
    }
    #endregion

}
