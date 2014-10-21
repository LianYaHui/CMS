<%@ Page Language="C#" AutoEventWireup="true" CodeFile="taskAdd.aspx.cs" Inherits="modules_patrol_taskAdd" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设置巡检任务</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" /><%=strCode%>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/timeselect/timeselect.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</head>
<body>
    <div id="mainTitle" class="titlebar">
        <div class="title">设置巡检任务</div>
        <span style="display:none;">
            <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
            <input type="hidden" id="txtOldUnitId" value="<%=ui.UnitId%>" />
            <input type="hidden" id="txtCurUnitId" value="<%=ui.UnitId%>" />
            <input type="hidden" id="txtToday" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" />
            <input type="text" id="txtMinDate" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" />
            <input type="text" id="txtMaxDate" value="<%=DateTime.Now.AddYears(1).ToString("yyyy-MM-dd")%>" />
        </span>
    </div>
    <div id="mainContent">
        <div id="operBar" class="operbar">
            <div class="formpanel">
                <!--
                <span>开始日期：</span><input id="txtStartDate" class="txt w90" maxlength="10" style="margin-right:5px;" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" />
                <span>结束日期：</span><input id="txtEndDate" class="txt w90" maxlength="10" style="margin-right:5px;" />
                -->
                <div style="float:left; clear:both;">
                    
                </div>
            </div>
        </div>
        <div id="bodyBox" style="float:left;">
            <div id="listBox" class="listbox">
                <div id="listHeader" class="listheader"></div>
                <div id="listContent" class="list scrollbar"></div>
            </div>
            <div id="statusBar" class="statusbar">
                <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
            </div>
        </div>
        <div id="operMenu" class="oa-menu" style="float:right;">
            <ul class="menu-list" style="margin:5px;">
                <li><a class="btn btnc24" onclick="showEditTaskWin('add');"><span class="w90">新增任务</span></a></li>
                <li><a class="btn btnc24"><span class="w90">删除任务</span></a></li>
            </ul>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/patrol/patrol.taskAdd.js?<%=Public.NoCache()%>"></script>