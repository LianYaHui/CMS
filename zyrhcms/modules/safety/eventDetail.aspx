<%@ Page Language="C#" AutoEventWireup="true" CodeFile="eventDetail.aspx.cs" Inherits="modules_safety_eventDetail" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>故障事件详情</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript">var eid = '<%=eventId%>';</script>
</head>
<body>    
    <div id="pageBody">
        <div id="bodyMain">
            <div id="mainContent" style="overflow:auto;">
                <div style="padding:10px;max-width:720px;background:#fff;word-break:break-all;overflow:auto;" id="divEventDetail"></div>
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript">
var paddingTop = 0;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 0;
var switchWidth = 0;
var boxSize = {};

$(window).load(function(){
    setBodySize();
    
    getEventDetail(eid);
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
    $('#mainContent').height(boxSize.height - 25);
};

var getEventDetail = function(eventId){
    var urlparam = 'action=getSingleEvent&eventId=' + eventId;
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/flowcontrol.aspx',
        data: urlparam,
        error: function(data){
            module.showDataError({html:data, width:400, height:250});
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data){
            var jsondata = eval('(' + data + ')');
            if(1 == jsondata.result){
                showEventDetail(jsondata.info);
                delete jsondata;
            }
        }
    });
};

var showEventDetail = function(info){
    if(typeof info == 'object'){
        var strHtml = '<div style="text-align:center;border-bottom:solid 1px #900;padding-bottom:5px;">'
            + '<h3 style="font-size:16px;margin:0 auto;">' + info.eventName + '</h3>'
            + '</div>'
            + '<div></div>'
            + '<table cellpadding="5" cellspacing="0">'
            + '<tr>'
            + '<td>专业：</td><td style="padding-right:30px;">' + parseProfession(parseInt(info.professionId)) + '</td>'
            + '<td>发生时间：</td><td style="padding-right:30px;">' + info.eventTime + '</td>'
            + '<td>严重等级：</td><td>' + parseEventLevel(parseInt(info.levelId)) + '</td>'
            + '</tr>'
            + '</table>'
            + '<div style="padding:5px 0 0;"><b>故障详情</b></div>'
            + '<p>' + info.eventDesc + '</p>'
            + '<div style="text-align:right;border-top:solid 1px #900;margin:10px 0;">事件记录时间：' + info.createTime + '</div>';
        $('#divEventDetail').html(strHtml);    
    }
};

var parseProfession = function(pid){
    var strResult = '';
    switch(pid){
        case 1:
            strResult = '接触网';
            break;
        case 2:
            strResult = '变电';
            break;
        case 3:
            strResult = '电力';
            break;
        default:
            break;
    }
    return strResult;
};

var parseEventLevel = function(lid){
    var strResult = '';
    switch(lid){
        case 1:
            strResult = 'Ⅰ级 特别重大';
            break;
        case 2:
            strResult = 'Ⅱ 重大';
            break;
        case 3:
            strResult = 'Ⅲ 较大';
            break;
        case 4:
            strResult = 'Ⅳ 一般';
            break;
        default:
            strResult = '-';
            break;
    }
    return strResult;
};


</script>