<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置开、关屏时间</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="prompt">
            说明：开屏时间和关屏时间需同时设置。时间制式：24小时制。共有<span id="lblLedTimeNum"></span>组时间设置。<br />
            开屏时间应小于关屏时间，且两组时间不能有交叉。
        </div>
        <div id="divLedTime" style="margin:0;padding:0;max-width:620px; overflow:auto;"></div>
    </div>
    <div style="clear:both;" class="formbottom">
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.readLedTime(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setLedTime(this);"><span class="w40">设置</span></a>
        <label class="chb-label-nobg" style="display:none;"><input type="checkbox" class="chb" id="chbLedTimeComplete" checked="checked" />完整设置</label>
    </div>
</body>
</html>
<script type="text/javascript">
    var ledTimeMaxCount = 5;
    var ledTimeClear = 'AHHmmHHmm';
    var ledTimeDel = 'HHmmHHmm';
    var arrLedTime = [];
    
    $('#lblLedTimeNum').html(ledTimeMaxCount);
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        if(ledTimeMaxCount > 5){
            $('#divLedTime').height(formSize.height - 55 - 45);
        }
    };
    
    gprsConfig.initialLedTime = function(){
        var id = 0;
        var w = 45;
        var strHtml = '<ul style="overflow:hidden;">';
        var strOption = '<option value="-1">选择</option>';
        var strDisabled = ' disabled="disabled"';
        for(var i=0; i<ledTimeMaxCount; i++){
            id = (i + 1);
            strHtml += '<li style="margin:0 0 ' + (i < ledTimeMaxCount - 1 ? '10px' : '0') + ' 0;width:580px;height:23px;overflow:hidden; float:left; display:block;">'
                + '<label class="chb-label-nobg" style="float:left;margin-top:2px;">'
                + '<input type="checkbox" class="chb" name="chbLedTime" id="chbLedTime_' + id + '" value="' + id + '"'
                + (i > 0 ? strDisabled : '')
                + ' onclick="gprsConfig.setLedTimeControl(' + id + ',this)" />'
                + '<span style="width:' + w + 'px;">第' + id + '组</span>'
                + '</label>'
                + '开屏时间'
                + '<select id="ddlLedTimeHourOpen_' + id + '"' + strDisabled + ' class="select" style="margin-left:3px;">' + strOption + cms.util.buildNumberOptions(0, 23, -1, 1, 2, '0') + '</select>'
                + '<b style="padding:0 2px;">:</b>'
                + '<select id="ddlLedTimeMinuteOpen_' + id + '"' + strDisabled + ' class="select" style="margin-right:15px;">' + strOption + cms.util.buildNumberOptions(0, 59, -1, 1, 2, '0') + '</select>'
                + '关屏时间'
                + '<select id="ddlLedTimeHourClose_' + id + '"' + strDisabled + ' class="select" style="margin-left:3px;">' + strOption + cms.util.buildNumberOptions(0, 23, -1, 1, 2, '0') + '</select>'
                + '<b style="padding:0 2px;">:</b>'
                + '<select id="ddlLedTimeMinuteClose_' + id + '"' + strDisabled + ' class="select">' + strOption + cms.util.buildNumberOptions(0, 59, -1, 1, 2, '0') + '</select>'
                + '</li>';
        }
        strHtml += '</ul>';
        $('#divLedTime').html(strHtml);
        
        gprsConfig.setFormBodySize();
    };
    gprsConfig.initialLedTime();
            
    gprsConfig.setLedTimeControl = function(num, chb, isClear){
        if(chb != null && chb.checked){
            $('#ddlLedTimeHourOpen_' + num).attr('disabled', false);
            $('#ddlLedTimeMinuteOpen_' + num).attr('disabled', false);
            $('#ddlLedTimeHourClose_' + num).attr('disabled', false);
            $('#ddlLedTimeMinuteClose_' + num).attr('disabled', false);
            if(num < ledTimeMaxCount){
                $('#chbLedTime_' + (num + 1)).attr('disabled', false);
            }
            $('#ddlLedTimeHourOpen_' + num).focus();
        } else {
            for(var i=num; i<=ledTimeMaxCount; i++){
                if(i > num){
                    $('#chbLedTime_' + i).attr('disabled', true);
                }
                $('#chbLedTime_' + i).attr('checked', false);
                
                $('#ddlLedTimeHourOpen_' + i).attr('disabled', true);
                $('#ddlLedTimeMinuteOpen_' + i).attr('disabled', true);
                $('#ddlLedTimeHourClose_' + i).attr('disabled', true);
                $('#ddlLedTimeMinuteClose_' + i).attr('disabled', true);

                if(isClear){
                    $('#ddlLedTime_' + i).attr('value', '0');
                    $('#ddlLedTimeHourOpen_' + i).attr('value', '-1');
                    $('#ddlLedTimeMinuteOpen_' + i).attr('value', '-1');
                    $('#ddlLedTimeHourClose_' + i).attr('value', '-1');
                    $('#ddlLedTimeMinuteClose_' + i).attr('value', '-1');
                }
            }
        }
    }; 
    
    gprsConfig.setLedTime = function(btn, isClear){
        var strSetting = '';
        var isComplete = cms.util.$('chbLedTimeComplete').checked ? 1 : 0;
        arrLedTime.length = 0;
        
        if(isClear){
            strSetting = ledTimeClear;
        } else {
            if(1 == isComplete){
                var arrChb = cms.util.$N('chbLedTime');
            } else {
                var arrChb = cms.util.getCheckBoxChecked('chbLedTime');
            }
            if(arrChb.length > 0){
                for(var i=0,c=arrChb.length; i<c; i++){
                    var idx = parseInt(arrChb[i].value.trim(), 10);
                    strSetting += (i > 0 ? ',' : '');
                    if(arrChb[i].checked){
                        var arrTime = [];
                        arrTime[0] = idx;
                        arrTime[1] = $('#ddlLedTimeHourOpen_' + idx).val().trim();
                        arrTime[2] = $('#ddlLedTimeMinuteOpen_' + idx).val().trim();
                        arrTime[3] = $('#ddlLedTimeHourClose_' + idx).val().trim();
                        arrTime[4] = $('#ddlLedTimeMinuteClose_' + idx).val().trim();
                        
                        if(gprsConfig.checkLedTime(arrTime, idx)){
                            strSetting += arrTime[0] + '_' + arrTime[1] + ':' + arrTime[2] + '_' + arrTime[3] + ':' + arrTime[4];
                            arrLedTime.push(arrTime);
                        } else {
                            return false;
                        }
                    } else {
                        strSetting += idx + '_' + ledTimeDel;
                    }
                }
            } else {
                strSetting = ledTimeClear;
            }
        }
        if(ledTimeClear == strSetting){
            cms.box.confirm({
                title: '设置LED屏开关屏时间',
                html: '确定要清除开关屏时间吗？',
                callBack: gprsConfig.setLedTimeAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        } else {
            cms.box.confirm({
                title: '设置LED屏开关屏时间',
                html: '确定要设置开关屏时间吗？',
                callBack: gprsConfig.setLedTimeAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
    };
    
    gprsConfig.checkLedTime = function(arrTime, idx){
        if('-1' == arrTime[1] || '-1' == arrTime[2]){
            cms.box.msgAndFocus(cms.util.$(('-1' == arrTime[1] ? 'ddlLedTimeHourOpen_' : 'ddlLedTimeMinuteOpen_') + idx), {title: '提示信息', html:'请选择开屏时间'});
            return false;
        } else if('-1' == arrTime[3] || '-1' == arrTime[4]){
            cms.box.msgAndFocus(cms.util.$(('-1' == arrTime[3] ? 'ddlLedTimeHourClose_' : 'ddlLedTimeMinuteClose_') + idx), {title: '提示信息', html:'请选择关屏时间'});
            return false;
        } else {
            var open = parseInt(arrTime[1] + arrTime[2], 10);
            var close = parseInt(arrTime[3] + arrTime[4], 10);            
            if(open >= close){
                cms.box.msgAndFocus(cms.util.$('ddlLedTimeHourOpen_' + idx), {title: '提示信息', html:'开屏时间应小于关屏时间'});
                return false;            
            } else {
                var open1 = 0;
                var close1 = 0;
                for(var i=0,c=arrLedTime.length; i<c; i++){
                    open1 = parseInt(arrLedTime[i][1] + arrLedTime[i][2], 10);
                    close1 = parseInt(arrLedTime[i][3] + arrLedTime[i][4], 10);
                    if((open >= open1 && open <= close1) || (close >= open1 && close <= close1)){
                        cms.box.msgAndFocus(cms.util.$('ddlLedTimeHourOpen_' + idx), {title: '提示信息', html:'第' + idx + '组时间与第' + arrLedTime[i][0] + '组时间有交叉'});
                        return false;
                    }
                }
            }
        }
        return true;
    };
    
    gprsConfig.setLedTimeAction = function(pwobj, pwReturn, param){
        var strDevCode = devInfo.devCode;
        var isComplete = 0;
        var strSetting = '';
        var btn = null;
        var isContinue = false;
        var urlparam = '';
        if(param != undefined){
            strSetting = param.setting;
            btn = param.btn;
            isComplete = param.isComplete;
            urlparam = 'action=setLedScreenTime&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + ledTimeMaxCount + '&complete=' + isComplete;
            isContinue = true;
        } else {
            if(pwReturn.dialogResult){
                strSetting = pwReturn.returnValue.setting;
                btn = pwReturn.returnValue.btn;
                isComplete = pwReturn.returnValue.isComplete;
                urlparam = 'action=setLedScreenTime&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + ledTimeMaxCount + '&complete=' + isComplete;
                isContinue = true;
            }
        }
        
        if(isContinue){
            module.appendDebugInfo(module.getDebugTime() + '[setLedScreenTime Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setLedTimeCallBack,
                param: {
                    btn: btn,
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
    };
    
    gprsConfig.setLedTimeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setLedScreenTime Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var arrSetting = param.setting.split(',');
        var ac = arrSetting.length;
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var n = 0;
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'setLedScreenTime', title:'设置开关屏时间：' + param.setting, result:'正在设置，请稍候...'});
            n++;
        }
        if(param.setting.equals(ledTimeClear)){
            gprsConfig.setLedTimeControl(1, null, true);
        }
    };
    
    gprsConfig.readLedTime = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = '?';
        var urlparam = 'action=readLedScreenTime&devCode=' + strDevCode + '&setting=' + strSetting;
        module.appendDebugInfo(module.getDebugTime() + '[readLedScreenTime Request] param: ' + urlparam);
    
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readLedTimeCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.readLedTimeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readLedScreenTime Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var arrSetting = param.setting.split(',');
        var ac = arrSetting.length;
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var id = jsondata.list[0];
        gprsConfig.task.appendTaskList({id:id, action:'readLedTime', title:'读取开关屏时间', result:'正在读取，请稍候...', callBack:'gprsConfig.showLedTime'});
    };
    
    gprsConfig.showLedTime = function(strResult, bSuccess){
        if(bSuccess){
            alert(strResult);
            if(strResult != ''){
                //将读取回来的开关屏时间保存到数据库
                gprsConfig.updateDeviceConfig(devInfo.devCode, 'timing_on_off', strResult);
            }
        } else {
            gprsConfig.frame.setFormPrompt('读取失败');
        }
    };
    
    gprsConfig.getLedTime = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=timing_on_off';
        module.appendDebugInfo(module.getDebugTime() + '[getLedScreenTime Request] param: ' + urlparam);
    
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getLedTimeCallBack
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
        
    gprsConfig.getLedTimeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getLedScreenTime Response] data: ' + data);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.content == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var c = 0;
        if(jsondata.content != ''){
            var setting = eval('(' + jsondata.content + ')');
            c = setting.length;
            if(c > 0){
                gprsConfig.setLedTimeControl(1, null, true);
            }
            for(var i=0; i<c; i++){
                var dr = setting[i];
                var arrOpen = dr.open.split(':');
                var arrClose = dr.close.split(':');
                
                $('#ddlLedTimeHourOpen_' + dr.num).attr('value', arrOpen[0]);
                $('#ddlLedTimeMinuteOpen_' + dr.num).attr('value', arrOpen[1]);
                $('#ddlLedTimeHourClose_' + dr.num).attr('value', arrClose[0]);
                $('#ddlLedTimeMinuteClose_' + dr.num).attr('value', arrClose[1]);
                
                $('#chbLedTime_' + dr.num).attr('disabled', false);
                $('#chbLedTime_' + dr.num).attr('checked', true);
                
                $('#ddlLedTimeHourOpen_' + dr.num).attr('disabled', false);
                $('#ddlLedTimeMinuteOpen_' + dr.num).attr('disabled', false);
                $('#ddlLedTimeHourClose_' + dr.num).attr('disabled', false);
                $('#ddlLedTimeMinuteClose_' + dr.num).attr('disabled', false);
            }
            
            delete setting;
        }
        if(c < ledTimeMaxCount){
            $('#chbLedTime_' + (c + 1)).attr('disabled', false);
        }
        delete jsondata;
        
        gprsConfig.frame.setFormPrompt('读取完成');
    };
    gprsConfig.getLedTime();
    
    
    if(gprsConfig.isAutoRead){
        gprsConfig.readLedTime();
    }
</script>