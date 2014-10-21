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
                <td style="width:120px;">波特率：</td>
                <td>
                    <select id="ddlBaudRate" class="select" style="width:206px;">
                        <option value="0">50</option>
                        <option value="1">75</option>
                        <option value="2">110</option>
                        <option value="3">150</option>
                        <option value="4">300</option>
                        <option value="5">600</option>
                        <option value="6">1200</option>
                        <option value="7">2400</option>
                        <option value="8">4800</option>
                        <option value="9">9600</option>
                        <option value="10">19200</option>
                        <option value="11">38400</option>
                        <option value="12">57600</option>
                        <option value="13">76800</option>
                        <option value="14">115.2K</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>数据位：</td>
                <td>
                    <select id="ddlDataBit" class="select" style="width:206px;">
                        <option value="0">5</option>
                        <option value="1">6</option>
                        <option value="2">7</option>
                        <option value="3">8</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>停止位：</td>
                <td>
                    <select id="ddlStopBit" class="select" style="width:206px;">
                        <option value="0">1</option>
                        <option value="1">2</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>校验类型：</td>
                <td>
                    <select id="ddlParity" class="select" style="width:206px;">
                        <option value="0">无校验</option>
                        <option value="1">奇校验</option>
                        <option value="2">偶校验</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>流控类型：</td>
                <td>
                    <select id="ddlFlowControl" class="select" style="width:206px;">
                        <option value="0">无</option>
                        <option value="1">软流控</option>
                        <option value="2">硬流控</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>工作模式：</td>
                <td>
                    <select id="ddlWorkMode" class="select" style="width:206px;">
					    <option value="1">参数控制</option>
                        <option value="2">透明通道</option>
                    </select>
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
    
    remoteConfig.getRS232 = function(){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetRS232 Request] szDevId: ' + devInfo.devCode);
        var result = cms.ocx.getRS232(remoteConfig.ocx, devInfo.devCode);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetRS232 Response] return: ' + result);
    
        var json = eval('(' + result + ')');
        if(0 == json.result){
            remoteConfig.hideLoading();
            var params = json.params;
            $('#ddlBaudRate').attr('value', params.baud_rate);
            $('#ddlDataBit').attr('value', params.data_bit);
            $('#ddlFlowControl').attr('value', params.flow_control);
            $('#ddlParity').attr('value', params.parit);
            $('#ddlStopBit').attr('value', params.stop_bit);
            $('#ddlWorkMode').attr('value', params.work_mode);
            
            remoteConfig.frame.setFormPrompt('');
        } else {
            remoteConfig.hideLoading();
            if(result != 0){
                cms.box.alert({html:result});
            }
        }
    };
    
    remoteConfig.setRS232 = function(){
        var strParams = '{'
            + '"baud_rate" : ' + $('#ddlBaudRate').val() + ','
            + '"data_bit" : ' + $('#ddlDataBit').val() + ','
            + '"flow_control" : ' + $('#ddlFlowControl').val() + ','
            + '"parit" : ' + $('#ddlParity').val() + ','
            + '"stop_bit" : ' + $('#ddlStopBit').val() + ','
            + '"work_mode" : ' + $('#ddlWorkMode').val() + ''
            + '}';
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpSetRS232 Request] szDevId: ' + devInfo.devCode + ', szParams: ' + strParams);    
        var result = cms.ocx.setRS232(remoteConfig.ocx, devInfo.devCode, strParams);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpSetRS232 Response] return: ' + cms.ocx.showErrorCode(result));
        if(result != 0){
            cms.box.alert({title:'', html:cms.ocx.showErrorCode(result)});
        }
    };
    
    if(remoteConfig.isDelayedLoad){
        remoteConfig.showLoading('正在获取RS232参数信息，请稍候...');
        window.setTimeout(remoteConfig.getRS232, 10);
    } else {
        remoteConfig.getRS232();
    }
    remoteConfig.setFormButton([{name:'保存',func:'remoteConfig.setRS232'},{name:'重置',func:'remoteConfig.getRS232'}]);
</script>