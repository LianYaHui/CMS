<%@ Page Language="C#" MasterPageFile="~/master/mpPlan.master" AutoEventWireup="true" CodeFile="planManage.aspx.cs" Inherits="modules_responsePlan_planManage" %>
<%@ MasterType VirtualPath="~/master/mpPlan.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dropdownlist/dropdownlist.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu">
                <div class="titlebar">
                    <div class="title">预案类型</div>
                    <a class="switch sw-open"></a>
                </div>
                <div class="box-panel">
                    <ul class="oper-menu">
                        <li><a class="cur" lang="device">预案类型管理</a></li>
                        <li><a class="tab" lang="device">新增预案类型</a></li>
                        <li><a class="tab" lang="device">类型功能配置</a></li>
                    </ul>
                </div>
                <div class="titlebar">
                    <div class="title">功能模块</div>
                    <a class="switch sw-close"></a>
                </div>
                <div class="box-panel" style="display:none;">
                    <ul class="oper-menu">
                        <li><a class="tab" lang="device">功能模块管理</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title">预案管理</div>
            </div>
            <div id="mainContent">
                
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/planManage.js"></script>
</asp:Content>