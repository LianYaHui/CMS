<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="infoLogByDevice.aspx.cs" Inherits="modules_ledScreen_sub_infoLogByDevice" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
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
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>设备信息历史</span></div>
                <div class="tools">
                </div>
            </div>
            <div id="mainContent">
                <div class="operform">
                    <div class="formpanel">
                        <select id="ddlDevType" class="select w95" style="margin-right:3px;">
                            <option value="">选择设备类型</option>
                        </select>
                        <select id="ddlOnline3G" class="select w90" style="margin-right:3px;">
                            <option value="-1">选择3G状态</option>
                            <option value="1">3G在线</option>
                            <option value="0">3G离线</option>
                        </select>
                        <select id="ddlOnline2G" class="select w90" style="margin-right:3px;">
                            <option value="-1">选择2G状态</option>
                            <option value="1">2G在线</option>
                            <option value="0">2G离线</option>
                        </select>
                        <select id="ddlType" class="select w85" style="margin-right:1px;">
                            <option value="name">按设备名称</option>
                            <option value="indexcode">按设备编号</option>
                        </select>
                        <input id="txtKeywords" type="text" class="txt w125" maxlength="25" value="输入要查找的设备名称" />
                        <a onclick="loadData();" class="btn btnsearch"></a>
                        <a onclick="loadAllData();" class="btn btnsearch-cancel"></a>
                        
                        <span style="display:none;">
                        </span>
                    </div>
                    <div class="rightpanel">
                    </div>
                </div>
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader">
                         <table id="tbHeader" class="tbheader" cellpadding="0" cellspacing="0" style="min-width:1100px;">
                            <tr class="trheader">
                                <td style="width:25px;"><input type="checkbox" name="chbDevAll" onclick="cms.util.selectCheckBox('chbDev',3);" /></td>
                                <td style="width:35px;">序号</td>
                                <td style="width:60px;">设备类型</td>
                                <td style="width:100px;max-width:180px;">终端编号</td>
                                <td style="width:120px;">终端名称</td>
                                <td style="width:60px;">存储区位</td>
                                <td style="min-width:150px;">信息内容</td>
                                <td style="width:35px;">操作</td>
                                <td style="width:120px;">下发状态及时间</td>
                                <td style="width:120px;">回复状态及时间</td>
                                <td style="width:60px;">信息状态</td>
                                <td style="width:120px;">信息取消时间</td>
                                <td style="width:120px;">记录ID、创建时间</td>
                            </tr>
                        </table>
                    </div>
                    <div id="listContent" class="list">
                        <table id="tbList" class="tblist" cellpadding="0" cellspacing="0" style="min-width:1100px;"></table>
                    </div>
                </div>
                <div id="statusBar" class="statusbar">
                    <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/led/devLedInfo.js?<%=Public.NoCache()%>"></script>
</asp:Content>