<%@ WebHandler Language="C#" Class="upload_pic" %>
using System;
using System.Web;
using System.Text;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;
using System.IO;

public class upload_pic : IHttpHandler {

    protected DeviceUploadFileManage ufm = new DeviceUploadFileManage(Public.PicDBConnectionString);
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        
        string strAction = Public.RequestString("action");
        string strDevCode = Public.RequestString("puid");
        /*
        if (!HttpContext.Current.Request.RequestType.Equals("POST"))
        {
            HttpContext.Current.Response.Write("-2");
            HttpContext.Current.Response.Flush();
            HttpContext.Current.Response.End();
        }
        */
        if (strDevCode.Equals(string.Empty))
        {
            HttpContext.Current.Response.Write(" ");
            HttpContext.Current.Response.Flush();
            HttpContext.Current.Response.End();
        }
        if (strAction.Equals("check"))
        {
            //ServerLog.WriteDebugLog(HttpContext.Current.Request, "PictureUploadCheck", strDevCode + " " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            
            bool result = this.CheckDevCode(strDevCode);
            HttpContext.Current.Response.Write(result ? "1" : "0");
        }
        else
        {
            int channelNo = Public.RequestString("chan", 1);
            int presetNo = Public.RequestString("preset", 1);
            string strTime = Public.RequestString("time");
            int sequence = Public.RequestString("sequence", 0);
            string strFilePath = Public.RequestString("filepath");
            string strFilePathMd5 = Public.RequestString("md5");

            if (channelNo < 1)
            {
                channelNo = 1;
            }
            if (presetNo < 1)
            {
                presetNo = 1;
            }

            if (strFilePath.Equals(string.Empty) || Path.GetFileName(strFilePath).Equals(string.Empty))
            {
                HttpContext.Current.Response.Write("-1");
            }
            else if (!Encrypt.HashEncrypt(strFilePath + strDevCode + strTime, EncryptFormat.MD5).ToLower().Equals(strFilePathMd5))
            {
                HttpContext.Current.Response.Write("-1");
            }
            else if (!File.Exists(HttpContext.Current.Server.MapPath(Public.WebDir + "/" + strFilePath)))
            {
                HttpContext.Current.Response.Write("-1");
            }
            else
            {
                bool result = this.UploadFile(strDevCode, channelNo, presetNo, sequence, strFilePath, strTime);

                HttpContext.Current.Response.Write(result ? "1" : "0");
            }
        }
        HttpContext.Current.Response.Flush();
        HttpContext.Current.Response.End();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

    public bool CheckDevCode(string strDevCode)
    {
        try
        {
            DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
            return dm.CheckDeviceIndexCodeIsExist(strDevCode) > 0;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }

    public bool UploadFile(string strDevCode, int channelNo, int presetNo, int sequence, string strFilePath, string strTime)
    {
        DeviceUploadFileInfo dpi = new DeviceUploadFileInfo();
        string strTableName  = ufm.BuildUploadFileTableName(string.Empty);

        if (strTime.Equals(string.Empty))
        {
            strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
        dpi.DevCode = strDevCode;
        dpi.ChannelNo = channelNo;
        dpi.PresetNo = presetNo;
        dpi.FilePath = strFilePath;
        dpi.FileType = 0;
        dpi.IsFinished = 1;
        dpi.Sequence = sequence;
        dpi.UploadTime = strTime;
        
        string strSql = ufm.BuildUploadFileInsertSql(strTableName, dpi);
        try
        {
            ufm.AddUploadFile(strSql);
            return true;
        }
        catch (Exception ex)
        {
            try
            {
                if (!ufm.CheckDataTableIsExist(strTableName))
                {
                    ufm.CreateUploadFileTable(strTableName);
                }
                ufm.AddUploadFile(strSql);
                return true;
            }
            catch (Exception exx)
            {
                ServerLog.WriteErrorLog(exx, HttpContext.Current);
                return false;
            }
        }
        
    }

}