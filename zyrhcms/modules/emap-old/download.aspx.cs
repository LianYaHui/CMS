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
using System.IO;
using Zyrh.Common;
using Zyrh.DBUtility;

public partial class modules_emap_download : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.ddlZoom.Items.Clear();
            for (int i = 0; i < 22; i++)
            {
                ListItem li = new ListItem(i.ToString(), i.ToString());
                this.ddlZoom.Items.Add(li);
            }
        }
    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        try
        {
            int mapzoom = Convert.ToInt32(this.ddlZoom.SelectedValue.ToString());
            string strSql = String.Format("select id,zoom,source_url from emap_railway where zoom = '{0}' and is_download = 0;", mapzoom);

            DataSet ds = MySqlHelper.ExecuteDataSet(Public.CmsDBConnectionString, strSql);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int count = ds.Tables[0].Rows.Count;
                int num = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    int id = Convert.ToInt32(dr["id"].ToString());
                    int zoom = Convert.ToInt32(dr["zoom"].ToString());
                    string strUrl = dr["source_url"].ToString();

                    int result = this.DownloadRailwayImage(strUrl);
                    if (result > 0)
                    {
                        this.UpdateRailwayStatus(1, id);
                        num++;
                    }
                    else
                    {
                        this.UpdateRailwayStatus(result, id);
                    }
                }
                this.txtResult.Text += "缩放等级" + mapzoom + " 共有" + count + "个图片，已下载" + num + "个图片，" + (count - num) + "个下载失败。\r\n";
            }

        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }

    }


    #region  下载铁路图片
    protected int DownloadRailwayImage(string strPath)
    {
        string strName = Path.GetFileName(strPath);
        string strDir = strPath.Replace("http://img.railmap.cn/tile/", "").Split('/')[0];
        try
        {
            string strLocalDir = String.Format("{0}/{1}/{2}/", Public.WebDir, "tile", strDir);

            string strLocalPath = strLocalDir + strName;


            if (File.Exists(Server.MapPath(strLocalPath)))
            {
                return 2;
            }

            if (!Directory.Exists(Server.MapPath(strLocalDir)))
            {
                Directory.CreateDirectory(Server.MapPath(strLocalDir));
            }

            bool result = FileOperate.DownloadRemoteImage(strPath, Server.MapPath(strLocalPath));
            return result ? 1 : 0;
        }
        catch (Exception ex)
        {
            return -1;
        }
    }
    #endregion

    public int UpdateRailwayStatus(int isDownload, int id)
    {
        try
        {
            string strSql = String.Format("update emap_railway set is_download = {0} where id = {1};", isDownload, id);
            int result = MySqlHelper.ExecuteNonQuery(Public.CmsDBConnectionString, strSql);

            return result;
        }
        catch (Exception ex)
        {
            return -1;
        }
    }

}
