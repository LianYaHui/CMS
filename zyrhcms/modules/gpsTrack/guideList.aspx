<%@ Page Language="C#" AutoEventWireup="true" CodeFile="guideList.aspx.cs" Inherits="modules_gpsTrack_guideList" %><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>GPS搜索向导</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" /><%=strPageCode%>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <style type="text/css">
        #divForm{}
        #divForm ul{padding:5px 5px 0;}
        .form li{display:inline-block; height:28px;}
        #divGuide{background:#fff; overflow:auto;}
        #divGuide ul{padding:0 0 5px 5px; overflow:hidden;}
        #divGuide li{display:inline-block; border:solid 1px #99bbe8; cursor:pointer; background:#fff; width:70px; text-align:center; line-height:20px; margin:5px 5px 0 0;}
    </style>
</head>
<body>
    <input id="txtDate" type="hidden" value="<%=strDate%>" />
    <div id="divGuide" style="overflow:auto;border:solid 1px #ddd;"></div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript">
    $(window).load(function(){
        setBodySize();
        getGpsDeviceList();
    });
    
    $(window).resize(function(){
        setBodySize();
    });
    
    function setBodySize(){
        var bodySize = cms.util.getBodySize();
        $('#divGuide').height(bodySize.height);
    }
    
    function getGpsDeviceList(){
        var strDate = $('#txtDate').val().trim();
        if(strDate == ''){
            return false;
        }
        var urlparam = 'action=getGpsDeviceList&date=' + strDate;
        module.ajaxRequest({
            url: cms.util.path + '/ajax/gps.aspx',
            data: urlparam,
            callBack: showGpsDeviceList
        });
    }
    
    function showGpsDeviceList(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var list = jsondata.list;
        var strHtml = '<ul>';
        for(var i=0,c=list.length; i<c; i++){
            strHtml += '<li style="background:#008000;color:#fff;" ondblclick="setGpsDevice(\'' + list[i].dev + '\');">'
                + list[i].count + '<br />' + list[i].dev
                + '</li>';
        }
        strHtml += '</ul>';
        
        $('#divGuide').html(strHtml);
    }
    
    function setGpsDevice(devCode){
        var urlparam = 'action=getSingleDeviceBaseInfo&devCode=' + devCode;
        module.ajaxRequest({
            url: cms.util.path + '/ajax/device.aspx',
            data: urlparam,
            callBack: setGpsDeviceCallBack
        });        
    }
    
    function setGpsDeviceCallBack(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.dev == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        try{
            parent.parent.setGpsDevice(jsondata.dev);
        }catch(e){}
    }
</script>