var config = config || {};
config.frame = config.frame || {};

config.frame.boxSize = {};
config.frame.paddingTop = 4;
config.frame.paddingWidth = 5;
config.frame.borderWidth = 2;
config.frame.switchWidth = 5;
config.frame.bodyLeftWidthConfig = [180, 0];
config.frame.bodyLeftWidth = 180;
config.frame.titleHeight = 25;
config.frame.promptHeight = 0;
config.frame.bodyBottomHeight = 30;
config.frame.showBodyLeft = true;

config.frame.getRootPath = function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = strFullPath.substring(0, strFullPath.indexOf(strPath));
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return prePath + (prePath.indexOf('http://localhost') >= 0 ? postPath: '');
}
//获得平台URL Hostd
config.frame.path = config.frame.getRootPath();

config.frame.getBodySize = function(){
	return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

config.frame.getParentBodySize = function() {
    return {
        width: parent.document.documentElement.clientWidth,
        height: parent.document.documentElement.clientHeight
    };
};

config.frame.initialForm = function(){
	$('#bodyLeftSwitch').click(function(){
		config.frame.switchLeftDisplay($(this));
	});
};

config.frame.setBodySize = function(){
	var bodySize = config.frame.getBodySize();
	boxSize = config.frame.getBoxSize();

    $('#pageBody').css('padding-top', config.frame.paddingTop);

	$('#bodyLeft').width(config.frame.bodyLeftWidth - config.frame.borderWidth);
	$('#bodyLeft').height(boxSize.height - config.frame.borderWidth);

	$('#treebox').height(boxSize.height - config.frame.titleHeight);

	$('#bodyLeftSwitch').height(boxSize.height + config.frame.borderWidth);

	$('#bodyMain').width(boxSize.width - config.frame.borderWidth);
	$('#bodyMain').height(boxSize.height - config.frame.borderWidth);

    //$('#bodyPrompt').height(config.frame.promptHeight - 1);
	$('#frmbox').width(boxSize.width - config.frame.borderWidth);
	
	config.frame.setBoxSize();
};

config.frame.getBoxSize = function(){
    var bodySize = cms.frame.getFrameSize();
    config.frame.bodyLeftWidth = $('#bodyLeft').is(':visible') ? config.frame.bodyLeftWidthConfig[0] : 0;
	return {
		width: bodySize.width - config.frame.bodyLeftWidth - config.frame.paddingWidth,
		height: bodySize.height - config.frame.paddingTop
	};
};

config.frame.getFormSize = function(){
	var bodySize = config.frame.getBoxSize();
	return {
		width: bodySize.width - config.frame.bodyLeftWidth - config.frame.paddingWidth,
		height: bodySize.height - config.frame.titleHeight - config.frame.promptHeight - config.frame.borderWidth
	};
};

config.frame.setBoxSize = function(isShow){
	boxSize = config.frame.getBoxSize();

    tabpanelBoxWidth = boxSize.width - config.frame.borderWidth - 16*2;
    $('#tabpanelBox').width(tabpanelBoxWidth);
    tabpanelBoxLeft = $('#tabpanelBox').offset().left;
    
    setTabPanelSize();
    
    $('#frmbox .frmcon').width(boxSize.width - config.frame.borderWidth);
    $('#frmbox .frmcon').height(boxSize.height - config.frame.borderWidth - config.frame.promptHeight - 25);
    
	if(config.setFormBodySize != undefined && config.setFormBodySize != null && typeof config.setFormBodySize == 'function'){
	    config.setFormBodySize();
	}
};

config.frame.setFrameByShortcutKey = function(){
    document.onkeyup = function(e){
        var e = e||event;
        //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
        if(e.shiftKey){
            switch(e.keyCode){
                case 76:
                    if($('#bodyLeft').attr('id') != undefined){
                        config.frame.switchLeftDisplay($('#bodyLeftSwitch'));
                    }
                    break;
                default:
                    config.shortcutKeyAction(e.keyCode);
                    break;
            }
        }
    }
}

config.frame.switchLeftDisplay = function(obj, isShow){
	if(isShow != undefined){
		config.frame.showBodyLeft = !isShow;
	}
	if(config.frame.showBodyLeft){
		config.frame.showBodyLeft = false;
		$('#bodyLeft').hide();
		config.frame.bodyLeftWidth = config.frame.bodyLeftWidthConfig[1];
	}
	else {
		config.frame.showBodyLeft = true;
		$('#bodyLeft').show();
		config.frame.bodyLeftWidth = config.frame.bodyLeftWidthConfig[0];
	}
	if(obj == null || obj == undefined){
		obj = $('#bodyLeftSwitch');
	}
	obj.removeClass();
	obj.addClass(config.frame.showBodyLeft ? 'switch-left' : 'switch-right');
	obj.attr('title', config.frame.showBodyLeft ? '隐藏左栏菜单' : '显示左栏菜单');
	
	//obj.css('background-color', config.frame.showBodyLeft ? '#dfe8f6' : '#99bbe8');

	config.frame.setBodySize();
};

config.frame.setFormTitle = function(title){
	$('#bodyTitle .title').html(title);
};

config.frame.setFormPrompt = function(strHtml){
	$('#bodyPrompt .title').html(strHtml);
};