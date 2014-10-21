<%@ Page Language="C#" MasterPageFile="~/master/mpHelp.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="help_default" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody">
		<div id="bodyLeft">
			<div class="titlebar"><span class="title">操作菜单</span></div>
			<div class="treebox" id="treebox"></div>
		</div>
		<div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
		<div id="bodyRight">
			<div class="titlebar" id="bodyTitle">
				<span class="title" style="padding-left:9px;">帮助信息</span>
			</div>
			<!--<div id="bodyPrompt" class="operbar"><div class="title" style="padding-left:10px;"></div></div>-->
			<div class="helpForm" id="bodyForm"></div>
		</div>
	</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/help/help.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/help/help.tree.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/help/help.frame.js"></script>
</asp:Content>