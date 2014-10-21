<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="mileage.aspx.cs" Inherits="modules_gpsStat_mileage" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide" style="padding:0; margin:0;">        
        <div id="bodyLeft" style="border-bottom:none;border-left:none;">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain" style="border-bottom:none;border-right:none;">
            <div class="operbar" style="padding:1px 0 0 5px;">
                <input id="txtMaxDate" type="hidden" value="<%=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd 23:59:59")%>" />
                <input type="hidden" id="txtUnitId" value="0" />
                <input type="hidden" id="txtDevCode" />
                <span>开始时间:</span>
                <input type="text" id="txtStartTime" readonly="readonly" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" />
                <span style="margin-left:5px;">结束时间:</span>
                <input type="text" id="txtEndTime" readonly="readonly" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" />
                <a class="btn btnc22" id="btnSearch" style="margin-left:5px;" onclick="getDeviceGpsStat(this);"><span class="w40">查询</span></a>
                <span id="loading" class="loading" style="margin-left:5px;"></span>
                
                <div class="rightpanel">
                    <a class="ibtn" onclick="exportDevice();" title="导出设备GPS里程统计信息" style="margin-left:3px;"><i class="icon-excel"></i></a>
                </div>
            </div>
            <div id="mainContent">
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader"></div>
                    <div id="listContent" class="list"></div>
                </div>
                <div id="statusBar" class="statusbar">
                    <span id="pagination" class="pagination"></span><span id="prompt"></span>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gpsStat/mileage.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">

</script>
</asp:Content>