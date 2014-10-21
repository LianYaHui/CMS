<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>版本信息</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">主控版本：</td>
                <td><label id="lblMasterVersion"></label></td>
            </tr>
            <tr>
                <td>编码版本：</td>
                <td><label id="lblSoftwareVersion"></label></td>
            </tr>
            <tr>
                <td>面板版本：</td>
                <td><label id="lblPanelVersion"></label></td>
            </tr>
            <tr>
                <td>硬件版本：</td>
                <td><label id="lblHardwareVersion"></label></td>
            </tr>
        </table>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readDeviceVersion(this);"><span>读取版本信息</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    remoteConfig.setFormBodySize();
    
    remoteConfig.getDeviceVersion = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceVersion&devCode=' + strDevCode + '&field=device_version';

        module.appendDebugInfo(module.getDebugTime() + '[getDeviceVersion Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceVersionCallBack
        });
    };
    
    remoteConfig.getDeviceVersionCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showDeviceVersion(jsondata);
    };
    
    remoteConfig.showDeviceVersion = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        $('#lblMasterVersion').html(info.dsp_software);
        $('#lblSoftwareVersion').html(info.software);
        $('#lblPanelVersion').html(info.panel);
        $('#lblHardwareVersion').html(info.hardware);
    };
    
    //remoteConfig.getDeviceVersion();
    
    remoteConfig.readDeviceVersion = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceVersion&devCode=' + strDevCode;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceVersion Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readDeviceVersionCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readDeviceVersionCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceVersion Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readDeviceVersion', title:'读取设备版本信息', result:'正在读取，请稍候...', callBack:'remoteConfig.showDeviceVersionResult'});
        remoteConfig.setControlDisabledByTiming(param.btn, false);
    };
        
    remoteConfig.showDeviceVersionResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=device_version';

        module.appendDebugInfo(module.getDebugTime() + '[parseDeviceVersion Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceVersionCallBack
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readDeviceVersion(cms.util.$('btnRead'));
    }
</script>