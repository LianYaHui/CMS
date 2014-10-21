var safety = safety || {};
safety.accident = safety.accident || {};
safety.accident.events = [];
safety.accident.arrProcess = [];
safety.accident.pwAccident = null;
safety.accident.pwAccidentEditSuccess = false;
safety.accident.pwProcessControl = [];

safety.accident.showAccidentList = function(isAutoClose){
    var size = [360, 240];
    var strHtml = '<div id="divAccident" style="height:' + (size[1] - 25 - 30) + 'px;overflow:auto;"></div>'
        + '<div id="divAccidentForm" class="statusbar statusbar-h30" style="padding:0;">'
        + '<div style="padding:3px 5px 0;">'
        + '<a class="btn btnc24" onclick="safety.accident.addEvent();"><span>新建事件</span></a>'
        + '</div>'
        + '</div>';
    var config = {
        id: 'pwAccident',
        title: '故障事件',
        html: strHtml,
        width: size[0],
        height: size[1],
        noBottom: true,
        closeType: 'hide',
        build: 'show',
        rebuild: false,
        lock: false,
        zindex: 10002,
        topMost: false,
        position: 9,
        y: 0
    };
    
    var pwobj = cms.box.win(config);
    
    safety.accident.getEventList();
    
    if(isAutoClose){
        pwobj.Hide();
    }
};

safety.accident.addEvent = function(){
    var strHtml = cms.util.path + '/modules/safety/eventEdit.aspx';
    var config = {
        id: 'pwAccidentEdit',
        title: '新建事件',
        html: strHtml,
        boxType: 'window',
        requestType: 'iframe',
        width: 600,
        height: 450,
        noBottom: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        filter: false,
        callBack: safety.accident.callBack
    };
    
    safety.accident.pwAccident = cms.box.win(config);
    
    if(safety.accident.pwAccidentEditSuccess){
        safety.accident.pwAccident.reload();
        
        safety.accident.pwAccidentEditSuccess = false;
    }
};

safety.accident.callBack = function(){
    safety.accident.getEventList();
    safety.accident.pwAccident.Hide();
};

safety.accident.setEditSuccess = function(isSuccess){
    safety.accident.pwAccidentEditSuccess = isSuccess;
};

safety.accident.callBackProcess = function(pwobj, pwReturn){
    var id = pwReturn.returnValue.id;
    safety.accident.getEventList();
    for(var i=0,c=safety.accident.pwProcessControl.length; i<c; i++){
        if(id == safety.accident.pwProcessControl[i][0]){
            safety.accident.pwProcessControl[i][1].Hide();        
        }
    }
};

safety.accident.getEventList = function(){
    var obj = cms.util.$('divAccident');
    var professionId = -1;
    var lineId = -1;
    var levelId = -1;
    var finished = 0;
    var deleted = -1;
    var urlparam = 'action=getEvent' + '&professionId=' + professionId + '&lineId=' + lineId + '&levelId=' + levelId 
        + '&finished=' + finished + '&deleted=' + deleted;
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/flowcontrol.aspx',
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
            if(1 == jsondata.result){
                safety.accident.buildAccidentList(jsondata.list, obj);
            } else {
                cms.box.alert({title:'提示信息', html:'获取事件信息失败，错误原因:' + jsondata.error});
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.accident.buildAccidentList = function(eventList, obj){
    if(eventList.length > 0){
        var arrMarkerDataList = [];
        var strIcon = cms.util.path + '/skin/default/images/safety/';
        var strHtml = '';
        strHtml += '<div class="listheader">'
            + '<table cellpadding="0" cellspacing="0" class="tbheader">'
            + '<tr>'
            + '<td style="width:25px;">序号</td>'
            + '<td style="text-align:left;padding:0 0 0 3px;width:235px;">故障事件</td>'
            + '<td style="width:35px;">处理</td>'
            + '<td style="width:35px;">详情</td>'
            + '<td></td>'
            + '</tr>'
            + '</table>'
            + '</div>';
        strHtml += '<div class="list" style="height:' + (240-80) + 'px;overflow:auto;">';
        strHtml += '<table cellpadding="0" cellspacing="0" class="tblist">';
        for(var i=0,c=eventList.length; i<c; i++){
            var dr = eventList[i];
            var strOnclick = 'safety.accident.processControl(' + dr.eventId + ',' + dr.professionId + ',' + '\'' + dr.eventName + '\');';
            var strShowDetail = 'safety.accident.showEventDetail(' + dr.eventId + ');';
            strHtml += '<tr>';
            strHtml += '<td style="width:25px;">' + (i + 1) + '</td>';
            strHtml += '<td style="text-align:left;padding:0 0 0 3px;width:235px;">'
                + '<a onclick="' + strOnclick + '">' + cms.util.fixedCellWidth(dr.eventName, 230, true, dr.eventName) + '</a>'
                + '</td>'
                + '<td style="width:35px;"><a onclick="' + strOnclick + '" style="color:#f00;" class="btn btnc22"><span>处理</span></a></td>'
                + '<td style="width:35px;"><a onclick="' + strShowDetail + '">详情</a></td>'
                + '<td></td>';
            
            strHtml += '</tr>';
            
            safety.accident.events.push({id:dr.eventId, pid:dr.professionId, step:0, flowchart: 0, flowcontrol: 0, over: 0});
            
            if(typeof dr.eventPlace == 'object' && dr.eventPlace.length > 0){
                var p = dr.eventPlace[0];
                if(p.lat != '' && p.lng != ''){
                    var strId = p.type == 1 ? p.name + '_' + p.pid : p.code + '_' + p.name;
                    arrMarkerDataList.push({
                        id: strId,
                        name: dr.eventName,
                        action: p.type == 1 ? 'pillar' : 'substation',
                        lat: parseFloat(p.lat, 10),
                        lng: parseFloat(p.lng, 10),
                        icon: strIcon + 'alarm.swf'
                    });
                }
            }            
        }
        strHtml += '</table>';
        strHtml += '</div>';
        
        obj.innerHTML = strHtml;        
        
        var markerDataList = oamap.buildMarkerData(arrMarkerDataList, 'event_point', true);
        if(markerDataList != '[]'){
            oamap.createMarker({id: 'event_point', scale:oamap.scale}, markerDataList);
        }
    } else {
        obj.innerHTML = '没有故障事件信息';
    }
};

safety.accident.showEventDetail = function(eventId){
    var config = {
        id: 'pwAccidentDetail',
        title: '故障事件详情',
        html: cms.util.path + '/modules/safety/eventDetail.aspx?eventId=' + eventId,
        lock: false,
        width: 500,
        height: 400,
        noBottom: true,
        requestType: 'iframe',
        boxType: 'window'
    };
    
    cms.box.win(config);
};

safety.accident.getEvent = function(id){
    for(var i=0,c=safety.accident.events.length; i<c; i++){
        if(safety.accident.events[i].id == id){
            return [i, safety.accident.events[i]];
        }
    }
    return null;
};

safety.accident.showFlowChart = function(id, type){
    var ev = safety.accident.getEvent(id);
    var size = flowControl.config.getChartBoxSize(type);
    var bodySize = cms.util.getBodySize();
    if((size[1] + 38) > bodySize.height){
        size[1] = bodySize.height - 38 - 2;
    }
    
    var strName = (1 == type ? '接触网' : 2 == type ? '变电' : '电力') + '专业' + '应急流程图';
    var strHtml = '<div style="padding:5px 0;background:#dbebfe;">'
        + '<div id="divFlowChart_' + id + '" class="flowchart" style="width:' + (size[0] - 28) + 'px;">'
        //+ '<div style="font-size:14px; line-height:25px;font-weight:bold;text-align:left;">' + strName + '</div>'
        + '</div>'
        + '</div>';
    var config = {
        id: 'pwFlowChart' + id,
        title: strName,
        html: strHtml,
        lock: false,
        width: size[0],
        height: size[1],
        minWidth: 240,
        position: 3,
        x: 0,
        y: 38,
        noBottom: true,
        minAble: true,
        //maxAble: true,
        showMinMax: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        zindex: 10005,
        topMost: false,
        //dragRangeLimit: false,
        filter: false,
        bodyBgColor: '#dbebfe'
    };
    
    var pwbox = cms.box.win(config);
    
    if(0 == ev[1].flowchart){
	    var obj = document.getElementById('divFlowChart_' + id);
        var process = flowControl.getEventProcess(type, id);
	    flowControl.showFlowChart(type, id, obj, process);
	    
	    //记录流程图是否已加载,不重复加载
        safety.accident.events[ev[0]].flowchart = 1;
    }
};

safety.accident.showFlowChartDemo = function(){
    var size = module.checkWinSize(600, 550);
    var strName = '应急流程图';
    var strHtml = cms.util.path + '/modules/safety/flowChart.aspx?' + new Date().getTime();    
    var config = {
        id: 'pwFlowChartDemo',
        title: strName,
        html: strHtml,
        requestType: 'iframe',
        lock: false,
        width: size[0],
        height: size[1],
        noBottom: true,
        //minAble: true,
        maxAble: true,
        showMinMax: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        zindex: 10005,
        topMost: false,
        //dragRangeLimit: false,
        filter: false
    };
    
    var pwbox = cms.box.win(config);
};

safety.accident.processControl = function(id, type, name){
    var ev = safety.accident.getEvent(id);
    safety.accident.events[ev[0]].name = name;
    var picBoxWidth = 1 == type ? 555 : 330;
    var strName = (1 == type ? '接触网' : 2 == type ? '变电' : '电力') + '专业';
    
    var process = flowControl.getEventProcess(type, id);
	flowControl.eventConfig.push({id: id, process: process});
	
    var strHtml = '<div style="padding:0;">'
        + '<div id="divProcessBox_' + id + '" class="flowcontrol" lang="650,525" style="width:525px;float:left;margin-bottom:10px;margin-left:5px;">'
        + '<div style="font-size:14px; line-height:25px;font-weight:bold;">' + strName + '应急流程控制</div>'
        + '<a onclick="flowControl.returnStep(' + id + ',0);" class="btn btnc22"><span>重新开始</span></a>'
        + '<a onclick="safety.accident.showFlowChart(' + id + ',' + type + ');" class="btn btnc22" style="margin-left:10px;"><span>打开流程图</span></a>'
        + '<div id="divProcess_' + id + '" style="margin-top:5px;"></div>'
        + '<div id="divProcessReport_' + id + '" style="margin-top:5px;"></div>'
        + '</div>'
        
        + '<div id="divFlowChart1_' + id + '" title="" class="flowchart" style="width:' + picBoxWidth + 'px;float:right;display:none;">'
        + '<div style="font-size:14px; line-height:25px;font-weight:bold;text-align:left;">' + strName + '应急流程图</div>'
        + '</div>'
        
        + '</div>';
    var bodySize = cms.util.getBodySize();
    var size = [550, 600];
    if((size[1] + 38) > bodySize.height){
        size[1] = bodySize.height - 38 - 2;    
    }
    var config = {
        id: 'pwAccidentProcess' + id,
        title: name,
        html: strHtml,
        lock: false,
        width: size[0],
        height: size[1],
        position: 1,
        x: 0,
        y: 38,
        noBottom: true,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        callBack: safety.accident.callBackProcess,
        returnValue: {id: id},
        callBackByResize: safety.accident.resizeCallBack,
        returnValueByResize: {type: type, id: id},
        closeType: 'hide',
        build: 'show',
        reload: false,
        zindex: 10006,
        topMost: false,
        filter: false
    };
    
    var pwbox = cms.box.win(config);
    safety.accident.pwProcessControl.push([id, pwbox]);
    
    if(0 == ev[1].flowcontrol){
        var process = flowControl.getEventProcess(type, id);
        
        //在单独的窗口中显示流程图
	    safety.accident.showFlowChart(id, type);
	    
	    //记录流程是否已加载,不重复加载
        safety.accident.events[ev[0]].flowcontrol = 1;
        
	    var objProcess = document.getElementById('divProcess_' + id);
		var sid = 0;
		flowControl.processControl(id, sid, objProcess);
    }
};

safety.accident.resizeCallBack = function(winModel, bodySize, returnValue){
    var id = returnValue.id;
    var type = returnValue.type;
	var objChart = document.getElementById('divFlowChart1_' + id);
	var objBox = cms.util.$('divProcessBox_' + id);
	var size = objBox.lang.split(',');
    if(winModel == 'max'){
        objChart.style.display = '';
        var strTitle = (1 == type ? '接触网' : 2 == type ? '变电' : '电力') + '专业' + '应急流程图';
	    if('' == objChart.title){
	        flowControl.showFlowChart(type, id, objChart);
	    }
	    objChart.title = strTitle;
	    
	    objBox.style.width = size[0] + 'px';
    } else {
        objChart.style.display = 'none';
        
	    objBox.style.width = size[1] + 'px';	    
    }
};