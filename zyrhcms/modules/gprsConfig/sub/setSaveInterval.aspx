<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置保存间隔</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设置保存间隔</div>
        <div class="prompt">间隔多少秒设备保存一次GPS轨迹记录<br />保存间隔秒数最小不能小于<span id="lblMinSaveInterval">5</span>秒，建议设置为15秒左右</div>
        <div style="margin:5px 0 10px;">
            保存间隔：<input type="text" class="txt w40" id="txtSaveInterval" onkeyup="value=value.replace(/[^\d]/g,'')" style="text-align:center;" maxlength="5" /> 秒
        </div>
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getSaveInterval(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setSaveInterval(this);"><span class="w40">设置</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    //最小保存间隔，单位：秒
    gprsConfig.minSaveInterval = 5;
    
    $('#lblMinSaveInterval').html(gprsConfig.minSaveInterval);
    
    gprsConfig.getSaveInterval = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=save_interval';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getSaveInterval Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getSaveIntervalCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getSaveIntervalCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getSaveInterval Response] data: ' + data);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.content == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var setting = parseInt(jsondata.content, 10);
        $('#txtSaveInterval').attr('value', setting);
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
        gprsConfig.setControlDisabledByTiming(param.btn, false);
    };
    
    gprsConfig.setSaveInterval = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = $('#txtSaveInterval').val().trim();
        if('' == strSetting){
            cms.box.msgAndFocus(cms.util.$('txtSaveInterval'),{title: '提示信息',html:'请输入保存间隔。'});
            return false;
        }
        if(parseInt(strSetting, 10) < gprsConfig.minSaveInterval){
            cms.box.msgAndFocus(cms.util.$('txtSaveInterval'),{title: '提示信息',html:'保存间隔不能小于' + gprsConfig.minSaveInterval + '秒。'});
            return false;
        }
        var urlparam = 'action=setSaveInterval&devCode=' + strDevCode + '&setting=' + strSetting;
        module.appendDebugInfo(module.getDebugTime() + '[setSaveInterval Request] urlparam: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setSaveIntervalCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.setSaveIntervalCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setSaveInterval Response] data: ' + data);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var id = jsondata.list[0];
        gprsConfig.task.appendTaskList({id:id, action:'setSaveInterval', title:'设置保存间隔：' + param.setting + '秒', result:'正在设置，请稍候...'});
        gprsConfig.setControlDisabledByTiming(param.btn, false);
    };
    
    gprsConfig.getSaveInterval();
</script>