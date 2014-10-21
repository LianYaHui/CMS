<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设备电压校准</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">读取设备电压</div>
        <div class="prompt">读取平台数据库中保存的设备最后上报的电压数值，单位：伏特。</div>
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getVoltage(this);"><span class="w65">读取电压</span></a>
        <br />
        <span id="lblVoltage"></span>
        <hr style="margin:10px 0;" />
        <div class="itemtitle">设备电压校准</div>
        <div class="prompt">
            由于设备上报的电压值存在误差，需人工校准电压，电压校准数值最大不得超过3V
            <br />
            电压值请输入小数，示例：0.1
        </div>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td>设备电压值</td>
                <td style="padding:0 3px;">
                    <select id="ddlAddType" class="select20" style="width:40px;float:left;">
                        <option value="+">加</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="txt w30" id="txtVoltageCalibrate" value="0" maxlength="3" style="height:18px;float:left;text-align:center;" />
                </td>
                <td style="padding:0 3px;">V(伏特)
                </td>
                <td>
                    <a class="btn btnc22" id="btnSet" onclick="gprsConfig.setVoltageCalibrate(this);"><span class="w65">电压校准</span></a>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.getVoltage = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceConfig&devCode=' + strDevCode + '&field=voltage_power';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getVoltage Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getVoltageCallBack,
            param: {
                btn: btn
            }
        });
        
        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getVoltageCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getVoltage Response] data: ' + data);
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
        var setting = parseFloat(jsondata.content, 10);
        
        $('#lblVoltage').html('设备最后上报的电压值：' + setting + ' V.');
        gprsConfig.frame.setFormPrompt('读取完成');
    };
    
    gprsConfig.setVoltageCalibrate = function(btn){
        var strDevCode = devInfo.devCode;
        cms.util.$('txtVoltageCalibrate').value = cms.util.$('txtVoltageCalibrate').value.replace(/[^0-9]/g, '.');
        var strSetting = $('#txtVoltageCalibrate').val().trim();
        if('0' == strSetting || '' == strSetting){
            cms.box.msgAndFocus(cms.util.$('txtVoltageCalibrate'), {title: '提示信息',html:'请输入校准电压。'});
            return false;
        }
        var pattern = /^\d{1}(\.)?(\d{1})?$/;
        if(!pattern.test(strSetting)){
            cms.box.msgAndFocus(cms.util.$('txtVoltageCalibrate'), {title: '提示信息',html:'电压数据格式错误。'});
            return false;
        }
        var val = parseFloat(strSetting, 10);        
        if(val > 3){
            cms.box.msgAndFocus(cms.util.$('txtVoltageCalibrate'), {title: '提示信息',html:'电压校正值不得超过3V。'});
            return false;        
        }
        strSetting = strSetting.replace(/[.]/g, '');
        if(1 == strSetting.length){
            val = val*10;
        }
        
        strSetting = '+' + (('' + val).replace(/[.]/g, '').padLeft(2, '0'));
        
        cms.box.confirm({
            title: '设备校时',
            html: '确定要进行电压校准吗？',
            callBack: gprsConfig.setVoltageCalibrateAction,
            returnValue: {
                btn: btn,
                setting: strSetting
            }
        });
    };
    
    gprsConfig.setVoltageCalibrateAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var strSetting = pwReturn.returnValue.setting;
            var btn = pwReturn.returnValue.btn;
            var urlparam = 'action=setVoltageCalibrate&devCode=' + strDevCode + '&setting=' + strSetting;
            module.appendDebugInfo(module.getDebugTime() + '[setVoltageCalibrate Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setVoltageCalibrateCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
    };
    
    gprsConfig.setVoltageCalibrateCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setVoltageCalibrate Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setVoltageCalibrate', title:'设备电压校准：' + param.setting, result:'正在设置，请稍候...'});
    };
    
    gprsConfig.getVoltage();
</script>