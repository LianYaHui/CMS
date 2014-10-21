<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置管理员号码</title>
</head>
<body>
    <div class="formbody" style="padding:2px 10px 3px;">
        <div class="itemtitle"></div>
        <div class="prompt">
            说明：管理员号码共<span id="lblManagerPhoneNum"></span>个，需依次设置。
        </div>
    </div>
    <div id="divManagerPhone" style="margin:0;padding:0;max-width:620px;overflow:auto;"></div>
    <div id="divManagerPhoneResult" style="padding:0 10px;"></div>
    <div style="clear:both;" class="formbottom">
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getManagerPhone(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setManagerPhone(this);"><span class="w40">设置</span></a>
        <label class="chb-label-nobg"><input type="checkbox" class="chb" id="chbManagerPhoneComplete" />完整设置</label>
        <a class="btn btnc24" id="btnClear" onclick="gprsConfig.setManagerPhone(this, true);" style="margin-left:50px;"><span class="w90">清除管理员号码</span></a>
        <a class="btn btnc24" id="btnRead" style="margin-left:52px;" onclick="gprsConfig.readManagerPhone(this);"><span style="width:140px;">读取设备上的管理员号码</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    var managerPhoneMaxCount = 9;
    var managerPhoneClear = 'AD';
    var managerPhoneDel = 'D';
    
    $('#lblManagerPhoneNum').html(managerPhoneMaxCount);
    if(50106 != devInfo.typeCode){
        $('#btnRead').hide();
    }
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        if(managerPhoneMaxCount <= 9){
            $('#divManagerPhone').height(110);
        }
        else if(managerPhoneMaxCount > 18){
            $('#divManagerPhone').height(formSize.height - 30 - 45);
        }
    };
    
    gprsConfig.initialManagerPhone = function(){
        var id = 0;
        var wl = managerPhoneMaxCount >= 10 ? 180 : 175;
        var w = managerPhoneMaxCount >= 10 ? 85 : 78;
        var strHtml = '<ul style="overflow:hidden;">';
        var lm = managerPhoneMaxCount % 3 == 0 ? 3 : managerPhoneMaxCount % 3;
        for(var i=0; i<managerPhoneMaxCount; i++){
            id = (i + 1);
            strHtml += '<li style="margin:0 0 ' + (i < managerPhoneMaxCount - lm ? '10px' : '0') + ' 10px;width:' + wl + 'px;height:23px;overflow:hidden; float:left; display:block;">'
                + '<label class="chb-label-nobg" style="float:left;">'
                + '<input type="checkbox" class="chb" name="chbManagerPhone" id="chbManagerPhone_' + id + '" value="' + id + '"'
                + (i > 0 ? ' disabled="disabled"' : '')
                + ' onclick="gprsConfig.setManagerPhoneControl(' + id + ',this)" />'
                + '<span style="width:' + w + 'px;">' + id + '.管理员号码</span>'
                + '</label>'
                + '<input type="text" class="txt w70" name="txtManagerPhone" id="txtManagerPhone_' + id + '" maxlength="11" style="float:left;" disabled="disabled" />'
                + '</li>';
        }
        strHtml += '</ul>';
        $('#divManagerPhone').html(strHtml);
        
        gprsConfig.setFormBodySize();
    };
    gprsConfig.initialManagerPhone();
    
    gprsConfig.setManagerPhoneControl = function(num, chb, isClear){
        if(chb != null && chb.checked){
            $('#txtManagerPhone_' + num).attr('disabled', false);
            if(num < managerPhoneMaxCount){
                $('#chbManagerPhone_' + (num + 1)).attr('disabled', false);
            }
            $('#txtManagerPhone_' + num).focus();
        } else {
            for(var i=num; i<=managerPhoneMaxCount; i++){
                if(i > num){
                    $('#chbManagerPhone_' + i).attr('disabled', true);
                }
                $('#chbManagerPhone_' + i).attr('checked', false);
                $('#txtManagerPhone_' + i).attr('disabled', true);
                if(isClear){
                    $('#txtManagerPhone_' + i).attr('value', '');
                }
            }
        }
    }; 
    
    gprsConfig.getManagerPhone = function(btn){
        var strDevCode = devInfo.devCode;
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }        
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=manager_phone';
        module.appendDebugInfo(module.getDebugTime() + '[getManagerPhone Request] param: ' + urlparam);
    
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getManagerPhoneCallBack,
            param: {
                btn: btn
            }
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getManagerPhoneCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getManagerPhone Response] data: ' + data);
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
                gprsConfig.setManagerPhoneControl(1, null, true);
            }
            for(var i=0; i<c; i++){                
                var dr = setting[i];
                $('#txtManagerPhone_' + dr.num).attr('value', dr.phone);
                
                $('#chbManagerPhone_' + dr.num).attr('disabled', false);
                $('#chbManagerPhone_' + dr.num).attr('checked', true);
                $('#txtManagerPhone_' + dr.num).attr('disabled', false);
            }
            
            delete setting;
        }
        if(c < managerPhoneMaxCount){
            $('#chbManagerPhone_' + (c + 1)).attr('disabled', false);
        }
        
        delete jsondata;

        gprsConfig.frame.setFormPrompt('读取完成');
    };
    
    gprsConfig.setManagerPhone = function(btn, isClear){
        var strSetting = '';
        var isComplete = cms.util.$('chbManagerPhoneComplete').checked ? 1 : 0;
        if(isClear){
            strSetting = managerPhoneClear;
        } else {
            if(1 == isComplete){
                var arrChb = cms.util.$N('chbManagerPhone');
            } else {
                var arrChb = cms.util.getCheckBoxChecked('chbManagerPhone');
            }
            
            if(arrChb.length > 0){
                var pattern = /^1[3|4|5|8][0-9]\d{8}$/;
                var htPhone = new cms.util.Hashtable();
                for(var i=0,c=arrChb.length; i<c; i++){
                    var idx = parseInt(arrChb[i].value.trim(), 10);
                    strSetting += (i > 0 ? ',' : '');
                    if(arrChb[i].checked){
                        var pval = $('#txtManagerPhone_' + idx).val().trim();
                        if(pval.equals('')){
                            cms.box.msgAndFocus(cms.util.$('txtManagerPhone_' + idx), {title: '提示信息', html:'请输入管理员号码'});
                            return false;
                        } else if(!pattern.test(pval)){
                            cms.box.msgAndFocus(cms.util.$('txtManagerPhone_' + idx), {title: '提示信息', html:'手机号码格式错误'});
                            return false;
                        } else {
                            if(htPhone.contains(pval)){
                                cms.box.msgAndFocus(cms.util.$('txtManagerPhone_' + idx), {title: '提示信息', html:'管理员号码已存在，不能重复'});
                                return false;
                            } else {
                                htPhone.add(pval);
                                strSetting += idx + '_' + pval;
                            }
                        }
                    } else {
                        strSetting += idx + '_' + managerPhoneDel;
                    }
                }
            } else {
                strSetting = managerPhoneClear;
            }
        }
        if(managerPhoneClear == strSetting){
            cms.box.confirm({
                title: '管理员号码',
                html: '确定要清除全部管理员号码吗？',
                callBack: gprsConfig.setManagerPhoneAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        } else {
            /*
            gprsConfig.setManagerPhoneAction(null, null, {
                btn: btn,
                setting: strSetting,
                isComplete: isComplete
            });
            */
            cms.box.confirm({
                title: '管理员号码',
                html: '确定要设置管理员号码吗？',
                callBack: gprsConfig.setManagerPhoneAction,
                returnValue: {
                    btn: btn, 
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
        delete strSetting;
    };
    
    gprsConfig.setManagerPhoneAction = function(pwobj, pwReturn, param){
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
            urlparam = 'action=setManagerPhone&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + managerPhoneMaxCount + '&complete=' + isComplete;
            isContinue = true;
        } else {
            if(pwReturn.dialogResult){
                strSetting = pwReturn.returnValue.setting;
                btn = pwReturn.returnValue.btn;
                isComplete = pwReturn.returnValue.isComplete;
                urlparam = 'action=setManagerPhone&devCode=' + strDevCode + '&setting=' + strSetting + '&settingCount=' + managerPhoneMaxCount + '&complete=' + isComplete;
                isContinue = true;
            }
        }
        if(isContinue){
            module.appendDebugInfo(module.getDebugTime() + '[setManagerPhone Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setManagerPhoneCallBack,
                param: {
                    btn: btn,
                    setting: strSetting,
                    isComplete: isComplete
                }
            });
        }
    };
    
    gprsConfig.setManagerPhoneCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setManagerPhone Response] data: ' + data);
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
            if(0 == param.isComplete && ac < managerPhoneMaxCount){
                if(0 == i){
                    gprsConfig.task.appendTaskList({id:id, action:'setManagerPhone', title:'清除管理员号码', result:'正在设置，请稍候...'});
                    n--;
                }
            }
            if(n >= 0){
                var arrPhone = arrSetting[n].split('_');
                if(arrPhone[1].equals(managerPhoneDel)){
                    gprsConfig.task.appendTaskList({id:id, action:'setManagerPhone', title:'设置管理员号码：' + arrPhone[0] + '.' + (module.isDebug ? arrPhone[1] : '') + ' 删除管理员号码', result:'正在设置，请稍候...'});                
                } else {
                    gprsConfig.task.appendTaskList({id:id, action:'setManagerPhone', title:'设置管理员号码：' + arrPhone[0] + '.' + arrPhone[1], result:'正在设置，请稍候...'});
                }
            }
            n++;
        }
        if(param.setting.equals(managerPhoneClear)){
            gprsConfig.setManagerPhoneControl(1, null, true);
        }
    };
    
    gprsConfig.readManagerPhone = function(btn){
        var urlparam = 'action=readManagerPhone&devCode=' + devInfo.devCode;
        module.appendDebugInfo(module.getDebugTime() + '[readManagerPhone Request] urlparam: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readManagerPhoneCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    gprsConfig.readManagerPhoneCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readManagerPhone Response] data: ' + data);
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
        var n = 0;
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'readManagerPhone', title:'读取管理员号码', result:'正在读取，请稍候...', callBack:'gprsConfig.showManagerPhone'});
        }
    };
    
    gprsConfig.showManagerPhone = function(strResult, bSuccess){
        if(bSuccess){
            var strContent = gprsConfig.getResponseProtocolContent(strResult);
            $('#divManagerPhoneResult').html('读取到的管理员号码：' + strContent.replace(/(\*\*)/g, ' ').replace(/(\*)/g, '').replace(/\s+/g, '、'));
        } else {
            $('#divManagerPhoneResult').html('管理员号码读取失败');        
        }
    };
    
    gprsConfig.getManagerPhone();
</script>