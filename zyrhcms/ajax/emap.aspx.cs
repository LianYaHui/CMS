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
using System.IO;
using System.Text;
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.DBUtility;

public partial class ajax_emap : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected string strPath = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        this.strAction = Public.GetRequest("action", string.Empty);
        this.strPath = Public.GetRequest("path", string.Empty);

        switch (this.strAction)
        {
            case "downloadImage":
                Response.Write(this.DownloadRailwayImage(this.strPath));
                break;
            case "statRailwayTile":
                Response.Write(this.StatRailwayImage());
                break;
            case "getLandmark":
                Response.Write(this.GetEmapLandmark());
                break;
            case "offset":
                break;
            case "revert":
                break;
            default:
                Response.Write("ok");
                break;
        }
    }

    #region  获得地图标记
    public string GetEmapLandmark()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            EmapLandmarkManage mm = new EmapLandmarkManage(this.DBConnectionString);
            DBResultInfo dbResult = mm.GetEmapLandmark(string.Empty, string.Empty, -1, -1);

            strResult.Append("{result:1,list:[");

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n=0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    EmapLandmarkInfo mark = mm.FillEmapLandmark(dr);

                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("name:'{0}',lat:'{1}',lng:'{2}',zoom:'{3}',markType:'{4}'",
                        mark.MarkName, mark.Latitude, mark.Longitude, mark.MapZoom, mark.MarkType));
                    strResult.Append("}");
                    n++;
                }
            }
            strResult.Append("]}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion


    //以下为辅助功能

    #region  下载铁路图片
    protected string DownloadRailwayImage(string strPath)
    {
        string strName = Path.GetFileName(strPath);
        string strDir = strPath.Replace("http://img.railmap.cn/tile/", "").Split('/')[0];
        try
        {
            string strLocalDir = String.Format("{0}/{1}/{2}/", Public.WebDir, "tile", strDir);
            
            string strLocalPath = strLocalDir + strName;


            if (File.Exists(Server.MapPath(strLocalPath)))
            {
                this.InsertRailwayImage(Convert.ToInt32(strDir), strName, strPath, 1);
                return String.Format("{{result:2,dir:'{0}',name:'{1}'}}", strDir, strName);
            }

            if (!Directory.Exists(Server.MapPath(strLocalDir)))
            {
                Directory.CreateDirectory(Server.MapPath(strLocalDir));
            }

            bool result = false;// FileOperate.DownloadRemoteImage(strPath, Server.MapPath(strLocalPath));
            if (result)
            {
                this.InsertRailwayImage(Convert.ToInt32(strDir), strName, strPath, 1);
                return String.Format("{{result:1,dir:'{0}',name:'{1}'}}", strDir, strName);
            }
            else
            {
                this.InsertRailwayImage(Convert.ToInt32(strDir), strName, strPath, 0);
                return String.Format("{{result:0,dir:'{0}',name:'{1}'}}", strDir, strName);
            }
        }
        catch (Exception ex)
        {
            this.InsertRailwayImage(Convert.ToInt32(strDir), strName, strPath, 0);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  保存图片地址到数据库
    public int InsertRailwayImage(int zoom, string strName, string strUrl, int download)
    {
        try
        {
            string strSql = String.Format("select count(id) from emap_railway where zoom = '{0}' and tile_name = '{1}';", zoom, strName);

            StringBuilder strUpdate = new StringBuilder();

            int isExist = Convert.ToInt32(MySqlHelper.ExecuteScalar(Public.CmsDBConnectionString, strSql).ToString());
            if (isExist == 0)
            {
                strUpdate.Append("insert into emap_railway(zoom,tile_name,source_url,is_download,create_time)");
                strUpdate.Append("values(");
                strUpdate.Append(String.Format("'{0}','{1}','{2}','{3}',now()", zoom, strName, strUrl, download));
                strUpdate.Append(");");

                return MySqlHelper.ExecuteNonQuery(Public.CmsDBConnectionString, strUpdate.ToString());
            }
            else
            {
                strUpdate.Append(String.Format("update emap_railway set is_download = '{0}',update_time = now() where zoom = '{1}' and tile_name = '{2}';", download, zoom, strName));

                return MySqlHelper.ExecuteNonQuery(Public.CmsDBConnectionString, strUpdate.ToString());
            }
        }
        catch (Exception ex)
        {
            return -1;
        }
    }
    #endregion

    #region  统计铁路图片
    public string StatRailwayImage()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            string strSql = "select zoom,count(id) as total from emap_railway er group by zoom order by zoom desc;";
            DataSet ds = MySqlHelper.ExecuteDataSet(Public.CmsDBConnectionString, strSql);
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                strResult.Append("{result:1,list:[");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("zoom:{0},total:{1}", dr["zoom"], dr["total"]));
                    strResult.Append("}");
                    n++;
                }
                strResult.Append("]}");

                return strResult.ToString();
            }
            else
            {
                return String.Format("{{result:0}}");
            }
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

}
