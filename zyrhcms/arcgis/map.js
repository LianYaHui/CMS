function callMapFunction(action, jsondata){
    try{
        var obj = document.getElementById("index");
        if(null == obj){
            return false;
        }
        switch (action) {
		    case "createMarker":	//创建标记点
                obj.DrawPoints(jsondata);
                break;
		    case "createLine":		//创建直线
                obj.DrawLines(jsondata);
                break;
            case "showMarker":		//显示标记点
                obj.CloseDrawPoints(jsondata);
                break;
            case "showLine":		//显示直线
                obj.CloseDrawLines(jsondata);
                break;
            case "measure":	
            case "draw":			//测量
                obj.systemtext('draw', null);
                break;
		    case "layer":			//图层控制
                obj.systemtext('LayerListWidget', null);
			    break;	
		    case "print":			//地图打印
                obj.systemtext('PrintWidget', null);
			    break;	
            case "point":			//单点定位
                obj.Searchlocation(jsondata);
                break;
            case "multiPoint":		//多点定位
                obj.drawLayerByInfo(jsondata);
                break;
            case "tc":				//消息窗
                obj.infowindow(jsondata);
                break;
		    case "location":		//GPS定位
                obj.gpsLocationByJWD(jsondata);
                break;
            default: alert('出错啦')
                break;
        }
    }catch(e){}
    return true;
}

/*
设置地图中心点和缩放级别
缩放级别：0 - 6
若lat,lng 不为空，而zoom为''，表示以当前缩放等级设置中心点；
若lat,lng 为''，而zoom不为空，表示以当前中心点缩放等级；
若lat,lng,zoom 都不为空，表示设置中心点并缩放到相应的缩放级别
*/
function setCenterZoom(lat, lng, zoom){
    try{
        var obj = document.getElementById("index");
        if(obj != null){
	        var x = lat == undefined ? '' : ('' + lng);
	        var y = lng == undefined ? '' : ('' + lat);
	        var z = zoom == undefined ? '' : ('' + zoom);
            if(null == obj){
                return false;
            }
            obj.SetCenZoom(x, y, zoom);
	        return true;
        } else {
            return false;
        }
    }catch(e){}
	return true;
}

function setCenter(lat, lng){
	return setCenterZoom(lat, lng, '');
}

function setZoom(zoom){
	return setCenterZoom('', '', zoom);
}