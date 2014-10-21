<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_emap_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <script type="text/javascript">
        var devCode = '<%=this.devCode%>';
    </script>
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
                <div class="title"><span>历史数据</span><label id="lblTitle"></label></div>
                <div class="tools">
                    <span id="timeboard" class="timeboard btn btnc22" onclick="refresh();"><span><b id="ts" class="ts">60</b>秒后刷新</span></span>
                    <a class="ibtn" id="btnTimerPlay" title="暂停" onclick="timerPlay(this);"><i class="icon-play"></i></a>
                    <a class="ibtn" id="btnPageSet" title="设置" onclick="showSetting(this);"><i class="icon-config"></i></a>
                    <%if(ui.UserId==1 || ui.UserName.Equals("admin")){%>
                        <a class="ibtn" id="btnDebug" title="调试" onclick="showDebugInfo();"><i class="icon-debug"></i></a>
                    <%}%>
                </div>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operbar">
                    <div class="formpanel">
                        <div style="float:left;margin-left:3px;" id="divDevCode">
                            <select id="ddlDevType" class="select w95">
                                <option value="">选择设备类型</option>
                                <option value="50105">中研105</option>
                            </select>
                            <span style="margin-left:3px;">设备编号：</span>
                            <input id="txtDevCode" type="text" class="txt w120" maxlength="32" value="<%=devCode%>" />
                        </div>
                        <span style="margin-left:5px;">开始时间：</span>
                        <input id="txtStartTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" maxlength="19" />
                        <span style="margin-left:5px;">结束时间：</span>
                        <input id="txtEndTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" maxlength="19" />
                        <a onclick="loadData();" class="btn btnsearch65" style="margin-left:5px;"></a>
                        <label for="showProtocol" class="chb-label" style="display:<%if(ui.UserId==1&&ui.UserName.Equals("admin")){%><%}else{%>none<%}%>;_width:100px;">
                            <input type="checkbox" id="showProtocol" onclick="getDeviceGprsLog();" class="chb" /><span>显示协议原文</span>
                        </label>
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
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprsHistory.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprsList.js?<%=Public.NoCache()%>"></script>
</asp:Content>