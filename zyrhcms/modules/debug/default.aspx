<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_debug_default" %>
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
            <div id="mainTitle" class="titlebar">
                <div class="title">调试数据<label id="lblTitle"></label></div>
                <div class="tools">
                    <span id="timeboard" class="timeboard btn btnc22" onclick="refresh();"><span><b id="ts" class="ts">60</b>秒后刷新</span></span>
                    <a class="ibtn" id="btnTimerPlay" title="暂停" onclick="timerPlay(this);"><i class="icon-play"></i></a>
                    <a class="ibtn" id="btnPageSet" title="设置" onclick="showSetting(this);"><i class="icon-config"></i></a>
                </div>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operbar operbar-h52" style="height:52px;">
                    <div class="formpanel">
                        <div style="float:left;">
                            <select id="ddlDevType" class="select w100">
                                <option value="">选择设备类型</option>
	                            <option value="50102">中研102</option>
	                            <option value="50105">中研105</option>
	                            <option value="50106">中研106</option>
	                            <option value="50107">中研107</option>
	                            <option value="50780">中研780</option>
	                            <option value="50116">中研116</option>
	                            <option value="50117">中研305</option>
	                            <option value="50790">中研790</option>
	                            <option value="50813">中研813</option>
                            </select>
                            <span style="margin-left:3px;">设备编号：</span>
                            <input id="txtDevCode" type="text" class="txt w120" maxlength="32" value="<%=devCode%>" />
                            <span style="margin-left:5px;">开始时间：</span>
                            <input id="txtStartTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" maxlength="19" />
                            <span style="margin-left:5px;">结束时间：</span>
                            <input id="txtEndTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" maxlength="19" />
                            <div style="clear:both;">
                                <select id="ddlDataType" class="select w100">
                                    <option value="">选择数据类型</option>
                                    <option value="setting">WEB下发指令</option>
                                    <option value="gprs">GPRS报文</option>
                                </select>
                                <div style="float:left;" id="divSettingType">
                                <select id="ddlSettingType" class="select w100" style="margin-left:3px;">
                                    <option value="">选择设置类型</option>
                                    <option value="0">WEB常规设置</option>
                                    <option value="1">WEB批量设置</option>
                                    <option value="2">系统维护设置</option>
                                    <option value="3">用户一键操作</option>
                                </select>
                                <select id="ddlFunctionCode" class="select" style="margin-left:3px;">
                                    <option value="">选择指令类型</option>
                                </select>
                                </div>
                            </div>                                                       
                        </div>
                        <a onclick="loadData();" class="btn btnsearch65" style="margin-left:5px;"></a>

                        <span style="display:none;">
                            <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                            <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                            <input id="txtDevId" type="hidden" />
                            <input id="txtDevTypeCode" type="hidden" />
                            <input id="txtDevName" type="hidden" />
                            <input type="text" id="txtMaxDate" value="<%=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd 23:59")%>" />
                            
                            <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                        </span>
                    </div>
                </div>
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader"></div>
                    <div id="listContent" class="list scrollbar"></div>
                </div>
                <div id="statusBar" class="statusbar">
                    <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprsProtocol.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/debug/debug.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/debug/debugList.js?<%=Public.NoCache()%>"></script>
</asp:Content>

