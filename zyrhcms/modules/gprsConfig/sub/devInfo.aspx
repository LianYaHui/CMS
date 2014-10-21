<%@ Page Language="C#" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="Zyrh.Model" %>
<%@ Import Namespace="Zyrh.Model.Device" %>
<%@ Import Namespace="Zyrh.Model.Server" %>
<%@ Import Namespace="Zyrh.BLL" %>
<%@ Import Namespace="Zyrh.BLL.Device" %>
<%@ Import Namespace="Zyrh.BLL.Server" %>
<script runat="server">
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceInfo di = new DeviceInfo();
    protected string devCode = string.Empty;
    protected string strLatLng = string.Empty;
    
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.devCode = Public.RequestString("devCode", string.Empty);
            this.GetDeviceInfo(this.devCode);
        }
    }

    #region  获得设备配置信息
    protected void GetDeviceInfo(string devCode)
    {
        try
        {
            DBResultInfo dbResult = dm.GetDeviceInfo(devCode);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                this.di = dm.FillDeviceInfo(ds.Tables[0].Rows[0]);
                if (di.devStatus.Latitude.Equals(string.Empty) || di.devStatus.Latitude.Equals("0"))
                {
                    this.strLatLng = "-";
                }
                else
                {
                    this.strLatLng = di.devStatus.Latitude + "," + di.devStatus.Longitude;
                }

                ServerManage sm = new ServerManage(Public.CmsDBConnectionString);
                DBResultInfo dbServer = sm.GetServerInfo(this.di.DagServerId);
                DataSet dsServer = dbServer.dsResult;

                if (dsServer != null && dsServer.Tables[0] != null && dsServer.Tables[0].Rows.Count > 0)
                {
                    ServerInfo dag = sm.FillServerInfo(dsServer.Tables[0].Rows[0]);
                    this.di.DagServer = dag;
                }

                dbServer = sm.GetServerInfo(this.di.CssServerId);
                dsServer = dbServer.dsResult;

                if (dsServer != null && dsServer.Tables[0] != null && dsServer.Tables[0].Rows.Count > 0)
                {
                    ServerInfo css = sm.FillServerInfo(dsServer.Tables[0].Rows[0]);
                    this.di.CssServer = css;
                }
            }
        }
        catch (Exception ex) { ServerLog.WriteErrorLog(ex, HttpContext.Current); }
    }
    #endregion

    #region  获得组织机构树
    public string GetControlUnitTree(string strParentTree)
    {
        try
        {
            ControlUnitManage cum = new ControlUnitManage(Public.CmsDBConnectionString);
            if (!strParentTree.Equals(string.Empty))
            {
                StringBuilder strResult = new StringBuilder();
                strParentTree = strParentTree.Replace(")(", ",").Replace("(", "").Replace(")", "");
                DataSet ds = cum.GetControlUnitParentList(strParentTree);
                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    int n = 0;
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        ControlUnitInfo cui = cum.FillControlUnit(dr);
                        strResult.Append(n++ > 0 ? "&nbsp;>&nbsp;" : "");
                        strResult.Append(cui.UnitName);
                    }
                }
                return strResult.ToString();
            }
            else
            {
                return string.Empty;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return ex.Message;
        }
    }
    #endregion
</script>
<!DOCTYPE html>
<html>
<head>
    <title>设备信息</title>
    <style type="text/css">
        .win-table{border-collapse:collapse; margin:0;}
        .win-table td{border:solid 1px #ddd; padding:0 3px; height:25px;}
    </style>
</head>
<body>
    <div class="formbody" style="padding:1px;">
        <table cellpadding="0" cellspacing="0" class="win-table" style="width:100%;">
            <tr>
                <td class="w90">组织机构：</td>
                <td colspan="3">
                    <%=this.GetControlUnitTree(di.ParentTree)%>
                </td>
            </tr>
            <tr>
                <td class="w90">设备编号：</td>
                <td class="w150">
                    <%=di.DevCode%>
                </td>
                <td class="w90">设备名称：</td>
                <td>
                    <%=di.DevName%>
                </td>
            </tr>
            <tr>
                <td>设备类型：</td>
                <td>
                    <%=di.TypeName%>
                </td>
                <td>通道数量：</td>
                <td>
                    <%=di.CameraChannelCount%>
                </td>
            </tr>
            <tr>
                <td>2G号码：</td>
                <td>
                    <%=di.devConfig.PhoneNumber2G.Equals(string.Empty) ? "-" : di.devConfig.PhoneNumber2G%>
                </td>
                <td>3G号码：</td>
                <td>
                    <%=di.devConfig.PhoneNumber3G.Equals(string.Empty) ? "-" : di.devConfig.PhoneNumber3G%>
                </td>
            </tr>
            <tr>
                <td>设备IP端口：</td>
                <td>
                    <%=di.NetworkAddr.Equals(string.Empty) ? "-" : di.NetworkAddr%><%=di.NetworkPort == 0 ? "" : ":" + di.NetworkPort.ToString()%>
                </td>
                <td></td>
                <td>
                    
                </td>
            </tr>
            <tr>
                <td>2G心跳时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.HeartbeatTime2G, "-")%>
                </td>
                <td>3G心跳时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.HeartbeatTime3G, "-")%>
                </td>
            </tr>
            <tr>
                <td>2G在线状态：</td>
                <td>
                    <%if(di.NetworkMode.IndexOf('2') >= 0){%>
                    <%=di.devStatus.Status2G == 1 ? "在线" : "<span style=\"color:#f00;\">离线</span>"%>
                    <%}else{%>-<%}%>
                </td>
                <td>3G在线状态：</td>
                <td>
                    <%if(di.NetworkMode.IndexOf('3') >= 0 || di.NetworkMode.IndexOf('4')>=0){%>
                    <%=di.devStatus.Status3G == 1 ? "在线" : "<span style=\"color:#f00;\">离线</span>"%>
                    <%}else{%>-<%}%>
                </td>
            </tr>
            <tr>
                <td>2G状态时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.StatusTime2G, "-")%>
                </td>
                <td>3G状态时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.StatusTime3G, "-")%>
                </td>
            </tr>
            <%if(di.NetworkMode.IndexOf('3') >= 0 || di.NetworkMode.IndexOf('4')>=0){%>
            <tr>
                <td>视频服务器：</td>
                <td>
                    <%=di.DagServer.ServerIp.Equals(string.Empty) ? "-" : di.DagServer.ServerIp + ":" + di.DagServer.ServerPort%>
                </td>
                <td>存储服务器：</td>
                <td>
                    <%=di.CssServer.ServerIp.Equals(string.Empty) ? "-" : di.CssServer.ServerIp + ":" + di.CssServer.ServerPort%>
                </td>
            </tr>
            <%}%>
            <tr>
                <td>GPS记录时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.LastGpsTime, "-")%>
                </td>
                <td>GPS经纬度：</td>
                <td>
                    <%=strLatLng%>
                </td>
            </tr>
            <%if(di.NetworkMode.IndexOf('2') >= 0){%>
            <tr>
                <td>GPRS记录时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.LastGprsTime, "-")%>
                </td>
                <td><span id="lblGprsProtocol">GPRS报文数据：</span></td>
                <td style="padding:0 3px;">
                    <input class="txt-label" id="txtGprsProtocol" readonly="readonly" style="width:98%;" title="<%=di.devStatus.GprsProtocol%>" value="<%=di.devStatus.GprsProtocol%>" />
                </td>
            </tr>
            <%}%>
            <tr>
                <td style="vertical-align:top;">
                    备注信息：</td>
                <td style="vertical-align:top;" colspan="3">
                    <%=di.devConfig.DeviceRemark%>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    if(!module.isDebug){
        $('#lblGprsProtocol').html('');
        $('#txtGprsProtocol').attr('value','');
    }
</script>