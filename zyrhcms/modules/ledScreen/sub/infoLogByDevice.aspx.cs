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

public partial class modules_ledScreen_sub_infoLogByDevice : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected int isLog = 0;
    protected int pageStart = 0;
    protected int pageIndex = 0;
    protected int pageSize = 10;
    protected string strSearchField = string.Empty;
    protected string strKeywords = string.Empty;
    protected int infoId = 0;
    protected int typeId = 0;
    protected int parentId = 0;
    protected int infoStatus = -1;
    protected int sendStatus = -1;
    protected int isTiming = -1;
    protected int status = -1;

    protected string strTitle = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void GetInfo()
    {

    }


    #region  解析信息状态
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
        strParam.Append(String.Format("&searchField={0}&keywords={1}", this.strSearchField, this.strKeywords)); ;
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

    #region  搜索信息
    protected void btnSearch_ServerClick(object sender, EventArgs e)
    {
        this.GetInfo();
    }
    #endregion

}