var supply = supply || {};

supply.pageStart = 1;
supply.pageIndex = supply.pageStart;
supply.pageSize = 20;

supply.dataList = [];

supply.getSupplyInfo = function(deptIndexCode, deptName){
    if(deptIndexCode.equals(string.empty)){
        return false;
    }
    
    supply.pageIndex = supply.pageStart;
    
    var urlparam = 'action=getSupply&deptIndexCode=' + deptIndexCode + '&pageIndex=' + (supply.pageIndex - supply.pageStart) + '&pageSize=' + supply.pageSize;
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
                            supply.dataList = jsondata.list;
                            supply.showListContent(cms.util.$('pwtbListSupply'), jsondata.list);
                            supply.showPrompt();
                        } else {
                            //alert('获取应急物资信息失败。\r\nWebService接口返回数据如下：\r\n' + jsondata.wsResult.error);
                            supply.showPrompt('没有找到相关的物资信息。<br />WebService接口返回数据如下：<br />' + jsondata.wsResult.error);
                        }
                    } else {
                        //alert(jsondata.error);
                        supply.showPrompt(jsondata.error);
                    }
                }
            } catch(ex){
                //alert('获取应急物资信息失败。错误信息如下：\r\n' + data);
                supply.showPrompt('获取应急物资信息失败。错误信息如下：<br />' + data);
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

supply.showSupplyInfo = function(deptIndexCode, deptName){
    var size = [760, 500];
    var h = size[1] - 25*2 - 26;
    var strHtml = '<div>'
        + '<div id="listHeader" class="listheader" style="height:25px;"><table class="tbheader" id="pwtbHeaderSupply" cellpadding="0" cellspacing="0"></table></div>'
        + '<div id="listContent" class="list" style="height:' + h + 'px;overflow:auto;">'
        + '<div id="pwPromptSupply" style="padding:10px;">正在加载数据，请稍候...</div>'
        + '<table class="tblist" id="pwtbListSupply" cellpadding="0" cellspacing="0"></table>'
        + '</div>'
        + '<div id="statusBarSupply" class="statusbar" style="height:23px;">'
        + '<span id="pwPaginationSupply" class="pagination"></span>'
        + '</div>'
        + '</div>';
    
    var config = {
        id: 'pwSupplyInfo',
        title: deptName + (deptName.indexOf('应急物资') > 0 ? '' : '应急物资') + '信息',
        html: strHtml,
        width: size[0],
        height: size[1],
        noBottom: true,
        closeType: 'hidden',
        lock: false
    };
    
    cms.box.win(config);
    
    supply.showListHeader(cms.util.$('pwtbHeaderSupply'));
        
    window.setTimeout(supply.getSupplyInfo, 200, deptIndexCode, deptName);
};

supply.showListHeader = function(objHeader){
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','30px']]};
    rowData[cellid++] = {html: '部门', style:[['width','120px']]};
    rowData[cellid++] = {html: '类型', style:[['width','90px']]};
    rowData[cellid++] = {html: '名称', style:[['width','150px']]};
    rowData[cellid++] = {html: '型号', style:[['width','80px']]};
    rowData[cellid++] = {html: '单位', style:[['width','50px']]};
    rowData[cellid++] = {html: '定额数量', style:[['width','60px']]};
    rowData[cellid++] = {html: '数量', style:[['width','40px']]};
    rowData[cellid++] = {html: '备注', style:[['width','100px']]};
    rowData[cellid++] = {html: '', style:[]}; //空
        
    cms.util.fillTable(row, rowData);
};

supply.showListContent = function(objList, dataList){
    var rid = 0;
    var start = (supply.pageIndex - supply.pageStart) * supply.pageSize;
    var c = dataCount = dataList.length;
    cms.util.clearDataRow(objList, 0);
    
    for(var i=0; i<supply.pageSize; i++){
        if((i + start) >= c){
            break;
        }
        var dr = dataList[i + start];
        var row = objList.insertRow(rid);
        var rowData = [];
        var cellid = 0;
        var strNum = (supply.pageIndex - supply.pageStart) * supply.pageSize + rid + 1;
        var strName = cms.util.fixedCellWidth(dr.name, 150, true, dr.name);
        var strRemark = dr.remark.equals(string.empty) ? '-' : cms.util.fixedCellWidth(dr.remark, 150, true, dr.remark);
        
        rowData[cellid++] = {html: strNum, style:[['width','30px']]};
        rowData[cellid++] = {html: dr.deptName, style:[['width','120px']]};
        rowData[cellid++] = {html: dr.typeName, style:[['width','90px']]};
        rowData[cellid++] = {html: strName, style:[['width','150px']]};
        rowData[cellid++] = {html: dr.model, style:[['width','80px']]};
        rowData[cellid++] = {html: dr.unit, style:[['width','50px']]};
        rowData[cellid++] = {html: dr.quantity, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.quantity1, style:[['width','40px']]};
        rowData[cellid++] = {html: dr.remark, style:[['width','100px']]};
        rowData[cellid++] = {html: '', style:[]}; //空
    
        cms.util.fillTable(row, rowData);
        
        rid++;
    }
    
    var config = {
        dataCount: dataCount,
        pageIndex: supply.pageIndex,
        pageSize: supply.pageSize,
        pageStart: supply.pageStart,
        showType: 'nolist',
        markType: 'Symbol',
        callBack: 'supply.showPage',
        showDataStat: true,
        showPageCount: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, cms.util.$('pwPaginationSupply'));
    pageCount = pager.pageCount;
};

supply.showPage = function(page){
    supply.pageIndex = parseInt(page, 10);
    supply.showListContent(cms.util.$('pwtbListSupply'), supply.dataList);
}

supply.showPrompt = function(strPrompt){
    var obj = cms.util.$('pwPromptSupply');
    if(obj != null){
        if(strPrompt == undefined || strPrompt.equals(string.empty)){
            obj.style.display = 'none';
        } else {
            obj.style.display = '';
            obj.innerHTML = strPrompt;
        }
    }
};