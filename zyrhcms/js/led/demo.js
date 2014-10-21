var screenRows = 5;
var screenCols = 10;
var curRows = 5;
var curCols = 10;

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
});

$(window).resize(function(){
    setBodySize();
});

function setBodySize(){
    var frameSize = cms.frame.getFrameSize();
    $('#bodyContent').width(frameSize.width);
    $('#bodyContent').height(frameSize.height - 10);
    
    setBoxSize();
}

function setBoxSize(){
    
}

function initialForm(){
    if(config.simple == 1){
        $('#tbForm').hide();
    } else if(config.simple == 2){
        $('#tbForm').hide();
        $('#divSet').hide();
    }
    
    screenRows = config.rows;
    screenCols = config.cols;
    
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
    
    cms.util.fillNumberOptions(cms.util.$('ddlIndent'), 0, 8, config.indent, 2);
       
    cms.util.fillNumberOptions(cms.util.$('ddlSpaceCount'), 0, 4, 1, 1);  
      
    $('#lblRowCol').html('常用屏型：'
        + '<a onclick="setRowCols(3,12);">3×12</a> '
        + '<a onclick="setRowCols(5,10);">5×10</a> '
        + '<a onclick="setRowCols(5,12);">5×12</a> '
        + '<a onclick="setRowCols(6,12);">6×12</a> '
        + '<a onclick="setRowCols(8,16);">8×16</a> '
    );
        
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
	
    getRowCols();
    showLedDemo();
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