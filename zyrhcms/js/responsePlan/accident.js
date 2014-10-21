var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 220;
var rightWidth = 0;
var switchWidth = 5
var boxSize = {};

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var tabs = [];
var menuCode = 'device';

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    //cms.frame.setFullScreen(true);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    
    
    cms.frame.setFrameByShortcutKey();
});

$(window).resize(function(){
    setBodySize();
});

var posX = 0;
var posW = 0;

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    $('#bodyLeft .oper-menu li a').click(function(){
        $('#bodyLeft .oper-menu li a').removeClass();
        $(this).addClass('cur');
        if($(this).prop('lang') != ''){
            menuAction($(this).prop('lang'), $(this).html());
        } else {

        }
    });
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
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
    setLeftPanelSize();
};

var setBoxSize = function(){
    
};

var setLeftPanelSize = function(){
    var c = $('#bodyLeft .titlebar').size();
    
    var totalHeight = boxSize.height - 25 * c;
    $('#bodyLeft .box-panel').height(totalHeight);
    $('#bodyLeft .titlebar').css('cursor','pointer');
    $('#bodyLeft .titlebar').click(function(){
        if($(this).next('.box-panel').is(":hidden")){
            $("#bodyLeft .box-panel").slideUp('fast');
            $('#bodyLeft .titlebar a').removeClass();
            $('#bodyLeft .titlebar a').addClass('switch sw-close');
            $(this).next('.box-panel').animate({height: 'toggle', opacity: 'toggle'}, "fast");
            $(this).find('a').removeClass();
            $(this).find('a').addClass('switch sw-open');
        }
    });
};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var menuAction = function(action, title){
    var isExist = false;
    var isDelete = false;
    menuCode = action;
    for(var i=0; i<tabs.length; i++){
        if(action == tabs[i].code){
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
        /*
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
            case 'task_plan':
                url = cms.util.path + '/modules/patrol/taskPlan.aspx' + param;
                break;
            default:
                //url = cms.util.path + '/modules/patrol/device.aspx' + param;
                break;
        }
        */
        tabs.push({code:action, name:title, load:true, deleted:false});
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
        var strTab = cms.jquery.buildTab(tabs[i].code, tabs[i].name, 12, '#listBox_' + tabs[i].code, true, 'delTab');
        
        $('#tabpanel').append(strTab);
        $('#frmbox').append('<iframe class="frmcon" id="frmMain_' + action + '" frameborder="0" scrolling="auto" width="100%" height="100%" src="' + url + '"></iframe>');
    } else {
        $('#frmMain_' + action).show(); 
    }
    $('#tabpanel a[lang=' + action + ']').addClass('cur-c');
    $('#tabpanel a[lang=' + action + ']').show();   
    cms.jquery.tabs('#bodyMain .tabpanel', '#frmbox', '.frmcon', 'cms.patrol.gotoPage',['tab-c','cur-c']);      
};

var gotoPage = function(param){
    menuCode = param.action;
};

var delTab = function(){

};