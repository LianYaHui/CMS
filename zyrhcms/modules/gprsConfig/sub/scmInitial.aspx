<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>恢复初始化</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">恢复初始化</div>
        <div class="prompt">恢复初始化整个过程大约需要30秒至2分钟时间。</div>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setScmInitial(this);"><span class="w85">恢复初始化</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.setScmInitial = function(btn){
        cms.box.confirm({
            title: '恢复初始化',
            html: '确定要执行恢复初始化吗？',
            callBack: gprsConfig.setScmInitialAction,
            returnValue: btn
        });
    };
    
    gprsConfig.setScmInitialAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var urlparam = 'action=setScmInitial&devCode=' + strDevCode;
            module.appendDebugInfo(module.getDebugTime() + '[setScmInitial Request] urlparam: ' + urlparam);
            var btn = pwReturn.returnValue;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setScmInitialCallBack,
                param: {
                    btn: btn
                }
            });
        }
    };
    
    
    gprsConfig.setScmInitialCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setScmInitial Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setScmInitial', title:'恢复初始化', result:'正在设置，请稍候...'});
    };
</script>