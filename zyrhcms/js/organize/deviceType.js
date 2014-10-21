cms.deviceType = cms.deviceType || {};

cms.deviceType.pageStart = 1;
cms.deviceType.pageIndex = cms.deviceType.pageStart;
cms.deviceType.pageSize = 20;
cms.deviceType.arrKeys = {name:'输入要查找的设备名称', indexcode:'输入要查找的设备编号'};

cms.deviceType.pwEditType = null;

cms.deviceType.getDeviceTypeList = function(){
    var urlparam = 'action=getDeviceTypeInfo';
    module.ajaxRequest({
        url: cmsPath + '/ajax/device.aspx',
        data: urlparam,
        callBack: cms.deviceType.getDeviceTypeListCallBack
    });
    
    cms.deviceType.showListHeader();
};

cms.deviceType.getDeviceTypeListCallBack = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    
    cms.deviceType.showDeviceTypeList(jsondata.list);
};

cms.deviceType.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_deviceType');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '分类编号', style:[['width','65px']]};
    rowData[cellid++] = {html: '分类名称', style:[['width','100px']]};
    rowData[cellid++] = {html: '分类描述', style:[['width','150px']]};
    rowData[cellid++] = {html: '网络制式', style:[['width','80px']]};
    rowData[cellid++] = {html: '是否可用', style:[['width','65px']]};
    rowData[cellid++] = {html: '编辑', style:[['width','45px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    cms.util.fillTable(row, rowData);
};

cms.deviceType.showDeviceTypeList = function(list){
    var objList = cms.util.$('tbList_deviceType');
    cms.util.clearDataRow(objList, 0);
    
    var rid = 0;
    for(var i=0,c=list.length; i<c; i++){    
        var row = objList.insertRow(rid++);
        var rowData = [];
        var cellid = 0;
        var dr = list[i];
        
        var strCode = '<a onclick="cms.deviceType.showEditDeviceType(%s);">%s</a>'.format([dr.id, dr.typeCode], '%s');
        var strEdit = '<a onclick="cms.deviceType.showEditDeviceType(%s);">%s</a>'.format([dr.id, '编辑'], '%s');
        
        rowData[cellid++] = {html: (i+1), style:[['width','35px']]};
        rowData[cellid++] = {html: strCode, style:[['width','65px']]};
        rowData[cellid++] = {html: dr.typeName, style:[['width','100px']]};
        rowData[cellid++] = {html: dr.typeDesc, style:[['width','150px']]};
        rowData[cellid++] = {html: cms.deviceType.parseNetworkMode(dr.networkMode), style:[['width','80px']]};
        rowData[cellid++] = {html: dr.isDisplay == 1 ? '可用' : '-', style:[['width','65px']]};
        rowData[cellid++] = {html: strEdit, style:[['width','45px']]};
        rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
        
        rowData[cellid++] = {html: '', style:[]}; //空
        
        
        cms.util.fillTable(row, rowData);
    }
    
};

cms.deviceType.parseNetworkMode = function(mode){
    var arr = mode.split(',');
    for(var i=0,c=arr.length; i<c; i++){
        arr[i] = arr[i] + 'G';
    }
    return arr.join(',');
};

cms.deviceType.showEditDeviceType = function(id){
    var isEdit = true;
    if(typeof id == 'undefined' || typeof id != 'number' || id <= 0){
        isEdit = false;
    }
    var size = module.checkWinSize([500, 450]);
    var strTitle = (isEdit ? '编辑' : '新增') + '设备分类';
    var strHtml = cms.util.path + '/modules/organize/devTypeEdit.aspx?action=' + (isEdit ? 'edit' : 'add') + '&id=' + id;
    
    var config = {
        id: 'pwEditDeviceType',
        title: strTitle,
        html: strHtml,
        width: size[0],
        height: size[1],
        noBottom: true,
        requestType: 'iframe'
    };
    cms.deviceType.pwEditType = cms.box.win(config);
};

function closeEditDeviceType(){
    cms.deviceType.getDeviceTypeList();
    
    cms.deviceType.pwEditType.Hide();
}