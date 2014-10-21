<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">设备名称：</td>
                <td><input type="text" id="txtDevName_Form" class="txt w200" maxlength="64" /></td>
            </tr>
            <tr>
                <td>录像覆盖：</td>
                <td>
                    <select id="ddlRecordCover" class="select" style="width:206px;">
                        <option value="1">是</option>
                        <option value="0">否</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>启用主口缩放：</td>
                <td>
                    <select id="ddlMasterZoom" class="select w200" style="width:206px;" disabled="disabled">
                        <option value="-1"></option>
                        <option value="1">启用</option>
                        <option value="0">不启用</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>启用辅口缩放：</td>
                <td>
                    <select id="ddlAssistZoom" class="select w200" style="width:206px;" disabled="disabled">
                        <option value="-1"></option>
                        <option value="1">启用</option>
                        <option value="0">不启用</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>设备类型：</td>
                <td>
                    <input type="text" id="txtDevType" class="txt w200" maxlength="64" disabled="disabled" />
                </td>
            </tr>
            <tr>
                <td>通道个数：</td>
                <td>
                    <input type="text" id="txtChannelCount" class="txt w200" disabled="disabled" value="0" />
                </td>
            </tr>
            <tr>
                <td>硬盘个数：</td>
                <td>
                    <input type="text" id="txtDiskCount" class="txt w200" disabled="disabled" value="0" />
                </td>
            </tr>
            <tr>
                <td>报警输入数：</td>
                <td>
                    <input type="text" id="txtAlarmInputCount" class="txt w200" disabled="disabled" value="0" />
                </td>
            </tr>
            <tr>
                <td>报警输出数：</td>
                <td>
                    <input type="text" id="txtAlarmOutputCount" class="txt w200" disabled="disabled" value="0" />
                </td>
            </tr>
            <tr>
                <td>设备序列号：</td>
                <td>
                    <input type="text" id="txtSerialNumber" class="txt w200" disabled="disabled" value="" />
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
        
    remoteConfig.getDevInfo = function(){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetDeviceInfo Request] szDevId: ' + devInfo.devCode);
        var result = cms.ocx.getDeviceInfo(remoteConfig.ocx, devInfo.devCode);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetDeviceInfo Response] return: ' + result + '\r\n');
            
        var json = eval('(' + result + ')');
        if(0 == json.result){
            remoteConfig.hideLoading();
            var params = json.params;
            
            $('#txtSerialNumber').attr('value', params.serial_number);
            $('#txtDiskCount').attr('value', params.disk_number);
            
            //$('#lblError').html('');
        } else {
            remoteConfig.hideLoading();
            //$('#lblError').html('获取设备信息失败');
        }
        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetDeviceParams Request] szDevId: ' + devInfo.devCode);
        var result1 = cms.ocx.getDeviceParams(remoteConfig.ocx, devInfo.devCode);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetDeviceParams Response] return: ' + result1 + '\r\n');
        
        var json1 = eval('(' + result1 + ')');
        if(0 == json1.result1){
            remoteConfig.hideLoading();
            var params = json1.params;
            
            $('#ddlRecordCover').attr('value', params.recycle_record);
            $('#ddlMasterZoom').attr('value', params.major_scale);
            $('#ddlAssistZoom').attr('value', params.minor_scale);
            
            
            //$('#lblError').html('');
        } else {
            remoteConfig.hideLoading();
            //$('#lblError').html('获取设备信息失败');
        }
    };
    
    $('#txtDevName_Form').attr('value', devInfo.devName);
    if(remoteConfig.isDelayedLoad){
        remoteConfig.showLoading('正在获取设备信息，请稍候...');
        window.setTimeout(remoteConfig.getDevInfo, 10);
    } else {
        remoteConfig.getDevInfo();
    }
    remoteConfig.setFormButton([{name:'保存',func:''},{name:'重置',func:'remoteConfig.getDevInfo'}]);
</script>