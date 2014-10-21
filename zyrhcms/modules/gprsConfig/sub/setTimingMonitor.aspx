<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置定时监控</title>
</head>
<body>
    <div id="divFormBody" class="formbody" style="padding-top:5px;">
        <div class="itemtitle"></div>
        <div style="line-height:20px;" class="prompt">
            说明：打开3G时间和关闭3G时间需同时设置。时间制式：24小时制。共有<span id="lblTimingMonitorNum"></span>组时间设置。<br />
            打开3G时间应小于关闭3G时间，且两组时间不能有交叉。
        </div>
    </div>
    <div id="divTimingMonitor" style="margin:0;padding:0 10px;max-width:620px; overflow:auto;"></div>
    <div style="clear:both;" class="formbottom">
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getTimingMonitor(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setTimingMonitor(this);"><span class="w40">设置</span></a>
        <label class="chb-label-nobg"><input type="checkbox" class="chb" id="chbTimingMonitorComplete" />完整设置</label>
        <a class="btn btnc24" id="btnClear" onclick="gprsConfig.setTimingMonitor(this, true);" style="margin-left:50px;"><span class="w85">清除定时监控</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    var timingMonitorMaxCount = 9;
    var timingMonitorClear = 'AHHmmHHmm1';
    var timingMonitorDel = 'HHmmHHmm1';
    var arrMonitorTime = [];
    
    $('#lblTimingMonitorNum').html(timingMonitorMaxCount);
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        if(timingMonitorMaxCount > 5){
            $('#divTimingMonitor').height(formSize.height - 55 - 45);
        }
    };
    
    gprsConfig.initialTimingMonitor = function(){
        var id = 0;
        var w = timingMonitorMaxCount >= 10 ? 72 : 65;
        var strHtml = '<ul style="overflow:hidden;">';
        var strOption = '<option value="-1">选择</option>';
        var strDisabled = ' disabled="disabled"';
        for(var i=0; i<timingMonitorMaxCount; i++){
            id = (i + 1);
            strHtml += '<li style="margin:0 0 ' + (i < timingMonitorMaxCount - 1 ? '10px' : '0') + ' 0;width:580px;height:23px;overflow:hidden; float:left; display:block;">'
                + '<label class="chb-label-nobg" style="float:left;">'
                + '<input type="checkbox" class="chb" name="chbTimingMonitor" id="chbTimingMonitor_' + id + '" value="' + id + '"'
                + (i > 0 ? strDisabled : '')
                + ' onclick="gprsConfig.setTimingMonitorControl(' + id + ',this)" />'
                + '<span style="width:' + w + 'px;">' + id + '.定时监控' + '</span>'
                + '</label>'
                + '<select id="ddlTimingMonitorType_' + id + '"' + strDisabled + ' class="select" style="margin-right:15px;">' + cms.util.buildOptions([['-1','选择类型'],['1','打开3G并录像'],['2','仅录像']], '0') + '</select>'
                + '打开时间'
                + '<select id="ddlTimingMonitorHourOpen_' + id + '"' + strDisabled + ' class="select" style="margin-left:3px;">' + strOption + cms.util.buildNumberOptions(0, 23, -1, 1, 2, '0') + '</select>'
                + '<b style="padding:0 2px;">:</b>'
                + '<select id="ddlTimingMonitorMinuteOpen_' + id + '"' + strDisabled + ' class="select" style="margin-right:15px;">' + strOption + cms.util.buildNumberOptions(0, 59, -1, 1, 2, '0') + '</select>'
                + '关闭时间'
                + '<select id="ddlTimingMonitorHourClose_' + id + '"' + strDisabled + ' class="select" style="margin-left:3px;">' + strOption + cms.util.buildNumberOptions(0, 23, -1, 1, 2, '0') + '</select>'
                + '<b style="padding:0 2px;">:</b>'
                + '<select id="ddlTimingMonitorMinuteClose_' + id + '"' + strDisabled + ' class="select">' + strOption + cms.util.buildNumberOptions(0, 59, -1, 1, 2, '0') + '</select>'
                + '</li>';
        }
        strHtml += '</ul>';
        $('#divTimingMonitor').html(strHtml);
        
        gprsConfig.setFormBodySize();
    };
    gprsConfig.initialTimingMonitor();
            
    gprsConfig.setTimingMonitorControl = function(num, chb, isClear){
        if(chb != null && chb.checked){
            $('#ddlTimingMonitorType_' + num).attr('disabled', false);
            $('#ddlTimingMonitorHourOpen_' + num).attr('disabled', false);
            $('#ddlTimingMonitorMinuteOpen_' + num).attr('disabled', false);
            $('#ddlTimingMonitorHourClose_' + num).attr('disabled', false);
            $('#ddlTimingMonitorMinuteClose_' + num).attr('disabled', false);
            if(num < timingMonitorMaxCount){
                $('#chbTimingMonitor_' + (num + 1)).attr('disabled', false);
            }
            $('#ddlTimingMonitorType_' + num).focus();
        } else {
            for(var i=num; i<=timingMonitorMaxCount; i++){
                if(i > num){
                    $('#chbTimingMonitor_' + i).attr('disabled', true);
                }
                $('#chbTimingMonitor_' + i).attr('checked', false);
                
                $('#ddlTimingMonitorType_' + i).attr('disabled', true);
                $('#ddlTimingMonitorHourOpen_' + i).attr('disabled', true);
                $('#ddlTimingMonitorMinuteOpen_' + i).attr('disabled', true);
                $('#ddlTimingMonitorHourClose_' + i).attr('disabled', true);
                $('#ddlTimingMonitorMinuteClose_' + i).attr('disabled', true);

                if(isClear){
                    $('#ddlTimingMonitor_' + i).attr('value', '0');
                    $('#ddlTimingMonitorHourOpen_' + i).attr('value', '-1');
                    $('#ddlTimingMonitorMinuteOpen_' + i).attr('value', '-1');
                    $('#ddlTimingMonitorHourClose_' + i).attr('value', '-1');
                    $('#ddlTimingMonitorMinuteClose_' + i).attr('value', '-1');
                }
            }
        }
    }; 
    
    gprsConfig.getTimingMonitor = function(btn){
        var strDevCode = devInfo.devCode;
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=timing_monitor';
        module.appendDebugInfo(module.getDebugTime() + '[getTimingMonitor Request] param: ' + urlparam);
    
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getTimingMonitorCallBack,
            param: {
                btn: btn
            }
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getTimingMonitorCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getTimingMonitor Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
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
                gprsConfig.setTimingMonitorControl(1, null, true);
            }
            for(var i=0; i<c; i++){
                var dr = setting[i];
                var arrOpen = dr.open.split(':');
                var arrClose = dr.close.split(':');
                
                $('#ddlTimingMonitorType_' + dr.num).attr('value', dr.type);
                $('#ddlTimingMonitorHourOpen_' + dr.num).attr('value', arrOpen[0]);
                $('#ddlTimingMonitorMinuteOpen_' + dr.num).attr('value', arrOpen[1]);
                $('#ddlTimingMonitorHourClose_' + dr.num).attr('value', arrClose[0]);
                $('#ddlTimingMonitorMinuteClose_' + dr.num).attr('value', arrClose[1]);
                
                $('#chbTimingMonitor_' + dr.num).attr('disabled', false);
                $('#chbTimingMonitor_' + dr.num).attr('checked', true);
                
                $('#ddlTimingMonitorType_' + dr.num).attr('disabled', false);
                $('#ddlTimingMonitorHourOpen_' + dr.num).attr('disabled', false);
                $('#ddlTimingMonitorMinuteOpen_' + dr.num).attr('disabled', false);
                $('#ddlTimingMonitorHourClose_' + dr.num).attr('disabled', false);
                $('#ddlTimingMonitorMinuteClose_' + dr.num).attr('disabled', false);
            }
            
            delete setting;
        }
        if(c < timingMonitorMaxCount){
            $('#chbTimingMonitor_' + (c + 1)).attr('disabled', false);
        }
        delete jsondata;
        
        gprsConfig.frame.setFormPrompt('读取完成');
    };
    
    gprsConfig.setTimingMonitor = function(btn, isClear){
        var strSetting = '';
        var isComplete = cms.util.$('chbTimingMonitorComplete').checked ? 1 : 0;
        arrMonitorTime.length = 0;
        
        if(isClear){
            strSetting = timingMonitorClear;
        } else {            
            if(1 == isComplete){
                var arrChb = cms.util.$N('chbTimingMonitor');
            } else {
                var arrChb = cms.util.getCheckBoxChecked('chbTimingMonitor');
            }
            if(arrChb.length > 0){
                for(var i=0,c=arrChb.length; i<c; i++){
                    var idx = parseInt(arrChb[i].value.trim(), 10);
                    strSetting += (i > 0 ? ',' : '');
                    if(arrChb[i].checked){
                        var arrTime = [];
                        arrTime[0] = idx;
                        arrTime[1] = $('#ddlTimingMonitorHourOpen_' + idx).val().trim();
                        arrTime[2] = $('#ddlTimingMonitorMinuteOpen_' + idx).val().trim();
                        arrTime[3] = $('#ddlTimingMonitorHourClose_' + idx).val().trim();
                        arrTime[4] = $('#ddlTimingMonitorMinuteClose_' + idx).val().trim();
                        arrTime[5] = $('#ddlTimingMonitorType_' + idx).val().trim();
                        
                        if(gprsConfig.checkTimingMonitor(arrTime, idx)){
                            strSetting += arrTime[0] + '_' + arrTime[1] + ':' + arrTime[2] + '_' + arrTime[3] + ':' + arrTime[4] + '_' + arrTime[5];
                            arrMonitorTime.push(arrTime);
                        } else {
                            return false;
                        }
                    } else {
                        strSetting += idx + '_' + timingMonitorDel;
                    }
                }
            } else {
                strSetting = timingMonitorClear;
            }
        }
        if(timingMonitorClear == strSetting){
            cms.box.confirm({
                title: '定时视频监控',
                html: '确定要清除全部定时视频监控时间吗？',
                callBack: gprsConfig.setTimingMonitorAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        } else {
            /*
            gprsConfig.setTimingMonitorAction(null, null, {
                btn: btn,
                setting: strSetting,
                isComplete: isComplete
            });
            */
            cms.box.confirm({
                title: '定时视频监控',
                html: '确定要设置定时视频监控时间吗？',
                callBack: gprsConfig.setTimingMonitorAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
    };
    
    gprsConfig.checkTimingMonitor = function(arrTime, idx){
        if(arrTime[5].equals('-1')){
            cms.box.msgAndFocus(cms.util.$('ddlTimingMonitorType_' + idx), {title: '提示信息', html:'请选择类型'});
            return false;
        } else if('-1' == arrTime[1] || '-1' == arrTime[2]){
            cms.box.msgAndFocus(cms.util.$(('-1' == arrTime[1] ? 'ddlTimingMonitorHourOpen_' : 'ddlTimingMonitorMinuteOpen_') + idx), {title: '提示信息', html:'请选择3G打开时间'});
            return false;
        } else if('-1' == arrTime[3] || '-1' == arrTime[4]){
            cms.box.msgAndFocus(cms.util.$(('-1' == arrTime[3] ? 'ddlTimingMonitorHourClose_' : 'ddlTimingMonitorMinuteClose_') + idx), {title: '提示信息', html:'请选择3G关闭时间'});
            return false;
        } else {
            var open = parseInt(arrTime[1] + arrTime[2], 10);
            var close = parseInt(arrTime[3] + arrTime[4], 10);            
            if(open >= close){
                cms.box.msgAndFocus(cms.util.$('ddlTimingMonitorHourOpen_' + idx), {title: '提示信息', html:'3G打开时间应小于3G关闭时间'});
                return false;            
            } else {
                var open1 = 0;
                var close1 = 0;
                for(var i=0,c=arrMonitorTime.length; i<c; i++){
                    open1 = parseInt(arrMonitorTime[i][1] + arrMonitorTime[i][2], 10);
                    close1 = parseInt(arrMonitorTime[i][3] + arrMonitorTime[i][4], 10);
                    if((open >= open1 && open <= close1) || (close >= open1 && close <= close1)){
                        cms.box.msgAndFocus(cms.util.$('ddlTimingMonitorHourOpen_' + idx), {title: '提示信息', html:'第' + idx + '组时间与第' + arrMonitorTime[i][0] + '组时间有交叉'});
                        return false;
                    }
                }
            }
        }
        return true;
    };
    
    gprsConfig.parseTimingMonitorType = function(type){
        if(type == undefined){
            return '';
        }
        return '1' == type ? '打开3G并录像' : '2' == type ? '仅录像' : '';
    };
    
    gprsConfig.setTimingMonitorAction = function(pwobj, pwReturn, param){
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
            urlparam = 'action=setTimingMonitor&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + timingMonitorMaxCount + '&complete=' + isComplete;
            isContinue = true;
        } else {
            if(pwReturn.dialogResult){
                strSetting = pwReturn.returnValue.setting;
                btn = pwReturn.returnValue.btn;
                isComplete = pwReturn.returnValue.isComplete;
                urlparam = 'action=setTimingMonitor&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + timingMonitorMaxCount + '&complete=' + isComplete;
                isContinue = true;
            }
        }
        if(isContinue){
            module.appendDebugInfo(module.getDebugTime() + '[setTimingMonitor Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setTimingMonitorCallBack,
                param: {
                    btn: btn,
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
    };
    
    gprsConfig.setTimingMonitorCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setTimingMonitor Response] data: ' + data);
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
            if(0 == param.isComplete && ac < timingMonitorMaxCount){
                if(0 == i){
                    gprsConfig.task.appendTaskList({id:id, action:'setTimingMonitor', title:'清除定时监控', result:'正在设置，请稍候...'});
                    n--;
                }
            }
            if(n >= 0){
                var arrTime = arrSetting[n].split('_');
                if(arrTime[1].equals(timingMonitorDel)){
                    gprsConfig.task.appendTaskList({id:id, action:'setTimingMonitor', title:'设置定时监控：' + arrTime[0] + '.' + (module.isDebug ? arrTime[1] : '') + ' 删除定时监控', result:'正在设置，请稍候...'});
                } else {
                    gprsConfig.task.appendTaskList({id:id, action:'setTimingMonitor', title:'设置定时监控：' + arrTime[0] + '.' + arrTime[1] + '-' + arrTime[2]
                        + ' ' + gprsConfig.parseTimingMonitorType(arrTime[3]), result:'正在设置，请稍候...'});
                }
            }
            n++;
        }
        if(param.setting.equals(timingMonitorClear)){
            gprsConfig.setTimingMonitorControl(1, null, true);
        }
    };
    
    gprsConfig.getTimingMonitor();
</script>