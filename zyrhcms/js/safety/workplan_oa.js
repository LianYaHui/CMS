var safety = safety || {};
safety.workplan = safety.workplan || {};

safety.workplan.dataList = null;
safety.workplan.today = new Date().toString('yyyy-MM-dd');
safety.workplan.markers = [];
safety.workplan.htMarker = new cms.util.Hashtable();
safety.workplan.statusTimer = null;

safety.workplan.arrMarkerId = [];
safety.workplan.arrLineId = [];
safety.workplan.boxSize = [];

safety.workplan.arrProfession = [
    ['JCW','接触网'],
    ['BD','变电'],
    ['DL','电力']
];

safety.workplan.arrWorkType = [
    ['', '选择施工类型'],
    ['ZT', '主体施工'],
    ['LY', '临近营业点施工'],
    ['TD', '停电配合施工'],
    ['DW', '点外作业']
];

safety.workplan.arrWorkGrade = [
    ['', '选择施工等级'],
    ['1', '一级'],
    ['2', '二级'],
    ['3', '三级']
];

safety.workplan.showWorkPlan = function(btnId){
    var arrProfession = safety.workplan.arrProfession;
    var strWorkType = cms.util.buildOptions(safety.workplan.arrWorkType, '');
    var strWorkGrade = cms.util.buildOptions(safety.workplan.arrWorkGrade, '');    
    
    var strHtml = '<div style="height:27px;padding-top:1px;" class="operbar">'
        + '<select id="ddlWorkType" class="select" style="margin-left:3px;">' + strWorkType + '</select>'
        + '<select id="ddlWorkGrade" class="select" style="margin-left:3px;">' + strWorkGrade + '</select>'
        + '<span style="float:left;">日期：</span><input id="txtWorkDay" class="txt w70" maxlength="10" value="' + strToday + '" style="margin-left:3px;" onfocus="WdatePicker({skin:\'ext\',minDate:\'2012-01-01 0:00:00\',dateFmt:\'yyyy-MM-dd\'});" />'
        + '<a class="btn btnc22" style="margin-left:3px;" onclick="safety.workplan.getWorkPlan();"><span>查询</span></a>'
        + '</div>';
    strHtml += '<div id="workPlanList">';
    for(var i=0; i<arrProfession.length; i++){
        strHtml += '<div class="operbar" style="height:22px;text-align:left; text-indent:10px;" lang="open">'
            + '<a class="switch sw-' + (i > 0 ? 'close"' : 'open') + '" style="float:right;"></a>'
            + '<span style="margin:0;padding:0;">' + arrProfession[i][1] + '</span>'
            + '<span style="margin:0;padding:0;" id="wpc_' + arrProfession[i][0] + '"></span></div>'
            + '<div ' + (i > 0 ? ' style="display:none;"' : '') + '>'
            + '<div class="listheader">'
            + '<table class="tbheader" cellpadding="0" cellspacing="0">'
            + '<tr>'
            + '<td style="width:25px;">序号</td>'
            + '<td style="width:80px;">班组</td>'
            + '<td style="width:100px;">作业内容</td>'
            + '<td style="width:90px;">作业地点</td>'
            + '<td style="width:75px;">起止时间</td>'
            + '<td style="width:60px;">作业类型</td>'
            + '<td style="width:50px;">施工等级</td>'
            + '<td style="width:50px;">跟班干部</td>'
            + '<td style="width:25px;">状态</td>'
            + '<td></td>'
            + '</tr>'
            + '</table>'
            + '</div>'
            + '<div id="divListBox_' + arrProfession[i][0] + '" class="listbox" style="overflow:auto;">'
            + '<table id="tbList_' + arrProfession[i][0] + '" class="tblist" cellpadding="0" cellspacing="0"></table>'
            + '</div>'
            + '</div>';
    }
    strHtml += '</div>';
    
    var size = [600, 280];
    var obj = $('#' + btnId);
    var pos = [
        obj.offset().left,
        obj.offset().top + obj.height() + 2
    ];
    safety.workplan.boxSize = [600, 280, pos[0], pos[1]];
    
    var config = {
        id: 'pwWorkPlan',
        title: '今日施工安排<span id="timeboard" style="font-weight:normal;line-height:22px;width:200px;float:right;margin-right:40px;"></span>',
        html: strHtml,
        width: size[0],
        height: size[1],
        minAble: true,
        //maxAble: true,
        showMinMax: true,
        minWidth: 360,
        minHeight: 24,
        noBottom: true,
        lock: false,
        closeType: 'hide',
        build: 'show',
        reload: false,
        position: 'custom',
        x: pos[0],
        y: pos[1] - obj.height() - 2,
        zindex: 999
    };
    
    pwWorkPlan = cms.box.win(config);
    
    getDateTime();
    
    for(var i=0; i<arrProfession.length; i++){
        $('#divListBox_' + arrProfession[i][0]).height(size[1] - 29 - 23*3 - 24 - 25);
    }

    $('#workPlanList .operbar').click(function(){
        $("#workPlanList .operbar").next('div').hide();//slideUp('fast');
        $('#workPlanList .operbar a').addClass('switch sw-close');
        $(this).find('a').removeClass();
        $(this).find('a').addClass('switch sw-open');
        $(this).next('div').show();//animate({height: 'toggle', opacity: 'toggle'}, 'slow');
    });
    
    //cms.util.fillOptions(cms.util.$('ddlWorkType'), safety.workplan.arrWorkType, '');
    //cms.util.fillOptions(cms.util.$('ddlWorkGrade'), safety.workplan.arrWorkGrade, '');
    
    safety.workplan.getWorkPlan();
};

safety.workplan.getWorkPlan = function(deptIndexCode, planId){
    var arrProfession = safety.workplan.arrProfession;
    if(safety.workplan.statusTimer != null){
        window.clearTimeout(safety.workplan.statusTimer);
    }
    var strProfession = ''; //所有专业
    var strWorkType = cms.util.$('ddlWorkType').value.trim();
    var strWorkGrade = cms.util.$('ddlWorkGrade').value.trim();
    var strWorkDay = cms.util.$('txtWorkDay').value.trim();
    var strStartTime = strWorkDay + ' 00:00:00';
    var strEndTime = strWorkDay + ' 23:59:59';
    
    if(strWorkDay.equals('')){
        cms.box.alert('请选择施工计划日期');
        return false;
    }
    
    var urlparam = 'action=getWorkPlan&type=' + strProfession + '&workType=' + strWorkType + '&workGrade=' + strWorkGrade
        + (deptIndexCode != undefined ? '&deptIndexCode=' + deptIndexCode : '')
        + '&startTime=' + strStartTime + '&endTime=' + strEndTime;
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
            try{
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                } else {
                    var jsondata = data.toJson();//eval('(' + data + ')');
                    if(jsondata.result == 1){
                        if(jsondata.wsResult.result == 1){
                            safety.workplan.dataList = jsondata.list;
                            safety.workplan.today = jsondata.today;
                            safety.workplan.showWorkList(safety.workplan.dataList, deptIndexCode, planId);
                        } else {
                            safety.workplan.clearWorkList(deptIndexCode);
                            safety.workplan.clearWorkMarker(deptIndexCode);
                            //alert('获取施工计划信息失败。\r\nWebService接口返回数据如下：\r\n' + jsondata.wsResult.error);
                            cms.box.alert({id: boxId, title: '错误信息', html: '获取施工计划信息失败。\r\nWebService接口返回数据如下：<br />' + jsondata.wsResult.error, zindex: 21000});
                        }
                    } else {
                        //alert(jsondata.error);
                        safety.workplan.clearWorkList(deptIndexCode);
                        safety.workplan.clearWorkMarker(deptIndexCode);
                        cms.box.alert({id: boxId, title: '错误信息', html: '获取施工信息信息失败。错误信息如下：<br />' + jsondata.error, zindex: 21000});
                    }
                }
            } catch(ex){
                //alert('获取施工信息信息失败。错误信息如下：\r\n' + data);
                safety.workplan.clearWorkList(deptIndexCode);
                safety.workplan.clearWorkMarker(deptIndexCode);
                cms.box.alert({id: boxId, title: '错误信息', html: '获取施工信息信息失败。错误信息如下：<br />' + data, zindex: 21000});
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.workplan.showWorkList = function(dataList, deptIndexCode, planId){
    var arrProfession = safety.workplan.arrProfession;
    var colors = ['#000', '#080', '#f00', '#00f', '#fa04da'];
    if(deptIndexCode != undefined){
        var objList = cms.util.$('tbList_Dept');
        cms.util.clearDataRow(objList, 0);
        
        var rid = 0;
        var rowData = [];
        var cl = colors.length;
        var ci = 0;
        var workPlanList = dataList;
        
        safety.workplan.clearWorkMarker(deptIndexCode);
        
        for(var i=0; i<workPlanList.length; i++){
            var dr = workPlanList[i];
            if(dr.deptId != deptIndexCode){
                continue;
            }
            var row = objList.insertRow(rid);
            var cellid = 0;

            //var strName = '<span style="color:' + colors[ci] + ';">' + cms.util.fixedCellWidth(dr.deptName, 80, true, dr.deptName) + '</span>';
            var strName = '<a onclick="safety.workplan.showDeptWorkPlanLandmark(\'' + dr.deptId + '\',\'' + dr.deptName + '\',\'' + dr.typeId + '\',\'' + dr.id + '\',\'' + dr.workPlace + '\',\'' + dr.workType + '\',\'' + dr.workGrade + '\');">'
                    + cms.util.fixedCellWidth(dr.deptName, 80, true, dr.deptName) + '</a>';
            var strTime = safety.workplan.showTime(dr.startTime, dr.endTime);
            var strContent = '';
            var strStatus = '<input type="text" name="wpStatus_dept" lang="' + dr.id + '" id="wps_' + dr.id + '" title="' + dr.startTime + ',' + dr.endTime + '"'
                + ' readonly="readonly" style="width:24px;font-size:12px;border:none;background:Transparent;text-align:center;" value="-" />';
            row.rel = dr.workContent;
            row.lang = '{id:' + dr.id + ',ucode:\'' + dr.deptId + '\',unit:\'' + dr.deptName + '\',color:\'' + colors[ci] + '\''
                + ',time:\'' + (dr.startTime + ',' + dr.endTime) + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\'}';
            var strCadre = dr.cadre;
            var strWorkType = safety.workplan.parseWorkType(dr.workType);
            var strWorkGrade = safety.workplan.parseWorkGrade(dr.workGrade);
            
            row.ondblclick = function(){
                var lang = eval('(' + this.lang + ')');
                safety.workplan.showWorkPlanDetail(lang.id);
            };
            
            rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
            rowData[cellid++] = {html: strName, style:[['width','80px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.workContent, 100, true, dr.workContent.replaceAll('<br />','')), style:[['width','100px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.workPlace, 90, true, dr.workPlace), style:[['width','90px']]};
            rowData[cellid++] = {html: strTime, style:[['width','75px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(strWorkType, 60, true, strWorkType), style:[['width','60px']]};
            rowData[cellid++] = {html: strWorkGrade, style:[['width','50px']]};
            rowData[cellid++] = {html: strCadre, style:[['width','50px']]};
            rowData[cellid++] = {html: strStatus, style:[['width','25px']]};
            rowData[cellid++] = {html: '', style:[]};
                
            cms.util.fillTable(row, rowData);
            //选择某个计划，只显示某个计划的标记
            if(!safety.workplan.htMarker.contains(dr.id + '_' + dr.deptId) && dr.id == planId){
                //显示图标
                dr.code = dr.deptId;
                switch(dr.typeId){
                    case 'JCW':
                        dr.name = dr.deptName + '(' + dr.typeId + '-' + dr.workType + '-' + dr.workGrade + ')';
                        break;
                    case 'BD':
                        dr.name = dr.workPlace + '(' + dr.typeId + '-' + dr.workType  + '-' + dr.workGrade + ')';
                        break;
                    case 'DL':
                        dr.name = dr.workPlace + '(' + dr.typeId + '-' + dr.workType + '-' + dr.workGrade + ')';
                        break;
                }
                var landmarkTypeId = 4;
                
                safety.workplan.getLandmark(landmarkTypeId, dr);
            }
            rid++;
            ci++;
        }
        safety.workplan.workStatus(deptIndexCode);
    
    } else {
        safety.workplan.clearWorkMarker('');
        
        for(var m=0; m<arrProfession.length; m++){
            var objList = cms.util.$('tbList_' + arrProfession[m][0]);
            
            cms.util.clearDataRow(objList, 0);
            
            var rid = 0;
            var rowData = [];
            var cl = colors.length;
            var ci = 0;
            
            var workPlanList = [];
             
            for(var j=0; j<dataList.length; j++){
                if(dataList[j].typeId.equals(arrProfession[m][0])){
                    workPlanList.push(dataList[j]);
                }
            }
            var wpc = $('#wpc_' + arrProfession[m][0]).html('(' + workPlanList.length + ')');
            
            for(var i=0; i<workPlanList.length; i++){
                var dr = workPlanList[i];
                var row = objList.insertRow(rid);
                var cellid = 0;
                if(ci >= cl){
                    ci = 0;
                }
                //var strName = '<a onclick="safety.workplan.showDeptWorkPlan(\'' + dr.deptId + '\',\'' + dr.deptName + '\',\'' + dr.id + '\');" style="color:' + colors[ci] + ';">'
                var strName = '<a onclick="safety.workplan.showDeptWorkPlan(\'' + dr.deptId + '\',\'' + dr.deptName + '\',\'' + dr.id + '\');">'
                    + cms.util.fixedCellWidth(dr.deptName, 80, true, dr.deptName) + '</a>';
                var strTime = safety.workplan.showTime(dr.startTime, dr.endTime);
                var strContent = '';
                var strStatus = '<input type="text" name="wpStatus" lang="' + dr.id + '" id="wps_' + dr.id + '" title="' + dr.startTime + ',' + dr.endTime + '"'
                    + ' readonly="readonly" style="width:24px;font-size:12px;border:none;background:Transparent;text-align:center;" value="-" />';
                row.rel = dr.workContent;
                row.lang = '{id:' + dr.id + ',ucode:\'' + dr.deptId + '\',unit:\'' + dr.deptName + '\',color:\'' + colors[ci] + '\''
                    + ',time:\'' + (dr.startTime + ',' + dr.endTime) + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\'}';
                var strCadre = dr.cadre;
                var strWorkType = safety.workplan.parseWorkType(dr.workType);
                var strWorkGrade = safety.workplan.parseWorkGrade(dr.workGrade);
                            
                row.ondblclick = function(){
                    var lang = eval('(' + this.lang + ')');
                    safety.workplan.showWorkPlanDetail(lang.id);
                };
                
                rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
                rowData[cellid++] = {html: strName, style:[['width','80px']]};
                rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.workContent, 100, true, dr.workContent.replaceAll('<br />','')), style:[['width','100px']]};
                rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.workPlace, 90, true, dr.workPlace), style:[['width','90px']]};
                rowData[cellid++] = {html: strTime, style:[['width','75px']]};
                rowData[cellid++] = {html: cms.util.fixedCellWidth(strWorkType, 60, true, strWorkType), style:[['width','60px']]};
                rowData[cellid++] = {html: strWorkGrade, style:[['width','50px']]};
                rowData[cellid++] = {html: strCadre, style:[['width','50px']]};
                rowData[cellid++] = {html: strStatus, style:[['width','25px']]};
                rowData[cellid++] = {html: '', style:[]};
                    
                cms.util.fillTable(row, rowData);
                if(!safety.workplan.htMarker.contains(dr.id + '_' + dr.deptId)){
                    //显示图标
                    dr.code = dr.deptId;
                    switch(dr.typeId){
                        case 'JCW':
                            dr.name = dr.deptName + '(' + dr.typeId + '-' + dr.workType + '-' + dr.workGrade + ')';
                            break;
                        case 'BD':
                            dr.name = dr.workPlace + '(' + dr.typeId + '-' + dr.workType  + '-' + dr.workGrade + ')';
                            break;
                        case 'DL':
                            dr.name = dr.workPlace + '(' + dr.typeId + '-' + dr.workType + '-' + dr.workGrade + ')';
                            break;
                    }
                    
                    var landmarkTypeId = 4;
                    
                    safety.workplan.getLandmark(landmarkTypeId, dr);
                }
                rid++;
                ci++;
            }
        }
        safety.workplan.workStatus('');
    }    
};

safety.workplan.clearWorkList = function(deptIndexCode){
    var arrProfession = safety.workplan.arrProfession;
    if(deptIndexCode != undefined){
        var objList = cms.util.$('tbList_Dept');
        cms.util.clearDataRow(objList, 0);
    } else {
        for(var m=0; m<arrProfession.length; m++){
            var objList = cms.util.$('tbList_' + arrProfession[m][0]);
            cms.util.clearDataRow(objList, 0);
        }
    }
};

safety.workplan.clearWorkMarker = function(deptIndexCode){
    if(deptIndexCode != undefined){
        for(var i=safety.workplan.arrLineId.length-1; i>=0; i--){
            oamap.hideLine(safety.workplan.arrLineId[i]);
            safety.workplan.arrLineId.splice(i, 0);
        }
        for(var i=safety.workplan.arrMarkerId.length-1; i>=0; i--){
            oamap.hideMarker(safety.workplan.arrMarkerId[i]);
            safety.workplan.arrMarkerId.splice(i, 0);
        }    
    } else {
        for(var i=safety.workplan.arrLineId.length-1; i>=0; i--){
            oamap.hideLine(safety.workplan.arrLineId[i]);
            safety.workplan.arrLineId.splice(i, 0);
        }
        for(var i=safety.workplan.arrMarkerId.length-1; i>=0; i--){
            oamap.hideMarker(safety.workplan.arrMarkerId[i]);
            safety.workplan.arrMarkerId.splice(i, 0);
        }
    }
};

safety.workplan.showDeptWorkPlan = function(deptIndexCode, name, planId){
    var strHtml = ''
        /*
        + '<div class="operbar" style="height:22px;text-align:left; text-indent:10px;" lang="open">'
        + '<span style="margin:0;padding:0;">施工安排</span>'
        + '<span style="margin:0;padding:0;" id="wpc_dept"></span></div>'
        + '<div>'
        */
        + '<div class="listheader">'
        + '<table class="tbheader" cellpadding="0" cellspacing="0">'
        + '<tr>'
        + '<td style="width:25px;">序号</td>'
        + '<td style="width:80px;">班组</td>'
        + '<td style="width:100px;">作业内容</td>'
        + '<td style="width:90px;">作业地点</td>'
        + '<td style="width:75px;">起止时间</td>'
        + '<td style="width:60px;">作业类型</td>'
        + '<td style="width:50px;">施工等级</td>'
        + '<td style="width:50px;">跟班干部</td>'
        + '<td style="width:25px;">状态</td>'
        + '<td></td>'
        + '</tr>'
        + '</table>'
        + '</div>'
        + '<div id="divListBox_Dept" class="listbox" style="overflow:auto;">'
        + '<table id="tbList_Dept" class="tblist" cellpadding="0" cellspacing="0"></table>'
        + '</div>'
        + '</div>';
    var size = [600, 150];
    var config = {
        id: 'pwDeptWorkPlan',
        title: name + '今日施工安排',
        html: strHtml,
        width: size[0],
        height: size[1],
        noBottom: true,
        lock: false,
        closeType: 'hide',
        build: 'show',
        position: 'custom',
        x: safety.workplan.boxSize[2],
        y: safety.workplan.boxSize[3] + safety.workplan.boxSize[1] - 46,
    };
    
    cms.box.win(config);
    
    safety.workplan.getWorkPlan(deptIndexCode, planId);
    
    $('#divListBox_Dept').height(size[1] - 24 - 25);
};

safety.workplan.showTime = function(startTime, endTime){
    var days = [
        startTime.split(' ')[0].toDate().dateDifference(safety.workplan.today.toDate()),        
        endTime.split(' ')[0].toDate().dateDifference(safety.workplan.today.toDate())
    ];
    var strTime = '<span title="' + startTime + ' - ' + endTime + '">'
        + safety.workplan.showDay(days[0]) + (startTime.equals('') || startTime.length < 5 ? '' : startTime.split(' ')[1].substr(0,5)) 
        + '-' 
        + safety.workplan.showDay(days[1]) + (endTime.equals('') || endTime.length < 5 ? '' : endTime.split(' ')[1].substr(0,5))
        + '</span>';
    return strTime;
};

safety.workplan.workStatus = function(deptIndexCode){
    var arrStatus = cms.util.$N('wpStatus' + (deptIndexCode != undefined && deptIndexCode != '' ? '_dept' : ''));
    var dtNow = new Date();
    try{
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'text',
            url: cms.util.path + '/ajax/common.aspx',
            data: 'action=getDateTime',
            error: function(jqXHR, textStatus, errorThrown){
                module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR){
                dtNow = data.toDate();
            },
            complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
        });
    } catch(e){}
    try{
        for(var i=0,c=arrStatus.length; i<c; i++){
            var arrTime = arrStatus[i].title.split(',');
            var strStatus = '';
            if(arrTime.length > 1 && arrTime[0] != '' && arrTime[1] != ''){
                var status = safety.workplan.checkStatus(arrTime[0].toDate(), arrTime[1].toDate(), dtNow);
                strStatus = status == -1 ? '点前' : (status == 0 ? '点中' : '点后');
                
                arrStatus[i].value = strStatus;
                arrStatus[i].style.color = status == -1 ? '#00f' : (status == 0 ? '#f00' : '#008000');
            }
        }
    }catch(e){}
    if(arrStatus.length > 0 && (deptIndexCode == undefined || deptIndexCode == '')){
        safety.workplan.statusTimer = window.setTimeout(safety.workplan.workStatus, 5*1000);
    }
};

safety.workplan.parseWorkType = function(workType){
    if('' == workType){
        return '-';
    }
    var strResult = '';
    switch(workType){
        case 'ZT':
            strResult = '主体施工';
            break;
        case 'LY':
            strResult = '临近营业点施工';
            break;
        case 'TD':
            strResult = '停电配合施工';
            break;
        case 'DW':
            strResult = '点外作业';
            break;
    }
    return strResult;
};

safety.workplan.parseWorkGrade = function(workGrade){
    if('' == workGrade){
        return '-';
    }    
    var arrGrade = ['-', '一级', '二级', '三级'];
    return arrGrade[parseInt(workGrade, 10)];
};

safety.workplan.checkStatus = function(dtStart, dtEnd, dtNow){
    var status = -1;
    if((dtStart - dtNow) > 0){
        status = -1;
    } else if((dtNow - dtEnd) > 0){
        status = 1;
    } else {
        status = 0;
    }
    return status;
};

safety.workplan.showDay = function(days){
    var strDay = '';
    
    switch(days){
        case -3:
            strDay = '大前天';
            break;
        case -2:
            strDay = '前天';
            break;
        case -1:
            strDay = '昨天';
            break;
        case 1:
            strDay = '明天';
            break;
        case 2:
            strDay = '后天';
            break;
        case 3:
            strDay = '大后天';
            break;
    }
    return strDay;
};

safety.workplan.showWorkLocation = function(param, strContent){
    var latlng = new google.maps.LatLng(param.lat, param.lng);
    
    var marker = new google.maps.Marker({
        position: latlng,
        map: emap.map,
        icon: '',
        title: param.unit,
        lang: param.id
    });
        
    google.maps.event.addListener(marker, 'click', function(){
        safety.workplan.showWorkPrompt(event, this);
    });
    emap.setMapCenter(param.lat, param.lng);
    var info = safety.workplan.dataList[param.id - 1];
    var strTime = safety.workplan.showTime(info.startTime, info.endTime);

    new MyMarker(emap.map, 
        {
            latlng:latlng,
            labelText: '<span style="color:' + param.color + ';' + '">' + info.deptName + '/' + strContent + '/' + strTime + '</span>'
        }
    );
};

safety.workplan.showWorkPrompt = function(e, mark){
    var evt = window.event || arguments.callee.caller.arguments[0];
    var pos = {x: evt.clientX, y: evt.clientY};
    var info = safety.workplan.dataList[parseInt(mark.lang,10) - 1];
    var strTime = safety.workplan.showTime(info.startTime, info.endTime);
    var strHtml = '<div style="padding:5px;">' 
        + '单位：' + info.deptName + '<br />'
        + '线/行别/里程：' + '武广/下/261KM-300KM<br />'
        + '起止时间：' + strTime + '<br />'
        + '作业内容：' + info.workContent + '<br />'
        + '<a class="play-icon" onclick="safety.workplan.showPreview(' + info.id + ');" style="padding-left:18px;">轨道车视频</a>' 
        + ' <a class="gps-icon" onclick="safety.workplan.showGpsTrack(' + info.id + ');" style="padding-left:18px;">GPS轨迹</a>' + '<br />'
        + '<a onclick="safety.workplan.showWorkPlanDetail(' + info.id + ');">详细信息</a>'
        + '</div>';
    var config = {
        id: 'pwLandmark1',
        title: mark.title,
        html: strHtml,
        position: 'custom',
        x: pos.x,
        y: pos.y,
        width: 260,
        height: 180,
        bgOpacity: 0.3,
        noBottom: true,
        titleBgColor: '#fff',
        titleBorderStyle: 'none'
    };
    winLandmark = cms.box.win(config);
};

safety.workplan.showWorkPlanDetail = function(id){
    //打开第三方平台施工计划详细信息页面
    var url = thirdPartyPage.workPlan.format(id);
    var config = {
        id: 'pwWorkDetail',
        title: '施工计划详细信息',
        html: url,
        width: 800,
        height: 500,
        boxType: 'iframe',
        requestType: 'iframe',
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        lock: false
    };
    
    cms.box.win(config);
};
/*
safety.workplan.showWorkInfo = function(id){
    var width = 700;
    var height = 500;
    var strHtml = '<div class="operbar" style="padding:0;height:24px;width:' + width + 'px;" id="divTabBg">'
        + '<a class="tab-scroll-left"></a>'
        + '<div id="tabpanelBox_wi" class="tabpanelbox" style="width:' + (width-17*2) + 'px;">'
        + '<div id="tabpanel_wi" class="tabpanel"></div>'
        + '</div>'
        + '<a class="tab-scroll-right"></a>'
        + '</div>'
        + '<div id="frmbox"></div>';
    var config = {
        id: 'pwWorkInfo',
        title: '施工内容信息查询', 
        html: strHtml,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        width: width,
        height: height,
        minWidth: 240,
        noBottom: true,
        lock: false,
        callBackByResize: safety.workplan.setInfoWinSize
    }
    var pwBuildDetail = cms.box.win(config);
    
    var path = cms.util.path + '/modules/responsePlan/';
    var date = new Date().getTime();
    var tabs = [
        {code: '1001', name: '施工计划信息', url:path + 'info/1.aspx?'+date, load: false},
        {code: '1002', name: '工作票', url:path + 'info/2.aspx?'+date, load: false},
        {code: '1003', name: '作业分工单', url:path + 'info/3.aspx?'+date, load: false},
        {code: '1006', name: '轨道车运行计划单', url:path + 'info/6.aspx?'+date, load: false}
    ];
    
    for(var i=0; i<tabs.length; i++){
        var strTab = cms.jquery.buildTab(tabs[i].code, tabs[i].name, 16, '#frmMain_' + tabs[i].code, false, 'cms.patrol.delTab');
    
        $('#tabpanel_wi').append(strTab);
        $('#frmbox').append('<iframe class="frmcon" id="frmMain_' + tabs[i].code + '" frameborder="0" scrolling="auto" width="100%" height="100%" src="' + tabs[i].url + '" style="display:none;"></iframe>');
               
    }
    
    $('#frmbox .frmcon').width(width);
    $('#frmbox .frmcon').height(height - 25*2);
    
    cms.jquery.tabs('#tabpanel_wi', null, '.frmcon', 'gotoPage');
            
    cms.jquery.tabSwitch('#tabpanel_wi', 0);
    
    safety.workplan.setTabPanelSize(width - 17*2);        
    
    $('.tab-scroll-left').mousedown(function(){
        cms.util.tabScroll('sub', cms.util.$('tabpanelBox_wi'));
    });
    $('.tab-scroll-left').mouseup(function(){
        cms.util.stopScroll();
    });
    $('.tab-scroll-right').mousedown(function(){
        cms.util.tabScroll('add', cms.util.$('tabpanelBox_wi'));
    });
    $('.tab-scroll-right').mouseup(function(){
        cms.util.stopScroll();
    });
}
*/
safety.workplan.showPreview = function(id){
    var config = {
        id: 'pwpreview',
        title: '轨道车视频',
        html: cms.util.path + '/modules/responsePlan/sub/preview.aspx?devCode=46',
        boxType: 'iframe',
        requestType: 'iframe',
        width: 600,
        height: 400,
        noBottom: true,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        lock: false
    };
    cms.box.win(config);    
};

safety.workplan.showGpsTrack = function(id){
    var config = {
        id: 'pwgpstrack',
        title: 'GPS轨迹',
        html: cms.util.path + '/modules/responsePlan/sub/gpsTrack.aspx',
        boxType: 'iframe',
        requestType: 'iframe',
        width: 1000,
        height: 500,
        noBottom: true,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        lock: false,
        borderStyle: 'solid 3px #99bbe8'
    };
    cms.box.win(config);
};

function gotoPage(param){
    
}

safety.workplan.setTabPanelSize = function(maxWidth){
    $('#tabpanel_wi').width(cms.jquery.getTabWidth($('#tabpanel_wi'), maxWidth));
};

safety.workplan.setInfoWinSize = function(model, bodySize){
    var width = bodySize.w;
    var height = bodySize.h;
    $('#divTabBg').width(width);
    $('#tabpanelBox_wi').width(width - 17*2);
    $('#frmbox .frmcon').width(width);
    $('#frmbox .frmcon').height(height - 25);
    
    safety.workplan.setTabPanelSize(width - 17*2);
};

safety.workplan.showLandmark = function(type, param){
    if(isInLAN){
        //var strTitle = type == 2 ? param.name : param.name + '_' + param.workContent;
        var strTitle = param.name;
        var param = {
            code: param.code,
            name: strTitle,
            left: param.left,
            top: param.top,
            icon: strImgPathDir + type + '.gif',
            showLabel: true,
            func: safety.workplan.showWorkPlanDetail,
            val: param.id //'{type:' + 4 + ',code:\'' + param.ucode + '\',name:\'' + param.unit + '\'}'

        };
        var marker = omap.showMarker(param);
        
        return marker;
    }
    return null;
};

safety.workplan.getLandmark = function(type, param){
    if(isInLAN){
        var urlparam = 'action=getWorkPlanLocation&typeId=' + type + '&planType=' + param.typeId;
        switch(param.typeId){
            case 'JCW':
                urlparam += '&indexCodeList=' + param.code;
                break;
            case 'BD':
                urlparam += '&workPlace=' + escape(param.workPlace);
                break;
            case 'DL':
                urlparam += '&indexCodeList=' + param.code;
                break;
        }        
        var isSearch = !param.workPlace.equals(string.empty);
        $.ajax({
            type: 'post',
            //async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/baseinfo.aspx',
            data: urlparam,
            error: function(jqXHR, textStatus, errorThrown){
                module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR){
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                } else {
                    var jsondata = data.toJson();//eval('(' + data + ')');
                    if(jsondata.result == 1){
                        var first_dr = null;
                        var last_dr = null;
                        
                        var arrMarkerDataList = [];
                        var strIcon = cms.util.path + '/skin/default/images/railway/gis/';
                        for(var i=0,c=jsondata.list.length; i<c; i++){
                            var dr = jsondata.list[i];
                            try{
                                //if(dr.left > 0 && dr.top > 0){
                                    param.left = dr.left;
                                    param.top = dr.top;
                                    //param.name = dr.name;
                                    if((''+dr.lat) != '' && (''+dr.lat) != '0' && (''+dr.lng) != '' && (''+dr.lng) != '0'){
                                        arrMarkerDataList.push({
                                            id: param.typeId + '|' + param.id + '|' + param.workPlace,
                                            name: param.name,
                                            action: 'showWorkPlan',
                                            lat: parseFloat(dr.lat),
                                            lng: parseFloat(dr.lng),
                                            icon: strIcon + dr.type + '.swf'
                                        })
                                    }
                                    //var marker = safety.workplan.showLandmark(dr.type, param);
                                    
                                    /*
                                    //不画线了 2013-12-11
                                    if(0 == i){
                                        first_dr = dr;
                                    }
                                    
                                    if(i > 0 && last_dr != null){
                                        safety.workplan.showMarkerLine(last_dr, dr, param.id + '_' + i, '#ff0000');
                                        
                                        //作业地点之间 相连
                                        //omap.line.drawLine(omap.map, last_dr.left, last_dr.top, dr.left, dr.top, omap.zoom, {zindex:10002, width:"1px",background:"#f00"});
                                    }
                                    if(i > 0){
                                        if(first_dr != null){
                                            safety.workplan.showMarkerLine(first_dr, dr, param.id + '_' + i + '_1', '#0000ff');
                                        
                                            //作业地点 作业单位 相连
                                            //omap.line.drawLine(omap.map, first_dr.left, first_dr.top, dr.left, dr.top, omap.zoom, {zindex:10002, width:"1px",background:"#00f"});
                                        }
                                        last_dr = dr;
                                    }
                                    */
                                    
                                    /*
                                    if(marker != null){
                                        safety.workplan.markers.push(marker);
                                        if(!safety.workplan.htMarker.contains(param.id + '_' + param.code)){
                                            safety.workplan.htMarker.add(param.id + '_' + param.code);
                                        }
                                    }
                                    */
                                //}
                            }catch(e){}
                        }
                        var markerDataList = oamap.buildMarkerData(arrMarkerDataList, 'wp_' + param.id, true);
                        if(markerDataList != '[]'){
                            oamap.createMarker({id: 'wp_' + param.id, scale:oamap.scale}, markerDataList);
                            
                            safety.workplan.arrMarkerId.push('wp_' + param.id);
                        }
                    }
                }
            },
            complete: function(XHR, TS){ 
                XHR = null; 
                if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
            }
        });
    }
};

safety.workplan.showWorkPlace = function(planType, planId, workPlace){
    var urlparam = 'action=getWorkPlanWorkPlace&planType=' + planType + '&workPlace=' + escape(workPlace);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    var arrMarkerDataList = [];
                    var strIcon = cms.util.path + '/skin/default/images/railway/gis/';
                    for(var i=0,c=jsondata.list.length; i<c; i++){
                        var dr = jsondata.list[i];
                        if((''+dr.lat) != '' && (''+dr.lat) != '0' && (''+dr.lng) != '' && (''+dr.lng) != '0'){
                            arrMarkerDataList.push({
                                id: planType + '|' + planId,
                                name: dr.name,
                                action: 'showWorkPlace',
                                lat: parseFloat(dr.lat),
                                lng: parseFloat(dr.lng),
                                icon: strIcon + dr.type + '.swf'
                            })
                        }
                    }
                    var markerDataList = oamap.buildMarkerData(arrMarkerDataList, 'wpwp_', true);
                    if(markerDataList != '[]'){
                        oamap.createMarker({id: 'wpwp_', scale:oamap.scale}, markerDataList);
                        
                        safety.workplan.arrMarkerId.push('wpwp_');
                    }
                }
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.workplan.showDeptWorkPlanLandmark = function(deptId, deptName, planType, planId, workPlace, workType, workGrade){
    safety.workplan.clearWorkMarker('');
    var typeId = 'JCW' == planType ? '4' : 'BD' == planType ? '5' : ''; //工班
    var urlparam = 'action=getDepartmentLocation&planType=' + planType + '&indexCodeList=' + deptId + '&workPlace=' + escape(workPlace);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                
                    var arrMarkerDataList = [];
                    var strIcon = cms.util.path + '/skin/default/images/railway/gis/';
                    for(var i=0,c=jsondata.list.length; i<c; i++){
                        var dr = jsondata.list[i];
                        try{
                            if((''+dr.lat) != '' && (''+dr.lat) != '0' && (''+dr.lng) != '' && (''+dr.lng) != '0'){                                
                                var strName = 'BD' == planType ? workPlace : dr.name; 
                                arrMarkerDataList.push({
                                    id: planType + '|' + planId + '|' + workPlace,
                                    name: strName + '(' + planType + '-' + workType + '-' + workGrade + ')',
                                    action: 'showWorkPlan',
                                    lat: parseFloat(dr.lat),
                                    lng: parseFloat(dr.lng),
                                    icon: strIcon + typeId + '.swf'
                                })
                            }
                                
                        }catch(e){}
                    }
                    var markerDataList = oamap.buildMarkerData(arrMarkerDataList, 'wp_' + planId, true);
                    if(markerDataList != '[]'){
                        oamap.createMarker({id: 'wp_' + planId, scale:oamap.scale}, markerDataList);
                        
                        safety.workplan.arrMarkerId.push('wp_' + planId);
                    }
                }
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.workplan.showMarkerLine = function(dr, dr1, id, color){
    if(oamap.checkLatLng(dr.lat, dr.lng) && oamap.checkLatLng(dr1.lat, dr1.lng)){
        var dataList = [
            {id: id, code: dr.code, name: dr.name, lat: dr.lat, lng: dr.lng},
            {id: id, code: dr1.code, name: dr1.name, lat: dr1.lat, lng: dr1.lng}
        ];
        
        var linePointList = oamap.buildLinePoint(dataList, false, false);
        var param = {type: 'wpl_' + id, id: id, name:'', scale: oamap.scale, color: color, width: '2', alpha: '0.8', action:''};
        var result = oamap.createLine(param, linePointList);
        
        safety.workplan.arrLineId.push('wpl_' + id);
    }
};