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
using Zyrh.BLL;
using Zyrh.BLL.Info;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Info;

public partial class modules_infoManage_sub_bulletinEdit : System.Web.UI.Page
{
    protected string strAction = string.Empty;
    protected int id = 0;
    protected bool isEdit = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strAction = Public.RequestString("action", "add");
        this.txtAction.Value = this.strAction;

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
            this.GetBulletion(this.id);
        }
        else
        {
            this.txtStartTime.Value = DateTime.Now.ToString("yyyy-MM-dd 0:00:00");
            this.txtEndTime.Value = DateTime.Now.AddDays(365).ToString("yyyy-MM-dd 23:59:59");
            this.rbValidate1.Checked = true;
        }
    }

    #region  获得公告信息
    protected void GetBulletion(int id)
    {
        try
        {
            BulletinManage bm = new BulletinManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = bm.GetBulletin(id);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                BulletinInfo info = bm.FillBulletin(dr);

                this.txtId.Value = info.Id.ToString();
                this.txtTitle.Value = info.Title;
                this.txtContent.Value = info.Content;
                this.txtStartTime.Value = Public.ConvertDateTime(info.StartTime);
                this.txtEndTime.Value = Public.ConvertDateTime(info.EndTime);
                this.rbValidate1.Checked = info.IsValidate == 1;
                this.rbValidate0.Checked = info.IsValidate == 0;
                this.txtSortOrder.Value = info.SortOrder.ToString();
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  编辑公告信息
    protected void UpdateBulletin()
    {
        try
        {
            this.id = DataConvert.ConvertValue(this.txtId.Value.Trim(), 0);
            this.strAction = this.txtAction.Value.Trim();
            this.isEdit = this.strAction.Equals("edit") && this.id > 0;
            string strTitle = this.txtTitle.Value.Trim();
            string strContent = this.txtContent.Value.Trim();
            string strStartTime = this.txtStartTime.Value.Trim();
            string strEndTime = this.txtEndTime.Value.Trim();
            int sortOrder = DataConvert.ConvertValue(this.txtSortOrder.Value.Trim(), 0);
            int isValidate = this.rbValidate1.Checked ? 1 : 0;

            BulletinInfo info = new BulletinInfo();
            info.Id = this.id;
            info.Title = Public.FilterString(strTitle);
            info.Content = StringOperate.FiltrateInputContent(Public.EscapeSingleQuotes(strContent));
            info.StartTime = Public.FilterString(strStartTime);
            info.EndTime = Public.FilterString(strEndTime);
            info.SortOrder = sortOrder;
            info.IsValidate = isValidate;

            BulletinManage bm = new BulletinManage(Public.CmsDBConnectionString);
            if (this.isEdit)
            {
                info.UpdateTime = Public.GetDateTime();

                bm.UpdateBulletin(info);
                this.ShowPrompt("公告信息更新成功", this.Request.Url.ToString(), true);
            }
            else
            {
                info.CreateTime = Public.GetDateTime();
                info.UpdateTime = Public.GetDateTime();

                bm.AddBulletin(info);
                this.ShowPrompt("公告信息发布成功", this.Request.Url.ToString(), true);
            }

        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnSave_ServerClick(object sender, EventArgs e)
    {
        this.UpdateBulletin();
    }


    #region  显示提示信息
    public void ShowPrompt(string strPrompt, string strUrl, bool isClose)
    {
        string strClose = isClose ? "true" : "false";
        string strFunc = isClose ? "parent.closeEditBulletin" : "null";
        this.lblPrompt.InnerHtml = String.Format("<script>page.showPromptWin('{0}','{1}',{2},{3});</script>",
            strPrompt, strUrl, strClose, strFunc);
    }
    #endregion

}
