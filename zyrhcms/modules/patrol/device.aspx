<%@ Page Language="C#" AutoEventWireup="true" CodeFile="device.aspx.cs" Inherits="modules_patrol_device" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>巡检设备</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</head>
<body>
    <div id="mainTitle" class="titlebar">
        <div class="title">巡检设备</div>
    </div>
    <div id="mainContent">
        <div id="operBar" class="operbar">
            <div class="formpanel">
                <span style="display:none;">
                    <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                    <input type="hidden" id="txtDevUnitId" value="<%=unitId%>" />
                    <input type="hidden" id="txtDevCode" value="<%=strDevCode%>" />
                    <input type="hidden" readonly="readonly" id="txtIds" class="txt w30" />
                    <input type="hidden" readonly="readonly" id="txtData" class="txt w30" />
                    <input type="hidden" readonly="readonly" id="txtRunTime" class="txt w30" />
                </span>
            </div>
            <div class="rightpanel">
            
            </div>
        </div>
        <div>
        菜单
        </div>
        <div id="listBox" class="listbox">
            <div id="listHeader" class="listheader"></div>
            <div id="listContent" class="list scrollbar"></div>
        </div>
        <div id="statusBar" class="statusbar">
            <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/patrol/patrol.device.js?<%=Public.NoCache()%>"></script>