var updateControlValue = function(eid, step, sub, isClose, dialogResult, strResult, isAppend, isAppendPrefix){
    if(top.location != self.location){
        parent.flowControl.updateControlValue(eid, step, sub, isClose, dialogResult, strResult, isAppend, isAppendPrefix);
    }
};

var getRailwayLine = function(ddl){
    cms.util.clearOption(ddl, 1);
    var urlparam = 'action=getRailwayLine';
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(data){},
        success: function(data){
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            }
            var jsondata = eval('(' + data + ')');
            if(1 == jsondata.result){
                var list = jsondata.list;
                for(var i=0; i<list.length; i++){
                    cms.util.fillOption(ddl, list[i].id, list[i].name);
                }
            } else {
                cms.box.alert({title: '错误信息', html: jsondata.error});
            }
            delete data;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
    });
};

var getRailwayStation = function(lineId, keywords, ddl, ddl1){
    cms.util.clearOption(ddl, 1);
    if(ddl1 != undefined){
        cms.util.clearOption(ddl1, 1);
    }
    var urlparam = 'action=getStationList&keywords=' + escape(keywords) + '&lineIdList=' + lineId + '&typeIdList=';
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(data){},
        success: function(data){
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            }
            var jsondata = eval('(' + data + ')');
            if(1 == jsondata.result){
                var list = jsondata.list;
                for(var i=0; i<list.length; i++){
                    cms.util.fillOption(ddl, list[i].id + '_' + list[i].name, list[i].name);
                    if(ddl1 != undefined){
                        cms.util.fillOption(ddl1, list[i].id + '_' + list[i].name, list[i].name);
                    }
                }
            } else {
                cms.box.alert({title: '错误信息', html: jsondata.error});
            }
            delete data;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
    });
};

