<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>显示设置</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">通道号：</td>
                <td>
                    <select id="ddlChannelId" class="select" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbShowChannelName" checked="checked" /><span>显示名称</span></label>
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">通道名称：</td>
                <td>
                    <input type="text" id="txtChannelName" class="txt w200" maxlength="64" />
                    (不能被复制)
                </td>
            </tr>
            <tr>
                <td>通道名称X坐标：</td>
                <td>
                    <input type="text" id="txtChannelNamePosX" class="txt w200" maxlength="3" value="512" />
                    (0～704)
                </td>
            </tr>
            <tr>
                <td>通道名称Y坐标：</td>
                <td>
                    <input type="text" id="txtChannelNamePosY" class="txt w200" maxlength="3" value="512" />
                    (0～576)
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbShowOsd" checked="checked" /><span>显示日期</span></label>
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">时间格式：</td>
                <td>
                    <select id="ddlTimeFormat" class="select" style="width:206px;">
                        <option value="24">24小时制</option>
                        <option value="12">12小时制</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>日期格式：</td>
                <td>
                    <select id="ddlDateFormat" class="select" style="width:206px;">
                      <option value="0">XXXX-XX-XX(年月日）</option>
                      <option value="1">XX-XX-XXXX（月日年）</option>
                      <option value="2">XXXX年XX月XX日</option>
                      <option value="3">XX月XX日XXXX年</option>
                      <option value="4">XX-XX-XXXX(日月年)</option>
                      <option value="5">XX日XX月XXXX年</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <label class="chb-label-nobg" style="float:left;">
                        <input type="checkbox" class="chb" id="chbShowWeek" checked="checked" /><span>显示星期</span></label>
                </td>
            </tr>
            <tr>
                <td>显示状态：</td>
                <td>
                    <select id="ddlDisplayStatus" class="select" style="width:206px;">
                      <option value="0">不显示OSD</option>
                      <option value="1">透明，闪烁</option>
                      <option value="2">透明，不闪烁</option>
                      <option value="3">闪烁，不透明</option>
                      <option value="4" selected="selected">不透明，不闪烁</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>OSD的X坐标：</td>
                <td>
                    <input type="text" id="txtOsdPosX" class="txt w200" maxlength="3" value="0" />
                    (0～352)
                </td>
            </tr>
            <tr>
                <td>OSD的Y坐标：</td>
                <td>
                    <input type="text" id="txtOsdPosY" class="txt w200" maxlength="3" value="32" />
                    (0～576)
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', this);" lang="['复制到通道','取消复制']"><span class="w75">复制到通道</span></a>
        <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readOsdSetting(this);"><span>读取显示设置</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setOsdSetting(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    remoteConfig.copyToChannel = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var chbName = pwReturn.returnValue.chbName;
        }
        pwobj.Hide();
    };
    
    $('#ddlChannelId').change(function(){
        if(remoteConfig.isAutoRead){
            remoteConfig.readOsdSetting(cms.util.$('btnRead'));
        }
    });
    
    remoteConfig.checkCoordinateInput = function(objId){
        if(objId == undefined){
            if(!remoteConfig.checkNumberInput({obj:cms.util.$('txtChannelNamePosX'), min:0, max:704, prompt:'通道名称X坐标'})){
                return false;
            } else if(!remoteConfig.checkNumberInput({obj:cms.util.$('txtChannelNamePosY'), min:0, max:576, prompt:'通道名称Y坐标'})){
                return false;
            } else if(!remoteConfig.checkNumberInput({obj:cms.util.$('txtOsdPosX'), min:0, max:352, prompt:'OSD的X坐标'})){
                return false;
            } else if(!remoteConfig.checkNumberInput({obj:cms.util.$('txtOsdPosY'), min:0, max:576, prompt:'OSD的Y坐标'})){
                return false;
            }
            return true;
        } else {
            if('txtChannelNamePosX' == objId){
                return remoteConfig.checkNumberInput({obj:cms.util.$(objId), min:0, max:704, prompt:'通道名称X坐标'});
            } else if('txtChannelNamePosY' == objId){
                return remoteConfig.checkNumberInput({obj:cms.util.$(objId), min:0, max:576, prompt:'通道名称Y坐标'});
            } else if('txtOsdPosX' == objId){
                return remoteConfig.checkNumberInput({obj:cms.util.$(objId), min:0, max:352, prompt:'OSD的X坐标'});
            } else if('txtOsdPosY' == objId){
                return remoteConfig.checkNumberInput({obj:cms.util.$(objId), min:0, max:576, prompt:'OSD的Y坐标'});
            }
            return true;
        }
    };
    
    var arr = ['#txtChannelNamePosX', '#txtChannelNamePosY', '#txtOsdPosX', '#txtOsdPosY'];
    for(var i=0; i<arr.length; i++){
        $(arr[i]).change(function(){
            remoteConfig.checkCoordinateInput($(this).attr('id'));
        });
    }
    
    remoteConfig.getOsdSetting = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getOsdSetting&devCode=' + strDevCode + '&field=osd_setting';

        module.appendDebugInfo(module.getDebugTime() + '[getOsdSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getOsdSettingCallBack
        });
    };
    
    remoteConfig.getOsdSettingCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showOsdSetting(jsondata);
    };
    
    remoteConfig.showOsdSetting = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        if(info.channel_no != undefined){
            $('#ddlChannelId').attr('value', info.channel_no);
        }
        $('#txtChannelName').attr('value', info.channel_name);
        $('#chbShowChannelName').attr('check',info.show_channel_name == '1');
        $('#txtChannelNamePosX').attr('value',info.channel_name_x);
        $('#txtChannelNamePosY').attr('value',info.channel_name_y);
        $('#chbShowOsd').attr('check',info.show_osd == '1');
        $('#txtOsdPosX').attr('value',info.osd_x);
        $('#txtOsdPosY').attr('value',info.osd_y);
        $('#ddlDateFormat').attr('value',info.osd_layout);
        $('#ddlDisplayStatus').attr('value',info.osd_mode);
        $('#chbShowWeek').attr('check',info.show_week == '1');
    };
    
    //remoteConfig.getOsdSetting();
    
    remoteConfig.readOsdSetting = function(btn){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val().trim();
        var urlparam = 'action=getOsdSetting&devCode=' + strDevCode + '&setting=' + channelNo;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readOsdSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readOsdSettingCallBack,
            param: {
                btn: btn,
                title: '通道' + channelNo
            }
        });
    };
    
    remoteConfig.readOsdSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readOsdSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readOsdSetting', title:'读取显示设置：' + param.title, result:'正在读取，请稍候...', callBack:'remoteConfig.showVideoSettingResult'});
    };
    
    remoteConfig.showVideoSettingResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + escape(strResult) + '&field=osd_setting';

        module.appendDebugInfo(module.getDebugTime() + '[parseOsdSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getOsdSettingCallBack
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readOsdSetting(cms.util.$('btnRead'));
    }
    
    remoteConfig.setOsdSetting = function(btn){
        if(!remoteConfig.checkCoordinateInput()){
            return false;
        }
        var strParam = cms.util.getCheckBoxCheckedValue('chbChannelCopy');
        var isCopy = '' != strParam && strParam.split(',').length > 1;
        var arrChannel = isCopy ? strParam.split(',') : [$('#ddlChannelId').val()];
        for(var n=0; n<arrChannel.length; n++){
            var channelNo = arrChannel[n];
            var strNodeList = '';
            var arrNode = [
                ['channel', channelNo],
                ['channel_name', $('#txtChannelName').val()],
                ['show_channel_name', $('#chbShowChannelName').attr("checked") ? '1' : '0'],
                ['channel_name_x', $('#txtChannelNamePosX').val()],
                ['channel_name_y', $('#txtChannelNamePosY').val()],
                ['show_osd', $('#chbShowOsd').attr("checked") ? '1' : '0'],
                ['osd_x', $('#txtOsdPosX').val()],
                ['osd_y', $('#txtOsdPosY').val()],
                ['osd_layout', $('#ddlDateFormat').val()],
                ['osd_mode', $('#ddlDisplayStatus').val()],
                ['show_week', $('#chbShowWeek').attr("checked") ? '1' : '0']
            ];
            
            for(var i=0; i<arrNode.length; i++){
                strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
            }
            var strXml = remoteConfig.buildXml(strNodeList);
            
            var strDevCode = devInfo.devCode;
            var urlparam = 'action=setOsdSetting&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml) + '&param=' + strParam;
            if(!remoteConfig.checkControlDisabled(btn)){
                if(!isCopy){
                    return false;
                }
            }
            module.appendDebugInfo(module.getDebugTime() + '[setOsdSetting Request] param: ' + urlparam);
            remoteConfig.ajaxRequest({
                url: remoteConfig.setRemoteConfigUrl,
                data: urlparam,
                callBack: remoteConfig.setOsdSettingCallBack,
                param: {
                    btn: btn,
                    title: '通道' + channelNo
                }
            });
        }
    };
    
    remoteConfig.setOsdSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setOsdSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setOsdSetting', title:'显示设置：' + param.title, result:'正在设置，请稍候...', callBack:''});
    };
</script>