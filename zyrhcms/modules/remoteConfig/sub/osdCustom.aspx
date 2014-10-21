<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>OSD叠加</title>
    <style type="text/css">
        .div_canvas{width:352px;height:288px;display:block;float:left;background:#000;position:relative;overflow:hidden;cursor:default; margin:0 10px 10px 0;}
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
        <hr style="margin:5px 0;" />
        <div class="div_canvas" id="divCanvas"></div>
        <div style="overflow:hidden;display:block; float:left;">
            <table class="tblist" cellpadding="0" cellspacing="0" style="text-align:center;" id="tbOsdCustom">
                <tr>
                    <td style="width:70px;">显示字符</td>
                    <td style="width:165px;">字符内容</td>
                    <td style="width:65px;">字符X坐标</td>
                    <td style="width:65px;">字符Y坐标</td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readOsdCustom(this);"><span>读取OSD叠加</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setOsdCustom(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    var objCanvas = cms.util.$('divCanvas');
    var arrOsd = [];
    var osdCount = 4;
	var rate = 0.5;
    
    remoteConfig.buildOsdCustomList = function(){
        var objList = cms.util.$('tbOsdCustom');
        var rowData = [];
        var rid = 1;
        var cellid = 0;
        
        cms.util.clearDataRow(objList, 1);
        
        for(var i=0; i<osdCount; i++){
            var row = objList.insertRow(rid++);
            rowData = [];
            cellid = 0;
            
            var strCheck = '<label class="chb-label-nobg" style="margin:5px 0 0;height:20px;">'
                + '<input type="checkbox" name="chbOsd" class="chb" id="chbOsd_' + i + '" onclick="remoteConfig.setOsdControlDisabled(' + i + ',!this.checked);showOsdPosition();" /><span>字符串' + (i+1) + '</span>'
                + '</label>';
            
            rowData[cellid++] = {html: strCheck, style:[]};
            rowData[cellid++] = {html: '<input type="text" name="txtOsd" id="txtOsd_' + i + '" disabled="disabled" class="txt w150" maxlength="32" onchange="showOsdPosition();" />', style:[]};
            rowData[cellid++] = {html: '<input type="text" name="txtOsdPosX" id="txtOsdPosX_' + i + '" disabled="disabled" class="txt w50" maxlength="3" value="0" onchange="showOsdPosition();" />', style:[]};
            rowData[cellid++] = {html: '<input type="text" name="txtOsdPosY" id="txtOsdPosY_' + i + '" disabled="disabled" class="txt w50" maxlength="3" value="0" onchange="showOsdPosition();" />', style:[]};
            rowData[cellid++] = {html: '', style:[]};
            
            cms.util.fillTable(row, rowData);
            
            delete rowData;
        }
    };
    
    remoteConfig.buildOsdCustomList();
    
    //显示OSD文字位置
    function showOsdPosition(){
        var osdList = remoteConfig.getOsdCustomInput();
        if(!osdList){
            return false;
        }
        clearOsdPosition();
        
        var arr = osdList.split('|');
        for(var i=0; i<arr.length; i++){
            var osd = arr[i].split(',');
            if(parseInt(osd[0], 10) == 1 && osd[1].trim() != ''){
		        arrOsd.push(createOsd(osd[1], parseInt(osd[2], 10), parseInt(osd[3], 10)));
		    }
        }
    }
    
    function createOsd(str, x, y){
        var div = document.createElement("div");
        div.innerHTML = str;
        div.style.left = (x * rate) + 'px';
        div.style.top = (y * rate) + 'px';
        div.style.position = 'absolute';
        div.style.color = '#fff';
        div.style.fontSize = 16 + 'px';
        div.style.lineHeight = 18 + 'px';
        div.style.fontFamily = '宋体,Arial';
        
		objCanvas.appendChild(div);
		
		return div;
    }
    
    function clearOsdPosition(){
        if(arrOsd.length > 0){
            for(var i=0; i<arrOsd.length; i++){
                objCanvas.removeChild(arrOsd[i]);
            }
            arrOsd.length = 0;
        }
    }
    
    remoteConfig.setOsdControlDisabled = function(idx, disabled){
        $('#txtOsd_' + idx).attr('disabled', disabled);
        $('#txtOsdPosX_' + idx).attr('disabled', disabled);
        $('#txtOsdPosY_' + idx).attr('disabled', disabled);
        if(!disabled){
            $('#txtOsd_' + idx).focus();
        }
    };
    
    remoteConfig.getOsdCustom = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getOsdCustom&devCode=' + strDevCode + '&field=osd_custom';

        module.appendDebugInfo(module.getDebugTime() + '[getOsdCustom Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getOsdCustomCallBack
        });
    };
    
    remoteConfig.getOsdCustomCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showOsdCustom(jsondata);
    };
    
    remoteConfig.showOsdCustom = function(jsondata){
        remoteConfig.buildOsdCustomList();
        if(0 == jsondata.list.length) return false;
        
        var arrChb = cms.util.$N('chbOsd');
        var arrOsd = cms.util.$N('txtOsd');
        var arrOsdPosX = cms.util.$N('txtOsdPosX');
        var arrOsdPosY = cms.util.$N('txtOsdPosY');
        
        for(var i=0; i<jsondata.list.length; i++){
            var info = jsondata.list[i];
            arrChb[i].checked = info.enabled == '1';
            arrOsd[i].value = info.osd;
            arrOsdPosX[i].value = info.x;
            arrOsdPosY[i].value = info.y;
            
            remoteConfig.setOsdControlDisabled(i, info.enabled != '1');
        }
        
        showOsdPosition();
    };
    
    //remoteConfig.getOsdCustom();
    
    remoteConfig.readOsdCustom = function(btn){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val();
        var urlparam = 'action=getOsdCustom&devCode=' + strDevCode + '&setting=' + channelNo;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readOsdCustom Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readOsdCustomCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    remoteConfig.readOsdCustomCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readOsdCustom Response] data: ' + data);
        remoteConfig.setControlDisabledByTiming(param.btn, false);
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
        remoteConfig.task.appendTaskList({id:id, action:'readOsdCustom', title:'读取OSD叠加', result:'正在读取，请稍候...', callBack:'remoteConfig.showOsdCustomResult'});
    };
    
    remoteConfig.showOsdCustomResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=osd_custom';

        module.appendDebugInfo(module.getDebugTime() + '[parseOsdCustom Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getOsdCustomCallBack
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readOsdCustom(cms.util.$('btnRead'));
    }
    
    remoteConfig.getOsdCustomInput = function(){
        var strOsdList = '';
        var arrChb = cms.util.$N('chbOsd');
        var arrOsd = cms.util.$N('txtOsd');
        var arrOsdPosX = cms.util.$N('txtOsdPosX');
        var arrOsdPosY = cms.util.$N('txtOsdPosY');
        
        for(var i=0; i<arrChb.length; i++){
            if(i > 0){
                strOsdList += '|';
            }
            strOsdList += (arrChb[i].checked ? 1 : 0) + ',' + arrOsd[i].value.trim().replace(/(,)|[\|]/g, '');
            
            if(arrOsdPosX[i].value.trim() == ''){
                arrOsdPosX[i].value = '0';
            }
            if(!remoteConfig.checkNumberInput({obj:arrOsdPosX[i],min:0,max:704,prompt:'字符X坐标'})){
                return false;
            } else {
                strOsdList += ',' + arrOsdPosX[i].value.trim();
            }
            if(arrOsdPosY[i].value.trim() == ''){
                arrOsdPosY[i].value = '0';
            }
            if(!remoteConfig.checkNumberInput({obj:arrOsdPosY[i],min:0,max:576,prompt:'字符Y坐标'})){
                return false;
            } else {
                strOsdList += ',' + arrOsdPosY[i].value.trim();
            }
        }
        return strOsdList;
    };
    
    remoteConfig.setOsdCustom = function(btn){
        var strNodeList = '';
        var strOsdList = remoteConfig.getOsdCustomInput();
        if(!strOsdList){
            return false;
        }
        var arrNode = [
            ['channel_no', $('#ddlChannelId').val()],
            ['osd_list', strOsdList]
        ];
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=setOsdCustom&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[setOsdCustom Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.setRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.setOsdCustomCallBack,
            param: {
                btn: btn
            }
        });
        
    };
    
    remoteConfig.setOsdCustomCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setOsdCustom Response] data: ' + data);
        remoteConfig.setControlDisabledByTiming(param.btn, false);
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
        remoteConfig.task.appendTaskList({id:id, action:'setNetwork', title:'设置OSD叠加', result:'正在设置，请稍候...', callBack:''});
    };
</script>