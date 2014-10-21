cms.patrol = cms.patrol  || {};
cms.patrol.type = cms.patrol.type  || {};

cms.patrol.type.pageStart = 1;
cms.patrol.type.pageIndex = cms.patrol.type.pageStart;
cms.patrol.type.pageSize = 100;

cms.patrol.type.getPatrolPointType = function(){
    var urlparam = 'action=getPatrolPointType' + '&isDelete=0';
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
                
                cms.patrol.type.showListHeader();
                cms.patrol.type.showPatrolPoint(jsondata);
            }
        }
    });
}

cms.patrol.type.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_type');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.patrol.type.buildListHeader();
    cms.util.fillTable(row, rowData);
}

cms.patrol.type.showPatrolPoint = function(jsondata){
    var objList = cms.util.$('tbList_type');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.patrol.type.pageSize);
    if(cms.patrol.type.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        cms.patrol.type.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.patrol.type.pageIndex-cms.patrol.type.pageStart) * cms.patrol.type.pageSize + rid + 1;
            var strParam = "{typeId:'" + dr.typeId + "',typeName:'" + dr.typeName + "',isDelete:'" + dr.isDelete + "'}";
            
            row.lang = strParam;
            
            rowData = cms.patrol.type.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.patrol.type.pageIndex,
            pageSize: cms.patrol.type.pageSize,
            pageStart: cms.patrol.type.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.patrol.type.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_type'));
        pageCount = pager.pageCount;
        
        cms.patrol.type.setTableStyle('#tbList_type', '#tbHeader_type');
        
        return true;
    }
}

cms.patrol.type.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '类型名称', style:[['width','150px']]};
    rowData[cellid++] = {html: '类型描述', style:[['width','200px']]};
    rowData[cellid++] = {html: '默认巡检半径(米)', style:[['width','120px']]};
    rowData[cellid++] = {html: '巡检点数量', style:[['width','80px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.patrol.type.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strTypeName = '<a class="link" onclick="cms.patrol.type.showEditTypeWin(\'edit\',\'' + dr.typeId + '\');">' + cms.util.fixedCellWidth(dr.typeName, 150, true, '') + '</a>';
    var strCheckBox = '<input type="checkbox" value="' + dr.typeId + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: strTypeName, style:[['width','150px']]};
    rowData[cellid++] = {html: dr.typeDesc, style:[['width','200px']]};
    rowData[cellid++] = {html: dr.patrolRadii, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.pointCount, style:[['width','80px']]};
    rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.patrol.type.setTableStyle = function(tb, tbHeader){
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
        cms.jquery.selectCheckBox('#tbList_type');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

cms.patrol.type.showPage = function(page){
    cms.patrol.type.pageIndex = parseInt(page, 10);
    cms.patrol.type.getPatrolPoint();
}

cms.patrol.type.showEditTypeWin = function(action, typeId){
    timerPlayStop(true);
    var boxH = 240;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '巡检点类型信息',
        width: 360,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: 100,
        callBack: cms.patrol.type.editType
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var pt = {typeId:'0', typeName:'', patrolRadii: '50'};
    
    if(action == 'edit'){
        var urlparam = 'action=getSinglePatrolType&typeId=' + typeId;
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
                        var p = jsondata.type;
                        pt.typeId = p.typeId;
                        pt.typeName = p.typeName;
                        pt.patrolRadii = p.patrolRadii;
                    }
                }
            }
        });
    }
    var strHtml = '<div class="p-5-10" style="height:' + conH + 'px;overflow:auto;">'
        + '<div class="tabcon" id="tabcon1">'
        + '<input id="txtTypeId_TypeForm" type="hidden" value="' + pt.typeId + '" />'
        + '<input id="txtAction_TypeForm" type="hidden" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>巡检点类型名称：','class="tdr"'),
            cms.util.buildTd('<input id="txtTypeName_TypeForm" type="text" class="txt w220" maxlength="64" value="' + pt.typeName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>默认巡检半径：','class="tdr"'),
            cms.util.buildTd('<input id="txtPatrolRadii_TypeForm" type="text" class="txt w220" maxlength="4" value="' + pt.patrolRadii + '" />')
        ])
        + '</table>'
        + '</div>';
        
    config.html = strHtml;    
    var pwobj = cms.box.win(config);
    $('#txtTypeName_TypeForm').focus();
    
    cms.util.setFocusClearBlankSpace(cms.util.$('txtTypeName_TypeForm'));    
}

cms.patrol.type.editType = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_TypeForm').val();
        var typeName = $('#txtTypeName_TypeForm').val().trim();
        var patrolRadii = $('#txtPatrolRadii_TypeForm').val().trim();
        
        if(typeName.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtTypeName_TypeForm'), {id: boxId, title: '提示信息', html: '请输入巡检点类型名称。'});
            return false;
        } else if(patrolRadii.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtPatrolRadii_TypeForm'), {id: boxId, title: '提示信息', html: '请输入默认巡检半径。'});
            return false;
        } else if(!patrolRadii.isNumber()){
            cms.box.msgAndFocus(cms.util.$('txtPatrolRadii_TypeForm'), {id: boxId, title: '提示信息', html: '巡检半径输入错误，请输入数字。'});
            return false;
        }
        var urlparam = '';
        
        if(strAction == 'edit'){
            var typeId = $('#txtTypeId_TypeForm').val();
            
            urlparam = 'action=editPatrolType&typeId=' + typeId + '&typeName=' + escape(typeName) + '&patrolRadii=' + patrolRadii;
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
                            cms.patrol.type.getPatrolPointType();
                            pwobj.Hide();
                            timerPlayStop(false);
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点类型信息已修改。'}, true);
                        } else if(jsondata.result == -2){
                            cms.box.msgAndFocus(cms.util.$('txtTypeId_TypeForm'),{id: boxId, title: '提示信息', html: '巡检点类型名称已存在。'}, true);                        
                        } else {
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点类型信息修改失败，请稍候再试。'}, true);
                        }
                    }
                }
            });
        } else {
            urlparam = 'action=addPatrolType&typeName=' + escape(typeName);
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
                            cms.patrol.type.getPatrolPointType();
                            pwobj.Hide();
                            timerPlayStop(false);
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点类型信息已添加。'}, true);
                        } else if(jsondata.result == -2){
                            cms.box.msgAndFocus(cms.util.$('txtTypeId_TypeForm'),{id: boxId, title: '提示信息', html: '巡检点类型名称已存在。'}, true);                        
                        } else {
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点类型信息添加失败，请稍候再试。'}, true);
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

cms.patrol.type.showDeleteTypeWin = function(){
    timerPlayStop(true);
    var uc = cms.jquery.getCheckBoxChecked('#tbList_type').length;    
    var typeIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_type');
     if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择要删除的巡检点类型！'}, true);
        timerPlayStop(false);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个巡检点类型。<br />'
            + '删除后不可恢复，您确定要删除选中的巡检点类型信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除巡检点类型信息',
            html: strHtml,
            callBack: cms.patrol.type.deletePointType,
            returnValue: {
                typeIdList: typeIdList
            }
        });
    }
}

cms.patrol.type.deletePointType = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var typeIdList = pwReturn.returnValue.typeIdList;
        var urlparam = 'action=deletePatrolType&typeIdList=' + typeIdList;
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
                        cms.patrol.type.getPatrolPointType();
                        cms.box.alert({id: boxId, title: '提示信息', html: '巡检点类型信息已删除。'}, true);
                    } else if(jsondata.result == -1){
                        cms.box.alert({id: boxId, title: '错误信息', html: '巡检点类型信息删除失败。<br />错误详情：<br /><div style="width:400px;">' + jsondata.error + '</div>'}, true);                    
                    } else {
                        cms.box.alert({id: boxId, title: '提示信息', html: '巡检点类型信息删除失败，请稍候再试。'}, true);
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

cms.patrol.type.showImportPointWin = function(){
    alert('导入巡检点类型功能未完成');
}

cms.patrol.type.showExportPointWin = function(){
    alert('导出巡检点类型功能未完成');
}

cms.patrol.type.help = function(action, obj){
    if(action == 'close' || action == 'hide'){
        module.showHelpInfo(null, 'hide');
    } else {
        var offset = $('#' + obj.id).offset();
        var h = $('#' + obj.id).height();
        var strHtml = '<div style="padding:6px 10px;color:#666;">';
        var strTitle = '';
        switch(action){
            case 'line':
                strTitle = '巡检点类型说明';
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