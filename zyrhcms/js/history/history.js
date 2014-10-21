var emap = emap || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 200;
var switchWidth = 5;
var boxSize = {};

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, 150);
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
}

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
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
}

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}