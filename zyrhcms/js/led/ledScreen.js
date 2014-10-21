/*
	参数说明：
	strContent:文字内容
	screenType:屏的类型（3、4、5）
	indent:首行缩进文字字符个数
*/
function LEDScreen(strContent, rows, cols, indent){
	//if(strContent.trim() == '') return null;
	this.pageIndex = 0;
	this.pageSize = 0;
	this.pageCount = 0;
	//中文是否跨列
	this.isCrossCols = false;
	//中文是否跨行
	this.isCrossLine = false;
	this.arrContent = this.getContentArray(strContent);
	this.arrResult = this.fillScreen(this.arrContent, rows, cols, indent);
}

LEDScreen.prototype.getSize = function(rows, cols){
	return rows * cols * 2;
};

LEDScreen.prototype.getContentArray = function(strContent){
	//按回车换行将字符串分割成一维数组
	var arrContent = strContent.split(/\n|\r\n/g);
	//for(var i=0; i<arrContent.length; i++){
	for(var i=0,c=arrContent.length; i<c; i++){
		//清除每个数组元素中文字内容的开头结尾的空格
		arrContent[i] = arrContent[i].trim();
	}
	return arrContent;
};

LEDScreen.prototype.isChinese = function(str){
	return str.charCodeAt(0) > 127 || str.charCodeAt(0) == 94;
};

LEDScreen.prototype.getRows = function(len, cols){
	return len % (cols*2) > 0 ? parseInt(len / (cols*2),10) + 1 : parseInt(len / (cols*2),10);
};

LEDScreen.prototype.isChinese = function(str){
	if(str == undefined){
		return 0;
	}	
	return str.charCodeAt(0) > 127 || str.charCodeAt(0) == 94;
};
	
LEDScreen.prototype.getDataCount = function(arrContent){
    var total = 0;
	for(var i=0,c=arrContent.length; i<c; i++){
		total += this.isChinese(arrContent[i]) ? 2 : 1;
	}
	return total;
};

LEDScreen.prototype.getPageCount = function(dataCount, pageSize){
	return parseInt(dataCount / pageSize, 10) + ( dataCount % pageSize == 0 ? 0 : 1);
};

LEDScreen.prototype.fillScreen = function(arrContent, screenRows, screenCols, indent){
	var arrResult = [];
	var idx = 0;
	var strSpace = '&nbsp;'; // ' '; //发送到电子屏设备需要将  &nbsp; 替换成 空格 ' '
	indent = parseInt(indent, 10);
	for(var i=0,c=arrContent.length; i<c; i++){
		var arrParagraph = [];
		var num = 0;
		//计算每段文字所占行数
		var len = indent + arrContent[i].len();
		var rows = this.getRows(len, screenCols);
		var size = rows * screenCols * 2;
		var curSize = 0;

		//将每个段落中的文字分割成一个数组，每个数组单元存储一个中文或英文字符
		var chars = arrContent[i].split('');
		//填充首行缩进空格
		for(var n=0; n<indent; n++){
			arrResult[idx++] = strSpace;
		}
		curSize += indent;

		//解决中文跨行跨列问题
		for(var j=0,m=chars.length; j<m; j++){
			if(curSize % (screenCols*2) == 0){
				curSize = 0;
			}
			var curChar = chars[j];
			if(this.isChinese(curChar) && (!this.isCrossCols ? curSize % 2 > 0 : !this.isCrossCols ? curSize == screenCols*2 -1 : false) ){
				//中文跨列或跨行，向后移动一个字符，即插入一个空格
				arrResult[idx++] = strSpace;
				//字符长度+1，重新计算行数及段落字符数
				len++;
				curSize ++;
				rows = this.getRows(len, screenCols);
				size = rows * screenCols * 2;
			}
			arrResult[idx++] = curChar;
			curSize += this.isChinese(curChar) ? 2 : 1;
		}
		if(i<c-1){
			for(var t = size-len; t>0; t--){
				arrResult[idx++] = strSpace;
			}
		}
	}
	return arrResult;
};

LEDScreen.prototype.splitScreen = function(arrContent, pageSize){

};

LEDScreen.prototype.getStartEnd = function(arrContent, start, end){
	var pos = 0;
	var c = arrContent.length;
	for(var i=0; i<c; i++){
		if(pos >= start){
			start = i;
			break;
		}
		pos += this.isChinese(arrContent[i]) ? 2 : 1;
	}
	for(var i=start; i<c; i++){
		if(i == c-1){
			end = i + 1;
		} else if(pos >= end){
			end = i;
			break;
		}
		pos += this.isChinese(arrContent[i]) ? 2 : 1;
	}
	return [start, end];
};