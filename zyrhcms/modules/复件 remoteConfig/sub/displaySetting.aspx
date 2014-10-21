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
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" checked="checked" /><span>显示名称</span></label>
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
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" checked="checked" /><span>显示日期</span></label>
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
                    <label class="chb-label-nobg" style="float:left;margin-left:-4px;"><input type="checkbox" class="chb" checked="checked" /><span>显示星期</span></label>
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