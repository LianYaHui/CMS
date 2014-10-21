<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>删除全部巡检点</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">删除全部巡检点</div>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.deletePatrolTask(this);"><span class="w90">删除全部巡检点</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.deletePatrolTask = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = 'ALL';
        var urlparam = 'action=deletePatrolTask&devCode=' + strDevCode + '&setting=' + strSetting;
        cms.box.confirm({
            title: '删除巡检点',
            html: '确定要删除全部巡检点吗？',
            callBack: gprsConfig.deletePatrolTaskAction,
            returnValue: {
                btn: btn,
                urlparam: urlparam,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.deletePatrolTaskAction = function(pwobj, pwReturn){
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
                callBack: gprsConfig.deletePatrolTaskCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
        pwobj.Hide();
    };
    
    gprsConfig.deletePatrolTaskCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[deletePatrolTask Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'deletePatrolTask', title:'删除全部巡检点', result:'正在删除，请稍候...'});
    };
</script>