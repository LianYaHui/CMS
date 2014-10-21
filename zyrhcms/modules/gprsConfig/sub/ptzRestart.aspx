<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>单独重启云台</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">单独重启云台</div>
        <div class="prompt">当视频无图像或云台控制不正常时，可单独重启云台，整个过程大约需要30秒至1分钟。</div>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setPtzRestart(this);"><span class="w85">单独重启云台</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.setPtzRestart = function(btn){
        cms.box.confirm({
            title: '单独重启云台',
            html: '确定要单独重启云台吗？',
            callBack: gprsConfig.setPtzRestartAction,
            returnValue: btn
        });
    };
    
    gprsConfig.setPtzRestartAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var urlparam = 'action=setPtzRestart&devCode=' + strDevCode;
            module.appendDebugInfo(module.getDebugTime() + '[setPtzRestart Request] urlparam: ' + urlparam);
            var btn = pwReturn.returnValue;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setPtzRestartCallBack,
                param: {
                    btn: btn
                }
            });
        }
    };
    
    
    gprsConfig.setPtzRestartCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setPtzRestart Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setPtzRestart', title:'单独重启云台', result:'正在设置，请稍候...'});
    };
</script>