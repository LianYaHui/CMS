<%@ Page Language="C#" MasterPageFile="~/master/mpPlan.master" AutoEventWireup="true" CodeFile="default_tp.aspx.cs" Inherits="modules_safety_default_tp" %>
<%@ MasterType VirtualPath="~/master/mpPlan.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/plan.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dropdownlist/dropdownlist.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <%if(isInLAN){%><script type="text/javascript">var strImgPathDir = '<%=strImgPathDir%>'; var strToday = '<%=DateTime.Now.ToString("yyyy-MM-dd")%>';</script><%}%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft" style="background:#e0f1fb url(<%=Public.WebDir%>/skin/default/images/safety/home/left.jpg) no-repeat center bottom;">
            <img src="<%=Public.WebDir%>/skin/default/images/safety/home/left_logo.png" alt="" style="border:none;" />
        <!--
            <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="100%" height="100%">
                <param name="movie" value="<%=Public.WebDir%>/skin/default/images/safety/home/left.swf" />
                <param name="wmode" value="transparent" />
                <embed src="<%=Public.WebDir%>/skin/default/images/safety/home/left.swf" width="100%" height="100%" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>
            </object>
            -->
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <!--
            <div id="mainTitle" class="titlebar">
                <div class="title">电子地图</div>
            </div>
            -->
            <div id="mainContent" style="position:relative;">
                <div id="toolbar" class="emap-toolbar">
                    <div id="tabpanel" class="tabpanel" style="float:left;"></div>
                    <%if(isInLAN){%>
                    <div style="float:right;">
                        <a id="btnLandmark" onclick="landmark.showLandmarkType(this.id, true);" class="tab-btn" style="margin:2px 2px 0;"><span>地图标记</span></a>
                    </div>
                    <%}else{%>
                    <span style="float:left;margin-left:5px;">作业车辆GPS位置</span>
                    <%}%>
                </div>
                <%if(isInLAN){%>
                <div id="mapCanvasBox" style="overflow:hidden;position:relative;background:#e0f1fb;">
                    <div id="omapCanvas" class="mapbox" style="display:none;"></div>
                    <div id="oamapCanvas" class="mapbox" style="display:none;"></div>
                </div>
                <%}else{%>
                <div id="mapCanvas"></div>
                <%}%>
            </div>
        </div>
        <div id="bodyRightSwitch" class="switch-right" title="隐藏右栏菜单"></div>
        <div id="bodyRight" style="background:#e0f1fb url(<%=Public.WebDir%>/skin/default/images/safety/home/right.jpg) no-repeat center bottom;">
            <img src="<%=Public.WebDir%>/skin/default/images/safety/home/right_word.gif" alt="" style="border:none;" />
            <!--
            <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="100%" height="100%">
                <param name="movie" value="<%=Public.WebDir%>/skin/default/images/safety/home/right1.swf" />
                <param name="wmode" value="transparent" />
                <embed src="<%=Public.WebDir%>/skin/default/images/safety/home/right1.swf" width="100%" height="100%" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>
            </object>
            -->
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/default_tp.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/landmark_home.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/devicedetail.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/oamap.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/omap.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/omap.line.js"></script>
</asp:Content>