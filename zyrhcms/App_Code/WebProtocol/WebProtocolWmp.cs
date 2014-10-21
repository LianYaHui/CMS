using System;
using System.Collections.Generic;
using System.Text;
using Zyrh.Model;
using System.IO;
using System.Xml;
using System.Net;

/// <summary>
/// WebProtocolWmp 的摘要说明
/// </summary>
public class WebProtocolWmp
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

    protected int protocolHeaderLength = 24;
    /// <summary>
    /// 协议头部内容长度
    /// </summary>
    public int ProtocolHeaderLength
    {
        get { return this.protocolHeaderLength; }
        set { this.protocolHeaderLength = value; }
    }

    protected int protocolVersion = 0x00010000;
    /// <summary>
    /// 协议版本
    /// </summary>
    public int ProtocolVersion
    {
        get { return this.protocolVersion; }
        set { this.protocolVersion = value; }
    }
    #endregion

    public WebProtocolWmp()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }
    
    public WebProtocolWmp(int protocolHeaderLength)
    {
        this.protocolHeaderLength = protocolHeaderLength;
    }

    #region  创建协议头部
    public byte[] CreateProtocolHeader(int logId, int conLength, int cmdId, int result)
    {
        byte[] arrHeader = new byte[this.ProtocolHeaderLength];
        int n = 0;
        int c = 4;
        byte[] arr = this.StringConvertByte("WMPP");
        Array.Copy(arr, 0, arrHeader, n, c);
        n += c;

        arr = this.StringConvertByte(logId);
        Array.Copy(arr, 0, arrHeader, n, c);
        n += c;

        arr = this.StringConvertByte(this.ProtocolVersion);
        Array.Copy(arr, 0, arrHeader, n, c);
        n += c;

        arr = this.StringConvertByte(conLength);
        Array.Copy(arr, 0, arrHeader, n, c);
        n += c;

        arr = this.StringConvertByte(cmdId);
        Array.Copy(arr, 0, arrHeader, n, c);
        n += c;

        arr = this.StringConvertByte(result);
        Array.Copy(arr, 0, arrHeader, n, c);
        n += c;

        return arrHeader;
    }
    #endregion

    #region  创建协议尾部
    public byte[] CreateProtocolFooter(byte[] arrCon)
    {
        System.Security.Cryptography.MD5CryptoServiceProvider md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
        byte[] arrFooter = md5.ComputeHash(arrCon);

        return arrFooter;
    }
    #endregion

    #region  创建完整协议内容
    public byte[] CreateProtocolContent(byte[] arrHeader, byte[] arrCon, byte[] arrFooter)
    {
        byte[] arrProtocol = new byte[arrCon.Length + arrHeader.Length + arrFooter.Length];
        int n = 0;
        int c = arrHeader.Length;
        Array.Copy(arrHeader, 0, arrProtocol, n, c);
        n += c;

        c = arrCon.Length;
        Array.Copy(arrCon, 0, arrProtocol, n, c);
        n += c;

        c = arrFooter.Length;
        Array.Copy(arrFooter, 0, arrProtocol, n, c);
        n += c;

        return arrProtocol;
    }
    #endregion

    public byte[] CopyArray(byte[] arrSource, int len, byte[] arrDestination, int idx)
    {
        Array.Copy(arrSource, 0, arrDestination, idx, len);
        return arrDestination;
    }

    public byte[] StringConvertByte(string strCon)
    {
        return System.Text.Encoding.UTF8.GetBytes(strCon.ToString());
    }

    public byte[] StringConvertByte(int num)
    {
        return BitConverter.GetBytes(IPAddress.HostToNetworkOrder(num));
    }

}
