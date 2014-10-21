<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="infoPublish.aspx.cs" Inherits="modules_ledScreen_sub_infoPublish" %>
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
    <script type="text/javascript">var isPublishAlarm = <%=isPublishAlarm?"true":"false" %>;var parentId = <%=parentId%>;</script>
    <style type="text/css">
        body{background:#dfe8f6;}
        .screen{margin:5px 0;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu">正在加载，请稍候...</div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="bodyTitle">
                <span class="title">任务发布</span>
                <span class="explain" style="float:left;">(1个汉字或中文标点符号为2个字节，1个英文字母或英文标点符号为1个字节)</span>
                <span id="reload" class="reload"></span>
                <div class="tools">
                </div>
            </div>
            <div id="bodyContent" style="overflow:auto;">
                <div id="mainContent">
                    <div class="form">
                        <table cellpadding="0" cellspacing="0" class="tbform" style="float:left;">
                            <tr>
                                <td>选择分类：</td>
                                <td>
                                    <div id="divInfoType" style="height:22px;float:left; width:150px;"></div>
                                    <input type="text" id="txtInfoType" class="txt w150" style="height:22px;display:none;" />
                                </td>
                                <%if(isPublishAlarm){%>
                                <td>
                                    选择信号：<select id="ddlSignal" class="select"><option value="0">选择信号</option></select>
                                </td>
                                <%}%>
                            </tr>
                            <tr>
                                <td>存储区位：</td>
                                <td><select id="ddlMemory" class="select20 w40" style="margin:0 2px 0 0;"></select></td>
                            </tr>
                            <tr>
                                <td>首行缩进：</td>
                                <td>
                                    <select id="ddlIndent" class="select20 w40" style="margin:0 2px 0 0;float:left;"></select>
                                    <span style="float:left;">个字节</span>
                                    <label class="chb-label-nobg" style="float:left;margin-left:20px;">
                                        <input type="checkbox" class="chb" id="chbClearSpace" /><span>清除空格</span>
                                    </label>
                                    <div id="divSpaceCount" style="display:none;float:left;margin-left:15px;">
                                        保留<select id="ddlSpaceCount" class="select20" style="margin:0 2px;"></select>个空格
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <img src="about:blank;" alt="" id="imgSignal" style="float:left;display:none; margin:2px 0 0 5px;" />                       
                        <div style="float:left;clear:both;">
                            信息内容：<br />
                            <textarea id="txtContent" class="txt" style="width:468px;height:<%=isPublishAlarm?"60":"150"%>px;" cols="20" rows="2"></textarea>
                        </div>
                        <%if(isPublishAlarm){%>
                        <div style="float:left;">
                            防御指南：<br />
                            <textarea id="txtContent1" class="txt" style="width:468px;height:120px;" cols="20" rows="2"></textarea>
                        </div>
                        <%}%>
                        <div id="divContentStat" class="explain" style="width:468px;height:20px;line-height:20px;clear:both;"></div>
                        <table cellpadding="0" cellspacing="0" class="tbform">
                            <tr>
                                <td>发布时间：</td>
                                <td>
                                    <label class="chb-label-nobg" style="float:left;">
                                        <input class="chb" type="radio" name="rbTimeType" value="1" onclick="setTimeType(1);" /><span>预约发布&nbsp;&nbsp;</span>
                                    </label>
                                    <input type="text" id="txtTiming" class="txt w120 disabled" disabled="disabled" maxlength="19"  style="float:left;margin:0 15px 0 10px;" value="<%=DateTime.Now.AddHours(1).ToString("yyyy-MM-dd HH:mm:ss") %>" />
                                    <label class="chb-label-nobg" style="float:left;">
                                        <input class="chb" type="radio" name="rbTimeType" checked="checked" value="0" onclick="setTimeType(0);" /><span>即时发布</span>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>有效期：</td>
                                <td>
                                    <label class="chb-label-nobg" style="float:left;margin:0 10px 0 0;">
                                        <input class="chb" type="checkbox" name="chbEnabledValidity" value="1" onclick="setValidityTime(this.checked);" checked="checked" /><span>启用有效期</span>
                                    </label>
                                    <input type="text" id="txtValidityTime" class="txt w120" maxlength="19" style="margin-right:10px;" />
                                    默认有效期<input type="text" id="txtValidityHours" class="txt w35 disabled" maxlength="5" style="margin:0 2px;" disabled="disabled" value="48" />小时(0为无限期)
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="screen">
                        <table cellpadding="0" cellspacing="0" class="tbform">
                            <tr>
                                <td colspan="2"><h3>显示屏模拟演示</h3></td>
                            </tr>
                            <tr>
                                <td>文字颜色：</td>
                                <td>
                                    <select id="ddlColors" class="select20"></select>
                                    行数：<select id="ddlRows" class="select20"></select>
                                    列数：<select id="ddlCols" class="select20"></select>
                                </td>
                            </tr>
                            <tr>
                                <td>文字大小：</td>
                                <td><select id="ddlFontSize" class="select20"></select></td>
                            </tr>
                        </table>                        
                        <div id="lblRowCol"></div>
                        <!--<span class="explain">文字大小表示相同大小的显示屏以不同文字大小显示的效果（默认文字大小为16×16）</span>-->
                        <div id="divScreenBox" class="led-box">
                            <div id="divScreen" class="led led16"></div>
                        </div>
                        <div id="divPagination" class="pager"></div>
                    </div>
                </div>
            </div>
            <div id="bodyBottom1" class="operbar operbar-h52" style="height:35px;border-bottom:none;border-top:solid 1px #99bbe8;">
                <div class="panel-left" style="width:80%;padding-top:4px;">
                    <a class="btn btnc26" onclick="sendLedContent();"><span class="w65">确认,发布</span></a>
                    <span id="lblError" runat="server"></span></div>
                <div class="panel-right"></div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/led/ledScreen.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/led/publish.js?<%=Public.NoCache()%>"></script>
</asp:Content>