<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>设置LED屏大小</title>
</head>
<body>
    <div class="formbody" style="padding-top:5px;">
        <div class="itemtitle">设置LED屏大小</div>
        <div class="prompt">
            说明：LED屏宽度高度单位为像素。
        </div>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td class="w65">屏幕宽度：</td>
                <td class="w85"><select id="ddlScreenWidth" class="select w80"></select></td>
                <td class="w65">屏幕高度：</td>
                <td class="w85"><select id="ddlScreenHeight" class="select w80"></select></td>
                <td class="w65">文字大小：</td>
                <td><select id="ddlFontSize" class="select w80"></select></td>
            </tr>
            <tr>
                <td>数据极性：</td>
                <td><select id="ddlDataPolarity" class="select w80"></select></td>
                <td>OE极性：</td>
                <td><select id="ddlOEPolarity" class="select w80"></select></td>
                <td>颜色类型：</td>
                <td><select id="ddlColorType" class="select w80"></select></td>
            </tr>
            <tr>
                <td>扫描方式：</td>
                <td colspan="3"><select id="ddlScanType" class="select w80"></select></td>
            </tr>
        </table>
        <br />
        <!--<a class="btn btnc24" id="btnRead" onclick="gprsConfig.readScreenSize(this);"><span class="w85">读取屏大小</span></a>-->
        <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setScreenSize(this);"><span class="w85">设置屏大小</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.devVolume = [0, 0]; 
    gprsConfig.barDevVolume = [null, null];
        
    gprsConfig.initialControl = function(){
        cms.util.fillNumberOptions(cms.util.$('ddlScreenWidth'), 16, 320, 160, 16);
        cms.util.fillNumberOptions(cms.util.$('ddlScreenHeight'), 16, 240, 80, 16);
        cms.util.fillNumberOptions(cms.util.$('ddlFontSize'), 8, 32, 16, 8);
        
        var arrPolarity = [
            ['0','低'],['1','高']
        ];
        var arrColor = [
            ['0', '单色'],['1', '双基色'],['2', '全彩']
        ];
        var arrScan = [
            ['0', '1/16'],['1', '1/8'],['2', '1/4'],['3', '1/2'],['4', '静态扫描']
        ];
        cms.util.fillOptions(cms.util.$('ddlDataPolarity'), arrPolarity, '0');
        cms.util.fillOptions(cms.util.$('ddlOEPolarity'), arrPolarity, '0');
        cms.util.fillOptions(cms.util.$('ddlColorType'), arrColor, '0');
        
        cms.util.fillOptions(cms.util.$('ddlScanType'), arrScan, '2');
    };
        
    gprsConfig.getScreenSize = function(btn){debugger;
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getLedScreenSize&devCode=' + strDevCode + '&field=';
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getLedScreenSize Request] param: ' + urlparam);
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getScreenSizeCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    gprsConfig.getScreenSizeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getLedScreenSize Response] data: ' + data);
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
        var con = jsondata.content;
        var arr = con.split(',');
        if(arr.length >= 6){
            $('#ddlScreenWidth').attr('value', arr[0]);
            $('#ddlScreenHeight').attr('value', arr[1]);
            $('#ddlFontSize').attr('value', arr[2]);
            $('#ddlDataPolarity').attr('value', arr[3]);
            $('#ddlOEPolarity').attr('value', arr[4]);
            $('#ddlColorType').attr('value', arr[5]);
            $('#ddlScanType').attr('value', arr[6]); 
        } else {
            var strError = con;
            cms.box.alert({title:'错误信息', html:strError});
        }
    };
    
    gprsConfig.initialControl();
    gprsConfig.getScreenSize();
        
    gprsConfig.setScreenSize = function(btn){
        cms.box.confirm({
            title: '设置屏大小',
            html: '确定要设置屏大小吗？',
            callBack: gprsConfig.setScreenSizeAction,
            returnValue: {
                btn: btn
            }
        });
    };
    
    gprsConfig.setScreenSizeAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var strDevCode = devInfo.devCode;
            var strSetting = $('#ddlScreenWidth').val().trim()
                + '|' + $('#ddlScreenHeight').val().trim()
                + '|' + $('#ddlDataPolarity').val().trim()
                + '|' + $('#ddlOEPolarity').val().trim()
                + '|' + $('#ddlScanType').val().trim()
                + '|' + $('#ddlColorType').val().trim()
                + '|' + $('#ddlFontSize').val().trim();
            var urlparam = 'action=setLedScreenSize&devCode=' + strDevCode + '&setting=' + strSetting;
            module.appendDebugInfo(module.getDebugTime() + '[setLedScreenSize Request] param: ' + urlparam);
            var btn = pwReturn.returnValue.btn;
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setScreenSizeCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
    };
    
    gprsConfig.setScreenSizeCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setLedScreenSize Response] data: ' + data);
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
        gprsConfig.task.appendTaskList({id:id, action:'setLedScreenSize', title:'设置屏大小', result:'正在设置，请稍候...'});
    };
    
    if(gprsConfig.isAutoRead){
        gprsConfig.getScreenSize();
    }
</script>