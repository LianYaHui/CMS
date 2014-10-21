<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
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
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readDiskStatus(this);"><span>读取硬盘状态</span></a>
        <a class="btn btnc24" id="btnSet"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
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
    
    remoteConfig.readDiskStatus = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDiskStatus&devCode=' + strDevCode + '&field=disk_status';
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readDiskStatus Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readDiskStatusCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readDiskStatusCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readDiskStatus Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readDiskStatus', title:'读取硬盘状态', result:'正在读取，请稍候...', callBack:'remoteConfig.showDiskStatusResult'});
        remoteConfig.setControlDisabledByTiming(param.btn, false);
    };
    
    remoteConfig.showDiskStatusResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=network_setting';

        module.appendDebugInfo(module.getDebugTime() + '[parseDiskStatus Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDiskStatusCallBack
        });
    };
</script>