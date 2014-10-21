var emap = emap || {};

var paddingTop = 0;
var paddingWidth = 0;
var borderWidth = 2;
var leftWidth = 0;
var switchWidth = 0;
var boxSize = {};

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, 0);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    initialForm();
});

$(window).resize(function(){
    cms.frame.setFrameSize();
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    boxSize = {
        width: frameSize.width - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);    
    $('#bodyMain').height(boxSize.height);
};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};