<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>调节音量大小</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">音量大小调节</div>
        <div class="prompt">
            说明：LED屏输入/输出音量大小，音量0-99。
        </div>
        喇叭输出音量调节：<span id="lblDevVolume_0">0</span>
        <div id="divDeviceVolumeBox_0" style="width:295px;padding:0 0 10px 0;"></div>
        麦克风输入音量调节：<span id="lblDevVolume_1">0</span>
        <div id="divDeviceVolumeBox_1" style="width:295px;padding:0 0 10px 0;"></div>
        <a class="btn btnc24" id="btnRead" onclick="gprsConfig.readDeviceVolume(this);"><span class="w85">读取音量大小</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setDeviceVolume(this);"><span class="w85">调节音量大小</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.devVolume = [0, 0]; 
    gprsConfig.barDevVolume = [null, null];
    
    //更改输出音量
    gprsConfig.changeDevVolume = function(num, param){
        var obj = cms.util.$(param);
        var id = param.split('_')[1];
        obj.value = num;
        gprsConfig.devVolume[id] = num;
        
        $('#lblDevVolume_' + id).html(num);
    };
    
    //输出音量 步进 控制
    gprsConfig.steppingDevVolume = function(num, id){
        gprsConfig.barDevVolume[id].stepping(num);
    };
    
    gprsConfig.initialVolumeControl = function(id){
        var strTitle = id == 0 ? '输出音量' : '输入音量';
        var strHtml = '<div style="padding:5px 0;overflow:hidden;">'
            + '<table cellpadding="0" cellspacing="0" style="margin:0 auto;">';
         strHtml += '<tr style="height:27px;">'
                + '<td><a class="btn-icon-sub" title="' + strTitle + '" onclick="gprsConfig.steppingDevVolume(-1,' + id + ');" style="margin-right:5px;"></a></td>'
                + '<td><div id="divDevVolume_' + id + '"></div></td>'
                + '<td><a class="btn-icon-add" title="' + strTitle + '" onclick="gprsConfig.steppingDevVolume(1,' + id + ');" style="margin-left:5px;"></a></td>'
                + '</tr>';
        strHtml += '</table><input type="hidden" id="txtDevVolume_' + id + '" readonly="readonly" class="txt w20" /></div>';
        
        $('#divDeviceVolumeBox_' + id).html(strHtml);
        
        gprsConfig.barDevVolume[id] = new SliderBar(cms.util.$('divDevVolume_' + id),
            {
                id:'sb_devVolume_' + id, width:240, min:0, defaultValue:gprsConfig.devVolume[id], title:strTitle, max:99, limit:{},border:'none',
                callBack:gprsConfig.changeDevVolume, returnValue:'txtDevVolume_' + id, moveCall:true
            }
        );
    };
        
    gprsConfig.getDevVolume = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=volume';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getDevVolume Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getDevVolumeCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    gprsConfig.getDevVolumeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getDevVolume Response] data: ' + data);
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
        var volume = jsondata.content;
        if(volume != ''){
            var arrVolume = volume.split(',');
            for(var i=0; i<arrVolume.length; i++){
                $('#lblDevVolume_' + i).html(arrVolume[i]);
                gprsConfig.barDevVolume[i].setting(arrVolume[i]);
            }
        }
    };
    
    gprsConfig.initialVolumeControl(0);
    gprsConfig.initialVolumeControl(1);
    gprsConfig.getDevVolume();

    gprsConfig.readDeviceVolume = function(btn){
        var strDevCode = devInfo.devCode;
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        var urlparam = 'action=readVolume&devCode=' + strDevCode;
        module.appendDebugInfo(module.getDebugTime() + '[readVolume Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readDeviceVolumeCallBack,
            param: {
                btn: btn
            }
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.readDeviceVolumeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readVolume Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'readVolume', title:'读取输出音量', result:'正在读取，请稍候...', callBack:'gprsConfig.showDeviceVolume'});
    };
    
    gprsConfig.showDeviceVolume = function(strResult, bSuccess){
        if(bSuccess){
            var strContent = gprsConfig.getResponseProtocolContent(result).replace(':','');
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
            /*
            if(volume.isNumber()){
                volume = parseInt(volume, 10);
            }
            if(volume >= 0){
                $('#lblDevVolume').html(volume);
                gprsConfig.barDevVolume.setting(volume);
                gprsConfig.frame.setFormPrompt('读取完成');
                
                //将读取回来的设备音量保存到数据库
                gprsConfig.updateDeviceConfig(devInfo.devCode, 'volume', volume);
            } else {
                gprsConfig.frame.setFormPrompt('读取失败');
            }
            */
        } else {
            gprsConfig.frame.setFormPrompt('读取失败');        
        }
    };
        
    gprsConfig.setDeviceVolume = function(btn){
        cms.box.confirm({
            title: '输出音量调节',
            html: '确定要调节输出音量吗？',
            callBack: gprsConfig.setDeviceVolumeAction,
            returnValue: {
                btn: btn
            }
        });
    };
    
    gprsConfig.setDeviceVolumeAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var strSetting = $('#txtDevVolume_0').val().padLeft(2, '0') + ',' + $('#txtDevVolume_1').val().padLeft(2, '0');
            var urlparam = 'action=setVolume&devCode=' + strDevCode + '&setting=' + strSetting;
            alert(urlparam);
            module.appendDebugInfo(module.getDebugTime() + '[setLedVolume Request] param: ' + urlparam);
            var btn = pwReturn.returnValue.btn;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setDeviceVolumeCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
    };
    
    gprsConfig.setDeviceVolumeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setLedVolume Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setLedVolume', title:'设置音量大小', result:'正在设置，请稍候...'});
    };
    
    if(gprsConfig.isAutoRead){
        gprsConfig.getDeviceVolume();
    }
</script>