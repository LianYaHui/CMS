<%@ Page Language="C#" AutoEventWireup="true" CodeFile="wuhan.aspx.cs" Inherits="tools_wuhan" %>
<!DOCTYPE html>
<html>
<head>
    <title>武汉供电段地图工具</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</head>
<body oncontextmenu="return false;">
    <div class="titlebar"><div id="tabpanel" class="tabpanel" style="float:left;"></div></div>
    <div id="mainContent"></div>
</body>
</html>
<script type="text/javascript">

var tabs = [
    {code: 'pillar', name: '修改支柱坐标', objName: 'div_pillar', url:cms.util.path + '/tools/jiupian.aspx?' + new Date().getTime(), load: false},
    {code: 'temp', name: '地图找位置', objName: 'div_temp', url:cms.util.path + '/tools/ditu.aspx?' + new Date().getTime(), load: false},
    {code: 'railway', name: '地图找铁路线', objName: 'div_railway', url:cms.util.path + '/tools/dtp.aspx?' + new Date().getTime(), load: false},
    {code: 'info', name: '部门所亭信息', objName: 'div_info', url:cms.util.path + '/tools/info.aspx?' + new Date().getTime(), load: false},
    {code: 'person', name: '人员信息管理', objName: 'div_person', url:cms.util.path + '/modules/safety/addressList.aspx?action=edit&' + new Date().getTime(), load: false},
    {code: 'ws', name: 'WS接口测试', objName: 'div_ws', url:cms.util.path + '/tools/wstest.aspx?' + new Date().getTime(), load: false}
];
var tabid = 0;

var curTab = 'pillar';

$(window).load(function(){
    initialForm();
    setBodySize();
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    
    $('#mainContent').width(bodySize.width);
    $('#mainContent').height(bodySize.height - 25);
    
    $('.tabframe').width(bodySize.width);
    $('.tabframe').height(bodySize.height - 25);
};

var initialForm = function(){
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#tabcon' + i + '"><span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        
        var strHtml = '<iframe id="tabcon' + i + '" name="tabcon' + i + '" class="tabframe" src="" frameborder="0" width="100%" height="100%" scrolling="auto" style="display:none;"></iframe>';
        $('#mainContent').append(strHtml);
        
        if(tabs[i].code == curTab){
            $('#tabcon' + i).show();
            $('#tabcon' + i).attr('src', tabs[i].url);
            tabs[i].load = true;
        }
    }
    cms.jquery.tabs('.titlebar .tabpanel', null, '.tabframe', 'switchPage'); 
};

var getIndex = function(code){
    for(var i=0; i<tabs.length; i++){
        if(code == tabs[i].code){
            return i;
        }
    }
    return -1;
};

var switchPage = function(param){
    var idx = getIndex(param.action);
    if(!tabs[idx].load){
        $('#tabcon' + idx).attr('src', tabs[idx].url);
        tabs[idx].load = true;
    } else {
        $('#tabcon' + idx).show();
    }
};
</script>