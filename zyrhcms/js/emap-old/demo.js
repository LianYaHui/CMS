var emap = emap || {};
var boxSize = {};

$(window).load(function(){
    setBodySize();
    initialForm();
    initialEmap();
});

$(window).resize(function(){
    setBodySize();
});

var initialForm = function(){

}

var setBodySize = function(){
    boxSize = cms.util.getBodySize();
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
}

var setBoxSize = function(){
    $('#mapCanvas').width(boxSize.width);
    $('#mapCanvas').height(boxSize.height);
}

var initialEmap = function(){
    var mapCanvas = cms.util.$('mapCanvas');
    var myLatlng = new google.maps.LatLng(31.69135833,118.27885833);
    var myOptions = {
	    zoom:10,
	    center: myLatlng,
	    mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
	    zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        overviewMapControl: true,
        overviewMapControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },        
	    mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(mapCanvas, myOptions);
    var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: map,
	    title: "Hello World!"
    });
    google.maps.event.addListener(marker, 'click', showWin);
}

var wid = null;
var showWin = function(){
    var config = {
        id: 'pwemapdev',
        title: '设备信息',
        html: '铁路应急预案指挥系统',
        width: 200,
        height: 200,
        noBottom: true,
        position: 5,
        lock: false,
        opacity: 0.95
    };
    wid = cms.box.win(config);
}

var showOrganize = function(){
    var strHtml = '<div class="tabpanel" id="pwtabpanel"></div><div id="listBoxPanel"></div>';
    var tabs = [
        {code: 'preview', name: '视频', load: false},
        {code: 'device', name: '设备', load: false},
        {code: 'history', name: '历史数据', load: false},
        {code: 'user', name: '人员', load: false}
    ];
    var config = {
        id: 'pwemaporg',
        title: '应急预案',
        html: strHtml,
        width: 600,
        height: 450,
        noBottom: true,
        position: 1,
        x: 80,
        y: 50,
        lock: false,
        minAble: true,
        minWidth: 200,
        maxAble: true,
        showMinMax: true,
        opacity: 0.98
    };
    wid = cms.box.win(config);
    
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (i === 0 ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#listBox_' + tabs[i].code + '"><span>' + tabs[i].name + '</span></a>';
        $('#pwtabpanel').append(strTab);
        
        var strHtml = '<div id="listBox_' + tabs[i].code + '" class="listbox" ' + (i === 0 ? '':' style="display:none;"') + '>'
            + tabs[i].name
            + '</div>';
        $('#listBoxPanel').append(strHtml);
    }
       
    cms.jquery.tabs('.tabpanel', null, '.listbox', 'switchTab');
}

var switchTab = function(param){
    
}