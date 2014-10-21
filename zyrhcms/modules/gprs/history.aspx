<%@ Page Language="C#" AutoEventWireup="true" CodeFile="history.aspx.cs" Inherits="modules_gprs_history" %><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>历史数据</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" /><%=strCode%>
    <script type="text/javascript">
        var devCode = '<%=this.devCode%>';
    </script>
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
</head>
<body oncontextmenu="return false;" onUnload="pageUnLoad();">
    <div id="pageBody">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span style="margin-right:5px;">历史数据 -</span><label id="lblTitle"></label></div>
                <div class="tools">
                    <span id="timeboard" class="timeboard btn btnc22" onclick="refresh();"><span><b id="ts" class="ts">60</b>秒后刷新</span></span>
                    <a class="ibtn" id="btnTimerPlay" title="暂停" onclick="timerPlay(this);"><i class="icon-play"></i></a>
                    <a class="ibtn" id="btnPageSet" title="设置" onclick="showSetting(this);"><i class="icon-config"></i></a>
                </div>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operbar">
                    <div class="formpanel">
                        <div style="float:left;" id="divDevCode">
                            <select id="ddlDevType" class="select w95">
                                <option value="">选择设备类型</option>
                                <option value="50105">中研105</option>
                            </select>
                            <span style="margin-left:3px;">设备编号：</span>
                            <input id="txtDevCode" type="text" runat="server" class="txt w120" maxlength="32" />
                        </div>
                        <span style="margin-left:5px;">开始时间：</span>
                        <input id="txtStartTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" maxlength="19" />
                        <span style="margin-left:5px;">结束时间：</span>
                        <input id="txtEndTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" maxlength="19" />
                        <a onclick="loadData();" class="btn btnsearch65" style="margin-left:5px;"></a>
                        <label for="showProtocol" class="chb-label" style="display:<%if(ui.UserId==1&&ui.UserName.Equals("admin")){%><%}else{%>none<%}%>;_width:100px;margin-left:3px;">
                            <input type="checkbox" id="showProtocol" onclick="getDeviceGprsLog();" class="chb" /><span>显示协议原文</span>
                        </label>                      
                        <span style="display:none;">
                            <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                            <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                            <input id="txtDevId" type="hidden" runat="server" />
                            <input id="txtDevTypeCode" type="hidden" runat="server" />
                            <input id="txtDevName" type="hidden" runat="server" />
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
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprsHistory.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprs/gprsList.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
    var pageUnLoad = function(){
        $('#txtData').attr('value', '');
        $('#pageBody').html('');
    }
</script>