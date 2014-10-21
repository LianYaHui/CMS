cms.patrol = cms.patrol  || {};
cms.patrol.point = cms.patrol.point  || {};

cms.patrol.point.pageStart = 1;
cms.patrol.point.pageIndex = cms.patrol.point.pageStart;
cms.patrol.point.pageSize = 20;

cms.patrol.point.arrKeys = {name:'输入要查找的巡检点名称'};

cms.patrol.point.checkKeywords = function(objTxt){
    return $(objTxt).val() == cms.patrol.point.arrKeys.name;
}

cms.patrol.point.getPatrolPoint = function(){
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var getChild = $('#showChild').attr('checked') == 'checked' ? 1 : 0;
    var strKeywords = $('#txtKeywords').val();
    if(cms.patrol.point.checkKeywords('#txtKeywords')){
        strKeywords = '';
    }
    var urlparam = 'action=getPatrolPoint&unitId=' + unit.id + '&keywords=' + escape(strKeywords)
        + '&pageIndex=' + (cms.patrol.point.pageIndex-cms.patrol.point.pageStart) + '&pageSize=' + cms.patrol.point.pageSize 
        + '&typeId=' + -1 + '&pLineId=' + -1 + '&areaId=' + -1 + '&isDelete=0' + '&getChild=' + getChild;
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
                
                cms.patrol.point.showListHeader();
                cms.patrol.point.showPatrolPoint(jsondata);
            }
        }
    });
}

cms.patrol.point.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_point');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.patrol.point.buildListHeader();
    cms.util.fillTable(row, rowData);
}

cms.patrol.point.showPatrolPoint = function(jsondata){
    var objList = cms.util.$('tbList_point');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.patrol.point.pageSize);
    if(cms.patrol.point.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        cms.patrol.point.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.patrol.point.pageIndex-cms.patrol.point.pageStart) * cms.patrol.point.pageSize + rid + 1;
            var strParam = "{pointId:'" + dr.pointId + "',pointName:'" + dr.pointName + "',latitude:'" + dr.latitude + "',longitude:'" + dr.longitude + "',addType:'" + dr.addType + "'}";
            
            row.lang = strParam;
            
            rowData = cms.patrol.point.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.patrol.point.pageIndex,
            pageSize: cms.patrol.point.pageSize,
            pageStart: cms.patrol.point.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.patrol.point.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_point'));
        pageCount = pager.pageCount;
        
        cms.patrol.point.setTableStyle('#tbList_point', '#tbHeader_point');
        
        return true;
    }
}

cms.patrol.point.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '巡检点名称', style:[['width','150px']]};
    rowData[cellid++] = {html: '纬度', style:[['width','90px']]};
    rowData[cellid++] = {html: '经度', style:[['width','90px']]};
    rowData[cellid++] = {html: '定位', style:[['width','30px']]};
    rowData[cellid++] = {html: '巡检半径(米)', style:[['width','80px']]};
    rowData[cellid++] = {html: '巡检点类型', style:[['width','100px']]};
    rowData[cellid++] = {html: '所属线路', style:[['width','100px']]};
    rowData[cellid++] = {html: '所属组织机构', style:[['width','100px']]};
    rowData[cellid++] = {html: '添加方式', style:[['width','80px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.patrol.point.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strPointName = '<a class="link" onclick="cms.patrol.point.showEditPointWin(\'edit\',\'' + dr.pointId + '\');">' + cms.util.fixedCellWidth(dr.pointName, 150, true, dr.pointName) + '</a>';
    var strCheckBox = '<input type="checkbox" value="' + dr.pointId + '" />';
    
    var strGps = '<a href="javascript:;" onclick="cms.patrol.point.showPointLocation({lat:\'' + dr.latitude + '\',lng:\'' + dr.longitude + '\',name:\'' + dr.pointName + '\'});">定位</a>';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: strPointName, style:[['width','150px']]};
    rowData[cellid++] = {html: dr.latitude, style:[['width','90px']]};
    rowData[cellid++] = {html: dr.longitude, style:[['width','90px']]};
    rowData[cellid++] = {html: strGps, style:[['width','30px']]};
    rowData[cellid++] = {html: dr.radii, style:[['width','80px']]};
    rowData[cellid++] = {html: dr.typeName, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.lineName, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.unitName, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.addType == '0' ? '-' : '轨迹点', style:[['width','80px']]};
    rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.patrol.point.showPointLocation = function(param){
    var param = '{lat:\'' + param.lat + '\',lng:\'' + param.lng + '\',name:\'' + escape(param.name) + '\'}';
    var url = cms.util.path + '/modules/emap/pwmap.aspx?param=' + param;
    var config = {
        title: '巡检点地图定位',
        html: url,
        width: 500,
        height: 400,
        boxType: 'iframe',
        requestType: 'iframe',
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        filter: false,
        zindex: 1
    };
    cms.box.win(config);
}

cms.patrol.point.setTableStyle = function(tb, tbHeader){
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
        cms.jquery.selectCheckBox('#tbList_point');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

cms.patrol.point.showPage = function(page){
    cms.patrol.point.pageIndex = parseInt(page, 10);
    cms.patrol.point.getPatrolPoint();
}

cms.patrol.point.getPointType = function(){
    var urlparam = 'action=getPatrolPointType&isDelete=0&getBaseInfo=1';
    var strOption = '';
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
                var json = eval('(' + data + ')');
                if (json.result == 1) {
                    var list = json.list;
                    for(var i=0; i<list.length; i++){
                        strOption += '<option value="' + list[i].typeId + '">' + list[i].typeName + '</option>';
                    }
                }
            }
        }
    });
    return strOption;
}

cms.patrol.point.getPatrolLine = function(){
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var urlparam = 'action=getPatrolLine&isDelete=0&unitId=' + unit.id;
    var strOption = '';
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
                var json = eval('(' + data + ')');
                if (json.result == 1) {
                    var list = json.list;
                    for(var i=0; i<list.length; i++){
                        strOption += '<option value="' + list[i].lineId + '">' + list[i].lineName + '</option>';
                    }
                }
            }
        }
    });
    return strOption;
}

cms.patrol.point.showEditPointWin = function(action, pointId){
    timerPlayStop(true);
    
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};    
    var boxH = 400;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '巡检点信息',
        width: 350,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: 100,
        callBack: cms.patrol.point.editPoint
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var pp = {pointId:'0', pointName:'', latlng:'', latitude:'', longitude:'', radii: '50', typeId: '0', lineId: '0', areaId: '0'};
    
    if(action == 'edit'){
        var urlparam = 'action=getSinglePatrolPoint&pointId=' + pointId;
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
                        var p = jsondata.point;
                        pp.typeId = p.typeId;
                        pp.pointId = p.pointId;
                        pp.pointName = p.pointName;
                        pp.latitude = p.latitude;
                        pp.longitude = p.longitude;
                        pp.latlng = pp.latitude + ',' + pp.longitude;
                        pp.radii = p.radii;
                        pp.unitId = p.unitId;
                        pp.unitName = p.unitName;
                        pp.lineId = p.lineId;
                        pp.lineName = p.lineName;
                    }
                }
            }
        });
    } else {
        pp.unitId = unit.id;
        pp.unitName = unit.name;    
    }
    var strPointTypeOption = cms.patrol.point.getPointType();
    var strPatrolLineOption = cms.patrol.point.getPatrolLine();
    
    var strHtml = '<div class="p-5-10" style="height:' + conH + 'px;overflow:auto;" id="tabPointContainer">'
        + '<div class="tabcon" id="tabcon1">'
        + '<input id="txtUnitId_PointForm" type="hidden" value="' + pp.unitId + '" />'
        + '<input id="txtPointId_PointForm" type="hidden" value="' + pp.pointId + '" />'
        + '<input id="txtAction_PointForm" type="hidden" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>组织机构：','class="tdr w85"'),
            cms.util.buildTd('<input type="text" class="txt w220" readonly="readonly" disabled="disabled" value="' + pp.unitName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>巡检点名称：','class="tdr"'),
            cms.util.buildTd('<input id="txtPointName_PointForm" type="text" class="txt w220" maxlength="30" value="' + pp.pointName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>经纬度：','class="tdr"'),
            cms.util.buildTd('<input id="txtLatLng_PointForm" type="text" class="txt w220" maxlength="40" style="width:190px;float:left;" value="' + pp.latlng + '" />'
            + '<a class="ibtn" id="ibtnHelp" onclick="cms.patrol.point.help(\'latlng\', this);" style="float:left;margin-left:5px;"><i class="icon-help"></i></a>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>巡检半径：','class="tdr"'),
            cms.util.buildTd('<input id="txtRadii_PointForm" type="text" class="txt w80" maxlength="4" value="' + pp.radii + '" /> 米 <span class="explain"></span>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>巡检点类型：','class="tdr"'),
            cms.util.buildTd('<select id="ddlPointType_PointForm" class="select" style="width:226px;"><option value="0">请选择巡检点类型</option>' + strPointTypeOption + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>巡检线路：','class="tdr"'),
            cms.util.buildTd('<select id="ddlPatrolLine_PointForm" class="select" style="width:196px;float:left;"><option value="0">请选择巡检线路</option>' + strPatrolLineOption + '</select>'
            + '<a class="ibtn" id="ibtnHelp" onclick="cms.patrol.point.help(\'line\', this);" style="float:left;margin-left:5px;"><i class="icon-help"></i></a>')
        ])
        + (action == 'add'? cms.util.buildTr([cms.util.buildTd('','class="tdr"'),
            cms.util.buildTd('<label for="chbContinue_PointForm" class="chb-label-nobg nomp"><input type="checkbox" id="chbContinue_PointForm" class="chb"><span>添加完成后继续添加</span></label>')
        ]):'')
        + '</table>'
        + '</div>';
        
    config.html = strHtml;
    var pwobj = cms.box.win(config);
    $('#txtPointName_PointForm').focus();
    
    $('#ddlPointType_PointForm').attr('value', pp.typeId);
    if(strPatrolLineOption.equals('') && action == 'edit'){
        cms.util.fillOption(cms.util.$('ddlPatrolLine_PointForm'), pp.lineId, pp.lineName);
    }
    $('#ddlPatrolLine_PointForm').attr('value', pp.lineId);
    
    cms.util.setFocusClearBlankSpace(cms.util.$('txtPointName_PointForm'));
    cms.util.setFocusClearBlankSpace(cms.util.$('txtLatLng_PointForm'));
}

cms.patrol.point.editPoint = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_PointForm').val();
        var unitId = $('#txtUnitId_PointForm').val();
        var pointName = $('#txtPointName_PointForm').val().trim();
        //var latlng = $('#txtLatLng_PointForm').val().split(',');
        var strLatLng = $('#txtLatLng_PointForm').val();
        var latitude = '';
        var longitude = '';
        var typeId = $('#ddlPointType_PointForm').val();
        var lineId = $('#ddlPatrolLine_PointForm').val();
        var radii = $('#txtRadii_PointForm').val();
                
        var patternName = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$/;
        var patternPwd = /^[\w.]{3,25}$/;
        var patternPhone = /^[0]?[1][3-9][0-9]{9}$/;
        var patternEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        var patternLatLng = /^[1-9]{1}[\d]{1,2}([.][\d]{1,14})?[,][1-9]{1}[\d]{1,2}([.][\d]{1,14})?$/;
        
        if(pointName.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtPointName_PointForm'), {id: boxId, title: '提示信息', html: '请输入巡检点名称。'});
            return false;
        } else if(pointName.len() > 30){
            cms.box.msgAndFocus(cms.util.$('txtPointName_PointForm'), {id: boxId, title: '提示信息', html: '巡检点名称文字长度不得超过30个字符（15个汉字）。'});
            return false;
        } else if(strLatLng.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtRadii_PointForm'), {id: boxId, title: '提示信息', html: '请输入经纬度（格式：纬度,经度，示例：29.87631,121.63621）。'});
            return false;            
        }
        if(!patternLatLng.exec(strLatLng)){
            cms.box.msgAndFocus(cms.util.$('txtRadii_PointForm'), {id: boxId, title: '提示信息', html: '经纬度输入错误（格式：纬度,经度，示例：29.87631,121.63621）。'});
            return false;         
        } else {
            var latlng = strLatLng.split(',');
            latitude = latlng[0];
            longitude = latlng[1];
        }
        if(radii.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtRadii_PointForm'), {id: boxId, title: '提示信息', html: '请输入默认巡检半径。'});
            return false;
        } else if(!radii.isNumber()){
            cms.box.msgAndFocus(cms.util.$('txtRadii_PointForm'), {id: boxId, title: '提示信息', html: '巡检半径输入错误，请输入数字。'});
            return false;
        } else if(typeId.equals('0') || typeId.equals('')){
            cms.box.msgAndFocus(cms.util.$('ddlPointType_PointForm'), {id: boxId, title: '提示信息', html: '请选择巡检点类型。'});
            return false;
        } else if(lineId.equals('0') || lineId.equals('')){
            cms.box.msgAndFocus(cms.util.$('ddlPatrolLine_PointForm'), {id: boxId, title: '提示信息', html: '请选择巡检线路。'});
            return false;
        }
        var urlparam = '';
        
        if(strAction == 'edit'){
            var pointId = $('#txtPointId_PointForm').val();
            
            urlparam = 'action=editPoint&pointId=' + pointId + '&unitId=' + unitId + '&pointName=' + escape(pointName) 
                + '&latitude=' + latitude + '&longitude=' + longitude + '&radii=' + radii + '&typeId=' + typeId + '&lineId=' + lineId;
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
                            cms.patrol.point.getPatrolPoint();
                            pwobj.Hide();
                            timerPlayStop(false);
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点信息已修改。'}, true);
                        } else if(jsondata.result == -2){
                            cms.box.msgAndFocus(cms.util.$('txtPointName_PointForm'),{id: boxId, title: '提示信息', html: '巡检点名称已存在。'}, true);                        
                        } else {
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点信息修改失败，请稍候再试。'}, true);
                        }
                    }
                }
            });
        } else {
            var isContinue = cms.jquery.isChecked('#chbContinue_PointForm');
            urlparam = 'action=addPoint&unitId=' + unitId + '&pointName=' + escape(pointName) 
                + '&latitude=' + latitude + '&longitude=' + longitude + '&radii=' + radii + '&typeId=' + typeId + '&lineId=' + lineId;
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
                            cms.patrol.point.getPatrolPoint();
                            pwobj.Hide();
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点信息已添加。'}, true);
                            if(isContinue){
                                cms.patrol.point.showEditPointWin('add');
                            } else {                                
                                timerPlayStop(false);
                            }
                        } else if(jsondata.result == -2){
                            cms.box.msgAndFocus(cms.util.$('txtPointName_PointForm'),{id: boxId, title: '提示信息', html: '巡检点名称已存在。'}, true);                        
                        } else {
                            cms.box.alert({id: boxId, title: '提示信息', html: '巡检点信息添加失败，请稍候再试。'}, true);
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

cms.patrol.point.showDeletePointWin = function(){
    timerPlayStop(true);
    var uc = cms.jquery.getCheckBoxChecked('#tbList_point').length;    
    var pointIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_point');
     if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择要删除的巡检点！'}, true);
        timerPlayStop(false);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个巡检点。<br />'
            + '删除后不可恢复，您确定要删除选中的巡检点信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除巡检点信息',
            html: strHtml,
            callBack: cms.patrol.point.deletePoint,
            returnValue: {
                pointIdList: pointIdList
            }
        });
    }
}

cms.patrol.point.deletePoint = function(pwobj, pwReturn){
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
                        cms.patrol.point.getPatrolPoint();
                        cms.box.alert({id: boxId, title: '提示信息', html: '巡检点信息已删除。'}, true);
                    } else if(jsondata.result == -1){
                        cms.box.alert({id: boxId, title: '错误信息', html: '巡检点信息删除失败。<br />错误详情：<br /><div style="width:400px;">' + jsondata.error + '</div>'}, true);                    
                    } else {
                        cms.box.alert({id: boxId, title: '提示信息', html: '巡检点信息删除失败，请稍候再试。'}, true);
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

cms.patrol.point.showImportPointWin = function(){
    alert('导入巡检点功能未完成');
}

cms.patrol.point.showExportPointWin = function(){
    alert('导出巡检点功能未完成');
}

cms.patrol.point.help = function(action, obj){
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