<%@ WebHandler Language="C#" Class="MobileFileUpload" %>

using System;
using System.Web;
using System.IO;
using System.Text;

public class MobileFileUpload : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        HttpContext.Current.Response.ContentType = "text/plain";
        int vals = HttpContext.Current.Request.TotalBytes;

        try
        {
            if (vals > 0)
            {
                string strDevCode = Public.RequestString("did");
                int taskId = Public.RequestString("tid", 0);
                string strFileType = Public.RequestString("type", "pic");
                string strExtension = Public.RequestString("ext");
                string strFileData = Public.RequestString("data");
                //这是给手机客户端用的，文件上传成功后需要返回给客户端
                string strMarked = Public.RequestString("marked");
                string strUpMarked = Public.RequestString("upmarked");

                if (strExtension.Equals(string.Empty))
                {
                    switch (strFileType)
                    {
                        case "pic":
                        case "picture":
                            strExtension = ".jpg";
                            break;
                        case "video":
                            strExtension = ".mp4";
                            break;
                        case "audio":
                            strExtension = ".mp3";
                            break;
                    }
                }
                else if (strExtension.IndexOf('.') < 0)
                {
                    strExtension = "." + strExtension;
                }
                
                string strFilePath = string.Empty;
                FileStream fs;
                BinaryWriter bw;
                byte[] buffer;
                if (strFileData.Equals(string.Empty))
                {
                    buffer = HttpContext.Current.Request.BinaryRead(vals);
                    string strContent = Encoding.UTF8.GetString(buffer);
                }
                else
                {
                    buffer = Encoding.UTF8.GetBytes(strFileData);
                }
                strFilePath = this.CreateDir(strFileType, strDevCode) + this.BuildFileName(strDevCode, taskId, strExtension);
                fs = new FileStream(HttpContext.Current.Server.MapPath(strFilePath), FileMode.Create, FileAccess.Write);
                bw = new BinaryWriter(fs);
                bw.Write(buffer);
                bw.Close();
                fs.Close();

                StringBuilder strXml = new StringBuilder();
                strXml.Append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
                strXml.Append("<Result>");
                strXml.Append(String.Format("<Status>{0}<Status>", "Success"));
                strXml.Append(String.Format("<Msg>{0}<Msg>", ""));
                strXml.Append(String.Format("<FilePath><![CDATA[{0}{1}]]><FilePath>", Public.WebUrl, strFilePath));
                strXml.Append(String.Format("<Marked>{0}<Marked>", strMarked));
                strXml.Append(String.Format("<UpMarked>{0}<UpMarked>", strUpMarked));
                strXml.Append("</Result>");

                HttpContext.Current.Response.Write(strXml.ToString());
            }
        }
        catch (Exception ex)
        {
            StringBuilder strError = new StringBuilder();
            strError.Append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
            strError.Append("<Result>");
            strError.Append(String.Format("<Status>{0}<Status>", "Failed"));
            strError.Append(String.Format("<Msg><![CDATA[{0}]]><Msg>", ex.Message));
            strError.Append("</Result>");

            HttpContext.Current.Response.Write(strError.ToString());
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    private string CreateDir(string strFileType, string strDevCode)
    {
        string strDevDir = strDevCode.Equals(string.Empty) ? "" : strDevCode + "/";
        string strDir = String.Format("{0}/upfiles/mobile/{1}/{2}/{3}",
            Public.WebDir, strFileType, DateTime.Now.ToString("yyyy-MM-dd"), strDevDir);

        if (!Directory.Exists(HttpContext.Current.Server.MapPath(strDir)))
        {
            Directory.CreateDirectory(HttpContext.Current.Server.MapPath(strDir));
        }

        return strDir;
    }


    private string BuildFileName(string strDevCode, int taskId, string strExtension)
    {
        int rnum = new Random().Next(10, 99);
        return String.Format("{0}{1}_{2}_{3}{4}", DateTime.Now.ToString("yyyyMMddhhmmssfff"), rnum.ToString(), strDevCode, taskId, strExtension);
    }
}