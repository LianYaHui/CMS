<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>远程升级</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设备远程升级</div>
        <div class="prompt" style="line-height:20px;">
            设备收到远程升级指令后，将暂时停止工作。直到远程升级完成，设备重启之后重新开始工作。<br />
            若无异常情况整个升级过程大概需要2-3分钟时间。
        </div>
        <div style="color:#f00;line-height:20px;margin:5px 0;">
            注意：设备远程升级期间设备必须保持电源供电，否则可能导致升级失败，<br />
            最严重情况可能会导致设备程序写入失败，发生故障而停止工作。
        </div>
        <iframe src="<%=Public.WebDir%>/modules/gprsConfig/upload/upload.aspx" frameborder="0" scrolling="auto" width="100%" height="95px" id="frmRemoteUpdate"></iframe>
        <input type="hidden" id="txtRemoteUpdateFile" style="width:400px;" />
    </div>    
    <div style="clear:both;" class="formbottom">
        <a class="btn btnc24" onclick="gprsConfig.remoteUpdate(this);"><span>开始远程升级</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.getRemoteUpdateFile = function(filePath){
        $('#txtRemoteUpdateFile').attr('value', filePath);
    };
    
    gprsConfig.remoteUpdate = function(btn){
        var filePath = $('#txtRemoteUpdateFile').val().trim();
        if(filePath.equals(string.empty)){
            cms.box.alert({title:'提示信息', html:'请先上传升级程序文件。'});
            return false;
        }
        
        var urlparam = 'action=remoteUpdate&devCode=' + devInfo.devCode + '&setting=' + escape(filePath);
        cms.box.confirm({
            title: '设备远程升级',
            html: '确定要进行远程升级吗？',
            callBack: gprsConfig.remoteUpdateAction,
            returnValue: {
                btn: btn,
                urlparam: urlparam,
                filePath: filePath
            }
        });
    };
    
    gprsConfig.remoteUpdateAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var urlparam = pwReturn.returnValue.urlparam;
            var filePath = pwReturn.returnValue.filePath;
            var btn = pwReturn.returnValue.btn;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            module.appendDebugInfo(module.getDebugTime() + '[remoteUpdate Request] urlparam: ' + urlparam);  
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.remoteUpdateCallBack,
                param: {
                    btn: btn,
                    filePath: filePath
                }
            });
        }
        pwobj.Hide();
    };
    
    gprsConfig.remoteUpdateCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[remoteUpdate Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'remoteUpdate', title:'设备远程升级', result:'正在升级，请稍候...'});
        }
    };
</script>