var info = info || {};

//是否启用标签页
var isMulti = true;
//标签页
var tabs = [];
//当前标签
var curTab = 'home';
//已经关闭的标签页
var closedTabs = [];
//最少保留多少个Tab标签页
var minCount = 1;
//最多显示多少个Tab标签页
var maxCount = 10;
var cmenu = null;
var timer = null;
var interval = null;
var boxSize = {};
var strTabPageLabel = '标签页';
var strPageLabel = '标签页';

var tabpanelBoxLeft = 0;
var tabpanelBoxWidth = 0;
var tabpanelId = '#tabpanel';

info.curSelect;
info.curMenu = '';
info.curPageUrl = '';
info.funcName = 'info.treeAction';
info.cmsPath = cms.util.path + '/modules/infoManage/sub';
info.arrTreeData = {
	module:[
		{id: 0, pid: -1, name: ''},
		{id: 1, pid: 0, name: '信息管理', func: null}
	],
	menu:[
	    {id:101, pid: 1, name: '首页', callBack:{func: info.funcName, action: 'home', url: info.cmsPath + '/home.aspx'}},
		{id:101, pid: 1, name: '公告信息', callBack:{func: info.funcName, action: 'bulletin', url: info.cmsPath + '/bulletin.aspx'}},
		{id:102, pid: 1, name: '资料下载', callBack:{func: info.funcName, action: 'datum', url: info.cmsPath + '/datum.aspx'}}
	]
};

$(window).load(function(){
    cms.frame.setFrameSize(info.frame.bodyLeftWidth, 0);
    
	info.frame.initialForm();
	info.frame.setBodySize();
	info.frame.setFrameByShortcutKey();
	info.loadTreeMenu();
    
	info.initialForm();
	info.frame.setBodySize();
	
	window.setTimeout(info.loadDefaultPage, 50);
	
    cms.frame.setFrameByShortcutKey({resizeFunc: info.frame.setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).resize(function(){
	info.frame.setBodySize();
});

info.initialForm = function(){
    $('#tabpanelBox').html('<div id="tabpanel" class="tabpanel nobg"></div>');
    tabpanelId = '#tabpanel';
    $('#frmbox').html('<iframe src="" frameborder="0" scrolling="auto" width="100%" height="100%" class="frmcon" name="frmMain" id="frmMain" ></iframe>');
    
    $('#bodyLeftSwitch').click(function(){
        cms.frame.setLeftDisplay($('#bodyLeft'), $(this));
    });
    $('#bodyLeft .titlebar .title').dblclick(function(){
        setSwitchItem();
    });
    $('.tab-scroll-left').mousedown(function(){
        cms.util.tabScroll('sub', cms.util.$('tabpanelBox'));
    });
    $('.tab-scroll-left').mouseup(function(){
        cms.util.stopScroll();
    });
    $('.tab-scroll-right').mousedown(function(){
        cms.util.tabScroll('add', cms.util.$('tabpanelBox'));
    });
    $('.tab-scroll-right').mouseup(function(){
        cms.util.stopScroll();
    });
    showTabScrollControl(false);
};

info.loadTreeMenu = function(){
	info.tree.buildMenuTree(info.arrTreeData, [1], info.arrTreeData.module.length);
};

info.loadDefaultPage = function(){    
	info.treeAction({type: 'menu', action:'home', name: '首页', url: info.cmsPath + '/home.aspx', close: false});	//加载默认页面
};

info.treeAction = function(param){
	if(info.curSelect == param.action){
		return false;	//不重复加载
	}
	var strUrl = '';
	if(param.type == 'menu'){
		//改变框架中标题栏的名称
		info.frame.setFormTitle(param.name);
		info.frame.setFormPrompt('');
		strUrl = param.url;
	}
	if(strUrl == ''){
	    strUrl = 'about:blank';
	}	
    else if(strUrl != '' && strUrl != undefined){
        strUrl += (strUrl.indexOf('?')>=0 ? '&' : '?') + new Date().getTime();
    }
    strUrl += '&title=' + escape(param.name);
	
	info.curPageUrl = strUrl;
	
	var close = param.close == undefined ? true : param.close;
	
	loadPage({code:param.action, name: param.name, url: strUrl, close: close}, null, false);
	
	info.curSelect = param.action;	
};

info.setFormBodySize = function(callBack){
    var formSize = info.frame.getFormSize();
    var conHeight = formSize.height - info.frame.paddingTop - info.frame.bodyBottomHeight;
    
    $('#divFormContent').height(conHeight);
    
    if(typeof callBack == 'function'){
        info.resizeCallBackFunc = callBack;
    } else if(typeof callBack == 'string' && typeof eval('(' + callBack + ')') == 'function'){
        info.resizeCallBackFunc = eval('(' + callBack + ')');
    }
    if(info.resizeCallBackFunc != null){
        info.resizeCallBackFunc(formSize, conHeight);
    }
};

info.setFormTableStyle = function(){
    $(".tbhelp tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
};


var setPageTitle = function(title){
    //$('#bodyMain .title').html(title);
};

//page = {url:'',code:'',name:''};
var loadPage = function(page, obj, update){

    if(typeof page != 'object'){
        var strHtml = '<div>页面参数错误。</div>';
        cms.box.alert({title:'提示',html:strHtml});
        return false;
    }
    var strUrl = page.url;

    if(isMulti){
        if(tabs.length >= maxCount && !checkPageIsLoad(page.code)){
            var strHtml = '<div>打开的' + strPageLabel + '太多了，请关闭一些' + strPageLabel + '。同时最多只能打开' + maxCount + '个' + strPageLabel + '。</div>';
            cms.box.alert({title:'提示',html:strHtml});
            return false;
        }
        $('#frmbox iframe').hide();
        $(tabpanelId + ' a').removeClass();
        $.each($(tabpanelId + ' a'), function(){
            $(this).addClass($(this).children('span').eq(0).prop('lang').split(',')[0] || 'tab');
        });
        //是否允许关闭
        var isClose = false;
        if(!checkPageIsLoad(page.code)){
            tabs.push({code:page.code, name:page.name, url:page.url, load:true, close:page.close == undefined ? true : page.close});
            var maxlen = 14;
            isClose = page.close || page.close == undefined;
            var strTab = cms.jquery.buildTab(page.code, page.name, maxlen, '#frmMain_' + page.code, isClose, 'delTab(event,\'' + page.code + '\');', null, 
                'buildContextMenu(event, this, \'' + page.code + '\');', page.style, '点击关闭标签');
            $(tabpanelId).append(strTab);

            $('#frmbox').append(buildIframe(page.code, page.url));
            cms.util.setWindowStatus();
            info.frame.setBoxSize();
        } else {
            isClose = $(tabpanelId + ' a[lang=' + page.code + ']').children('i').prop('class') != undefined;
            if(update){
                updateIframe(page.code, page.url, true);
                cms.util.setWindowStatus();
            }
        }
        $('#frmMain_' + page.code).show(); 
        $(tabpanelId + ' a[lang=' + page.code + ']').addClass(isClose ? 'cur-c' : 'cur');
        cms.jquery.tabs('#bodyMain .tabpanel', '#frmbox', '.frmcon', 'gotoPage');
        cms.util.setWindowStatus();
        
        setPageTitle(page.name);
        
        setTabPanelSize();
        showCurrentTabItem(page.code);
    } else {
        $('#frmMain').attr('src', strUrl);
        cms.util.setWindowStatus();
        setPageTitle(page.name);
    
        setTabPanelSize();
    }
    curTab = page.code;
    
    return true;
};

var showCurrentTabItem = function(tab){
    var objBox = cms.util.$('tabpanelBox');
    var distance = 0;
    var margin = 5;
    
    var boxLeft = tabpanelBoxLeft;
    var boxRight = boxLeft + tabpanelBoxWidth;
    var tabLeft = $(tabpanelId + ' a[lang=' + tab + ']').offset().left;
    var tabRight = tabLeft + $(tabpanelId + ' a[lang=' + tab + ']').width();
    
    if(tabLeft > boxRight){
        distance = tabLeft - boxLeft + margin;
    } else if(tabRight > boxRight){
        distance = tabRight - boxRight + margin;
    } else if(tabLeft < boxLeft){
        distance = - (boxLeft - tabLeft + margin);
    }
    objBox.scrollLeft += distance;
};

var setTabPanelSize = function(){
    var maxWidth = boxSize.width - 16*2;
    var tabWidth = cms.jquery.getTabWidth($(tabpanelId), maxWidth);
    $(tabpanelId).width(tabWidth);
    
    showTabScrollControl(tabWidth > maxWidth);
};

var showTabScrollControl = function(show){
    if(show){
        $('.tab-scroll-left').show();
        $('.tab-scroll-right').show();
    } else {
        $('.tab-scroll-left').hide();
        $('.tab-scroll-right').hide();
    }
};

var buildIframe = function(code, url){
    return '<iframe class="frmcon" id="frmMain_' + code + '" frameborder="0" scrolling="auto" width="100%" height="100%" src="' + url + '"></iframe>';
};

/*
isUpdate: 是否强制更新
*/
var updateIframe = function(code, url, isUpdate){
    var oldUrl = $('#frmMain_' + code).prop('src');
    //如果页面URL更新了，则重新加载页面
    if((url != undefined && url != '' && url != oldUrl.replace(cms.util.getHost(oldUrl), '')) || isUpdate){
        $('#frmMain_' + code).attr('src', url);
    }
};

var getIframeId = function(code){
    return '#frmMain_' + code;
};

var buildContextMenu = function(e, obj, tab){
    var ev = e || window.event;
    var item = [];
	var idx = 0;	
    var count = tabs.length;
	var allowClose = false;
	for(var i=count-1; i>=0; i--){
        if(tabs[i].close && tab == tabs[i].code){
	        item[idx++] = {
		        text:'关闭当前' + strTabPageLabel, func:function(){
			        delTab(ev, tab, true);
		        }
	        };
	        allowClose = true;
            break;
        }
    }
    if(allowClose){
        item[idx++] = {
            text:'separator'
        };    
    }
    item[idx++] = {
        text:'关闭全部' + strTabPageLabel, func:function(){
            for(var i=count-1; i>=0; i--){
                if(tabs[i].close){
	                delTab(ev, tabs[i].code, true);
	            }
            }
        }
    };
    
    
	if(count > 1){
	    var tabOther = 0;
	    for(var i=0; i<count; i++){
            if(tabs[i].code != tab && tabs[i].close){
                tabOther++;
                break;
	        }
        }
        if(tabOther > 0){
	        item[idx++] = {
		        text:'关闭其他' + strTabPageLabel, func:function(){
		            for(var i=count-1; i>=0; i--){
		                if(tabs[i].code != tab && tabs[i].close){
			                delTab(ev, tabs[i].code, true);
			            }
		            }
		        }
	        };
	    }
	    var tabLeft = 0;
	    var tabLeftClose = 0;
	    for(var i=0; i<count; i++){
            if(tabs[i].code == tab){
                break;
	        }
	        tabLeftClose += tabs[i].close ? 1 : 0;
	        tabLeft++;
        }
        if(tabLeftClose > 0){
	        item[idx++] = {
		        text:'关闭左侧' + strTabPageLabel, func:function(){
		            for(var i=tabLeft-1; i>=0; i--){
		                if(tabs[i].close){
			                delTab(ev, tabs[i].code, true);
			            }
		            }
		        }
	        };
	    }
	    var tabRight = 0;
	    for(var i=count-1; i>=0; i--){
            if(tabs[i].code == tab){
                break;
	        }
	        tabRight += tabs[i].close ? 1 : 0;
        }
        if(tabRight > 0){
	        item[idx++] = {
		        text:'关闭右侧' + strTabPageLabel, func:function(){
        			for(var i=count-1; i>=0; i--){
		                if(tabs[i].code == tab){
		                    break;
			            } else if(tabs[i].close){
			                delTab(ev, tabs[i].code, true);
			            }
		            }
		        }
	        };
	    }	    
	}
	
	if(count > 0){	    
        item[idx++] = {
            text:'separator'
        };
	    for(var i=count-1; i>=0; i--){
            if(tab == tabs[i].code){
	            item[idx++] = {
		            text:'重新加载', func:function(){
		                //加载初始URL
			            updateIframe(tabs[i].code, tabs[i].url, true);
			            /* 刷新(不重新加载)
			            var iframeId = getIframeId(tabs[i].code);
			            $(iframeId)[0].contentWindow.location.reload();
			            */
		            }
	            };
                break;
            }
        }
	}
	
	if(count > 1){
        item[idx++] = {
            text:'全部重新加载', func:function(){
                for(var i=count-1; i>=0; i--){
                    updateIframe(tabs[i].code, tabs[i].url, true);
                }
            }
        };	
	}
	
	item[idx++] = {
        text:'separator'
    };
	var lastClosedTab = getClosedTab();
	if(lastClosedTab != null){
        item[idx++] = {
            text:'重新打开关闭的标签页', func:function(){
                if(loadPage(lastClosedTab, obj, false)){
                    deleteClosedTab();
                }
            }
        };
        item[idx++] = {
            text:'重新打开关闭的全部标签页', func:function(){
                for(var i=0,c=closedTabs.length; i<c; i++){
                    lastClosedTab = getClosedTab();
                    if(loadPage(lastClosedTab, obj, false)){
                        deleteClosedTab();
                    } else {
                        break;
                    }
                }
            }
        }; 
	} else {
        item[idx++] = {
            text:'重新打开关闭的标签页', disabled: true
        };
        item[idx++] = {
            text:'重新打开关闭的全部标签页', disabled: true
        };
	}
	
    var config = {
	    width: 100,
	    zindex: 1000,
	    opacity: 1,
	    item: item
    };
    cmenu = new ContextMenu(e, config, obj);
};

var hideContextMenu = function(){
    if(cmenu != null){
        cmenu.Close(cmenu.id);
    }
};

var checkPageIsLoad = function(tab){
    for(var i=0; i<tabs.length; i++){
        if(tabs[i].code == tab){
            return true;
        }
    }
    return false;
};

var gotoPage = function(param){
    curTab = param.action;
    var idx = cms.jquery.getTabItem(tabs, curTab);
    
    setPageTitle(tabs[idx].name);
    
    showCurrentTabItem(curTab);
};

var delTab = function(ev, tab, isContextMenu){
    if(tabs.length <= minCount){
        cms.box.alert({title:'提示',html:'不要全部都删了，至少保留' + minCount + '个' + strPageLabel + '吧。'});
        return false;
    }
    if(tab == undefined) tab = curTab;    
    for(var i=0; i<tabs.length; i++){
        if(tab == tabs[i].code){
            //记录被关闭的标签页
            closedTabs.push(tabs[i]);
            
            //删除数组中的标签
            tabs.splice(i, 1);
            $('#frmbox iframe').remove('.frmcon[id=frmMain_' + tab + ']');
            $('#tabpanel a').remove('[lang=' + tab + ']');
            break;
        }
    }
    if(tab == curTab){
        for(var j=tabs.length-1; j>=0; j--){
            if(!tabs[j].deleted && tab != tabs[j].code){
                loadPage({code:tabs[j].code, url:tabs[j].url, name:tabs[j].name},null);
                curTab = tabs[j].code;
                break;
            }
        }    
    }
    
    if(0 == tabs.length){
        setPageTitle('');
    }
    
    setTabPanelSize();
    
    if(!isContextMenu){
        //阻止单击事件冒泡
        if(ev.stopPropagation){ev.stopPropagation();} else{ev.cancelBubble = true;}
        if(ev.preventDefault){ev.preventDefault();} else{ev.returnValue = false;}
    }
};

//获取最后一次被删除的标签
var getClosedTab = function(){
    if(closedTabs.length > 0){
        var idx = closedTabs.length - 1;
        var tab = closedTabs[idx];
        //closedTabs.splice(idx, 1);
        
        return tab;
    }
    return null;
};

//删除被删除标签中 已经重新加载的标签页
var deleteClosedTab = function(){
    if(closedTabs.length > 0){
        var idx = closedTabs.length - 1;
        closedTabs.splice(idx, 1);
        
        return true;
    }
    return false;
};