using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Zyrh.Common;

public enum MenuType
{
    WebMenu = 1,
    ManageMenu = 2,
    ThirdMenu = 3,
}

public enum NetworkType
{
    Internet = 1,
    InLAN = 2,
}

/// <summary>
/// Public 的摘要说明
/// </summary>
public class Public
{
    public Public()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  数据库连接字符串
    /// <summary>
    /// 数据库连接字符串是否加密
    /// </summary>
    public static bool DBConnectionStringEncrypt = GetConnectionString("DBConnectionStringEncrypt").Equals("1");
    /// <summary>
    /// 平台数据库连接字符串
    /// </summary>
    public static string CmsDBConnectionString = DBConnectionStringEncrypt ? Encrypt.AESDecode(GetConnectionString("CmsDBConnectionString")) : GetConnectionString("CmsDBConnectionString");
    /// <summary>
    /// GPS数据库连接字符串
    /// </summary>
    public static string GpsDBConnectionString = DBConnectionStringEncrypt ? Encrypt.AESDecode(GetConnectionString("GpsDBConnectionString")) : GetConnectionString("GpsDBConnectionString");
    /// <summary>
    /// GPRS数据库连接字符串
    /// </summary>
    public static string GprsDBConnectionString = DBConnectionStringEncrypt ? Encrypt.AESDecode(GetConnectionString("GprsDBConnectionString")) : GetConnectionString("GprsDBConnectionString");
    /// <summary>
    /// 图片数据库连接字符串
    /// </summary>
    public static string PicDBConnectionString = DBConnectionStringEncrypt ? Encrypt.AESDecode(GetConnectionString("PicDBConnectionString")) : GetConnectionString("PicDBConnectionString");
    /// <summary>
    /// 工具数据库连接字符串
    /// </summary>
    public static string ToolsDBConnectionString = DBConnectionStringEncrypt ? Encrypt.AESDecode(GetConnectionString("ToolsDBConnectionString")) : GetConnectionString("ToolsDBConnectionString");

    #endregion

    #region  网站配置信息
    /// <summary>
    /// 网站根目录(绝对路径)
    /// </summary>
    public static string WebUrl = GetRootUrl();
    /// <summary>
    /// 网站根目录(绝对路径)
    /// </summary>
    public static string WebRoot = GetRootUrl();
    /// <summary>
    /// 主机
    /// </summary>
    public static string WebHost = GetWebHost();
    /// <summary>
    /// 主机 端口
    /// </summary>
    public static string WebHostPort = GetWebHostPort();
    /// <summary>
    /// 
    /// </summary>
    public static string ModulePageUrl = GetAppSetting("ModulePageUrl", "/module.aspx");

    /// <summary>
    /// 网站名称
    /// </summary>
    public static string WebName = GetAppSetting("WebName", "中研瑞华监控管理系统");
    /// <summary>
    /// 是否显示父节点
    /// </summary>
    public static bool ParentNodeDisplay = GetAppSetting("ParentNodeDisplay", 0) == 1;

    /// <summary>
    /// GPRS SERVER IP
    /// </summary>
    public static string GprsServerIp = GetAppSetting("GprsServerIp", GetWebIpAddress());
    /// <summary>
    /// GPRS SERVER PORT
    /// </summary>
    public static int GprsServerPort = GetAppSetting("GprsServerPort", 23400);

    /// <summary>
    /// WMP SERVER IP
    /// </summary>
    public static string WmpServerIp = GetAppSetting("WmpServerIp", GetWebIpAddress());
    /// <summary>
    /// WMP SERVER PORT
    /// </summary>
    public static int WmpServerPort = GetAppSetting("WmpServerPort", 23510);
    /// <summary>
    /// Socket Heartbeat，单位：秒
    /// </summary>
    public static int SocketHeartbeatInterval = GetAppSetting("SocketHeartbeatInterval", 30) * 1000;
    /// <summary>
    /// 日志文件单个文件大小，单位：MB
    /// </summary>
    public static int LogFileSize = GetAppSetting("LogFileSize", 10);


    /// <summary>
    /// 登录用户超时时间，单位：分钟
    /// </summary>
    public int UserTimeoutTime = GetAppSetting("UserTimeoutTime", 20);
    /// <summary>
    /// 登录用户超时删除状态时间，单位：分钟
    /// </summary>
    public static int UserTimeoutDelete = GetAppSetting("UserTimeoutDelete", 30);

    #endregion

    /// <summary>
    /// 是否是内网环境
    /// </summary>
    public static bool IsInLAN()
    {
        return GetAppSetting("IsInLAN").Equals("-1") ? CheckIsInLAN() : GetAppSetting("IsInLAN", 0) == 1;
    }

    public static bool CheckIsInLAN()
    {
        try
        {
            return ("http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port.ToString()).Equals(GetAppSetting("CmsUrlInLAN"));
        }
        catch (Exception ex) { return false; }
    }

    #region  网站配置信息
    /// <summary>
    /// 中心平台地址
    /// </summary>
    public static string CmsUrl = GetRootUrl();
    /// <summary>
    /// 网站根目录(根相对路径)
    /// </summary>
    public static string WebDir = GetRootDir();
    /// <summary>
    /// 网站根目录物理路径
    /// </summary>
    public static string WebRootPath = GetRootPath();
    /// <summary>
    /// 网站服务器IP
    /// </summary>
    public static string WebServerIp = GetWebIpAddress();
    /// <summary>
    /// 错误日志目录
    /// </summary>
    public static string ErrorLogDir = GetAppSetting("ErrorLogDir", "/log/error/");
    /// <summary>
    /// 操作日志目录
    /// </summary>
    public static string EventLogDir = GetAppSetting("EventLogDir", "/log/event/");
    /// <summary>
    /// 程序调试日志目录
    /// </summary>
    public static string DebugLogDir = GetAppSetting("DebugLogDir", "/log/debug/");
    /// <summary>
    /// 上传文件目录
    /// </summary>
    public static string UploadFileDir = GetAppSetting("UploadFileDir", "/static/upload/");
    /// <summary>
    /// 电话录音文件的存放目录
    /// </summary>
    public static string SoundRecordFileDir = GetAppSetting("SoundRecordFileDir", "/sound/");
    /// <summary>
    /// 设备远程升级文件目录
    /// </summary>
    public static string DeviceRemoteUpdateFileDir = UploadFileDir + "update/";

    /// <summary>
    /// css文件目录
    /// </summary>
    public static string CssDir = GetAppSetting("CssDir", "/static/css/");
    /// <summary>
    /// JS文件目录
    /// </summary>
    public static string JsDir = GetAppSetting("JsDir", "/static/js/");

    /// <summary>
    /// 是否记录GPRS指令发送日志
    /// </summary>
    public static bool GprsSendLog = GetAppSetting("GprsSendLog").Equals("1");
    /// <summary>
    /// 登录页URL
    /// </summary>
    public static string LoginUrl = GetAppSetting("LoginUrl", "/login.aspx");
    /// <summary>
    /// 模块页URL
    /// </summary>
    public static string ModuleUrl = GetAppSetting("ModuleUrl", "/module.aspx");
    /// <summary>
    /// 首页URL
    /// </summary>
    public static string HomeUrl = GetAppSetting("HomeUrl", "/default.aspx");
    /// <summary>
    /// 拒绝访问URL
    /// </summary>
    public static string NoAuthUrl = GetAppSetting("NoAuthUrl", "/common/aspx/noauth.aspx");
    /// <summary>
    /// 错误页面URL
    /// </summary>
    public static string ErrorUrl = GetAppSetting("ErrorUrl", "/common/aspx/error.aspx");

    #endregion


    #region  获得网站根目录
    /// <summary>
    /// 获得网站根目录
    /// </summary>
    /// <returns></returns>
    public static string GetRootUrl()
    {
        return GetRootUrl(HttpContext.Current.Request);
    }

    /// <summary>
    /// 获得网站根目录
    /// </summary>
    /// <param name="httpRequest"></param>
    /// <returns></returns>
    public static string GetRootUrl(HttpRequest httpRequest)
    {
        string strAppPath = "";
        if (httpRequest != null)
        {
            string strUrlAuthority = httpRequest.Url.GetLeftPart(UriPartial.Authority);
            if (httpRequest.ApplicationPath == null || httpRequest.ApplicationPath.Equals("/"))
            {
                //直接安装在独立WEB站点
                strAppPath = strUrlAuthority;
            }
            else
            {
                //安装在虚拟子目录下
                strAppPath = strUrlAuthority + httpRequest.ApplicationPath;
            }
        }
        return strAppPath;
    }

    /// <summary>
    /// 获得网站根目录(相对根目录)
    /// </summary>
    /// <returns></returns>
    public static string GetRootDir()
    {
        string strAppPath = "";
        HttpContext httpCurrent = HttpContext.Current;
        HttpRequest httpRequest;
        if (httpCurrent != null)
        {
            httpRequest = httpCurrent.Request;
            if (httpRequest.ApplicationPath != null && !httpRequest.ApplicationPath.Equals("/"))
            {
                //安装在虚拟子目录下
                strAppPath = httpRequest.ApplicationPath;
            }
        }
        return strAppPath;
    }
    #endregion

    #region  获得网站主机端口
    public static string GetWebHost()
    {
        return HttpContext.Current.Request.Url.Host;
    }
    public static int GetWebPort()
    {
        return HttpContext.Current.Request.Url.Port;
    }
    public static string GetWebHostPort()
    {
        int port = GetWebPort();
        return GetWebHost() + (port != 80 ? ":" + port : string.Empty);
    }
    #endregion

    #region  获得服务器IP地址
    public static string GetWebIpAddress()
    {
        return HttpContext.Current.Request.ServerVariables.Get("Local_Addr").ToString();
    }
    #endregion

    #region  获得网站根目录物理路径
    /// <summary>
    /// 获得网站根目录物理路径
    /// </summary>
    /// <returns></returns>
    public static string GetRootPath()
    {
        string strAppPath = "";
        HttpContext httpCurrent = HttpContext.Current;
        if (httpCurrent != null)
        {
            strAppPath = httpCurrent.Server.MapPath("~");
        }
        else
        {
            strAppPath = AppDomain.CurrentDomain.BaseDirectory;
        }
        if (Regex.Match(strAppPath, @"\\$", RegexOptions.Compiled).Success)
        {
            strAppPath = strAppPath.Substring(0, strAppPath.Length - 1);
        }
        return strAppPath;
    }
    #endregion

    #region  获得网站配置信息
    public static string GetAppSetting(string strKey)
    {
        return GetAppSetting(strKey, string.Empty);
    }

    public static string GetAppSetting(string strKey, string strDefaultValue)
    {
        if (ConfigurationManager.AppSettings[strKey] != null)
        {
            return ConfigurationManager.AppSettings[strKey].ToString();
        }
        return strDefaultValue;
    }

    public static int GetAppSetting(string strKey, int defaultValue)
    {
        if (ConfigurationManager.AppSettings[strKey] != null)
        {
            if (Public.IsNumber(ConfigurationManager.AppSettings[strKey].ToString()))
            {
                return Convert.ToInt32(ConfigurationManager.AppSettings[strKey].ToString());
            }
            else
            {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public static string GetConnectionString(string strName)
    {
        return GetConnectionString(strName, string.Empty);
    }

    public static string GetConnectionString(string strName, string strDefaultValue)
    {
        if (ConfigurationManager.ConnectionStrings[strName] != null)
        {
            return ConfigurationManager.ConnectionStrings[strName].ToString();
        }
        return strDefaultValue;
    }
    #endregion

    #region  验证是否是数字
    public static bool IsNumber(string strNumber)
    {
        string strPattern = @"^\-?(0+)?(\d+)(.\d+)?$";

        return new Regex(strPattern).IsMatch(strNumber);
    }
    #endregion

    #region  获得日期时间
    public static string GetDate()
    {
        return DateTime.Now.ToString("yyyy-MM-dd");
    }

    public static string GetLogFileName(string prefix)
    {
        return String.Format("{0}{1}.log", prefix, DateTime.Now.ToString("yyyyMMdd"));
    }

    public static string GetDateTime()
    {
        return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    }

    public static string GetDateTime(string strFormat)
    {
        return DateTime.Now.ToString(strFormat);
    }

    public static string GetDateTimeSecond()
    {
        return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss fff");
    }

    public static string ConvertDateTime(string strDateTime)
    {
        if (strDateTime.Equals(string.Empty)) return string.Empty;
        return DateTime.Parse(strDateTime).ToString("yyyy-MM-dd HH:mm:ss");
    }

    public static string ConvertDateTime(string strDateTime, string strReplace)
    {
        if (strDateTime.Equals(string.Empty)) return strReplace;
        return DateTime.Parse(strDateTime).ToString("yyyy-MM-dd HH:mm:ss");
    }

    public static string GetDateTimeTick()
    {
        DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
        TimeSpan ts = DateTime.Now.Subtract(dtStart);
        return ts.Ticks.ToString().Substring(0, ts.Ticks.ToString().Length - 7);
    }

    public static string NoCache()
    {
        return DateTime.Now.ToString("yyMMddHHmmss");
    }
    #endregion

    #region  引用CSS、JS
    /// <summary>
    /// 设置CSS
    /// </summary>
    /// <param name="cssNames">CSS文件名，多个，以逗号“,”分隔</param>
    /// <returns></returns>
    public static string SetPageCss(string cssNames)
    {
        string CssLinkPrototype = "{0}<link rel=\"stylesheet\" type=\"text/css\" href=\"{1}\" />";

        StringBuilder strPageCss = new StringBuilder();
        string[] arrCss = cssNames.Split(',');
        foreach (string str in arrCss)
        {
            if (str.Equals(string.Empty) || str.IndexOf(".css") < 0) continue;
            strPageCss.Append(String.Format(CssLinkPrototype, "\r\n    ", Public.WebDir + Public.CssDir + str));
        }
        return strPageCss.ToString();
    }

    /// <summary>
    /// 设置JS
    /// </summary>
    /// <param name="jsNames">JS文件名，多个，以逗号“,”分隔</param>
    /// <returns></returns>
    public static string SetPageJs(string jsNames)
    {
        return BuildPageJs(jsNames, "    ", false);
    }

    public static string SetPageJs(string jsNames, bool noCache)
    {
        return BuildPageJs(jsNames, "    ", noCache);
    }
    /// <summary>
    /// 设置JS
    /// </summary>
    /// <param name="jsNames">JS文件名，多个，以逗号“,”分隔</param>
    /// <returns></returns>
    public static string SetPageJsOther(string jsNames)
    {
        return BuildPageJs(jsNames, string.Empty, false);
    }

    public static string SetPageJsOther(string jsNames, bool noCache)
    {
        return BuildPageJs(jsNames, string.Empty, noCache);
    }
    /// <summary>
    /// 引用JS文件
    /// </summary>
    /// <param name="jsNames"></param>
    /// <param name="strSpace"></param>
    /// <returns></returns>
    public static string BuildPageJs(string jsNames, string strSpace, bool noCache)
    {
        string JsScriptPrototype = "{0}{1}<script type=\"text/javascript\" src=\"{2}\"></script>";

        StringBuilder strPageJs = new StringBuilder();
        string[] arrJs = jsNames.Split(',');
        string strDate = noCache ? "v=" + Public.GetDateTime("MMddHHmmss") : string.Empty;
        string strJs = string.Empty;
        if (strDate.Equals(string.Empty))
        {
            foreach (string str in arrJs)
            {
                if (str.Equals(string.Empty) || str.IndexOf(".js") < 0) continue;
                strPageJs.Append(String.Format(JsScriptPrototype, "\r\n", strSpace, Public.WebDir + Public.JsDir + str));
            }
        }
        else
        {
            foreach (string str in arrJs)
            {
                if (str.Equals(string.Empty) || str.IndexOf(".js") < 0) continue;
                strJs = str + (str.IndexOf("js?") > 0 ? "&" : "?") + strDate;
                strPageJs.Append(String.Format(JsScriptPrototype, "\r\n", strSpace, Public.WebDir + Public.JsDir + strJs));
            }
        }
        return strPageJs.ToString();
    }
    #endregion

    #region  获得Request参数
    public static int GetRequest(string strKey, int defaultValue)
    {
        try
        {
            HttpRequest req = HttpContext.Current.Request;
            return req[strKey] != null ? Convert.ToInt32(req[strKey].ToString().Trim()) : defaultValue;
        }
        catch (FormatException ex)
        {
            return defaultValue;
        }
    }

    public static string GetRequest(string strKey)
    {
        return GetRequest(strKey, string.Empty);
    }

    public static string GetRequest(string strKey, string strDefaultValue)
    {

        HttpRequest req = HttpContext.Current.Request;
        
        return req[strKey] != null ? EscapeSingleQuotes(HttpUtility.HtmlEncode(req[strKey].ToString().Trim())) : strDefaultValue;
    }
    #endregion

    #region  Request Response

    #region  获得Request参数
    /// <summary>
    /// 获得Request参数
    /// 忽略大小写以及首字母大写
    /// </summary>
    /// <param name="strKey"></param>
    /// <returns></returns>
    private static string GetRequestString(string strKey)
    {
        HttpRequest req = HttpContext.Current.Request;
        bool hasParam = false;
        string strValue = string.Empty;
        strKey = strKey.Trim();
        if (req[strKey] != null)
        {
            strValue = req[strKey].ToString();
            return strValue.Trim();
        }
        //忽略大小写
        if (!hasParam)
        {
            string[] arrKeyCopy = { strKey.ToLower(), strKey.ToUpper() };
            foreach (string str in arrKeyCopy)
            {
                if (req[str] != null)
                {
                    strValue = req[str].ToString();
                    return strValue.Trim();
                }
            }
        }
        //分割字符串
        if (!hasParam)
        {
            string[] arrDelimiter = { ",", "|", ";" };
            string[] arrKey = strKey.Split(arrDelimiter, StringSplitOptions.RemoveEmptyEntries);
            foreach (string str in arrKey)
            {
                if (req[str] != null)
                {
                    strValue = req[str].ToString();
                    return strValue.Trim();
                }
            }
        }
        if (!hasParam)
        {
            string strKeyCopy = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(strKey);
            if (req[strKeyCopy] != null)
            {
                strValue = req[strKeyCopy].ToString();
                return strValue.Trim();
            }
        }
        return strValue;
    }
    #endregion

    /// <summary>
    /// URL QueryString
    /// </summary>
    /// <param name="strKey"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static int RequestString(string strKey, int defaultValue)
    {
        HttpRequest req = HttpContext.Current.Request;
        string strValue = GetRequestString(strKey);
        return !strValue.Equals(string.Empty) && IsNumber(strValue) ? Convert.ToInt32(strValue) : defaultValue;
    }
    /// <summary>
    /// URL QueryString
    /// </summary>
    /// <param name="strKey"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static float RequestString(string strKey, float defaultValue)
    {
        HttpRequest req = HttpContext.Current.Request;
        string strValue = GetRequestString(strKey);

        return !strValue.Equals(string.Empty) && IsNumber(strValue) ? Convert.ToSingle(strValue) : defaultValue;
    }
    /// <summary>
    /// URL QueryString
    /// </summary>
    /// <param name="strKey"></param>
    /// <returns></returns>
    public static string RequestString(string strKey)
    {
        return RequestString(strKey, string.Empty, true);
    }
    /// <summary>
    /// URL QueryString
    /// </summary>
    /// <param name="strKey"></param>
    /// <param name="strDefaultValue"></param>
    /// <returns></returns>
    public static string RequestString(string strKey, string strDefaultValue)
    {
        return RequestString(strKey, strDefaultValue, true);
    }
    /// <summary>
    /// URL QueryString
    /// </summary>
    /// <param name="strKey"></param>
    /// <param name="isEscapeSingleQuotes"></param>
    /// <returns></returns>
    public static string RequestString(string strKey, bool isEscapeSingleQuotes)
    {
        return RequestString(strKey, string.Empty, isEscapeSingleQuotes);
    }

    /// <summary>
    /// URL QueryString
    /// </summary>
    /// <param name="strKey"></param>
    /// <param name="strDefaultValue"></param>
    /// <param name="isEscapeSingleQuotes">是否转义单引号</param>
    /// <returns></returns>
    public static string RequestString(string strKey, string strDefaultValue, bool isEscapeSingleQuotes)
    {
        HttpRequest req = HttpContext.Current.Request;
        string strValue = GetRequestString(strKey);
        if (strValue.Equals(string.Empty))
        {
            return strDefaultValue;
        }
        strValue = HttpUtility.HtmlEncode(strValue);
        return isEscapeSingleQuotes ? EscapeSingleQuotes(strValue) : strValue;
    }

    /// <summary>
    /// 向客户端输出的字符串
    /// </summary>
    /// <param name="strContent"></param>
    /// <returns></returns>
    public static string ResponseString(string strContent)
    {
        return HttpUtility.HtmlEncode(strContent.Trim());
    }

    public static string FilterJsonValue(string strValue)
    {
        return EscapeSingleQuotes(HttpUtility.HtmlEncode(strValue.Trim())).Replace("\r\n", "<br />").Replace("\n", "<br />");
    }

    //过滤字符串格式
    public static string FilterString(string strContent)
    {
        return FilterString(strContent, true);
    }
    public static string FilterString(string strContent, bool isEscapeSingleQuotes)
    {
        strContent = HttpUtility.HtmlEncode(HttpUtility.HtmlDecode(strContent.Trim()));
        return isEscapeSingleQuotes ? EscapeSingleQuotes(strContent) : strContent;
    }
    #endregion

    public static string SqlParamFilter(string strValue)
    {
        return strValue.Replace("--", "\\--").Replace(";", "\\;").Replace("'", "\\'").Replace("\"", "\\\"").Replace("\\", "\\\\").Replace("/", "\\/");
    }
    
    #region  转义单引号
    /// <summary>
    /// 转义单引号
    /// </summary>
    /// <param name="strContent"></param>
    /// <returns></returns>
    public static string EscapeSingleQuotes(string strContent)
    {
        return strContent.Replace("'", "\\\'");
    }
    /// <summary>
    /// 转义单引号
    /// </summary>
    /// <param name="strContent"></param>
    /// <returns></returns>
    public static string EscapeSingleQuotesToJson(string strContent)
    {
        return strContent.Replace("'", "\\\'");
    }

    /// <summary>
    /// 转义单引号
    /// </summary>
    /// <param name="strContent"></param>
    /// <returns></returns>
    public static string EscapeSingleQuotesToJs(string strContent)
    {
        return strContent.Replace("'", "\\\'");
    }

    /// <summary>
    /// 转义单引号
    /// </summary>
    /// <param name="strContent"></param>
    /// <returns></returns>
    public static string ReplaceSingleQuotes(string strContent)
    {
        return strContent.Replace("'", "\\\'");
    }
    #endregion

    #region  验证主机域名是否正确
    public static bool CheckWebHost(HttpRequest hr, string strWebHost)
    {
        string strHost = hr.Url.Host;
        if (strHost.ToLower().Equals("localhost") || strHost.Equals("127.0.0.1") || strWebHost.Equals(string.Empty))
        {
            return true;
        }
        if (hr.Url.Port > 0 && hr.Url.Port != 80)
        {
            strHost += ":" + hr.Url.Port;
        }
        return strHost.Equals(strWebHost);
    }
    #endregion

    #region  替换URL中的主机域名
    public static string ReplaceWebHost(HttpRequest hr, string strWebHost)
    {
        string strUrl = hr.Url.ToString().Replace("http://", "");
        int li = strUrl.IndexOf('/');
        if (li >= 0)
        {
            strUrl = strUrl.Substring(li);
        }
        return "http://" + strWebHost + strUrl;
    }
    #endregion

    #region  JS方式跳转到登录页面
    public static void WriteJsToLoginUrl()
    {
        string strText = "<script type=\"text/javascript\">top.location.href='{0}';</script>";
        HttpContext.Current.Response.Write(String.Format(strText, Public.WebDir + Public.LoginUrl));
    }
    #endregion

    #region  字符串转换为数字
    public static int ToInt32(string strNum)
    {
        return ToInt32(strNum, 0);
    }
    public static int ToInt32(string strNum, int defaultValue)
    {
        if (strNum.Equals(String.Empty))
        {
            return defaultValue;
        }
        if (!IsNumeral(strNum))
        {
            return defaultValue;
        }
        return Convert.ToInt32(strNum);
    }
    #endregion

    #region  判断字符串是否为数字
    public static bool IsNumeral(string strNumeral)
    {
        Regex reg = new Regex(@"^[-]?\d+[.]?\d*$");
        return reg.IsMatch(strNumeral);
    }
    #endregion

    #region  替换字符串为查询语句条件
    public static string ReplaceStringToCondition(string strValue)
    {
        if (strValue.Equals(string.Empty) || strValue.IndexOf("'") >= 0 || strValue.IndexOf("','") >= 0)
        {
            return strValue;
        }
        else
        {
            return String.Format("'{0}'", strValue.Replace(",", "','"));
        }
    }
    #endregion

    #region  检测字符串是否包含在内容中
    /// <summary>
    /// 检测字符串是否包含在内容中
    /// </summary>
    /// <param name="strMatch">匹配值</param>
    /// <param name="strContent">多个内容，以英文逗号“,”分隔</param>
    /// <returns></returns>
    public static bool CheckStringInArray(string strMatch, string strContent)
    {
        string[] arr = strContent.Split(',');
        return CheckStringInArray(strMatch, arr);
    }

    /// <summary>
    /// 检测字符串是否包含在内容中
    /// </summary>
    /// <param name="strMatch">匹配值</param>
    /// <param name="arrContent">内容数组</param>
    /// <returns></returns>
    public static bool CheckStringInArray(string strMatch, string[] arrContent)
    {
        foreach (string str in arrContent)
        {
            if (strMatch.Equals(str))
            {
                return true;
            }
        }
        return false;
    }
    #endregion

    #region  创建错误信息提示
    public static string BuildExcetionPrompt(Exception ex)
    {
        string strError = "<input type=\"text\" class=\"txt-label\" style=\"width:96%;\" value=\"错误信息：" + ex.Message + "\" />";
        return strError.Replace("\r\n", "<br />");
    }

    public static string BuildExceptionCode(Exception ex, HttpContext hc)
    {
        string strError = String.Format("[Message]: {0}<br />[Source]: {1}<br />[StackTrace]: {2}<br />[TargetSite]: {3}<br />[RawUrl]: {4}",
            ex.Message, ex.Source, ex.StackTrace, ex.TargetSite, hc.Request.RawUrl);
        return strError.Replace("\r\n", "<br />").Replace("\\", "\\\\").Replace("'", "\\\'");
    }
    #endregion

    public static string ReadFileContent(string strFilePath)
    {
        try
        {
            string strResult = string.Empty;
            strFilePath = HttpContext.Current.Server.MapPath(strFilePath);
            if (System.IO.File.Exists(strFilePath))
            {
                System.IO.StreamReader sr = new System.IO.StreamReader(strFilePath, System.Text.Encoding.UTF8);
                strResult = sr.ReadToEnd();
                sr.Close();
            }
            return strResult;
        }
        catch (Exception ex)
        {
            return string.Empty;
        }
    }

}