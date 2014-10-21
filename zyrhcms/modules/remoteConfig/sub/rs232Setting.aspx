<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">波特率：</td>
                <td>
                    <select id="ddlBaudRate" class="select" style="width:206px;">
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="110">110</option>
                        <option value="150">150</option>
                        <option value="300">300</option>
                        <option value="600">600</option>
                        <option value="1200">1200</option>
                        <option value="2400">2400</option>
                        <option value="4800">4800</option>
                        <option value="9600">9600</option>
                        <option value="19200">19200</option>
                        <option value="38400">38400</option>
                        <option value="57600">57600</option>
                        <option value="76800">76800</option>
                        <option value="115200">115.2K</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>数据位：</td>
                <td>
                    <select id="ddlDataBit" class="select" style="width:206px;">
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>停止位：</td>
                <td>
                    <select id="ddlStopBit" class="select" style="width:206px;">
                        <option value="1">1</option>
                        <option value="2">2</option>
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
					    <option value="0">PPP拨号</option>
					    <option value="1">参数控制</option>
                        <option value="2">透明通道</option>
                    </select>
                </td>
            </tr>
        </table>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readRS232(this);"><span>读取RS232设置</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setRS232(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
        
    remoteConfig.getRS232 = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getRS232&devCode=' + strDevCode + '&field=rs232_setting';

        module.appendDebugInfo(module.getDebugTime() + '[getRS232 Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getRS232CallBack
        });
    };
    
    remoteConfig.getRS232CallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showRS232(jsondata);
    };
    
    remoteConfig.showRS232 = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        
        $('#ddlBaudRate').attr('value', info.baud_rate);
        $('#ddlDataBit').attr('value', info.data_bit);
        $('#ddlStopBit').attr('value', info.stop_bit);
        $('#ddlParity').attr('value', info.parity);
        $('#ddlFlowControl').attr('value', info.flow_control);
        $('#ddlWorkMode').attr('value', info.work_mode);
    };
    
    //remoteConfig.getRS232();
    
    remoteConfig.readRS232 = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getRS232Setting&devCode=' + strDevCode + '&field=rs232_setting';
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readRS232 Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readRS232CallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readRS232CallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readRS232 Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readRS232', title:'读取RS232设置', result:'正在读取，请稍候...', callBack:'remoteConfig.showRS232Result'});
    };
    
    remoteConfig.showRS232Result = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=rs232_setting';

        module.appendDebugInfo(module.getDebugTime() + '[parseRS232 Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getRS232CallBack
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readRS232(cms.util.$('btnRead'));
    }
    
    remoteConfig.setRS232 = function(btn){
        var strNodeList = '';
        var arrNode = [
            ['baud_rate', $('#ddlBaudRate').val()],
            ['data_bit', $('#ddlDataBit').val()],
            ['stop_bit', $('#ddlStopBit').val()],
            ['parity', $('#ddlParity').val()],
            ['flow_control', $('#ddlFlowControl').val()],
            ['work_mode', $('#ddlWorkMode').val()]
        ];
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=setRS232Setting&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[setRS232Setting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.setRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.setRS232CallBack,
            param: {
                btn: btn
            }
        });
        
    };
    
    remoteConfig.setRS232CallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setRS232 Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setRS232', title:'设置RS232', result:'正在设置，请稍候...', callBack:''});
    };
    /*
    if(remoteConfig.isDelayedLoad){
        remoteConfig.showLoading('正在获取RS232参数信息，请稍候...');
        window.setTimeout(remoteConfig.getRS232, 10);
    } else {
        remoteConfig.getRS232();
    }
    remoteConfig.setFormButton([{name:'保存',func:'remoteConfig.setRS232'},{name:'重置',func:'remoteConfig.getRS232'}]);
    */
</script>