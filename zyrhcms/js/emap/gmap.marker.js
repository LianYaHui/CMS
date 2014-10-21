function LabelMarker(latLng, map, options){
    this.latLng = latLng;
    this.map = map;
    this.options = options || {};
    this.id = null;
    this.func = null;
    this.param = null;
    this.image = this.options.image || null;
    this.label = this.options.label || null;
    
    this.div_ = null;
    this.img_ = null;
    this.lbl_ = null;
    
    if(this.image != null && this.image.style == undefined && this.image.width == undefined){
        this.image.style = {width: '20px', height: '34px'};
    }
    if(this.label != null && this.label.style == undefined){
        this.label.style = {};
    }
    this.setMap(map);
};

LabelMarker.prototype = new google.maps.OverlayView();

LabelMarker.prototype.onAdd = function(){
    var _ = this;
    _.id = _.options.id;
    _.func = _.options.func || null;
    _.param = _.options.param;
    
    var div = _.div_ = document.createElement('div');
    div.style.border = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    div.style.top = '0px';
    div.style.left = '0px';
    
    google.maps.event.addDomListener(div, 'click', function(event) {
        google.maps.event.trigger(_, 'click', event);
    });
    
    if(_.image != null){
        var img = _.img_ = document.createElement('img');
        img.src = _.image.src;
        img.title = _.image.title || '';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.cursor = 'pointer';
        img.style.display = img.display || img.style.display || 'block';
        div.appendChild(img);
    }
    if(_.label != null){
        var label = _.lbl_ = document.createElement('span');
        label.innerHTML = _.label.text || _.label.html;
        label.style.position = 'absolute';
        label.style.display = label.style.display || 'block';
        label.style.textAlign = 'left';
        label.style.padding = '0 3px';
        label.style.fontSize = '12px';
        label.style.background = _.label.style.background || '#fff';
        label.style.border =  _.label.style.border || 'solid 1px #99bbe8';
        label.style.color = _.label.style.color || '#000';
        
        if(_.label.style.left == undefined && this.img_ != null){            
            var size = _.getImageSize();
            label.style.left = (size.width / 2) + 'px';
        } else {
            label.style.left = _.label.style.left || '0px';
        }
        if(_.label.style.top != undefined){
            label.style.top = _.label.style.top;
        }
        label.style.lineHeight = '18px';
        label.style.cursor = _.label.style.cursor || 'default';
                
        div.appendChild(label);
    }
    
    var panes = _.getPanes();
    panes.overlayImage.appendChild(div);
    //panes.overlayLayer.appendChild(div);
};

LabelMarker.prototype.getImageSize = function(){
    var size = {width: 0, height: 0};
    try{
        if(this.image != null){
            if(this.image.style.width != undefined && this.image.style.height != undefined){
                size = {width: parseInt(this.image.style.width, 10), height: parseInt(this.image.style.height, 10)};
            } else if(this.image.width != undefined && this.image.height != undefined){
                size = {width: parseInt(this.image.width, 10), height: parseInt(this.image.height, 10)};
            } else {
                size = {width: 20, height: 34};
            }
        }
    }catch(e){}
    return size;
};

LabelMarker.prototype.setLabel = function(strHtml, style){
    if(this.lbl_ != null){
        this.lbl_.innerHTML = strHtml;
    }
};

LabelMarker.prototype.setIcon = function(strIcon, style){
    if(this.img_ != null){
        this.img_.src = strIcon;
    }
};

LabelMarker.prototype.setLocation = function(latLng, style){
    this.latLng = latLng;
    this.draw;
};

LabelMarker.prototype.draw = function() {
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.latLng);
    var size = this.getImageSize();
    this.div_.style.left = (position.x - size.width / 2) + 'px';
    this.div_.style.top = (position.y - size.height) + 'px';
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
        if ("hidden" == this.div_.style.visibility) {
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
        this.setMap(this.map);
    }
};