var info = info || {};
info.frame = info.frame || {};

info.frame.boxSize = {};
info.frame.paddingTop = 4;
info.frame.paddingWidth = 5;
info.frame.borderWidth = 2;
info.frame.switchWidth = 5;
info.frame.bodyLeftWidthConfig = [180, 0];
info.frame.bodyLeftWidth = 180;
info.frame.titleHeight = 25;
info.frame.promptHeight = 0;
info.frame.bodyBottomHeight = 30;
info.frame.showBodyLeft = true;

info.frame.getRootPath = function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = strFullPath.substring(0, strFullPath.indexOf(strPath));
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return prePath + (prePath.indexOf('http://localhost') >= 0 ? postPath: '');
}
//获得平台URL Host
info.frame.path = info.frame.getRootPath();

info.frame.getBodySize = function(){
	return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

info.frame.getParentBodySize = function() {
    return {
        width: parent.document.documentElement.clientWidth,
        height: parent.document.documentElement.clientHeight
    };
};

info.frame.initialForm = function(){
	$('#bodyLeftSwitch').click(function(){
		info.frame.switchLeftDisplay($(this));
	});
};

info.frame.setBodySize = function(){    
	var bodySize = info.frame.getBodySize();
	boxSize = info.frame.getBoxSize();

    $('#pageBody').css('padding-top', info.frame.paddingTop);

	$('#bodyLeft').width(info.frame.bodyLeftWidth - info.frame.borderWidth);
	$('#bodyLeft').height(boxSize.height - info.frame.borderWidth);

	$('#treebox').height(boxSize.height - info.frame.titleHeight);

	$('#bodyLeftSwitch').height(boxSize.height + info.frame.borderWidth);

	$('#bodyMain').width(boxSize.width - info.frame.borderWidth);
	$('#bodyMain').height(boxSize.height - info.frame.borderWidth);

    //$('#bodyPrompt').height(info.frame.promptHeight - 1);
	$('#frmbox').width(boxSize.width - info.frame.borderWidth);
	
	info.frame.setBoxSize();
};

info.frame.getBoxSize = function(){
    var bodySize = cms.frame.getFrameSize();
    info.frame.bodyLeftWidth = $('#bodyLeft').is(':visible') ? info.frame.bodyLeftWidthConfig[0] : 0;
    
	return {
		width: bodySize.width - info.frame.bodyLeftWidth - info.frame.paddingWidth,
		height: bodySize.height - info.frame.paddingTop
	};
};

info.frame.getFormSize = function(){
	var bodySize = info.frame.getBoxSize();
	return {
		width: bodySize.width - info.frame.bodyLeftWidth - info.frame.paddingWidth,
		height: bodySize.height - info.frame.titleHeight - info.frame.promptHeight - info.frame.borderWidth
	};
};

info.frame.setBoxSize = function(isShow){
	boxSize = info.frame.getBoxSize();

    tabpanelBoxWidth = boxSize.width - info.frame.borderWidth - 16*2;
    $('#tabpanelBox').width(tabpanelBoxWidth);
    tabpanelBoxLeft = $('#tabpanelBox').offset().left;
    
    setTabPanelSize();
    
    $('#frmbox .frmcon').width(boxSize.width - info.frame.borderWidth);
    $('#frmbox .frmcon').height(boxSize.height - info.frame.borderWidth - info.frame.promptHeight - 25);
    
	if(info.setFormBodySize != undefined && info.setFormBodySize != null && typeof info.setFormBodySize == 'function'){
	    info.setFormBodySize();
	}
};

info.frame.setFrameByShortcutKey = function(){
    document.onkeyup = function(e){
        var e = e||event;
        //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
        if(e.shiftKey){
            switch(e.keyCode){
                case 76:
                    if($('#bodyLeft').attr('id') != undefined){
                        info.frame.switchLeftDisplay($('#bodyLeftSwitch'));
                    }
                    break;
                default:
                    info.shortcutKeyAction(e.keyCode);
                    break;
            }
        }
    }
}

info.frame.switchLeftDisplay = function(obj, isShow){
	if(isShow != undefined){
		info.frame.showBodyLeft = !isShow;
	}
	if(info.frame.showBodyLeft){
		info.frame.showBodyLeft = false;
		$('#bodyLeft').hide();
		info.frame.bodyLeftWidth = info.frame.bodyLeftWidthConfig[1];
	}
	else {
		info.frame.showBodyLeft = true;
		$('#bodyLeft').show();
		info.frame.bodyLeftWidth = info.frame.bodyLeftWidthConfig[0];
	}
	if(obj == null || obj == undefined){
		obj = $('#bodyLeftSwitch');
	}
	obj.removeClass();
	obj.addClass(info.frame.showBodyLeft ? 'switch-left' : 'switch-right');
	obj.attr('title', info.frame.showBodyLeft ? '隐藏左栏菜单' : '显示左栏菜单');
	
	//obj.css('background-color', info.frame.showBodyLeft ? '#dfe8f6' : '#99bbe8');

	info.frame.setBodySize();
};

info.frame.setFormTitle = function(title){
	$('#bodyTitle .title').html(title);
};

info.frame.setFormPrompt = function(strHtml){
	$('#bodyPrompt .title').html(strHtml);
};