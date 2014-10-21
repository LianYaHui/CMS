<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_remoteConfig_default" %>
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
			<div class="statusbar statusbar-h30" id="statusbar"></div>
		</div>
		<div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
		<div id="bodyRight">
			<div class="titlebar" id="bodyTitle">
				<div class="title">设备信息</div>
			</div>
			<div id="bodyPrompt" class="operbar"><div class="title"></div></div>
			<div class="remoteConfigForm" id="bodyForm"></div>
			<div class="statusbar statusbar-h30" id="bodyBottom">
			    <div style="float:right;padding:0 5px;" id="formButtonPanel"></div>
		    </div>
		</div>
	</div>
	<div><object classid="clsid:396C35AF-313A-4578-AEDF-0C4F18F0DB9E" id="WMPOCX" name="WMPOCX" width="0" height="0"></object></div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/ocx/ocx.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/ocx/ocx.remoteConfig.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfig.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfigFrame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/remoteConfig/remoteConfigTree.js?<%=Public.NoCache()%>"></script>
</asp:Content>