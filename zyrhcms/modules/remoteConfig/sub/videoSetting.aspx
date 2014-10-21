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
                <td style="width:120px;">通道号：</td>
                <td>
                    <select id="ddlChannelId" class="select" style="width:206px;"></select>
                </td>
            </tr>
            <tr>
                <td>码流类别：</td>
                <td>
                    <select id="ddlStreamType" class="select" style="width:206px;">
					    <option value="1">主码流</option>
					    <option value="2">子码流</option>
                    </select>
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">码流类型：</td>
                <td>   
                    <select id="ddlStreamModel" class="select" style="width:206px;">
					    <option value="1">视频流</option>
					    <option value="2">复合流</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>分辨率：</td>
                <td>   
                    <select id="ddlResolution" class="select" style="width:206px;">
					    <option value="1">QCIF (176*144)</option>
					    <option value="2">CIF (352*288)</option>
					    <option value="3">2CIF (704*288)</option>
					    <option value="4">DCIF (528*384)</option>
					    <option value="5">4CIF (704*576)</option>
					    <option value="6">D1 (720*576)</option>
					    <option value="7">WD1 (960*576)</option>
					    
					    <option value="20">QVGA (320*240)</option>
					    <option value="21">VGA (640*480)</option>
					    <option value="22">SVGA (800*600)</option>
					    <option value="23">XVGA (1024*768)</option>
					    <option value="24">UXGA (1200*1600)</option>
					    
					    <option value="41">720P (720*1280)</option>
					    <option value="42">960P (960*1280)</option>
					    <option value="43">1080P (1080*1920)</option>
					    
					    <option value="44">250W (1280*1920)</option>
					    <option value="45">300W (2048*1536)</option>
					    <option value="46">500W (1920*2560)</option>
					    <option value="47">800W (3200*2400)</option>
					    <option value="48">1000W (2048*1536)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>码率类型：</td>
                <td>   
                    <select id="ddlBitRateType" class="select" style="width:206px;">
					    <option value="0">变码率</option>
					    <option value="1">定码率</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>码率上限：</td>
                <td>   
                    <select id="ddlBitRate" class="select" style="width:206px;">
					    <option value="0">32Kbps</option>
					    <option value="1">48Kbps</option>
					    <option value="2">64Kbps</option>
					    <option value="3">80Kbps</option>
					    <option value="4">96Kbps</option>
					    <option value="5">128Kbps</option>
					    <option value="6">160Kbps</option>
					    <option value="7">192Kbps</option>
					    <option value="8">224Kbps</option>
					    <option value="9">256Kbps</option>
					    <option value="10">320Kbps</option>
					    <option value="11">384Kbps</option>
					    <option value="12">448Kbps</option>
					    <option value="13">512Kbps</option>
					    <option value="14">640Kbps</option>
					    <option value="15">768Kbps</option>
					    <option value="16">896Kbps</option>
					    <option value="17">1024Kbps</option>
					    <option value="18">1280Kbps</option>
					    <option value="19">1536Kbps</option>
					    <option value="20">1792Kbps</option>
					    <option value="21">2048Kbps</option>
					    <option value="22">3072Kbps</option>
					    <option value="23">4096Kbps</option>
					    <option value="24">8196Kbps</option>
					    <option value="25">16384Kbps</option>
					    <option value="99">自定义</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>视频帧率：</td>
                <td>   
                    <select id="ddlVideoFrameRate" class="select" style="width:206px;" onchange="remoteConfig.setIframeInterval(this.value);">
					    <option value="5">1帧</option>
					    <option value="6">2帧</option>
					    <option value="7">4帧</option>
					    <option value="8">6帧</option>
					    <option value="9">8帧</option>
					    <option value="10">10帧</option>
					    <option value="11">12帧</option>
					    <option value="12">16帧</option>
					    <option value="14">15帧</option>
					    <option value="15">18帧</option>
					    <option value="13">20帧</option>
					    <option value="16">22帧</option>
					    <option value="0">全帧率</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>图像质量：</td>
                <td>   
                    <select id="ddlPictureQuality" class="select w200" style="width:206px;">
                    <!--
					    <option value="4">最好</option>
					    <option value="8">次好</option>
					    <option value="10">较好</option>
					    <option value="12">一般</option>
					    <option value="14">较差</option>
					    <option value="16">差</option>
					-->					
					    <option value="0">最高</option>
					    <option value="1">较高</option>
					    <option value="2">中等</option>
					    <option value="3">低</option>
					    <option value="4">较低</option>
					    <option value="5">最低</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>I帧类型：</td>
                <td>   
                    <select id="ddlFrameOrder" class="select" style="width:206px;">
					    <option value="0">BBP帧</option>
					    <option value="1">BP帧</option>
					    <option value="2">P帧</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>I帧间隔：</td>
                <td>
                    <select id="ddlFrameInterval" class="select" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', this);" lang="['复制到通道','取消复制']"><span class="w75">复制到通道</span></a>
        <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readVideoSetting(this);"><span>读取视频设置</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setVideoSetting(this);"><span class="w50">保存</span></a>
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
            remoteConfig.readVideoSetting(cms.util.$('btnRead'));
        }
    });
    
    $('#ddlStreamType').change(function(){
        if(remoteConfig.isAutoRead){
            remoteConfig.readVideoSetting(cms.util.$('btnRead'));
        }
    });
    
    remoteConfig.getVideoSetting = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getVideoSetting&devCode=' + strDevCode + '&field=vedio_setting';

        module.appendDebugInfo(module.getDebugTime() + '[getVideoSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getVideoSettingCallBack
        });
    };
    
    remoteConfig.getVideoSettingCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showVideoSetting(jsondata);
    };
    
    remoteConfig.showVideoSetting = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        if(info.channel_no != undefined){
            $('#ddlChannelId').attr('value', info.channel_no);
        }
        if(info.stream_type != undefined){
            $('#ddlStreamType').attr('value', info.stream_type);
        }
        $('#ddlStreamModel').attr('value',info.stream_mode);
        $('#ddlResolution').attr('value',info.resolution);
        $('#ddlPictureQuality').attr('value',info.pic_quality);
        $('#ddlBitRateType').attr('value',info.bitrate_type);
        $('#ddlBitRate').attr('value',info.bitrate);
        $('#ddlVideoFrameRate').attr('value',info.frame_rate);
        $('#ddlFrameOrder').attr('value',info.frame_order);
        
        remoteConfig.setIframeInterval(parseInt(info.frame_rate, 10));
        $('#ddlFrameInterval').attr('value',info.iframe_interval);
    };
    
    //remoteConfig.getVideoSetting();
    
    remoteConfig.readVideoSetting = function(btn){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val().trim();
        var streamType = $('#ddlStreamType').val().trim();
        var urlparam = 'action=getVideoSetting&devCode=' + strDevCode + '&setting=' + channelNo + ',' + streamType;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readVideoSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readVideoSettingCallBack,
            param: {
                btn: btn,
                title: '通道' + channelNo + ' ' + (streamType == '1' ? '主码流' : '子码流')
            }
        });
    };
    
    remoteConfig.readVideoSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readVideoSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readVideoSetting', title: '读取视频设置：' + param.title, result:'正在读取，请稍候...', callBack:'remoteConfig.showVideoSettingResult'});
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readVideoSetting(cms.util.$('btnRead'));
    }
    
    remoteConfig.showVideoSettingResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + escape(strResult) + '&field=video_setting';

        module.appendDebugInfo(module.getDebugTime() + '[parseVideoSetting Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getVideoSettingCallBack
        });
    };
        
    remoteConfig.setVideoSetting = function(btn){
        var strParam = cms.util.getCheckBoxCheckedValue('chbChannelCopy');
        var streamType = $('#ddlStreamType').val().trim();
        var isCopy = '' != strParam && strParam.split(',').length > 1;
        var arrChannel = isCopy ? strParam.split(',') : [$('#ddlChannelId').val()];
        for(var n=0; n<arrChannel.length; n++){
            var channelNo = arrChannel[n];
            var strNodeList = '';
            var arrNode = [
                ['channel', channelNo],
                ['stream_type', streamType],
                ['stream_model', $('#ddlStreamModel').val()],
                ['resolution', $('#ddlResolution').val()],
                ['bit_rate_type', $('#ddlBitRateType').val()],
                ['bit_rate', $('#ddlBitRate').val()],
                ['video_frame_rate', $('#ddlVideoFrameRate').val()],
                ['pic_quality', $('#ddlPictureQuality').val()],
                ['frame_order', $('#ddlFrameOrder').val()],
                ['frame_interval', $('#ddlFrameInterval').val()]
            ];
            for(var i=0; i<arrNode.length; i++){
                strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
            }
            var strXml = remoteConfig.buildXml(strNodeList);
            
            var strDevCode = devInfo.devCode;
            var urlparam = 'action=setVideoSetting&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
            if(!remoteConfig.checkControlDisabled(btn)){
                if(!isCopy){
                    return false;
                }
            }
            module.appendDebugInfo(module.getDebugTime() + '[setVideoSetting Request] param: ' + urlparam);
            remoteConfig.ajaxRequest({
                url: remoteConfig.setRemoteConfigUrl,
                data: urlparam,
                callBack: remoteConfig.setVideoSettingCallBack,
                param: {
                    btn: btn,
                    title: '通道' + channelNo + ' ' + (streamType == '1' ? '主码流' : '子码流')
                }
            });
        }
    };
    
    remoteConfig.setVideoSettingCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setVideoSetting Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setVideoSetting', title: '视频设置：' + param.title, result:'正在设置，请稍候...', callBack:''});
    };
    
    remoteConfig.setIframeInterval = function(iframe){
        var obj = cms.util.$('ddlFrameInterval');
        cms.util.clearOption(obj, 0);
        
        var inum = remoteConfig.parseIframeOrder(parseInt(iframe, 10));
        if(0 == inum){
            //全帧率
            inum = 25;
        }
        for(var i=1; i<=10; i++){
            var num = inum * i;
            cms.util.fillOption(obj, num, num);
            if(10 == i){
                obj.value = '' + num;
            }
        }        
    };
    
    remoteConfig.parseIframeOrder = function(iframe){
        var num = 0;
        switch(iframe){
            case 5: num = 1; break;
            case 6: num = 2; break;
            case 7: num = 4; break;
            case 8: num = 6; break;
            case 9: num = 8; break;
            case 10: num = 10; break;
            case 11: num = 12; break;
            case 12: num = 16; break;
            case 14: num = 15; break;
            case 15: num = 18; break;
            case 13: num = 20; break;
            case 16: num = 22; break;
            case 25: num = 25; break;
        }
        return num;
    };
    
    remoteConfig.setIframeInterval($('#ddlVideoFrameRate').val().trim());
</script>