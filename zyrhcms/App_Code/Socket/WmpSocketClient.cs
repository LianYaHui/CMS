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
using System.IO;
using System.Xml;
using System.Net;
using System.Net.Sockets;
using System.Configuration;

/// <summary>
/// WmpSocketClient 的摘要说明
/// </summary>
public class WmpSocketClient : Page
{
    public WmpSocketClient()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public static System.Net.Sockets.TcpClient tcpClient = new System.Net.Sockets.TcpClient();
    public static System.Net.Sockets.NetworkStream streamToClient;
    public static BinaryReader bReader;
    public static BinaryWriter bWriter;

    public static readonly int BufferSize = 1024 * 4;
    public static byte[] bufferReceive;

    public static string strServerIp = string.Empty;
    public static int iServerPort = 0;
    public static int iHeartbeatInterval = Config.GetAppSetting("SocketHeartbeatInterval", 30);

    private static string ConvertServerIp(string strServerIp)
    {
        return strServerIp;
    }

    #region  连接服务器
    public static bool ConnectServer()
    {
        try
        {
            return ConnectServer(WmpSocketClient.strServerIp, WmpSocketClient.iServerPort, false);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }

    public static bool ConnectServer(bool isConnect)
    {
        try
        {
            return ConnectServer(WmpSocketClient.strServerIp, WmpSocketClient.iServerPort, isConnect);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    public static bool ConnectServer(string strServerIp, int iServerPort)
    {
        try
        {
            return ConnectServer(strServerIp, iServerPort, false);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }

    public static bool ConnectServer(string strServerIp, int iServerPort, bool isConnect)
    {
        try
        {
            if (!tcpClient.Connected || isConnect)
            {
                tcpClient = new System.Net.Sockets.TcpClient();
                tcpClient.Connect(IPAddress.Parse(ConvertServerIp(strServerIp)), iServerPort);
                streamToClient = tcpClient.GetStream();
            }
            return tcpClient.Connected;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  读取回复
    public static string ReadReturnData(int bufferSize)
    {
        try
        {
            bufferReceive = new byte[bufferSize];
            //设置读取超时的时间，单位：毫秒
            WmpSocketClient.streamToClient.ReadTimeout = 2000;
            while (true)
            {
                //返回接收的数据的字节
                int bytRead = WmpSocketClient.streamToClient.Read(bufferReceive, 0, bufferSize);
                if (bytRead > 0)
                {
                    //有返回数据表示连接成功
                    break;
                }
            }
            string strReturn = System.Text.Encoding.UTF8.GetString(bufferReceive).TrimEnd('\0');

            Array.Clear(bufferReceive, 0, bufferReceive.Length); //清空缓存

            return strReturn;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  检测连接是否存在
    public static bool CheckServerConnected()
    {
        return tcpClient.Connected;
    }
    #endregion

    #region  发送协议内容
    public static bool SendProtocol(string strData)
    {
        try
        {
            byte[] bytData = System.Text.Encoding.GetEncoding("gb2312").GetBytes(strData);
            return SendProtocol(bytData);
        }
        catch (Exception ex) { throw (ex); }
    }

    public static bool SendProtocol(string strData, System.Text.Encoding encoding)
    {
        try
        {
            byte[] bytData = encoding.GetBytes(strData);
            return SendProtocol(bytData);
        }
        catch (Exception ex) { throw (ex); }
    }

    public static bool SendProtocol(byte[] bytData)
    {
        bool isSend = false;
        int num = 0;
        for (int i = 0; i < 3; i++)
        {
            if (isSend)
            {
                break;
            }
            try
            {
                ConnectServer(num > 0);

                WmpSocketClient.streamToClient.Write(bytData, 0, bytData.Length);

                string strRead = ReadReturnData(BufferSize);
                isSend = strRead.Length > 0;

                ServerLog.WriteDebugLog(HttpContext.Current.Request, "RemoteResponse", strRead);
            }
            catch (Exception ex)
            {
                ServerLog.WriteDebugLog(HttpContext.Current.Request, "RemoteSettingSend", "第" + (++num) + "次指令发送失败");
                ServerLog.WriteErrorLog(ex, HttpContext.Current);
            }
        }
        return isSend;
    }
    #endregion

}