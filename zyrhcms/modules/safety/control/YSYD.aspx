<%@ Page Language="C#" AutoEventWireup="true" CodeFile="YSYD.aspx.cs" Inherits="modules_safety_control_YSYD" %>
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
    <%=strCode%>
    <script type="text/javascript">
        var eid = '<%=eid%>';
        var step = '<%=step%>';
        var sub = '<%=sub%>';
    </script>
</head>
<body>
    <div id="pageBody" class="hide">
        <div id="bodyMain">
            <div id="mainTitle" class="operbar">
                <div class="tools" style="float:left;padding:0 5px;">
                    <span>选择所亭：</span><select id="ddlSubstation" class="select" runat="server" onchange="showSubstationPage(this);"></select>
                </div>
            </div>
            <div id="mainContent" style="overflow:auto;">
                <iframe id="frmMain" src="" frameborder="0" width="100%" scrolling="auto" style="border:none;"></iframe>
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
    
    var operH = 26;
    var statusBarH = 0;
    var dataCount = 0;
    var pageStart = 1;
    var pageIndex = pageStart;
    var pageSize = 100;
        
    $(window).load(function(){
        cms.frame.setFrameSize(leftWidth, rightWidth);
        initialForm();
        cms.frame.setPageBodyDisplay();
        
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
        $('#mainContent').height(boxSize.height - 25 - 2 - statusBarH);
        $('#mainContent').width(boxSize.width);
        
        $('#frmMain').width(boxSize.width - (cms.util.isMSIE ? 0 : 0));
        $('#frmMain').height(boxSize.height - 25 - 2 - statusBarH - (cms.util.isMSIE ? 2 : 0));
    };
    
    var initialForm = function(){
        var bodySize = cms.util.getBodySize();
            
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
                    showSubstationPage();
                    delete jsondata;
                }
            }
        });
    };
    
    var showSubstationPage = function(obj){
        if(obj == undefined){
            obj = cms.util.$('ddlSubstation');
        }
        var code = obj.value.trim();
        if(code != ''){
            var idx = obj.selectedIndex;
            var name = obj.options[idx].text;
            
            var url = thirdPartyPage.subStation.format(code);
            $('#frmMain').attr('src', url);
            
            if(!htPlanPreviewLog.contains(code)){
                var strResult = '查看 ' + name + ' 一所一档资料 [' + new Date().toString('yyyy-MM-dd HH:mm:ss') + ']\n';
                //$('#txtResult').append(strResult);
                
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