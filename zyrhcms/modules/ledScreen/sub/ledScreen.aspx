<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="ledScreen.aspx.cs" Inherits="modules_ledScreen_sub_ledScreen" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/led.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.corner.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/dropdownlist/dropdownlist.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
    <script type="text/javascript">
        var config = {
            rows: <%=rows%>,
            cols: <%=cols%>,
            indent: <%=indent%>,
            simple: <%=simple%>
        };
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
<div id="bodyContent" style="padding-bottom:10px;">
    <div id="divForm" style="float:left; padding:0 5px 0 10px;">
        <table cellpadding="0" cellspacing="0" class="tbform" id="tbForm">
            <tr>
                <td colspan="2"><h3>显示屏模拟演示</h3></td>
            </tr>
            <tr>
                <td>文字颜色：</td>
                <td>
                    <select id="ddlColors" class="select20 w65"></select>
                    行数：<select id="ddlRows" class="select20"></select>
                </td>
            </tr>
            <tr>
                <td>文字大小：</td>
                <td>
                    <select id="ddlFontSize" class="select20 w65"></select>
                    列数：<select id="ddlCols" class="select20"></select>
                </td>
            </tr>
            <tr>
                <td>首行缩进：</td>
                <td>
                    <select id="ddlIndent" class="select20 w65"></select>
                    
                </td>
            </tr>
        </table>
        <textarea id="txtContent" rows="" cols="" class="txt" style="min-width:206px;min-height:120px;margin-top:10px;"><%=strContent%></textarea>
    </div>
    <div class="screen" style="float:left;padding:5px 0 0 10px;">
        <div id="divSet">
            <label class="chb-label-nobg" style="float:left;">
                <input type="checkbox" class="chb" id="chbClearSpace" /><span>清除空格</span>
            </label>
            <div id="divSpaceCount" style="display:none;float:left;margin-left:15px;">
                保留<select id="ddlSpaceCount" class="select20" style="margin:0 2px;"></select>个空格
            </div>
            <div id="lblRowCol" style="clear:both;"></div>
        </div>
        <div id="divScreenBox" class="led-box">
            <div id="divScreen" class="led led16"></div>
        </div>
        <div id="divPagination" class="pager"></div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/led/ledScreen.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/led/demo.js?<%=Public.NoCache()%>"></script>
</asp:Content>