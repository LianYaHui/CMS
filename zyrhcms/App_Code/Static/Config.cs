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
using System.Xml;
using Zyrh.BLL;

/// <summary>
/// Config 的摘要说明
/// </summary>
public class Config
{
    public Config()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 网站根目录
    /// </summary>
    /// <returns></returns>
    public static string WebDir = GetRootDir();

    public static string GetWebDir()
    {
        return GetRootDir();
    }
    /// <summary>
    /// 平台URL
    /// </summary>
    public static string CmsUrl = GetRootUrl();

    public static string GetCmsUrl()
    {
        return GetRootUrl();
    }

    #region  配置文件
    public static string ConfigFileDir = GetAppSetting("ConfigFileDir");
    public static string GetConfigFileDir()
    {
        return GetAppSetting("ConfigFileDir");
    }

    public static string ConfigFileName = GetAppSetting("ConfigFileName");
    public static string GetConfigFileName()
    {
        return GetAppSetting("ConfigFileName");
    }

    public static string MenuConfigFileName = GetAppSetting("MenuConfigFileName");
    public static string GetMenuConfigFileName()
    {
        return GetAppSetting("MenuConfigFileName");
    }
    #endregion

    #region  平台配置
    public static string WebName = GetAppSetting("WebName", "武汉供电段安全生产指挥系统");
    /// <summary>
    /// 获得网站平台名称
    /// </summary>
    /// <returns></returns>
    public static string GetWebName()
    {
        return GetAppSetting("WebName", "武汉供电段安全生产指挥系统");
    }

    public static string GetWebLogo()
    {
        string strImage = GetAppSetting("LogoImage");
        if (strImage.Equals(string.Empty))
        {
            return string.Empty;
        }
        return String.Format("<img src=\"{0}{1}/{2}\" alt=\"{3}\" />", WebDir, ImageDir, strImage, GetWebLogoName()).Replace("//", "/");
    }

    public static string GetWebLogoName()
    {
        return GetAppSetting("LogoName");
    }

    public static string GetCopyright()
    {
        return GetAppSetting("Copyright");
    }
    #endregion

    #region  服务器相关配置
    /// <summary>
    /// Redis SERVER IP
    /// </summary>
    public static string RedisServerIp = GetAppSetting("RedisServerIp", "127.0.0.1");

    public static string GetRedisServerIp()
    {
        return GetAppSetting("RedisServerIp", "127.0.0.1");
    }

    /// <summary>
    /// Redis SERVER PORT
    /// </summary>
    public static int RedisServerPort = GetAppSetting("RedisServerPort", 6379);

    public static int GetRedisServerPort()
    {
        return GetAppSetting("RedisServerPort", 6379);
    }
    /// <summary>
    /// 是否调用Redis服务
    /// </summary>
    public static bool RedisEnabled = GetAppSetting("RedisEnabled", 0) == 1;

    public static bool GetRedisEnabled()
    {
        return GetAppSetting("RedisEnabled", 0) == 1;
    }

    /// <summary>
    /// 是否推送中心录像计划给CSS服务器
    /// </summary>
    public static bool RecordPlanPush = GetAppSetting("RecordPlanPush", 0) == 1;

    public static bool GetRecordPlanPush()
    {
        return GetAppSetting("RecordPlanPush", 0) == 1;
    }


    /// <summary>
    /// Gprs SERVER IP
    /// </summary>
    public static string GprsServerIp = GetAppSetting("GprsServerIp", "127.0.0.1");

    public static string GetGprsServerIp()
    {
        return GetAppSetting("GprsServerIp", "127.0.0.1");
    }

    /// <summary>
    /// Gprs SERVER PORT
    /// </summary>
    public static int GprsServerPort = GetAppSetting("GprsServerPort", 23400);

    public static int GetGprsServerPort()
    {
        return GetAppSetting("GprsServerPort", 23400);
    }

    /// <summary>
    /// Sms SERVER IP
    /// </summary>
    public static string SmsServerIp = GetAppSetting("SmsServerIp", "127.0.0.1");

    public static string GetSmsServerIp()
    {
        return GetAppSetting("SmsServerIp", "127.0.0.1");
    }

    /// <summary>
    /// Sms SERVER PORT
    /// </summary>
    public static int SmsServerPort = GetAppSetting("SmsServerPort", 23405);

    public static int GetSmsServerPort()
    {
        return GetAppSetting("SmsServerPort", 23405);
    }


    /// <summary>
    /// Led SERVER IP
    /// </summary>
    public static string LedServerIp = GetAppSetting("LedServerIp", "127.0.0.1");

    public static string GetLedServerIp()
    {
        return GetAppSetting("LedServerIp", "127.0.0.1");
    }

    /// <summary>
    /// Led SERVER PORT
    /// </summary>
    public static int LedServerPort = GetAppSetting("LedServerPort", 23401);

    public static int GetLedServerPort()
    {
        return GetAppSetting("LedServerPort", 23401);
    }
    #endregion
        
    
    #region  OCX相关配置
    /// <summary>
    /// OCX控件版本
    /// </summary>
    public static string OcxVersion = GetAppSetting("OcxVersion");
    /// <summary>
    /// OCX控件版本
    /// </summary>
    /// <returns></returns>
    public static string GetOcxVersion()
    {
        return GetAppSetting("OcxVersion"); ;
    }
    #endregion

    #region  用户相关配置
    /// <summary>
    /// 是否保存管理员用户名
    /// </summary>
    public static bool SaveAdminName()
    {
        return GetAppSetting("SaveAdminName", 0) == 1;
    }

    /// <summary>
    /// 是否保存管理员密码
    /// </summary>
    public static bool SaveAdminPassword()
    {
        return GetAppSetting("SaveAdminPassword", 0) == 1;
    }

    /// <summary>
    /// 是否启用自动登录
    /// </summary>
    public static bool AdminAutoLogin()
    {
        return GetAppSetting("AdminAutoLogin", 0) == 1;
    }

    /// <summary>
    /// 登录失败多少次后启用验证码，若设置为-1表示不启用验证码，默认为3次
    /// </summary>
    public static int LoginFailedTimes()
    {
        return GetAppSetting("LoginFailedTimes", 3);
    }    
    #endregion

    #region  安全相关配置
    /// <summary>
    /// 是否禁用右键菜单（防止查看网页源文件），0-不禁用，1-禁用
    /// </summary>
    public static bool DisabledContextMenu()
    {
        return GetAppSetting("DisabledContextMenu", 1) == 1;
    }

    /// <summary>
    /// 设置浏览器右键菜单是否启用
    /// </summary>
    public static string SetContextMenu()
    {
        return DisabledContextMenu() ? "return false;" : string.Empty;
    }

    /// <summary>
    /// 是否验证POST来源，0-不验证，1-验证
    /// </summary>
    public static bool ValidateUrlReferrer()
    {
        return GetAppSetting("ValidateUrlReferrer", 0) == 1;
    }
    /// <summary>
    /// 是否验证表单提交方式，0-不验证，1-验证：表单提交必须是POST方式
    /// </summary>
    public static bool ValidateRequestType()
    {
        return GetAppSetting("ValidateRequestType", 0) == 1;
    }
    /// <summary>
    /// 是否验证表单请求令牌，0-不验证，1-验证：若令牌错误，则不予提交
    /// </summary>
    public static bool ValidateRequestToken()
    {
        return GetAppSetting("ValidateRequestToken", 0) == 1;
    }

    /// <summary>
    /// 检测用户登录状态最大有效期时间，单位：分钟，默认为15分钟，-1表示不检测有效期
    /// </summary>
    public static int UserLoginStatusMaxExpireTime()
    {
        return GetAppSetting("UserLoginStatusMaxExpireTime", 15);
    }
    #endregion

    #region  地图相关配置
    /// <summary>
    /// 地图引擎，bmap-百度地图，gmap-谷歌地图
    /// </summary>
    public static string MapEngine = GetAppSetting("MapEngine", "bmap");

    public static string GetMapEngine()
    {
        return GetAppSetting("MapEngine", "bmap");
    }

    /// <summary>
    /// 百度地图KEY
    /// </summary>
    public static string BaiDuMapKey = GetAppSetting("BaiDuMapKey", "RIGCmUNyr3guCeMDqLwGr7Dx");

    public static string GetBaiDuMapKey()
    {
        return GetAppSetting("BaiDuMapKey", "RIGCmUNyr3guCeMDqLwGr7Dx");
    }

    /// <summary>
    /// 地图缩放等级
    /// </summary>
    public static int MapZoom = GetAppSetting("MapZoom", 15);

    public static int GetMapZoom()
    {
        return GetAppSetting("MapZoom",15);
    }
    
    /// <summary>
    /// 地图类型
    /// </summary>
    public static string MapType = GetAppSetting("MapType", "BMAP_NORMAL_MAP");

    public static string GetMapType()
    {
        return GetAppSetting("MapType", "BMAP_NORMAL_MAP");
    }

    /// <summary>
    /// 地图中心GPS坐标（标准的GPS坐标）
    /// </summary>
    public static string MapCenter = GetAppSetting("MapCenter", "29.8745801,121.6404101");

    public static string GetMapCenter()
    {
        return GetAppSetting("MapCenter", "29.8745801,121.6404101");
    }
    #endregion


    #region  电话短信相关配置
    /// <summary>
    /// 电话录音本机号码设置，每个之间以英文逗号“,”分隔
    /// </summary>
    public static string SoundRecordPhoneNumberList = GetAppSetting("SoundRecordPhoneNumberList");

    public static string GetSoundRecordPhoneNumberList()
    {
        return GetAppSetting("SoundRecordPhoneNumberList");
    }
    /// <summary>
    /// 短信发送号码设置，每个之间以英文逗号“,”分隔
    /// </summary>
    public static string SmsPhoneNumberList = GetAppSetting("SmsPhoneNumberList");

    public static string GetSmsPhoneNumberList()
    {
        return GetAppSetting("SmsPhoneNumberList");
    }
    #endregion

    #region  平台图片配置
    public static string GetLoginBg()
    {
        return GetAppSetting("LoginBg");
    }

    public static string GetWelcomeBg()
    {
        return GetAppSetting("WelcomeBg");
    }

    public static string GetTopBanner()
    {
        return GetAppSetting("TopBanner");
    }

    public static string GetIndexTopBanner()
    {
        return GetAppSetting("IndexTopBanner");
    }
    #endregion

    #region  文件目录配置
    /// <summary>
    /// 上传文件目录
    /// </summary>
    public static string UploadFileDir = GetAppSetting("UploadFileDir", "/upfiles");
    /// <summary>
    /// 图片文件目录
    /// </summary>
    public static string ImageDir = GetAppSetting("ImageDir", "/skin/default/images");
    /// <summary>
    /// CSS文件目录
    /// </summary>
    public static string CssDir = GetAppSetting("CssDir", "/skin/default/css");
    /// <summary>
    /// JS文件目录
    /// </summary>
    public static string JsDir = GetAppSetting("JsDir", "/js");
    #endregion

    #region  视频功能相关配置
    /// <summary>
    /// 是否显示设备报警事件信息
    /// </summary>
    public static bool ShowDeviceAlarmEvent = GetAppSetting("ShowDeviceAlarmEvent", 0) == 1;
    public static bool GetShowDeviceAlarmEvent()
    {
        return GetAppSetting("ShowDeviceAlarmEvent", 0) == 1;
    }

    /// <summary>
    /// 是否播放设备报警事件声音提示
    /// </summary>
    public static bool PlayDeviceAlarmSound = GetAppSetting("PlayDeviceAlarmSound", 0) == 1;
    public static bool GetPlayDeviceAlarmSound()
    {
        return GetAppSetting("PlayDeviceAlarmSound", 0) == 1;
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
            if (IsNumber(ConfigurationManager.AppSettings[strKey].ToString()))
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

    #region  验证是否是数字
    public static bool IsNumber(string strNumber)
    {
        string strPattern = @"^\-?(0+)?(\d+)(.\d+)?$";

        return new Regex(strPattern).IsMatch(strNumber);
    }
    #endregion

}
