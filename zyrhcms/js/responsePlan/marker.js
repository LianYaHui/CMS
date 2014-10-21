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
	if(this.image_ != null){
		var img = document.createElement("img"); //创建图片元素   
		img.src = this.image_;
		if(this.imagegSize != null && this.imageSize != undefined){
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
    if(this.imagegSize != null && this.imageSize != undefined){
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
        if (this.div_.style.visibility == "hidden") {
            this.show();
        } else {
            this.hide();
        }
    }
}
