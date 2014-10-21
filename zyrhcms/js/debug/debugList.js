var debugList = debugList || {};

debugList.buildListHeader = function(userType, userName){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','45px']]}; //序号
    rowData[cellid++] = {html: '设备名称', style:[['width','100px']]}; //设备名称
    rowData[cellid++] = {html: '设备编号', style:[['width','92px']]}; //设备编号   
    rowData[cellid++] = {html: '功能代码', style:[['width','55px']]}; //功能代码
    rowData[cellid++] = {html: '下发内容', style:[['width','180px']]}; //下发内容
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]}; //创建时间
    rowData[cellid++] = {html: '下发状态', style:[['width','55px']]}; //下发状态
    rowData[cellid++] = {html: '下发时间', style:[['width','120px']]}; //下发时间
    rowData[cellid++] = {html: '回复状态', style:[['width','55px']]}; //回复状态
    rowData[cellid++] = {html: '回复时间', style:[['width','120px']]}; //回复时间
    rowData[cellid++] = {html: '回复内容', style:[['width','150px']]}; //回复代码
    rowData[cellid++] = {html: '错误代码', style:[['width','115px']]}; //错误代码
    rowData[cellid++] = {html: '设置类型', style:[['width','60px']]}; //设置类型 
    rowData[cellid++] = {html: '记录ID', style:[['width','50px']]}; //记录ID
    rowData[cellid++] = {html: '用户', style:[['width','60px']]}; //用户
    rowData[cellid++] = {html: 'IP', style:[['width','90px']]}; //IP
    rowData[cellid++] = {html: '父级ID', style:[['width','50px']]}; //父级ID
    rowData[cellid++] = {html: '子集数量', style:[['width','55px']]}; //子集数量
    rowData[cellid++] = {html: '设备类型', style:[['width','60px']]}; //设备类型
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

debugList.buildListData = function(row, dr, rid, userName){
    var rowData = [];
    var cellid = 0;
    var strDeviceName = '';
    var strDeviceCode = '';
    var downStatus = '';
    var responseStatus = '';
    
    if(dr.childQuantity === '0'){
        strDeviceName = '<a class="link" onclick="showDataDetail(\'' + dr.id + '\');">' + cms.util.fixedCellWidth(dr.devName, 100, true, dr.devName) + '</a>'
        strDeviceCode = cms.util.fixedCellWidth(dr.devCode, 92, true, dr.devCode);
        downStatus = debugList.parseStatus(dr.downStatus, 'down');
        responseStatus = debugList.parseStatus(dr.downStatus, 'response');    
    } else {
        strDeviceName = '批量设置';
        strDeviceCode = '-';
        downStatus = '-';
        responseStatus = '-';
    }
    var strErrorCode = gprsProtocol.webProtocolErrorCode(dr.errorCode);
    
    rowData[cellid++] = {html: rid, style:[['width','45px']]}; //序号    
    rowData[cellid++] = {html: strDeviceName, style:[['width','100px']]}; //设备名称
    rowData[cellid++] = {html: strDeviceCode, style:[['width','92px']]}; //设备编号
    
    rowData[cellid++] = {html: dr.functionCode, style:[['width','55px']]}; //功能代码
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.protocolContent, 180, true, dr.protocolContent), style:[['width','180px'],['textAlign','left']]}; //下发内容
    rowData[cellid++] = {html: debugList.replaceEmpty(dr.createTime), style:[['width','120px']]}; //创建时间
    rowData[cellid++] = {html: downStatus, style:[['width','55px']]}; //下发状态
    rowData[cellid++] = {html: debugList.replaceEmpty(dr.downTime), style:[['width','120px']]}; //下发时间
    rowData[cellid++] = {html: responseStatus, style:[['width','55px']]}; //回复状态
    rowData[cellid++] = {html: debugList.replaceEmpty(dr.responseTime), style:[['width','120px']]}; //回复时间
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.responseContent, 150, true, dr.responseContent), style:[['width','150px'],['textAlign','left']]}; //回复内容
    rowData[cellid++] = {html: cms.util.fixedCellWidth(strErrorCode, 115, true, strErrorCode), style:[['width','115px'],['color','#f00']]}; //错误代码
    rowData[cellid++] = {html: debugList.parseSettingType(dr.settingType), style:[['width','60px']]}; //设置类型
    rowData[cellid++] = {html: dr.id, style:[['width','50px']]}; //记录ID
    rowData[cellid++] = {html: dr.operatorName, style:[['width','60px']]}; //用户
    rowData[cellid++] = {html: dr.operatorIp, style:[['width','90px']]}; //IP
    rowData[cellid++] = {html: dr.parentId, style:[['width','50px']]}; //父级ID
    rowData[cellid++] = {html: dr.childQuantity, style:[['width','55px']]}; //子集数量
    rowData[cellid++] = {html: debugList.replaceEmpty(dr.typeCode), style:[['width','60px']]}; //设备类型
    
    rowData[cellid++] = {html: '', style:[]}; //空
    return rowData;
}

debugList.replaceEmpty = function(s, rval){
    if(rval === undefined){
        rval = '-';
    }
    return s === '' ? rval : s;
}

debugList.parseStatus = function(s, type){
    if(type === 'down'){
        return s === '1' ? '成功' : s === '2' ? '<span class="red">失败</span>' : '未下发';
    } else {
        return s === '1' ? '成功' : s === '2' ? '<span class="red">失败</span>' : '未回复';
    }
}

debugList.parseSettingType = function(s){
    var str = '';
    switch(s){
        case '0':
            str = '常规设置';
            break;
        case '1':
            str = '批量设置';
            break;
        case '2':
            str = '系统维护';
            break;
        case '3':
            str = '一键设置';
            break;
    }
    return str;
}