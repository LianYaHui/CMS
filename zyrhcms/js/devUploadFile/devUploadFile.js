var capture = capture || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 200;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 1265;
//滚动条宽度
var scrollBarWidth = 18;

//图片尺寸及当前显示比例
var picSize = {w: 704, h:576, rate:0.5};

var treeType = 'camera';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    initialForm();
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, true, false, false, false, '3,4');
    
    setBodySize();
    buildDataHeader();
           
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).resize(function(){
    if(cms.frame.resize++ == 0){
        cms.frame.setFrameSize(leftWidth, rightWidth);
    } else {
        cms.frame.setFrameSize();
    }
    setBodySize();
});

function initialForm(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    $('#ddlFileType').change(function(){
        loadData();
    });
    
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });

    $('#ddlDesc').change(function(){
        getUploadFileInfo();
    });
    $('#ddlPageSize').change(function(){
        pageIndex = pageStart;
        pageSize = parseInt($(this).val().trim(), 10);
        getUploadFileInfo();
    });

    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    //$('.right-tools').html('<a onclick="showGuide();" class="btn btnc22" style="margin-right:3px;"><span>向导</span></a>');
}

function setBodySize(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
}

function setBoxSize(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    var operH = $('.operform').outerHeight();
    
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);
    }
    $('.listbox').height(boxSize.height - 25 - 26 - operH);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25 - 26 - 23 - operH);
    
}

function setLeftDisplay(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

function treeAction(param){
    switch(param.type){
        case 'unit':
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtKeywords').attr('value', '');
            break;
        case 'device':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            break;
        case 'camera':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtChannelNo').attr('value', param.channelNo);
            $('#txtChannelName').attr('value', '通道' + param.channelNo);
            $('#txtDevChannelName').attr('value', '%s -> 通道%s'.format([param.devName, param.channelNo],'%s'));
            
            pageIndex = pageStart;
            getUploadFileInfo();
            break;
    }
}

function loadData(){
    pageIndex = pageStart;
    getUploadFileInfo();
}

function getUploadFileInfo(){
    var devCode = $('#txtDevCode').val().trim();
    var channelNo = $('#txtChannelNo').val().trim();
    var fileType = $('#ddlFileType').val().trim();
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var isDesc = $('#ddlDesc').val().trim();
    if('' == devCode){
        cms.box.alert({id: boxId, title: '提示信息', html: cms.box.singleLine('请在左边树型菜单中选择设备')});
        return false;
    }
    
    //清除分页数据
    $('#pagination').html('');
    //显示加载
    showLoading(true);
    
    var urlparam = 'action=getDeviceUploadFile&devCode=%s&channelNo=%s&fileType=%s&startTime=%s&endTime=%s&pageIndex=%s&pageSize=%s&isDesc=%s'.format(
        [devCode, channelNo, fileType, startTime, endTime, (pageIndex - pageStart), pageSize, isDesc],'%s'
    );
    module.ajaxRequest({
        url: cmsPath + '/ajax/devUploadFile.aspx',
        data: urlparam,
        callBack: showUploadFile,
        param: {
        
        }
    });
}

function showUploadFile(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    
    var objList = cms.util.$('tbList');
    cms.util.clearDataRow(objList, 0);
    
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    
    showDataList(objList, jsondata);
    
    var config = {
        dataCount: jsondata.dataCount,
        pageIndex: pageIndex,
        pageSize: pageSize,
        pageStart: pageStart,
        showType: 'nolist',
        markType: 'Symbol',
        callBack: 'showPage',
        showDataStat: true,
        showPageCount: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, cms.util.$('pagination'));
    pageCount = pager.pageCount;
    
    setTableStyle('#tbList');    
    
    showLoading(false);
}

function showDataList(objList, jsondata){    
    var rid = 0;
    var pnum = (pageIndex - pageStart) * pageSize;
    for(var i=0,c=jsondata.list.length; i<c; i++){
        var dr = jsondata.list[i];
        
        buildDataList(objList, dr, pnum, rid, jsondata.fileDir, jsondata.nowTime);
        
        rid++;
    }
}

function buildDataList(objList, dr, pnum, rid, fileDir, nowTime){
    var cellid = 0;
    var rowData = [];
    var row = objList.insertRow(rid);
    var isExist = '-1' != dr.fileSize;

    var strPlay = '-';
    var strDownload = '-';
    if(isExist){
        if(0 == dr.fileType){
            strPlay = '<a onclick="preview(\'' + fileDir + dr.filePath + '\');">预览</a>';
        } else {
            strPlay = '<a onclick="play(' + dr.fileType + ',\'' + fileDir + dr.filePath + '\');">播放</a>';
        }
        strDownload = '<a onclick="downloadFile(' + dr.fileType + ',\'' + fileDir + dr.filePath + '\');">下载</a>';
    }
    
    rowData[cellid++] = {html: (pnum + rid + 1), style:[['width','45px']]};
    rowData[cellid++] = {html: dr.devCode, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.channelNo, style:[['width','50px']]};
    rowData[cellid++] = {html: parseFileType(dr.fileType), style:[['width','65px']]};
    rowData[cellid++] = {html: getFileName(dr.filePath), style:[['width','240px']]};
    rowData[cellid++] = {html: isExist ? dr.fileSize : '-', style:[['width','75px']]};
    rowData[cellid++] = {html: dr.uploadTime, style:[['width','120px']]};
    rowData[cellid++] = {html: parseUploadStatus(dr, nowTime), style:[['width','60px']]};
    rowData[cellid++] = {html: strPlay, style:[['width','50px']]};
    rowData[cellid++] = {html: strDownload, style:[['width','50px']]};
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
}

function buildDataHeader(){
    var objList = cms.util.$('tbHeader');
    cms.util.clearDataRow(objList, 0);
    
    var cellid = 0;
    var rowData = [];
    var row = objList.insertRow(0);
    
    rowData[cellid++] = {html: '序号', style:[['width','45px']]};
    rowData[cellid++] = {html: '设备编号', style:[['width','120px']]};
    rowData[cellid++] = {html: '通道号', style:[['width','50px']]};
    rowData[cellid++] = {html: '文件类型', style:[['width','65px']]};
    rowData[cellid++] = {html: '文件名称', style:[['width','240px']]};
    rowData[cellid++] = {html: '文件大小', style:[['width','75px']]};
    rowData[cellid++] = {html: '上传时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '上传状态', style:[['width','60px']]};
    rowData[cellid++] = {html: '操作', style:[['width','50px']]};
    rowData[cellid++] = {html: '下载', style:[['width','50px']]};
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
}

//显示加载
function showLoading(show){
    if(show){
        $("#loading").show();
        $("#loading").html("正在加载数据，请稍候...");
    }
    else{
        $("#loading").hide();
    }
}

function showPage(page){
    pageIndex = parseInt(page, 10);
    getUploadFileInfo();
}

function setTableStyle(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

function parseFileType(type){
    if(type == undefined || type < 0 || type > 2){
        return '-';
    }
    var arrType = ['图片','录像','录音'];
    return arrType[type];
}

function parseUploadStatus(dr, nowTime){
    if(1 == dr.isFinished){
        return '完成';
    }
    if(0 == dr.fileType){
        if(dr.fileSize != '-1'){
            return '完成';
        } else {
            return '上传中断';
        }
    } else {
        var uploadTime = dr.uploadTime.toDate();
        var curTime = nowTime.toDate();
        var ts = curTime.timeDifference(uploadTime);
         
        if(ts > 600){
            return '上传中断';        
        } else {
            return '上传中';
        }
    }
}

function getFileName(strFilePath){
    if('' == strFilePath){
        return '-';
    }
    var arr = strFilePath.split('/');
    return arr[arr.length - 1];
}

function preview(path){
    path = ('/' + path).replaceAll('//', '/');
    var strHtml = '<div style="width:704px;height:576px;display:block;background:url(\'' + path + '\') no-repeat center;"></div>';
    var config = {
        id: 'pwPicPreview',
        title: '图片预览 - ' + path,
        html: strHtml,
        width: 'auto',
        height: 'auto',
        noBottom: true
    };
    cms.box.win(config);
}

function play(type, filePath){
    filePath = ('/' + filePath).replaceAll('//', '/');
    var isHtml5 = false;
    if (!cms.util.$('Canvas').getContext){
        isHtml5 = false;
    } else {
        isHtml5 = true;
    }
    var strTitle = 1 == type ? '录像文件' : '录音文件';
    
    var h = 1 == type ? 200 : 100;
    var strHtml = '<div style="display:block; padding:3px 5px;">'
        + (strTitle + '：') + getFileName(filePath) + '<br />';
    if(isHtml5){
        if(1 == type){
            strHtml += '<video controls="controls" src="' + filePath + '" id="audio_player" style="width:290px;height:' + (h - 60) + 'px;">'
                + '</video>';
        
        } else {
            strHtml += '<audio controls="controls" id="audio_player" style="width:290px;height:' + (h - 60) + 'px;">'
                + '<source src="' + filePath + '" >'
                + '</audio>';
        }
    } else {
        if(1 == type){
            strHtml += '<embed id="MPlayer" src="' + filePath + '" loop="false" width="290px" height="85px" /></embed>';
        
        } else {
            strHtml += '<embed id="MPlayer" src="' + filePath + '" loop="false" width="290px" height="45px" /></embed>';
        }        
    }
    strHtml += '</div>';
    
    var config = {
        id: 'pwPlaySound',
        title: '播放' + strTitle,
        html: strHtml,
        noBottom: true,
        width: 300,
        height: h,
        lock: false,
        position: 9
    };
    cms.box.win(config);
}

function downloadFile(type, path){    
    downloadFileAction(type, path);
}

function downloadFileAction(type, path){
    try{
        var handleUrl = cms.util.path + '/ajax/download.aspx?action=downloadUploadFile&type=' + type + '&path=' + path;
	    window.location.href = handleUrl;
	}catch(ex){
	    cms.box.alert({id: boxId, title: '文件下载失败', html: '文件下载失败，请稍候再试'});
	}
}

function showGuide(){
    var devCode = $('#txtDevCode').val().trim();
    var devName = $('#txtDevName').val().trim();
    
}
