<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>删除区域数据</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">删除区域数据</div>
        <div class="prompt">
            
        </div>
        选择区位：<select id="ddlMemory" class="select"><option value="-1">选择区位</option></select>        
        <a class="btn btnc24" id="btnDelete" onclick="gprsConfig.deleteData();"><span class="w65">删除数据</span></a>
        <br /><br />
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.deleteData();"><span class="w85">删除全部数据</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    cms.util.fillNumberOptions(cms.util.$('ddlMemory'), 0, 15, -1, 1);
           
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