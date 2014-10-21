<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置保存条数</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设置保存条数</div>
        <div class="prompt">设备存储多少条GPS记录后上传到服务器<br />保存条数最大不能超过<span id="lblMaxSaveQuantity">6000</span>条</div>
        <div style="margin:5px 0 10px;">
            保存条数：<input type="text" class="txt w40" id="txtSaveQuantity" onkeyup="value=value.replace(/[^\d]/g,'')" style="text-align:center;" maxlength="4" /> 条
        </div>
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getSaveQuantity(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setSaveQuantity(this);"><span class="w40">设置</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    //最大保存条数
    gprsConfig.maxSaveQuantity = 6000;
    
    $('#lblMaxSaveQuantity').html(gprsConfig.maxSaveQuantity);
    
    gprsConfig.getSaveQuantity = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=save_quantity';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getSaveQuantity Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getSaveQuantityCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getSaveQuantityCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getSaveQuantity Response] data: ' + data);
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
        var setting = parseInt(jsondata.content, 10);
        $('#txtSaveQuantity').attr('value', setting);
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
    };
    
    gprsConfig.setSaveQuantity = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = $('#txtSaveQuantity').val().trim();
        if('' == strSetting){
            cms.box.alert({title: '提示信息',html:'请输入保存条数。'});
            return false;
        }
        if(parseInt(strSetting, 10) > gprsConfig.maxSaveQuantity){
            cms.box.msgAndFocus(cms.util.$('txtSaveQuantity'),{title: '提示信息',html:'保存条数不能超过' + gprsConfig.maxSaveQuantity + '条。'});
            return false;
        }
        var urlparam = 'action=setSaveQuantity&devCode=' + strDevCode + '&setting=' + strSetting;
        module.appendDebugInfo(module.getDebugTime() + '[setSaveQuantity Request] urlparam: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setSaveQuantityCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.setSaveQuantityCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setSaveQuantity Response] data: ' + data);
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
        var id = jsondata.list[0];
        gprsConfig.task.appendTaskList({id:id, action:'setSaveQuantity', title:'设置保存条数：' + param.setting + '条', result:'正在设置，请稍候...'});
    };
    
    gprsConfig.getSaveQuantity();
</script>