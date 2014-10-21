var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 220;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 5;
var boxSize = {};

var treeType = 'device';
var treeTitle = '设备列表';

var screenRows = 6;
var screenCols = 12;
var curRows = 6;
var curCols = 12;

//允许输入的最大字节数
var maxCharCount = 920;

var cellSize = [20, 24, 32];
var fontSize = [16, 24, 32];
var fontStyle = 0;

var curColor = '#f00';

var arrResult = [];
var wordCount = 0;
var newCount = 0;

/*分屏参数*/
var dataCount = 0;
var pageIndex = 0;
var pageSize = 0;
var pageCount = 0;
var curPager = null;
var timer = null;

var led = null;
var objScreen = null;
var objPager = null;


$(window).load(function(){
    setBodySize();
    initialForm();

    window.setTimeout(showTreeData, 100);
    
    //showTreeData();
});

$(window).resize(function(){
    setBodySize();
});

function showTreeData(){
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    var checkbox = {callback:'setDeviceChecked'};
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, false, false, true, true, '', checkbox, '50116');
//    //定时刷新树型菜单设备状态
//    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
    
    tree.openAll();
    
    setTreeTools();
    showSelectStat();
    
    setBodySize();
}

function setBodySize(){
    //var bodySize = cms.util.getBodySize();
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    //rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyTitle').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    $('#bodyContent').width(boxSize.width);
    $('#bodyContent').height(boxSize.height - 24 - 36);
    
    setBoxSize();
}

function setBoxSize(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52 - 25);
    
    $('#mainContent').css('min-width', 1050);
}