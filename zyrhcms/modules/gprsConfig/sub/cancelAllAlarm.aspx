<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>取消所有报警消息</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">取消所有报警消息</div>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.cancelAllAlarm(this);"><span class="w100">取消所有报警消息</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.cancelAllAlarm = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = 'ALL';
        var urlparam = 'action=cancelAllAlarm&devCode=' + strDevCode + '&setting=' + strSetting;        
        cms.box.confirm({
            title: '取消所有报警消息',
            html: '确定要取消所有报警消息吗？',
            callBack: gprsConfig.cancelAllAlarmAction,
            returnValue: {
                btn: btn,
                urlparam: urlparam,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.cancelAllAlarmAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var urlparam = pwReturn.returnValue.urlparam;
            var btn = pwReturn.returnValue.btn;
            var strSetting = pwReturn.returnValue.setting;
            module.appendDebugInfo(module.getDebugTime() + '[setSaveInterval Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.cancelAllAlarmCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
        pwobj.Hide();
    };
    
    gprsConfig.cancelAllAlarmCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[cancelAllAlarm Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'cancelAllAlarm', title:'取消所有报警消息', result:'正在删除，请稍候...'});
    };
</script>