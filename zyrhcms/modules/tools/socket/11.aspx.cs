using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Net.Sockets;
using System.Net;
using System.IO;
using System.Threading;

public partial class modules_tools_socket_11 : System.Web.UI.Page
{

    #region  属性
    private string errorCode = "";
    /// <summary>
    /// 错误代码
    /// </summary>
    public string ErrorCode
    {
        get { return this.errorCode; }
        set { this.errorCode = value; }
    }
    private int status = 0;
    /// <summary>
    /// 状态
    /// </summary>
    public int Status
    {
        get { return this.status; }
        set { this.status = value; }
    }
    private string returnValue = "";
    /// <summary>
    /// 返回结果
    /// </summary>
    public string ReturnValue
    {
        get { return this.returnValue; }
        set { this.returnValue = value; }
    }

    private string gprsServerIp = string.Empty;
    /// <summary>
    /// 服务器IP
    /// </summary>
    public string GprsServerIp
    {
        get
        {
            return this.gprsServerIp;
        }
        set
        {
            this.gprsServerIp = value;
        }
    }
    private int gprsServerPort = 0;
    /// <summary>
    /// 服务器端口
    /// </summary>
    public int GprsServerPort
    {
        get
        {
            return this.gprsServerPort;
        }
        set
        {
            this.gprsServerPort = value;
        }
    }
    #endregion

    private TcpClient client;
    public TcpClient Client
    {
        get { return this.client; }
    }
    private BinaryReader br;
    private BinaryWriter bw;

    protected void Page_Load(object sender, EventArgs e)
    {

        this.GprsServerIp = "61.164.85.251";
        this.GprsServerPort = 8002;

        this.ConcectServer();
        this.SendMessageByByte("hello server");
    }


    #region  TCP/IP连接
    public void ConcectServer()
    {
        try
        {
            client = new TcpClient();
            client.Connect(IPAddress.Parse(this.gprsServerIp), this.gprsServerPort);

            NetworkStream networkStream = client.GetStream();
            br = new BinaryReader(networkStream);
            bw = new BinaryWriter(networkStream);
            this.status = 1;
        }
        catch (Exception ex)
        {
            this.status = 0;
            this.errorCode = ex.Message;
        }
    }
    #endregion

    #region  向服务端发送消息
    /// <summary>
    /// 向服务端发送消息
    /// </summary>
    /// <param name="strMessage"></param>
    public void SendMessageByByte(string strMessage)
    {
        try
        {
            byte[] buffer = Encoding.UTF8.GetBytes(strMessage);

            bw.Write(buffer);
            bw.Flush();
            this.status = 1;
        }
        catch (Exception ex)
        {
            this.status = 0;
            this.errorCode = ex.Message;
        }
    }

    /// <summary>
    /// 向服务端发送消息
    /// </summary>
    /// <param name="strMessage"></param>
    public void SendMessage(string strMessage)
    {
        try
        {
            bw.Write(strMessage);
            bw.Flush();
            this.status = 1;
        }
        catch (Exception ex)
        {
            this.status = 0;
            this.errorCode = ex.Message;
        }
        finally
        {
            this.client.Close();
        }
    }
    #endregion
}
