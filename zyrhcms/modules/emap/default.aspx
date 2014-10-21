<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_emap_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
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
            <div id="leftForm"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title" style="float:left;">
                    <div id="tabpanel" class="tabpanel" style="float:left;width:200px; background:none;"></div>
                </div>
                <div id="toolbar" style="float:right;text-align:right;"></div>
            </div>
            <div id="mainContent" style="position:relative;">
                <div id="mapCanvas"></div>
                <div id="listbox"></div>
            </div>
        </div>
        <!--
        <div id="bodyRightSwitch" class="switch-right" title="隐藏右栏菜单"></div>
        <div id="bodyRight"></div>
        -->
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/emap.js"></script>
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
</asp:Content>