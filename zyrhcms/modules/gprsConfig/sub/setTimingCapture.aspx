<%@ Page Language="C#" %>
<script runat="server">
    protected string strAction = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        strAction = Public.RequestString("action");
    }
</script>
<!DOCTYPE html>
<html>
<head>
    <title>设置定时抓拍</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle"></div>
        <div class="prompt" style="line-height:20px;">
            说明：时间制式：24小时制。共有<span id="lblTimingCaptureNum"></span>组时间设置。每组时间间隔不得小于<span id="lblTimeingCaptureInterval">15分钟</span>。
        </div>
    </div>
    <div id="divTimingCapture" style="margin:0;padding:0 10px;max-width:620px;overflow:auto;"></div>
    <div style="clear:both;" class="formbottom">
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getTimingCapture(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setTimingCapture(this);"><span class="w40">设置</span></a>
        <label class="chb-label-nobg"><input type="checkbox" class="chb" id="chbTimingCaptureComplete" />完整设置</label>
        <a class="btn btnc24" id="btnClear" onclick="gprsConfig.setTimingCapture(this, true);" style="margin-left:50px;"><span class="w85">清除定时抓拍</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    var isCustomize = '<%=strAction%>' == 'dz';
    var timingCaptureMaxCount = isCustomize ? 24 : 5;
    //时间最少间隔，单位：秒
    var timingCaptureMinInterval = 30*60;
    var timingCaptureClear = 'AA';
    var timingCaptureDel = isCustomize ? 'A' : 'HHMM';
    var arrCaptureTime = [];
    
    var strFunctionAction = 'setTimingCaptureCustomize';
    
    $('#lblTimingCaptureNum').html(timingCaptureMaxCount);
    
    if(!isCustomize){
        $('#chbTimingCaptureComplete').attr('checked', true);
        $('#chbTimingCaptureComplete').attr('disabled', true);
        
        strFunctionAction = 'setTimingCapture';
    }
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        if(timingCaptureMaxCount > 12){
            $('#divTimingCapture').height(formSize.height - 40 - 45);
        }
    };
    
    gprsConfig.initialTimingCapture = function(){
        var id = 0;
        var w = timingCaptureMaxCount >= 10 ? 94 : 88;
        var mt = timingCaptureMaxCount > 12 ? 5 : 10;
        var strHtml = '<ul style="overflow:hidden;clear:both;">';
        var strOption = '<option value="-1">选择</option>';
        var strDisabled = ' disabled="disabled"';
        var lm = timingCaptureMaxCount % 2 == 0 ? 2 : 1;
        for(var i=0; i<timingCaptureMaxCount; i++){
            id = (i + 1);
            strHtml += '<li style="margin:0 0 ' + (i < timingCaptureMaxCount - lm ? '10px' : '0') + ' 0;padding:0;width:260px;height:23px;overflow:hidden; float:left; display:block;">'
                + '<label class="chb-label-nobg" style="float:left;">'
                + '<input type="checkbox" class="chb" name="chbTimingCapture" id="chbTimingCapture_' + id + '" value="' + id + '"'
                + (i > 0 ? strDisabled : '')
                + ' onclick="gprsConfig.setTimingCaptureControl(' + id + ',this)" />'
                + '<span style="width:' + w + 'px;">' + id + '.定时抓拍时间</span>'
                + '</label>'
                + '<select id="ddlTimingCaptureHour_' + id + '"' + strDisabled + ' class="select" style="margin-left:3px;">' + strOption + cms.util.buildNumberOptions(0, 23, -1, 1, 2, '0') + '</select>'
                + '<b style="padding:0 2px;">:</b>'
                + '<select id="ddlTimingCaptureMinute_' + id + '"' + strDisabled + ' class="select" style="margin-right:10px;">' + strOption + cms.util.buildNumberOptions(0, 59, -1, 1, 2, '0') + '</select>'
                + '</li>';
        }
        strHtml += '</ul>';
        $('#divTimingCapture').html(strHtml);
        
        if(module.isDebug){
            var arrInterval = [
                ['1800','30分钟'],
                ['900','15分钟'],
                ['600','10分钟'],
                ['300','5分钟'],
                ['180','3分钟']
            ];
            var strInterval = '<select class="select" onchange="gprsConfig.setTimeingCaptureInterval(this.value);">' + cms.util.buildOptions(arrInterval, '1800') + '</select>';
            $('#lblTimeingCaptureInterval').html(strInterval);
        }
        gprsConfig.setFormBodySize();
    };
    gprsConfig.initialTimingCapture();
    
    gprsConfig.setTimeingCaptureInterval = function(val){
        timingCaptureMinInterval = parseInt(val, 10);
    };
    
    gprsConfig.setTimingCaptureControl = function(num, chb, isClear){
        if(chb != null && chb.checked){
            $('#ddlTimingCaptureHour_' + num).attr('disabled', false);
            $('#ddlTimingCaptureMinute_' + num).attr('disabled', false);
            if(num < timingCaptureMaxCount){
                $('#chbTimingCapture_' + (num + 1)).attr('disabled', false);
            }
            $('#ddlTimingCaptureHour_' + num).focus();
        } else {
            for(var i=num; i<=timingCaptureMaxCount; i++){
                if(i > num){
                    $('#chbTimingCapture_' + i).attr('disabled', true);
                }
                $('#chbTimingCapture_' + i).attr('checked', false);
                
                $('#ddlTimingCaptureHour_' + i).attr('disabled', true);
                $('#ddlTimingCaptureMinute_' + i).attr('disabled', true);
                if(isClear){
                    $('#ddlTimingCaptureHour_' + i).attr('value', '-1');
                    $('#ddlTimingCaptureMinute_' + i).attr('value', '-1');
                }
            }
        }
    };
    
    gprsConfig.getTimingCapture = function(btn){
        var strDevCode = devInfo.devCode;
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=timing_capture';
        module.appendDebugInfo(module.getDebugTime() + '[getTimingCapture Request] param: ' + urlparam);
    
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getTimingCaptureCallBack,
            param: {
                btn: btn
            }
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getTimingCaptureCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getTimingCapture Response] data: ' + data);
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
                gprsConfig.setTimingCaptureControl(1, null, true);
            }
            for(var i=0; i<c; i++){
                var dr = setting[i];
                var arrTime = dr.time.split(':');
                
                $('#ddlTimingCaptureHour_' + dr.num).attr('value', arrTime[0]);
                $('#ddlTimingCaptureMinute_' + dr.num).attr('value', arrTime[1]);
                
                $('#chbTimingCapture_' + dr.num).attr('disabled', false);
                $('#chbTimingCapture_' + dr.num).attr('checked', true);
                $('#ddlTimingCaptureHour_' + dr.num).attr('disabled', false);
                $('#ddlTimingCaptureMinute_' + dr.num).attr('disabled', false);
            }
            
            delete setting;
        }
        if(c < timingCaptureMaxCount){
            $('#chbTimingCapture_' + (c + 1)).attr('disabled', false);
        }
        delete jsondata;
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
    };
    
    gprsConfig.setTimingCapture = function(btn, isClear){
        var strSetting = '';
        var isComplete = cms.util.$('chbTimingCaptureComplete').checked ? 1 : 0;
        arrCaptureTime.length = 0;
        
        if(isClear){
            strSetting = timingCaptureClear;
        } else {            
            if(1 == isComplete){
                var arrChb = cms.util.$N('chbTimingCapture');
            } else {
                var arrChb = cms.util.getCheckBoxChecked('chbTimingCapture');
            }
            if(arrChb.length > 0){
                for(var i=0,c=arrChb.length; i<c; i++){
                    var idx = parseInt(arrChb[i].value.trim(), 10);
                    strSetting += (i > 0 ? ',' : '');
                    if(arrChb[i].checked){
                        var arrTime = [];
                        arrTime[0] = idx;
                        arrTime[1] = $('#ddlTimingCaptureHour_' + idx).val().trim();
                        arrTime[2] = $('#ddlTimingCaptureMinute_' + idx).val().trim();
                        
                        if(gprsConfig.checkTimingCapture(arrTime, idx)){
                            strSetting += arrTime[0] + '_' + arrTime[1] + ':' + arrTime[2];
                            arrCaptureTime.push(arrTime);
                        } else {
                            return false;
                        }
                    } else {
                        strSetting += idx + '_' + timingCaptureDel;
                    }
                }
            } else {
                strSetting = timingCaptureClear;
            }
        }
        if(timingCaptureClear == strSetting){
            cms.box.confirm({
                title: '定时抓拍时间',
                html: '确定要清除全部定时抓拍时间吗？',
                callBack: gprsConfig.setTimingCaptureAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        } else {
            /*
            gprsConfig.setTimingCaptureAction(null, null, {
                btn: btn,
                setting: strSetting,
                isComplete: isComplete
            });
            */
            cms.box.confirm({
                title: '定时抓拍时间',
                html: '确定要设置定时抓拍时间吗？',
                callBack: gprsConfig.setTimingCaptureAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }        
    };
    
    gprsConfig.checkTimingCapture = function(arrTime, idx){
        if('-1' == arrTime[1] || '-1' == arrTime[2]){
            cms.box.msgAndFocus(cms.util.$(('-1' == arrTime[1] ? 'ddlTimingCaptureHour_' : 'ddlTimingCaptureMinute_') + idx), {title: '提示信息', html:'请选择时间'});
            return false;
        } else {
            var time = parseInt(arrTime[1] + arrTime[2], 10);         
            var time1 = 0;
            for(var i=0,c=arrCaptureTime.length; i<c; i++){
                time1 = parseInt(arrCaptureTime[i][1] + arrCaptureTime[i][2], 10);                
                var secords = gprsConfig.calculationTimeInterval(time, time1);
                if(secords < timingCaptureMinInterval){
                    cms.box.msgAndFocus(cms.util.$('ddlTimingCaptureHour_' + idx), {
                            title: '提示信息', 
                            html:'第' + idx + '组时间与第' + arrCaptureTime[i][0] + '组时间间隔' + gprsConfig.secordConvertMinute(secords) + '，小于' + (timingCaptureMinInterval/60) + '分钟'
                        }
                    );
                    return false;
                }
            }
        }
        return true;
    };
            
    gprsConfig.setTimingCaptureAction = function(pwobj, pwReturn, param){
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
            urlparam = 'action=' + strFunctionAction + '&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + timingCaptureMaxCount + '&complete=' + isComplete;
            isContinue = true;
        } else {
            if(pwReturn.dialogResult){
                strSetting = pwReturn.returnValue.setting;
                btn = pwReturn.returnValue.btn;
                isComplete = pwReturn.returnValue.isComplete;
                urlparam = 'action=' + strFunctionAction + '&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + timingCaptureMaxCount + '&complete=' + isComplete;
                isContinue = true;
            }
        }
        if(isContinue){
            module.appendDebugInfo(module.getDebugTime() + '[setTimingCapture Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setTimingCaptureCallBack,
                param: {
                    btn: btn,
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
    };
    
    gprsConfig.setTimingCaptureCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setTimingCapture Response] data: ' + data);
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
            if(0 == param.isComplete && ac < timingCaptureMaxCount){
                if(0 == i){
                    gprsConfig.task.appendTaskList({id:id, action:'setTimingCapture', title:'清除定时抓拍时间', result:'正在设置，请稍候...'});
                    n--;
                }
            }
            if(n >= 0){
                if(arrSetting[n].equals(timingCaptureClear)){
                    gprsConfig.task.appendTaskList({id:id, action:'setTimingCapture', title:'清除定时抓拍时间', result:'正在设置，请稍候...'});                
                } else {
                    var arrTime = arrSetting[n].split('_');
                    if(arrTime[1].equals(timingCaptureDel)){
                        gprsConfig.task.appendTaskList({id:id, action:'setTimingCapture', title:'设置定时抓拍时间：' + arrTime[0] + '.' + (module.isDebug ? arrTime[1] : '') + ' 删除定时抓拍时间', result:'正在设置，请稍候...'});
                    } else {
                        gprsConfig.task.appendTaskList({id:id, action:'setTimingCapture', title:'设置定时抓拍时间：' + arrTime[0] + '.' + arrTime[1], result:'正在设置，请稍候...'});                    
                    }
                }
            }
            n++;
        }
        if(param.setting.equals(timingCaptureClear)){
            gprsConfig.setTimingCaptureControl(1, null, true);
        }
    };
    
    gprsConfig.getTimingCapture();
</script>