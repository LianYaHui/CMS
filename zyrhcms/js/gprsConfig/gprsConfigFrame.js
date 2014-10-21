var gprsConfig = gprsConfig || {};
gprsConfig.frame = gprsConfig.frame || {};

gprsConfig.frame.boxSize = {};
gprsConfig.frame.paddingTop = 1;
gprsConfig.frame.paddingWidth = 5;
gprsConfig.frame.borderWidth = 2;
gprsConfig.frame.switchWidth = 5;
gprsConfig.frame.bodyLeftWidthConfig = [180, 0];
gprsConfig.frame.bodyLeftWidth = 180;
gprsConfig.frame.titleHeight = 25;
gprsConfig.frame.promptHeight = 26;
gprsConfig.frame.showBodyLeft = true;

gprsConfig.frame.taskBoxHeightConfig = [26, 168, 282];
gprsConfig.frame.taskBoxHeight = 168;
gprsConfig.frame.taskBoxWinModeConfig = [0, 1, 2];
gprsConfig.frame.taskBoxWinMode = 1;

gprsConfig.frame.getRootPath = function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = strFullPath.substring(0, strFullPath.indexOf(strPath));
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return prePath + (prePath.indexOf('http://localhost') >= 0 ? postPath: '');
}
//获得平台URL Host
gprsConfig.frame.path = gprsConfig.frame.getRootPath();

gprsConfig.frame.getBodySize = function(){
	return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

gprsConfig.frame.getParentBodySize = function() {
    return {
        width: parent.document.documentElement.clientWidth,
        height: parent.document.documentElement.clientHeight
    };
};

gprsConfig.frame.initialForm = function(){
	$('#bodyLeftSwitch').click(function(){
		gprsConfig.frame.switchLeftDisplay($(this));
	});
};

gprsConfig.frame.setBodySize = function(){
	var bodySize = gprsConfig.frame.getBodySize();
	var boxSize = gprsConfig.frame.getBoxSize();
    
    $('#bodyContent').css('padding', gprsConfig.frame.paddingTop);
    $('#bodyContent').css('padding-bottom', 0);

	$('#bodyLeft').width(gprsConfig.frame.bodyLeftWidth - gprsConfig.frame.borderWidth);
	$('#bodyLeft').height(boxSize.height);

	$('#treebox').height(boxSize.height - gprsConfig.frame.titleHeight - 26);

	$('#bodyLeftSwitch').height(boxSize.height + gprsConfig.frame.borderWidth);

	$('#bodyRight').width(boxSize.width - gprsConfig.frame.borderWidth);
	$('#bodyRight').height(boxSize.height);

    $('#bodyPrompt').height(gprsConfig.frame.promptHeight - 1);
	$('#bodyForm').width(boxSize.width - gprsConfig.frame.borderWidth);
    
    gprsConfig.frame.setBoxSize();
};

/*设置表单及任务状态栏尺寸*/

gprsConfig.frame.getBoxSize = function(){
	var bodySize = gprsConfig.frame.getBodySize();
	return {
		width: bodySize.width - gprsConfig.frame.bodyLeftWidth - gprsConfig.frame.paddingWidth - gprsConfig.frame.paddingTop*2,
		height: bodySize.height - gprsConfig.frame.borderWidth - gprsConfig.frame.paddingTop*2
	};
};

gprsConfig.frame.getFormSize = function(){
	var bodySize = gprsConfig.frame.getBodySize();
	return {
		width: bodySize.width - gprsConfig.frame.bodyLeftWidth - gprsConfig.frame.paddingWidth - gprsConfig.frame.paddingTop*2,
		height: bodySize.height - gprsConfig.frame.titleHeight - gprsConfig.frame.promptHeight - gprsConfig.frame.taskBoxHeight - gprsConfig.frame.borderWidth - gprsConfig.frame.paddingTop*2
	};
};

gprsConfig.frame.setBoxSize = function(isShow){
    gprsConfig.frame.taskBoxHeight = gprsConfig.frame.taskBoxHeightConfig[gprsConfig.frame.taskBoxWinMode];
    
	var formSize = gprsConfig.frame.getFormSize();
	
	$('#bodyForm').height(formSize.height);
	$('#taskbar').height(gprsConfig.frame.taskBoxHeight - 1);
	
	gprsConfig.task.setBoxSize(gprsConfig.frame.taskBoxHeight - 1);
	
	if(gprsConfig.setFormBodySize != undefined && gprsConfig.setFormBodySize != null && typeof gprsConfig.setFormBodySize == 'function'){
	    gprsConfig.setFormBodySize();
	}
};

//设置任务状态框尺寸 三种模式 0-min,1-normal,2-max
gprsConfig.frame.setTaskBoxSize = function(winMode, btn){
    if(btn != undefined && btn != null){
        switch(gprsConfig.frame.taskBoxWinMode){
            case 0:
                gprsConfig.frame.taskBoxWinMode = gprsConfig.frame.taskBoxWinModeConfig[winMode == 0 ? 1 : 2];
                break;
            case 1:
                gprsConfig.frame.taskBoxWinMode = gprsConfig.frame.taskBoxWinModeConfig[winMode == 0 ? 0 : 2]; 
                break;
            case 2:
                gprsConfig.frame.taskBoxWinMode = gprsConfig.frame.taskBoxWinModeConfig[winMode == 0 ? 0 : 1];
                break;
        }
    } else {
        gprsConfig.frame.taskBoxWinMode = winMode;
    }        
    cms.util.$('btnTaskWinMin').className = 0 == gprsConfig.frame.taskBoxWinMode ? 'win-normal' : 'win-min';
    cms.util.$('btnTaskWinMax').className = 2 == gprsConfig.frame.taskBoxWinMode ? 'win-normal' : 'win-max';
    
    gprsConfig.frame.setBoxSize();
};

gprsConfig.frame.setFrameByShortcutKey = function(){
    document.onkeyup = function(e){
        var e = e||event;
        //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
        if(e.shiftKey){
            switch('' + e.keyCode){
                case '76':
                    if($('#bodyLeft').attr('id') != undefined){
                        gprsConfig.frame.switchLeftDisplay($('#bodyLeftSwitch'));
                    }
                    break;
                default:
                    gprsConfig.shortcutKeyAction(e.keyCode);
                    break;
            }
        }
    }
}

gprsConfig.frame.switchLeftDisplay = function(obj, isShow){
	if(isShow != undefined){
		gprsConfig.frame.showBodyLeft = !isShow;
	}
	if(gprsConfig.frame.showBodyLeft){
		gprsConfig.frame.showBodyLeft = false;
		$('#bodyLeft').hide();
		gprsConfig.frame.bodyLeftWidth = gprsConfig.frame.bodyLeftWidthConfig[1];
	}
	else {
		gprsConfig.frame.showBodyLeft = true;
		$('#bodyLeft').show();
		gprsConfig.frame.bodyLeftWidth = gprsConfig.frame.bodyLeftWidthConfig[0];
	}
	if(obj == null || obj == undefined){
		obj = $('#bodyLeftSwitch');
	}
	obj.removeClass();
	obj.addClass(gprsConfig.frame.showBodyLeft ? 'switch-left' : 'switch-right');
	obj.attr('title', gprsConfig.frame.showBodyLeft ? '隐藏左栏菜单' : '显示左栏菜单');
	
	//obj.css('background-color', gprsConfig.frame.showBodyLeft ? '#dfe8f6' : '#99bbe8');

	gprsConfig.frame.setBodySize();
};


gprsConfig.frame.setFormTitle = function(title){
	$('#bodyTitle .title').html(title);
};

gprsConfig.frame.setFormPrompt = function(strHtml){
	$('#bodyPrompt .title').html(strHtml);
};

gprsConfig.frame.setFormButton = function(strHtml){
	$('#formButtonPanel').html(strHtml);
};