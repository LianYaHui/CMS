var sms = sms || {};
sms.frame = sms.frame || {};

sms.frame.boxSize = {};
sms.frame.paddingTop = 4;
sms.frame.paddingWidth = 5;
sms.frame.borderWidth = 2;
sms.frame.switchWidth = 5;
sms.frame.bodyLeftWidthConfig = [180, 0];
sms.frame.bodyLeftWidth = 180;
sms.frame.titleHeight = 25;
sms.frame.promptHeight = 0;
sms.frame.bodyBottomHeight = 30;
sms.frame.showBodyLeft = true;

sms.frame.getRootPath = function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = strFullPath.substring(0, strFullPath.indexOf(strPath));
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return prePath + (prePath.indexOf('http://localhost') >= 0 ? postPath: '');
}
//获得平台URL Hostd
sms.frame.path = sms.frame.getRootPath();

sms.frame.getBodySize = function(){
	return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

sms.frame.getParentBodySize = function() {
    return {
        width: parent.document.documentElement.clientWidth,
        height: parent.document.documentElement.clientHeight
    };
};

sms.frame.initialForm = function(){
	$('#bodyLeftSwitch').click(function(){
		sms.frame.switchLeftDisplay($(this));
	});
};

sms.frame.setBodySize = function(){
	var bodySize = sms.frame.getBodySize();
	boxSize = sms.frame.getBoxSize();

    $('#pageBody').css('padding-top', sms.frame.paddingTop);

	$('#bodyLeft').width(sms.frame.bodyLeftWidth - sms.frame.borderWidth);
	$('#bodyLeft').height(boxSize.height - sms.frame.borderWidth);

	$('#treebox').height(boxSize.height - sms.frame.titleHeight);

	$('#bodyLeftSwitch').height(boxSize.height + sms.frame.borderWidth);

	$('#bodyMain').width(boxSize.width - sms.frame.borderWidth);
	$('#bodyMain').height(boxSize.height - sms.frame.borderWidth);

    //$('#bodyPrompt').height(sms.frame.promptHeight - 1);
	$('#frmbox').width(boxSize.width - sms.frame.borderWidth);
	
	sms.frame.setBoxSize();
};

sms.frame.getBoxSize = function(){
    var bodySize = cms.frame.getFrameSize();
    sms.frame.bodyLeftWidth = $('#bodyLeft').is(':visible') ? sms.frame.bodyLeftWidthConfig[0] : 0;
	return {
		width: bodySize.width - sms.frame.bodyLeftWidth - sms.frame.paddingWidth,
		height: bodySize.height - sms.frame.paddingTop
	};
};

sms.frame.getFormSize = function(){
	var bodySize = sms.frame.getBoxSize();
	return {
		width: bodySize.width - sms.frame.bodyLeftWidth - sms.frame.paddingWidth,
		height: bodySize.height - sms.frame.titleHeight - sms.frame.promptHeight - sms.frame.borderWidth
	};
};

sms.frame.setBoxSize = function(isShow){
	boxSize = sms.frame.getBoxSize();

    tabpanelBoxWidth = boxSize.width - sms.frame.borderWidth - 16*2;
    $('#tabpanelBox').width(tabpanelBoxWidth);
    tabpanelBoxLeft = $('#tabpanelBox').offset().left;
    
    setTabPanelSize();
    
    $('#frmbox .frmcon').width(boxSize.width - sms.frame.borderWidth);
    $('#frmbox .frmcon').height(boxSize.height - sms.frame.borderWidth - sms.frame.promptHeight - 25);
    
	if(sms.setFormBodySize != undefined && sms.setFormBodySize != null && typeof sms.setFormBodySize == 'function'){
	    sms.setFormBodySize();
	}
};

sms.frame.setFrameByShortcutKey = function(){
    document.onkeyup = function(e){
        var e = e||event;
        //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
        if(e.shiftKey){
            switch(e.keyCode){
                case 76:
                    if($('#bodyLeft').attr('id') != undefined){
                        sms.frame.switchLeftDisplay($('#bodyLeftSwitch'));
                    }
                    break;
                default:
                    sms.shortcutKeyAction(e.keyCode);
                    break;
            }
        }
    }
}

sms.frame.switchLeftDisplay = function(obj, isShow){
	if(isShow != undefined){
		sms.frame.showBodyLeft = !isShow;
	}
	if(sms.frame.showBodyLeft){
		sms.frame.showBodyLeft = false;
		$('#bodyLeft').hide();
		sms.frame.bodyLeftWidth = sms.frame.bodyLeftWidthConfig[1];
	}
	else {
		sms.frame.showBodyLeft = true;
		$('#bodyLeft').show();
		sms.frame.bodyLeftWidth = sms.frame.bodyLeftWidthConfig[0];
	}
	if(obj == null || obj == undefined){
		obj = $('#bodyLeftSwitch');
	}
	obj.removeClass();
	obj.addClass(sms.frame.showBodyLeft ? 'switch-left' : 'switch-right');
	obj.attr('title', sms.frame.showBodyLeft ? '隐藏左栏菜单' : '显示左栏菜单');
	
	//obj.css('background-color', sms.frame.showBodyLeft ? '#dfe8f6' : '#99bbe8');

	sms.frame.setBodySize();
};

sms.frame.setFormTitle = function(title){
	$('#bodyTitle .title').html(title);
};

sms.frame.setFormPrompt = function(strHtml){
	$('#bodyPrompt .title').html(strHtml);
};