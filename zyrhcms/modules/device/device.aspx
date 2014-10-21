<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="device.aspx.cs" Inherits="modules_device_device" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <style type="text/css">
        body{background:#fff;}
        .win-table{border-collapse:collapse; }
        .win-table td{border:solid 1px #ddd; padding:0 3px;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyContent">
        <table cellpadding="0" cellspacing="0" class="win-table" style="width:100%;">
            <tr>
                <td class="w90">组织机构：</td>
                <td colspan="3">
                    <%=this.GetControlUnitTree(di.ParentTree)%>
                </td>
            </tr>
            <tr>
                <td class="w90">设备编号：</td>
                <td class="w135">
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
                    <%=di.devStatus.StatusType2G == 1 ? "." : ""%>
                </td>
                <td>3G状态时间：</td>
                <td>
                    <%=Public.ConvertDateTime(di.devStatus.StatusTime3G, "-")%>
                    <%=di.devStatus.StatusType3G == 1 ? "." : ""%>
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
                    <span style="<%=di.devStatus.GpsAddType == 1?"color:#00f;":"" %>"><%=strLatLng%></span>
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
                    <input class="txt-label" id="txtGprsProtocol" readonly="readonly" style="width:98%;" value="<%=di.devStatus.GprsProtocol%>" />
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
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
    if(!module.isDebug){
        $('#lblGprsProtocol').html('');
        $('#txtGprsProtocol').attr('value','');
    }
</script></asp:Content>