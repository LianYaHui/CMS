<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>视频遮盖</title>
    <style type="text/css">
        .div_canvas{width:352px;height:288px;display:block;float:left;background:#000;position:relative;overflow:hidden;cursor:default; margin:0 10px 10px 0;}
        .div_data{border:solid 1px #ccc; padding:2px 5px; margin-bottom:5px; display:none;}
        .rc_div{position:absolute; border:1px dotted #ddd; width:0px; height:0px;left:0px; top:0px; overflow:hidden;}
        .rc_frame{position:absolute;overflow:hidden;}
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
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbEnabled" /><span>启用视频遮盖</span></label>
        <hr style="margin:5px 0;clear:both;" />
        <div class="div_canvas" id="divCanvas"></div>
        <div style="float:left;">
            <div style="line-height:20px;">
                图像分辨率为704*576像素，
                <br />单个区域大小不能超过256*256像素。
                <br /><span style="color:#f50;">左边画布大小为352*288像素</span>
            </div>
            <div id="divData" class="div_data" style="line-height:20px;max-height:200px; overflow:auto;margin:5px 0 0;"></div>
            <div style="margin-top:10px;">
                <a class="btn btnc22" onclick="setDrawEnabled(this);"><span class="w65">开始画图</span></a>
                <a class="btn btnc22" onclick="clearDataConfirm(this);"><span class="w65">全部清除</span></a>
            </div>
            <input type="hidden" id="txtData" />
        </div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readVideoMask(this);"><span>读取视频遮盖</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setVideoMask(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    var objCanvas = cms.util.$('divCanvas');
	var offsetTop = divCanvas.offsetTop;
	var offsetLeft = divCanvas.offsetLeft;
	var arrDottedFrame = [];
	var arrFrame = [];
	var arrData = [];
	var frameCount = 4;
	var frameSize = [128, 128];
	var rate = 0.5;
	//是否可以画图
	var isDraw = false;
	//是否是还原画图
	var isReDraw = false;
	var htFrame = new cms.util.Hashtable();

	var wId = "w";
	var index = 0;
	var startX = 0, startY = 0;
	var flag = false;
	var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";
	
	remoteConfig.drawVideoMask = function(param){
	    var div = document.createElement("div");
		div.className = "rc_frame";
		if(param != undefined){
		    retcLeft = param.x + 'px';
		    retcTop = param.y + 'px';
		    retcWidth = Math.abs(param.cx - param.x) + 'px';
		    retcHeight = Math.abs(param.cy - param.y) + 'px';
		}
		
		div.style.marginLeft = retcLeft;
		div.style.marginTop = retcTop;
		div.style.width = retcWidth;
		div.style.height = retcHeight;

		objCanvas.appendChild(div);

		drawRectangularBox(div, parseInt(retcLeft, 10), parseInt(retcTop, 10), parseInt(retcWidth, 10), parseInt(retcHeight, 10));
	};
	
	objCanvas.onmousedown = function(e){
	    if(!isDraw){
	        return false;
	    }
		flag = true;
		try{
			var evt = window.event || e;
			//var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			//var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
			var scrollTop = cms.util.$('divFormContent').scrollTop;
			var scrollLeft = cms.util.$('divFormContent').scrollLeft;

			startX = evt.clientX - offsetLeft + scrollLeft;
			startY = evt.clientY - offsetTop + scrollTop;
			
			var div = document.createElement("div");
			index++;
			div.id = wId + (index);
			div.className = "rc_div";
			div.style.marginLeft = startX + "px";
			div.style.marginTop = startY + "px";
			
			objCanvas.appendChild(div);
			
	        arrDottedFrame.push(div);
		}catch(e){
		    //alert(e);
		}
	}
	objCanvas.onmouseup = function(){
	    if(!isDraw){
	        return false;
	    }
		try{
			//objCanvas.removeChild(cms.util.$(wId + index));
			clearDottedFrame();
			
			remoteConfig.drawVideoMask();
			
		}catch(e){
			//alert(e);
		}
		flag = false;
	}
	objCanvas.onmousemove = function(e){
	    if(!isDraw){
	        return false;
	    }
		if(flag){
			try{
				var evt = window.event || e;
			    var scrollTop = cms.util.$('divFormContent').scrollTop;
			    var scrollLeft = cms.util.$('divFormContent').scrollLeft;

				retcLeft = (startX - (evt.clientX - offsetLeft) - scrollLeft > 0 ? evt.clientX - offsetLeft + scrollLeft : startX) + "px";
				retcTop = (startY - (evt.clientY - offsetTop) - scrollTop > 0 ? evt.clientY - offsetTop + scrollTop: startY) + "px";
				
				retcHeight = Math.abs(startY - evt.clientY + offsetTop - scrollTop) + "px";
				retcWidth = Math.abs(startX - evt.clientX + offsetLeft - scrollLeft) + "px";
			
				cms.util.$(wId + index).style.marginLeft = retcLeft;
				cms.util.$(wId + index).style.marginTop = retcTop;
				cms.util.$(wId + index).style.width = retcWidth;
				cms.util.$(wId + index).style.height = retcHeight;
			}catch(e){
				//alert(e);
			}
		}
		cms.util.stopBubble(e);
	}

	function drawRectangularBox(obj, x, y, w, h){
	    var strKey = x + '_' + y + '_' + w + '_' + h;
	    if(htFrame.contains(strKey)){
	        //重复单击鼠标
	        return false;
	    }
	    htFrame.add(strKey);
	    
	    if((!isDraw && !isReDraw) || w == 0 || h == 0){
	        return false;
	    }
	    
		if(arrFrame.length >= frameCount && frameCount > 0){
			clearFrame();
		}
		
		if(frameSize[0] > 0 && parseInt(w,10) >= frameSize[0]){
			w = frameSize[0];
		}
		if(frameSize[1] > 0 && parseInt(h,10) >= frameSize[1]){
			h = frameSize[1];
		}
		
		obj.style.width = (w-2) + 'px';
		obj.style.height = (h-2) + 'px';
		obj.style.background = '#fff';
		obj.style.border = 'solid 1px #ccc';
		obj.style.color = '#000';
		obj.style.lineHeight = (h-2) + 'px';
		obj.style.textAlign = 'center';
		
		var x1 = x + w;
		var y1 = y + h;
		
		arrFrame.push(obj);
		arrData.push([x, y, x1, y1, w, h]);
		
		obj.innerHTML = arrFrame.length;
		
		getData();
	}
	
	function clearFrame(){
		for(var i=0; i<arrFrame.length; i++){
			objCanvas.removeChild(arrFrame[i]);
		}
		arrFrame.length = 0;
		arrData.length = 0;
		
		htFrame.clear();
		
		getData(true);
		
	    clearDottedFrame();
	}
	
	function clearDottedFrame(){
	    if(arrDottedFrame.length > 0){
	        for(var i=0; i<arrDottedFrame.length; i++){
			    objCanvas.removeChild(arrDottedFrame[i]);
		    }
		    arrDottedFrame.length = 0;
	    }
	}
	
	function setDrawEnabled(btn){
	    if(!getEnabled()){
	        cms.box.alert({title:'提示信息', html:'请先启用视频遮盖！'});
	        return false;
	    }
	    if(isDraw){
	        btn.childNodes[0].innerHTML = '开始画图';
	    } else {
	        btn.childNodes[0].innerHTML = '停止画图';	    
	    }
	    isDraw = !isDraw;	    
	}
	
	function clearDataConfirm(btn){
	    var config = {
	        id: 'pwClearDataConfirm',
	        title: '清除区域',
	        html: '是否清除所画区域？',
	        callBack: clearDataConfirmCallBack
	    };
	    cms.box.confirm(config);
	}
	
	function clearDataConfirmCallBack(pwobj, pwReturn){
	    if(pwReturn.dialogResult){
	        clearFrame();
	    }
	    pwobj.Hide();
	}
	
	function getEnabled(){
	    return $('#chbEnabled').attr("checked");
	}
	
	function getData(isClear){
	    if(isClear == undefined){
	        isClear = false;
	    }
	    var strHtml = '';
	    var strData = '';
	    var c = arrData.length;
	    if(isClear || c == 0){
	        $('#divData').html('');
	        $('#divData').hide();
	        $('#txtData').attr('value', '');
	    } else {
	        for(var i=0; i<c; i++){
	            var x = (arrData[i][0]/rate);
	            var y = (arrData[i][1]/rate);
	            var x1 = (arrData[i][2]/rate);
	            var y1 = (arrData[i][3]/rate);
	            strHtml += (i+1) + '. x:' + x + ', y:' + y 
	                + ', x1:' + x1 + ', y1:' + y1
	                + '<br />w:' + (arrData[i][4]/rate) + ', h:' + (arrData[i][5]/rate) + '<br />';
                if(i > 0){
                    strData += '|';
                }
	            strData += x + ',' + y + ',' + x1 + ',' + y1;
	        }
    	    
	        $('#divData').html(strHtml);
	        $('#divData').show();
	        $('#txtData').attr('value', strData);
	    }
	}
	
	//-----------以下是功能代码---------
	remoteConfig.getVideoMask = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getVideoMask&devCode=' + strDevCode + '&field=video_mask';

        module.appendDebugInfo(module.getDebugTime() + '[getVideoMask Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getVideoMaskCallBack
        });
    };
    
    remoteConfig.getVideoMaskCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showVideoMask(jsondata, param);
    };
    
    remoteConfig.showVideoMask = function(jsondata, param){
        if(0 == jsondata.list.length) return false;
        if('video_mask' == param){
            clearFrame();
            var list = jsondata.list;
            isReDraw = true;
            for(var i=0; i<list.length; i++){
                var info = list[i];
                
                remoteConfig.drawVideoMask({
                    x: parseInt(info.x, 10)*rate, 
                    y: parseInt(info.y, 10)*rate,
                    cx: parseInt(info.cx, 10)*rate, 
                    cy: parseInt(info.cy, 10)*rate
                });
            }        
        } else {
            var info = jsondata.list[0];
            $('#chbEnabled').attr("checked", info.enabled == '1');        
        }
    };
    
    //remoteConfig.getVideoMask();
    
    remoteConfig.readVideoMask = function(btn){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val();
        
        var urlparam = 'action=getVideoMaskEnabled&devCode=' + strDevCode + '&setting=' + channelNo;
        module.appendDebugInfo(module.getDebugTime() + '[readVideoMaskEnabled Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readVideoMaskCallBack,
            param: {
                btn: btn,
                field: 'video_mask_enabled'
            }
        });
        var urlparam = 'action=getVideoMask&devCode=' + strDevCode + '&setting=' + channelNo;        
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readVideoMask Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readVideoMaskCallBack,
            param: {
                btn: btn,
                field: 'video_mask'
            }
        });
    };
    
    remoteConfig.readVideoMaskCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readVideoMask Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({
            id:id, action:'readVideoMask', title:'读取视频遮盖', result:'正在读取，请稍候...',
            callBack:'remoteConfig.showVideoMaskResult',
            callBackParam: param.field
        });
    };
    
    remoteConfig.showVideoMaskResult = function(strResult, bSuccess, strParam){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + strResult + '&field=' + strParam;

        module.appendDebugInfo(module.getDebugTime() + '[parseVideoMask Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getVideoMaskCallBack,
            param: strParam
        });
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readVideoMask(cms.util.$('btnRead'));
    }
       
    remoteConfig.setVideoMask = function(btn){
        var strDevCode = devInfo.devCode;
        
        var strNodeList = '';
        var arrNode = [
            ['channel_no', $('#ddlChannelId').val()],
            ['enable', $('#chbEnabled').attr("checked") ? '1' : '0']
        ];
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var urlparam = 'action=setVideoMaskEnabled&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
        
        module.appendDebugInfo(module.getDebugTime() + '[setVideoMaskEnabled Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.setRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.setVideoMaskCallBack,
            param: {
                btn: btn
            }
        });
        
        strNodeList = '';
        var arrNode = [
            ['channel_no', $('#ddlChannelId').val()],
            ['mask', $('#txtData').val()],
            ['max_count', frameCount]
        ];
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var urlparam = 'action=setVideoMask&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml);
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[setVideoMask Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.setRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.setVideoMaskCallBack,
            param: {
                btn: btn
            }
        });
        
    };
    
    remoteConfig.setVideoMaskCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setVideoMask Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setVideoMask', title:'设置视频遮盖', result:'正在设置，请稍候...', callBack:''});
    };
</script>