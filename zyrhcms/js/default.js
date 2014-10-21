$(window).load(function(){
    initialForm();
    
    getBulletin();
    getDatum();
    
    setBodySize();
    showCalendar();    
});

$(window).resize(function(){
    setBodySize();
});

function setBodySize(){
    var bodySize = cms.util.getBodySize();
    var conH = cms.util.$('homeBodyMain').offsetHeight;
    var bottomH = 50;
    var offset = bodySize.height - (conH + cms.frame.topHeight + bottomH);
    if(offset < 0){
        cms.util.$('footer').style.bottom = offset + 'px';
    } else {
        $('#homeBodyLeft').height(conH + offset);
        $('#homeBodyMain').height(conH + offset);
        $('#homeBodyRight').height(conH + offset);
    }
}

var loadImg = function(){
    //原来是用CSS设置的，但为了处理缓存问题，采用JS设置
    if(imgWelcomeBg != null && imgWelcomeBg != undefined){
        $('.welcome-box').css('background','url("' + cms.util.path + '/skin/default/images/home/' + imgWelcomeBg + '") no-repeat center');
    }
    if(imgIndexTopBanner != null && imgIndexTopBanner != undefined){
        $('#topBanner').css('background','url("' + cms.util.path + '/skin/default/images/' + imgIndexTopBanner + '") no-repeat center');
    }
};

loadImg();

function showCalendar(){
    var c = new Calendar();
    c.show(cms.util.$('divCalendar'));
    
    var d = new Date();
    $('#curdate').html(d.toString('年月日') + ' ' + d.toWeekDay());
}

function initialForm(){
    
}


//获得公告信息
function getBulletin(){
    var urlparam = 'action=getBulletin&isValidate=1&unitId=-1';
    module.ajaxRequest({
        url: cms.util.path + '/ajax/bulletin.aspx',
        data: urlparam,
        callBack: getBulletinCallBack
    });
}

function getBulletinCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    showBulletinList(jsondata);
}

function showBulletinList(jsondata){
    var objList = cms.util.$('tbBulletin');
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rid = 0;
    
    
    for(var i=0; i<dc; i++){
        var row = objList.insertRow(rid);
        var dr = jsondata.list[i];
        var cellid = 0;
        var rowData = [];
        
        var strTitle = '<a onclick="showBulletinDetail(' + dr.id + ');">' + cms.util.fixedCellWidth(dr.title, 180, true, dr.title) + '</a>';
        
        rowData[cellid++] = {html: strTitle, style:[['width','180px']]};
        rowData[cellid++] = {html: dr.createTime.split(' ')[0], style:[['width','70px']]};
        
        cms.util.fillTable(row, rowData);
        rid++;
    }
}

function showBulletinDetail(id){
    var url = cms.util.path + '/modules/infoManage/sub/bulletinDetail.aspx?id=' + id;
    var config = {
        title: '公告信息',
        html: url,
        requestType: 'iframe',
        noBottom: true,
        width: 720,
        height: 450,
        maxAble: true,
        showMinMax: true
    };
    
    cms.box.win(config);
}

function getDatum(){
    var urlparam = 'action=getDatum&isValidate=1';
    module.ajaxRequest({
        url: cms.util.path + '/ajax/datum.aspx',
        data: urlparam,
        callBack: getDatumCallBack
    });
}

function getDatumCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    showDatumList(jsondata);
}

function showDatumList(jsondata){
    var objList = cms.util.$('tbDatum');
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rid = 0;
        
    for(var i=0; i<dc; i++){
        var row = objList.insertRow(rid);
        var dr = jsondata.list[i];
        var cellid = 0;
        var rowData = [];
        
        var strTitle = '<a target="_blank" href="' + cmsPath + dr.filePath + '">' + cms.util.fixedCellWidth(dr.title, 180, true, dr.title) + '</a>';
        
        rowData[cellid++] = {html: strTitle, style:[['width','180px']]};
        rowData[cellid++] = {html: dr.uploadTime.split(' ')[0], style:[['width','70px']]};
        
        cms.util.fillTable(row, rowData);
        rid++;
    }
       
}