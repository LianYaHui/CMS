<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>异常参数</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">异常类型：</td>
                <td>
                    <select id="ddlExceptionType" class="select" style="width:206px;">
                        <option value="0" selected="selected">硬盘满</option>
                        <option value="1">硬盘出错</option>
                        <option value="2">网线断</option>
                        <option value="3">IP地址冲突</option>
                        <option value="4">非法访问</option>
                        <option value="5">输入/输出视频制式不匹配</option>
                        <option value="6">视频信号异常</option>
                    </select>
                </td>
            </tr>
        </table>
        <div class="sub-title" style="margin:5px 0;">报警触发方式</div>
        <div style="margin-bottom:10px; display:block; overflow:hidden;" id="divAlarmType">
        </div>
        <div style="clear:both;">
            <div id="divChannelList"></div>
        </div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readExceptionSetting(this);"><span>读取异常参数设置</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setExceptionSetting(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormBodySize();
    
    $('#ddlExceptionType').change(function(){
        if(remoteConfig.isAutoRead){
            remoteConfig.readExceptionSetting(cms.util.$('btnRead'));
        }  
    });
        
    remoteConfig.showAlarmType = function(isReset){
        if(isReset){
            var arr = cms.util.$N('chbAlarmType');
            for(var i=0; i<arr.length; i++){
                arr[i].checked = false;
            }
        } else {
            var arrAlarmType = [
                ['monitor_alarm','监视器上警告'],['sound_alarm','声音报警'],['notify_center','上传中心'],['sms_alarm','短信报警'],['alarm_out','触发报警输出']
            ];
            var strAlarmType = '<ul>';
            for(var i=0; i<arrAlarmType.length; i++){
                if(i > 0 && i % 2 == 0){
                    strAlarmType += '<br />';
                }
                strAlarmType += '<li style="display:block; float:left; width:120px;"><label class="chb-label-nobg" style="float:left;">'
                    + '<input type="checkbox" name="chbAlarmType" class="chb" value="' + arrAlarmType[i][0] + '" /><span>' + arrAlarmType[i][1] + '</span>'
                    + '</label></li>';
            }
            strAlarmType += '</ul>';
            $('#divAlarmType').html(strAlarmType);
        }
    };
    
    remoteConfig.showAlarmType();
    remoteConfig.showChannelList('divChannelList', 'chbChannelId', '输出通道A');
    
    remoteConfig.getExceptionSetting = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getExceptionSetting&devCode=' + strDevCode + '&field=ExceptionSetting';

        module.appendDebugInfo(module.getDebugTime() + '[getExceptionSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getExceptionSettingCallBack
        });
    };
    
    remoteConfig.getExceptionSettingCallBack = function(data){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showExceptionSetting(jsondata);
    };
    
    remoteConfig.showExceptionSetting = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        remoteConfig.showAlarmType(true);
        remoteConfig.showChannelList('divChannelList', 'chbChannelId', '输出通道A', true);
        
        var alarmValues = '';        
        for(var key in info){
            if(info[key] == '1'){
                alarmValues += key + ',';
            }
        }
        cms.util.setCheckBoxChecked('chbAlarmType', ',', alarmValues);
        
        var alarmOutValues = '';
        if(info.alarm_out_cfg != ''){
            var list = evel('(' + info.alarm_out_cfg + ')');
            for(var i=0; i<list.length; i++){
                if(list[i][1] == '1'){
                    alarmOutValues += list[i][0] + ',';
                }
            }
            cms.util.setCheckBoxChecked('chbChannelId', ',', alarmOutValues);
        }
    };
    
    remoteConfig.readExceptionSetting = function(btn){
        var strDevCode = devInfo.devCode;
        var exType = $('#ddlExceptionType').val().trim();
        var urlparam = 'action=getExceptionSetting&devCode=' + strDevCode + '&setting=' + exType + ',' + 1;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readExceptionSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readExceptionSettingCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readExceptionSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readExceptionSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readExceptionSetting', title:'读取异常参数', result:'正在读取，请稍候...', callBack:'remoteConfig.showExceptionSettingResult'});
    };
    
    remoteConfig.showExceptionSettingResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=exception_setting';

        module.appendDebugInfo(module.getDebugTime() + '[parseExceptionSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getExceptionSettingCallBack
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readExceptionSetting(cms.util.$('btnRead'));
    }
    
    remoteConfig.setExceptionSetting = function(btn){
        var strNodeList = '';
        var exType = $('#ddlExceptionType').val().trim();
        var strExType = $("#ddlExceptionType").find("option:selected").text();
        var arrAlarmType = cms.util.$N('chbAlarmType');
        var arrAlarmOut = cms.util.$N('chbChannelId');
        var strAlarmOutList = '';
        var arrNode = [];
        
        arrNode.push(['exception_type', exType]);
        
        for(var n=0; n<arrAlarmType.length; n++){
            arrNode.push([arrAlarmType[n].value.trim(), arrAlarmType[n].checked ? 1 : 0]);
        }
        
        for(var n=0; n<arrAlarmOut.length; n++){
            if(n > 0){
                strAlarmOutList += '|';
            }
            strAlarmOutList += arrAlarmOut[n].value.trim() + ',' + (arrAlarmOut[n].checked ? 1 : 0);
        }
        arrNode.push(['alarm_out_cfg', strAlarmOutList]);
        
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=setExceptionSetting&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
        
        if(!remoteConfig.checkControlDisabled(btn)){
            if(!isCopy){
                return false;
            }
        }
        module.appendDebugInfo(module.getDebugTime() + '[setExceptionSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.setRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.setExceptionSettingCallBack,
            param: {
                btn: btn,
                title: '异常类型：' + strExType
            }
        });
    };
    
    remoteConfig.setExceptionSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setExceptionSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setExceptionSetting', title:'设置异常参数：' + param.title, result:'正在设置，请稍候...', callBack:''});
    };
</script>