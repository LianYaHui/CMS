<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_gpsTrack_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/sliderbar/sliderbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/progressbar/progressbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/timeselect/timeselect.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">
        var strLatLngConfig = '<%=Config.GetMapCenter()%>'.split(',');
        var mapConfig = {
            mapEngine: '<%=Config.GetMapEngine()%>',
            mapType: '<%=Config.GetMapType()%>',
            mapZoom: <%=Config.GetMapZoom()%>,
            mapCenter: {lat: strLatLngConfig[0], lng: strLatLngConfig[1]}
        };
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title">GPS轨迹回放</div>
                <div id="toolbar" style="float:right;"></div>
                <span style="display:none;">
                    <input type="text" id="txtUserUnitId" class="txt w30"  />
                    <input type="text" id="txtDevUnitId" class="txt w30"  />
                    <input type="text" id="txtDevId" value="" class="txt w30"  />
                    <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtAddNum" class="txt w30" />
                </span>
            </div>
            <div id="mainContent">
                <div id="mapCanvas"></div>
            </div>
        </div>
        <div id="bodyRightSwitch" class="switch-right" title="隐藏右栏菜单"></div>
        <div id="bodyRight">
            <div class="titlebar">
                <div class="title">搜索GPS记录</div>
                <div class="right-tools"></div>
            </div>
            <div class="box-panel" style="background:#dfe8f6">
                <div id="divSearchForm" style="border-bottom:solid 1px #99bbe8;">
                    <input type="hidden" id="txtMaxDate" value="<%=strMaxDate%>" />
                    <table cellpadding="0" cellspacing="0" class="tbform" style="margin:2px 0 0 5px;">
                        <tr>
                            <td class="w60">设备名称：</td>
                            <td>
                                <input type="text" id="txtDevName" value="" class="txt" style="width:215px;" readonly="readonly" />
                                <input type="hidden" id="txtDevCode" value="" class="txt w60" />
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="tbform" style="margin:0 0 0 5px;">
                        <tr>
                            <td class="w60">开始时间：</td>
                            <td class="w130"><input type="text" id="txtStartTime" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" /></td>
                            <td class="w40 text-right">类型：</td>
                            <td><select id="ddlManualType" class="select w50"></select></td>
                            <td rowspan="2" style="padding-left:8px;" ><a class="bigbtn" onclick="searchGpsTrack(this);"><span>搜索</span></a></td>
                        </tr>
                        <tr>
                            <td>结束时间：</td>
                            <td><input type="text" id="txtEndTime" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" /></td>
                            <td class="text-right">排序：</td>
                            <td><select id="ddlDesc" class="select w50"></select></td>
                        </tr>
                    </table>
                </div>
                <div id="divTrackForm" style="padding:0 5px 0;border-top:solid 1px #f8f8f8;"></div>
            </div>
            <div class="titlebar">
                <div class="title">GPS轨迹记录</div>
                <div class="tools"></div>
            </div>
            <div class="box-panel">
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader"></div>
                    <div id="listContent" class="list" style="background:#fff;"></div>
                </div>
                <div class="statusbar"><span id="pagination"></span></div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js"></script>
<%if(Config.GetMapEngine().Equals("gmap")){%>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/keydragzoom.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/gmap.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/gmap.marker.js"></script>
<%} else if(Config.GetMapEngine().Equals("bmap")){%>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=<%=Config.GetBaiDuMapKey()%>"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/RectangleZoom/1.2/src/RectangleZoom_min.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/bmap.js?<%=Public.NoCache()%>"></script>
<%}%>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gpsTrack/gpsTrack.js?<%=Public.NoCache()%>"></script>
</asp:Content>