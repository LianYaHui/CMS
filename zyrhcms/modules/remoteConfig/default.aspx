<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_remoteConfig_default" %>
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
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/progressbar/progressbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <%=strDevInfo%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyContent">
		<div id="bodyLeft">
			<div class="titlebar"><span class="title">操作菜单</span></div>
			<div class="treebox" id="treebox"></div>
			<div class="statusbar" id="statusbar"></div>
		</div>
		<div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
		<div id="bodyRight">
			<div class="titlebar" id="bodyTitle">
				<span class="title" style="padding-left:9px;">设备信息</span>
			</div>
			<div id="bodyPrompt" class="operbar"><div class="title" style="padding-left:10px;"></div></div>
			<div class="remoteConfigForm" id="bodyForm"></div>
			<div id="taskbar" style="background:#fff; overflow:hidden;"></div>
		</div>
	</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfig.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfigFrame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfigTree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfigTask.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/common/js/timeselect/timeselect.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/common/js/sliderbar/sliderbar.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
</asp:Content>