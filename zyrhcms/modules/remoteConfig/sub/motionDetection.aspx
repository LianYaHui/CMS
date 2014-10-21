<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>移动侦测</title>
    <style type="text/css">
        .div_canvas{width:352px;height:288px;display:block;float:left;background:#000;position:relative;overflow:hidden;cursor:default; margin:0 10px 10px 0;}
        .div_data{border:solid 1px #ccc; padding:2px 5px; margin-bottom:5px; display:none;}
        .rc_div{position:absolute; border:1px dotted #ddd; width:0px; height:0px;left:0px; top:0px; overflow:hidden;}
        .rc_frame{position:absolute;overflow:hidden;}
        .rc_box{float:left;width:14px;height:14px;border:solid 1px #ccc;}
        .rc-form-box{overflow:auto;}
    </style>
</head>
<body>
    <div class="formbody" id="divFormContent" style="padding-bottom:0;">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">通道号：</td>
                <td>
                    <select id="ddlChannelId" class="select" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbEnabled" /><span>启用移动侦测</span></label>
        <hr style="margin:5px 0;clear:both;" />
        <div id="tabbox" style="margin-bottom:5px;height:25px;"></div>
        <div id="rcFormBox_area" class="rc-form-box">
            <div style="float:left;">
                <div class="div_canvas" id="divCanvas" ondblclick="drawRectangularBox(null,0,0,352,288);cms.util.stopBubble(event);"></div>            
                <div style="clear:both;overflow:hidden;">
                    <span style="float:left;">灵敏度：</span>
                    <label class="chb-label-nobg" style="margin:0 10px 0 5px;">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="0" checked="checked" /><span>关闭</span>
                    </label>
                    <label class="chb-label-nobg" style="margin-right:10px;">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="1" /><span>1</span>
                    </label>
                    <label class="chb-label-nobg" style="margin-right:10px;">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="2" /><span>2</span>
                    </label>
                    <label class="chb-label-nobg" style="margin-right:10px;">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="3" /><span>3</span>
                    </label>
                    <label class="chb-label-nobg" style="margin-right:10px;">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="4" /><span>4</span>
                    </label>
                    <label class="chb-label-nobg" style="margin-right:10px;">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="5" /><span>5</span>
                    </label>
                    <label class="chb-label-nobg">
                        <input type="radio" class="chb" name="rbAlarmSensitivity" value="6" /><span>6</span>
                    </label>
                </div>
            </div>
            <div style="float:left;">
                <div style="line-height:20px;">
                    说明：图像分辨率为704*576像素
                    <br /><span style="color:#f50;">左边画布大小为352*288像素</span>
                </div>
                <div id="divData" class="div_data" style="line-height:18px;max-height:50px; overflow:auto; margin:5px 0 0;"></div>
                <div id="divArea" class="div_data" style="line-height:18px;max-height:145px; overflow:auto; margin:5px 0 0;"></div>
                <div style="margin-top:10px;">
                    <a class="btn btnc22" onclick="setDrawEnabled(this);"><span class="w65">开始画图</span></a>
                    <a class="btn btnc22" onclick="clearDataConfirm(this);"><span class="w65">全部清除</span></a>
                </div>
                <input type="hidden" id="txtData" />
                <input type="hidden" id="txtArea" />
            </div>        
        </div>        
        <div id="rcFormBox_time" class="rc-form-box" style="display:none;">
            <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:120px;">星期：</td>
                    <td>
                        <select id="ddlWeekDay" class="select w150" style="width:156px;">
                            <option value="1">星期一</option>
                            <option value="2">星期二</option>
                            <option value="3">星期三</option>
                            <option value="4">星期四</option>
                            <option value="5">星期五</option>
                            <option value="6">星期六</option>
                            <option value="7">星期日</option>
                        </select>
                    </td>
                </tr>
            </table>
            <table class="tbDeploymentTime tblist" cellpadding="0" cellspacing="0" id="tbDeploymentTime" style="width:380px;margin:5px 0 10px 0;">
                <tr class="trheader" style="height:24px;">
                    <td style="width:50px;text-align:center;">时间段</td>
                    <td style="width:165px;text-align:center;">开始时间</td>
                    <td style="width:165px;text-align:center;">结束时间</td>
                </tr>
            </table>
        </div>
        <div id="rcFormBox_linkage" class="rc-form-box" style="display:none;">
            <div class="sub-title" style="margin:5px 0;">报警触发方式</div>
            <div style="margin-bottom:10px; display:block; overflow:hidden;" id="divAlarmType"></div>
            <div style="clear:both;">
                <div id="divChannelList"></div>
            </div>
            <div class="sub-title" style="margin:5px 0;">报警抓图配置</div>
            <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:120px;">存储/上传方式：</td>
                    <td colspan="3">
                        <select id="ddlSaveTo" class="select w150">
                            <option value="1">只上传中心</option>
                            <option value="2">只存储在本地</option>
                            <option value="3">上传中心&amp;存储在本地</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>连拍次数：</td>
                    <td style="width:180px;">
                        <select id="ddlCaptureFrequency" class="select w150">
                            <option value="1">1次</option>
                            <option value="2">2次</option>
                            <option value="3">3次</option>
                            <option value="4">4次</option>
                            <option value="5">5次</option>
                        </select>
                    </td>
                    <td style="width:75px;">抓拍间隔：</td>
                    <td>
                        <select class="select w40" id="ddlCaptureIntervalTimeH" style="margin-right:2px;"></select>时
                        <select class="select w40" id="ddlCaptureIntervalTimeM" style="margin-right:2px;"></select>分
                        <select class="select w40" id="ddlCaptureIntervalTimeS" style="margin-right:2px;"></select>秒
                    </td>
                </tr>
                <tr>
                    <td>抓图分辨率：</td>
                    <td>
                        <select id="ddlPictureResolution" class="select w150">
                            <option value="1">QCIF (176*144)</option>
					        <option value="2">CIF (352*288)</option>
					        <option value="3">2CIF (704*288)</option>
					        <option value="4">DCIF (528*384)</option>
					        <option value="5">4CIF (704*576)</option>
					        <option value="6">D1 (720*576)</option>
					        <option value="7">WD1 (960*576)</option>
    					    
					        <option value="20">QVGA (320*240)</option>
					        <option value="21">VGA (640*480)</option>
					        <option value="22">SVGA (800*600)</option>
					        <option value="23">XVGA (1024*768)</option>
					        <option value="24">UXGA (1200*1600)</option>
    					    
					        <option value="41">720P (720*1280)</option>
					        <option value="42">960P (960*1280)</option>
					        <option value="43">1080P (1080*1920)</option>
    					    
					        <option value="44">250W (1280*1920)</option>
					        <option value="45">300W (2048*1536)</option>
					        <option value="46">500W (1920*2560)</option>
					        <option value="47">800W (3200*2400)</option>
					        <option value="48">1000W (2048*1536)</option>
                        </select>
                    </td>
                    <td>抓图质量：</td>
                    <td>
                        <select id="ddlPictureQuality" class="select w150" style="width:160px;">
                            <option value="0">最高</option>
					        <option value="1">较高</option>
					        <option value="2">中等</option>
					        <option value="3">低</option>
					        <option value="4">较低</option>
					        <option value="5">最低</option>
                        </select>                
                    </td>
                </tr>
            </table>
            <div class="sub-title" style="margin:5px 0;">抓图通道</div> 
            <div style="clear:both;">
                <div id="divCaptureChannelList"></div>
            </div>
            <div class="sub-title" style="margin:5px 0;">录像通道</div> 
            <div style="clear:both;">
                <div id="divRecordChannelList"></div>
            </div>
        </div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readOsdCustom(this);"><span>读取移动侦测</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setOsdCustom(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize('setFormContentSize');
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeH'), 0, 23, '00', 1, 2, '0');
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeM'), 0, 59, '00', 1, 2, '0');
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeS'), 0, 59, '05', 1, 2, '0');
    
    var objCanvas = cms.util.$('divCanvas');
	var offsetTop = divCanvas.offsetTop;
	var offsetLeft = divCanvas.offsetLeft;
	var arrDottedFrame = [];
	var arrFrame = [];
	var arrData = [];
	var frameCount = -1;
	var canvasSize = [352, 288];
	var boxSize = [16, 16];
	var rate = 0.5;
	//是否可以画图
	var isDraw = false;
	//是否是还原画图
	var isReDraw = false;
	var htFrame = new cms.util.Hashtable();
	//区域点阵数量
	var areaCount = 18*22;
	var arrArea = [];
	var rowLen = 18;
	var colLen = 22;
	//数组方式，默认为2维数组
	var arrType = 2;
	var objCanvasBox = cms.util.$('rcFormBox_area');

	var wId = "w";
	var index = 0;
	var startX = 0, startY = 0;
	var flag = false;
	var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";
	
	var formType = 'area';
	var arrTabs = [
        {code: 'area', name: '设置区域', load: false},
        {code: 'time', name: '布防时间', load: false},
        {code: 'linkage', name: '联动方式', load: false}
    ];
    
    var strHtml = '<div id="rcTabPanel" class="tabpanel" style="margin-left:-2px;">';
    for(var i=0; i<arrTabs.length; i++){
        var tab = arrTabs[i];
        strHtml += '<a class="' + (tab.code == formType ? 'cur':'tab') + '" lang="' + tab.code + '" rel="#rcFormBox_' + tab.code + '">'
            + '<span>' + tab.name + '</span>'
            + '</a>';
    }
    strHtml += '</div>';
    $('#tabbox').html(strHtml);
    
    cms.jquery.tabs('#rcTabPanel', null, '.rc-form-box', '');
    
    showDeploymentTime();
    $(".tbDeploymentTime tr:not(:nth-child(1)) td").css('height','28px');
    
    function setFormContentSize(formSize, conHeight){
        //divFormContent padding:10px;  本页 改为 padding:10px 10px 0 10px;
        var obj = cms.util.$('divFormContent');
        conHeight += obj.style.paddingBottom != '' ? 10 : 0;
        $('#divFormContent').height(conHeight);
        $('.rc-form-box').height(conHeight - 95);
    }
    
    function showDeploymentTime(){
        var objList = cms.util.$('tbDeploymentTime');
        cms.util.clearDataRow(objList, 1);
        var dc = 4;
        var rid = 1;
        
        for(var i = 0; i < dc; i++){
            var row = objList.insertRow(rid);
            
            rowData = buildDeploymentTime(row, rid);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
    }
    
    function buildDeploymentTime(row, rnum){
        var rowData = [];
        var cellid = 0;
        var strStart = '<select class="select w50" name="ddlDeploymentTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlDeploymentTime" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strEnd = '<select class="select w50" name="ddlDeploymentTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlDeploymentTime" style="margin:0 5px 0 10px">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //开始时间
        rowData[cellid++] = {html: strEnd, style:[['textAlign','center']]}; //结束时间
        
        return rowData;
    }
    
	function initialAreaData(){
	    if(2 == arrType){
	        //初始化点阵
	        for(var i=0; i<rowLen; i++){
	            var arr = [];
	            for(var j=0; j<colLen; j++){
	                arr.push(0);
	            }
	            arrArea.push(arr);
	        }
	    } else {
	        for(var i=0; i<areaCount; i++){
	            arrArea.push(0);	        
	        }
	    }
	}
	initialAreaData();
	
	remoteConfig.showAlarmType = function(isReset){
        if(isReset){
            var arr = cms.util.$N('chbAlarmType');
            for(var i=0; i<arr.length; i++){
                arr[i].checked = false;
            }
        } else {
            var arrAlarmType = [
                ['monitor_alarm','监视器上警告'],['sound_alarm','声音报警'],['notify_center','上传中心'],['sms_alarm','短信报警'],['alarm_out','触发报警输出'],['alarm_capture','报警抓图']
            ];
            var strAlarmType = '<ul>';
            for(var i=0; i<arrAlarmType.length; i++){
                if(i > 0 && i % 2 == 0){
                    strAlarmType += '<br />';
                }
                strAlarmType += '<li style="display:block; float:left; width:120px;"><label class="chb-label-nobg" style="float:left;">'
                    + '<input type="checkbox" name="chbAlarmType" class="chb" value="' + arrAlarmType[i][0] + '" /><span>' + arrAlarmType[i][1] + '</span>'
                    + '</label></li>';
            }
            strAlarmType += '</ul>';
            $('#divAlarmType').html(strAlarmType);
        }
    };
    
    remoteConfig.showAlarmType();
    remoteConfig.showChannelList('divChannelList', 'chbChannelId', '输出通道A');
    remoteConfig.showChannelList('divCaptureChannelList', 'chbCaptureChannelId', '抓图通道A');
    remoteConfig.showChannelList('divRecordChannelList', 'chbRecordChannelId', '录像通道A');
	
	objCanvas.onmousedown = function(e){
	    if(!isDraw){
	        return false;
	    }
		flag = true;
		try{
			var evt = window.event || e;
			//var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			//var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
			var scrollTop = objCanvasBox.scrollTop;
			var scrollLeft = objCanvasBox.scrollLeft;

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
			
			var div = document.createElement("div");
			div.className = "rc_frame";
			div.style.marginLeft = retcLeft;
			div.style.marginTop = retcTop;
			div.style.width = retcWidth;
			div.style.height = retcHeight;

			objCanvas.appendChild(div);

			drawRectangularBox(div, parseInt(retcLeft, 10), parseInt(retcTop, 10), parseInt(retcWidth, 10), parseInt(retcHeight, 10));
			
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
			    var scrollTop = objCanvasBox.scrollTop;
			    var scrollLeft = objCanvasBox.scrollLeft;

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
	    if((!isDraw && !isReDraw) || w == 0 || h == 0){
	        return false;
	    }
		if(arrFrame.length >= frameCount && frameCount > 0){
			clearFrame();
		}
		if(obj == null){
			clearFrame();

			obj = document.createElement("div");
			objCanvas.appendChild(obj);
		
			obj.style.width = w + 'px';
			obj.style.height = h + 'px';
		}
		
		x = x - x % boxSize[0];
		y = y - y % boxSize[1];
		/*
		w = canvasSize[0] - w <= boxSize[0] ? canvasSize[0] : w;
		h = canvasSize[1] - h <= boxSize[1] ? canvasSize[1] : h;
		*/
		var c = {row: parseInt(h/boxSize[1], 10) + (h%boxSize[1] == 0 ? 0 : 1), col: parseInt(w/boxSize[0], 10) + (w%boxSize[0] == 0 ? 0 : 1)};
		
		if(obj != null){
		    w = c.col * boxSize[0];
		    h = c.row * boxSize[1];
			obj.style.width = w + 'px';
			obj.style.height = h + 'px';
		}
		
		obj.style.marginLeft = x + 'px';
		obj.style.marginTop = y + 'px';
		
		for(var i=0; i<c.row; i++){
			for(var j=0; j<c.col; j++){
				drawBox(obj);
			}
		}
		
		var x1 = x + w;
		var y1 = y + h;
		
		arrFrame.push(obj);
		arrData.push([x, y, x1, y1, w, h]);
		
		getData();
		
		setAreaData(x, y, c.row, c.col);
		getAreaData();
		
	}
	
	function drawBox(obj){
		var div = document.createElement("div");
		div.className = 'rc_box';

		obj.appendChild(div);
	}
	
	function clearFrame(){
		for(var i=0; i<arrFrame.length; i++){
			objCanvas.removeChild(arrFrame[i]);
		}
		arrFrame.length = 0;
		
		arrData.length = 0;
		getData(true);
		
		
		arrArea.length = 0;				
		getAreaData(true);
		
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
	        cms.box.alert({title:'提示信息', html:'请先启用移动侦测！'});
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
	
	function setAreaData(x, y, row, col){
	    var i = parseInt(y / boxSize[1], 10);
	    var j = parseInt(x / boxSize[0], 10);//* colLen;
	    for(var m = 0; m<row; m++){
	        for(var n = 0; n<col; n++){
	            fillArea(i + m, j + n, 1);
	        }
	    }
	}
	
	function fillArea(i, j, val){
	    if(2 == arrType){
	        arrArea[i][j] = val;
	    } else {
	        arrArea[i* colLen + j] = val;
	    }
	}
	
	function getAreaData(isClear){
	    var strHtml = '';
	    var strData = '';
	    var c = arrArea.length;
	    if(isClear || c == 0){
	        $('#divArea').html('');
	        $('#divArea').hide();
	        $('#txtArea').attr('value', '');
	        
	        initialAreaData();
	    } else {
	        if(2 == arrType){
	            for(var i=0,c=arrArea.length; i<c; i++){
                    if(i > 0){
                        strData += '|';
	                    strHtml += '<br />';
                    }
	                for(var j=0,cc=arrArea[i].length; j<cc; j++){
	                    if(j > 0){
	                        strData += ',';
	                    }
	                    strData += arrArea[i][j];
        	            
	                    strHtml += arrArea[i][j];
	                }
	                strData += '_' + calculateSequence(arrArea[i]);
	                strHtml += '_' + calculateSequence(arrArea[i]);
	            }        
	        } else {
	            for(var i=0,c=arrArea.length; i<c; i++){
	                if(i > 0 && i % colLen == 0){
	                    //strData += '|';
	                    strData += ',';
	                    strHtml += '<br />';
	                } else {
	                    if(i > 0){
	                        strData += ',';
	                    }
	                }
	                strData += arrArea[i];
        	            
	                strHtml += arrArea[i];
	            }
	        }
            $('#divArea').html(strHtml);
            $('#divArea').show();
            $('#txtArea').attr('value', strData);
	    }    
	}
	
	//计算1，3，5，7数列
	function calculateSequence(arr){
	    var num = 0;
	    var n = 0;
		for(var i=0,c=arr.length; i<c; i++){
		    num += Math.pow(2, n);
			num -= (0 == arr[i] ? Math.pow(2, i) : 0);
			n++;
		}
		return num;
	}
	
	function calculateAreaPos(num){
	    var arr = [];
	    var c = 22;
	    for(var i=0; i<c; i++){
	        arr[i] = 0;
	    }
	    
	}
	
	function isPow(num){
		var tmp = 0;
		while(num >= 2){
			if(num % 2 != 0){
				break;
			}
			tmp = parseInt(num / 2, 10);
			
			num -= tmp;
		}
		return num == 1 || num % 2 == 0;
	}
	
	remoteConfig.getDeploymentTimePlan = function(type){
        var captureTimeSpan = '';
        var n = 0;
        var arrRange = [];
        var arrTime = cms.util.$N('ddlDeploymentTime');
        for(var i=0,c=arrTime.length/4; i<c; i++){
            n = i*4;
            if(i > 0){
                captureTimeSpan += '|';
            }
            captureTimeSpan += arrTime[n].value.trim() + ':' + arrTime[n+1].value.trim();
            captureTimeSpan += ',' + arrTime[n+2].value.trim() + ':' + arrTime[n+3].value.trim();
            
            var start = parseInt(arrTime[n].value.trim(),10)*60 + parseInt(arrTime[n+1].value.trim(), 10);
            var end = parseInt(arrTime[n+2].value.trim(),10)*60 + parseInt(arrTime[n+3].value.trim(), 10);
            if(0 == start && 0 == end){
                continue;
            }
            else if(start >= end && start > 0){
                cms.box.msgAndFocus(arrTime[n], {title:'提示',html:'开始时间必须小于结束时间'});
                return false;
            } else {
                //检测各组时间是否有交叉
                for(var j=0,t=arrRange.length; j<t; j++){
                    if((start >= arrRange[j][1] && start <= arrRange[j][2]) || (end >= arrRange[j][1] && end <= arrRange[j][2])){
                        cms.box.msgAndFocus(arrTime[n], {title:'提示',html:'第' + (i+1) + '组时间与第' + arrRange[j][0] + '组时间交叉重复'});
                        return false;
                    }
                }
            }
            arrRange.push([(i+1), start, end]);
        }
        return captureTimeSpan;
    };
    
    remoteConfig.getCaptureInterval = function(){
        var h = parseInt($('#ddlCaptureIntervalTimeH').val(), 10);
        var m = parseInt($('#ddlCaptureIntervalTimeM').val(), 10);
        var s = parseInt($('#ddlCaptureIntervalTimeS').val(), 10);
        
        return h*3600 + m*60 + s;
    };
</script>