function Calendar(year, month, date){
	var dt = null;
	if(year != undefined && month != undefined && date != undefined){
		year = parseInt(year, 10);
		month = parseInt(month, 10);
		date = parseInt(date, 10);	
	} else {
	    if(year == undefined){
            dt = new Date();
        } else if(typeof year == 'string' && year.length == 10){
		    dt = new Date(Date.parse(year.replace(/-/g,"/")));
	    }
	    year = dt.getFullYear();
	    month = dt.getMonth() + 1;
	    date = dt.getDate();
	}    
	this.dateTime = [year, month, date];

	var daysInYear = this.calculateDaysInYear(year, month, date);
	var monthDays = this.monthDays(month, year);

	var yearFirstWeekDay = this.dateWeek(year + '-01-01');
	var monthFirstWeekDay = this.dateWeek(year + '-' + month + '-01');

	var curWeekDay = daysInYear % 7 + yearFirstWeekDay - 1;
	if(curWeekDay == 7){
		curWeekDay = 0;
	}

	this.firstWeekDay = monthFirstWeekDay;
	this.arrDate = [];
	var wd = monthFirstWeekDay;
	for(var i=1; i<=monthDays; i++){
		if(wd >= 7){
			wd = 0;
		}
		this.arrDate.push([i, wd]);
		wd++;
	}
}

Calendar.prototype.initial = function(){

};

Calendar.prototype.show = function(obj){
	var _ = this;	
	var arrDay = ['日','一','二','三','四','五','六'];
	
	var strHtml = '<div class="cbox">'
	strHtml += '<table class="tbc" style="width:100%;height:100%;"><tr class="tbrh">';
	for(var i=0; i<arrDay.length; i++){
		strHtml += '<td>' + arrDay[i] + '</td>';
	}
	strHtml += '</tr>';
	strHtml += '<tr>';
	var n = 0;
	for(var i=0; i<_.firstWeekDay; i++){
		if(n % 7 == 0 && n > 0){
			strHtml += '</tr><tr>';
		}
		strHtml += '<td>' + '</td>';
		n++;
	}
	for(var i=0; i<_.arrDate.length; i++){
		if(n % 7 == 0 && n > 0){
			strHtml += '</tr><tr>';
		}
		strHtml += '<td>';
		if(_.arrDate[i][0] == _.dateTime[2]){
			strHtml += '<span style="background:#0054e3;color:#fff;">';
		} else if(_.arrDate[i][1] == 0){
			strHtml += '<span style="color:#f00;">';
		}
		strHtml += _.arrDate[i][0];
		strHtml += '</span>';
		strHtml += '</td>';
		n++;
	}
	strHtml += '</tr></table>';
	strHtml += '</div>';
	if(obj != undefined && typeof obj == 'object'){
		obj.innerHTML = strHtml;
	}
	return strHtml;
};

Calendar.prototype.build = function(){

};

Calendar.prototype.leapYear = function(year){
	return  (year / 4 == 0 && year / 100 != 0 ) || year % 400 == 0;
};

Calendar.prototype.monthDays = function(month, year){
	return (month == 4 || month == 6 || month == 9 || month == 11) ? 30 : (month == 2) ? 28 + (this.leapYear(year) ? 1 : 0) : 31;
};

Calendar.prototype.yearDays = function(year){
	return 365 + (this.leapYear(year) ? 1 : 0);
};

Calendar.prototype.calculateDaysInYear = function(year, month, date){
	var days = 0;
	for(var i=1; i<month; i++){
		days += this.monthDays(i, year);
	}
	return days + date;
};

Calendar.prototype.dateWeek = function(date){
	var dt = new Date(Date.parse(date.replace(/-/g,"/")));
	return dt.getDay();
};