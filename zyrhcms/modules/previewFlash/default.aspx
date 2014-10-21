<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_previewFlash_default" %>
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
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/flash/history/history.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/flash/history/history.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/flash/swfobject.js"></script>
    <script type="text/javascript">
        var FlashRtmpUrl = '<%=strRtmpUrl%>';
        var ShowDeviceAlarmEvent = <%=Config.GetShowDeviceAlarmEvent()?"true":"false"%>;
        var PlayDeviceAlarmSound = <%=Config.GetPlayDeviceAlarmSound()?"true":"false"%>;
    </script>
    <script type="text/javascript">
        // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
        var swfVersionStr = "11.1.0";
        // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
        var xiSwfUrlStr = "<%=Public.WebDir%>/flash/playerProductInstall.swf";
        var flashvars = {};
        var params = {};
        params.quality = "high";
        params.bgcolor = "#ffffff";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "true";
        var attributes = {};
        attributes.id = "BXPlayer";
        attributes.name = "BXPlayer";
        attributes.align = "middle";
        params.wmode="transparent";
        swfobject.embedSWF(
            "<%=Public.WebDir%>/flash/BXPlayer.swf", "flashContent", 
            "100%", "100%", 
            swfVersionStr, xiSwfUrlStr, 
            flashvars, params, attributes);
        // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
        swfobject.createCSS("#flashContent", "display:block;text-align:left;");
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
                    <div id="flashContent">
                        <p>
                            To view this page ensure that Adobe Flash Player version 
                            11.1.0 or greater is installed. 
                        </p>
                        <script type="text/javascript"> 
                            var pageHost = ((document.location.protocol == "https:") ? "https://" : "http://"); 
                            document.write("<a href='http://www.adobe.com/go/getflashplayer'><img src='" 
                                            + pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>" ); 
                        </script> 
                    </div>
                    
                    <noscript>
                        <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" id="BXPlayer">
                            <param name="movie" value="<%=Public.WebDir%>/flash/BXPlayer.swf" />
                            <param name="quality" value="high" />
                            <param name="bgcolor" value="#ffffff" />
                            <param name="allowScriptAccess" value="sameDomain" />
                            <param name="allowFullScreen" value="true" />
                            <!--[if !IE]>-->
                            <object type="application/x-shockwave-flash" data="<%=Public.WebDir%>/flash/BXPlayer.swf" width="100%" height="100%">
                                <param name="quality" value="high" />
                                <param name="bgcolor" value="#ffffff" />
                                <param name="allowScriptAccess" value="sameDomain" />
                                <param name="allowFullScreen" value="true" />
                            <!--<![endif]-->
                            <!--[if gte IE 6]>-->
                                <p> 
                                    Either scripts and active content are not permitted to run or Adobe Flash Player version
                                    11.1.0 or greater is not installed.
                                </p>
                            <!--<![endif]-->
                                <a href="http://www.adobe.com/go/getflashplayer">
                                    <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash Player" />
                                </a>
                            <!--[if !IE]>-->
                            </object>
                            <!--<![endif]-->
                        </object>
                    </noscript>
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
<script type="text/javascript" src="<%=Public.WebDir%>/js/flash/player.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/previewFlash/preview.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/previewFlash/ptz.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/previewFlash/preset.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/previewFlash/videoparam.js?<%=Public.NoCache()%>"></script>

<script type="text/javascript">
/*
    function onGpsInfo(szGpsinfo){
        cms.preview.onGpsInfo(szGpsinfo);
    }
    function onAlarmInfo(szAlarmInfo){
        cms.preview.onAlarmInfo(szAlarmInfo);
    }
    function onNotify(szPuid, iStatus){
        cms.preview.onNotify(szPuid, iStatus);
    }
*/
    function onPlayerLoaded(bLoaded){
        //alert(bLoaded + ',' + typeof bLoaded);
        cms.preview.onPlayerLoaded(bLoaded);
    }
    function onWindowRankChanged(iRank){
        cms.preview.onWindowRankChanged(iRank);
    }
    function onWindowChanged(iNew, iOld){
        cms.preview.onWindowChanged(iNew, iOld);
    }
    function onPlayStatus(iWnd, szDevId, iChannel, iStatus, iError){
        cms.preview.onPlayStatus(iWnd, szDevId, iChannel, iStatus, iError);
    }
    function onWindowSwap(iSrc, iDst){
        cms.preview.onWindowSwap(iSrc, iDst);
    }
    function onServerClosed(szServerIp, iServerPort){
        cms.preview.onServerClosed(szServerIp, iServerPort);
    }
</script>
</asp:Content>