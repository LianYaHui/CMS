<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置巡检模式</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设置巡检模式</div>
        <table class="tbform" cellpadding="0" cellspacing="0">
            <tr>
                <td><label><input type="radio" name="rbPatrolMode" value="1" />手动<span class="prompt" style="margin-left:15px;">打开3G主机及云台电源</span></label></td>
            </tr>
            <tr>
                <td><label><input type="radio" name="rbPatrolMode" value="0" />自动<span class="prompt" style="margin-left:15px;">定时自动打开3G，执行抓拍任务后自动关闭</span></label></td>
            </tr>
            <tr>
                <td>
                    <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getPatrolMode(this);"><span class="w40">读取</span></a>
                    <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setPatrolMode(this);"><span class="w40">设置</span></a>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.getPatrolMode = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=patrol_mode';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getPatrolMode Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getPatrolModeCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getPatrolModeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getPatrolMode Response] data: ' + data);
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
        cms.util.setRadioChecked('rbPatrolMode', setting);
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
    };
    
    gprsConfig.setPatrolMode = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = parseInt(cms.util.getRadioCheckedValue('rbPatrolMode', -1), 10);
        if('-1' == strSetting){
            cms.box.alert({title: '提示信息',html:'请选择巡检模式（手动或自动）。'});
            return false;
        }
        var urlparam = 'action=setPatrolMode&devCode=' + strDevCode + '&setting=' + strSetting + '&batch=' + (strDevCode.split(',').length > 0 ? 1 : 0);
        module.appendDebugInfo(module.getDebugTime() + '[setPatrolMode Request] urlparam: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setPatrolModeCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.setPatrolModeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setPatrolMode Response] data: ' + data);
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
        for(var i=0; i<jsondata.list.length; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'setPatrolMode', title:'设置巡检模式：' + (param.setting == 1 ? '手动' : '自动'), result:'正在设置，请稍候...'});
        }
    };
    
    gprsConfig.getPatrolMode();
</script>