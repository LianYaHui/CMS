<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_playback_default" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/sliderbar/sliderbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/progressbar/progressbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/timeselect/timeselect.js"></script>
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
                <div class="title">录像回放</div>
                <label id="pwAboveOcx"></label>
                <span style="display:none;">
                    <input type="text" id="txtUserUnitId" value="<%=ui.UnitId%>" class="txt w30"  />
                    <input type="text" id="txtDevUnitId" value="<%=ui.UnitId%>" class="txt w30"  />
                    <input type="text" id="txtDevCode" value="<%=strDevCode%>" class="txt w80"  />
                    <input type="text" id="txtDevId" value="" class="txt w30"  />
                    <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtAddNum" class="txt w30" />
                </span>
            </div>
            <div id="mainContent">
                <div id="viewbox" class="viewbox">
                    <object classid="clsid:396C35AF-313A-4578-AEDF-0C4F18F0DB9E" id="WMPOCX" name="WMPOCX" width="100%" height="100%"></object>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnGpsinfo(szGpsinfo)">
                        cms.playback.onGpsInfo(szGpsinfo);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnAlarmInfo(szAlarmInfo)">
                        cms.playback.onAlarmInfo(szAlarmInfo);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnNotify(szPuid, iStatus)">
                        cms.playback.onNotify(szPuid, iStatus);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnMonitorSelChanged(iNew, iOld)">
                        cms.playback.onWindowChanged(iNew, iOld);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnPlayStatus(iWnd, szDevId, iChannel, iStatus, iError)">
                        cms.playback.onPlayStatus(iWnd, szDevId, iChannel, iStatus, iError);
                    </script>
                </div>
                <div id="progressbar" class="progressbar"></div>
                <div id="viewcontrol" class="viewcontrol"></div>
            </div>
        </div>
        <div id="bodyRightSwitch" class="switch-right" title="隐藏右栏菜单"></div>
        <div id="bodyRight">
            <div class="titlebar">
                <div class="title">搜索录像</div>
            </div>
            <div class="box-panel">
                <div id="divSearchForm">
                    <input type="hidden" id="txtMaxDate" value="<%=strMaxDate%>" />
                    <table cellpadding="0" cellspacing="0" class="tbform" style="margin:2px 0 0 5px;">
                        <tr>
                            <td class="w60">设备名称：</td>
                            <td class="w165"><input type="text" id="txtDevName" class="txt w150" value="" readonly="readonly" /></td>
                            <td class="w60">监控通道：</td>
                            <td><input type="text" id="txtChannelName" class="txt w150" value="" readonly="readonly" /></td>
                        </tr>
                        <tr>
                            <td>回放类型：</td>
                            <td><select id="ddlPlayType" class="select w120" style="width:156px;"></select></td>
                            <td>开始时间：</td>
                            <td><input type="text" id="txtStartTime" class="txt w150" value="<%=DateTime.Now.ToString("yyyy-MM-dd 00:00:00")%>" /></td>
                        </tr>
                        <tr>
                            <td>文件类型：</td>
                            <td><select id="ddlFileType" class="select w120" style="width:156px;"></select></td>
                            <td>结束时间：</td>
                            <td><input type="text" id="txtEndTime" class="txt w150" value="<%=DateTime.Now.ToString("yyyy-MM-dd 23:59:59")%>" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a class="btn btnc24" onclick="searchFile(this);"><span class="w120" style="width:116px;">搜索录像</span></a></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="titlebar">
                <div class="title">录像文件</div>
                <div class="tools">
                    <label class="chb-label-nobg" style="max-width:70px;"><input type="checkbox" onclick="cms.playback.setContinuous(this.checked);" class="chb" /><span>连续播放</span></label>
                </div>
            </div>
            <div class="box-panel">
                <div id="listBox" class="listbox">
                    <div id="listHeader" class="listheader"></div>
                    <div id="listContent" class="list" style="background:#fff;"></div>
                </div>
            </div>
            <div class="statusbar" style="border:none;"><span id="prompt"></span></div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/ocx/ocx.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/playback/playback.js?<%=Public.NoCache()%>"></script>
</asp:Content>