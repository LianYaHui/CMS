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
        <div class="">报警触发方式</div>
        <div>
            <ul>
                <li>
                    <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" /><span>监视器上警告</span></label>
                </li>
                <li>
                    <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" /><span>声音报警</span></label>
                </li>
            </ul>
        </div>
        <div style="clear:both;">
            <label class="chb-label-nobg"><input type="checkbox" class="chb" /><span>输出通道A1</span></label>
        </div>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    }) 
</script>