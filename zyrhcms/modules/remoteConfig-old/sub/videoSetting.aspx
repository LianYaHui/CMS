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
                <td style="width:120px;">通道号：</td>
                <td>
                    <select id="ddlChannelId" class="select" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">码流类别：</td>
                <td>
                    <select id="ddlStreamType" class="select" style="width:206px;">
					    <option value="0">主码流</option>
					    <option value="1">子码流</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>码流类型：</td>
                <td>   
                    <select id="ddlStreamModel" class="select" style="width:206px;">
					    <option value="1">视频流</option>
					    <option value="3">复合流</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>分辨率：</td>
                <td>   
                    <select id="ddlResolutionRatio" class="select" style="width:206px;">
					    <option value="1">QCIF(176*144)</option>
					    <option value="2">CIF(352*288)</option>
					    <option value="4">2CIF(704*288)</option>
					    <option value="8">4CIF(704*576)</option>
					    <option value="10">800*600</option>
					    <option value="11">1024*768</option>
					    <option value="12">1280*720</option>
					    <option value="13">1280*960</option>
					    <option value="14">1920*1080</option>
					    <option value="15">2048*1536</option>
					    <option value="16">2560*1920</option>
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
                    <select id="ddlVideoFrameRate" class="select" style="width:206px;">
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
					    <option value="4">最好</option>
					    <option value="8">次好</option>
					    <option value="10">较好</option>
					    <option value="12">一般</option>
					    <option value="14">较差</option>
					    <option value="16">差</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>I帧类型：</td>
                <td>   
                    <select id="ddlFrameType" class="select" style="width:206px;">
					    <option value="0">BBP帧</option>
					    <option value="1">BP帧</option>
					    <option value="2">P帧</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>I帧间隔：</td>
                <td>
                    <input id="txtFrameInterval" class="txt w200" />
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', this);" lang="['复制到通道','取消复制']"><span class="w75">复制到通道</span></a>
        <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    remoteConfig.copyToChannel = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var chbName = pwReturn.returnValue.chbName;
        }
        pwobj.Hide();
    };
</script>