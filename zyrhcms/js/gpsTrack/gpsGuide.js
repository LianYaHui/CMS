cms.gpsguide = cms.gpsguide || {};
    
$(window).load(function(){
    setBodySize();
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-12-22',maxDate:maxdate,dateFmt:'yyyy-MM-dd'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-12-22',maxDate:maxdate,dateFmt:'yyyy-MM-dd'});
    });
    
    if(module.checkUserIsFounder()){
        cms.gpsguide.getGpsGuide();
    }
});

$(window).unload(function(){
    if(!cms.util.isTop()){
        //alert('子窗体');
        
    }
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    var formH = 120;
    if(bodySize.width < 278){
        formH = 120;
    } else if(bodySize.width < 468){
        formH = 90;
    } else {
        formH = 60;
    }
    $('#divForm').height(formH);
    $('#divGuide').height(bodySize.height - formH);
};

cms.gpsguide.getGpsGuide = function(){
    var devCode = $('#txtDevCode').val().trim();
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var showType = cms.util.$('chbType').checked ? 1 : -1;
    var dtStart = startTime.toDate();
    var dtEnd = endTime.toDate();
    var days = dtEnd.dateDifference(dtStart);
    
    if(module.checkUserIsFounder()){
        if(days > 365){
            cms.box.alert({title:'提示',html:'时间间隔不得超过365天。'});
            return false;
        }
    } else if(module.checkUserIsAdmin()){
        if(days > 90){
            cms.box.alert({title:'提示',html:'时间间隔不得超过90天。'});
            return false;
        }
    } else if(days > 31){
        cms.box.alert({title:'提示',html:'时间间隔不得超过31天。'});
        return false;
    }
    
    var urlparam = 'action=getDeviceGpsGuide&devCode=' + devCode + '&startTime=' + startTime + '&endTime=' + endTime + '&showType=' + showType;

    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/ajax/gps.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }            
            var jsondata = data.toJson();//eval('(' + data + ')');
            if(jsondata.result == 1){
                cms.gpsguide.showGpsGuide(jsondata.list);
            } else {
                if(module.checkOvertime(jsondata.error)){
                    module.showOvertime();
                } else {
                    cms.box.alert({title:'错误信息', html: jsondata.error});
                }
            }
            
            delete strData;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
};

cms.gpsguide.showGpsGuide = function(dateList){
    var strHtml = '';
    var strDevCode = $('#txtDevCode').val().trim();
    var hasDev = strDevCode != '';
    var hasGps = false;
    if(0 == dateList.length){
        strHtml += '&nbsp;没有找到有GPS轨迹记录的日期';
    } else {
        strHtml += '<ul>';
        for(var i=0,c=dateList.length; i<c; i++){
            hasGps = parseInt(dateList[i][1]) > 0;
            strHtml += '<li' + (hasGps ? ' style="background:#008000;color:#fff;"' : '')
                + ' ondblclick="cms.gpsguide.setGpsTime(\'' + dateList[i][0] + '\');' + (hasGps ? 'cms.gpsguide.showDevList(\'' + dateList[i][0] + '\');' : '') + '">'
                + dateList[i][1] + '<br />' + dateList[i][0]
                + '</li>';
        }
        strHtml += '</ul>';
    }
    cms.util.$('divGuide').innerHTML = strHtml;
};

cms.gpsguide.setGpsTime = function(strDate){
    if(!cms.util.isTop()){
        parent.setGpsTime(strDate);
    }
};

cms.gpsguide.showDevList = function(strDate){
    var config = {
        id: 'pwGpsDevList1',
        title: '设备GPS统计 - ' + strDate,
        html: cms.util.path + '/modules/gpsTrack/guideList.aspx?date=' + strDate,
        requestType: 'iframe',
        width: 410,
        height: 280,
        lock: true,
        noBottom: true,
        maxAble: true,
        showMinMax: true
    };
    cms.box.win(config);
};