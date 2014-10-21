using System;
using System.Data;
using System.Collections;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using wmp;

/// <summary>
/// WmpRedis 的摘要说明
/// </summary>
public class WmpRedis
{
    public WmpRedis()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  连接Redis服务器
    public static WmpCache ConnectRedis()
    {
        try
        {
            return new WmpCache(Config.GetRedisServerIp(), Config.GetRedisServerPort());
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    public static WmpCache ConnectRedis(string strServerIp, int serverPort)
    {
        try
        {
            return new WmpCache(strServerIp, serverPort);
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    #endregion

    #region  获得CAG服务器信息
    public static WmpServerInfo GetCagServer(WmpCache wc, int lineIndex)
    {
        try
        {
            return GetCagServer(wc, lineIndex, 1);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public static WmpServerInfo GetCagServer(WmpCache wc, int lineIndex, int num)
    {
        try
        {
            WmpServerInfo info = null;

            if (null == wc)
            {
                return info;
            }

            wmp.ServerInfo[] cag = wc.QueryServers(ServerType.ST_CAG, (uint)num);
            if (cag.Length > 0)
            {
                info = ParseServerInfo(wmp.ServerType.ST_CAG, cag[0], lineIndex);
            }

            return info;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    #endregion

    #region  获得当前所有在线的设备编号
    public static ArrayList GetOnlineDeviceList(WmpCache wc)
    {
        ArrayList arrDev = new ArrayList();
        try
        {
            if (null == wc)
            {
                return arrDev;
            }

            string[] arr = wc.EnumDeviceRegisterInfo();
            foreach (string str in arr)
            {
                if (!str.Equals(string.Empty))
                {
                    arrDev.Add(str);
                }
            }

            return arrDev;
        }
        catch (Exception ex)
        {
            return arrDev;
        }
    }

    public static string GetOnlineDeviceList(WmpCache wc, char delimiter)
    {
        try
        {
            if (null == wc)
            {
                return string.Empty;
            }

            if (delimiter.ToString().Equals(string.Empty))
            {
                delimiter = ',';
            }

            StringBuilder strDev = new StringBuilder();

            ArrayList arrDev = new ArrayList();
            
            string[] arr = wc.EnumDeviceRegisterInfo();
            foreach (string str in arr)
            {
                if (!str.Equals(string.Empty))
                {
                    strDev.Append(delimiter);
                    strDev.Append(str);
                }
            }

            return strDev.Length > 0 ? strDev.ToString().Substring(1) : string.Empty;
        }
        catch (Exception ex)
        {
            return string.Empty;
        }
    }
    #endregion

    #region  获得设备信息
    public static WmpDeviceInfo GetDeviceInfo(WmpCache wc, string strDevIndexCode)
    {
        try
        {
            if (null == wc)
            {
                return null;
            }

            WmpDeviceInfo info = null;

            wmp.dag.DeviceRegisterInfo dev = wc.GetDeviceRegisterInfo(strDevIndexCode);
            if (dev != null)
            {
                info = new WmpDeviceInfo();
                info.DeviceIndexCode = dev.DeviceId;
                info.DeviceType = dev.DevType;
                info.DagServerIndexCode = dev.DagIndex;
                info.DagServerType = dev.DagType;
                info.Ip = dev.Ip;
                info.Port = dev.Port;
                info.Pwd = dev.Pwd;
                info.Timestamp = (long)dev.Timestamp;
                info.FirmwareVersion = dev.FirmwareVersion;
            }

            return info;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    #endregion

    #region  获得单个服务器信息
    public static WmpServerInfo GetServer(WmpCache wc, string strIndexCode, wmp.ServerType serverType, int lineIndex)
    {
        try
        {
            if (null == wc)
            {
                return null;
            }
            WmpServerInfo info = null;

            wmp.ServerInfo si = wc.GetServer(strIndexCode, serverType);
            if (si != null)
            {
                info = ParseServerInfo(serverType, si, lineIndex);
            }
            return info;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    #endregion

    #region  解析服务器信息
    public static WmpServerInfo ParseServerInfo(wmp.ServerType serverType, wmp.ServerInfo si, int lineIndex)
    {
        try
        {
            WmpServerInfo info = null;
            if (si.LineListCount > lineIndex)
            {
                info = new WmpServerInfo();

                switch (serverType)
                {
                    case ServerType.ST_CAG:
                        wmp.lbs.CagServer.Builder cs = wmp.lbs.CagServer.CreateBuilder();
                        cs.MergeFrom(si.LineListList[lineIndex]);

                        info = new WmpServerInfo();
                        info.Ip = cs.Ip;
                        info.TcpPort = cs.TcpPort;
                        info.UdpPort = cs.UdpPort;
                        info.ServerIndexCode = si.ServerIndex;
                        info.ServerType = si.ServerType;
                        break;
                    case ServerType.ST_DAG:
                    case ServerType.ST_DAG_EHOME:
                        wmp.lbs.DagServer.Builder ds = wmp.lbs.DagServer.CreateBuilder();
                        ds.MergeFrom(si.LineListList[lineIndex]);

                        info = new WmpServerInfo();
                        info.Ip = ds.Ip;
                        info.Port = ds.Port;
                        info.DevicePort = ds.DevicePort;
                        info.UdpPort = ds.UdpPort;
                        info.ServerIndexCode = si.ServerIndex;
                        info.ServerType = si.ServerType;
                        break;
                }
            }
            return info;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    #endregion

}

#region 服务器信息
public class WmpServerInfo
{
    private string server_index = string.Empty;
    public string ServerIndexCode
    {
        get { return this.server_index; }
        set { this.server_index = value; }
    }

    private string group_index = string.Empty;
    public string GroupIndexCode
    {
        get { return this.group_index; }
        set { this.group_index = value; }
    }

    private wmp.ServerType server_type = ServerType.ST_UNKNOWN;
    public wmp.ServerType ServerType
    {
        get { return this.server_type; }
        set { this.server_type = value; }
    }

    private int loading = 0;
    public int Loading
    {
        get { return this.loading; }
        set { this.loading = value; }
    }

    private string ip = string.Empty;
    public string Ip
    {
        get { return this.ip; }
        set { this.ip = value; }
    }

    private int port = 0;
    public int Port
    {
        get { return this.port; }
        set { this.port = value; }
    }

    private int tcp_port = 0;
    public int TcpPort
    {
        get { return this.tcp_port; }
        set { this.tcp_port = value; }
    }

    private int udp_port = 0;
    public int UdpPort
    {
        get { return this.udp_port; }
        set { this.udp_port = value; }
    }

    private int device_port = 0;
    public int DevicePort
    {
        get { return this.device_port; }
        set { this.device_port = value; }
    }

    private int cmd_port = 0;
    public int CmdPort
    {
        get { return this.cmd_port; }
        set { this.cmd_port = value; }
    }

    private int stream_port = 0;
    public int StreamPort
    {
        get { return this.stream_port; }
        set { this.stream_port = value; }
    }

    private int webservice_port = 0;
    public int WebServicePort
    {
        get { return this.webservice_port; }
        set { this.webservice_port = value; }
    }

}
#endregion

#region  设备信息
public class WmpDeviceInfo
{
    private string device_indexcode = string.Empty;
    public string DeviceIndexCode
    {
        get { return this.device_indexcode; }
        set { this.device_indexcode = value; }
    }

    private wmp.DeviceType device_type = wmp.DeviceType.DEV_HIK_EHOME;
    public wmp.DeviceType DeviceType
    {
        get { return this.device_type; }
        set { this.device_type = value; }
    }

    private string ip = string.Empty;
    public string Ip
    {
        get { return this.ip; }
        set { this.ip = value; }
    }

    private int port = 0;
    public int Port
    {
        get { return this.port; }
        set { this.port = value; }
    }

    private string pwd = string.Empty;
    public string Pwd
    {
        get { return this.pwd; }
        set { this.pwd = value; }
    }

    private string firmware_version = string.Empty;
    public string FirmwareVersion
    {
        get { return this.firmware_version; }
        set { this.firmware_version = value; }
    }

    private long timestamp = 0;
    public long Timestamp
    {
        get { return this.timestamp; }
        set { this.timestamp = value; }
    }

    private string dag_indexcode = string.Empty;
    public string DagServerIndexCode
    {
        get { return this.dag_indexcode; }
        set { this.dag_indexcode = value; }
    }

    private wmp.ServerType dag_type = ServerType.ST_UNKNOWN;
    public wmp.ServerType DagServerType
    {
        get { return this.dag_type; }
        set { this.dag_type = value; }
    }

}
#endregion