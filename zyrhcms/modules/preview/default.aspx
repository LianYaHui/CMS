<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_preview_default" %>
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
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/sliderbar/sliderbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/timeselect/timeselect.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">
        var ShowDeviceAlarmEvent = <%=Config.GetShowDeviceAlarmEvent()?"true":"false"%>;
        var PlayDeviceAlarmSound = <%=Config.GetPlayDeviceAlarmSound()?"true":"false"%>;
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>视频预览</span></div>
                <label id="pwAboveOcx"></label>
            </div>
            <div id="mainContent" style="background:#212121;">
                <span style="display:none;">
                    <input type="hidden" id="txtUserUnitId" value="<%=ui.UnitId%>" />
                    <input type="hidden" id="txtDevUnitId" value="<%=ui.UnitId%>" />
                    <input type="hidden" id="txtDevCode" value="<%=strDevCode%>" />
                    <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtAddNum" class="txt w30" />
                </span>
                <div id="viewbox" class="viewbox">
                    <object classid="clsid:396C35AF-313A-4578-AEDF-0C4F18F0DB9E" id="WMPOCX" name="WMPOCX" width="100%" height="100%"></object>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnGpsinfo(szGpsinfo)">
                        cms.preview.onGpsInfo(szGpsinfo);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnAlarmInfo(szAlarmInfo)">
                        cms.preview.onAlarmInfo(szAlarmInfo);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnNotify(szPuid, iStatus)">
                        cms.preview.onNotify(szPuid, iStatus);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnMonitorSelChanged(iNew, iOld)">
                        cms.preview.onWindowChanged(iNew, iOld);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnPlayStatus(iWnd, szDevId, iChannel, iStatus, iError)">
                        cms.preview.onPlayStatus(iWnd, szDevId, iChannel, iStatus, iError);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnMonitorSwap(iSrc, iDst)">
                        cms.preview.onWindowSwap(iSrc, iDst);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnServerClosed(szServerIp, iServerPort)">
                        cms.preview.onServerClosed(szServerIp, iServerPort);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnPlayLimieEvent(iWnd)">
                        cms.preview.onPlayLimiePrompt(iWnd);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnAudioPlayEvent(szDevId,iAudioChan,iAction,iStatus)">
                        cms.preview.onAudioPlayEvent(szDevId,iAudioChan,iAction,iStatus);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnCaptureEvent(iResult,szDevId,iChannel,szPathFile)">
                        cms.preview.onCaptureEvent(iResult,szDevId,iChannel,szPathFile);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnLocalRecordEvent(iResult,iEvent,szDevId,iChannel,szPathFile)">
                        cms.preview.onLocalRecordEvent(iResult,iEvent,szDevId,iChannel,szPathFile);
                    </script>
                    <script language="javascript" type="text/javascript" for="WMPOCX" event="OnAlarm(szDevId, szTime, szRemark, iAlarmType, iAction, iVideoChannel, iDiskNo, iAlarmInChannel)">
                        cms.preview.onAlarm(szDevId, szTime, szRemark, iAlarmType, iAction, iVideoChannel, iDiskNo, iAlarmInChannel);
                    </script>
                </div>
                <div id="viewcontrol" class="viewcontrol"></div>
            </div>
        </div>
        <div id="bodyRightSwitch" class="switch-right" title="隐藏右栏菜单"></div>
        <div id="bodyRight">
            <div id="ptzTitle" class="titlebar">
                <div class="title">云镜控制</div>
                <a class="switch sw-open"></a>
            </div>
            <div id="ptzBox" class="box-panel">
                <div id="ptzPanel" class="ptz-panel"></div>
                <div id="ptzSpeedBox"></div>
            </div>
            <div id="presetTitle" class="titlebar">
                <div class="title">预置点</div>
                <div class="right-tools"></div>
            </div>
            <div id="presetBox" class="box-panel">
                <div id="presetPanel" class="preset-panel"></div>
                <div id="presetToolbar" class="preset-toolbar"></div>
            </div>
            <div id="paramTitle" class="titlebar">
                <div class="title">视频参数</div>
                <a class="switch sw-open"></a>
            </div>
            <div id="paramBox" class="box-panel"></div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/treeAction.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/ocx/ocx.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/preview.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/ptz.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/preset.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/videoparam.js?<%=Public.NoCache()%>"></script>
</asp:Content>