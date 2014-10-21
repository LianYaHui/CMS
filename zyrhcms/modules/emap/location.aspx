<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="location.aspx.cs" Inherits="modules_emap_location" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">
        var strCallBack = '<%=strCallBack%>';
        var strLatLng = '<%=strLatLng%>';
        var strTitle = '<%=strTitle%>';
        
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
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title" style="float:left;">
                    <span>经纬度：</span><label id="lblLatLng" style="float:left;"><%=strLatLng%></label>
                </div>
                <div id="toolbar" style="float:right;text-align:right;"></div>
            </div>
            <div id="mainContent" style="position:relative;">
                <div id="mapCanvas"></div>
                <div class="statusbar statusbar-h30" style="text-align:center;">
                    <a class="btn btnc24" onclick="setLocation(true);"><span class="w50">确定</span></a>
                    <a class="btn btnc24" onclick="setLocation(false);"><span class="w50">取消</span></a>
                    <%if(!strLatLng.Equals(string.Empty)){%>
                    <a class="btn btnc24" onclick="resetLocation();"><span class="w50">还原</span></a>
                    <%}%>
                    <input id="txtLatLng" type="hidden" value="<%=strLatLng%>" />
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
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
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/location.js?<%=Public.NoCache()%>"></script>
</asp:Content>