using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Zyrh.Common;

/// <summary>
/// Token 的摘要说明
/// </summary>
public class Token
{
    protected static string strTokenPrefix = "ZYRHCMS_TOKEN_";
    public Token()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public static string GetToken()
    {
        return UCAuthCode.AuthCodeEncode(BuildHttpRequestToken(), BuildHttpRequestTotenKey());
    }

    public static bool CheckToken(string strToken)
    {
        try
        {
            string strContent = UCAuthCode.AuthCodeDecode(strToken.Replace(' ', '+'), BuildHttpRequestTotenKey());
            string strCurrentToken = BuildHttpRequestToken();
            if (strContent.Equals(strCurrentToken))
            {
                return true;
            }
            else
            {
                try
                {
                    string strYear = DateTime.Now.ToString("yyyy");
                    DateTime dt = DateTime.Parse(String.Format("{0}-{1}:00", strYear, strContent.Replace(strTokenPrefix, string.Empty)));
                    DateTime dtCur = DateTime.Parse(String.Format("{0}-{1}:00", strYear, strCurrentToken.Replace(strTokenPrefix, string.Empty)));
                    TimeSpan ts = dtCur - dt;
                    //Token 时间超过30分钟 则无效
                    return ts.TotalMinutes < 30;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }
        catch (Exception exx)
        {
            return false;
        }
    }

    private static string BuildHttpRequestToken()
    {
        return String.Format("{0}{1}", strTokenPrefix, DateTime.Now.ToString("MM-dd HH:mm"));
    }

    private static string BuildHttpRequestTotenKey()
    {
        return Encrypt.MD5Encrypt(strTokenPrefix);
    }

}