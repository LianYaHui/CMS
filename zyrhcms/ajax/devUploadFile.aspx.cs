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
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_devUploadFile : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string PicDBConnectionString = Public.PicDBConnectionString;

    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected bool isDebug = false;

    protected int fileId = 0;
    protected int controlUnitId = 0;
    protected string strDevTypeCode = string.Empty;
    protected string strDevCode = string.Empty;
    protected string strDevCodeList = string.Empty;
    protected int channelNo = 1;
    protected int fileType = -1;
    
    protected string strStartTime = string.Empty;
    protected string strEndTime = string.Empty;

    protected string strFilter = string.Empty;
    protected string strKeywords = string.Empty;

    protected int pageIndex = 0;
    protected int pageSize = 20;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

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
        this.controlUnitId = Public.RequestString("controlUnitId", 0);

        ui = uc.GetLoginUserInfo();
        if (this.controlUnitId == 0)
        {
            this.controlUnitId = ui.UnitId;
        }
        switch (this.strAction)
        {
            case "getDeviceUploadFile":
                Response.Write(this.GetDeviceUploadFileList(
                    Public.RequestString("devCode"),
                    Public.RequestString("channelNo", -1),
                    Public.RequestString("fileType", -1),
                    Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00")),
                    Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59")),
                    Public.RequestString("pageIndex", 0),
                    Public.RequestString("pageSize", 20),
                    Public.RequestString("isDesc", 1) == 1
                    ));
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }
    }

    #region  获得设备上传文件列表
    protected string GetDeviceUploadFileList(string strDevCode, int channelNo, int fileType, string strStartTime, string strEndTime,
        int pageIndex, int pageSize, bool isDesc)
    {
        try
        {
            DeviceUploadFileManage dufm = new DeviceUploadFileManage(this.PicDBConnectionString);
            int dataCount = dufm.GetUploadFileTotal(strDevCode, channelNo, -1, -1, strStartTime, strEndTime, fileType, 1, -1);
            List<DeviceUploadFileInfo> lstInfo = dufm.GetUploadFileInfoList(strDevCode, channelNo, -1, -1,
                strStartTime, strEndTime, fileType, -1, -1, pageIndex, pageSize, isDesc);
            if (lstInfo.Count == 0)
            {
                string strName = "设备上传文件";
                switch (fileType)
                {
                    case 0:
                        strName = "图片文件";
                        break;
                    case 1:
                        strName = "录像文件";
                        break;
                    case 2:
                        strName = "录音文件";
                        break;
                }
                return String.Format("{{result:0,msg:'没有找到相关的{0}信息',error:''}}", strName);
            }
            else
            {
                StringBuilder strResult = new StringBuilder();
                string strFileDir = string.Empty;

                strResult.Append("{result:1");
                strResult.Append(String.Format(",dataCount:{0}", dataCount));
                strResult.Append(String.Format(",fileDir:'{0}'", strFileDir));
                strResult.Append(String.Format(",nowTime:'{0}'", Public.GetDateTime()));
                strResult.Append(",list:[");
                int n = 0;
                foreach (DeviceUploadFileInfo info in lstInfo)
                {
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("fileId:{0},uploadTime:'{1}',devCode:'{2}',channelNo:{3},fileType:{4},isFinished:{5}",
                        info.FileId, Public.ConvertDateTime(info.UploadTime), info.DevCode, info.ChannelNo, info.FileType, info.IsFinished));
                    strResult.Append(String.Format(",filePath:'{0}',fileExt:'{1}',fileSize:'{2}'",
                        info.FilePath.Replace("//", "/"), info.FileExtension, this.ShowFileSize(this.GetFileSize(Config.WebDir, info.FilePath, info.FileSize))));
                    strResult.Append(String.Format(",createTime:'{0}',fileId:{1}",
                        Public.ConvertDateTime(info.CreateTime), info.FileId));
                    strResult.Append("}");
                }
                strResult.Append("]");
                strResult.Append("}");

                return strResult.ToString();
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得文件大小
    public int GetFileSize(string strFileDir, string strFilePath, int fileSize)
    {
        try
        {
            if (fileSize > 0)
            {
                return fileSize;
            }
            string strRealPath = Server.MapPath(String.Format("{0}/{1}", strFileDir, strFilePath));
            if (!File.Exists(strRealPath))
            {
                return -1;
            }
            FileInfo file = new FileInfo(strRealPath);

            return Convert.ToInt32(file.Length);
        }
        catch (Exception ex)
        {
            //ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            return -1;
        }
    }
    #endregion

    #region  显示文件大小
    public string ShowFileSize(int fs)
    {
        if (-1 == fs)
        {
            return "-1";
        }
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

}
