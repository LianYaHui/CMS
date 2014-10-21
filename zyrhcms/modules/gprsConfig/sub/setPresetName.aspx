<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置预置点名称</title>
</head>
<body>
    <div class="formbody" style="padding:0px;">
        <div class="listheader">
            <table class="tbheader" cellpadding="0" cellspacing="0" style="">
                <tr>
                    <td style="width:35px;">序号</td>
                    <td style="width:70px;">预置点编号</td>
                    <td style="width:240px;">预置点名称</td>
                    <td style="width:50px;">操作</td>
                    <td></td>
                </tr>
            </table>
        </div>
        <div class="list" id="listPreset">
            <table class="tblist" cellpadding="0" cellspacing="0" id="tbList" style=""></table>
            <span id="lblPreset"></span>
        </div>
        <div style="clear:both;" class="formbottom">
            <a class="btn btnc24" id="btnGetPreset" onclick="gprsConfig.getPresetList(this);"><span>读取预置点列表</span></a>
            <a class="btn btnc24" id="btnClearAll" onclick="gprsConfig.clearAllPresetName(this);" style="margin-left:20px;"><span>清除全部预置点文字</span></a>
            <a class="btn btnc24" id="btnSetAll" onclick="gprsConfig.setAllPresetName(this);"><span>设置全部预置点名称</span></a>
            <div style="float:left;margin-right:10px;">
            <label class="chb-label-nobg" style="float:left;"><input type="checkbox" id="chbFilterPreset" class="chb" checked="checked" />
                <span>过滤预置点：</span></label>
            <input type="text" class="txt w25" id="txtMin" value="100" maxlength="3" style="float:left;" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')"  />
            <span style="float:left;padding:0 5px;"> - </span>
            <input type="text" class="txt w25" id="txtMax" value="256" maxlength="3" style="float:left;" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')"  />
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        $('#listPreset').height(formSize.height - 25 - 45);
    };
    
    gprsConfig.setFormBodySize();
    
    gprsConfig.getFilterCon = function(){
        var min = Number($('#txtMin').val().trim());
        var max = Number($('#txtMax').val().trim());
        min = isNaN(min) || min < 0 || min > 256 ? 0 : min;
        max = isNaN(max) || max < 0 || max > 256 ? 0 : max;
        if(min > max){
            var temp = max;
            max = min;
            min = temp;
        }
        return [min, max];
    };
    
    gprsConfig.getPresetList = function(btn){
        var strDevCode = devInfo.devCode;
        var devId = devInfo.devId;
        var filter = gprsConfig.getFilterCon();
                
        var urlparam = 'action=getDevicePresetInfo&devId=' + devId + '&devCode=' + strDevCode + '&channelNo=1&min=' + filter[0] + '&max=' + filter[1] + '&deleted=0';
        
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getPresetList Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            url: cmsPath + '/ajax/device.aspx',
            data: urlparam,
            callBack: gprsConfig.getPresetListCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getPresetListCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getPresetList Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        
        gprsConfig.showPresetInfo(jsondata);
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
        gprsConfig.setControlDisabled(param.btn, false);
    };
    
    gprsConfig.showPresetInfo = function(jsondata){
        if(jsondata.list.length > 0){
            var objList = cms.util.$('tbList');
            var rid = 0;
            cms.util.clearDataRow(objList, 0);
            
            for(var i=0,c=jsondata.list.length; i<c; i++){
                var dr = jsondata.list[i];
                var row = objList.insertRow(rid);
                var rowData = [];
                var cellid = 0;
                var strName = '<input type="text" class="txt w200" name="txtPresetName" id="txtPresetName_' + dr.no + '" value="' + dr.name + '" lang="' + dr.no + '" maxlength="16" />';
                var strBtn = '<a class="btn btnc22" style="width:45px;" onclick="gprsConfig.setPresetName(this,' + dr.no + ');"><span>设置</span></a>';
                
                rowData[cellid++] = {html: (rid + 1), style:[['width','35px']]};
                rowData[cellid++] = {html: dr.no, style:[['width','70px']]};
                rowData[cellid++] = {html: strName, style:[['width','240px']]};
                rowData[cellid++] = {html: strBtn, style:[['width','50px']]};
                rowData[cellid++] = {html: '', style:[]};
                
                cms.util.fillTable(row, rowData);
                rid++;
            }
            $('#lblPreset').html('');
        } else {
            $('#lblPreset').html('没有设置预置点信息，请到视频预览模块先设置预置点。');
        }
    };
    
    gprsConfig.setPresetName = function(btn, presetNo){
        var config = {
            title: '提示信息',
            html: '确定要设置预置点' + presetNo + '的预置点名称吗？',
            callBack: gprsConfig.setPresetNameAction,
            returnValue: {
                action: 'setPresetName',
                btn: btn,
                presetNo: presetNo
            }      
        };
        cms.box.confirm(config);    
    };
    
    gprsConfig.setAllPresetName = function(btn){
        var config = {
            title: '提示信息',
            html: '确定要设置全部预置点名称吗？',
            callBack: gprsConfig.setPresetNameAction,
            returnValue: {
                action: 'setAllPresetName',
                btn: btn
            }      
        };
        cms.box.confirm(config);
    };
    
    gprsConfig.clearAllPresetName = function(btn){
        var config = {
            title: '提示信息',
            html: '确定要清除全部预置点文字吗？',
            callBack: gprsConfig.setPresetNameAction,
            returnValue: {
                action: 'clearAllPresetName',
                btn: btn
            }      
        };
        cms.box.confirm(config);
    };
    
    gprsConfig.setPresetNameAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var devCode = devInfo.devCode;
            var action = pwReturn.returnValue.action;
            var btn = pwReturn.returnValue.btn;
            var presetNo = pwReturn.returnValue.presetNo;
            var urlparam = 'action=';
            var strPrompt = '';
            var strPresetName = '';
            var strPresetNameList = '';
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            
            switch(action){
                case 'setPresetName':
                    strPresetName = $('#txtPresetName_' + presetNo).val().trim();
                    urlparam += action + '&setting=' + presetNo + ',' + escape(strPresetName);
                    strPrompt = '设置预置点名称，编号：' + presetNo;
                    
                    //设置预置点
                    gprsConfig.setSinglePresetNameAction(btn, devCode, presetNo, strPresetName);
                    break;
                case 'setAllPresetName':
                    var arr = cms.util.$N('txtPresetName');
                    for(var i=0,c=arr.length; i<c; i++){
                        if(i > 0){
                            strPresetNameList += '|';
                        }
                        strPresetNameList += arr[i].lang + ',' + escape(arr[i].value.trim());
                    }
                    urlparam += action + '&setting=' + strPresetNameList;
                    strPrompt = '设置预置点名称';
                    //先清除全部预置点文字
                    gprsConfig.clearAllPresetNameAction(btn, devCode, 1);
                    
                    var filter = gprsConfig.getFilterCon();
                    urlparam += '&devCode=' + devCode + '&channelNo=' + 1 + '&filter=' + filter[0] + ',' + filter[1];
                    
                    module.appendDebugInfo(module.getDebugTime() + '[' + action + ' Request] urlparam: ' + urlparam);
                    gprsConfig.ajaxRequest({
                        data: urlparam,
                        callBack: gprsConfig.setPresetNameCallBack,
                        param: {
                            btn: btn,
                            action: action,
                            prompt: strPrompt,
                            setting: strPresetNameList
                        }
                    });
                    break;
                case 'clearAllPresetName':
                    urlparam += action;
                    strPrompt = '清除全部预置点文字';
                    gprsConfig.clearAllPresetNameAction(btn, devCode, 1);
                    break;
            }
            
            //设置预置点239，这是设备软件逻辑设计
            gprsConfig.setSinglePresetNameAction(btn, devCode, 239, '预置点239');
        }
        pwobj.Hide();
    };
    
    gprsConfig.clearAllPresetNameAction = function(btn, devCode, presetNo){
        var urlparam = 'action=clearAllPresetName&devCode=' + devCode + '&setting=' + presetNo;        
        module.appendDebugInfo(module.getDebugTime() + '[clearAllPresetName Request] urlparam: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setPresetNameCallBack,
            param: {
                btn: btn,
                action: 'clearAllPresetName',
                prompt: '清除全部预置点文字'
            }
        });
    };
    
    gprsConfig.setSinglePresetNameAction = function(btn, devCode, presetNo, presetName){
        var urlparam = 'action=setPresetName&devCode=' + devCode + '&setting=' + presetNo + ',' + escape(presetName);
        module.appendDebugInfo(module.getDebugTime() + '[setPresetName Request] urlparam: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setPresetNameCallBack,
            param: {
                btn: btn,
                action: 'setPresetName',
                prompt: '设置预置点' + presetNo
            }
        });
    };
        
    gprsConfig.setPresetNameCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[' + param.action + ' Response] data: ' + data);
        if(param.btn != undefined){
            gprsConfig.setControlDisabledByTiming(param.btn, false);
        }
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var n = 0;
        var strPrompt = param.prompt;
        if(param.action == 'setAllPresetName'){
            var arrSetting = param.setting.split('|');          
            for(var i=0,c=jsondata.list.length; i<c; i++){
                var id = jsondata.list[i];
                try{
                    strPrompt = param.prompt + '，编号：' + arrSetting[i].split(',')[0];
                }catch(e){}
                gprsConfig.task.appendTaskList({id:id, action:param.action, title:strPrompt, result:'正在设置，请稍候...'});
                n++;
            }
        } else {            
            for(var i=0,c=jsondata.list.length; i<c; i++){
                var id = jsondata.list[i];
                gprsConfig.task.appendTaskList({id:id, action:param.action, title:strPrompt, result:'正在设置，请稍候...'});
                n++;
            }
        }
    };
    
    gprsConfig.getPresetList(cms.util.$('btnGetPreset'));
</script>