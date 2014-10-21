<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_organize_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
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
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title">组织资源</div>
                <div class="tools" style="_width:135px;*width:135px;">
                    <span id="timeboard" class="timeboard btn btnc22" onclick="refresh();"><span><b id="ts" class="ts">60</b>秒后刷新</span></span>
                    <a class="ibtn" id="btnTimerPlay" title="暂停" onclick="timerPlay(this);"><i class="icon-play"></i></a>
                </div>
                <span class="left-tools"></span><span class="right-tools"></span>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operbar">
                    <div class="formpanel" style="padding:0;">
                        <div class="tabpanel w300" id="tabpanel"></div>
                    </div>
                    <div class="rightpanel">
                        <div id="toolbar"></div>
                        <span style="display:none;">
                            <input type="text" id="txtUserUnitId" class="txt w30" value="<%=ui.UnitId%>" />
                            <input type="text" id="txtOldUnitId" class="txt w30" value="<%=ui.UnitId%>" />
                            <input type="text" id="txtCurUnitId" class="txt w30" value="<%=ui.UnitId%>" />
                            <input type="text" id="txtCurUnitName" class="txt w30" value="<%=ui.UnitName%>" />
                            <input type="text" id="txtCurUnitCode" class="txt w30" value="" />
                            <input type="text" id="txtNodeId" class="txt w30" value="1" />
                            <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                            <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                        </span>
                    </div>
                </div>
                <div id="listBoxPanel"></div>
                <div id="statusBar" class="statusbar">
                    <span id="prompt"></span><span id="loading" class="loading"></span>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/organize/organize.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/organize/device.js?<%=Public.NoCache()%>"></script>
</asp:Content>