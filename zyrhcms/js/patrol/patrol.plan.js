cms.patrol = cms.patrol || {};
cms.patrol.plan = cms.patrol.plan || {};

var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 920;
//滚动条宽度
var scrollBarWidth = 18;

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 240;
    }
    if(parent.cms.patrol.setBodyShow != undefined){
        parent.cms.patrol.setBodyShow(true);
    }
    setBodySize();    
        
    initialForm();
});

$(window).resize(function(){
    setBodySize();
});

var initialForm = function(){

}

var setBodySize = function(){
    boxSize = cms.util.getBodySize();
    $('#mainContent').width(boxSize.width);
    $('#mainContent').height(boxSize.height - 25);
    
    setBoxSize();
}

var setBoxSize = function(){
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);
    }
    $('.listbox').height(boxSize.height - 25*2 - 28);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25*2 - 28 - 23 -10);
    
    setListBoxSize();
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
}

var setListBoxSize = function(){
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    }
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
}

var loadData = function(){
    pageIndex = pageStart;
    //getCaptureInfo();
}

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
}

var setParam = function(param){
    $('#txtDevUnitId').attr('value', param.unitId);
    $('#txtDevCode').attr('value', param.devCode);
}