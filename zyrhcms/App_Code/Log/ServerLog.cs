using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using Zyrh.Common;

/// <summary>
/// ErrorLog 的摘要说明
/// </summary>
public class ServerLog
{

    public ServerLog()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public static bool isSplit = true;
    public static int LogFileSize = Public.LogFileSize;    //10MB
    public static int maxFileLength = 1024 * LogFileSize; 

    public static string strEventLogName = String.Format("ev{0}{1}.log", DateTime.Now.ToString("yyyyMMdd"), string.Empty);
    public static string strErrorLogName = String.Format("er{0}{1}.log", DateTime.Now.ToString("yyyyMMdd"), string.Empty);
    public static string strDebugLogName = String.Format("de{0}{1}.log", DateTime.Now.ToString("yyyyMMdd"), string.Empty);

    
    public static string BuildFileDir()
    {
        return DateTime.Now.ToString("yyyy") + "/" + DateTime.Now.ToString("MM") + "/";
    }

    public static string BuildFileName(string strPrefix, string strPostfix)
    {
        return String.Format("{0}{1}{2}.log", strPrefix, DateTime.Now.ToString("yyyyMMdd"), strPostfix);
    }

    public static FileInfo[] SearchFile(string strFileDir, string strFileName)
    {
        DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Request.PhysicalApplicationPath + strFileDir);
        return dir.Exists ? dir.GetFiles(strFileName) : null;
    }
    
    public static string GetFileNamePostfix(FileInfo[] arrFile, int maxLength, string strSeparate)
    {
        try
        {
            int c = arrFile.Length;
            if (c > 0)
            {
                int max = 0;
                FileInfo fiLast = arrFile[0];

                string[] strDelimiter = { strSeparate };
                foreach (FileInfo fi in arrFile)
                {
                    string[] strPostfix = Path.GetFileNameWithoutExtension(fi.Name).Split(strDelimiter, StringSplitOptions.RemoveEmptyEntries);
                    if (strPostfix.Length > 1)
                    {
                        int cur = Convert.ToInt32(strPostfix[1]);
                        if (cur > max)
                        {
                            max = cur;
                            fiLast = fi;
                        }
                    }
                }
                double flen = Convert.ToDouble(fiLast.Length) / 1024;
                return max > 0 ? strSeparate + (max + (flen > maxLength ? 1 : 0)).ToString() : (flen > maxLength ? strSeparate + "1" : "");
            }
            return string.Empty;
        }
        catch (Exception ex)
        {
            return string.Empty;
        }
    }

    public static void WriteErrorLog(Exception ex, HttpRequest hr)
    {
        try
        {
            //ex.Source.IndexOf("mscorlib") >= 0
            if (ex.TargetSite.ToString().IndexOf("Void AbortInternal()") >= 0 || ex.Message.IndexOf("正在中止线程") >= 0)
            {
                //页面跳转，忽略
            }
            else
            {
                string strFileDir = Public.ErrorLogDir + BuildFileDir();
                string strFileName = BuildFileName("er", isSplit ? GetFileNamePostfix(SearchFile(strFileDir, BuildFileName("er", "*")), maxFileLength, "_") : "");
                FileOperate.WriteErrorLog(ex, hr, strFileDir, strFileName, true, Encoding.Default);
            }

        }
        catch (Exception exx) { }
    }

    public static void WriteErrorLog(Exception ex, HttpContext hc)
    {
        try
        {
            if (ex.TargetSite.ToString().IndexOf("Void AbortInternal()") >= 0 || ex.Message.IndexOf("正在中止线程") >= 0)
            {
                //页面跳转，忽略
            }
            else
            {
                string strFileDir = Public.ErrorLogDir + BuildFileDir();
                string strFileName = BuildFileName("er", isSplit ? GetFileNamePostfix(SearchFile(strFileDir, BuildFileName("er", "*")), maxFileLength, "_") : "");
                FileOperate.WriteErrorLog(ex, hc.Request, strFileDir, strFileName, true, Encoding.Default);
            }
        }
        catch (Exception exx) { }
    }

    public static void WriteEventLog(HttpRequest hr, string strEventName, string strEventContent)
    {
        try
        {
            string strFileDir = Public.EventLogDir + BuildFileDir();
            string strFileName = BuildFileName("ev", isSplit ? GetFileNamePostfix(SearchFile(strFileDir, BuildFileName("ev", "*")), maxFileLength, "_") : "");
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default);
        }
        catch (Exception exx) { }
    }

    public static void WriteEventLog(HttpRequest hr, string strEventName, string strEventContent, bool isSpaceLine)
    {
        try
        {
            string strFileDir = Public.EventLogDir + BuildFileDir();
            string strFileName = BuildFileName("ev", isSplit ? GetFileNamePostfix(SearchFile(strFileDir, BuildFileName("ev", "*")), maxFileLength, "_") : "");
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default, isSpaceLine);
        }
        catch (Exception exx) { }
    }

    public static void WriteEventLog(HttpRequest hr, string strEventName, string strEventContent, bool isSpaceLine, bool showRawUrl)
    {
        try
        {
            string strFileDir = Public.EventLogDir + BuildFileDir();
            string strFileName = BuildFileName("ev", isSplit ? GetFileNamePostfix(SearchFile(strFileDir, BuildFileName("ev", "*")), maxFileLength, "_") : "");
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default, isSpaceLine, showRawUrl);
        }
        catch (Exception exx) { }
    }

    public static void WriteEventLog(HttpRequest hr, string strFileName, string strEventName, string strEventContent)
    {
        try
        {
            string strFileDir = Public.EventLogDir + BuildFileDir();
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default);
        }
        catch (Exception exx) { }
    }

    public static void WriteEventLog(HttpRequest hr, string strFileName, string strEventName, string strEventContent, bool isSpaceLine)
    {
        try
        {
            string strFileDir = Public.EventLogDir + BuildFileDir();
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default, isSpaceLine);
        }
        catch (Exception exx) { }
    }

    public static void WriteEventLog(HttpRequest hr, string strFileName, string strEventName, string strEventContent, bool isSpaceLine, bool showRawUrl)
    {
        try
        {
            string strFileDir = Public.EventLogDir + BuildFileDir();
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default, isSpaceLine, showRawUrl);
        }
        catch (Exception exx) { }
    }
    
    public static void WriteDebugLog(HttpRequest hr, string strEventName, string strEventContent)
    {
        try
        {
            string strFileDir = Public.DebugLogDir + BuildFileDir();
            string strFileName = BuildFileName("de", isSplit ? GetFileNamePostfix(SearchFile(strFileDir, BuildFileName("de", "*")), maxFileLength, "_") : "");
            FileOperate.WriteEventLog(hr, strFileDir, strFileName, strEventName, strEventContent, true, Encoding.Default);
        }
        catch (Exception exx) { }
    }

}