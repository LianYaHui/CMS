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
using System.IO;
using Zyrh.BLL;
using Zyrh.BLL.Info;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Info;

public partial class modules_infoManage_sub_datum : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected int pageStart = 1;
    protected int pageIndex = 1;
    protected int pageSize = 15;
    protected int dataCount = 0;
    protected List<DatumInfo> lstInfo = new List<DatumInfo>();
    protected string strTitle = string.Empty;


    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.strTitle = Public.RequestString("title");
            this.InitialData();
            this.GetDatum();
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
        this.pageIndex = Public.RequestString("pageIndex", this.pageStart);
        this.pageSize = Public.RequestString("pageSize", 15);
    }
    #endregion

    #region  获得公告信息
    public void GetDatum()
    {
        try
        {
            DatumManage dm = new DatumManage(Public.CmsDBConnectionString);

            DBResultInfo dbResult = dm.GetDatum(-1, pageIndex - pageStart, pageSize);
            DataSet ds = dbResult.dsResult;

            lstInfo = new List<DatumInfo>();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DatumInfo info = dm.FillDatum(dr);
                    lstInfo.Add(info);
                }
            }

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                this.dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());

                //分页标记
                PaginationParam param = new PaginationParam(dataCount, this.pageSize, this.pageIndex, 1, this.BuildPageUrl(true), this.BuildPageParam(true));
                param.HideUrl = true;
                param.MarkType = PaginationMarkType.Symbol;
                param.ShowDataCount = true;
                param.ShowPageCount = true;
                //param.ShowDataStat = true;

                this.divPagination.InnerHtml = new PaginationMark().BuildPaginationString(param);
            }

            this.txtCurrentPageUrl.Value = this.BuildPageUrl(false);

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
            strUrl.Append(String.Format("?title={0}&pageSize={1}&pageIndex={2}",
                this.strTitle, this.pageSize, this.pageIndex));
            //strUrl.Append(String.Format("&searchField={0}&keywords={1}", this.strSearchField, this.strKeywords));
        }
        return strUrl.ToString();
    }

    protected string BuildPageParam(bool isPage)
    {
        StringBuilder strParam = new StringBuilder();
        strParam.Append(String.Format("title={0}&pageSize={1}",
            this.strTitle, this.pageSize));
        if (!isPage)
        {
            strParam.Append(String.Format("&pageIndex={0}", this.pageIndex));
        }
        return strParam.ToString();
    }
    #endregion

    #region  显示文件大小
    public string ShowFileSize(int fs)
    {
        string strResult = string.Empty;
        double d = Convert.ToDouble(fs);
        string strUnit = string.Empty;

        if (fs > (1024 * 1024))
        {
            d = Math.Round(d / 1024 / 1024, 2);
            
            strUnit = "MB";
        }
        else if (fs > 1024)
        {
            d = Math.Round(d / 1024, 2);
            strUnit = "KB";
        }
        else
        {
            d = Math.Round(d / 1024, 2);
            strUnit = "KB";
        }

        return String.Format("{0} {1}", d, strUnit);
    }
    #endregion

    #region  显示文件名称
    public string ShowFileName(string strFileName)
    {
        return Path.GetFileName(strFileName);
    }
    #endregion

}
