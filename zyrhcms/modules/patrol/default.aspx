<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_patrol_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="operBar" class="titlebar">
                <div class="formpanel" style="padding:0;float:left;">
                    <a class="tab-scroll-left"></a>
                    <div id="tabpanelBox" class="tabpanelbox"><div id="tabpanel" class="tabpanel"></div></div>
                    <a class="tab-scroll-right"></a>
                </div>
                <div class="rightpanel">
                    <div id="toolbar"></div>
                    <span style="display:none;">
                        <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                        <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                        <input type="hidden" id="txtDevCode" value="" />
                    </span>
                </div>
            </div>
            <div class="loading" id="bdLoading" style="text-align:left; float:left;">正在加载，请稍候...</div>
            <div id="frmbox"></div>
        </div>
        <div id="bodyRightSwitch" class="switch-right" title="隐藏右栏菜单"></div>
        <div id="bodyRight">
            <div class="titlebar">
                <div class="title">巡检设备</div>
                <a class="switch sw-open"></a>
            </div>
            <div class="box-panel">
                <ul class="oper-menu">
                    <li><a class="cur" lang="device">巡检设备</a></li>
                </ul>
            </div>
            <div class="titlebar">
                <div class="title">巡检任务</div>
                <a class="switch sw-close"></a>
            </div>
            <div class="box-panel" style="display:none;">
                <ul class="oper-menu">
                    <li><a lang="task_list">巡检任务列表</a></li>
                    <li><a lang="task_plan">巡检任务计划</a></li>
                    <li><a lang="task_add">设置巡检任务</a></li>
                </ul>
            </div>
            <div class="titlebar">
                <div class="title">巡检统计</div>
                <a class="switch sw-close"></a>
            </div>
            <div class="box-panel" style="display:none;">
                <ul class="oper-menu">
                    <li><a lang="task_stat">巡检任务统计</a></li>
                    <li><a lang="track">GPS轨迹回放</a></li>
                </ul>
            </div>
            <div class="titlebar">
                <div class="title">设置</div>
                <a class="switch sw-close"></a>
            </div>
            <div class="box-panel" style="display:none;">
                <ul class="oper-menu">
                    <li><a rel="#set"></a></li>
                </ul>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/patrol/patrol.js?<%=Public.NoCache()%>"></script>
</asp:Content>