<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_devUploadFile_default" %>
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
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.loadimage.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title">手机设备文件查询</div>
                <div class="right-tools">
                    <select id="ddlDesc" class="select" style="margin-right:5px;">
                        <option value="1">降序</option>
                        <option value="0">升序</option>
                    </select>
                    <span>每页</span>
                    <select id="ddlPageSize" class="select" style="margin-right:5px;">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20" selected="selected">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                    </select>
                    <span>条</span>
                </div>
            </div>
            <div id="mainContent">
                <div id="operBar" class="operform">
                    <div class="formpanel">
                        <span>当前设备通道：</span>
                        <input id="txtDevChannelName" type="text" class="txt w150 disabled" disabled="disabled" title="请在左边树菜单中选择设备通道" />
                        <input id="txtDevCode" type="hidden" class="txt" />
                        <input id="txtDevName" type="hidden" class="txt" />
                        <input id="txtChannelNo" type="hidden" class="txt" />
                        <input id="txtChannelName" type="hidden" class="txt" />
                        
                        <select id="ddlFileType" class="select" style="margin-left:3px;">
                            <option value="-1">选择文件类型</option>
                            <option value="0">图片</option>
                            <option value="1">录像</option>
                            <option value="2">录音</option>
                        </select>
                        <span style="margin-left:3px;">开始时间：</span>
                        <input id="txtStartTime" type="text" class="txt w120" value="<%=DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd 00:00:00")%>" maxlength="19" />
                        <span style="margin-left:3px;">结束时间：</span>
                        <input id="txtEndTime" type="text" class="txt w115" value="<%=DateTime.Now.AddDays(0).ToString("yyyy-MM-dd 23:59:59")%>" maxlength="19" />
                        <a onclick="loadData();" class="btn btnsearch65" style="margin-left:3px;"></a>
                        <span style="display:none;">
                            <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                            <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                            <input type="text" id="txtMaxDate" value="<%=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd 23:59")%>" />
                        </span>
                    </div>
                </div>
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader">
                        <table id="tbHeader" class="tbheader" cellpadding="0" cellspacing="0" style="min-width:920px;"></table>
                    </div>
                    <div id="listContent" class="list">
                        <table id="tbList" class="tblist" cellpadding="0" cellspacing="0" style="min-width:900px;"></table>
                    </div>
                </div>
                <div id="statusBar" class="statusbar">
                    <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
                </div>
            </div>
        </div>
        <canvas id="Canvas"></canvas>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/devUploadFile/devUploadFile.js"></script>
</asp:Content>