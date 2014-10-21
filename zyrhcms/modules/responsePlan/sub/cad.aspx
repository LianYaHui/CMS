<%@ Page Language="C#" AutoEventWireup="true" CodeFile="cad.aspx.cs" Inherits="modules_responsePlan_sub_cad" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>JS网页图片查看器－可控制图片放大缩小还原移动效果</title>
<style type="text/css">
body { font-family: "Verdana", "Arial", "Helvetica", "sans-serif"; font-size: 12px; line-height: 180%; }
td { font-size: 12px; line-height: 150%; }
</style>
<script type="text/javascript">
var drag = 0;
var move = 0;
// 拖拽对象
var ie = document.all;
var nn6 = document.getElementById && !document.all;
var isdrag = false;
var y, x;
var oDragObj;

function moveMouse(e) {
    if (isdrag) {
        oDragObj.style.top = (nn6 ? nTY + e.clientY - y: nTY + event.clientY - y) + "px";
        oDragObj.style.left = (nn6 ? nTX + e.clientX - x: nTX + event.clientX - x) + "px";
        return false;
    }
    
    //alert(oDragObj.style.top + ',' + oDragObj.style.left);
}

function initDrag(e) {
    var oDragHandle = nn6 ? e.target: event.srcElement;
    var topElement = "HTML";
    while (oDragHandle.tagName != topElement && oDragHandle.className != "dragAble") {
        oDragHandle = nn6 ? oDragHandle.parentNode: oDragHandle.parentElement;
    }
    if (oDragHandle.className == "dragAble") {
        isdrag = true;
        oDragObj = oDragHandle;
        nTY = parseInt(oDragObj.style.top + 0);
        y = nn6 ? e.clientY: event.clientY;
        nTX = parseInt(oDragObj.style.left + 0);
        x = nn6 ? e.clientX: event.clientX;
        document.onmousemove = moveMouse;
        return false;
    }
}

document.onmousedown = initDrag;
document.onmouseup = new Function("isdrag=false");

function clickMove(s) {
    if (s == "up") {
        dragObj.style.top = parseInt(dragObj.style.top) + 100;
    } else if (s == "down") {
        dragObj.style.top = parseInt(dragObj.style.top) - 100;
    } else if (s == "left") {
        dragObj.style.left = parseInt(dragObj.style.left) + 100;
    } else if (s == "right") {
        dragObj.style.left = parseInt(dragObj.style.left) - 100;
    }

}

function smallit() {
    var height1 = images1.height;
    var width1 = images1.width;
    images1.height = height1 / 1.2;
    images1.width = width1 / 1.2;
    alert(images1.width + ',' + images1.height);
}

function bigit() {
    var height1 = images1.height;
    var width1 = images1.width;
    images1.height = height1 * 1.2;
    images1.width = width1 * 1.2;
    alert(images1.width + ',' + images1.height);
}

function realsize() {
    images1.height = images2.height;
    images1.width = images2.width;
    block1.style.left = 0;
    block1.style.top = 0;

}
function featsize() {
    var width1 = images2.width;
    var height1 = images2.height;
    var width2 = 360;
    var height2 = 200;
    var h = height1 / height2;
    var w = width1 / width2;
    if (height1 < height2 && width1 < width2) {
        images1.height = height1;
        images1.width = width1;
    } else {
        if (h > w) {
            images1.height = height2;
            images1.width = width1 * height2 / height1;
        } else {
            images1.width = width2;
            images1.height = height1 * width2 / width1;
        }
    }
    block1.style.left = 0;
    block1.style.top = 0;
}

/*鼠标滚动事件 */  
var wheel = function(event) {
	var delta = 0;
	if (!event) /* For IE. */  
		event = window.event;
	if (event.wheelDelta) { /* IE/Opera. */  
		delta = event.wheelDelta / 120;
	} else if (event.detail) {
		delta = -event.detail / 3;
	}
	if (delta)  
		handle(delta);
	if (event.preventDefault)  
		event.preventDefault();
	event.returnValue = false;
}  

if (window.addEventListener) {  
	/** DOMMouseScroll is for mozilla. */  
	window.addEventListener('DOMMouseScroll', wheel, false);
} 
window.onmousewheel = document.onmousewheel = wheel;

var handle = function(delta) {  
	var random_num = Math.floor((Math.random() * 100) + 50);
	if (delta < 0) {  
		//alert("鼠标滑轮向下滚动：" + delta + "次！"); // 1  
		smallit();
		//$("btn_next_pic").onclick(random_num);
		return;
	} else {  
		//alert("鼠标滑轮向上滚动：" + delta + "次！"); // -1  
		bigit();
		//$("btn_last_pic").onclick(random_num);
		return;
	}  
}
</script>
</head>
<body>
    <div id="Layer1" style="position:absolute; top:0; left:0; z-index:9999;">
        <table border="0" cellspacing="2" cellpadding="0">
            <tr>
                <td>
                    &nbsp;
                </td>
                <td>
                    <img src="<%=strPicDir%>/up.gif" width="20" height="20" style="cursor:hand" onclick="clickMove('up')" title="向上">
                </td>
                <td>
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    <img src="<%=strPicDir%>/left.gif" width="20" height="20" style="cursor:hand" onclick="clickMove('left')" title="向左">
                </td>
                <td>
                    <img src="<%=strPicDir%>/zoom.gif" width="20" height="20" style="cursor:hand" onclick="realsize();" title="还原">
                </td>
                <td>
                    <img src="<%=strPicDir%>/right.gif" width="20" height="20" style="cursor:hand" onclick="clickMove('right')" title="向右">
                </td>
            </tr>
            <tr>
                <td>
                    &nbsp;
                </td>
                <td>
                    <img src="<%=strPicDir%>/down.gif" width="20" height="20" style="cursor:hand" onclick="clickMove('down')" title="向下">
                </td>
                <td>
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    &nbsp;
                </td>
                <td>
                    <img src="<%=strPicDir%>/zoom_in.gif" width="20" height="20" style="cursor:hand" onclick="bigit();" title="放大">
                </td>
                <td>
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    &nbsp;
                </td>
                <td>
                    <img src="<%=strPicDir%>/zoom_out.gif" width="20" height="20" style="cursor:hand" onclick="smallit();" title="缩小">
                </td>
                <td>
                    &nbsp;
                </td>
            </tr>
        </table>
    </div>
    <br />
	<div id='hiddenPic' style='position:absolute; left:0px; top:0px; width:0px; height:0px; z-index:1; visibility: hidden;'>
		<img id="images2" name='images2' src='<%=strPicDir%>/01.jpg' border='0' width="1280px" />
	</div>
	<div id='block1' onmouseout='drag=0' onmouseover='dragObj=block1; drag=1;' style='z-index:10; height: 0; left: 0px; position: absolute; top: 0px; width: 0' class="dragAble">
		<img id="images1" name='images1' src='<%=strPicDir%>/01.jpg' border='0' width="1280px" ondblclick="bigit();"  />
	</div>
</body>

</html>