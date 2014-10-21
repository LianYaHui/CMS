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
using System.Text.RegularExpressions;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;
using Zyrh.DBUtility;

public partial class tools_dtpAjax : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int lineId = 0;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        this.strAction = Public.RequestString("action");
        switch (this.strAction)
        {
            case "getMarkerInfo":
                this.lineId = Public.RequestString("lineId", 0);
                Response.Write(this.GetMarkerInfo(this.lineId));
                break;
            case "saveMarkerInfo":
                this.lineId = Public.RequestString("lineId", 0);
                string strMarkerData = Public.RequestString("markerData");
                Response.Write(this.SaveMarkerInfo(this.lineId, strMarkerData));
                break;
        }
    }

    protected string GetMarkerInfo(int lineId)
    {
        try
        {
            string strSql = String.Format("select * from rp_railway_line where line_id = {0} order by id;", lineId);
            DataSet ds = MySqlHelper.ExecuteDataSet(this.DBConnectionString, strSql);

            StringBuilder strResult = new StringBuilder();
            strResult.Append("{result:1");
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append(String.Format("{{id:{0},lat:'{1}',lng:'{2}',lid:{3}}}",
                        dr["id"], dr["latitude"], dr["longitude"], dr["line_id"]));
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }

    protected string SaveMarkerInfo(int lineId, string strMarkerData)
    {
        try
        {
            string[] arrMarkerData = strMarkerData.Split('|');
            StringBuilder strSql = new StringBuilder();
            foreach (string str in arrMarkerData)
            {
                string[] arrData = str.Split(',');
                if ("0" == arrData[0])
                {
                    strSql.Append("insert into rp_railway_line(line_id,latitude,longitude,create_time)values(");
                    strSql.Append(String.Format("{0},'{1}','{2}',now()", lineId, arrData[1], arrData[2]));
                    strSql.Append(");");
                }
                else
                {
                    strSql.Append("update rp_railway_line set ");
                    strSql.Append(String.Format(" latitude = '{0}',longitude = '{1}' where id = {2};", arrData[1], arrData[2], arrData[0]));
                }
            }
            int result = 0;
            if (arrMarkerData.Length > 0)
            {
                result = MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());
            }
            StringBuilder strResult = new StringBuilder();
            strResult.Append(String.Format("{{result:1, dataCount:{0}}}", result));

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }

}
