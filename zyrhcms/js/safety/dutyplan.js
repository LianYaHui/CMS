safety.dutyplan = safety.dutyplan || {};
safety.dutyplan.isDebug = true;

safety.dutyplan.getDutyPlan = function(){
    var strStartTime = '';
    var strEndTime = '';
    var urlparam = 'action=getDutyPlan' + '&startTime=' + strStartTime + '&endTime=' + strEndTime;
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/controlcenter.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(safety.dutyplan.isDebug){
                var jsondata = {
                    result:1,wsResult:{result:1,error:'这是81平台本地测试的数据'},list:[
                        {id: '100', typeId: '1', workDate:'',workPlace:'{010105,武汉北供电车间,30.762627,114.320172}'},
                        {id: '101', typeId: '2', workDate:'',workPlace:'{01010602,江岸西网工区,30.638946,114.315686,1370}'},
                        {id: '102', typeId: '1', workDate:'',workPlace:'{01010607,汉口变电工班,    , }'},
                        {id: '102', typeId: '1', workDate:'',workPlace:'{01010505,孝感网工区,30.957632,113.92563}'}
                    ]
                };
                safety.dutyplan.showDutyList(jsondata.list);
            } else {
                try{
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    } else {
                        var jsondata = data.toJson();//eval('(' + data + ')');
                        if(jsondata.result == 1){
                            if(jsondata.wsResult.result == 1){
                                safety.dutyplan.showDutyList(jsondata.list);
                            } else {
                                //alert('获取施工计划信息失败。\r\nWebService接口返回数据如下：\r\n' + jsondata.wsResult.error);
                                cms.box.alert({id: boxId, title: '错误信息', html: '获取值班计划信息失败。\r\nWebService接口返回数据如下：<br />' + jsondata.wsResult.error, zindex: 21000});
                            }
                        } else {
                            //alert(jsondata.error);
                            cms.box.alert({id: boxId, title: '错误信息', html: '获取值班信息信息失败。错误信息如下：<br />' + jsondata.error, zindex: 21000});
                        }
                    }
                } catch(ex){
                    //alert('获取施工信息信息失败。错误信息如下：\r\n' + data);
                    cms.box.alert({id: boxId, title: '错误信息', html: '获取值班信息信息失败。错误信息如下：<br />' + data, zindex: 21000});
                }
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.dutyplan.showDutyPlan = function(){
    safety.dutyplan.getDutyPlan();
};

safety.dutyplan.parseEventPlace = function(workPlace){
    var arrItem = workPlace.replace('{','').replace('}','').split(',');
    var c = arrItem.length;
    
    var place = {code:'', name:'',lat: '', lng: '', planId: ''};
    if(c > 0){
        place.code = arrItem[0].trim();
    }
    if(c > 1){
        place.name = arrItem[1].trim();
    }
    if(c > 2){
        place.lat = arrItem[2].trim();
    }
    if(c > 3){
        place.lng = arrItem[3].trim();
    }
    if(c > 4){
        place.planId = arrItem[4].trim();
    }
    return place;    
};

safety.dutyplan.showDutyList = function(dataList){
    var c = dataList.length;
    if(c > 0){
        var arrMarkerDataList = [];
        var strIcon = cms.util.path + '/skin/default/images/safety/';
        for(var i=0,c=dataList.length; i<c; i++){
            var dr = dataList[i];
            if('' != dr.typeId){
                var workPlace = dr.workPlace;
                var type = parseInt(dr.typeId, 10);
                if('' != workPlace){
                    var arrPlace = workPlace.split('},{');
                    for(var j=0; j<arrPlace.length; j++){
			            var place = safety.dutyplan.parseEventPlace(arrPlace[j]);
			            if(place.lat != '' && place.lng != ''){
			                arrMarkerDataList.push({
                                id: dr.id + '_' + place.code + '_' + (type == 1 ? place.code : place.planId),
                                name: place.name + (type == 1 ? '（值班）' : '（跟班）'),
                                action: (type == 1 ? 'dutyplan' : 'workplan'),
                                lat: place.lat,
                                lng: place.lng,
                                icon: strIcon + 'user_24.swf'
                            })
                        }
		            }	
                }
            }
        }        
        
        var markerDataList = oamap.buildMarkerData(arrMarkerDataList, 'dutyplan', true);
        if(markerDataList != '[]'){
            oamap.createMarker({id: 'dutyplan', scale:oamap.scale}, markerDataList);
            
            safety.workplan.arrMarkerId.push('dutyplan');
        }
    } else {
        cms.box.alert({title: '错误信息', html: '没有获取到今日值班跟班计划'});    
    }
};