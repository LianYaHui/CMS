var gprs = gprs || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 0;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 0;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = listBoxMinWidthConfig = 1500;
//滚动条宽度
var scrollBarWidth = 17;

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;
var pageCount = 1;

var timer = 45;
var time = timer;
var cmenu = null;
var pause = false;
var autoPause = true;
var setPause = false;
var loaded = false;
var enabled = true;

var tabs = [
    {code: 'publish', name: '信息发布', url: cmsPath + '/modules/ledScreen/sub/infoPublish.aspx', load: false},
    {code: 'alarm', name: '预警信息发布', url: cmsPath + '/modules/ledScreen/sub/infoPublish.aspx?publishAlarm=1', load: false},
    {code: 'list', name: '信息查看及取消', url: cmsPath + '/modules/ledScreen/sub/infoLog.aspx', load: false},
    {code: 'log', name: '信息发布历史', url: cmsPath + '/modules/ledScreen/sub/infoLog.aspx?isLog=1', load: false},
    //{code: 'dev_log', name: '设备信息历史', url: cmsPath + '/modules/ledScreen/sub/infoLogByDevice.aspx', load: false},
    {code: 'type', name: '信息内容分类', url: cmsPath + '/modules/ledScreen/sub/infoType.aspx', load: false}
    //{code: 'filter', name: '信息内容过滤', url: cmsPath + '/modules/ledScreen/sub/contentFilter.aspx', load: false}
];
var curTab = 'publish';

var tabpanelId = '#tabpanel';
var tabpanelBoxLeft = 0;
var tabpanelBoxWidth = 0;

$(window).load(function(){
    setBodySize();
    
    initialForm();    
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).resize(function(){
    setBodySize();
});

function setBodySize(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
}

function setBoxSize(){
    $('#mainContent').width(boxSize.width - borderWidth);
    $('#mainContent').height(boxSize.height - 25 - borderWidth);
    $('#frmbox').width(boxSize.width);
    $('#frmbox').height(boxSize.height - 25);
    
    setFrmSize();
    setTabPanelSize();
}

function initialForm(){
    $('#tabpanelBox').html('<div id="tabpanel" class="tabpanel nobg"></div>');
    tabpanelId = '#tabpanel';
    
    for (var i = 0; i < tabs.length; i++) {
        var page = tabs[i];
        /*
        var strOnclick = ' onclick="loadPage({code:\'%s\',url:\'%s\',name:\'%s\'});" '.format(
            [page.code, page.url, page.name], '%s'
        );
        var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur' : 'tab') + '" lang="' + tabs[i].code + '" rel="#frm_' + tabs[i].code + '"' + strOnclick + '>'
            + '<span>' + tabs[i].name + '</span>'
            + '</a>';
        */
        var maxlen = 14;        
        var isClose = false;
        var strOnclick = 'loadPage({code:\'%s\',url:\'%s\',name:\'%s\'});'.format(
            [page.code, page.url, page.name], '%s'
        );
        var strTab = cms.jquery.buildTab(page.code, page.name, maxlen, '#frm_' + page.code, isClose, strOnclick,null,
            'buildContextMenu(event, this, \'' + page.code + '\');', page.style, '点击关闭标签');

        $(tabpanelId).append(strTab);
    }

    cms.jquery.tabs('.tabpanel', null, '.frmcon', 'gotoPage');
    
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
    
    loadPage({code:tabs[0].code, name:tabs[0].name, url:tabs[0].url});
}

function loadPage(param, update){
    $('#frmbox iframe').hide();
    $(tabpanelId + ' a').removeClass();
    $.each($(tabpanelId + ' a'), function () {
        $(this).addClass($(this).children('span').eq(0).prop('lang').split(',')[0] || 'tab');
    });
    if(param.code == 'list' || param.code == 'log'){
        update = true;
    }
    if (!checkPageIsLoad(param.code)) {
        var strFrm = buildIframe(param.code, param.url, param.name);
        $('#frmbox').append(strFrm);

        var idx = cms.jquery.getTabItem(tabs, param.code);
        tabs[idx].load = true;
    } else if(update){
        updateIframe(param.code, param.url, true);
    }
    $('#frm_' + param.code).show();
    $(tabpanelId + ' a[lang=' + param.code + ']').addClass('cur');

    setFrmSize();
    setTabPanelSize();
    showCurrentTabItem(param.code);
}

/*
isUpdate: 是否强制更新
*/
function updateIframe(code, url, isUpdate){
    var oldUrl = $('#frm_' + code).prop('src');
    if(oldUrl != undefined){
        //如果页面URL更新了，则重新加载页面
        if((oldUrl != undefined && oldUrl != '' && oldUrl != oldUrl.replace(cms.util.getHost(oldUrl), '')) || isUpdate){
            $('#frm_' + code).attr('src', oldUrl);
        }
    }
}

function gotoPage (param) {
    curTab = param.action;
    var idx = cms.jquery.getTabItem(tabs, curTab);

    var idx = cms.jquery.getTabItem(tabs, curTab);
    loadPage(tabs[idx]);
    
    showCurrentTabItem(curTab);
}


//从其他TAB切换到 发布界面
function addInfo(){
    loadPage({code:tabs[0].code, name:tabs[0].name, url:tabs[0].url}, false);
}

//复制已发布的信息到 发布界面
function copyInfo(id){
    var url = tabs[0].url + tabs[0].url.urlConnector() + 'copy=1&id=' + id;
    loadPage({code:tabs[0].code, name:tabs[0].name, url:tabs[0].url}, true);
}

function checkPageIsLoad(tab) {
    var idx = cms.jquery.getTabItem(tabs, tab);
    return tabs[idx].load;
}

function setFrmSize() {
    $('#frmbox .frmcon').width(boxSize.width);
    $('#frmbox .frmcon').height(boxSize.height - 25);   
}

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
    if(tabWidth > maxWidth){
        tabWidth += 60;
    }
    $(tabpanelId).width(tabWidth);
    $('#tabpanelBox').width(boxSize.width - 16*2);
    
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

var buildIframe = function(code, url, name){
    url += (url.indexOf('?') >= 0 ? '&' : '?') + 'title=' + escape(name);
    return '<iframe class="frmcon" id="frm_' + code + '" frameborder="0" scrolling="auto" width="100%" height="100%" src="' + url + '"></iframe>';
};

var buildContextMenu = function(e, obj, tab){
    var ev = e || window.event;
    var item = [];
	var idx = 0;	
    var count = tabs.length;
	var allowClose = false;	
	if(count > 0){	   
	    for(var i=count-1; i>=0; i--){
            if(tab == tabs[i].code){
	            item[idx++] = {
		            text:'重新加载', func:function(){
		                //加载初始URL
			            updateIframe(tabs[i].code, tabs[i].url, true);
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