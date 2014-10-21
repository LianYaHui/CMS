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
using System.Net;
using System.IO;
using Zyrh.Common;

public partial class ajax_download : System.Web.UI.Page
{
    protected string strAction = string.Empty;
    protected int domain = 0;
    protected int type = 0;
    protected string strPath = string.Empty;
    protected bool isLocal = true;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.strAction = Public.GetRequest("action", string.Empty);
            this.type = Public.GetRequest("type", 0);
            this.domain = Public.GetRequest("domain", 0);
            this.strPath = Public.GetRequest("path", string.Empty);
            this.isLocal = this.domain < 2;

            switch (strAction)
            {
                case "downloadSound":
                    this.DownloadSoundFile(this.strPath);
                    break;
                case "downloadUploadFile":
                    this.DownloadUploadFile(Public.RequestString("type", 0), Public.RequestString("path"));
                    break;
                case "download":
                default:
                    if (!strPath.Equals(string.Empty))
                    {
                        this.DownloadImage(this.type, this.domain, this.isLocal, this.strPath);
                    }
                    break;
            }
        }
    }

    #region  下载图片
    protected void DownloadImage(int type, int domain, bool isLocal, string strPath)
    {
        string contentType = "";
        try
        {
            /*
            string strDir = "";
            if (isLocal)
            {
                if (domain == 0 || type == 0)
                {
                    //下载抓拍图或抓拍参考图（实为抓拍图）
                    //strDir = this.GetCapturePictureDir();
                    strDir = this.GetCapturePictureDir();
                    if (!strDir.Equals(string.Empty))
                    {
                        strPath = strDir + strPath.Replace(Public.CmsUrl + "/", "").Replace("/", "\\");
                    }
                    else
                    {
                    }
                }
                else
                {
                    //下载人工添加的参考图，目前基本上没有
                }
            }
            else
            {
                //删除前3天下载的图片
                for (int i = 1; i < 4; i++)
                {
                    string strDate = DateTime.Now.AddDays(-i).ToString("yyyy-MM-dd");
                    string strDirDelete = Public.WebDir + "/download/pictemp/" + strDate + "/";

                    FileOperate.DeleteDirectory(Server.MapPath(strDirDelete));
                    ServerLog.WriteDebugLog(HttpContext.Current.Request, "DelDir", strDirDelete);
                }

                string strDirLocal = Public.WebDir + "/download/pictemp/" + DateTime.Now.ToString("yyyy-MM-dd") + "/";
                if (!Directory.Exists(Server.MapPath(strDirLocal)))
                {
                    Directory.CreateDirectory(Server.MapPath(strDirLocal));
                }
                string strLocalPath = Server.MapPath(strDirLocal + Path.GetFileName(strPath));
                //如果图片不存在，则下载，如果存在，表示之前已下载过
                if (!File.Exists(strLocalPath))
                {
                    //下载远程图片
                    if (FileOperate.DownloadRemoteImage(strPath, strLocalPath))
                    {
                        strPath = strLocalPath;
                    }
                    else
                    {
                        strPath = string.Empty;
                        //图片下载失败
                    }
                }
                else
                {
                    strPath = strLocalPath;
                }
            }
            */
            strPath = Server.MapPath(Public.WebDir + "/" + strPath);
            if (File.Exists(strPath))
            {
                FileOperate.DownloadImage(strPath);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

    #region  获得抓拍图物理目录根目录
    public string GetCapturePictureDir()
    {
        try
        {
            string strUrl = Public.CmsUrl + "/modules/api/path.jsp";
            string strDir = RemoteRequest.PostRequest(strUrl, "", Encoding.UTF8);
            return strDir;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return string.Empty;
        }
    }
    #endregion

    #region  下载音频文件
    protected void DownloadSoundFile(string strPath)
    {
        try
        {
            string strExt = Path.GetExtension(strPath).ToLower();
            string strContentType = string.Empty;
            switch (strExt)
            {
                case ".wav":
                    strContentType = "audio/x-wav";
                    break;
                case ".mp3":
                    strContentType = "audio/mpeg";
                    break;
                case ".mid":
                    strContentType = "audio/midi";
                    break;
            }
            string strFilePath = Server.MapPath(String.Format("{0}/{1}", Public.WebDir, strPath).Replace("//", "/"));
            string strFileName = Path.GetFileName(strPath);

            if (File.Exists(strFilePath))
            {
                HttpContext.Current.Response.ContentType = strContentType;
                HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment; filename=" + strFileName);
                HttpContext.Current.Response.TransmitFile(strFilePath);
                HttpContext.Current.Response.End();
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion


    #region  下载设备上传文件
    protected void DownloadUploadFile(int type, string strPath)
    {
        try
        {
            string strFilePath = Server.MapPath(String.Format("{0}/{1}", Public.WebDir, strPath).Replace("//", "/"));
            string strFileName = Path.GetFileName(strPath);
            if (0 == type)
            {
                if (File.Exists(strFilePath))
                {
                    FileOperate.DownloadImage(strFilePath);
                }
            }
            else
            {
                string strExt = Path.GetExtension(strPath).ToLower();
                string strContentType = string.Empty;
                switch (strExt)
                {
                    case ".wav":
                        strContentType = "audio/x-wav";
                        break;
                    case ".mp3":
                        strContentType = "audio/mp3";
                        break;
                    case ".mid":
                        strContentType = "audio/midi";
                        break;
                    case ".mp4":
                        strContentType = "video/mp4";
                        break;
                }

                if (File.Exists(strFilePath))
                {
                    HttpContext.Current.Response.ContentType = strContentType;
                    HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment; filename=" + strFileName);
                    HttpContext.Current.Response.TransmitFile(strFilePath);
                    HttpContext.Current.Response.End();
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
