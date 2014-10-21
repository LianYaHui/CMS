<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>读取设备版本</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">读取设备版本</div>
        <div class="prompt">读取设备上的硬件/软件版本信息。</div>
        <span id="lblDevVersion"></span>
        <div style="margin:5px 0;">
            <a class="btn btnc24" id="btnRead" onclick="gprsConfig.readDevVersion(this);"><span class="w85">读取设备版本</span></a>
        </div>
        <span id="lblDevVersionRead"></span>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.getDevVersion = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=device_version';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getDevVersion Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getDevVersionCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    gprsConfig.getDevVersionCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getDevVersion Response] data: ' + data);
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
        var version = jsondata.content;
        $('#lblDevVersion').html('设备版本：' + version);
    };
    
    gprsConfig.getDevVersion();
    
    gprsConfig.readDevVersion = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=readVersion&devCode=' + strDevCode;
        module.appendDebugInfo(module.getDebugTime() + '[readVersion Request] param: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readDevVersionCallBack,
            param: {
                btn: btn
            }
        });
        $('#lblDevVersionRead').html('正在读取，请稍候...');
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.readDevVersionCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readVersion Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'readVersion', title:'读取设备版本', result:'正在读取，请稍候...', callBack:'gprsConfig.showDevVersion'});
    };
    
    gprsConfig.showDevVersion = function(strResult, bSuccess){
        if(bSuccess){
            $('#lblDevVersionRead').html('设备版本：' + strResult);
            gprsConfig.frame.setFormPrompt('读取完成');
            
            if(strResult != ''){
                //将读取回来的设备版本保存到数据库
                gprsConfig.updateDeviceConfig(devInfo.devCode, 'device_version', strResult);
            }
        } else {
            gprsConfig.frame.setFormPrompt('读取失败');
            $('#lblDevVersionRead').html('读取失败');
        }
    };
    
    if(gprsConfig.isAutoRead){
        gprsConfig.getDevVersion();
    }
</script>