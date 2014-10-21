<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ZJST.aspx.cs" Inherits="modules_safety_control_ZJST" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>所亭主接线图</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">var strImgPathDir = '<%=strImgPathDir%>'; var strImgPath = '<%=strImgPath%>';var strInfoType = '<%=strInfoType%>';</script>
    
    <script type="text/javascript">
        var eid = '<%=eid%>';
        var step = '<%=step%>';
        var sub = '<%=sub%>';
    </script>
</head>
<body>
    <div id="pageBody" class="hide">
        <div id="bodyMain">
            <div id="mainTitle" class="operbar operbar-h52">
                <div class="tools" style="float:left;padding:0 5px;">
                    <span>选择所亭：</span><select id="ddlSubstation" class="select" runat="server" onchange="showSubstationInfo(this);"></select>
                </div>                
                <div id="tabpanel" class="tabpanel"></div>
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
                <textarea id="txtResult" class="txt" style="width:100%;height:100px;padding:0;display:none;" readonly="readonly" cols="" rows=""></textarea>
            </div>
            <div class="statusbar statusbar-h30" style="text-align:center;">
                <a class="btn btnc24" onclick="saveContent(true);"><span class="w80">已查看，关闭</span></a>
                <a class="btn btnc24" onclick="cancel();"><span class="w50">取消</span></a>
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/omap.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="control.js"></script>
<script type="text/javascript">
    var paddingTop = 0;
    var paddingWidth = 5;
    var borderWidth = 2;
    var leftWidth = leftWidthConfig = 0;
    var rightWidth = rightWidthConfig =  0;
    var switchWidth = 0;
    var boxSize = {};
    
    var htPlanPreviewLog = new cms.util.Hashtable();
    var isInitialMap = false;
    
    var operH = 26;
    var statusBarH = 0;
    var dataCount = 0;
    var pageStart = 1;
    var pageIndex = pageStart;
    var pageSize = 100;

    var tabs = [
        {code: 'planegGaph', name: '主接线图', objName: 'picCanvas', load: false}
        /*
        {code: 'introduce', name: '简介', objName: 'infoBox', load: false}
        */
    ];
    var curTab = 'planegGaph';
        
    $(window).load(function(){
        cms.frame.setFrameSize(leftWidth, rightWidth);
        cms.frame.setPageBodyDisplay();
        
        setBodySize();
        
        initialForm();
        
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
        $('#mainContent').height(boxSize.height - 25 - 2 - operH - statusBarH);
        $('#mainContent').width(boxSize.width);
            
        $('#picCanvas').width(boxSize.width);
        $('#picCanvas').height(boxSize.height - 25 - 2 - operH - statusBarH);
        
        $('#infoBox').width(boxSize.width);
        $('#infoBox').height(boxSize.height - 25 - 2 - operH - statusBarH);
        
        $('#infoContent').width(boxSize.width);
        $('#infoContent').height(boxSize.height - 25 - 2 - operH - statusBarH);
        
        $('#infoDetail').height(boxSize.height - 25 - 2 - 75);
        
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
            isInitialMap = true;
        }
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
                    cms.util.$('ddlSubstation').value = jsondata.info.substationIndexCode;
                    showSubstationInfo();
                    delete jsondata;
                }
            }
        });
    };
    
    var showSubstationInfo = function(obj){
        if(obj == undefined){
            obj = cms.util.$('ddlSubstation');
        }
        var code = obj.value.trim();
        if(code != ''){
            var idx = obj.selectedIndex;
            var name = obj.options[idx].text;
            var strFilePath = strImgPath + '/upfiles/planeGraph/substation/' + code + '.jpg';
            if(isInitialMap){
                //设置地图背景
                omap.setMapBg(strFilePath);
            } else {            
                var mapOption = {
                    boxSize: boxSize,
                    mapBgFilePath: strFilePath,
                    mapTypeControl: false,
                    zoomControlOptions: {
                        y: 5
                    }
                };
                omap.initialEmap(cms.util.$('picCanvas'), mapOption);
            }
            
            if(!htPlanPreviewLog.contains(code)){
                var strResult = '查看 ' + name + ' 主接线图 [' + new Date().toString('yyyy-MM-dd HH:mm:ss') + ']\n';

                updateControlValue(eid, step, sub, false, true, strResult, true);
                
                htPlanPreviewLog.add(code, name);
            }
        }
    };
    
    var saveContent = function(isClose){
        var strResult = cms.util.$('txtResult').value.trim();
        
        updateControlValue(eid, step, sub, isClose, true, strResult, false);
    };

    var cancel = function(){
        updateControlValue(eid, step, sub, true);
    };
</script>