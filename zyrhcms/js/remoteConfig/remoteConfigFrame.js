var remoteConfig = remoteConfig || {};
remoteConfig.frame = remoteConfig.frame || {};

remoteConfig.frame.boxSize = {};
remoteConfig.frame.paddingTop = 1;
remoteConfig.frame.paddingWidth = 5;
remoteConfig.frame.borderWidth = 2;
remoteConfig.frame.switchWidth = 5;
remoteConfig.frame.bodyLeftWidthConfig = [180, 0];
remoteConfig.frame.bodyLeftWidth = 180;
remoteConfig.frame.titleHeight = 25;
remoteConfig.frame.promptHeight = 26;
remoteConfig.frame.bodyBottomHeight = 30;
remoteConfig.frame.showBodyLeft = true;

remoteConfig.frame.taskBoxHeightConfig = [26, 168, 282];
remoteConfig.frame.taskBoxHeight = 168;
remoteConfig.frame.taskBoxWinModeConfig = [0, 1, 2];
remoteConfig.frame.taskBoxWinMode = 1;

remoteConfig.frame.getRootPath = function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = strFullPath.substring(0, strFullPath.indexOf(strPath));
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return prePath + (prePath.indexOf('http://localhost') >= 0 ? postPath: '');
}
//获得平台URL Host
remoteConfig.frame.path = remoteConfig.frame.getRootPath();

remoteConfig.frame.getBodySize = function(){
	return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

remoteConfig.frame.getParentBodySize = function() {
    return {
        width: parent.document.documentElement.clientWidth,
        height: parent.document.documentElement.clientHeight
    };
};

remoteConfig.frame.initialForm = function(){
	$('#bodyLeftSwitch').click(function(){
		remoteConfig.frame.switchLeftDisplay($(this));
	});
};

remoteConfig.frame.setBodySize = function(){
	var bodySize = remoteConfig.frame.getBodySize();	
	var boxSize = remoteConfig.frame.getBoxSize();
	remoteConfig.frame.boxSize = boxSize;

    $('#bodyContent').css('padding', remoteConfig.frame.paddingTop);
    $('#bodyContent').css('padding-bottom', 0);

	$('#bodyLeft').width(remoteConfig.frame.bodyLeftWidth - remoteConfig.frame.borderWidth);
	$('#bodyLeft').height(boxSize.height);

	$('#treebox').height(boxSize.height - remoteConfig.frame.titleHeight - 26);

	$('#bodyLeftSwitch').height(boxSize.height + remoteConfig.frame.borderWidth);

	$('#bodyRight').width(boxSize.width - remoteConfig.frame.borderWidth);
	$('#bodyRight').height(boxSize.height);

    $('#bodyPrompt').height(remoteConfig.frame.promptHeight - 1);
	$('#bodyForm').width(boxSize.width - remoteConfig.frame.borderWidth);
	
	remoteConfig.frame.setBoxSize();
};

remoteConfig.frame.getBoxSize = function(){
	var bodySize = remoteConfig.frame.getBodySize();
	return {
		width: bodySize.width - remoteConfig.frame.bodyLeftWidth - remoteConfig.frame.paddingWidth - remoteConfig.frame.paddingTop*2,
		height: bodySize.height - remoteConfig.frame.borderWidth - remoteConfig.frame.paddingTop*2
	};
};

remoteConfig.frame.getFormSize = function(){
	var bodySize = remoteConfig.frame.getBodySize();
	return {
		width: bodySize.width - remoteConfig.frame.bodyLeftWidth - remoteConfig.frame.paddingWidth - remoteConfig.frame.paddingTop*2,
		height: bodySize.height - remoteConfig.frame.titleHeight - remoteConfig.frame.promptHeight - remoteConfig.frame.taskBoxHeight - remoteConfig.frame.borderWidth - remoteConfig.frame.paddingTop*2
	};
};

remoteConfig.frame.setBoxSize = function(isShow){
    remoteConfig.frame.taskBoxHeight = remoteConfig.frame.taskBoxHeightConfig[remoteConfig.frame.taskBoxWinMode];
 
	var formSize = remoteConfig.frame.getFormSize();

	$('#bodyForm').height(formSize.height);
	$('#taskbar').height(remoteConfig.frame.taskBoxHeight - 1);
	
	remoteConfig.task.setBoxSize(remoteConfig.frame.taskBoxHeight - 1);
	
	if(remoteConfig.setFormBodySize != undefined && remoteConfig.setFormBodySize != null && typeof remoteConfig.setFormBodySize == 'function'){
	    remoteConfig.setFormBodySize();
	}
};

//设置任务状态框尺寸 三种模式 0-min,1-normal,2-max
remoteConfig.frame.setTaskBoxSize = function(winMode, btn){
    if(btn != undefined && btn != null){
        switch(remoteConfig.frame.taskBoxWinMode){
            case 0:
                remoteConfig.frame.taskBoxWinMode = remoteConfig.frame.taskBoxWinModeConfig[winMode == 0 ? 1 : 2];
                break;
            case 1:
                remoteConfig.frame.taskBoxWinMode = remoteConfig.frame.taskBoxWinModeConfig[winMode == 0 ? 0 : 2]; 
                break;
            case 2:
                remoteConfig.frame.taskBoxWinMode = remoteConfig.frame.taskBoxWinModeConfig[winMode == 0 ? 0 : 1];
                break;
        }
    } else {
        remoteConfig.frame.taskBoxWinMode = winMode;
    }        
    cms.util.$('btnTaskWinMin').className = 0 == remoteConfig.frame.taskBoxWinMode ? 'win-normal' : 'win-min';
    cms.util.$('btnTaskWinMax').className = 2 == remoteConfig.frame.taskBoxWinMode ? 'win-normal' : 'win-max';
    
    remoteConfig.frame.setBoxSize();
};

remoteConfig.frame.setFrameByShortcutKey = function(){
    document.onkeyup = function(e){
        var e = e||event;
        //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
        if(e.shiftKey){
            switch(e.keyCode){
                case 76:
                    if($('#bodyLeft').attr('id') != undefined){
                        remoteConfig.frame.switchLeftDisplay($('#bodyLeftSwitch'));
                    }
                    break;
                default:
                    remoteConfig.shortcutKeyAction(e.keyCode);
                    break;
            }
        }
    }
}

remoteConfig.frame.switchLeftDisplay = function(obj, isShow){
	if(isShow != undefined){
		remoteConfig.frame.showBodyLeft = !isShow;
	}
	if(remoteConfig.frame.showBodyLeft){
		remoteConfig.frame.showBodyLeft = false;
		$('#bodyLeft').hide();
		remoteConfig.frame.bodyLeftWidth = remoteConfig.frame.bodyLeftWidthConfig[1];
	}
	else {
		remoteConfig.frame.showBodyLeft = true;
		$('#bodyLeft').show();
		remoteConfig.frame.bodyLeftWidth = remoteConfig.frame.bodyLeftWidthConfig[0];
	}
	if(obj == null || obj == undefined){
		obj = $('#bodyLeftSwitch');
	}
	obj.removeClass();
	obj.addClass(remoteConfig.frame.showBodyLeft ? 'switch-left' : 'switch-right');
	obj.attr('title', remoteConfig.frame.showBodyLeft ? '隐藏左栏菜单' : '显示左栏菜单');
	
	//obj.css('background-color', remoteConfig.frame.showBodyLeft ? '#dfe8f6' : '#99bbe8');

	remoteConfig.frame.setBodySize();
};

remoteConfig.frame.setFormTitle = function(title){
	$('#bodyTitle .title').html(title);
};

remoteConfig.frame.setFormPrompt = function(strHtml){
	$('#bodyPrompt .title').html(strHtml);
};

remoteConfig.frame.setFormButton = function(strHtml){
	$('#formButtonPanel').html(strHtml);
};