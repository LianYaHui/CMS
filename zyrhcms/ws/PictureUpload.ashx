<%@ WebHandler Language="C#" Class="PictureUpload" %>
using System;
using System.Web;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;

public class PictureUpload : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        HttpContext.Current.Response.ContentType = "text/plain";
        int vals = HttpContext.Current.Request.TotalBytes;
        int conLength = (int)HttpContext.Current.Request.ContentLength;
        
        HttpContext.Current.Response.Write(vals.ToString() + ',' + conLength.ToString());

        try
        {
            if (vals > 0)
            {
                string strDevCode = Public.RequestString("puid");
                string strChannelNo = Public.RequestString("chan").PadLeft(2, '0');
                string strTime = Public.RequestString("time");
                string strSequence = Public.RequestString("sequence").PadLeft(2, '0');
                string strFileName = Public.RequestString("userfile");
                string strExtension = Path.GetExtension(strFileName);

                string strFilePath = string.Empty;
                FileStream fs;
                BinaryWriter bw;
                
                byte[] buffer = HttpContext.Current.Request.BinaryRead(vals);
                string strContent = Encoding.UTF8.GetString(buffer);

                HttpContext.Current.Response.Write("<br />" + strContent.ToString() + "<br />");
                if (strExtension.Equals(string.Empty))
                {
                    strExtension = ".jpg";
                }
                strFilePath = this.CreateDir(strTime, strDevCode) + this.BuildFileName(strTime, strSequence, strDevCode, strChannelNo, strExtension);
                fs = new FileStream(HttpContext.Current.Server.MapPath(strFilePath), FileMode.Create, FileAccess.Write);
                bw = new BinaryWriter(fs);
                bw.Write(buffer);
                bw.Close();
                fs.Close();

                HttpContext.Current.Response.Write(strFilePath);
            }
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.Write(ex.Message);
        }
    }

    private string CreateDir(string strTime, string strDevCode)
    {
        string strDir = String.Format("{0}/pic/{1}/{2}/", Public.WebDir, strTime.Split(' ')[0], strDevCode);

        if (!Directory.Exists(HttpContext.Current.Server.MapPath(strDir)))
        {
            Directory.CreateDirectory(HttpContext.Current.Server.MapPath(strDir));
        }

        return strDir;
    }

    private string BuildFileName(string strTime, string strSequence, string strDevCode, string strChannelNo, string strExtension)
    {
        Regex reg = new Regex("[-:\\s]");
        return String.Format("{0}_{1}_{2}_{3}{4}", reg.Replace(strTime, ""), strSequence, strDevCode, strChannelNo, strExtension);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}