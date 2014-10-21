<%@ Page Language="C#" AutoEventWireup="true" CodeFile="flowChart.aspx.cs" Inherits="modules_safety_flowChart" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>应急流程图</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <style type="text/css">
        #mainContent{background:#dbebfe;}
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
            <div id="mainContent" style="overflow:auto;"></div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/flowconfig.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/flowcontrol.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
var paddingTop = 0;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 0;
var rightWidth = rightWidthConfig =  0;
var switchWidth = 0;
var boxSize = {};

var tabs = [
    {type: 1, code: 'JCW', name: '接触网应急流程', load: false},
    {type: 2, code: 'BD', name: '变电应急流程', load: false},
    {type: 3, code: 'DL', name: '电力应急流程', load: false}
];

var curTab = 'JCW';
    
$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    cms.frame.setPageBodyDisplay();    
    setBodySize();
    flowControl.initialProcess();
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
};

var initialForm = function(){
    var bodySize = cms.util.getBodySize();
    var c = tabs.length;
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#divFlowChartDemo_' + tabs[i].code + '"><span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        
        var strHtml = '<div id="divFlowChartDemo_' + tabs[i].code + '" class="flowchart" style="padding:10px;display:none;"></div>';
        
        $('#mainContent').append(strHtml);
        
        if(tabs[i].code == curTab){
            $('#divFlowChartDemo_' + tabs[i].code).show();
        }
    }
    cms.jquery.tabs('#tabpanel', null, '.flowchart', '');
    
    for(var i=0; i<c; i++){
        var obj = document.getElementById('divFlowChartDemo_' + tabs[i].code);
        var process = flowControl.getEventProcess(tabs[i].type, tabs[i].code);
        flowControl.showFlowChart(tabs[i].type, tabs[i].code, obj, process);
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