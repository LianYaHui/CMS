<%@ Page Language="C#" AutoEventWireup="true" CodeFile="YJYA.aspx.cs" Inherits="modules_safety_control_YJYA" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript">
        var eid = '<%=eid%>';
        var step = '<%=step%>';
        var sub = '<%=sub%>';
        var pid = '<%=strProfessionId%>';
    </script>
    <style type="text/css">
        #mainContent table{border-collapse:collapse; border:solid 1px #ddd;}
        #mainContent table td{border:solid 1px #ddd;}
    </style>
</head>
<body>
    <div id="pageBody" class="hide">
        <div id="bodyLeft" style="background:#fff;">
            <div class="titlebar">
                <div class="title">搜索预案</div>
            </div>
            <div id="divForm"></div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>预案详情</span></div>
            </div>
            <div id="mainContent" style="overflow:auto;">
                <div style="padding:10px;max-width:720px;background:#fff;" id="divPlanContentPanel"></div>
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="control.js"></script>
<script type="text/javascript">
    var paddingTop = 4;
    var paddingWidth = 5;
    var borderWidth = 2;
    var leftWidth = leftWidthConfig = 300;
    var rightWidth = rightWidthConfig =  0;
    var switchWidth = 5;
    var boxSize = {};
    var htPlanPreviewLog = new cms.util.Hashtable();
    
    $(window).load(function(){
        cms.frame.setFrameSize(leftWidth, rightWidth);
        //setBodySize();
        cms.frame.setPageBodyDisplay();
        initialForm(pid);
        setBodySize();
        
        getPlanList();
    });
    
    $(window).resize(function(){
        setBodySize();
    });
    
    var setBodySize = function(){
        var frameSize = cms.frame.getFrameSize();
        leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
        
        $('#pageBody').css('padding-top', paddingTop);
    
        $('#bodyLeft').width(leftWidth - borderWidth);
        $('#bodyLeftSwitch').width(switchWidth);
        boxSize = {
            width: frameSize.width - leftWidth - switchWidth - borderWidth, 
            height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
        };
        $('#bodyMain').width(boxSize.width);
        $('#bodyMain').height(boxSize.height);
        $('#bodyLeft').height(boxSize.height);
        $('#bodyLeftSwitch').height(boxSize.height);
        
        setBoxSize();
    };

    var setBoxSize = function(){
        $('#divForm').height(boxSize.height - 25);
        $('#divPlanList').height(boxSize.height - 25 - 60);
        $('#mainContent').height(boxSize.height - 25);
    };

    var setLeftDisplay = function(obj){
        if(obj == undefined){
            obj = $('#bodyLeftSwitch');
        }
        cms.frame.setLeftDisplay($('#bodyLeft'), obj);
    };
    
    var initialForm = function(pid){
        $('#bodyLeftSwitch').click(function(){
            setLeftDisplay($(this));
        });
        var bodySize = cms.util.getBodySize();
        var strHtml = '<div style="height:60px;background:#dbebfe;padding:0 5px;">'
            + '<table><tr>'
            + '<td>专&nbsp;&nbsp;业：</td>'
            + '<td>'
            + '<label class="chb-label-nobg" style="margin:0 0 0 -4px;"><input type="checkbox" name="chbProfession" class="chb" value="1" /><span>接触网</span></label>'
            + '<label class="chb-label-nobg"><input type="checkbox" name="chbProfession" class="chb" value="2" /><span>变电</span></label>'
            + '<label class="chb-label-nobg"><input type="checkbox" name="chbProfession" class="chb" value="3" /><span>电力</span></label>'
            + '</td></tr>'
            + '<tr>'
            + '<td>关键字：</td>'
            + '<td><input type="text" class="txt w165" maxlength="32" id="txtPlanKeywords" />'
            + '<a class="btn btnc22" style="margin-left:5px;" onclick="getPlanList();"><span>搜索</span></a>'
            + '</td></tr></table>'
            + '</div>'
            + '<div class="listheader" style="height:25px;width:' + 298 + 'px;overflow:hidden;" id="divPlanHeader"></div>'
            + '<div style="height:' + (bodySize.height - 60) + 'px;width:' + 298 + 'px;overflow:auto;" id="divPlanList"></div>';
        cms.util.$('divForm').innerHTML = strHtml;
        
        var objHeader = cms.util.$('divPlanHeader');
        strHtml = '<table class="tbheader" cellpadding="0" cellspacing="0" style="width:' + 298 + 'px;" >'
            + '<tr class="trheader"><td style="width:30px;">序号</td><td>预案名称</td></tr>'
            + '</table>';
        objHeader.innerHTML = strHtml;
        
        cms.util.setCheckBoxChecked('chbProfession', ',', pid);
    };
    
    var getPlanList = function(){
        var professionIdList = cms.util.getCheckBoxCheckedValue('chbProfession', ',');
        var strKeywords = cms.util.$('txtPlanKeywords').value.trim();
        var urlparam = 'action=getResponsePlan&professionIdList=' + professionIdList + '&keywords=' + escape(strKeywords);
        $.ajax({
            type: "post", 
            //async: false, //同步
            datatype: 'json',
            url: cms.util.path + '/ajax/planManage.aspx',
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
                    buildPlanList(jsondata, strKeywords);
                }
            }
        });
    };
    
    var buildPlanList = function(jsondata, strKeywords){
        var obj = cms.util.$('divPlanList');

        var strHtml = '';
        if(jsondata.list.length > 0){
            strHtml += '<table class="tblist" cellpadding="0" cellspacing="0" style="width:' + (298 - 17) + 'px;" >';
            for(var i=0,c=jsondata.list.length; i<c; i++){
                var dr = jsondata.list[i];
                var rid = (i+1);
                strHtml += '<tr><td style="width:30px;">' + rid + '</td>';
                strHtml += '<td onclick="getPlanDetail(' + dr.id + ');" style="text-align:left;cursor:pointer;">'
                    + cms.util.fixedCellWidth(dr.name, 240, true, dr.name)
                    + '</td>';
                strHtml += '</tr>';
            }
            strHtml += '</table>';
        } else {
            strHtml += '<div style="padding:5px;">没有搜索到相关的预案信息';
            if(!strKeywords.equals(string.empty)){
                strHtml += '<br />'
                    + '建议您将搜索关键字作拆分处理<br />'
                    + '比如：<br />'
                    + '将“接触网抢修预案”拆分成“接触网 抢修 预案”'
                    + '</div>';
            }
        }
        obj.innerHTML = strHtml;
        
        delete strHtml;
    };
    
    var getPlanDetail = function(id){
        var urlparam = 'action=getSingleResponsePlan&id=' + id;
        $.ajax({
            type: "post", 
            //async: false, //同步
            datatype: 'json',
            url: cms.util.path + '/ajax/planManage.aspx',
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
                    showPlanDetail(jsondata);
                    delete jsondata;
                }
            }
        });
    };

    var showPlanDetail = function(jsondata){
        var obj = cms.util.$('divPlanContentPanel');
        var plan = jsondata.plan;
        obj.innerHTML = jsondata.plan.content;
        
        $('#mainTitle .title span').html(plan.name);
        
        savePlanPreviewLog(plan.id, plan.name);
    };
    
    var savePlanPreviewLog = function(planId, planName){
        if(!htPlanPreviewLog.contains(planId)){
            var strResult = '预案名称：' + planName + '，调阅时间：' + new Date().toString('yyyy-MM-dd HH:mm:ss') + '\r\n';
            
            updateControlValue(eid, step, sub, false, true, strResult, true);
            
            htPlanPreviewLog.add(planId, planName);
        }
    };
</script>