<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_gpsStat_default" Title="Untitled Page" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
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
    <div id="pageBody" class="hide">
        <!--
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
            <div id="leftForm">
                <div class="titlebar" style="border-top:solid 1px #99bbe8;"><div class="title">操作菜单</div></div>
                <div style="padding:5px 2px;">
                <span>开始时间:</span>
                <input type="text" id="txtStartTime" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" />
                <br />
                <span>结束时间:</span>
                <input type="text" id="txtEndTime" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" />
                </div>
            </div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        -->
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title">
                    <div class="title" style="float:left;padding:0;margin:0;">
                        <div id="tabpanel" class="tabpanel" style="float:left;width:400px; background:none;"></div>
                    </div>
                    <div id="toolbar" style="float:right;text-align:right;"></div>
                </div>
                <span style="display:none;">
                    <input type="text" id="txtUserUnitId" class="txt w30"  />
                    <input type="text" id="txtDevUnitId" class="txt w30"  />
                    <input type="text" id="txtDevId" value="" class="txt w30"  />
                </span>
            </div>
            <div id="mainContent">
                <div id="frmbox"></div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gpsStat/gpsStat.js?<%=Public.NoCache()%>"></script>
</asp:Content>