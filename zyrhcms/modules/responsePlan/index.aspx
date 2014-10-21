<%@ Page Language="C#" MasterPageFile="~/master/mpPlan.master" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="modules_responsePlan_index" Title="Untitled Page" %>
<%@ MasterType VirtualPath="~/master/mpPlan.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
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
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu">                
                <div class="titlebar" id="common_title">
                    <div class="title">综合查询</div>
                    <a class="switch sw-open"></a>
                </div>
                <div class="box-panel" id="common_form">
                    <table>
                        <tr>
                            <td>部门：</td>
                            <td><div id="ddlDepartment" style="height:21px;"><select class="select w200" id="ddlDepartment1" style="height:21px;"></select></div><input id="txtDepartmentId" type="hidden" class="txt w40" /></td>
                        </tr>
                        <tr>
                            <td>线别：</td>
                            <td>
                                <select id="ddlLine" class="select w135">
                                    <option value="1">汉丹线</option>
                                    <option value="2">汉宜线</option>
                                    <option value="3">京广线</option>
                                    <option value="4">京九线</option>
                                    <option value="5">武广线</option>
                                    <option value="6">武九线</option>
                                    <option value="7">武麻线</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>区间：</td><td><select id="ddlRegion" class="select w135" disabled="disabled"></select></td>
                        </tr>
                        <tr>
                            <td>行别：</td>
                            <td>
                                <select id="ddlXingbie" class="select w135" disabled="disabled">
                                <option value="1">上行</option><option value="2">下行</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>锚段：</td><td><select id="ddlTensionLength" class="select w135" disabled="disabled"></select></td>
                        </tr>
                    </table>                  
                </div>
                <div id="leftPanel" style="background:#fff;">
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
                    <div class="titlebar">
                        <div class="title">作业车辆现场视频信息查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1004.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">作业车辆GPS轨迹信息查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1005.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">缺陷、问题库信息查询</div>
                        <a class="switch sw-close"></a>
                    </div>
                    <div class="box-panel" style="display:none;">
                        <!--#include file="html/1006.htm"-->
                    </div>
                    <div class="titlebar">
                        <div class="title">作业计划查询信息查询</div>
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
                    <a class="btn btnc22" onclick="showBuildInfo();" style="float:left; margin:2px 0 0 2px;"><span>今日施工安排</span></a>
                </div>
                <div id="mapCanvas"></div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/mapcorrect.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/index.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/buildinfo.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/emap_info.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/marker.js?<%=Public.NoCache()%>"></script>
</asp:Content>