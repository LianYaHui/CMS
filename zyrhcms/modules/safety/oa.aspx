<%@ Page Language="C#" MasterPageFile="~/master/mpPlan.master" AutoEventWireup="true" CodeFile="oa.aspx.cs" Inherits="modules_safety_oa" %>
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
    <%if(isInLAN){%><script type="text/javascript">var strImgPathDir = '<%=strImgPathDir%>';var strToday = '<%=DateTime.Now.ToString("yyyy-MM-dd")%>';</script><%}%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu">
                <%if(isInLAN){%>
                <div class="titlebar" id="common_title">
                    <div class="title">综合查询</div>
                    <a class="switch sw-open"></a>
                </div>
                <div class="box-panel" id="common_form">
                    <table>
                        <tr>
                            <td>部门：</td>
                            <td>
                                <input id="txtDepartmentId" type="hidden" style="float:right;" class="txt w40" />
                                <div id="ddlDepartment" style="height:22px;background:#fff;"><select class="select w240" id="ddlDepartment1" style="height:22px;"></select></div>
                            </td>
                        </tr>
                        <tr>
                            <td>线别：</td>
                            <td>
                                <select id="ddlLine" class="select w240" onchange="getLineRegionList();"><option value="">请选择线别</option></select>
                            </td>
                        </tr>
                        <tr>
                            <td>区间：</td><td><select id="ddlRegion" class="select w240" onclick="getTensionLengthList();"><option value="">请选择区间</option></select></td>
                        </tr>
                        <tr>
                            <td>行别：</td>
                            <td>
                                <select id="ddlUpDownLine" class="select w240" onclick="getTensionLengthList();"><option value="">请选择行别</option></select>
                            </td>
                        </tr>
                        <tr>
                            <td>锚段：</td><td><select id="ddlTensionLength" class="select w240" onchange="getDeviceList();"><option value="">请选择锚段</option></select></td>
                        </tr>
                    </table>
                </div>
                <%}%>
                <div id="leftPanel" style="background:#fff;">
                    <%if(isInLAN){%>
                    <div class="titlebar">
                        <div class="title">设备信息查询</div>
                        <a class="switch sw-open"></a>
                    </div>
                    <div class="box-panel">
                        <!--#include file="html/1002.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">外围环境查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1003.htm"-->
                    </div>
                    <%}%>
                    <%if (!isInLAN){%>
                    <div class="titlebar">
                        <div class="title">作业车辆现场视频信息</div>
                        <!--<a class="switch sw-close"></a>-->
                    </div>
                    <div class="box-panel" id="devTreeBox" style="overflow:auto;">
                        <!--#include file="html/1004.htm"-->
                    </div>
                    <%}%>
                    <%if(isInLAN){%>
                    <div class="titlebar">
                        <div class="title">缺陷、问题库信息查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1006.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">作业计划信息查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1007.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">地图基础信息查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1008.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">平面图查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1009.htm"-->  
                    </div>
                    <%}%>
                </div>
            </div>
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
                <div id="mapCanvasBox" style="overflow:hidden;position:relative;">
                    <div id="omapCanvas" class="mapbox" style="display:none;"></div>
                    <div id="oamapCanvas" class="mapbox" style="display:none;"></div>
                </div>
                <%}else{%>
                <div id="mapCanvas"></div>
                <%}%>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/safety_tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/boundary.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/oa.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/baseinfo.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/device/device.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/deviceinfo.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/devicedetail.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/devicegps.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/workplan_oa.js?<%=Public.NoCache()%>"></script>
<%if (!isInLAN){%>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/emap_info.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/marker.js?<%=Public.NoCache()%>"></script>
<%}%>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/landmark_oa.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/oamap.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/omap.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/omap.line.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/supply.js?<%=Public.NoCache()%>"></script>
</asp:Content>