var buildinfo = buildinfo || {};

buildinfo.dataList = [
    {id:1, deptName:'武汉工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'1', lat:'30.60752', lng:'114.424330'},
    {id:2, deptName:'武昌工班', workContent:'清扫绝缘子', workTime:'13:00-15:00', status:'0', lat:'30.91307', lng:'114.4323500'},
    {id:3, deptName:'武南工班', workContent:'清扫绝缘子', workTime:'18:00-21:00', status:'0', lat:'30.20019', lng:'114.8878300'},
    {id:4, deptName:'武东工班', workContent:'清扫绝缘子', workTime:'14:00-17:00', status:'0', lat:'30.60752', lng:'114.424330'},
    {id:5, deptName:'咸宁工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'0', lat:'30.91307', lng:'114.4323500'},
    {id:6, deptName:'麻城工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'0', lat:'30.20019', lng:'114.8878300'},
    {id:7, deptName:'汉口工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'0', lat:'30.60752', lng:'114.424330'},
    {id:8, deptName:'汉口工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'0', lat:'30.91307', lng:'114.4323500'},
    {id:9, deptName:'汉口工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'0', lat:'30.20019', lng:'114.8878300'},
    {id:10, deptName:'汉口工班', workContent:'清扫绝缘子', workTime:'12:00-15:00', status:'0', lat:'30.60752', lng:'114.424330'}
];

buildinfo.initialBuildInfo = function(arrType){
    var jsondata = {result:1,list:[{id:'0001',typeId:'JCW',deptId:'01011108',deptName:'孝感',workContent:'检修分段绝缘器，清扫分段绝缘子1/6',workPlace:'汉阳(含)-武昌',startTime:'2013-09-03 15:07:20',endTime:'2013-09-04 07:07:20',status:'1',lng:'',lat:''},{id:'0002',typeId:'JCW',deptId:'01011602',deptName:'黄石综合工班',workContent:'三项工程改造22/25',workPlace:'咸宁北-赤壁北',startTime:'2013-09-03 15:07:20',endTime:'2013-09-04 07:07:20',status:'1',lng:'',lat:''},{id:'0003',typeId:'JCW',deptId:'01020407',deptName:'广水变电工班',workContent:'三项工程改造22/25',workPlace:'咸宁北-赤壁北',startTime:'2013-09-03 15:07:20',endTime:'2013-09-04 07:07:20',status:'1',lng:'',lat:''},{id:'0005',typeId:'JCW',deptId:'01011401',deptName:'黄石综合工班',workContent:'三项工程改造22/25',workPlace:'咸宁北-赤壁北',startTime:'2013-09-03 15:07:20',endTime:'2013-09-04 07:07:20',status:'1',lng:'',lat:''}]};
    var list = jsondata.list;
    buildinfo.showWorkList(list, arrType);
    /*
    var urlparam = 'action=getWorkPlan&type=';
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/controlcenter.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    var list = jsondata.list;
                    buildinfo.showWorkList(list, arrType);
                } else {
                    alert(jsondata.error);
                    //module.showDataError({html:jsondata.error, width:400, height:250});
                }
            }
        }
    });    
    */
};

buildinfo.showWorkList = function(dataList, arrType){    
    var colors = ['#000', '#080', '#f00', '#00f', '#fa04da'];
    for(var m=0; m<arrType.length; m++){
        //var objList = cms.util.$('tbList');
        var objList = cms.util.$('tbList_' + arrType[m][0]);
        
        var rid = 0;
        var rowData = [];
        var cl = colors.length;
        var ci = 0;
        
        for(var i=0; i<dataList.length; i++){
            var dr = dataList[i];
            var row = objList.insertRow(rid);
            var cellid = 0;
            if(ci >= cl){
                ci = 0;
            }
            var strName = '<span style="color:' + colors[ci] + ';">' + cms.util.fixedCellWidth(dr.deptName, 80, true, dr.deptName) + '</span>';
            var strTime = (dr.startTime.equals('') || dr.startTime.length < 5 ? '' : dr.startTime.split(' ')[1].substr(0,5)) 
                + ' - ' 
                + (dr.endTime.equals('') || dr.endTime.length < 5 ? '' : dr.endTime.split(' ')[1].substr(0,5));
            row.lang = '{id:' + dr.id + ',unit:\'' + dr.deptName + '\',color:\'' + colors[ci] + '\',content:\'' + dr.workContent + '\',time:\'' + strTime + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\'}';
            
            row.ondblclick = function(){
                var lang = eval('(' + this.lang + ')');
                if(lang.lat == ''){
                    buildinfo.showWorkInfo(lang.id);
                } else {
                    buildinfo.showWorkLocation(lang);
                }
                //buildinfo.showWorkInfo(lang);
            };
            
            rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
            rowData[cellid++] = {html: strName, style:[['width','80px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.workContent, 120, true, dr.workContent), style:[['width','120px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.workPlace, 100, true, dr.workPlace), style:[['width','100px']]};
            rowData[cellid++] = {html: strTime, style:[['width','100px']]};
            //rowData[cellid++] = {html: dr.status == '1' ? '完成' : '<span style="color:#f00;">未完成</span>', style:[['width','45px']]};
            rowData[cellid++] = {html: '-', style:[['width','45px']]};
            rowData[cellid++] = {html: '', style:[]};
                
            cms.util.fillTable(row, rowData);
            rid++;
            ci++;
        }
    }
};

buildinfo.showWorkLocation = function(param){
    var latlng = new google.maps.LatLng(param.lat, param.lng);
    
    var marker = new google.maps.Marker({
        position: latlng,
        map: emap.map,
        icon: '',
        title: param.unit,
        lang: param.id
    });
        
    google.maps.event.addListener(marker, 'click', function(){
        buildinfo.showWorkPrompt(event, this);
    });
    emap.setMapCenter(param.lat, param.lng);
    var info = buildinfo.dataList[param.id - 1];
    var times = info.workTime.split('-');

    new MyMarker(emap.map, 
        {
            latlng:latlng,
            labelText: '<span style="color:' + param.color + ';' + '">' + info.deptName + '/' + info.workContent + '/' 
                + new Date().toString('yyyy-MM-dd') + ' ' + times[0] + '-' + new Date().toString('yyyy-MM-dd') + ' ' + times[1] + '</span>'
        }
    );
};

buildinfo.showWorkPrompt = function(e, mark){
    var evt = window.event || arguments.callee.caller.arguments[0];
    var pos = {x: evt.clientX, y: evt.clientY};
    var info = buildinfo.dataList[parseInt(mark.lang,10) - 1];
    var strHtml = '<div style="padding:5px;">' 
        + '单位：' + info.deptName + '<br />'
        + '线/行别/里程：' + '武广/下/261KM-300KM<br />'
        + '作业点起止时间：' + info.workTime + '<br />'
        + '作业内容：' + info.workContent + '<br />'
        + '<a class="play-icon" onclick="buildinfo.showPreview(' + info.id + ');" style="padding-left:18px;">轨道车视频</a>' 
        + ' <a class="gps-icon" onclick="buildinfo.showGpsTrack(' + info.id + ');" style="padding-left:18px;">GPS轨迹</a>' + '<br />'
        + '<a onclick="buildinfo.showWorkInfo(' + info.id + ');">详细信息</a>'
        + '</div>';
    var config = {
        id: 'pwLandmark',
        title: mark.title,
        html: strHtml,
        position: 'custom',
        x: pos.x,
        y: pos.y,
        width: 240,
        hieght: 150,
        bgOpacity: 0.3,
        noBottom: true
    };
    winLandmark = cms.box.win(config);
};

buildinfo.showWorkInfo = function(id){
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
        callBackByResize: buildinfo.setInfoWinSize
    }
    var pwBuildDetail = cms.box.win(config);
    var path = cms.util.path + '/modules/responsePlan/';
    var date = new Date().getTime();
    var tabs = [
        {code: '1001', name: '施工计划信息', url:path + 'info/1.aspx?'+date, load: false},
        {code: '1002', name: '工作票', url:path + 'info/2.aspx?'+date, load: false},
        {code: '1003', name: '作业分工单', url:path + 'info/3.aspx?'+date, load: false},
        {code: '1004', name: '缺陷、问题库', url:path + 'info/4.aspx?'+date, load: false},
        {code: '1005', name: '6C检测记录', url:path + 'info/5.aspx?'+date, load: false},
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
    
    buildinfo.setTabPanelSize(width - 17*2);        
    
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

buildinfo.showPreview = function(id){
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

buildinfo.showGpsTrack = function(id){
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

buildinfo.setTabPanelSize = function(maxWidth){
    $('#tabpanel_wi').width(cms.jquery.getTabWidth($('#tabpanel_wi'), maxWidth));
};

buildinfo.setInfoWinSize = function(model, bodySize){
    var width = bodySize.w;
    var height = bodySize.h;
    $('#divTabBg').width(width);
    $('#tabpanelBox_wi').width(width - 17*2);
    $('#frmbox .frmcon').width(width);
    $('#frmbox .frmcon').height(height - 25);
    
    buildinfo.setTabPanelSize(width - 17*2);
}