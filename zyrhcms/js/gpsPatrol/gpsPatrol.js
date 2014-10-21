cms.patrol = cms.patrol || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 200;
var rightWidth = 120;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 1265;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var tabs = [];
cms.patrol.menuCode = 'device';
cms.patrol.menuCodeCookie = 'cms.patrol.menucookie';

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 240;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    initialForm();
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    
    setBodySize();
    
    /*
    var isCookie = cms.util.getCookie(cms.patrol.menuCodeCookie);
    if(isCookie != ''){
        cms.patrol.menuCode = isCookie;
        window.setTimeout(menuAction, 50, isCookie);
        $('#bodyRight .oper-menu li a').removeClass();
        $('#bodyRight .oper-menu li a[lang=' + isCookie + ']').addClass('cur');
    } else { 
        cms.patrol.menuCode = 'device';
        window.setTimeout(menuAction, 50, cms.patrol.menuCode);  
    }
    */
    
    cms.patrol.menuCode = 'device';
    window.setTimeout(menuAction, 50, cms.patrol.menuCode, '巡检设备');   
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).resize(function(){
    if(cms.frame.resize++ == 0){
        cms.frame.setFrameSize(leftWidth, rightWidth);
    } else {
        cms.frame.setFrameSize();
    }
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    $('#bodyRightSwitch').click(function(){
        setRightDisplay($(this));
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
    
    $('#bodyRight .oper-menu li a').click(function(){
        $('#bodyRight .oper-menu li a').removeClass();
        $(this).addClass('cur');
        if($(this).prop('lang') != ''){
            menuAction($(this).prop('lang'), $(this).html());
        } else {
            cms.patrol.showSettingBox();
        }
    });
}

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth * 2 - borderWidth - rightWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
        
    $('#bodyRight').width(rightWidth - borderWidth);
    $('#bodyRightSwitch').width(switchWidth);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    $('#bodyRight').height(boxSize.height);
    $('#bodyRightSwitch').height(boxSize.height);
    
    setBoxSize();
    setRightPanelSize();
}

var setBoxSize = function(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    $('#tabpanelBox').width(boxSize.width - 17*2);     
    setTabPanelSize();
    $('#frmbox').width(boxSize.width);
    $('#frmbox').height(boxSize.height - 25);
    /*
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);
    }
    $('.listbox').height(boxSize.height - 25*2 - 28);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25*2 - 28 - 23);
    
    setListBoxSize();
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    */
}

var setListBoxSize = function(){
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    }
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
}

var setRightPanelSize = function(){
    var c = $('#bodyRight .titlebar').size();
    
    var totalHeight = boxSize.height - 25 * c;
    $('#bodyRight .box-panel').height(totalHeight);
    $('#bodyRight .titlebar').css('cursor','pointer');
    $('#bodyRight .titlebar').click(function(){
        if($(this).next('.box-panel').is(":hidden")){
            $("#bodyRight .box-panel").slideUp('fast');
            $('#bodyRight .titlebar a').removeClass();
            $('#bodyRight .titlebar a').addClass('switch sw-close');
            $(this).next('.box-panel').animate({height: 'toggle', opacity: 'toggle'}, "fast");
            $(this).find('a').removeClass();
            $(this).find('a').addClass('switch sw-open');
        }
    });
}

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

var setRightDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyRightSwitch');
    }
    cms.frame.setRightDisplay($('#bodyRight'), obj);
}

var treeAction = function(param){
    var unitId = 0;
    var devCode = '';
    switch(param.type){
        case 'unit':
            unitId = param.unitId;
            devCode = '';
            break;
        case 'device':
            unitId = param.unitId;
            devCode = param.devCode;
            break;
    }
    $('#txtDevUnitId').attr('value', unitId);
    $('#txtDevCode').attr('value', devCode);
    pageIndex = pageStart;
    
    var childFunc = window.frames["frmMain"].window.setParam;
    
    if(childFunc != undefined && typeof childFunc == 'function'){
        childFunc({unitId:unitId,devCode:devCode});
    }
}

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
}
/*
var menuAction = function(action, title){
    var url = '';
    cms.patrol.menuCode = action;
    
    //将当前设置写入Cookie中
    //cms.util.setCookie(cms.patrol.menuCodeCookie, action, 0);
    
    var unitId = $('#txtDevUnitId').val();
    var devCode = $('#txtDevCode').val();
    var dtime = new Date().getTime();
    var param = '?unitId=' + unitId + '&devCode=' + devCode + '&' + dtime;
    switch(action){
        case 'device':
            url = cms.util.path + '/modules/patrol/device.aspx' + param;
            break;
        case 'track':
            url = cms.util.path + '/modules/patrol/track.aspx' + param;
            break;
        case 'task_add':
            url = cms.util.path + '/modules/patrol/taskAdd.aspx' + param;
            break;
        case 'task_stat':
            url = cms.util.path + '/modules/patrol/taskStat.aspx' + param;
            break;
        case 'task_list':
            url = cms.util.path + '/modules/patrol/taskList.aspx' + param;
            break;
        default:
            //url = cms.util.path + '/modules/patrol/device.aspx' + param;
            break;
    }
    $('#mainTitle .title').html(title);
    $('#frmMain').attr('src', url);
    
    cms.patrol.setBodyShow(false);
}
*/
var menuAction = function(tab, tabName){
    var isExist = false;
    var isDelete = false;
    cms.patrol.menuCode = tab;
    for(var i=0; i<tabs.length; i++){
        if(tab == tabs[i].code){
            isExist = true;
            isDelete = tabs[i].deleted == true;
            tabs[i].deleted = false;
            break;
        }
    }
                
    $('#frmbox iframe').hide();
    $('#tabpanel a').removeClass();
    $('#tabpanel a').addClass('tab-c');
    if(!isExist){
        var url = '';
        
        //将当前设置写入Cookie中
        //cms.util.setCookie(cms.patrol.menuCodeCookie, action, 0);
        
        var unitId = $('#txtDevUnitId').val();
        var devCode = $('#txtDevCode').val();
        var dtime = new Date().getTime();
        var param = '?unitId=' + unitId + '&devCode=' + devCode + '&' + dtime;
        switch(tab){
            case 'device':
                url = cms.util.path + '/modules/patrol/device.aspx' + param;
                break;
            case 'track':
                url = cms.util.path + '/modules/patrol/track.aspx' + param;
                break;
            case 'task_add':
                url = cms.util.path + '/modules/patrol/taskAdd.aspx' + param;
                break;
            case 'task_stat':
                url = cms.util.path + '/modules/patrol/taskStat.aspx' + param;
                break;
            case 'task_list':
                url = cms.util.path + '/modules/patrol/taskList.aspx' + param;
                break;
            case 'task_plan':
                url = cms.util.path + '/modules/patrol/taskPlan.aspx' + param;
                break;
            default:
                //url = cms.util.path + '/modules/patrol/device.aspx' + param;
                break;
        }
        tabs.push({code:tab, name:tabName, load:true, deleted:false});
        /*
        var len = tabs[i].name.len();
        var txtlen = 12;
        var strTitle = len > txtlen ? tabs[i].name : '';
        var strName = len > txtlen ? tabs[i].name.gbtrim(txtlen, '..') : tabs[i].name;
        var strTab = '<a class="tab-c" lang="' + tabs[i].code + '" rel="#frmMain_' + tabs[i].code + '">'
            + '<span title="' + strTitle + '">' + strName + '</span>'
            + '<i class="c" title="关闭" onclick="delTab(event,\'' + tabs[i].code + '\');"></i>'
            + '</a>';
        */
        var strTab = cms.jquery.buildTab(tabs[i].code, tabs[i].name, 12, '#frmMain_' + tabs[i].code, true, 'cms.patrol.delTab');
        
        $('#tabpanel').append(strTab);
        $('#frmbox').append('<iframe class="frmcon" id="frmMain_' + tab + '" frameborder="0" scrolling="auto" width="100%" height="100%" src="' + url + '"></iframe>');
        
        cms.patrol.setBodyShow(false);
    } else {
        cms.patrol.setBodyShow(true);
        $('#frmMain_' + tab).show(); 
    }
    $('#tabpanel a[lang=' + tab + ']').addClass('cur-c');
    $('#tabpanel a[lang=' + tab + ']').show();   
    cms.jquery.tabs('#bodyMain .tabpanel', '#frmbox', '.frmcon', 'cms.patrol.gotoPage',['tab-c','cur-c']);
    
    setTabPanelSize();
}

var setTabPanelSize = function(){
    $('#tabpanel').width(cms.jquery.getTabWidth($('#tabpanel'), boxSize.width - 17*2));
};

cms.patrol.gotoPage = function(param){
    cms.patrol.menuCode = param.action;
    cms.patrol.setBodyShow(true);
}

cms.patrol.delTab = function(ev,tab){
    if(tab == undefined) tab = cms.patrol.menuCode;
    for(var i=0; i<tabs.length; i++){
        if(tab == tabs[i].code){
            //tabs.remove(i);
            tabs[i].deleted = true; //被删除
            $('#frmbox .frmcon[id=frmMain_' + tab + ']').hide();
            $('#tabpanel a[lang=' + tab + ']').hide();
            break;
        }
    }
    cms.patrol.menuCode = '';
    for(var j=0; j<tabs.length; j++){        
        if(!tabs[j].deleted && tab != tabs[j].code){
            menuAction(tabs[j].code, tabs[j].name);
            cms.patrol.menuCode = tabs[j].code;
            break;
        }
    }
    setTabPanelSize();
    
    //阻止单击事件冒泡
    if(ev.stopPropagation){ev.stopPropagation();} else{ev.cancelBubble = true;}
    if(ev.preventDefault){ev.preventDefault();} else{ev.returnValue = false;}
}
/*

var delTab = function(ev, tab){
    if(tabs.length <= 1){
        cms.box.alert({title:'提示',html:'不要全部都删了，至少保留一个页面吧。'});
        return false;
    }
    if(tab == undefined) tab = curTab;
    for(var i=0; i<tabs.length; i++){
        if(tab == tabs[i].code){
            tabs.splice(i, 1);
            $('#frmbox iframe').remove('.frmcon[id=frmMain_' + tab + ']');
            $('#tabpanel a').remove('[lang=' + tab + ']');
            break;
        }
    }
    for(var j=0; j<tabs.length; j++){
        if(!tabs[j].deleted && tab != tabs[j].code){
            loadPage({code:tabs[j].code, url:tabs[j].url, name:tabs[j].name},null);
            curTab = tabs[j].code;
            break;
        }
    }
    
    //阻止单击事件冒泡
    if(ev.stopPropagation){ev.stopPropagation();} else{ev.cancelBubble = true;}
    if(ev.preventDefault){ev.preventDefault();} else{ev.returnValue = false;}
};
*/

cms.patrol.setBodyShow = function(show){
    if(show){
        $('#bdLoading').hide();
        $('#frmbox').show();
    } else {
        $('#bdLoading').show();
        $('#frmbox').hide();
    }
}

cms.patrol.showSettingBox = function(){
    var strHtml = '';
    var config = {
        id: 'gpssetting',
        title: '设置',
        html: strHtml,
        width: 600,
        height: 400
    };
    cms.box.win(config);
}