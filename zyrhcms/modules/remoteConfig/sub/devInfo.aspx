<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0" style="margin-top:5px;">
            <tr>
                <td style="width:120px;">设备名称：</td>
                <td><input type="text" id="txtDevName_Form" class="txt w200" maxlength="64" disabled="disabled" /></td>
            </tr>
            <tr>
                <td>录像覆盖：</td>
                <td>
                    <select id="ddlRecordCover" class="select" style="width:206px;" disabled="disabled">
                        <option value="1">是</option>
                        <option value="0">否</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>启用主口缩放：</td>
                <td>
                    <select id="ddlMajorScale" class="select w200" style="width:206px;" disabled="disabled">
                        <option value="-1"></option>
                        <option value="1">启用</option>
                        <option value="0">不启用</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>启用辅口缩放：</td>
                <td>
                    <select id="ddlMinorScale" class="select w200" style="width:206px;" disabled="disabled">
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
    <div class="formbottom">
        <a class="btn btnc24" onclick="remoteConfig.readDeviceInfo(this);" id="btnRead"><span>读取设备信息</span></a>
        <a class="btn btnc24" id="btnSet" style="display:none;"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    remoteConfig.setFormBodySize();

    remoteConfig.getDeviceInfo = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceInfo&devCode=' + strDevCode + '&field=device_info';

        module.appendDebugInfo(module.getDebugTime() + '[getDeviceInfo Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceInfoCallBack
        });
    };
    
    remoteConfig.getDeviceInfoCallBack = function(data){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showDeviceInfo(jsondata);
    };
    
    remoteConfig.showDeviceInfo = function(jsondata){
        if(0 == jsondata.list.length){
            $('#txtDevName_Form').attr('value',devInfo.devName);
            return false;
        }
        var info = jsondata.list[0];
        $('#txtDevName_Form').attr('value',info.device_name);
        $('#ddlMajorScale').attr('value',info.major_scale);
        $('#ddlMinorScale').attr('value',info.minor_scale);
        $('#txtDevType').attr('value',info.device_type);
        $('#txtChannelCount').attr('value',info.channel_count);
        $('#txtDiskCount').attr('value',info.disk_count);
        $('#txtAlarmInputCount').attr('value',info.alarm_in_count);
        $('#txtAlarmOutputCount').attr('value',info.alarm_out_count);
        $('#txtSerialNumber').attr('value',info.serial_no);
    };
    
    //remoteConfig.getDeviceInfo();
        
    remoteConfig.readDeviceInfo = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceInfo&devCode=' + strDevCode;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceInfo Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readDeviceInfoCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readDeviceInfoCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceInfo Response] data: ' + data);
        remoteConfig.setControlDisabledByTiming(param.btn, false);
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
        remoteConfig.task.appendTaskList({id:id, action:'readDeviceInfo', title:'读取设备信息', result:'正在读取，请稍候...', callBack:'remoteConfig.showDeviceInfoResult'});
    };
    
    remoteConfig.showDeviceInfoResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=device_info';

        module.appendDebugInfo(module.getDebugTime() + '[parseDeviceInfo Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceInfoCallBack
        });
    };
    if(remoteConfig.isAutoRead){
        remoteConfig.readDeviceInfo(cms.util.$('btnRead'));
    }
</script>