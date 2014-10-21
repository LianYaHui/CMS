<%@ Page Language="C#" AutoEventWireup="true" CodeFile="showDeptInfo.aspx.cs" Inherits="modules_safety_showDeptInfo" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>部门简介</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">var strImgPathDir = '<%=strImgPathDir%>'; var strImgPath = '<%=strImgPath%>';var strInfoType = '<%=strInfoType%>';</script>
    <style type="text/css">
        #mainContent p{text-align:left; text-indent:2em; padding:0 10px;}
        .fontsize{text-align:right; line-height:20px; margin:0 10px 10px; padding:5px 10px; background:#FFFFF7; border-bottom:solid 1px #fc0;}
        .fontsize a{width:20px; height:20px; display:inline-block; background:#fff; text-align:center;}
        .fontsize a.cur{width:20px; height:20px; display:inline-block; background:#005eac; color:#fff;}
    </style>
</head>
<body>
    <div id="pageBody" class="hide">
        <div id="bodyMain">
            <div id="mainTitle" class="operbar">
                <div id="tabpanel" class="tabpanel" style="float:left;"></div>
            </div>
            <div id="mainContent" style="overflow:auto;">
                <div id="mapCanvasBox" style="overflow:hidden;position:relative;background:#e9f6ff;">
                    <div id="picCanvas" class="infobox" style="display:none;"></div>
                    <div id="infoBox" class="infobox" style="display:none;">
                        <div id="infoContent" style="max-width:700px;background:#fff; text-align:center; padding:0 0 20px;">
                            <h3 style="margin:0 10px; padding:5px 0; font-size:16px;border-bottom:solid 1px #31302e;"><%=strName%></h3>
                            <div class="fontsize">
                                文字大小：<a onclick="changeFontSize(12,this);" class="cur">小</a>
                                <a onclick="changeFontSize(14,this);">中</a>
                                <a onclick="changeFontSize(16,this);">大</a>
                            </div>
                            <div id="infoDetail" style="overflow:auto;">
                                <%if (!hasInfo){%>
                                    <span style="padding:0 5px;"><%=strName%>暂无介绍信息</span>
                                <%}else{%>
                                    <p><%=strIntroduce%></p>
                                <%}%>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/omap.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
var paddingTop = 0;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 0;
var rightWidth = rightWidthConfig =  0;
var switchWidth = 0;
var boxSize = {};

var tabs = [
    {code: 'planegGaph', name: ('department' == strInfoType ? '平面示意图' : '主接线图'), objName: 'picCanvas', load: false},
    {code: 'introduce', name: '简介', objName: 'infoBox', load: false}
];
var curTab = 'planegGaph';
    
$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    cms.frame.setPageBodyDisplay();
    setBodySize();
    
    initialForm();
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    
    $('#pageBody').css('padding-top', paddingTop);

    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    $('#bodyMain').width(boxSize.width);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
};

var setBoxSize = function(){
    $('#mainContent').height(boxSize.height - 25 - 2);
        
    $('#picCanvas').width(boxSize.width);
    $('#picCanvas').height(boxSize.height - 25 - 2);
    
    $('#infoBox').width(boxSize.width);
    $('#infoBox').height(boxSize.height - 25 - 2);
    
    $('#infoContent').width(boxSize.width);
    $('#infoContent').height(boxSize.height - 25 - 2);
    
    $('#infoDetail').height(boxSize.height - 25 - 2 - 75);
    
};

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var initialForm = function(){
    var bodySize = cms.util.getBodySize();
    
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#' + tabs[i].objName + '"><span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        
        if(tabs[i].code == curTab){
            $('#' + tabs[i].objName).show();
        }
    }
    cms.jquery.tabs('#tabpanel', null, '.infobox', '');
    
    if(strImgPath.equals(string.empty)){
        $('#picCanvas').html('<div style="padding:10px;"><%=strName%>暂无平面示意图</div>');
    } else {
        var mapOption = {
            boxSize: boxSize,
            mapBgFilePath: strImgPath,
            mapTypeControl: false,
            zoomControlOptions: {
                y: 5
            }
        };
        omap.initialEmap(cms.util.$('picCanvas'), mapOption);
    }
};

var changeFontSize = function(size, btn){
    var obj = cms.util.$('infoDetail');
    obj.style.fontSize = size + 'px';
    obj.style.lineHeight = 1.5;
    
    $('.fontsize a').removeClass();
    btn.className = 'cur';
};
    
</script>