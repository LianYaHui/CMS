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

var arrWin = [];

var arrMarker = [];
var arrLabel = [];

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