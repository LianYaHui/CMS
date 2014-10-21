<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>读取巡检点</title>
</head>
<body>
    <div class="formbody" style="padding:0;">
        <div class="listheader">
            <table class="tbheader" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:30px;">序号</td>
                    <td style="width:45px;">存储位</td>
                    <td style="width:55px;">任务ID</td>
                    <td style="width:150px;">巡检地点</td>
                    <td style="width:80px;">纬度</td>
                    <td style="width:80px;">经度</td>
                    <td style="width:75px;">巡检半径(m)</td>
                    <td></td>
                </tr>
            </table>
        </div>
        <div class="list" id="listPatrolTaskMemory">            
            <table class="tblist" id="tbPatrolTaskMemory" cellpadding="0" cellspacing="0"></table>
        </div>
        <div class="statusbar"><span id="ptPagination"></span></div>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.initialReadPatrolForm = function(){
        var strHtml = '<span>选择存储位</span>'
            + '<select class="select" id="ddlMemoryNoStart" style="margin:2px 3px 0;">' + cms.util.buildNumberOptions(1, 999, 1, 1) + '</select>'
            + '<span>-</span>'
            + '<select class="select" id="ddlMemoryNoEnd" style="margin:2px 3px 0;">' + cms.util.buildNumberOptions(1, 999, 30, 1) + '</select>'
            + '<a class="btn btnc22" style="margin-top:2px;" onclick="gprsConfig.readDevPatrol(this);"><span>开始读取</span></a>'
            + '<label id="lblReadPatrolPrompt"></label>';
        
        gprsConfig.frame.setFormPrompt(strHtml);
        
        gprsConfig.setFormBodySize();
    };
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        $('#listPatrolTaskMemory').height(formSize.height - 27 - 23);
    };
    
    gprsConfig.initialReadPatrolForm();
    
    gprsConfig.readDevPatrol = function(btn){
        var start = parseInt($('#ddlMemoryNoStart').val(), 10);
        var end = parseInt($('#ddlMemoryNoEnd').val(), 10);
        if(start > end){
            var temp = start;
            start = end;
            end = temp;
        }
        var strSetting = start + '_' + end;
        var urlparam = 'action=readPatrolPoint&devCode=' + devInfo.devCode + '&setting=' + strSetting;
        var strBoxHtml = '确定要读取设备巡检点吗？';
        cms.box.confirm({
            title: '读取设备巡检点',
            html: strBoxHtml,
            callBack: gprsConfig.readDevPatrolAction,
            returnValue: {
                btn: btn, 
                urlparam: urlparam,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.readDevPatrolAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var urlparam = pwReturn.returnValue.urlparam;
            var btn = pwReturn.returnValue.btn;
            module.appendDebugInfo(module.getDebugTime() + '[readPatrolTask Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.readDevPatrolCallBack,
                param: {
                    btn: btn
                }
            });
        }
    };
    
    gprsConfig.readDevPatrolCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readPatrolTask Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false, 10*1000);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }        
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'readPatrolTask', title:'读取设备巡检点', result:'正在读取，请稍候...', callBack:'gprsConfig.showDevPatrol', multiPacket:true});
        }
    };
    
    gprsConfig.showDevPatrol = function(strResult, bSuccess){
        if(bSuccess){
            var strContent = gprsConfig.getResponseProtocolContent(result);
            var arrTts = strContent.split('&');
            var objList = cms.util.$('tbPatrolTaskMemory');
            if(objList == null){
                return false;
            }
            cms.util.clearDataRow(objList, 0);
            
            for(var i=0; i<arrTts.length; i++){
                if(arrTts[i].trim() == '') continue;
                var rid = (i + 1);
                var row = objList.insertRow(i);
                var rowData = [];
                var cellid = 0;
                
                var arrCon = arrTts[i].split(',');
                if(arrCon.length < 6){
                    continue;
                }
                
                var strName = '<input type="text" class="txt-label" style="width:99%;" value="' + arrCon[2] + '" />';
                rowData[cellid++] = {html: rid, style:[['width','30px']]};
                rowData[cellid++] = {html: parseInt(arrCon[0], 10), style:[['width','45px']]};
                rowData[cellid++] = {html: arrCon[1], style:[['width','55px']]};
                rowData[cellid++] = {html: strName, style:[['width','144px'],['padding','0 3px']]};
                rowData[cellid++] = {html: arrCon[3], style:[['width','80px']]};
                rowData[cellid++] = {html: arrCon[4], style:[['width','80px']]};
                rowData[cellid++] = {html: arrCon[5], style:[['width','75px']]};
                rowData[cellid++] = {html: '', style:[]};
                
                cms.util.fillTable(row, rowData);
            }
        } else {            
            gprsConfig.frame.setFormPrompt('读取失败');
        }
    };
</script>