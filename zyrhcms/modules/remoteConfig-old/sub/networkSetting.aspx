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
                <td style="width:120px;">网卡类型：</td>
                <td>
                    <select id="ddlNetworkCard" class="select" style="width:206px;" disabled="disabled">
                        <option value="1">10M半双工</option>
                        <option value="2">10M全双工</option>
                        <option value="3">100半双工</option>
                        <option value="4">100M全双工</option>
                        <option value="6">1000M全双工</option>
                        <option value="5">10M/100M/1000M自适应</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>设备IP地址：</td>
                <td>
                    <input type="text" id="txtDevIp" class="txt w200" value="0.0.0.0" maxlength="16" style="float:left;" />
                </td>
            </tr>
            <tr>
                <td>设备端口号：</td>
                <td>
                    <input type="text" id="txtDevPort" class="txt w200" maxlength="6" value="0" />
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
                    <input type="text" id="txtHttpPort" class="txt w200" maxlength="6" value="81" />
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
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    
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
</script>