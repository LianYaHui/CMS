function callfunction(sstname, jsondata) {
    switch (sstname) {
        case "测量工具":
            document.getElementById("index").systemtext('draw', null);
            break;
        case "单点定位":
            document.getElementById("index").Searchlocation(jsondata);
            break;
        case "多点绘制":
            document.getElementById("index").drawLayerByInfo(jsondata);
            break;
        case "tc":
            document.getElementById("index").infowindow(jsondata);
            break;			
			 case "点显示":
            document.getElementById("index").DrawPoints(jsondata);
            break;
			 case "线显示":
            document.getElementById("index").DrawLines(jsondata);
            break;
			 case "GPS定位":
            document.getElementById("index").gpsLocationByJWD(jsondata);
              break;
           case "点显示开关":
            document.getElementById("index").CloseDrawPoints(jsondata);        
            break;
           case "线显示开关":
            document.getElementById("index").CloseDrawLines(jsondata);        
            break;
        default: alert('出错啦')
            break;
    }
}

function SetCenZoom(x,y,z)
{
    document.getElementById("index").SetCenZoom(x,y,z);
} 
