using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Xml;
using Zyrh.Model;

/// <summary>
/// WebProtocolSms 的摘要说明
/// </summary>
public class WebProtocolSms
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

    public WebProtocolSms()
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
    /// <param name="wp">WebSmsProtocol 对象</param>
    /// <returns></returns>
    public string BuildSmsProtocol(WebSmsProtocol wp)
    {
        try
        {
            StringBuilder strData = new StringBuilder();
            strData.Append(this.strXmlDeclare);
            strData.Append("\r\n<SmsSend>\r\n");
            strData.Append(String.Format("<Type>{0}</Type>\r\n<PhoneNumber>{1}</PhoneNumber>\r\n<Model>{2}</Model>\r\n",
                wp.Type, wp.PhoneNumber, wp.Model));
            strData.Append(String.Format("<DataType>{0}</DataType>\r\n<Response>{1}</Response>\r\n",
                wp.DataType, wp.Response));
            strData.Append("<Content>\r\n");
            foreach (SmsContent data in wp.SmsContentList)
            {
                strData.Append(String.Format("<Data Sequence=\"{0}\"><![CDATA[{1}]]></Data>\r\n", data.SerialNumber, data.Data));
            }
            strData.Append("</Content>\r\n");
            strData.Append(String.Format("<Parameter><![CDATA[{0}]]></Parameter>\r\n", wp.ProtocolParameter));
            strData.Append(String.Format("<Timeout>{0}</Timeout>\r\n<SendTime>{1}</SendTime>\r\n", wp.Timeout, wp.SendTime));
            strData.Append("</SmsSend>\r\n");
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
    public WebSmsProtocol ParseSmsProtocol(string strXmlData)
    {
        try
        {
            WebSmsProtocol wp = new WebSmsProtocol();

            //初始化一个xml实例
            XmlDocument xml = new XmlDocument();
            xml.LoadXml(strXmlData);

            //指定一个节点
            XmlNode root = xml.SelectSingleNode("SmsSend");
            XmlNodeList nodeList = root.ChildNodes;
            foreach (XmlNode xn in nodeList)
            {
                XmlElement xe = (XmlElement)xn; //转换类型
                if (xe.Name.Equals("Content"))
                {
                    XmlNodeList dataList = xn.ChildNodes;
                    List<SmsContent> lstData = new List<SmsContent>();
                    foreach (XmlNode xnData in dataList)
                    {
                        XmlElement xeData = (XmlElement)xnData;//转换类型

                        SmsContent pdata = new SmsContent();
                        pdata.SerialNumber = xeData.Attributes["Sequence"].Value;
                        pdata.Data = xeData.InnerText;

                        lstData.Add(pdata);
                    }
                    wp.SmsContentList = lstData;
                }
                else
                {
                    switch (xe.Name)
                    {
                        case "Type":
                            wp.Type = Convert.ToInt32(xe.InnerText);
                            break;
                        case "PhoneNumber":
                            wp.PhoneNumber = xe.InnerText;
                            break;
                        case "Model":
                            wp.Model = Convert.ToInt32(xe.InnerText);
                            break;
                        case "DataType":
                            wp.DataType = Convert.ToInt32(xe.InnerText);
                            break;
                        case "Response":
                            wp.Response = Convert.ToInt32(xe.InnerText);
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
    public List<WebSmsProtocol> ParseMultiSmsProtocol(string strXmlData)
    {
        try
        {
            List<WebSmsProtocol> lstProtocol = new List<WebSmsProtocol>();
            string[] strDelimiter = { this.strXmlDeclare };
            string[] arrXml = strXmlData.Split(strDelimiter, StringSplitOptions.RemoveEmptyEntries);
            foreach (string strXml in arrXml)
            {
                if (strXml.Equals(string.Empty)) continue;
                WebSmsProtocol wp = this.ParseSmsProtocol(strXml);
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
