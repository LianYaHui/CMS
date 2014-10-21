var alarmList = alarmList || {};

alarmList.buildListHeader = function(userType){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]}; //选择
    rowData[cellid++] = {html: '序号', style:[['width','45px']]}; //序号
    rowData[cellid++] = {html: '参考图', style:[['width','354px']]}; //参考图
    rowData[cellid++] = {html: '抓拍图', style:[['width','354px']]}; //抓拍图
    rowData[cellid++] = {html: '报警信息', css:'td-alarm-info', style:[['width','260px']]}; //报警信息
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

alarmList.buildListData = function(row, dr, rid, loginUser, param){
    var cellid = 0;
    var rowData = [];
    var w = 352;
    var h = 288;
    
    var host = dr.referenceDomain === '2' ? 'http://mas.3gvs.net:81' : cmsUrl;
    var strRef = dr.referencePicture.indexOf('/static') === 0 ? 'http://mas.3gvs.net:82' + dr.referencePicture : host + '/' + dr.referencePicture;
    
    strRef = strRef.replace(/\\/ig,'/');
    var strPic = host + '/' + dr.alarmPicture.replace(/\\/ig,'/');
    
    var strError = cmsPath + '/skin/default/images/pic/noexist.gif';
    var btnDrawId = 'btnDraw' + dr.alarmMonth + "_" + dr.alarmId;
    var strNumber = dr.alarmMonth + "_" + dr.alarmId;
    var strStyle = ' style="width:' + w + 'px;height:' + h + 'px;"';
    
    var imgRefer = '<div class="referPicBox" id="referPicBox' + strNumber + '" style="overflow:hidden; position:relative;">'
        + '<img id="imgRefer' + rid + '" src="' + strRef + '"' + strStyle + ' ondblclick="showPictureSource(this.src, 1);" onerror="javascript:this.src=\'' + strError + '\'"  />'
        + '</div>';
    var imgAlarm = '<div class="alarmPicBox" id="alarmPicBox' + strNumber + '" style="overflow:hidden; position:relative;">'
        + '<img id="imgAlarm' + rid + '" src="' + strPic + '"' + strStyle + ' style="z-index:999;" ondblclick="showPictureSource(this.src, 0);" onerror="javascript:this.src=\'' + strError + '\';setDrawEnabled(\'' + btnDrawId + '\')" />'
        //+ '<div id="canvasAlarm' + rid + '" class="canvas-small" style="background-color:Transparent;z-index:1001;"></div>'
        + '</div>';

    var alarmInfo = '<div class="alarm-info">'
        + '<table class="tbinfo" cellpadding="0" cellspacing="0">'
        + '<tr><td style="width:65px;">设备编号</td><td>' + dr.devCode + '</td></tr>'
        + '<tr><td>设备名称</td><td>' + (dr.devName || param.devName) + '</td></tr>'
        //+ '<tr><td>通道编号</td><td>' + dr.channelNo + '</td></tr>'
        + '<tr><td>预置点编号</td><td>' + dr.presetNo + '</td></tr>'
        + '<tr><td>报警等级</td><td>' + dr.alarmLevel + '</td></tr>';
    
    if(parseInt(loginUser.userRole) === 1){
        alarmInfo += '<tr><td>报警类型</td><td>' + dr.alarmType + '</td></tr>'
            + '<tr><td>报警记录</td><td>' + strNumber + '</td></tr>'
            + '<tr><td>参考图片</td><td><input type="text" class="txt" style="width:150px;float:left;" readonly="readonly" value="' + dr.referencePicture + '" />'
            + '<a href="javascript:;" onclick="downloadPicture(\'' + strRef + '\',1,' + dr.referenceDomain + ');" class="ibtn" style="float:right;" title="下载参考图"><i class="icon-download"></i></a>'
            + '</td></tr>'
            + '<tr><td>抓拍图片</td><td><input type="text" class="txt" style="width:150px;float:left;" readonly="readonly" value="' + dr.alarmPicture + '" />'
            + '<a href="javascript:;" onclick="downloadPicture(\'' + strPic + '\',0,' + dr.referenceDomain + ');" class="ibtn" style="float:right;" title="下载抓拍图"><i class="icon-download"></i></a>'
            + '</td></tr>';
    }
    alarmInfo += '<tr><td colspan="2">'
        + '<a href="javascript:;" id="' + btnDrawId + '" class="ibtn" onclick="drawAlarmArea(\'' + dr.alarmMonth + '\',\'' + dr.alarmId + '\',\'' + rid + '\');" style="float:left;margin-right:5px;overflow:hidden;" title="显示报警区域"><i class="icon-hide">&nbsp;</i></a>'
        + '<a href="javascript:;" class="ibtn" onclick="deleteSingleAlarm(\'' + strNumber + '\');" style="float:left;" title="删除"><i class="icon-delete">&nbsp;</i></a>'
        + '</td></tr>'
    alarmInfo += '</table></div>';
    
    var strCheckBox = '<label for="chbPicAlarm' + strNumber + '" style="display:block;width:25px; height:' + h + 'px; line-height:' + h + 'px;">'
        + '<input type="checkbox" id="chbPicAlarm' + strNumber + '" name="chbPicAlarm" value="' + strNumber + '" />'
        + '&nbsp;</label>';
        
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]}; //选择
    rowData[cellid++] = {html: rid, style:[['width','45px']]}; //序号
    rowData[cellid++] = {html: imgRefer, style:[['width','354px']]}; //参考图
    rowData[cellid++] = {html: imgAlarm, style:[['width','354px']]}; //抓拍图
    rowData[cellid++] = {html: alarmInfo, css:'td-alarm-info', style:[['width','260px'],['verticalAlign','top']]}; //报警信息
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};