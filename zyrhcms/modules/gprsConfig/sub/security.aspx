<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置巡检模式</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">防盗报警设置</div>
        <table class="tbform" cellpadding="0" cellspacing="0">
            <tr>
                <td><label><input type="radio" name="rbSecurity" value="1" />设防</label></td>
            </tr>
            <tr>
                <td><label><input type="radio" name="rbSecurity" value="0" />撤防</label></td>
            </tr>
            <tr>
                <td>
                    <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getSecurity(this);"><span class="w40">读取</span></a>
                    <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setSecurity(this);"><span class="w40">设置</span></a>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.getSecurity = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=security';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getSecurity Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getSecurityCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getSecurityCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getSecurity Response] data: ' + data);
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
        cms.util.setRadioChecked('rbSecurity', setting);
        gprsConfig.frame.setFormPrompt('读取完成');
    };
    
    gprsConfig.setSecurity = function(btn){
        var strDevCode = devInfo.devCode;
        var strSetting = parseInt(cms.util.getRadioCheckedValue('rbSecurity', -1), 10);
        if('-1' == strSetting){
            cms.box.alert({title: '提示信息',html:'请选择防盗报警设置（设防或撤防）。'});
            return false;
        }
        var urlparam = 'action=setSecurity&devCode=' + strDevCode + '&setting=' + strSetting;
        module.appendDebugInfo(module.getDebugTime() + '[setSecurity Request] param: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setSecurityCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.setSecurityCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setSecurity Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setSecurity', title:'设置防盗报警：' + (param.setting == 1 ? '设防' : '撤防'), result:'正在设置，请稍候...'});
    };
    
    gprsConfig.getSecurity();
</script>