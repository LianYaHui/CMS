function LabelMarker(map, options) {
    this.latlng = options.latlng || options.latLng;
    this.image_ = options.image;
    this.labelText = options.labelText || '标记';
    this.labelClass = options.labelClass || 'shadow';
    this.clickFun = options.clickFun;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

LabelMarker.prototype = new google.maps.OverlayView();

//LabelMarker.prototype.onAdd = function() {
//    
//};

LabelMarker.prototype.draw = function() {
    var _ = this;
    var div = this.div_;
    if (!div) {
      // Create a overlay text DIV
        div = this.div_ = document.createElement('DIV');
        div.style.border = "none";
        div.style.borderWidth = "0px";
        div.style.position = "absolute";
        div.style.cursor = "pointer";
        
        var img = document.createElement("img");
        img.src = _.image_;
        img.style.width = "100%";
        img.style.height = "100%";
        div.style.cursor = "pointer";
        div.appendChild(img);
        
        google.maps.event.addDomListener(div, "click", function(event) {
            google.maps.event.trigger(_, "click");
        });
        
        var label = document.createElement('div');
        label.className = _.labelClass;
        label.innerHTML = _.labelText;
        label.style.cssText = 'border:none 0;position:absolute;display:block;overflow:visible;background:#eee;';
        label.style.position = 'absolute';
        label.style.textAlign = 'left';
        label.style.padding = "2px";
        label.style.fontSize = "10px";
                
        div.appendChild(label);
        
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
        //panes.overlayLayer.appendChild(div);
    }
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.latlng);
    div.style.left = position.x - 5 + 'px';
    div.style.top = position.y - 5 + 'px'
//    div.style.width = 30 + 'px';
//    div.style.height = 30 + 'px';
};

LabelMarker.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

LabelMarker.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
};

LabelMarker.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
};

LabelMarker.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility == "hidden") {
            this.show();
        } else {
            this.hide();
        }
    }
};

LabelMarker.prototype.toggleDOM = function() {
    if (this.getMap()) {
        this.setMap(null);
    } else {
        this.setMap(this.map_);
    }
};