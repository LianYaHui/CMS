<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>里程设置</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">里程初始化</div>
        <div class="prompt"></div>
        <div style="margin:5px 0 10px;">
            初始里程：<input type="text" class="txt w60" id="txtMileage" style="text-align:center;" maxlength="10" /> 米
        </div>
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getMileage(this);"><span class="w40">读取</span></a>
        
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setMileage(this);"><span class="w40">设置</span></a>
        
        <a class="btn btnc24" id="btnDel" onclick="gprsConfig.clearMileage(this);"><span class="w65">里程清零</span></a>
        
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.minMileage = 1;
    gprsConfig.getMileage = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=mileage';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getMileage Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getMileageCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getMileageCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getMileage Response] data: ' + data);
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
        var setting = jsondata.content.split(',');
        $('#txtMileage').attr('value', setting);
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
    };
    
    gprsConfig.setMileage = function(btn){
        if(loginUser.userName != 'admin' || loginUser.userId != '1'){
            return false;
        }
        var strDevCode = devInfo.devCode;
        var strSetting = $('#txtMileage').val().trim();
        if('' == strSetting){
            cms.box.msgAndFocus(cms.util.$('txtMileage'),{title: '提示信息',html:'请输入里程数值。'});
            return false;
        }
        if(parseInt(strSetting, 10) < gprsConfig.minMileage){
            cms.box.msgAndFocus(cms.util.$('txtMileage'),{title: '提示信息',html:'初始里程不能小于' + gprsConfig.minMileage + '米。'});
            return false;
        }
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        
        var urlparam = 'action=setMileage&devCode=' + strDevCode + '&setting=' + strSetting;
        module.appendDebugInfo(module.getDebugTime() + '[setMileage Request] urlparam: ' + urlparam);

        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setMileageCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });     
    };
    
    gprsConfig.setMileageCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setMileage Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setMileage', title: '设置里程初始值：' + param.setting + '米', result:'正在设置，请稍候...'});
    };
    
    gprsConfig.clearMileage = function(btn){
        if(loginUser.userName != 'admin' || loginUser.userId != '1'){
            return false;
        }
        var strDevCode = devInfo.devCode;
        var strSetting = 'ALL';
        var urlparam = 'action=clearMileage&devCode=' + strDevCode + '&setting=' + strSetting;        
        cms.box.confirm({
            title: '里程清零',
            html: '确定要里程清零吗？',
            callBack: gprsConfig.clearMileageAction,
            returnValue: {
                btn: btn,
                urlparam: urlparam,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.clearMileageAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var urlparam = pwReturn.returnValue.urlparam;
            var btn = pwReturn.returnValue.btn;
            var strSetting = pwReturn.returnValue.setting;
            module.appendDebugInfo(module.getDebugTime() + '[clearMileage Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.clearMileageCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
        pwobj.Hide();
    };
    
    gprsConfig.clearMileageCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[clearMileage Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'clearMileage', title:'里程清零', result:'正在删除，请稍候...'});
    };
    
    gprsConfig.getMileage();
</script>