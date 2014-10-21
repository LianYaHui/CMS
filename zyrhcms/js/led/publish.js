var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 220;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 5;
var boxSize = {};

var treeType = 'device';
var treeTitle = '设备列表';

var screenRows = 6;
var screenCols = 12;
var curRows = 6;
var curCols = 12;

//允许输入的最大字节数
var maxCharCount = 920;

var cellSize = [20, 24, 32];
var fontSize = [16, 24, 32];
var fontStyle = 0;

var curColor = '#f00';

var arrResult = [];
var wordCount = 0;
var newCount = 0;

/*分屏参数*/
var dataCount = 0;
var pageIndex = 0;
var pageSize = 0;
var pageCount = 0;
var curPager = null;
var timer = null;
var allowAutoSwitchScreen = true;
var switchFrequency = 10*1000;
//每秒5个字的阅读速度
var ws = 5;

var led = null;
var objScreen = null;
var objPager = null;

var arrSignalList = [];

$(window).load(function(){
    setBodySize();
    initialForm();

    window.setTimeout(showTreeData, 100);
});

$(window).resize(function(){
    setBodySize();
});

function showTreeData(){
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    var checkbox = {callback:'setDeviceChecked'};
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, false, false, true, true, '', checkbox, '50116,501161');
//    //定时刷新树型菜单设备状态
//    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
    
    tree.openAll();
    
    setTreeTools();
    showSelectStat();
    
    setBodySize();
}

function setBodySize(){
    //var bodySize = cms.util.getBodySize();
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    //rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyTitle').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    $('#bodyContent').width(boxSize.width);
    $('#bodyContent').height(boxSize.height - 24 - 36);
    
    setBoxSize();
}

function setBoxSize(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52 - 25);
    
    $('#mainContent').css('min-width', 1050);
}

function initialForm(){
    $('#bodyLeftSwitch').click(function(){
        cms.frame.setLeftDisplay($('#bodyLeft'), $('#bodyLeftSwitch'));
    });
        
    for(var i=1; i<=12; i++){
		cms.util.fillOption(cms.util.$('ddlRows'), i, i);
	}
	for(var i=1; i<=24; i++){
		cms.util.fillOption(cms.util.$('ddlCols'), i, i);
	}
    var arr = [['#f00','红色'],['#00f','蓝色'],['#008000','绿色'],['#000','黑色'],['#fff','白色']]; 
    cms.util.fillOptions(cms.util.$('ddlColors'), arr, curColor);
    
    var arr = [];
    for(var i=0; i<fontSize.length; i++){
        arr.push([i, fontSize[i] + '×' + fontSize[i]]);
    }
    cms.util.fillOptions(cms.util.$('ddlFontSize'), arr, fontStyle);
    
    cms.util.fillNumberOptions(cms.util.$('ddlIndent'), 0, 8, 4, 2);
    
    //cms.util.fillNumberOptions(cms.util.$('ddlMemory'), 0, 15, 0, 1);  
    
    cms.util.fillNumberOptions(cms.util.$('ddlSpaceCount'), 0, 4, 1, 1);  
      
    $('#lblRowCol').html('常用屏型：'
        + '<a onclick="setRowCols(3,12);">3×12</a> '
        + '<a onclick="setRowCols(5,10);">5×10</a> '
        + '<a onclick="setRowCols(5,12);">5×12</a> '
        + '<a onclick="setRowCols(6,12);">6×12</a> '
        + '<a onclick="setRowCols(8,16);">8×16</a> '
    );
    
    $("#txtTiming").focus(function(){
        WdatePicker({skin:'ext',minDate:'2014-01-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtValidityTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2014-01-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
	$('#ddlRows').attr('value', screenRows);
	$('#ddlCols').attr('value', screenCols);
	
	$('#ddlRows').change(function(){
	    setFontSize(parseInt($('#ddlFontSize').val(), 10));
	});
	$('#ddlCols').change(function(){
	    setFontSize(parseInt($('#ddlFontSize').val(), 10));
	});
	$('#ddlFontSize').change(function(){
	    setFontSize(parseInt($(this).val(), 10));
	});
	$('#ddlColors').change(function(){
	    setLedColor($(this).val());
	});	

	$('#txtContent').keyup(function(){
	    showLedDemo();
	});
	$('#txtContent1').keyup(function(){
	    showLedDemo();
	});
	$('#ddlIndent').change(function(){
	    showLedDemo();
	});
	$('#chbClearSpace').click(function(){
	    if($(this).attr('checked')){
	        $('#divSpaceCount').show();
	    } else {
	        $('#divSpaceCount').hide();
	    }
	    showLedDemo();
	});
	$('#ddlSpaceCount').change(function(){
	    showLedDemo();
	});
	
	objScreen = $('#divScreen');
	objPager = $('#divPagination');
	
	if(isPublishAlarm){
	    $('#ddlSignal').change(function(){
	        showTypeSignalConfig(parseInt($(this).val().trim(), 10));
	    });	    
	}
	
    getInfoType();
        
    getRowCols();
    showLedDemo();
}

function getInfoType(){
    var urlparam = 'action=getInfoType';
    if(isPublishAlarm){
        urlparam += '&parentId=' + parentId;
    }
    module.ajaxRequest({
        url: cms.util.path + '/ajax/led.aspx',
        data: urlparam,
        callBack: getInfoTypeCallBack
    });
}

function getInfoTypeCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();// eval('(' + data + ')');
    if(jsondata.result != 1){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    var list = jsondata.list;
    
    var objDiv = cms.util.$('divInfoType');
    var obj = cms.util.$('txtInfoType');
    var ddl1 = new DropDownList(obj, 'infoType', 
        {parentId:0, data:list, val: list[0].id, text:list[0].name, maxHeight:200,width:150,event:'focus', recursion:true, func:changeInfoType},
        objDiv);
    obj.value = list[0].id;
        
    changeInfoType()
}

function changeInfoType(){
    var typeId = $('#txtInfoType').val();
    getTypeDefaultMemory(typeId);
    
    if(isPublishAlarm){
        getTypeSignal(typeId);
        
        showSignalIcon();
    }
}

function getTypeDefaultMemory(typeId){
    var urlparam = 'action=getTypeDefaultMemory&typeId=' + typeId;
    module.ajaxRequest({
        url: cms.util.path + '/ajax/led.aspx',
        data: urlparam,
        callBack: getTypeDefaultMemoryCallBack
    });
}

function getTypeDefaultMemoryCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    var obj = cms.util.$('ddlMemory');
    cms.util.clearOption(obj, 0);
    
    var arr = jsondata.list;
    
    for(j=0; j<arr.length; j++){
        cms.util.fillOption(obj, arr[j], arr[j]);
    }
}

function getTypeSignal(typeId){
    var urlparam = 'action=getTypeSignal&typeId=' + typeId;
    module.ajaxRequest({
        url: cms.util.path + '/ajax/led.aspx',
        data: urlparam,
        callBack: getTypeSignalCallBack
    });
}

function getTypeSignalCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    
    arrSignalList = jsondata.list;
    
    showTypeSignalInfo();
}

function showTypeSignalInfo(){
    var obj = cms.util.$('ddlSignal');
    cms.util.clearOption(obj, 1);
    
    for(var i=0,c=arrSignalList.length; i<c; i++){
        cms.util.fillOption(obj, arrSignalList[i].id, arrSignalList[i].signalName);
    }
}

function getTypeSignalConfig(id){
    if(id > 0){
        for(var i=0,c=arrSignalList.length; i<c; i++){
            var dr = arrSignalList[i];
            if(id == dr.id){
                return dr;
            }
        }
    }
    return null;
}

function showTypeSignalConfig(id){
    if(id > 0){
        var dr = getTypeSignalConfig(id);
        if(dr != null){
            var strCon = '%s发布%s%s信号。'.format([new Date().toString("年月日"),dr.typeName,dr.signalName], '%s');
            $('#txtContent').attr('value', strCon);
            $('#txtContent1').attr('value', dr.defenseGuidelines);
            
            showSignalIcon(dr.icon);
        }
    } else {
        $('#txtContent').attr('value', '');
        $('#txtContent1').attr('value', '');
        showSignalIcon();     
    }
    showLedDemo();
}

function showSignalIcon(icon){
    if(icon != '' && icon != undefined){
        $('#imgSignal').attr('src', cms.util.path + icon);
        $('#imgSignal').show();
    } else {
        $('#imgSignal').hide();
    }
}

function setTimeType(type){
    var objTiming = cms.util.$('txtTiming');
    var isEnabled = 1 == type;
    objTiming.disabled = !isEnabled;    
    objTiming.className = isEnabled ? objTiming.className.replace(' disabled', '') : objTiming.className + ' disabled';
}

function setValidityTime(isEnabled){
    var objHours = cms.util.$('txtValidityHours');
    var objVal = cms.util.$('txtValidityTime');
    objHours.disabled = !isEnabled;
    objVal.disabled = !isEnabled;
    objHours.className = isEnabled ? objHours.className.replace(' disabled', '') : objHours.className + ' disabled';
    objVal.className = isEnabled ? objVal.className.replace(' disabled', '') : objVal.className + ' disabled';
}

function setTreeTools(){    
    var strHtml = '<div style="float:right;margin:1px 2px 0 0;">'
        + '<a class="btn btnc22" onclick="cms.util.selectCheckBox(\'chbTreeDevice\', 1);cms.util.selectCheckBox(\'chbTreeUnit\', 1);showSelectStat();"><span>全选</span></a>'
        + '<a class="btn btnc22" onclick="cms.util.selectCheckBox(\'chbTreeDevice\', 3);cms.util.selectCheckBox(\'chbTreeUnit\', 3);showSelectStat();"><span>反选</span></a>'
        + '<a class="btn btnc22" onclick="cms.util.selectCheckBox(\'chbTreeDevice\', 2);cms.util.selectCheckBox(\'chbTreeUnit\', 2);showSelectStat();"><span>取消</span></a>'
        + '</div>';
        
    $('#leftMenu .titlebar').append(strHtml);
    
    $('#leftMenu').append('<div id="divTreeStat" class="statusbar" style="text-indent:5px;height:24px;"></div>');
}

function showSelectStat(){
    var c = cms.util.getCheckBoxCheckedCount('chbTreeDevice');
    $('#divTreeStat').html('当前选中<b style="padding:0 2px;color:#f00;">%s</b>台设备'.format(c, '%s'));
}

function showContentStat(count){
    var strHtml = '当前输入%s个字节，最多允许输入%s个字节。'.format([count, maxCharCount], '%s');
    var isOverstep = count > maxCharCount;
    if(isOverstep){
        strHtml += '<span style="color:#f00;">当前已超出%s个字节。</span>'.format([count-maxCharCount], '%s');
    }
    $('#divContentStat').html(strHtml);
    
    return isOverstep;
}

function treeAction(param){
    switch(param.type){
        case 'device':            
            break;
    }
}

/*显示设备GPS定位*/
function setDeviceChecked(){
    showSelectStat();
}

function getCheckedDevice(){
    var arrDevice = [];
    var strDevCode = '';
    var arrChb = cms.util.getCheckBoxChecked('chbTreeDevice');
    for(var i=0,c=arrChb.length; i<c; i++){
        var dev = eval('(' + arrChb[i].value + ')');
        strDevCode += i > 0 ? ',' : '';
        strDevCode += dev.code;
    }
    return strDevCode;
}

function selectCheckBox(){
    cms.util.selectCheckBox('chbTreeDevice', 1);
}

function getRowCols(){		
    screenRows = parseInt($('#ddlRows').val(), 10);
    screenCols = parseInt($('#ddlCols').val(), 10);
    
    if(0 == fontStyle){
        curRows = screenRows;
        curCols = screenCols;    
    } else {
        curRows = parseInt(screenRows * fontSize[0] / fontSize[fontStyle], 10);
        curCols = parseInt(screenCols * fontSize[0] / fontSize[fontStyle], 10);    
    }
}

function setRowCols(rows, cols){
    $('#ddlRows').attr('value', rows);
    $('#ddlCols').attr('value', cols);
    
    pageIndex = 0;
    
    getRowCols();
    showLedDemo();
}

function setFontSize(fs){
    fontStyle = fs;
    pageIndex = 0;
	
    getRowCols();
	showLedDemo();
}

function setScreenSize(){
    var w = curCols * cellSize[fontStyle];
    var h = curRows * cellSize[fontStyle];
    objScreen.width(w);
    objScreen.height(h);
    
    objScreen.removeClass();
    objScreen.addClass('led led' + fontSize[fontStyle]);
    
    var objBox = $('#divScreenBox');
    objBox.width(w);
    objBox.height(h);
    objBox.corner('5px');
}

function setLedColor(color){
    curColor = color;
    objScreen.css('color', curColor);    
}

function getContent(){
    var strContent = $('#txtContent').val().trim();
    var isClearSpace = $('#chbClearSpace').attr("checked");
    var indent = parseInt($('#ddlIndent').val().trim(), 10);
    var spaceCount = $('#chbClearSpace').attr('checked') ? parseInt($('#ddlSpaceCount').val().trim(), 10) : 1;
    if(isPublishAlarm){
        var strContent1 = $('#txtContent1').val().trim();
        if(strContent.length > 0 && strContent1.length > 0){
            strContent += '\r\n' + strContent1;
        }
    }
	if(isClearSpace){
		strContent = strContent.removeSpace(spaceCount);
	}
	if(strContent.length > 0){
	    strContent = strContent.cleanParagraph(indent, ' ');
	}
	
	return strContent;
}

function showLedDemo(){
    getRowCols();
	setScreenSize();
	
    var strContent = getContent();
	
    var newCount = strContent.len();
    
    showContentStat(newCount);
    
    if(0 == newCount){
        clearLedResult();
        return false;
    }
    if(newCount < wordCount){
	    pageIndex = 0;
    }
    wordCount = newCount;
    /*
    if(min > 0 && max > 0){
		strContent = strContent.convertMultiSpaceToNewline(min, max);
	}
	*/
	var indent = parseInt($('#ddlIndent').val(), 10);
	//实例化一个LEDScreen对象
	led = new LEDScreen(strContent, curRows, curCols, indent);
	
	arrResult = led.arrResult;
	
    showLedResult(arrResult);	
}

function showLedResult(arrResult){    
	pageSize = curRows * curCols * 2;	
	dataCount = led.getDataCount(arrResult);
	pageCount = led.getPageCount(dataCount, pageSize);
	
	var count = arrResult.length;
	var len = 0;
	var num = 0;
	
	var start = pageIndex * pageSize;
	var end = start + pageSize;
	var arrStartEnd = led.getStartEnd(arrResult, start, end);
	start = arrStartEnd[0];
	end = arrStartEnd[1];
	
	var strHtml = '<ul>';
	for(var i=start; i<end; i++){
		if(i >= count){
			break;
		}
		len += led.isChinese(arrResult[i]) ? 2 : 1;

		strHtml += '<li class="' + (led.isChinese(arrResult[i]) ? 'dw' : 'w') + '">' + arrResult[i].replace(' ','&nbsp;') + '</li>';
		if(len % (curCols*2) == 0 && len > 0){
			strHtml += '</ul><ul>';
			len = 0;
		}
	}
	strHtml += '</ul>';

	objScreen.html(strHtml);

	setAutoSwitchScreen();
	
    //分页	
	objPager.html(buildPagination(pageCount));

	return [strHtml];
}

function clearLedResult(){
    objScreen.html('');
    objPager.html('');
}

function pagination(page){
	pageIndex = page;
	
	if(curPager != null){
		curPager.className = '';
	}
	$('p_' + page).className = 'cur';
	curPager = $('p_' + page);	
	
	showLedResult(arrResult);
}

function buildPagination(pageCount){
	var strHtml = '';
	for(var i=0; i<pageCount; i++){
		strHtml += '<a id="p_' + i + '" onclick="pagination(' + i + ');" class="' + (i == pageIndex ? 'cur':'') + '">第' + (i + 1) + '屏</a>';
	}
	
	strHtml += '<br />';
	var strDisplay = '';
	if(allowAutoSwitchScreen){
        strHtml += '<span id="lblSwitchScreen">每隔<b style="color:#f00;margin:0 2px;">' + (switchFrequency/1000) + '</b>秒自动切换分屏</span>';
        strHtml += '&nbsp;/&nbsp;';
        strHtml += '按每秒钟阅读<select onchange="setReadSpeed(this.value);" class="select20" style="margin:0 2px;width:45px;">';
        for(var i=1; i<=10; i++){
            strHtml += '<option value="' + i + '"' + (i == ws ? ' selected="selected"' : '') + '>' + i + '</option>';
        }
        strHtml += '</select>个汉字';
	    strHtml += '<a class="ibtn" onclick="setSwitchScreen(this);" title="点击停止切换"><i class="icon-play"></i></a>';
	} else {	    
	    strHtml += '<a class="ibtn" onclick="setSwitchScreen(this);" title="点击切换分屏"><i class="icon-stop"></i></a>';
	}
	
	return strHtml;
}

//自动分屏切换显示
function autoSwitchScreen(){
    if(pageCount <= 1){
        return false;
    }
    var newPage = pageIndex + 1;
    if(newPage < pageCount){
        pagination(newPage);
    } else {
        pagination(0);
    }
}

function setAutoSwitchScreen(){
    if(timer != null){
        clearTimeout(timer);
    }
    if(allowAutoSwitchScreen){
        timer = window.setTimeout(autoSwitchScreen, getSwitchFrequency());
    }
}

function setSwitchScreen(objBtn){
    allowAutoSwitchScreen = !allowAutoSwitchScreen;
    var obj = objBtn.childNodes[0];
    
    if(allowAutoSwitchScreen){
        obj.className = 'icon-play';
        objBtn.title = '点击停止切换';
        $('#lblSwitchScreen').show();
        
	    setAutoSwitchScreen();
    } else {
        obj.className = 'icon-stop';
        objBtn.title = '点击切换分屏';
        $('#lblSwitchScreen').hide();
        
	    if(timer != null){
	        clearTimeout(timer);
	    }
    }
}

//分屏自动切换频率，单位：秒
//以每秒钟5个汉字的阅读频率计算
function getSwitchFrequency(){
    switchFrequency = Math.round(curRows * curCols / ws) * 1000;
    return switchFrequency;
}

function setReadSpeed(s){
    ws = typeof s == 'number' ? s : parseInt(s, 10);
    getSwitchFrequency();
    
    $('#lblSwitchScreen').html('每隔<b style="color:#f00;margin:0 2px;">' + (switchFrequency/1000) + '</b>秒自动切换分屏');
    setAutoSwitchScreen();
}

function sendLedContent(){
    var strDevCodeList = getCheckedDevice();
    var strContent = getContent();
    if(strContent.length == 0){    
        cms.box.msgAndFocus(cms.util.$('txtContent'), {title:'提示信息', html:'请输入内容'});
        return false;
    }
	
    var newCount = strContent.len();
    
    var isOverstep = showContentStat(newCount);
    
    if(isOverstep){
        cms.box.alert({title:'提示信息', html:'输入的内容长度超出最大字节限制'});
        return false;
    }
    if(strDevCodeList.length == 0){
        cms.box.alert({title:'提示信息', html:'请在左边栏选择要发布信息的设备'});
        return false;    
    }
    var typeId = $('#txtInfoType').val().trim();
    var typeSignalId = 0;
    var signalId = 0;
    if(isPublishAlarm){
        typeSignalId = parseInt($('#ddlSignal').val().trim(), 10);
        var dr = getTypeSignalConfig(typeSignalId);
        if(dr != null){
            signalId = dr.signalId;
        } else {
            cms.box.msgAndFocus(cms.util.$('ddlSignal'), {title:'提示信息', html:'请选择预警信号'});
            return false;
        }
    }
    var indent = $('#ddlIndent').val().trim();
    var memoryNumber = $('#ddlMemory').val().trim();
    var isTiming = parseInt(cms.util.getRadioCheckedValue('rbTimeType'), 10);
    var timeLimit = $('#chbEnabledValidity').attr('checked') ? 1 : 0;
    var startTime = 1 == isTiming ? $('#txtTiming').val().trim() : '';
    var endTime = 1 == isTiming ? $('#txtValidityTime').val().trim() : '';
    var validityHour = $('#txtValidityHours').val().trim();
    if(validityHour == ''){
        validityHour = '0';
    }
    
    var urlparam = 'action=addLedInfo'
        + '&typeId=' + typeId
        + '&signalId=' + signalId
        + '&devCodeList=' + strDevCodeList 
        + '&indent=' + indent 
        + '&memoryNumber=' + memoryNumber
        + '&isTiming=' + isTiming
        + '&validityHour=' + validityHour
        + '&startTime=' + startTime
        + '&endTime=' + endTime
        + '&timeLimit=' + timeLimit
        + '&infoContent=' + escape(strContent);
    module.ajaxRequest({
        url: cms.util.path + '/ajax/led.aspx',
        data: urlparam,
        callBack: sendLedContentCallBack
    });
}

function sendLedContentCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    } else {
        cms.box.alert({title:'提示信息', html:'信息发布完成。' + jsondata.msg});
    }
}