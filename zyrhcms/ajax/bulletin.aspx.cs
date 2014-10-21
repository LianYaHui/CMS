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
using Zyrh.BLL.Info;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Info;

public partial class ajax_bulletin : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strAction = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int unitId = 0;
    protected int isValidate = -1;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    #region  初始化数据
    protected void InitialData()
    {
        try
        {
            this.strAction = Public.RequestString("action", string.Empty);
            if (Config.ValidateRequestType() && !this.strAction.Equals(string.Empty))
            {
                if (!this.Request.RequestType.Equals("POST"))
                {
                    Response.Write("RequestType Error");
                    Response.End();
                }
            }
            if (Config.ValidateUrlReferrer() && !strAction.Equals(string.Empty))
            {
                if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
                {
                    Response.Write("UrlReferrer Error");
                    Response.End();
                }
            }
            this.pageIndex = Public.RequestString("pageIndex", 0);
            this.pageSize = Public.RequestString("pageSize", 20);
            this.unitId = Public.RequestString("unitId", 0);

            ui = uc.GetLoginUserInfo();

            if (this.unitId == 0)
            {
                this.unitId = ui.UnitId;
            }

            switch (this.strAction)
            {
                case "getBulletin":
                    this.isValidate = Public.RequestString("isValidate", -1);
                    Response.Write(this.GetBulletin(this.isValidate, this.unitId, this.pageIndex, this.pageSize));
                    break;
                case "deleteBulletin":
                    string strIdList = Public.RequestString("idList");
                    Response.Write(this.DeleteBulletin(strIdList));
                    break;
                default:
                    Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                    break;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            Response.Write(String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current)));
        }
    }
    #endregion

    #region  获得公告信息
    public string GetBulletin(int isValidate, int unitId, int pageIndex, int pageSize)
    {
        try
        {
            BulletinManage bm = new BulletinManage(Public.CmsDBConnectionString);

            DBResultInfo dbResult = bm.GetBulletin(isValidate, unitId, pageIndex, pageSize);

            DataSet ds = dbResult.dsResult;

            StringBuilder strResult = new StringBuilder();
            int dataCount = 0;
            int n = 0;

            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = DataConvert.ConvertValue(ds.Tables[1].Rows[0][0], 0);
            }

            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    BulletinInfo info = bm.FillBulletin(dr);

                    if (n++ > 0)
                    {
                        strResult.Append(",");
                    }

                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},title:'{1}',createTime:'{2}',startTime:'{3}',endTime:'{4}'",
                        info.Id, Public.FilterJsonValue(info.Title), Public.ConvertDateTime(info.CreateTime), info.StartTime, info.EndTime));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");

            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  删除公告
    public string DeleteBulletin(string strIdList)
    {
        try
        {
            if (!uc.CheckUserLogin())
            {
                return "{result:0,msg:'您还没有登录'}";
            }
            ui = uc.GetLoginUserInfo();
            if (ui.RoleId != 1)
            {
                return "{result:0,msg:'您没有权限删除公告信息'}";
            }

            BulletinManage bm = new BulletinManage(Public.CmsDBConnectionString);

            string[] arr = strIdList.Split(',');
            foreach (string str in arr)
            {
                if (str.Equals(string.Empty))
                {
                    continue;
                }

                int id = DataConvert.ConvertValue(str, 0);
                bm.DeleteBulletin(id);
            }

            return "{result:1}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


}
