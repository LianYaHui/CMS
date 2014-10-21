var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 200;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 5;
var boxSize = {};

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;
var pageCount = 1;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;

$(window).load(function () {
    setBodySize();
    
    $(".tblist tr:even").addClass("alternating");
    $(".tblist tr:first").removeClass();
    $(".tblist tr:first").addClass("trheader");

    window.setTimeout(showTreeData, 100);
});

$(window).resize(function(){
    setBodySize();
});

function showTreeData(){
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    var checkbox = {callback:'setDeviceChecked'};
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, false, false, true, true, '', checkbox, '50116,501161');
//    //定时刷新树型菜单设备状态
//    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
    
    tree.openAll();
    /*
    setTreeTools();
    showSelectStat();
    */
    setBodySize();
}

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
    
    setBoxSize()
}

function setBoxSize(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    var operH = $('.operform').outerHeight();
    
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);
    }
    $('.listbox').height(boxSize.height - 25 - 26 - operH);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25 - 26 - 23 - operH);
    
    
}

function loadData() {
    if ($$('ddlSearchField').val().trim().equals('')) {
        $$('ddlSearchField').focus();
        return false;
    }
    $$('btnSearch').click()
}

function loadAllData() {
    $$('ddlSearchField').get(0).selectedIndex = 0;
    $$('txtKeywords').attr('value', '');
    $$('btnSearch').click()
}