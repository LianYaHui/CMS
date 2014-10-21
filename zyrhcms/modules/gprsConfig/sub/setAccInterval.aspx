<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置ACC发送数据间隔</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">ACC开 发送数据间隔</div>
        <div class="prompt"></div>
        <div style="margin:5px 0 10px;">
            间隔时间：<input type="text" class="txt w40" id="txtAccOpenInterval" onkeyup="value=value.replace(/[^\d]/g,'')" style="text-align:center;" maxlength="5" /> 秒
        </div>
        <div class="itemtitle">ACC关 发送数据间隔</div>
        <div class="prompt"></div>
        <div style="margin:5px 0 10px;">
            间隔时间：<input type="text" class="txt w40" id="txtAccCloseInterval" onkeyup="value=value.replace(/[^\d]/g,'')" style="text-align:center;" maxlength="5" /> 秒
        </div>
        <a class="btn btnc24" id="btnGet" onclick="gprsConfig.getAccInterval(this);"><span class="w40">读取</span></a>
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setAccInterval(this);"><span class="w40">设置</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    //最小保存间隔，单位：秒
    gprsConfig.minAccInterval = 5;
    
    $('#lblMinSaveInterval').html(gprsConfig.minAccInterval);
    
    gprsConfig.getAccInterval = function(btn){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getAccInterval&devCode=' + strDevCode + '&field=';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getAccInterval Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getAccIntervalCallBack,
            param: {
                btn: btn
            }
        });

        gprsConfig.frame.setFormPrompt('正在读取，请稍候...');
    };
    
    gprsConfig.getAccIntervalCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getAccInterval Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.content == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var setting = jsondata.content.split(',');
        $('#txtAccOpenInterval').attr('value', setting[0]);
        $('#txtAccCloseInterval').attr('value', setting[1]);
        
        gprsConfig.frame.setFormPrompt('读取完成');
        
    };
    
    gprsConfig.setAccInterval = function(btn){
        var strDevCode = devInfo.devCode;
        var strOpen = $('#txtAccOpenInterval').val().trim();
        var strClose = $('#txtAccCloseInterval').val().trim();
        var strSetting = strOpen + ',' + strClose;
        if('' == strOpen){
            cms.box.msgAndFocus(cms.util.$('txtAccOpenInterval'),{title: '提示信息',html:'请输入ACC间隔。'});
            return false;
        } else if('' == strClose){
            cms.box.msgAndFocus(cms.util.$('txtAccCloseInterval'),{title: '提示信息',html:'请输入ACC间隔。'});
            return false;
        }
        if(parseInt(strOpen, 10) < gprsConfig.minAccInterval){
            cms.box.msgAndFocus(cms.util.$('txtAccOpenInterval'),{title: '提示信息',html:'发送数据间隔不能小于' + gprsConfig.minAccInterval + '秒。'});
            return false;
        }
        if(parseInt(strClose, 10) < gprsConfig.minAccInterval){
            cms.box.msgAndFocus(cms.util.$('txtAccCloseInterval'),{title: '提示信息',html:'发送数据间隔不能小于' + gprsConfig.minAccInterval + '秒。'});
            return false;
        }
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        
        var urlparam = 'action=setAccOpenInterval&devCode=' + strDevCode + '&setting=' + strOpen;
        module.appendDebugInfo(module.getDebugTime() + '[setAccOpenInterval Request] urlparam: ' + urlparam);
        
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setAccIntervalCallBack,
            param: {
                btn: btn,
                setting: strOpen,
                title: '设置ACC开 发送数据间隔'
            }
        });
        
        var urlparam = 'action=setAccCloseInterval&devCode=' + strDevCode + '&setting=' + strClose;
        module.appendDebugInfo(module.getDebugTime() + '[setAccCloseInterval Request] urlparam: ' + urlparam);

        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.setAccIntervalCallBack,
            param: {
                btn: btn,
                setting: strClose,
                title: '设置ACC关 发送数据间隔'
            }
        });
    };
    
    gprsConfig.setAccIntervalCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setAccInterval Response] data: ' + data);
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
        var id = jsondata.list[0];
        gprsConfig.task.appendTaskList({id:id, action:'setAccInterval', title: param.title + '：' + param.setting + '秒', result:'正在设置，请稍候...'});
    };
    
    gprsConfig.getAccInterval();
</script>