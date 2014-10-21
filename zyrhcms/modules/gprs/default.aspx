<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_gprs_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js?<%=Public.NoCache()%>"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
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
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>实时数据</span><label id="lblTitle">&nbsp;-&nbsp;<%=ui.UnitName%></label></div>
                <div class="tools">
                    <a class="btn btnc22" onclick="batchSetting();" title="批量设置" style="margin-left:3px;"><span>批量设置</span></a>
                    <a class="ibtn" onclick="exportDevice();" title="导出设备信息" style="margin-left:3px;"><i class="icon-excel"></i></a>
                    <span id="timeboard" class="timeboard btn btnc22" onclick="refresh();"><span><b id="ts" class="ts">60</b>秒后刷新</span></span>
                    <a class="ibtn" id="btnTimerPlay" title="暂停" onclick="timerPlay(this);"><i class="icon-play"></i></a>
                    <a class="ibtn" id="btnPageSet" title="设置" onclick="showSetting(this);"><i class="icon-config"></i></a>
                </div>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operform">
                    <div class="formpanel">
                        <select id="ddlDevType" class="select w95" style="margin-right:3px;">
                            <option value="">选择设备类型</option>
                        </select>
                        <select id="ddlOnline3G" class="select w90" style="margin-right:3px;">
                            <option value="-1">选择3G状态</option>
                            <option value="1">3G在线</option>
                            <option value="0">3G离线</option>
                        </select>
                        <select id="ddlOnline2G" class="select w90" style="margin-right:3px;">
                            <option value="-1">选择2G状态</option>
                            <option value="1">2G在线</option>
                            <option value="0">2G离线</option>
                        </select>
                        <select id="ddlType" class="select w85" style="margin-right:1px;">
                            <option value="name">按设备名称</option>
                            <option value="indexcode">按设备编号</option>
                        </select>
                        <input id="txtKeywords" type="text" class="txt w125" maxlength="25" value="输入要查找的设备名称" style="margin:0;" />
                        <a onclick="loadData();" class="btn btnsearch" style="margin:0;"></a>
                        <a onclick="loadAllData();" class="btn btnsearch-cancel" style="margin:0;"></a>
                        <label for="showAllData" class="chb-label" style="display:<%if(ui.UserId==1&&ui.UserName.Equals("admin")){%><%}else{%>none<%}%>;width:100px;float:left;margin:0;margin-left:3px;">
                            <input type="checkbox" id="showAllData" onclick="getDeviceInfo();" class="chb" /><span>显示所有数据</span>
                        </label>
                        <span style="display:none;">
                            <input type="text" id="txtMenuCode" value="<%=MenuCode%>" />
                            <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                            <input type="hidden" id="txtUserUnitName" value="<%=ui.UnitName%>" />
                            <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                            <input type="hidden" id="txtDevUnitName" value="<%=ui.UnitName%>" />
                            <input type="text" id="txtDevCode" />
                            <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                        </span>
                    </div>
                    <div class="rightpanel">
                        <!--
                        <a class="btn btnc-left" style="width:30px;" onclick="setPatrolMode(1);" title="设置巡检模式为手动">手动</a>
                        <a class="btn btnc-right"  style="width:30px;" onclick="setPatrolMode(0);" title="设置巡检模式为自动">自动</a>
                        -->
                    </div>
                </div>
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader"></div>
                    <div id="listContent" class="list"></div>
                </div>
                <div id="statusBar" class="statusbar">
                    <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprs.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprsList.js?<%=Public.NoCache()%>"></script>
</asp:Content>