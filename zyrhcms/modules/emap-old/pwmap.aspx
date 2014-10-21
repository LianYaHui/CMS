<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pwmap.aspx.cs" Inherits="modules_emap_pwmap" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
</head>
<body>
    <div id="mapCanvas" style="width:500px;height:400px;"></div>
    <div id="statusBar" class="statusbar">
    <input type="hidden" id="txtLatLng" value="{lat:'29.87458',lng:'121.64041',name:'宁波中研瑞华'}" />
        <input value="显示" id="btnShow" type="button" onclick="showLayer(true);" />
        <input value="隐藏" id="btnHide" type="button" onclick="showLayer(false);"  />
    </div>
</body>
</html>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=true"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap-old/pwemap.js"></script>
<script type="text/javascript">
function showLayer(show){
    if(show){
        trafficLayer.setMap(pwemap.map);
    } else {
        trafficLayer.setMap(null);
    }
}
</script>
