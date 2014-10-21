<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设备手动校时</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">读取设备时钟</div>
        <div class="prompt">读取设备上的当前时钟时间。</div>
        <div style="margin:5px 0;">
            <a class="btn btnc24" id="btnRead" onclick="gprsConfig.readDevClock(this);"><span class="w85">读取设备时钟</span></a>
        </div>
        <span id="lblDevClock"></span>
        <!--
        <hr style="margin:10px 0;" />
        <div class="itemtitle">设备手动校时</div>
        <div class="prompt">注：手动校时指令设备暂时不会回复</div>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setDevClock(this);"><span class="w85">设备手动校时</span></a>
        -->
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.readDevClock = function(btn){
        var strDevCode = devInfo.devCode;
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        var urlparam = 'action=readClock&devCode=' + strDevCode;
        module.appendDebugInfo(module.getDebugTime() + '[readClock Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readDevClockCallBack,
            param: {
                btn: btn
            }
        });
        
        $('#lblDevClock').html('正在读取，请稍候...');
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.readDevClockCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readClock Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'readClock', title:'读取设备时钟', result:'正在读取，请稍候...', callBack:'gprsConfig.showDevClock'});
    };
    
    gprsConfig.showDevClock = function(strResult, bSuccess){
        if(bSuccess){
            $('#lblDevClock').html('读取到的设备时钟：' + gprsConfig.parseDevClock(strResult.trim()));
            gprsConfig.frame.setFormPrompt('读取完成');
        } else {
            gprsConfig.frame.setFormPrompt('读取失败');   
            $('#lblDevClock').html('读取失败');     
        }
    };
    
    gprsConfig.parseDevClock = function(dt){
        if(14 == dt.length){
            return dt.substr(0, 4) + '-' + dt.substr(4, 2) + '-' + dt.substr(6, 2) + ' ' + dt.substr(8, 2) + ':' + dt.substr(10, 2) + ':' + dt.substr(12, 2);
        } else if(12 == dt.length){
            return '20' + dt.substr(0, 2) + '-' + dt.substr(2, 2) + '-' + dt.substr(4, 2) + ' ' + dt.substr(6, 2) + ':' + dt.substr(8, 2) + ':' + dt.substr(10, 2);
        } else {
            return '读取到的设备时钟数据格式错误：' + dt;
        }
    };
    
    gprsConfig.setDevClock = function(btn){
        cms.box.confirm({
            title: '设备校时',
            html: '确定要进行设备校时吗？',
            callBack: gprsConfig.setDevClockAction,
            returnValue: {
                btn: btn
            }
        });
    };
    
    gprsConfig.setDevClockAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var urlparam = 'action=setClock&devCode=' + strDevCode;
            module.appendDebugInfo(module.getDebugTime() + '[setClock Request] param: ' + urlparam);
            var btn = pwReturn.returnValue.btn;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setDevClockCallBack,
                param: {
                    btn: btn
                }
            });
        }
    };
    
    gprsConfig.setDevClockCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setClock Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setClock', title:'设备校时', result:'正在设置，请稍候...'});
    };
    
    if(gprsConfig.isAutoRead){
        gprsConfig.getDevClock();
    }
</script>