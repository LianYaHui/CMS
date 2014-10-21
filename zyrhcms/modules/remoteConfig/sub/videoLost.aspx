<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>视频丢失设置</title>
    <style type="text/css">
        .rc_box{float:left;width:14px;height:14px;border:solid 1px #ccc;}
        .rc-form-box{overflow:auto;}
    </style>
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
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" checked="checked" id="chbEnabled" /><span>启用视频丢失</span></label>
        <hr style="margin:5px 0;clear:both;" />
        <div id="tabbox" style="margin-bottom:5px;height:25px;"></div>
        <div id="rcFormBox_time" class="rc-form-box">
            <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:120px;">星期：</td>
                    <td>
                        <select id="ddlWeekDay" class="select w150" style="width:156px;">
                            <option value="1">星期一</option>
                            <option value="2">星期二</option>
                            <option value="3">星期三</option>
                            <option value="4">星期四</option>
                            <option value="5">星期五</option>
                            <option value="6">星期六</option>
                            <option value="7">星期日</option>
                        </select>
                    </td>
                </tr>
            </table>
            <table class="tbDeploymentTime tblist" cellpadding="0" cellspacing="0" id="tbDeploymentTime" style="width:380px;margin:5px 0 10px 0;">
                <tr class="trheader" style="height:24px;">
                    <td style="width:50px;text-align:center;">时间段</td>
                    <td style="width:165px;text-align:center;">开始时间</td>
                    <td style="width:165px;text-align:center;">结束时间</td>
                </tr>
            </table>
            
            <hr style="margin:5px 0;clear:both;" />
            <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', this);" lang="['复制到星期','取消复制']"><span class="w75">复制到星期</span></a>
            <div id="divWeekDayPanel" style="margin:10px 0;overflow:hidden; clear:both;"></div>
        </div>        
        <div id="rcFormBox_linkage" class="rc-form-box" style="display:none;">
            <div class="sub-title" style="margin:5px 0;">报警触发方式</div>
            <div style="margin-bottom:10px; display:block; overflow:hidden;" id="divAlarmType"></div>
            <div style="clear:both;">
                <div id="divChannelList"></div>
            </div>
            <div class="sub-title" style="margin:5px 0;">报警抓图配置</div>
            <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:120px;">存储/上传方式：</td>
                    <td colspan="3">
                        <select id="ddlSaveTo" class="select w150">
                            <option value="1">只上传中心</option>
                            <option value="2">只存储在本地</option>
                            <option value="3">上传中心&amp;存储在本地</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>连拍次数：</td>
                    <td style="width:180px;">
                        <select id="ddlCaptureFrequency" class="select w150">
                            <option value="1">1次</option>
                            <option value="2">2次</option>
                            <option value="3">3次</option>
                            <option value="4">4次</option>
                            <option value="5">5次</option>
                        </select>
                    </td>
                    <td style="width:75px;">抓拍间隔：</td>
                    <td>
                        <select class="select w40" id="ddlCaptureIntervalTimeH" style="margin-right:2px;"></select>时
                        <select class="select w40" id="ddlCaptureIntervalTimeM" style="margin-right:2px;"></select>分
                        <select class="select w40" id="ddlCaptureIntervalTimeS" style="margin-right:2px;"></select>秒
                    </td>
                </tr>
                <tr>
                    <td>抓图分辨率：</td>
                    <td>
                        <select id="ddlPictureResolution" class="select w150">
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
                    <td>抓图质量：</td>
                    <td>
                        <select id="ddlPictureQuality" class="select w150" style="width:160px;">
                            <option value="0">最高</option>
					        <option value="1">较高</option>
					        <option value="2">中等</option>
					        <option value="3">低</option>
					        <option value="4">较低</option>
					        <option value="5">最低</option>
                        </select>                
                    </td>
                </tr>
            </table>
            <div class="sub-title" style="margin:5px 0;">抓图通道</div> 
            <div style="clear:both;">
                <div id="divCaptureChannelList"></div>
            </div>
        </div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readVideoLost(this);"><span>读取视频丢失设置</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setVideoLost(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize('setFormContentSize');
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeH'), 0, 23, '00', 1, 2, '0');
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeM'), 0, 59, '00', 1, 2, '0');
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeS'), 0, 59, '05', 1, 2, '0');
    
    var formType = 'time';
	var arrTabs = [
        {code: 'time', name: '布防时间', load: false},
        {code: 'linkage', name: '联动方式', load: false}
    ];
    
    var strHtml = '<div id="rcTabPanel" class="tabpanel" style="margin-left:-2px;">';
    for(var i=0; i<arrTabs.length; i++){
        var tab = arrTabs[i];
        strHtml += '<a class="' + (tab.code == formType ? 'cur':'tab') + '" lang="' + tab.code + '" rel="#rcFormBox_' + tab.code + '">'
            + '<span>' + tab.name + '</span>'
            + '</a>';
    }
    strHtml += '</div>';
    $('#tabbox').html(strHtml);
    
    cms.jquery.tabs('#rcTabPanel', null, '.rc-form-box', '');
    
    showDeploymentTime();
    $(".tbDeploymentTime tr:not(:nth-child(1)) td").css('height','28px');
    
    function setFormContentSize(formSize, conHeight){
        //divFormContent padding:10px;  本页 改为 padding:10px 10px 0 10px;
        var obj = cms.util.$('divFormContent');
        conHeight += obj.style.paddingBottom != '' ? 10 : 0;
        $('#divFormContent').height(conHeight);
        $('.rc-form-box').height(conHeight - 95);
    }
    
    function showDeploymentTime(){
        var objList = cms.util.$('tbDeploymentTime');
        cms.util.clearDataRow(objList, 1);
        var dc = 4;
        var rid = 1;
        
        for(var i = 0; i < dc; i++){
            var row = objList.insertRow(rid);
            
            rowData = buildDeploymentTime(row, rid);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
    }
    
    function buildDeploymentTime(row, rnum){
        var rowData = [];
        var cellid = 0;
        var strStart = '<select class="select w50" name="ddlDeploymentTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlDeploymentTime" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strEnd = '<select class="select w50" name="ddlDeploymentTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlDeploymentTime" style="margin:0 5px 0 10px">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //开始时间
        rowData[cellid++] = {html: strEnd, style:[['textAlign','center']]}; //结束时间
        
        return rowData;
    }
    
    remoteConfig.showAlarmType = function(isReset){
        if(isReset){
            var arr = cms.util.$N('chbAlarmType');
            for(var i=0; i<arr.length; i++){
                arr[i].checked = false;
            }
        } else {
            var arrAlarmType = [
                ['monitor_alarm','监视器上警告'],['sound_alarm','声音报警'],['notify_center','上传中心'],['sms_alarm','短信报警'],['alarm_out','触发报警输出'],['alarm_capture','报警抓图']
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
    remoteConfig.showChannelList('divCaptureChannelList', 'chbCaptureChannelId', '抓图通道A');
    
    remoteConfig.getDeploymentTimePlan = function(type){
        var captureTimeSpan = '';
        var n = 0;
        var arrRange = [];
        var arrTime = cms.util.$N('ddlDeploymentTime');
        for(var i=0,c=arrTime.length/4; i<c; i++){
            n = i*4;
            if(i > 0){
                captureTimeSpan += '|';
            }
            captureTimeSpan += arrTime[n].value.trim() + ':' + arrTime[n+1].value.trim();
            captureTimeSpan += ',' + arrTime[n+2].value.trim() + ':' + arrTime[n+3].value.trim();
            
            var start = parseInt(arrTime[n].value.trim(),10)*60 + parseInt(arrTime[n+1].value.trim(), 10);
            var end = parseInt(arrTime[n+2].value.trim(),10)*60 + parseInt(arrTime[n+3].value.trim(), 10);
            if(0 == start && 0 == end){
                continue;
            }
            else if(start >= end && start > 0){
                cms.box.msgAndFocus(arrTime[n], {title:'提示',html:'开始时间必须小于结束时间'});
                return false;
            } else {
                //检测各组时间是否有交叉
                for(var j=0,t=arrRange.length; j<t; j++){
                    if((start >= arrRange[j][1] && start <= arrRange[j][2]) || (end >= arrRange[j][1] && end <= arrRange[j][2])){
                        cms.box.msgAndFocus(arrTime[n], {title:'提示',html:'第' + (i+1) + '组时间与第' + arrRange[j][0] + '组时间交叉重复'});
                        return false;
                    }
                }
            }
            arrRange.push([(i+1), start, end]);
        }
        return captureTimeSpan;
    };
    
    remoteConfig.getCaptureInterval = function(){
        var h = parseInt($('#ddlCaptureIntervalTimeH').val(), 10);
        var m = parseInt($('#ddlCaptureIntervalTimeM').val(), 10);
        var s = parseInt($('#ddlCaptureIntervalTimeS').val(), 10);
        
        return h*3600 + m*60 + s;
    };
</script>