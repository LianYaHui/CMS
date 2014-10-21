<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设备主机复位</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设备主机复位</div>
        <div class="prompt">设备主机复位整个过程大约需要30秒至2分钟时间。</div>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setScmReset(this);"><span class="w85">设备主机复位</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.setScmReset = function(btn){
        cms.box.confirm({
            title: '设备主机复位',
            html: '确定要执行设备主机复位吗？',
            callBack: gprsConfig.setScmResetAction,
            returnValue: btn
        });
    };
    
    gprsConfig.setScmResetAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var urlparam = 'action=setScmReset&devCode=' + strDevCode;
            module.appendDebugInfo(module.getDebugTime() + '[setScmReset Request] urlparam: ' + urlparam);
            var btn = pwReturn.returnValue;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setScmResetCallBack,
                param: {
                    btn: btn
                }
            });
        }
    };
    
    
    gprsConfig.setScmResetCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setScmReset Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setScmReset', title:'设备主机复位', result:'正在设置，请稍候...'});
    };
</script>