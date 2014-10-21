<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_alarm_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
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
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.loadimage.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.lazyload.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>图像比对报警</span><label id="lblTitle"></label></div>
                <div class="tools">
                    <span id="timeboard" class="timeboard btn btnc22" onclick="refresh();"><span><b id="ts" class="ts">60</b>秒后刷新</span></span>
                    <a class="ibtn" id="btnTimerPlay" title="暂停" onclick="timerPlay(this);"><i class="icon-play"></i></a>
                    <a class="ibtn" id="btnPageSet" title="设置" onclick="showSetting(this);"><i class="icon-config"></i></a>
                </div>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operbar">
                    <div class="formpanel">
                        <select id="ddlAlarmLevel" class="select">
                            <option value="-1">显示所有报警</option>
                            <option value="30,100">显示重度报警</option>
                            <option value="11,30">显示中度报警</option>
                            <option value="1,10">显示轻度报警</option>
                        </select>
                        <span style="margin-left:3px;">开始时间：</span>
                        <input id="txtStartTime" type="text" class="txt w120" value="<%=DateTime.Now.AddDays(days[0]).ToString("yyyy-MM-dd 00:00:00")%>" maxlength="19" />
                        <span style="margin-left:3px;">结束时间：</span>
                        <input id="txtEndTime" type="text" class="txt w120" value="<%=DateTime.Now.AddDays(days[1]).ToString("yyyy-MM-dd 23:59:59")%>" maxlength="19" />
                        <select id="ddlType" class="select w85" style="margin-left:3px; margin-right:1px;">
                            <option value="name">按设备名称</option>
                            <option value="indexcode">按设备编号</option>
                        </select>
                        <input id="txtKeywords" type="text" class="txt w135" maxlength="25" value="输入要查找的设备名称" />
                        <a onclick="loadData();" class="btn btnsearch"></a>
                        <a onclick="loadAllData();" class="btn btnsearch-cancel"></a>
                        <span style="display:none;">
                            <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                            <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                            <input type="text" id="txtDevCode" />
                            <input type="text" id="txtMaxDate" value="<%=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd 23:59")%>" />
                            <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                        </span>
                    </div>
                    <div class="rightpanel">
                        <!--<a class="ibtn" onclick="statDeviceAlarm();" title="统计报警数量" style="margin-right:3px;"><i class="icon-count"></i></a>-->
                        <a class="ibtn" onclick="deleteMultiAlarm();" title="批量删除报警"><i class="icon-delete"></i></a>
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
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/drawline.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/alarm/alarm.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/alarm/alarmList.js?<%=Public.NoCache()%>"></script>
</asp:Content>