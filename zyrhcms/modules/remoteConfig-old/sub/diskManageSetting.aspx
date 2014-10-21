<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody">
        <table class="tblist" cellpadding="0" cellspacing="0">
            <tr class="trheader">
                <td style="width:80px;">硬盘号</td>
                <td style="width:120px;">容量(MB)</td>
                <td style="width:120px;">剩余空间(MB)</td>
                <td style="width:80px;">状态</td>
                <td></td>
            </tr>
        </table>
        <div style="padding:5px 0;">
            <label class="chb-label-nobg"><input type="checkbox" class="chb" /><span>全选</span></label>
            <a class="btn btnc22" style="float:right;" onclick="formatDisk();"><span class="w70">格式化硬盘</span></a>
        </div>
        <div style="margin:20px 0;">
            格式化状态：
        </div>
        <div style="clear:both; overflow:hidden;">
            当前进度：
            <div id="progressbar"></div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    var formatProgress = null;
    
    var initialProgressBar = function(){
        var strHtml = '<div id="formatProgress" style="float:left;padding:0;margin:0;height:15px;"></div><input type="hidden" id="txtFormatProgress" readonly="readonly" class="txt w20" style="float:left;" />';
        $('#progressbar').html(strHtml);
        
        formatProgress = new ProgressBar(cms.util.$('formatProgress'),
            {
                id:'formatProgress', width:505, min:0, defaultValue:0, title:'格式化进度',showPercent:true, max:100, limit:{},border:'none',showButton:false,clickAble:false
            }
        );
    };
    
    initialProgressBar();
    
    formatProgress.setting(1);
    
    function formatDisk(){
        var config = {
            id: 'pwFormatDisk',
            title: '确认',
            html: '确定要格式化硬盘吗？'
        };
        cms.box.confirm(config);
    }
</script>