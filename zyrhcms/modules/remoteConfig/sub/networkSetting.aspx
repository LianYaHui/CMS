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
            <tr style="display:none;">
                <td style="width:120px;">网卡类型：</td>
                <td>
                    <select id="ddlNetType" class="select" style="width:206px;">
                        <option value="1">10M半双工</option>
                        <option value="2">10M全双工</option>
                        <option value="3">100半双工</option>
                        <option value="4">100M全双工</option>
                        <option value="6">1000M全双工</option>
                        <option value="5" selected="selected">10M/100M/1000M自适应</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td style="width:120px;">设备IP地址：</td>
                <td>
                    <input type="text" id="txtDevIp" class="txt w200" value="0.0.0.0" maxlength="16" style="float:left;" />
                </td>
            </tr>
            <tr>
                <td>设备端口号：</td>
                <td>
                    <input type="text" id="txtDevPort" class="txt w200" maxlength="5" value="0" />
                </td>
            </tr>
            <tr>
                <td>掩码地址：</td>
                <td>
                    <input type="text" id="txtMaskCode" class="txt w200" value="255.255.255.0" maxlength="16" />
                </td>
            </tr>
            <tr>
                <td>网关地址：</td>
                <td>
                    <input type="text" id="txtGateway" class="txt w200" value="0.0.0.0" maxlength="16" />
                </td>
            </tr>
            <tr>
                <td>物理地址：</td>
                <td>
                    <input type="text" id="txtMacAddress" class="txt w200" value="" disabled="disabled" />
                </td>
            </tr>
            <tr>
                <td>多播组地址：</td>
                <td>
                    <input type="text" id="txtMultiCastIP" class="txt w200" value="0.0.0.0" maxlength="16" />
                </td>
            </tr>
            <tr>
                <td>HTTP端口号：</td>
                <td>
                    <input type="text" id="txtHttpPort" class="txt w200" maxlength="5" value="81" />
                </td>
            </tr>
        </table>
        <hr style="margin-top:5px;" />
        <div class="morebar morebar-nobg" id="highGradeConfig">
            <a class="switch sw-close"></a><span>高级配置</span>
        </div>
        <table class="tbremoteconfig" id="tbHighGrade" cellpadding="0" cellspacing="0" style="display:none;">
            <tr>
                <td style="width:120px;">DNS1服务器地址：</td>
                <td>
                    <input type="text" id="txtDNS1" class="txt w200" maxlength="16" value="0.0.0.0" />
                </td>
            </tr>
            <tr>
                <td>DNS2服务器地址：</td>
                <td>
                    <input type="text" id="txtDNS2" class="txt w200" maxlength="16" value="0.0.0.0" />
                </td>
            </tr>
        </table>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readNetworkSetting(this);"><span>读取网络设置</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setNetworkSetting(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    $('#highGradeConfig').click(function(){
        $(this).find('a').removeClass();
        if($('#tbHighGrade').is(':visible')){
            $('#tbHighGrade').hide();
            $(this).find('a').addClass('switch sw-close');
        } else {
            $('#tbHighGrade').show();
            $(this).find('a').addClass('switch sw-open');
        }
    });
    
    remoteConfig.checkNetworkIp = function(objId){
        if(objId == undefined){
            if(!remoteConfig.checkIpInput({obj:cms.util.$('txtDevIp'), min:0, max:65535, prompt:'设备IP地址'})){
                return false;
            } else if(!remoteConfig.checkIpInput({obj:cms.util.$('txtMaskCode'), min:0, max:65535, prompt:'掩码地址'})){
                return false;
            } else if(!remoteConfig.checkIpInput({obj:cms.util.$('txtGateway'), min:0, max:65535, prompt:'网关地址'})){
                return false;
            } else if(!remoteConfig.checkIpInput({obj:cms.util.$('txtMultiCastIP'), min:0, max:65535, prompt:'多播组地址'})){
                return false;
            } else if(!remoteConfig.checkIpInput({obj:cms.util.$('txtDNS1'), min:0, max:65535, prompt:'DNS1服务器地址'})){
                return false;
            } else if(!remoteConfig.checkIpInput({obj:cms.util.$('txtDNS2'), min:0, max:65535, prompt:'DNS2服务器地址'}, true)){
                return false;
            }
            return true;
        } else {
            if('txtDevIp' == objId){
                return remoteConfig.checkIpInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'设备IP地址'});
            } else if('txtMaskCode' == objId){
                return remoteConfig.checkIpInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'掩码地址'});
            } else if('txtGateway' == objId){
                return remoteConfig.checkIpInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'网关地址'});
            } else if('txtMultiCastIP' == objId){
                return remoteConfig.checkIpInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'多播组地址'});
            } else if('txtDNS1' == objId){
                return remoteConfig.checkIpInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'DNS1服务器地址'});
            } else if('txtDNS2' == objId){
                return remoteConfig.checkIpInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'DNS2服务器地址'}, true);
            }
            return true;
        }
    };
    var arr = ['#txtDevIp','#txtMaskCode','#txtGateway','#txtMultiCastIP','#txtDNS1','#txtDNS2'];
    for(var i=0; i<arr.length; i++){
        $(arr[i]).change(function(){
            remoteConfig.checkNetworkIp($(this).attr('id'));
        });
    }
        
    //检测端口输入
    remoteConfig.checkNetworkPort = function(objId){
        if(objId == undefined){
            if(!remoteConfig.checkNumberInput({obj:cms.util.$('txtDevPort'), min:0, max:65535, prompt:'设备端口号'})){
                return false;
            } else if(!remoteConfig.checkNumberInput({obj:cms.util.$('txtHttpPort'), min:0, max:65535, prompt:'HTTP端口号'})){
                return false;
            }
            return true;
        } else {
            if('txtDevPort' == objId){
                return remoteConfig.checkNumberInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'设备端口号'});
            } else if('txtHttpPort' == objId){
                return remoteConfig.checkNumberInput({obj:cms.util.$(objId), min:0, max:65535, prompt:'HTTP端口号'});
            }
            return true;
        }
    };
    var arr = ['#txtDevPort', '#txtHttpPort'];
    for(var i=0; i<arr.length; i++){
        $(arr[i]).change(function(){
            remoteConfig.checkNetworkPort($(this).attr('id'));
        });
    }
    
    remoteConfig.getNetworkSetting = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getNetworkSetting&devCode=' + strDevCode + '&field=network_setting';

        module.appendDebugInfo(module.getDebugTime() + '[getNetworkSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getNetworkSettingCallBack
        });
    };
    
    remoteConfig.getNetworkSettingCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showNetworkSetting(jsondata);
    };
    
    remoteConfig.showNetworkSetting = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        
        $('#ddlNetType').attr('value', info.net_type);
        $('#txtDevIp').attr('value', info.ip);
        $('#txtDevPort').attr('value', info.port);
        $('#txtMaskCode').attr('value', info.mask);
        $('#txtGateway').attr('value', info.gateway);
        $('#txtMacAddress').attr('value', info.mac);
        
        $('#txtMultiCastIP').attr('value', info.multicast);
        $('#txtHttpPort').attr('value', info.http_port);
        $('#txtDNS1').attr('value', info.dns1);
        $('#txtDNS2').attr('value', info.dns2);
    };
    
    //remoteConfig.getNetworkSetting();
    
    remoteConfig.readNetworkSetting = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getNetworkSetting&devCode=' + strDevCode + '&field=network_setting';
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readNetworkSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readNetworkSettingCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readNetworkSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readNetworkSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readNetworkSetting', title:'读取网络设置', result:'正在读取，请稍候...', callBack:'remoteConfig.showNetworkSettingResult'});
    };
    
    remoteConfig.showNetworkSettingResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=network_setting';

        module.appendDebugInfo(module.getDebugTime() + '[parseNetworkSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getNetworkSettingCallBack
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readNetworkSetting(cms.util.$('btnRead'));
    }
    
    remoteConfig.setNetworkSetting = function(btn){
        if(!remoteConfig.checkNetworkIp()){
            return false;
        }
        if(!remoteConfig.checkNetworkPort()){
            return false;
        }
        var strNodeList = '';
        
        var arrNode = [
            ['net_type', $('#ddlNetType').val()],
            ['ip', $('#txtDevIp').val()],
            ['port', $('#txtDevPort').val()],
            ['mask', $('#txtMaskCode').val()],
            ['gateway', $('#txtGateway').val()],
            ['multicast', $('#txtMultiCastIP').val()],
            ['mac', $('#txtMacAddress').val()],
            ['http_port', $('#txtHttpPort').val()],
            ['dns1', $('#txtDNS1').val()],
            ['dns2', $('#txtDNS2').val()]
        ];
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=setNetworkSetting&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[setNetworkSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.setRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.setNetworkSettingCallBack,
            param: {
                btn: btn
            }
        });
        
    };
    
    remoteConfig.setNetworkSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setNetworkSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setNetwork', title:'网络设置', result:'正在设置，请稍候...', callBack:''});
    };
</script>