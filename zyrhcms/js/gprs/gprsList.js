var gprsList = gprsList || {};
gprsList.isMSIE = cms.util.isMSIE;

gprsList.buildListHeader = function(userType, userName, showAllData){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]}; //选择
    rowData[cellid++] = {html: '序号', style:[['width','35px']]}; //序号
    //rowData[cellid++] = {html: '上级单位', style:[['width','90px']]}; //上级单位
    rowData[cellid++] = {html: '组织机构', style:[['width','120px']]}; //组织机构
    rowData[cellid++] = {html: '设备名称', style:[['width','120px']]}; //设备名称
    rowData[cellid++] = {html: '设备编号', style:[['width','92px']]}; //设备编号
    rowData[cellid++] = {html: '设备类型', style:[['width','60px']]}; //设备类型
    rowData[cellid++] = {html: '3G状态', style:[['width','50px']]}; //3G状态
    rowData[cellid++] = {html: '2G状态', style:[['width','50px']]}; //2G状态
    
    if(userName == 'admin' && showAllData == 1){
        rowData[cellid++] = {html: '电池电量', style:[['width','52px']]}; //电池电量
        rowData[cellid++] = {html: '巡检模式', style:[['width','52px']]}; //巡检模式
        rowData[cellid++] = {html: '定时抓拍', style:[['width','80px']]}; //定时抓拍
        rowData[cellid++] = {html: '定时监控', style:[['width','90px']]}; //定时监控
    }
    if(gprsList.isMSIE){
        rowData[cellid++] = {html: '视频预览', style:[['width','52px']]}; //视频预览
        rowData[cellid++] = {html: '录像回放', style:[['width','52px']]}; //录像回放
    }
    rowData[cellid++] = {html: '轨迹回放', style:[['width','52px']]}; //轨迹回放
    rowData[cellid++] = {html: '2G设置', style:[['width','45px']]}; //2G设置
    rowData[cellid++] = {html: '历史数据', style:[['width','52px']]}; //历史数据
    if(userName == 'admin'){
        rowData[cellid++] = {html: '远程配置', style:[['width','52px']]}; //远程配置
    }
    if(userName == 'admin' && showAllData == 1){
        rowData[cellid++] = {html: '预置点', style:[['width','45px']]}; //预置点
        rowData[cellid++] = {html: '纬度', style:[['width','85px']]}; //纬度
        rowData[cellid++] = {html: '经度', style:[['width','85px']]}; //经度
        rowData[cellid++] = {html: 'GPRS信息时间', style:[['width','120px']]}; //信息时间
    }
    
    if(userName == 'admin' && showAllData == 1){
        rowData[cellid++] = {html: '2G号码', style:[['width','90px']]}; //2G号码
        rowData[cellid++] = {html: '3G号码', style:[['width','90px']]}; //3G号码
        rowData[cellid++] = {html: '2G最后心跳', style:[['width','120px']]}; //2G最后心跳
        rowData[cellid++] = {html: '云台状态', style:[['width','55px']]}; //云台状态
        rowData[cellid++] = {html: 'IO状态', style:[['width','55px']]}; //IO状态
        rowData[cellid++] = {html: '网络制式', style:[['width','55px']]}; //网络制式
        rowData[cellid++] = {html: '信号强度', style:[['width','55px']]}; //信号强度
        rowData[cellid++] = {html: '拨号过程', style:[['width','55px']]}; //拨号过程
        rowData[cellid++] = {html: 'Ping时间', style:[['width','55px']]}; //Ping时间
        rowData[cellid++] = {html: '平台注册', style:[['width','55px']]}; //平台注册状态
        rowData[cellid++] = {html: '语音对讲', style:[['width','55px']]}; //语音对讲
    }
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

gprsList.buildLogListHeader = function(userType, userName, showProtocol){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','60px']]}; //序号
    rowData[cellid++] = {html: '设备名称', style:[['width','150px']]}; //设备名称
    rowData[cellid++] = {html: '设备编号', style:[['width','92px']]}; //设备编号
    rowData[cellid++] = {html: '电池电量', style:[['width','55px']]}; //电池电量
    rowData[cellid++] = {html: '巡检模式', style:[['width','55px']]}; //巡检模式
    rowData[cellid++] = {html: '3G状态', style:[['width','50px']]}; //3G状态
    rowData[cellid++] = {html: 'GPRS信息时间', style:[['width','120px']]}; //信息时间
//    rowData[cellid++] = {html: '纬度', style:[['width','85px']]}; //纬度
//    rowData[cellid++] = {html: '经度', style:[['width','85px']]}; //经度
    rowData[cellid++] = {html: "ID", style:[['width','50px']]}; //ID
    if(userName == 'admin' && showProtocol == 1){
        rowData[cellid++] = {html: '记录时间', style:[['width','120px']]}; //记录时间
        rowData[cellid++] = {html: '&nbsp;报文源码', style:[['width','400px'],['textAlign','left']]}; //报文源码
    }
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

gprsList.buildListData = function(row, dr, rid, userName, showAllData){
    var rowData = [];
    var cellid = 0;
    var is2G = dr.networkMode.indexOf('2') >= 0;
    var is3G = dr.networkMode.indexOf('3') >= 0 || dr.networkMode.indexOf('4') >= 0;
    
    //var strParentName = dr.parentName == '' ? '-' : cms.util.fixedCellWidth(dr.parentName, 90, true, dr.parentName);
    var strDeviceName = '<a class="link" onclick="showDevDetail(\'' + dr.devCode + '\',\'' + dr.devName + '\');">' + cms.util.fixedCellWidth(dr.devName, 120, true, dr.devName) + '</a>';
    var strGrpsSetting = '<a onclick="showGprsConfig(\'' + dr.devCode + '\',\'' + dr.devName + '\');" >设置</a>';
    var arrTimingCapture = gprsList.parseTimingCapture(dr.timingCapture);
    var strTimingCapture = arrTimingCapture[0];
    if(strTimingCapture !== '-'){
        strTimingCapture = cms.util.fixedCellWidth(strTimingCapture, 80, true, arrTimingCapture[1]);
    }
    var arrTimingMonitor = gprsList.parseTimingMonitor(dr.timingMonitor);
    var strTimingMonitor = arrTimingMonitor[0]
    if(strTimingMonitor !== '-'){
        strTimingMonitor = cms.util.fixedCellWidth(strTimingMonitor, 90, true, arrTimingMonitor[1]);
    }
    rowData[cellid++] = {html: '<input type="checkbox" name="chbDevCode" value="' + dr.devCode + '" />', style:[['width','25px']]}; //选择
    rowData[cellid++] = {html: rid, style:[['width','35px']]}; //序号
    //rowData[cellid++] = {html: strParentName, style:[['width','90px']]}; //上级单位
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.unitName, 120, true, dr.unitName), style:[['width','120px']]}; //组织机构
    rowData[cellid++] = {html: strDeviceName, style:[['width','120px']]}; //设备名称
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.devCode, 92, true, dr.devCode), style:[['width','92px']]}; //设备编号
    rowData[cellid++] = {html: gprsList.replaceEmpty(dr.typeName), style:[['width','60px']]}; //设备类型
    rowData[cellid++] = {html: gprsList.parseStatus(dr.status), style:[['width','50px']]}; //3G状态
    rowData[cellid++] = {html: gprsList.parseStatus(dr.status2G), style:[['width','50px']]}; //2G状态
    if(userName == 'admin' && showAllData == 1){
        rowData[cellid++] = {html: dr.voltagePower, style:[['width','52px']]}; //电池电量
        rowData[cellid++] = {html: gprsList.parsePatrolMode(dr.patrolMode, is3G), style:[['width','52px']]}; //巡检模式
        rowData[cellid++] = {html: strTimingCapture, style:[['width','80px']]}; //定时抓拍
        rowData[cellid++] = {html: strTimingMonitor, style:[['width','90px']]}; //定时监控
    }
    if(gprsList.isMSIE){
        if(is3G){
            rowData[cellid++] = {html: gprsList.buildPreview(dr.devCode, dr.devName, dr.status3G, '视频预览'), style:[['width','52px']]}; //视频预览
            rowData[cellid++] = {html: gprsList.buildPlayBack(dr.devCode, dr.devName, dr.status3G, '录像回放'), style:[['width','52px']]}; //录像回放
        } else {
            rowData[cellid++] = {html: '-', style:[['width','52px']]}; //视频预览
            rowData[cellid++] = {html: '-', style:[['width','52px']]}; //录像回放        
        }
    }
    rowData[cellid++] = {html: gprsList.buildGpsTrack(dr.devCode, dr.devName, '轨迹回放'), style:[['width','52px']]}; //轨迹回放
    if(is2G){
        rowData[cellid++] = {html: strGrpsSetting, style:[['width','45px']]}; //GPRS设置
        if(dr.typeCode != '50780'){
            rowData[cellid++] = {html: gprsList.buildHistory(dr.devCode, dr.devName, ''), style:[['width','52px']]}; //历史数据
        } else {            
            rowData[cellid++] = {html: '-', style:[['width','52px']]}; //历史数据
        }
    } else {
        rowData[cellid++] = {html: '-', style:[['width','45px']]}; //GPRS设置
        rowData[cellid++] = {html: '-', style:[['width','52px']]}; //历史数据
    }    
    if(userName == 'admin'){
        if(is3G){
            rowData[cellid++] = {html: gprsList.buildRemoteConfig(dr.devCode, dr.devName, '远程配置'), style:[['width','52px']]}; //远程配置
        } else {
            rowData[cellid++] = {html: '-', style:[['width','52px']]}; //远程配置
        }
    }
    if(userName == 'admin' && showAllData == 1){
        if(is3G){
            rowData[cellid++] = {html: gprsList.buildPreset(dr.devCode, dr.devName, '设置'), style:[['width','45px']]}; //设置预置点
        } else {
            rowData[cellid++] = {html: '-', style:[['width','45px']]}; //设置预置点
        }
    }
    if(userName == 'admin' && showAllData == 1){
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.latitude), style:[['width','85px']]}; //纬度
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.longitude), style:[['width','85px']]}; //经度
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.lastGprsTime), style:[['width','120px']]}; //信息时间
    }
    
    if(userName == 'admin' && showAllData == 1){
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.phoneNumber2G), style:[['width','90px']]}; //2G号码
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.phoneNumber3G), style:[['width','90px']]}; //3G号码
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.heartbeat2G), style:[['width','120px']]}; //2G最后心跳
        rowData[cellid++] = {html: gprsList.parsePtzStatus(dr.devCode, dr.devName, dr.ptzStatus), style:[['width','55px']]}; //云台状态
        rowData[cellid++] = {html: gprsList.parseIoStatus(dr.devCode, dr.devName, dr.ioStatus), style:[['width','55px']]}; //IO状态
        rowData[cellid++] = {html: gprsList.parseNetworkStandard(dr.networkStandard), style:[['width','55px']]}; //网络制式
        rowData[cellid++] = {html: gprsList.replaceEmpty(dr.signalStrenth), style:[['width','55px']]}; //信号强度
        rowData[cellid++] = {html: gprsList.parseDialupProcess(dr.dialupProcess), style:[['width','55px']]}; //拨号过程
        rowData[cellid++] = {html: gprsList.parsePingTime(dr.pingTime), style:[['width','55px']]}; //Ping时间
        rowData[cellid++] = {html: gprsList.parsePlatRegister(dr.platformRegisterStatus), style:[['width','55px']]}; //平台注册状态
        rowData[cellid++] = {html: gprsList.parseIntercomStatus(dr.intercomStatus), style:[['width','55px']]}; //语音对讲
    }
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

gprsList.buildLogListData = function(row, dr, rid, userName, param, showProtocol){
    var rowData = [];
    var cellid = 0;
    var devName = dr.devName || param.devName;
    var strDeviceName = cms.util.fixedCellWidth(devName, 150, true, devName);
    
    rowData[cellid++] = {html: rid, style:[['width','60px']]}; //序号
    rowData[cellid++] = {html: strDeviceName, style:[['width','150px']]}; //设备名称
    rowData[cellid++] = {html: dr.devCode, style:[['width','92px']]}; //设备编号
    rowData[cellid++] = {html: dr.batteryPower, style:[['width','55px']]}; //电池电量
    rowData[cellid++] = {html: gprsList.parsePatrolMode(dr.patrolMode), style:[['width','55px']]}; //巡检模式
    rowData[cellid++] = {html: gprsList.parseStatus(dr.status3G), style:[['width','50px']]}; //3G状态
    rowData[cellid++] = {html: dr.receiveTime, style:[['width','120px']]}; //信息时间
//    rowData[cellid++] = {html: dr.latitude, style:[['width','85px']]}; //纬度
//    rowData[cellid++] = {html: dr.longitude, style:[['width','85px']]}; //经度
    rowData[cellid++] = {html: dr.gprsId, style:[['width','50px']]}; //ID
    if(userName == 'admin' && showProtocol == 1){
        rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]}; //记录时间
        var strProtocol = '<input type="text" class="txt-label" readonly="readonly" value="' + dr.protocolContent + '" style="width:99%;" />';
        rowData[cellid++] = {html: strProtocol, style:[['width','394px'],['textAlign','left'],['padding','0 3px']]}; //报文源码
    }
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

gprsList.parseStatus = function(s){
    if(parseInt(s, 10) == 1){
        return '在线';
    } else {
        return '<i class="gray">离线</i>';
    }
};

gprsList.parseStatusPreview = function(s, devCode){
    if(parseInt(s, 10) == 1){
        return '在线 ' + '<span class="play" title="视频预览" onclick="gprsList.showPreview(\'' + devCode + '\')"></span>';
    } else {
        return '<i class="gray">离线</i>';
    }
};

gprsList.parsePatrolMode = function(s, is3G){
    return is3G ? parseInt(s, 10) == 1 ? '手动' : '自动' : '-';
};

gprsList.parseTimingCapture = function(strTimingCapture){
    var strHtml = '';
    var strTitle = '';
    if(strTimingCapture.isJsonData()){
        var arrTiming = eval('(' + strTimingCapture + ')');
        for(var i=0; i<arrTiming.length; i++){
            strHtml += (i>0 ? ' ':'') + arrTiming[i].time;
            strTitle += (i>0 ? '&#10;':'') + arrTiming[i].num + '. ' + arrTiming[i].time;
        }
    } else {
        strHtml = '-';
        strTitle = '-';
    }
    return [strHtml, strTitle];
};

gprsList.parseTimingMonitor = function(strTimingMonitor){
    var strHtml = '';
    var strTitle = '';
    if(strTimingMonitor.isJsonData()){
        var arrTiming = eval('(' + strTimingMonitor + ')');
        for(var i=0; i<arrTiming.length; i++){
            strHtml += (i>0 ? ' ':'') + arrTiming[i].open + '-' + arrTiming[i].close;
            strTitle += (i>0 ? '&#10;':'') + arrTiming[i].num + '. ' + arrTiming[i].open + '-' + arrTiming[i].close + ' ' + (arrTiming[i].type == 1 ? '打开3G并录像' : '仅录像');
        }
    } else {
        strHtml = '-';
        strTitle = '-';
    }
    return [strHtml, strTitle];
};

gprsList.parsePtzStatus = function(devCode, devName, ptzStatus){
    if(ptzStatus == '' || ptzStatus == '-') return '-';
    return '<a href="javascript:;" onclick="gprsList.showPtzStatus(\'' + devCode + '\',\'' + devName + '\',\'' + ptzStatus + '\');">' + (ptzStatus == 'p' || ptzStatus == '0,1,0,0,0,0,0,0' ? 'P' : '查看') + '</a>';
};

gprsList.showPtzStatus = function(devCode, devName, ptzStatus){
    var strHtml = '';
    if(ptzStatus == 'p' || ptzStatus == '0,1,0,0,0,0,0,0'){
        strHtml = '<div style="padding:5px;">' 
            + '设备编号：' + devCode
            + '<br />状态解析：' + ptzStatus
            + '<br /><span style="color:#f00;">主机和云台通讯不上</span>' + '</div>';
    } else {
        var sp = ptzStatus.split(',');
        var arr = ['左右','上下','雨刷','镜头','激光','-','-','-'];
        strHtml = '<div style="padding:5px;">'
            + '设备编号：' + devCode
            + '<br />状态解析：' + ptzStatus
            + '<table cellpadding="0" cellspacing="0" class="tbptzstatus">'
            + '<tr>';
        for(var i=0; i<arr.length; i++){
            strHtml += '<td>' + arr[i] + '</td>';
        }
        strHtml += '</tr>' + '<tr>';
        for(var j=0; j<sp.length; j++){
            strHtml += '<td>' + sp[j] + '</td>';
        }
        strHtml += '</tr>'
            + '</table></div>'
            + '<style type="text/css">'
            + '.tbptzstatus{border-collapse:collapse; text-align:center; font-size:12px;margin:5px 0 0;}'
            + '.tbptzstatus td{width:35px;border:solid 1px #ddd;}'
            + '</style>';
    }
    cms.box.win({
        id: 'ptzstatus01',
        title: '云台状态 - ' + devName,
        html: strHtml,
        width: 320,
        height: 180
    });
};

gprsList.parseIoStatus = function(devCode, devName, ioStatus){
    if(ioStatus == '' || ioStatus == '-') return '-';
    return '<a href="javascript:;" onclick="gprsList.showIoStatus(\'' + devCode + '\',\'' + devName + '\',\'' + ioStatus + '\');">' + '查看' + '</a>';
};

gprsList.showIoStatus = function(devCode, devName, ioStatus){
    var strHtml = '';
    var ios = ioStatus.split(',');
    var arr = ['开门报警','倾斜度报警','-','SOS报警'];
    
    strHtml = '<div style="padding:5px;">'
            + '设备编号：' + devCode
            + '<br />状态解析：' + ioStatus
            + '<table cellpadding="0" cellspacing="0" class="tbiostatus">'
            + '<tr>';
        for(var i=0; i<arr.length; i++){
            strHtml += '<td>' + arr[i] + '</td>';
        }
        strHtml += '</tr>' + '<tr>';
        for(var j=0; j<ios.length; j++){
            strHtml += '<td>' + (ios[j] == '1' ? '<span style="color:#f00;">报警</a>' : '-') + '</td>';
        }
        strHtml += '</tr>'
            + '</table></div>'
            + '<style type="text/css">'
            + '.tbiostatus{border-collapse:collapse; text-align:center; font-size:12px;margin:5px 0 0;}'
            + '.tbiostatus td{width:70px;border:solid 1px #ddd;}'
            + '</style>';
            
    cms.box.win({
        id: 'iostatus01',
        title: 'IO状态 - ' + devName,
        html: strHtml,
        width: 300,
        height: 180
    });
};

gprsList.parseNetworkStandard = function(networkStandard){
    if(networkStandard == '' || networkStandard == '-') return '-';
    //return networkStandard;
    return gprsList.showNetworkStandard(networkStandard);
};

gprsList.showNetworkStandard = function(networkStandard){
    if(networkStandard == 'FF') return 'FF';
    var val = parseInt(networkStandard, 16);
    var title = '';
    var network = val >= 12 && val < 21 ? '电信' : (val >= 21 && val < 31 ? '联通' : '移动');
    switch(val){
        case 12: title = 'CDMA1X'; break;
        case 14: title = 'EVDO'; break;
        case 18: title = 'CDMAHYBRID'; break;
        
        case 21: title = 'GSM'; break;
        case 22: title = 'GPRS'; break;
        case 23: title = 'EDGE'; break;
        case 25: title = 'HSDPA'; break;
        case 26: title = 'HSUPA'; break;
        case 27: title = 'HSPA'; break;
        
        case 31: title = 'TGSM'; break;
        case 32: title = 'TGPRS'; break;
        case 33: title = 'TEDGE'; break;
        case 34: title = 'TDSCDMA'; break;
        case 35: title = 'TDHSDPA'; break;
        case 36: title = 'TDHSUPA'; break;
        case 37: title = 'TDHSPA'; break;            
    }
    return '<span title="' + network + ' ' + title + '">' + val + '</span>';
};

gprsList.parseDialupProcess = function(dialupProcess){
    if(dialupProcess == '' || dialupProcess == '-') return '-';
    var str = dialupProcess;
    var title = '';
    switch(dialupProcess){
        case '00': title = '默认状态'; break;
        case '01': title = '已查找到可用端口'; break;
        case '02': title = 'PING码为READY状态'; break;
        case '03': title = '已开启全功能操作模式'; break;
        case '04': title = '已获得正常的系统信息'; break;
        case '05': title = '已获得短信中心号码'; break;
        case '06': title = '已完成模块初始化'; break;
        case '07': title = '进入拨号线程'; break;
        case '08': title = '拨号条件允许，开始拨号'; break;
        case '09': title = '拨号成功，维持在线'; break;
        case '0a': title = '手动断开连接'; break;
        case '0b': title = '断开连接后模式进行复位'; break;
        case '0c': title = '模块出现异常，重载驱动'; break;
        case '0c': title = '因重载驱动无效，给模块断电并重新上电'; break;
        default: break;
    }
    return '<span style="display:block;" title="' + title + '">' + str + '</span>';
};

gprsList.parsePlatRegister = function(prs){
    if(prs == '' || prs == '-') return '-';
    return '<span title="' + (prs == '01' ? '综合平台' : (prs == '02' ? '3G平台' : '注册失败')) + '">' + prs + '</span>';
};

gprsList.parsePingTime = function(pingTime){
    if(pingTime == '' || pingTime == '-') return '-';
    return parseInt(pingTime,16);
};

gprsList.parseIntercomStatus = function(s){
    return s == '1' ? '打开' : '关闭';
};

gprsList.replaceEmpty = function(s, rval){
    if(rval == undefined){
        rval = '-';
    }
    return s == '' ? rval : s;
};

gprsList.buildPreview = function(devCode, devName, status, title){
    return ('1' == status) ? '<a class="play" title="' + title + '" onclick="showPreview(\'' + devCode + '\',\'' + devName + '\')"></a>' : '-';
};

gprsList.buildPlayBack = function(devCode, devName, status, title){
    return '<a class="playback" title="' + title + '" onclick="showPlayBack(\'' + devCode + '\',\'' + devName + '\')"></a>';
};

gprsList.buildGpsTrack = function(devCode, devName, title){
    return '<a class="gpstrack" title="' + title + '" onclick="showGpsTrack(\'' + devCode + '\',\'' + devName + '\')"></a>';
};

gprsList.buildHistory = function(devCode, devName, title){
    return '<a title="' + title + '" onclick="showHistory(\'' + devCode + '\',\'' + devName + '\')">查看</a>';
};

gprsList.buildRemoteConfig = function(devCode, devName, title){
    return '<a title="' + title + '" onclick="showRemoteConfig(\'' + devCode + '\',\'' + devName + '\');">远程配置</a>';
};

gprsList.buildPreset = function(devCode, devName, title){
    return '<a title="' + title + '" onclick="showDevPreset(\'' + devCode + '\',\'' + devName + '\')">设置</a>';
};