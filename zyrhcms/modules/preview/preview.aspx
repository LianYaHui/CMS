<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="preview.aspx.cs" Inherits="modules_preview_preview" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/sliderbar/sliderbar.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/timeselect/timeselect.js"></script>
    <script type="text/javascript"><%=strAutoPlay%></script>
    <script type="text/javascript">
        var ShowDeviceAlarmEvent = <%=Config.GetShowDeviceAlarmEvent()?"true":"false"%>;
        var PlayDeviceAlarmSound = <%=Config.GetPlayDeviceAlarmSound()?"true":"false"%>;
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu"></div>
            <div id="ptzTitle" class="titlebar" style="border-top:solid 1px #99bbe8;">
                <div class="title">云镜控制</div>
                <a class="switch sw-open"></a>
            </div>
            <div id="ptzBox" class="box-panel" style="border-bottom:none;">
                <div id="ptzPanel" class="ptz-panel"></div>
                <div id="ptzSpeedBox" style="margin:0 auto;"></div>
            </div>
            <div id="presetTitle" class="titlebar" style="border-top:solid 1px #99bbe8;">
                <div class="title">预置点</div>
                <div class="right-tools"></div>
            </div>
            <div id="presetBox" class="box-panel">
                <div id="presetPanel" class="preset-panel"></div>
                <div id="presetToolbar" class="preset-toolbar"></div>
            </div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>视频预览</span></div>
                <label id="pwAboveOcx"></label>
            </div>
            <div id="mainContent">
                <span style="display:none;">
                    <input type="text" readonly="readonly" id="txtIds" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtData" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtRunTime" class="txt w30" />
                    <input type="text" readonly="readonly" id="txtAddNum" class="txt w30" />
                    <input type="text" id="txtDevCode" value="<%=strDevCode%>" class="txt w60" />
                    <input type="text" id="txtDevName" value="<%=strDevName%>" class="txt w60" />
                    <input type="text" id="txtDevId" value="<%=strDevId%>" class="txt w30"  />
                    <input type="text" id="txtChannelCount" value="<%=strChannelCount%>" class="txt w30"  />
                    <input type="text" id="txtChannelNo" value="<%=channelNo%>" class="txt w30"  />
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
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/ocx/ocx.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/preview_tree.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/preview_win.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/ptz_win.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/preview/preset.js?<%=Public.NoCache()%>"></script>
</asp:Content>