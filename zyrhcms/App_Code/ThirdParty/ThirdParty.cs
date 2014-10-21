using System;
using System.Data;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;
using System.Text;
using Zyrh.BLL;

/// <summary>
/// ThirdParty 的摘要说明
/// </summary>
public class ThirdParty:Page
{
    protected XmlNodeList nodeList;

    public ThirdParty()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  获得配置信息
    public List<PageUrlInfo> GetPageUrlList()
    {
        List<PageUrlInfo> lstPage = new List<PageUrlInfo>();
        try
        {
            string strXmlFile = Server.MapPath(Public.WebDir + "/config/baseinfo.xml");
            XmlNodeList nodeList = ConfigManage.GetConfigInfoNodeList(strXmlFile, "config");

            foreach (XmlNode xn in nodeList)
            {
                PageUrlInfo page = new PageUrlInfo();
                page.PageName = xn.Name;
                page.PageUrl = xn.InnerText;

                lstPage.Add(page);
            }
        }
        catch (Exception ex) { }

        return lstPage;
    }

    public string GetPageUrlInfo()
    {
        StringBuilder strPage = new StringBuilder();
        try
        {
            string strXmlFile = Server.MapPath(Public.WebDir + "/config/baseinfo.xml");
            XmlNodeList nodeList = ConfigManage.GetConfigInfoNodeList(strXmlFile, "config");
            int n = 0;
            strPage.Append(String.Format("\r\n    var thirdPartyCmsUrl = '{0}';", Public.GetAppSetting("ThirdPartyCmsUrl")));

            strPage.Append("\r\n    var thirdPartyPage = {");
            foreach (XmlNode xn in nodeList)
            {
                strPage.Append(n++ > 0 ? ",\r\n        " : "\r\n        ");
                if (xn.InnerText.IndexOf("http://") >= 0)
                {
                    strPage.Append(String.Format("{0}:'{1}'", xn.Name, xn.InnerText));
                }
                else
                {
                    strPage.Append(String.Format("{0}:'{1}'", xn.Name, Public.GetAppSetting(Public.IsInLAN() ? "BaseInfoWebHostInLAN" : "BaseInfoWebHost") + xn.InnerText));
                }
            }
            strPage.Append("\r\n    };\r\n");
        }
        catch (Exception ex) { }

        return strPage.ToString();
    }
    #endregion

}

public class PageUrlInfo
{
    private string strName = string.Empty;
    public string PageName
    {
        get { return this.strName; }
        set { this.strName = value; }
    }
    private string strUrl = string.Empty;
    public string PageUrl
    {
        get { return this.strUrl; }
        set { this.strUrl = value; }
    }
}