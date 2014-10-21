using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Xml;
using Zyrh.Model;

/// <summary>
/// WebProtocolGprs 的摘要说明
/// </summary>
public class WebProtocolGprs
{

    #region  变量、属性
    /// <summary>
    /// XML文档声明
    /// </summary>
    protected string strXmlDeclare = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    /// <summary>
    /// XML文档声明
    /// </summary>
    public string XmlDeclare
    {
        get { return this.strXmlDeclare; }
    }
    #endregion

    public WebProtocolGprs()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  XML特殊字符转义
    /// <summary>
    /// XML特殊字符转义 &'"<>
    /// </summary>
    /// <param name="strProtocol"></param>
    /// <returns></returns>
    public string XmlCharacterEscape(string strProtocol)
    {
        return strProtocol.Replace("&", "&amp;").Replace("'", "&apos;").Replace("\"", "&quot;").Replace("<", "&lt;").Replace(">", "&gt;");
    }
    #endregion

    #region  创建协议内容
    /// <summary>
    /// 创建协议内容
    /// </summary>
    /// <param name="wp">WebProtocol 对象</param>
    /// <returns></returns>
    public string BuildProtocol(WebProtocol wp)
    {
        try
        {
            StringBuilder strData = new StringBuilder();
            strData.Append(this.strXmlDeclare);
            strData.Append("\r\n<Settings>\r\n");
            strData.Append(String.Format("<Type>{0}</Type>\r\n<DevCode>{1}</DevCode>\r\n<Model>{2}</Model>\r\n", wp.Type, wp.DevCode, wp.Model));
            strData.Append("<Protocol>\r\n");
            foreach (ProtocolData data in wp.ProtocolDataList)
            {
                strData.Append(String.Format("<Data Sequence=\"{0}\"><![CDATA[{1}]]></Data>\r\n", data.SerialNumber, data.Data));
            }
            strData.Append("</Protocol>\r\n");
            strData.Append(String.Format("<Parameter><![CDATA[{0}]]></Parameter>\r\n", wp.ProtocolParameter));
            strData.Append(String.Format("<Timeout>{0}</Timeout>\r\n<SendTime>{1}</SendTime>\r\n", wp.Timeout, wp.SendTime));
            strData.Append("</Settings>\r\n");
            return strData.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  解析协议内容
    /// <summary>
    /// 解析协议内容
    /// </summary>
    /// <param name="strXmlData">XML文档数据</param>
    /// <returns></returns>
    public WebProtocol ParseProtocol(string strXmlData)
    {
        try
        {
            WebProtocol wp = new WebProtocol();

            //初始化一个xml实例
            XmlDocument xml = new XmlDocument();
            xml.LoadXml(strXmlData);

            //指定一个节点
            XmlNode root = xml.SelectSingleNode("Settings");
            XmlNodeList nodeList = root.ChildNodes;
            foreach (XmlNode xn in nodeList)
            {
                XmlElement xe = (XmlElement)xn; //转换类型
                if (xe.Name.Equals("Protocol"))
                {
                    XmlNodeList dataList = xn.ChildNodes;
                    List<ProtocolData> lstData = new List<ProtocolData>();
                    foreach (XmlNode xnData in dataList)
                    {
                        XmlElement xeData = (XmlElement)xnData;//转换类型

                        ProtocolData pdata = new ProtocolData();
                        pdata.SerialNumber = xeData.Attributes["Sequence"].Value;
                        pdata.Data = xeData.InnerText;

                        lstData.Add(pdata);
                    }
                    wp.ProtocolDataList = lstData;
                }
                else
                {
                    switch (xe.Name)
                    {
                        case "Type":
                            wp.Type = Convert.ToInt32(xe.InnerText);
                            break;
                        case "DevCode":
                            wp.DevCode = xe.InnerText;
                            break;
                        case "Model":
                            wp.Model = Convert.ToInt32(xe.InnerText);
                            break;
                        case "Timeout":
                            wp.Timeout = Convert.ToInt32(xe.InnerText);
                            break;
                        case "SendTime":
                            wp.SendTime = xe.InnerText;
                            break;
                        case "Parameter":
                            wp.ProtocolParameter = xe.InnerText;
                            break;
                    }
                }
            }
            return wp;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  解析多个协议内容
    /// <summary>
    /// 解析多个协议内容
    /// </summary>
    /// <param name="strXmlData">XML文档数据</param>
    /// <returns></returns>
    public List<WebProtocol> ParseMultiProtocol(string strXmlData)
    {
        try
        {
            List<WebProtocol> lstProtocol = new List<WebProtocol>();
            string[] strDelimiter = { this.strXmlDeclare };
            string[] arrXml = strXmlData.Split(strDelimiter, StringSplitOptions.RemoveEmptyEntries);
            foreach (string strXml in arrXml)
            {
                if (strXml.Equals(string.Empty)) continue;
                WebProtocol wp = this.ParseProtocol(strXml);
                lstProtocol.Add(wp);
            }
            return lstProtocol;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

}
