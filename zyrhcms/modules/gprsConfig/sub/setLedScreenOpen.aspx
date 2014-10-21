<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置开、关屏</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设置开、关屏</div>
        <div class="prompt">
            LED屏当前状态为：<span id="lblScreenStatus"></span>
        </div>
        <br />
        <a class="btn btnc24" id="btnRead" onclick="gprsConfig.readLedScreenStatus(this);"><span class="w85">读取屏状态</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setLedScreenStatus(this, 1);"><span class="w65">开屏</span></a>
        <a class="btn btnc24" id="btnSet1" onclick="gprsConfig.setLedScreenStatus(this, 0);"><span class="w65">关屏</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.readLedScreenStatus = function(btn){
        var strDevCode = devInfo.devCode;
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        var urlparam = 'action=readLedScreenStatus&devCode=' + strDevCode;
        module.appendDebugInfo(module.getDebugTime() + '[readLedScreenStatus Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readLedScreenStatusCallBack,
            param: {
                btn: btn
            }
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.readLedScreenStatusCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readLedScreenStatus Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'readLedScreenStatus', title:'读取屏开关状态', result:'正在读取，请稍候...', callBack:'gprsConfig.showLedScreenStatus'});
    };
    
    gprsConfig.showLedScreenStatus = function(strResult, bSuccess){alert(strResult);
        if(bSuccess){
            var strContent = gprsConfig.getResponseProtocolContent(strResult).replace(':','');
            var volume = strContent.split('*')[0];
            if(volume != ''){
                var arrVolume = volume.split(',');
                for(var i=0; i<arrVolume.length; i++){
                    $('#lblDevVolume_' + i).html(arrVolume[i]);
                    gprsConfig.barDevVolume[i].setting(arrVolume[i]);
                }
                gprsConfig.frame.setFormPrompt('读取完成');
                
                //将读取回来的设备音量保存到数据库
                gprsConfig.updateDeviceConfig(devInfo.devCode, 'volume', volume);
            } else {
                gprsConfig.frame.setFormPrompt('读取失败');
            }
        } else {
            gprsConfig.frame.setFormPrompt('读取失败');        
        }
    };
        
    gprsConfig.setLedScreenStatus = function(btn, status){
        cms.box.confirm({
            title: '设置屏开关状态',
            html: '确定要' + (status == 1? '开屏' : '关屏') + '吗？',
            callBack: gprsConfig.setLedScreenStatusAction,
            returnValue: {
                btn: btn,
                status: status
            }
        });
    };
    
    gprsConfig.setLedScreenStatusAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var strSetting = pwReturn.returnValue.status;
            var urlparam = 'action=setLedScreenStatus&devCode=' + strDevCode + '&setting=' + strSetting;
            module.appendDebugInfo(module.getDebugTime() + '[setLedScreenStatus Request] param: ' + urlparam);
            var btn = pwReturn.returnValue.btn;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setLedScreenStatusCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
    };
    
    gprsConfig.setLedScreenStatusCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setLedScreenStatus Response] data: ' + data);
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
        var strTitle = param.setting == '1' ? '设置开屏' : '设置关屏';
        gprsConfig.task.appendTaskList({id:id, action:'setLedScreenStatus', title:strTitle, result:'正在设置，请稍候...'});
    };
    
    if(gprsConfig.isAutoRead){
        gprsConfig.readLedScreenStatus(cms.util.$('btnRead'));
    }
</script>