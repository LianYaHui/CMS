var help = help || {};

help.curSelect;
help.curMenu = '';
help.curPageUrl = '';
help.funcName = 'help.treeAction';
help.cmsPath = cms.util.path + '/help/sub';
help.arrTreeData = {
	module:[
		{id: 0, pid: -1, name: ''},
		{id: 1, pid: 0, name: '首页', func: null},
		{id: 2, pid: 0, name: '视频监控', func: null},
		{id: 10, pid: 0, name: '后台设置', func: null},
		{id: 20, pid: 0, name: '系统设置', func: null}
	],
	menu:[
	    {id:101, pid: 1, name: '首页', callBack:{func: help.funcName, action: 'home', url: help.cmsPath + '/home.aspx'}},
		{id:101, pid: 2, name: '视频预览', callBack:{func: help.funcName, action: 'preview', url: help.cmsPath + '/preview.aspx'}},
		{id:102, pid: 2, name: '录像回放', callBack:{func: help.funcName, action: 'playback', url: help.cmsPath + '/playback.aspx'}},
		{id:201, pid: 10, name: '组织资源', callBack:{func: help.funcName, action: 'organize', url: help.cmsPath + '/organize.aspx'}},
		{id:202, pid: 10, name: '用户管理', callBack:{func: help.funcName, action: 'user', url: help.cmsPath + '/user.aspx'}},
		{id:301, pid: 20, name: '系统设置', callBack:{func: help.funcName, action: 'config', url: help.cmsPath + '/config.aspx'}}
		
	]
};

$(window).load(function(){
	help.frame.initialForm();
	help.frame.setBodySize();
	help.frame.setFrameByShortcutKey();
	help.loadTreeMenu();
    
	help.initialForm();
	help.frame.setBodySize();
	
	window.setTimeout(help.loadDefaultPage, 50);
});

$(window).resize(function(){
	help.frame.setBodySize();
});

help.initialForm = function(){

};

help.loadTreeMenu = function(){
	help.tree.buildMenuTree(help.arrTreeData, [1, 2], help.arrTreeData.module.length);
};

help.loadDefaultPage = function(){
	help.treeAction({type: 'menu', action:'info', name: '帮助信息', url: help.cmsPath + '/home.aspx'});	//加载默认页面
};

help.treeAction = function(param){
	if(help.curSelect == param.action){
		return false;	//不重复加载
	}
	var strUrl = '';
	if(param.type == 'menu'){
		//改变框架中标题栏的名称
		help.frame.setFormTitle(param.name);
		help.frame.setFormPrompt('');
		strUrl = param.url;
	}
	if(strUrl == ''){
	    strUrl = 'sub/blank.aspx';
	}
	
	help.curPageUrl = strUrl;
	
	strUrl += (strUrl.indexOf('?') >=0 ? '&' : '?') + new Date().getTime();
	
	help.loadPage(strUrl);
	help.curSelect = param.action;	
};

help.loadPage = function(strUrl){
	$("#bodyForm").empty();
	$("#bodyForm").html('正在加载，请稍候...');
	$("#bodyForm").load(strUrl);
	
    help.isCopyToChannel = false;
    help.isCopyToWeekDay = false;
};


help.setFormBodySize = function(callBack){
    var formSize = help.frame.getFormSize();
    var conHeight = formSize.height - help.formBodyPadding - help.formBottomHeight;
    
    $('#divFormContent').height(conHeight);
    
    if(typeof callBack == 'function'){
        help.resizeCallBackFunc = callBack;
    } else if(typeof callBack == 'string' && typeof eval('(' + callBack + ')') == 'function'){
        help.resizeCallBackFunc = eval('(' + callBack + ')');
    }
    if(help.resizeCallBackFunc != null){
        help.resizeCallBackFunc(formSize, conHeight);
    }
};

help.setFormTableStyle = function(){
    $(".tbhelp tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
};