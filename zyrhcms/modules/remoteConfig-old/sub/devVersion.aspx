<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>版本信息</title>
</head>
<body>
    <div class="formbody">
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
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    
    remoteConfig.getDevVersion = function(){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetDeviceVersion Request] szDevId: ' + devInfo.devCode);
        var result = cms.ocx.getDeviceVersion(remoteConfig.ocx, devInfo.devCode);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetDeviceVersion Response] return: ' + result);
    
        var json = eval('(' + result + ')');
        if(0 == json.result){
            remoteConfig.hideLoading();
            var params = json.params;
            $('#lblMasterVersion').html(params.dsp_software);
            $('#lblSoftwareVersion').html(params.software);
            $('#lblPanelVersion').html(params.panel);
            $('#lblHardwareVersion').html(params.hardware);
            
            remoteConfig.frame.setFormPrompt('');
        } else {
            remoteConfig.hideLoading();
            remoteConfig.frame.setFormPrompt('获取设备版本失败');
        }
    };
    
    if(remoteConfig.isDelayedLoad){
        remoteConfig.showLoading('正在获取设备版本信息，请稍候...');
        window.setTimeout(remoteConfig.getDevVersion, 10);
    } else {
        remoteConfig.getDevVersion();
    }
</script>