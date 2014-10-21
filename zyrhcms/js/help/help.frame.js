var help = help || {};
help.frame = help.frame || {};

help.frame.boxSize = {};
help.frame.paddingTop = 4;
help.frame.paddingWidth = 5;
help.frame.borderWidth = 2;
help.frame.switchWidth = 5;
help.frame.bodyLeftWidthConfig = [180, 0];
help.frame.bodyLeftWidth = 180;
help.frame.titleHeight = 25;
help.frame.promptHeight = 0;
help.frame.bodyBottomHeight = 30;
help.frame.showBodyLeft = true;

help.frame.getRootPath = function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = strFullPath.substring(0, strFullPath.indexOf(strPath));
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return prePath + (prePath.indexOf('http://localhost') >= 0 ? postPath: '');
}
//获得平台URL Host
help.frame.path = help.frame.getRootPath();

help.frame.getBodySize = function(){
	return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

help.frame.getParentBodySize = function() {
    return {
        width: parent.document.documentElement.clientWidth,
        height: parent.document.documentElement.clientHeight
    };
};

help.frame.initialForm = function(){
	$('#bodyLeftSwitch').click(function(){
		help.frame.switchLeftDisplay($(this));
	});
};

help.frame.setBodySize = function(){
	var bodySize = help.frame.getBodySize();	
	var boxSize = help.frame.getBoxSize();

    $('#pageBody').css('padding-top', help.frame.paddingTop);

	$('#bodyLeft').width(help.frame.bodyLeftWidth - help.frame.borderWidth);
	$('#bodyLeft').height(boxSize.height - help.frame.borderWidth);

	$('#treebox').height(boxSize.height - help.frame.titleHeight);

	$('#bodyLeftSwitch').height(boxSize.height + help.frame.borderWidth);

	$('#bodyRight').width(boxSize.width - help.frame.borderWidth);
	$('#bodyRight').height(boxSize.height - help.frame.borderWidth);

    $('#bodyPrompt').height(help.frame.promptHeight - 1);
	$('#bodyForm').width(boxSize.width - help.frame.borderWidth);
	
	help.frame.setBoxSize();
};

help.frame.getBoxSize = function(){
    var bodySize = cms.frame.getFrameSize();
	return {
		width: bodySize.width - help.frame.bodyLeftWidth - help.frame.paddingWidth,
		height: bodySize.height - help.frame.paddingTop
	};
};

help.frame.getFormSize = function(){
	var bodySize = help.frame.getBoxSize();
	return {
		width: bodySize.width - help.frame.bodyLeftWidth - help.frame.paddingWidth,
		height: bodySize.height - help.frame.titleHeight - help.frame.promptHeight - help.frame.borderWidth
	};
};

help.frame.setBoxSize = function(isShow){
	var formSize = help.frame.getFormSize();
	$('#bodyForm').height(formSize.height);
		
	if(help.setFormBodySize != undefined && help.setFormBodySize != null && typeof help.setFormBodySize == 'function'){
	    help.setFormBodySize();
	}
};

help.frame.setFrameByShortcutKey = function(){
    document.onkeyup = function(e){
        var e = e||event;
        //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
        if(e.shiftKey){
            switch(e.keyCode){
                case 76:
                    if($('#bodyLeft').attr('id') != undefined){
                        help.frame.switchLeftDisplay($('#bodyLeftSwitch'));
                    }
                    break;
                default:
                    help.shortcutKeyAction(e.keyCode);
                    break;
            }
        }
    }
}

help.frame.switchLeftDisplay = function(obj, isShow){
	if(isShow != undefined){
		help.frame.showBodyLeft = !isShow;
	}
	if(help.frame.showBodyLeft){
		help.frame.showBodyLeft = false;
		$('#bodyLeft').hide();
		help.frame.bodyLeftWidth = help.frame.bodyLeftWidthConfig[1];
	}
	else {
		help.frame.showBodyLeft = true;
		$('#bodyLeft').show();
		help.frame.bodyLeftWidth = help.frame.bodyLeftWidthConfig[0];
	}
	if(obj == null || obj == undefined){
		obj = $('#bodyLeftSwitch');
	}
	obj.removeClass();
	obj.addClass(help.frame.showBodyLeft ? 'switch-left' : 'switch-right');
	obj.attr('title', help.frame.showBodyLeft ? '隐藏左栏菜单' : '显示左栏菜单');
	
	//obj.css('background-color', help.frame.showBodyLeft ? '#dfe8f6' : '#99bbe8');

	help.frame.setBodySize();
};

help.frame.setFormTitle = function(title){
	$('#bodyTitle .title').html(title);
};

help.frame.setFormPrompt = function(strHtml){
	$('#bodyPrompt .title').html(strHtml);
};