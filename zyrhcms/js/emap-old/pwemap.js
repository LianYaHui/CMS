var pwemap = pwemap || {};

var boxSize = {};
pwemap.map = null;
pwemap.maptype = null;
pwemap.latlng = null;
pwemap.mapCenter = null;
var trafficLayer = null;

$(window).load(function(){
    setBoxSize();
    initialForm();
    initialEmap();
});

$(window).resize(function(){
    setBoxSize();
});

var setBoxSize = function(){
    boxSize = cms.util.getBodySize();
    $('#statusBar').height(26);
    $('#mapCanvas').width(boxSize.width);
    $('#mapCanvas').height(boxSize.height-26);
}

var initialForm = function(){
    var param = location.href.getQueryString('param');
    if(param !== null && param !== ''){
        $('#txtLatLng').attr('value', param);
    }
}

var initialEmap = function(){
    var mapCanvas = cms.util.$('mapCanvas');
    latlng = eval('(' + $('#txtLatLng').val() + ')');
    
    var ptxy = new MapCorrect();
    var obj = ptxy.offset(parseFloat(latlng.lat), parseFloat(latlng.lng));
    
    var myLatlng = new google.maps.LatLng(obj.lat,obj.lng);
    var myOptions = {
	    zoom: 14,
	    center: myLatlng,
	    mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT
        },
	    mapTypeId: google.maps.MapTypeId.HYBRID
    }
    pwemap.map = new google.maps.Map(mapCanvas, myOptions);
    
    var mm = new MyMarker(pwemap.map, {latlng:myLatlng,labelText:latlng.name,clickFun:clickFunc});
    var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: pwemap.map,
	    icon: cms.util.path + '/skin/default/images/common/emap/online.png',//'http://labs.google.com/ridefinder/images/mm_20_red.png',
	    title: latlng.name
    });
    google.maps.event.addListener(marker, 'click', function() {
        //map.setCenter(marker.getPosition());
        alert('经纬度：' + marker.getPosition());
        alert('清除文字');
        mm.setMap(null);
    });
    
    google.maps.event.addListener(marker, 'mouseover', function() {
        mm.setMap(pwemap.map);
        
    });
    
    //new USGSOverlay('http://www.google.com/mapfiles/marker_green.png',pwemap.map);
    

    google.maps.event.addListener(pwemap.map, 'maptypeid_changed', function() {
        //alert(pwemap.map.getMapTypeId());
    });
    
    pwemap.mapCenter = pwemap.map.getCenter();
        
    //添加自定义控件
    new HomeControl(pwemap.map, getMapCenter, {name:'HOME',title:'定位到地图中心'});
    
    //交通图层
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(pwemap.map);
}

var getMapCenter = function(){
    return pwemap.mapCenter;
}

var clickFunc = function(){
    alert('1');
}


var pnum = 0;
var createMarker = function(lat, lng){
    var myLatlng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: pwemap.map,
	    title: '标记点' + pnum
    });
    google.maps.event.addListener(marker, 'click', function() {
        //map.setCenter(marker.getPosition());
        alert('经纬度：' + marker.getPosition());
    });
    
    var ptxy = new MapCorrect();
    var obj = ptxy.offset(parseFloat(lat), parseFloat(lng));
    
    var myLatlng1 = new google.maps.LatLng(obj.lat,obj.lng);
    var marker1 = new google.maps.Marker({
	    position: myLatlng1,
	    map: pwemap.map,
	    title: '标记点' + pnum++ + '_校正'
    });
    google.maps.event.addListener(marker1, 'click', function() {
        //map.setCenter(marker1.getPosition());
        alert('校正后的经纬度：' + marker1.getPosition());
    });
}


//添加地图中心控件
function HomeControl(map, mapCenter, text){
    var mapCenterDiv = document.createElement('DIV');
    mapCenterDiv.style.cssText = 'width:40px;height:25px;padding:1px 0 0;line-height:25px;background:#fff;border:solid 1px #717b87;'
        + 'text-align:center;cursor:pointer;font-size:13px;color:#000;font-family:宋体;margin:5px -6px 0 0;'
        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;';
    if(text !== undefined){
        mapCenterDiv.innerHTML = text.name;
        mapCenterDiv.title = text.title;
    } else {
        mapCenterDiv.innerHTML = '中心';
        mapCenterDiv.title = '定位到地图中心';
    }
    mapCenterDiv.onselectstart = function(){return false;} //IE下屏蔽双击选中文字
	mapCenterDiv.unselectable = 'on'; //Opera下屏蔽双击选中文字
    
    google.maps.event.addDomListener(mapCenterDiv, 'click', function() {
        map.setCenter(typeof mapCenter === 'function' ? mapCenter() : mapCenter);
    });
    //将控件添加到顶部右边 （地图类型控件左边）
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapCenterDiv);
}


function MyMarker(map, options) {
    this.latlng = options.latlng; //设置图标的位置
    this.image_ = options.image; //设置图标的图片
    this.imagegSize = options.imagegSize; //图片尺寸
    this.labelText = options.labelText || '标记';
    this.labelClass = options.labelClass || 'shadow'; //设置文字的样式   
    this.clickFun = options.clickFun; //注册点击事件   
    //    this.labelOffset = options.labelOffset || new google.maps.Size(8, -33);   
    this.map_ = map;
    
    this.div_ = null;
    // Explicitly call setMap() on this overlay      
    this.setMap(map);
}

MyMarker.prototype = new google.maps.OverlayView();

MyMarker.prototype.onAdd = function() {   
    var div = document.createElement('DIV'); //创建存放图片和文字的div
    div.style.cssText = 'border:none 0;position:absolute;display:block;';
    
    
    //div.style.cursor = "pointer";
    div.onclick = function(){
        alert('ok');
    } //this.clickFun || function() {}; //注册click事件，没有定义就为空函数   
    // Create an IMG element and attach it to the DIV.     
	if(this.image_ !== null){
		var img = document.createElement("img"); //创建图片元素   
		img.src = this.image_;
		if(this.imagegSize !== null && this.imageSize !== undefined){
            img.style.width = this.imageSize.w + 'px';
            img.style.height = this.imageSize.h + 'px';        
        }
        else{
		    img.style.width = "100%";
		    img.style.height = "100%";        
        }
		div.appendChild(img);
		img.onclick = function(){
		    alert('img');
		}
	}
	
	
	
    //初始化文字标签   
    var label = document.createElement('SPAN'); //创建文字标签   
    label.className = this.labelClass;
    label.innerHTML = '<nobr>' + this.labelText + '</nobr>';
    label.style.position = 'absolute';
    label.style.width = 'auto';
    //  label.style.fontWeight = "bold";   
    label.style.textAlign = 'left';
    label.style.lineHeight = "12px";
    label.style.padding = "2px";
    label.style.fontSize = "12px";
	label.style.border = "solid 1px #96c2f1";
	label.style.background = "#fff";
	label.style.opacity = 0.95;
	label.style.filter = "alpha(opacity=" + 95 + ")";
	label.style.top = '34px';
	label.style.left = '10px';
	label.style.display = 'block';
    //  label.style.fontFamily = "Courier New";   
    label.onclick = function(){
        alert('ok');
    }
    div.appendChild(label);

    this.div_ = div;
    
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
}

//绘制图标，主要用于控制图标的位置   
MyMarker.prototype.draw = function() {   
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.latlng); //将地理坐标转换成屏幕坐标   
    //  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var div = this.div_;
    div.style.left = position.x - 10 + 'px';
    div.style.top = position.y - 34 + 'px';
    if(this.imagegSize !== null && this.imageSize !== undefined){
        alert(this.imageSize.h);
        div.style.width = this.imageSize.w + 'px';
        div.style.height = this.imageSize.h + 'px';
    
    }else{
        //控制图标的大小   
        div.style.width = '20px';
        div.style.height = '34px';
    }
}

MyMarker.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
}
   
MyMarker.prototype.hide = function() {
    alert(this.div_.innerHTML);
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
}
MyMarker.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
}

MyMarker.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility === "hidden") {
            this.show();
        } else {
            this.hide();
        }
    }
}

