<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="arcgis_index" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> 
<head>
    <title>GIS地图</title>
    <style type="text/css" media="screen"> 
        html, body{ height:100%; }
        body {margin:0; padding:0; overflow:auto; text-align:center; background:#fff; font-size:12px;}
        object:focus {outline:none;}
        #flashContent {display:none;}
        
        #divPrompt{position:absolute; left:45%; top:45%; z-index:99999; padding:5px 0 5px 20px;
            background:url("loading.gif") no-repeat 0 center;}
    </style>
    <script type="text/javascript">
    function mapclick(type, id, name, action)
    {
        window.parent.frames.mapCallback(type, id, name, action);
    }
    
    //x:输出经度，y：纬度
    function getCenter(lng, lat)
    {
        window.parent.oamap.returnCenter(lat, lng);
    }
    
    function getZoom(zoom,scale)
    {
        window.parent.oamap.returnZoom(zoom, scale);
    }
    
    function initial(){
        window.parent.oamap.returnInitial();
        //隐藏提示信息
        window.setTimeout(hidePrompt, 3000);
    }
    
    function hidePrompt(){
        document.getElementById('divPrompt').style.display = 'none';
    }
    </script>
    <!--<script type="text/javascript" src="custom.js"></script>-->
    <script type="text/javascript" src="map.js"></script>
    <script type="text/javascript" src="swfobject.js"></script>
    <script type="text/javascript">
        // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
        var swfVersionStr = "11.1.0";
        // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
        var xiSwfUrlStr = "playerProductInstall.swf";
        var flashvars = {};
        var params = {};
		params.wmode = "opaque";
        params.quality = "high";
        params.bgcolor = "#ffffff";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "true";
        var attributes = {};
        attributes.id = "index";
        attributes.name = "index";
        attributes.align = "middle";
        swfobject.embedSWF(
            "index.swf", "flashContent", 
            "100%", "100%", 
            swfVersionStr, xiSwfUrlStr, 
            flashvars, params, attributes);
        // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
        swfobject.createCSS("#flashContent", "display:block;text-align:left;");
    </script>
</head>
<body>
    <div id="flashContent">
        <p>
            To view this page ensure that Adobe Flash Player version 
            11.1.0 or greater is installed. 
        </p>
        <script type="text/javascript"> 
            var pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
            var strDownload = '<a href="http://www.adobe.com/go/getflashplayer">'
                + '<img src="' + pageHost + 'www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" />'
                + '</a>';
            document.write(strDownload);
        </script> 
    </div>
    
    <div id="divPrompt">正在加载地图，请稍候...</div>
    <noscript>
        <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" id="index">
            <param name="movie" value="index.swf" />
            <param name="quality" value="high" />
            <param name="bgcolor" value="#ffffff" />
            <param name="allowScriptAccess" value="sameDomain" />
            <param name="allowFullScreen" value="true" />
            <!--[if !IE]>-->
            <object type="application/x-shockwave-flash" data="index.swf" width="100%" height="100%">
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
</body>
</html>