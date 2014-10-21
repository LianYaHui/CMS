cms.patrol = cms.patrol  || {};
cms.patrol.line = cms.patrol.line  || {};

cms.patrol.line.pageStart = 1;
cms.patrol.line.pageIndex = cms.patrol.line.pageStart;
cms.patrol.line.pageSize = 20;

cms.patrol.line.arrKeys = {name:'输入要查找的线路名称'};

cms.patrol.line.checkKeywords = function(objTxt){
    return $(objTxt).val() == cms.patrol.line.arrKeys.name;
}

cms.patrol.line.getPatrolLine = function(){
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var getChild = $('#showChild').attr('checked') == 'checked' ? 1 : 0;
    
    var urlparam = 'action=getPatrolLine&unitId=' + unit.id 
        + '&pageIndex=' + (cms.patrol.line.pageIndex-cms.patrol.line.pageStart) + '&pageSize=' + cms.patrol.line.pageSize 
        + '&isDelete=0' + '&getChild=' + getChild;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/patrol.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            $('#txtData').attr('value', data);
            var strData = $('#txtData').val();
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            } else {
                var jsondata = strData.toJson();//eval('(' + strData + ')');
                
                cms.patrol.line.showListHeader();
                cms.patrol.line.showPatrolLine(jsondata);
            }
        }
    });
}

cms.patrol.line.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_line');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.patrol.line.buildListHeader();
    cms.util.fillTable(row, rowData);
}

cms.patrol.line.showPatrolLine = function(jsondata){
    var objList = cms.util.$('tbList_line');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.patrol.line.pageSize);
    if(cms.patrol.line.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});
        cms.patrol.line.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.patrol.line.pageIndex-cms.patrol.line.pageStart) * cms.patrol.line.pageSize + rid + 1;
            var strParam = "{lineId:'" + dr.lineId + "',lineName:'" + dr.lineName + "'}";
            
            row.lang = strParam;
            
            rowData = cms.patrol.line.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.patrol.line.pageIndex,
            pageSize: cms.patrol.line.pageSize,
            pageStart: cms.patrol.line.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.patrol.line.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_line'));
        pageCount = pager.pageCount;
        
        cms.patrol.line.setTableStyle('#tbList_line', '#tbHeader_line');
        
        return true;
    }
}

cms.patrol.line.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '巡检线路名称', style:[['width','150px']]};
    rowData[cellid++] = {html: '所属组织机构', style:[['width','100px']]};
    rowData[cellid++] = {html: '巡检点数量', style:[['width','100px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.patrol.line.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strLineName = '<a class="link" onclick="cms.patrol.line.showEditLineWin(\'edit\',\'' + dr.lineId + '\');">' + cms.util.fixedCellWidth(dr.lineName, 150, true, '') + '</a>';
    var strCheckBox = '<input type="checkbox" value="' + dr.lineId + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: strLineName, style:[['width','150px']]};
    rowData[cellid++] = {html: dr.unitName, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.pointCount, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.patrol.line.setTableStyle = function(tb, tbHeader){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    var chbitems = $(tb + ' tr input[type="checkbox"]');
    chbitems.click(function() {
        if($(this).attr("checked") == 'checked'){
            $(this).parents('tr').addClass('selected');
        }else{
            $(this).parents('tr').removeClass('selected');
        }
        $(tbHeader + ' #chbAll').attr('checked', chbitems.size() == cms.jquery.getCheckBoxChecked(tb).size());
    });
    
    $(tbHeader + ' #chbAll').click(function(){
        cms.jquery.selectCheckBox('#tbList_line');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

cms.patrol.line.showPage = function(page){
    cms.patrol.line.pageIndex = parseInt(page, 10);
    cms.patrol.line.getPatrolLine();
}

cms.patrol.line.showEditLineWin = function(action, lineId){
    timerPlayStop(true);
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var boxH = 160;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '巡检线路信息',
        width: 360,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: 100,
        callBack: cms.patrol.line.editLine
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var pl = {lineId:'0', lineName:''};
    
    if(action == 'edit'){
        var urlparam = 'action=getSinglePatrolLine&lineId=' + lineId;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/patrol.aspx',
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
                        var p = jsondata.line;
                        pl.lineId = p.lineId;
                        pl.lineName = p.lineName;
                        pl.unitId = p.unitId;
                        pl.unitName = p.unitName;
                    }
                }
            }
        });
    } else {
        pl.unitId = unit.id;
        pl.unitName = unit.name;
    }
    var strHtml = '<div class="p-5-10" style="height:' + conH + 'px;overflow:auto;">'
        + '<div class="tabcon" id="tabcon1">'
        + '<input id="txtUnitId_LineForm" type="hidden" value="' + pl.unitId + '" />'
        + '<input id="txtLineId_LineForm" type="hidden" value="' + pl.lineId + '" />'
        + '<input id="txtAction_LineForm" type="hidden" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>组织机构：','class="tdr w100"'),
            cms.util.buildTd('<input type="text" class="txt w220" readonly="readonly" disabled="disabled" value="' + pl.unitName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>巡检线路名称：','class="tdr"'),
            cms.util.buildTd('<input id="txtLineName_LineForm" type="text" class="txt w220" maxlength="64" value="' + pl.lineName + '" />')
        ])
        + '</table>'
        + '</div>';
        
    config.html = strHtml;
    var pwobj = cms.box.win(config);
    $('#txtLineName_LineForm').focus();
    
    cms.util.setFocusClearBlankSpace(cms.util.$('txtLineName_LineForm'));
}

cms.patrol.line.editLine = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_LineForm').val();
        var unitId = $('#txtUnitId_LineForm').val();
        var lineName = $('#txtLineName_LineForm').val().trim();
                
        if(lineName.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtLineName_LineForm'), {id: boxId, title: '提示信息', html: '请输入巡检线路名称。'});
            return false;
        }
        var urlparam = '';
        
        if(strAction == 'edit'){
            var lineId = $('#txtLineId_LineForm').val();
            
            urlparam = 'action=editPatrolLine&lineId=' + lineId + '&unitId=' + unitId + '&lineName=' + escape(lineName);
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/patrol.aspx',
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
                            cms.patrol.line.getPatrolLine();
                            pwobj.Hide();
                            timerPlayStop(false);
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检线路信息已修改。'}, true);
                        } else if(jsondata.result == -2){
                            cms.box.msgAndFocus(cms.util.$('txtLineName_LineForm'),{id: boxId, title: '提示信息', html: '巡检线路名称已存在。'}, true);                        
                        } else {
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检线路信息修改失败，请稍候再试。'}, true);
                        }
                    }
                }
            });
        } else {
            urlparam = 'action=addPatrolLine&unitId=' + unitId + '&lineName=' + escape(lineName);
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/patrol.aspx',
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
                            cms.patrol.line.getPatrolLine();
                            pwobj.Hide();
                            timerPlayStop(false);
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检线路信息已添加。'}, true);
                        } else if(jsondata.result == -2){
                            cms.box.msgAndFocus(cms.util.$('txtLineName_LineForm'),{id: boxId, title: '提示信息', html: '巡检线路名称已存在。'}, true);                        
                        } else {
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检线路信息添加失败，请稍候再试。'}, true);
                        }
                    }
                }
            });
        }    
    } else {
        pwobj.Hide();
        timerPlayStop(false);
    }
}

cms.patrol.line.showDeletePointWin = function(){
    timerPlayStop(true);
    var uc = cms.jquery.getCheckBoxChecked('#tbList_line').length;    
    var pointIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_line');
     if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择要删除的巡检线路！'}, true);
        timerPlayStop(false);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个巡检线路。<br />'
            + '删除后不可恢复，您确定要删除选中的巡检线路信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除巡检线路信息',
            html: strHtml,
            callBack: cms.patrol.line.deletePoint,
            returnValue: {
                pointIdList: pointIdList
            }
        });
    }
}

cms.patrol.line.deletePoint = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var pointIdList = pwReturn.returnValue.pointIdList;
        var urlparam = 'action=deletePoint&pointIdList=' + pointIdList;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/patrol.aspx',
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
                        cms.patrol.line.getPatrolLine();
                        cms.box.alert({id: boxId, title: '提示信息', html: '巡检线路信息已删除。'}, true);
                    } else if(jsondata.result == -1){
                        cms.box.alert({id: boxId, title: '错误信息', html: '巡检线路信息删除失败。<br />错误详情：<br /><div style="width:400px;">' + jsondata.error + '</div>'}, true);                    
                    } else {
                        cms.box.alert({id: boxId, title: '提示信息', html: '巡检线路信息删除失败，请稍候再试。'}, true);
                    }
                    pwobj.Hide();
                    timerPlayStop(false);
                }
            }
        });
    } else {
        pwobj.Hide();
        timerPlayStop(false);
    }
}

cms.patrol.line.showImportPointWin = function(){
    alert('导入巡检线路功能未完成');
}

cms.patrol.line.showExportPointWin = function(){
    alert('导出巡检线路功能未完成');
}

cms.patrol.line.help = function(action, obj){
    if(action == 'close' || action == 'hide'){
        module.showHelpInfo(null, 'hide');
    } else {
        var offset = $('#' + obj.id).offset();
        var h = $('#' + obj.id).height();
        var strHtml = '<div style="padding:6px 10px;color:#666;">';
        var strTitle = '';
        switch(action){
            case 'line':
                strTitle = '巡检线路说明';
                strHtml += '';
                break;
            case 'latlng':
                strTitle = '经纬度说明';
                strHtml += '纬度在前，经度在后';
                break;
        }
        strHtml += '</div>';
        //module.showHelpInfo({html:strHtml, position: 'custom', x: offset.left, y: offset.top + h, noTitle:true, minAble: false, closeButtonType: 'text'});
    
        module.showHelpInfo({title:strTitle, html:strHtml});
    }
}