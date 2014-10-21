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

//图片列表
var arrReferList = [];
var referPageIndex = 1;

var devInfo = {};
var arrPicList = [];
var arrPageIndex = [];

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
    
    //初始化预置点
    initialPreset(256);
       
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

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    $('#ddlPreset').change(function(){
        loadData();
    });
    
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
    $('.right-tools').html('<a onclick="showCaptureGuide();" class="btn btnc22" style="margin-right:3px;"><span>向导</span></a>');
};

var setBodySize = function(){
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
};

var setBoxSize = function(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    var operH = $('.operform').outerHeight();
    
    $('#listBox').width(boxSize.width);
    $('#listBox').height(boxSize.height - 25 - 26 - operH);
    //$('#listHeader').height(23);
    $('#listContent').height(boxSize.height - 25 - 26 - operH);
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    }
    /*
    $('#tbHeader').width(listBoxMinWidth);
    $('#tbList').width(listBoxMinWidth - scrollBarWidth);
    */
};

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtKeywords').attr('value', '');
            break;
        case 'device':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtDevChannelName').attr('value', param.devName);
            break;
        case 'camera':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtChannelNo').attr('value', param.channelNo);
            $('#txtChannelName').attr('value', '通道' + param.channelNo);
            $('#txtDevChannelName').attr('value', '%s -> 通道%s'.format([param.devName, param.channelNo],'%s'));
            
            pageIndex = pageStart;
            getCaptureInfo();
            break;
    }
};

var initialPreset = function(count){
    var obj = cms.util.$('ddlPreset');
    var strOption = '';
    var id = 0;
    for(var i=0; i<count; i++){
        id = (i+1);
        cms.util.fillOption(obj, id, (''+id).padLeft(3, '0') + '  预置点' + id);
    }
};

var loadData = function(){
    pageIndex = pageStart;
    //$('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
    getCaptureInfo();
};

var getCaptureInfo = function(){
    var devCode = $('#txtDevCode').val();
    var channelNo = $('#txtChannelNo').val();
    var presetNo = $('#ddlPreset').val();
    var startTime = $('#txtStartTime').val();
    var endTime = $('#txtEndTime').val();
    if(devCode == ''){
        cms.box.alert({id: boxId, title: '提示信息', html: cms.box.singleLine('请在左边树型菜单中选择设备')});
        return false;
    }
    
    var urlparam = 'action=getCapture&devCode=' + devCode + '&channelNo=' + channelNo + '&presetNo=' + presetNo + '&startTime=' + startTime + '&endTime=' + endTime;
    
    module.ajaxRequest({
        url: cmsPath + '/ajax/capture.aspx',
        data: urlparam,
        callBack: showCapturePicture,
        param: {
        
        }
    });
};

var showCapturePicture = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.pics == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    
    var days = jsondata.days;
    var pics = jsondata.pics;
    var refer = jsondata.refer;
    var c = pics.length;
    var strHtml = '';
    var w = picSize.w*picSize.rate;
    var h = picSize.h*picSize.rate;
    
    var strLoading = cmsPath + '/skin/default/images/pic/loading.gif';
    var strNoPic = cmsPath + '/skin/default/images/pic/nopic.gif';
    var strError = cmsPath + '/skin/default/images/pic/noexist.gif';
    var strImgPath = strNoPic;
    
    var showSource = refer.length > 0 ? ' ondblclick="showPictureSource(this.src, 0, 1);" ' : '';
    
    strHtml += '<li class="caputre-pic" style="display:' + (hasPictureAlarmModule ? '' : 'none') + ';">'
            + '<div class="pic-title">' 
            + '<span style="width:100px;float:left;">参考图</span>'
            + '<span id="pager0" style="min-width:210px;max-width:235px; float:right; clear:none;padding-top:1px;">&nbsp;</span>'
            + '</div>'
        + '<div class="pic-box">'
        + '<img id="img0" src="' + strImgPath + '" style="width:' + w + 'px;height:' + h + 'px;display:block;" ' + showSource + ' onerror="javascript:this.src=\'' + strError + '\'" />'
        + '</div>'
        + '<div class="pic-toolbar">';
    if(refer.length > 0){
        strHtml +=  '<a class="ibtn" href="javascript:;" onclick="downloadPicture(0);" title="下载参考图"><i class="icon-download">&nbsp;</i></a>';
        strHtml += '<a class="ibtn" href="javascript:;" onclick="showPictureSource($(\'#img0\').attr(\'src\'),0,1);" title="查看源图片"><i class="icon-zoomin">&nbsp;</i></a>';
            strHtml += '<a class="ibtn" href="javascript:;" onclick="deleteReference();" title="删除参考图"><i class="icon-delete">&nbsp;</i></a>';
        //strHtml += '<a class="ibtn" href="javascript:;" onclick="getReferenceInfo();"><i class="icon-refresh">&nbsp;</i></a>';
    }
    strHtml += '</div>'
        + '</li>';
    
    arrPicList = [];
    arrPicList.push(refer);
    arrPageIndex.push(1);
            
    for(var i=0; i<c; i++){
        var list = pics[i].list;
        //var lc = list.length;
        var lc = pics[i].dataCount;
        
        arrPageIndex.push(1);
        arrPicList.push(pics[i].list);

        strImgPath = strNoPic;
//        if(lc > 0){
//            strImgPath = cmsUrl + '/' + pics[i].list[0].path;
//        }
        showSource = lc > 0 ? ' ondblclick="showPictureSource(this.src,' + (i+1) + ', 0);" ' : '';
        strHtml += '<li class="caputre-pic">'
            + '<div class="pic-title">' 
            + '<span style="width:100px;float:left;">' + pics[i].date + '</span>'
            + '<span id="pager' + (i+1) + '" style="min-width:210px;max-width:235px; float:right; clear:none;padding-top:1px;">&nbsp;</span>'
            + '</div>'
            + '<div class="pic-box">'
            + '<img id="img' + (i+1) + '" src="' + strImgPath + '" style="width:' + w + 'px;height:' + h + 'px;display:block;" ' + showSource + ' onerror="javascript:this.src=\'' + strError + '\'" />'
            + '</div>'
            + '<div class="pic-toolbar">';
        if(lc > 0){
            strHtml +=  '<a class="ibtn" href="javascript:;" onclick="downloadPicture(' + (i+1) + ');" title="下载设备抓拍图"><i class="icon-download">&nbsp;</i></a>';
            strHtml += '<a class="ibtn" href="javascript:;" onclick="showPictureSource($(\'#img' + (i+1) + '\').attr(\'src\'),' + (i+1) + ',0);" title="查看源图片"><i class="icon-zoomin">&nbsp;</i></a>';
            if(hasPictureAlarmModule){
                strHtml +=  '<a class="ibtn" href="javascript:;" onclick="addReference(' + (i+1) + ');" title="添加为参考图"><i class="icon-add">&nbsp;</i></a>';
            }
        }
        strHtml += '</div>'
            + '</li>';
    }
    $('#listPic').html(strHtml);
    
    if(refer.length > 0){
        showPage(1, 0);
    }
    for(var i=0; i<c; i++){
        //if(pics[i].list.length > 0){
        if(pics[i].dataCount > 0){
            showPage(1, (i+1));
        }
    }
};

//预加载图片
var picturePreloaded = function(img,scaling,w,h,loadpic){
    $(img).LoadImage(scaling, w, h, loadpic);
};

var loadPicture = function(img){
    var prepic = cmsPath + '/skin/default/images/pic/loading.gif';
    picturePreloaded(img, false, picSize.w*picSize.rate, picSize.h*picSize.rate, prepic);
};

var loadBigPicture = function(img){
    var prepic = cmsPath + '/skin/default/images/pic/loading.gif';
    picturePreloaded(img, false, picSize.w, picSize.h, prepic);
};

var showPage = function(pageIndex, returnValue){
    var pc = arrPicList[returnValue].length;
    
    //var strPath = pc > 0 ? cmsUrl + '/' + arrPicList[returnValue][pageIndex-1].filePath : cmsPath + '/skin/default/images/pic/nopic.gif';
    var strPath = pc > 0 ? cmsUrl + '/' + arrPicList[returnValue][pageIndex-1].path : cmsPath + '/skin/default/images/pic/nopic.gif';

    arrPageIndex[returnValue] = pageIndex;
    $('#img' + returnValue).attr('src', strPath);
    var obj = cms.util.$('pager' + returnValue);
    var config = {
        dataCount: pc,
        pageIndex: pageIndex,
        pageSize: 1,
        pageStart: pageStart,
        showType: 'nolist',
        markType: 'Symbol',
        callBack: 'showPage',
        returnValue: returnValue,
        showDataStat: false,
        showPageCount: false,
        showRefurbish: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, obj);
    if(cms.util.$('imgSource') !== null){
        showPageSource(pageIndex, returnValue, true);
    }
    //预加载图片
    loadPicture('#img' + returnValue);
};

var picSourceLoaded = false;

var showPictureSource = function(path, inum, type){    
    var w = picSize.w;
    var h = picSize.h;
    var th = 25;
    var sw = 18;
    var boxW = w;
    var boxH = h + th;
    
    var strHtml = '<div style="width:' + w + 'px;height:' + h + 'px;overflow:hidden;display:block;">'
        + '<img id="imgSource" src="' + path + '" style="padding:0;margin:0;display:block;" />'
        + '</div>'; 
    
    if(loginUser.userName == 'admin' && loginUser.userRole == '1'){
        boxH += 23;
        strHtml += '<div class="statusbar" style="height:22px; line-height:22px; position:absolute;bottom:0; padding:0; margin:0; text-indent:5px;">源地址：' + path + '</div>';
    }
    
    var bodySize = cms.util.getBodySize();
    if(bodySize.height < (h + th)){
        boxW = w + sw;
        boxH = bodySize.height - 1;
    } else {
        boxW = w;
    }
    var config = {
        id: 'pwPicSourceBox',
        title: (type == 0 ? '抓拍图' : '参考图') + '源图片' + '<span id="pagerSource" style="width:240px; float:right; clear:none;padding:0;"></span>',
        html: strHtml,
        width: boxW,
        height: boxH,
        noBottom: true,
        borderStyle: 'solid 2px #99bbe8',
        bgOpacity: 0.9,
        clickBgClose: 'dblclick',
        escClose: true
    };
    var pwobj = cms.box.win(config);
    
    //解决IE兼容性问题，第一次打开时窗口BODY大小有问题
    if(cms.util.isMSIE && !picSourceLoaded){
        pwobj.Hide();
        pwobj = cms.box.win(config);
    }
    
    picSourceLoaded = true;
    
    showPageSource(arrPageIndex[inum], inum);
    
    //预加载图片
    loadBigPicture('#imgSource');
};

var timer_ps = null;
var setPicBoxSize = function(){
    var screenImage = $("#imgSource");

    var theImage = new Image();
    theImage.src = screenImage.attr("src");

    var iw = theImage.width;
    var ih = theImage.height;
    $('#imgSource').width(iw);
    $('#imgSource').height(ih);
};

var showPageSource = function(pageIndex, returnValue, isKeyDown){
    var strPath = cmsUrl + '/' + arrPicList[returnValue][pageIndex-1].path;
    arrPageIndex[returnValue] = pageIndex;
    $('#imgSource').attr('src', strPath);
    if(timer_ps != null){
        window.clearTimeout(timer_ps);
    }
    timer_ps = window.setTimeout(setPicBoxSize, 500);
    
    var obj = cms.util.$('pagerSource');
    
    var config = {
        dataCount: arrPicList[returnValue].length,
        pageIndex: pageIndex,
        pageSize: 1,
        pageStart: pageStart,
        showType: 'nolist',
        markType: 'Symbol',
        callBack: 'showPageSource',
        returnValue: returnValue,
        showDataStat: false,
        showPageCount: false,
        showRefurbish: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, obj);
    
    if(isKeyDown == undefined){
        showPage(pageIndex, returnValue);
    }
};

var statDeviceCapture = function(){
    var size = {w: 768, h: 528};
    
    var bodySize = cms.util.getBodySize();
    if(size.h > bodySize.height){
        size.h = bodySize.height - 2;
    }    
    var strHtml = cmsPath + '/modules/capture/stat.aspx';
    var config = {
        id: 'statdevicepicture',
        title: '统计设备抓拍图数量',
        html: strHtml,
        requestType: 'iframe',
        width: size.w,
        height: size.h,
        noBottom: true,
        callBack: winCloseAction
    };
    cms.box.win(config);
};

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
};

//加载参考图，当新增或删除 参考图时 重新加载
var getReferenceInfo = function(){
    var devCode = $('#txtDevCode').val();
    var channelNo = 1;
    var presetNo = $('#ddlPreset').val();
    if(devCode == ''){
        cms.box.alert({id: boxId, title: '提示信息', html: cms.box.singleLine('请在左边树型菜单中选择设备')});
        return false;
    }
    
    var urlparam = 'action=getReference&devCode=' + devCode + '&channelNo=' + channelNo + '&presetNo=' + presetNo;
    //alert(urlparam);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/capture.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var json = eval('(' + data + ')');
            if (json.result == 1) {
                showReferencePicture(json);
            } else if (json.result == -1) {
                if(cms.util.dbConnection(json.error) == 0){
                    cms.box.alert({id: boxId, title: '错误信息', html: cms.box.singleLine(DB_CONNECTION_FAILED), iconType:'error'});
                } 
            } else {
            
            }
        }
    });
};

var showReferencePicture = function(jsondata){
    var refer = jsondata.refer;
    arrPicList[0] = refer;
    arrPageIndex[0] = 1;
    
    if(refer.length > 0){
        showPage(1, 0);
    }
};

var deleteReference = function(){
    var strHtml = cms.box.singleLine('删除后不可恢复，确定要删除当前参考图吗？');
    cms.box.confirm({
        id: 'deletereference',
        title: '删除参考图',
        html: strHtml,
        width: 320,
        callBack: deleteReferenceAction
    });
};

var deleteReferenceAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var id = parseInt(arrPicList[0][arrPageIndex[0]-1].rid, 10);
        var devCode = '';
        var channelNo = -1;
        var presetNo = -1;
        if(id > 0){
            var urlparam = 'action=deleteReference&id=' + id + '&devCode=' + devCode + '&channelNo=' + channelNo + '&presetNo=' + presetNo;
            //alert(urlparam);
            $.ajax({
                type: 'post',
                //async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/capture.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var json = eval('(' + data + ')');
                    if (json.result == 1) {
                        //删除成功，重新加载参考图
                        getReferenceInfo();
                    } else if (json.result == -1) {
                        if(cms.util.dbConnection(json.error) == 0){
                            cms.box.alert({id: boxId, title: '错误信息', html: cms.box.singleLine(DB_CONNECTION_FAILED), iconType:'error'});
                        } 
                    } else {
                        cms.box.alert({id: boxId, title: '提示信息', html: '删除参考图失败，请稍候再试。'});
                    }
                }
            });
        }
    }
    pwobj.Hide();
};

var addReference = function(inum){
    var strHtml = cms.box.singleLine('确定要将当前图片添加为参考图吗？');
    $('#txtAddNum').attr('value', inum);
    cms.box.confirm({
        id: 'addference',
        title: '添加参考图',
        html: strHtml,
        width: 320,
        callBack: addReferenceAction
    });
};

var addReferenceAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var inum = parseInt($('#txtAddNum').val(), 10);
        var pic = arrPicList[inum][arrPageIndex[inum]-1];
        var id = parseInt(pic.fileId, 10);
        
        if(id > 0){
            var urlparam = 'action=addReference&devCode=' + pic.dcode + '&channelNo=' + pic.cn + '&presetNo=' + pic.pn 
                + '&fileId=' + id + '&uploadMonth=' + pic.month + '&filePath=' + pic.path;
            //alert(urlparam);
            $.ajax({
                type: 'post',
                //async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/capture.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var json = eval('(' + data + ')');
                    if (json.result == 1) {
                        //参考图添加成功，重新加载参考图
                        getReferenceInfo();
                    } else if (json.result == -1) {
                        if(cms.util.dbConnection(json.error) == 0){
                            cms.box.alert({id: boxId, title: '错误信息', html: cms.box.singleLine(DB_CONNECTION_FAILED), iconType:'error'});
                        } 
                    } else if(json.result == 2) {
                        cms.box.alert({id: boxId, title: '提示信息', html: cms.box.singleLine('参考图已存在，请勿重复添加，谢谢。')});
                    } else {
                        cms.box.alert({id: boxId, title: '提示信息', html: cms.box.singleLine('添加参考图失败，请稍候再试。')});
                    }
                }
            });
        }
    }
    $('#txtAddNum').attr('value', '');
    
    pwobj.Hide();
};

var downloadPicture = function(inum){
    var pic = arrPicList[inum][arrPageIndex[inum]-1];
    var imgPath = pic.path;
    var type = inum > 0 ? 1 : 0;
    var domain = inum > 0 ? 0 : pic.domain;
    
    downloadPictureAction(imgPath, type, domain);
};

var downloadPictureAction = function(imgPath, type, domain){
    try{
        var handleUrl = cms.util.path + '/ajax/download.aspx?action=download&domain=' + domain + '&type=' + type + '&path=' + imgPath;
	    window.location.href = handleUrl;
	}catch(ex){
	    cms.box.alert({id: boxId, title: '图片下载失败', html: '图片下载失败，请稍候再试'});
	}
};

var showCaptureGuide = function(){
    var devCode = $('#txtDevCode').val().trim();
    var devName = $('#txtDevName').val().trim();
    module.showCaptureGuide(devCode, devName, {lock: true});
};