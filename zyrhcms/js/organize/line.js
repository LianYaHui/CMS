cms.line = cms.line || {};

cms.line.pageStart = 1;
cms.line.pageIndex = cms.line.pageStart;
cms.line.pageSize = 20;

cms.line.zindex = [1000, 1001];

cms.line.tabContainerChange = function(rval){
    //alert(rval.action + ',' + rval.container);
};

cms.line.getServerLine = function(){
    var urlparam = 'action=getServerLine';
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetServerLine Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/server.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetServerLine Response] data: ' + data);
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = data.toJson();//eval('(' + data + ')');
            if(1 == jsondata.result){
                cms.line.showListHeader();
                cms.line.showServerLine(jsondata);
                module.appendDebugInfo(module.getDebugTime() + '[ShowServerLine Finished]');
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);            
            }
        }
    });
};

cms.line.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_line');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.line.buildListHeader();
    cms.util.fillTable(row, rowData);
};

cms.line.showServerLine = function(jsondata){
    var objList = cms.util.$('tbList_line');
    var rid = 0;
    var dataCount = jsondata.list.length;//jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.line.pageSize);
    if(cms.line.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        cms.line.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.line.pageIndex-cms.line.pageStart) * cms.line.pageSize + rid + 1;
            var strParam = "{id:'" + dr.id + "',name:'" + dr.name + "',remark:'" + dr.remark + "'}";
            
            row.lang = strParam;
            
            rowData = cms.line.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.line.pageIndex,
            pageSize: cms.line.pageSize,
            pageStart: cms.line.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.line.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_line'));
        pageCount = pager.pageCount;
        cms.line.setTableStyle('#tbList_line', '#tbHeader_line');
        
        return true;
    }
};

cms.line.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    //rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '线路编号', style:[['width','100px']]};
    rowData[cellid++] = {html: '线路名称', style:[['width','150px']]};
    rowData[cellid++] = {html: '排序编号', style:[['width','60px']]};
    rowData[cellid++] = {html: '登录显示', style:[['width','60px']]};
    rowData[cellid++] = {html: '服务器数量', style:[['width','80px']]};
    rowData[cellid++] = {html: '设备数量', style:[['width','60px']]};
    rowData[cellid++] = {html: '描述', style:[['width','200px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.line.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strLineName = '<a class="link" onclick="cms.line.showEditServerLineWin(\'edit\',\'' + dr.id + '\');">' + cms.util.fixedCellWidth(dr.name, 120, true, dr.name) + '</a>';
    var strCheckBox = dr.id == '1' ? '<div class="chb-disabled"></div>' : '<input type="checkbox" value="' + dr.id + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    //rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: dr.code, style:[['width','100px']]};
    rowData[cellid++] = {html: strLineName, style:[['width','150px']]};
    rowData[cellid++] = {html: dr.sortOrder, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.isDisplay == 1 ? '显示' : '不显示', style:[['width','60px']]};
    rowData[cellid++] = {html: dr.serverCount, style:[['width','80px']]};
    rowData[cellid++] = {html: dr.deviceCount, style:[['width','60px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.remark, 200, true, dr.remark), style:[['width','200px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.line.setTableStyle = function(tb, tbHeader){
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
};

cms.line.showPage = function(page){
    cms.line.pageIndex = parseInt(page, 10);
    cms.line.getServerLine();
};

cms.line.showEditServerLineWin = function(action, id){
    timerPlayStop(true);
    var boxH = 280;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '服务器线路信息',
        width: 360,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: cms.line.zindex[0],
        callBack: cms.line.editServerLine
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var line = {id:'',name:'',code:'', remark:'', sortOrder: 0, isDisplay: 1};
    
    if(action == 'edit'){
        var urlparam = 'action=getServerLineInfo&id=' + id;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/server.aspx',
            data: urlparam,
            error: function(jqXHR, textStatus, errorThrown){
                module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR){
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                }
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(1 == jsondata.result){
                    var li = jsondata.line;
                    line.id = li.id;
                    line.code = li.code;
                    line.name = li.name;
                    line.sortOrder = li.sortOrder;
                    line.isDisplay = li.isDisplay;
                    line.remark = li.remark;
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);
                }
            }
        });
    }
    
    var strHtml = ''
        + '<div class="p-5-10">'
        + '<input id="txtLineId_LineForm" type="hidden" value="' + line.id + '" />'
        + '<input id="txtAction_LineForm" type="hidden" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        /*
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>线路编号：','class="tdr"'),
            cms.util.buildTd('<input id="txtLineCode_LineForm" type="text" class="txt w120" maxlength="32" value="' + line.code + '" /> 数字，从0开始')
        ])
        */
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>线路编号：','class="tdr"'),
            cms.util.buildTd('<select id="ddlLineCode_LineForm" class="select w240" style="width:246px;"></select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>线路名称：','class="tdr"'),
            cms.util.buildTd('<input id="txtLineName_LineForm" type="text" class="txt w240" maxlength="64" value="' + line.name + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>排序编号：','class="tdr"'),
            cms.util.buildTd('<select id="ddlSortOrder_LineForm" class="select w240" style="width:246px;"></select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>登录显示：','class="tdr"'),
            cms.util.buildTd('<select id="ddlIsDisplay_LineForm" class="select w240" style="width:246px;"></select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('线路描述：','class="tdr" style="vertical-align:top;"'),
            cms.util.buildTd('<textarea id="txtRemark_LineForm" type="text" class="txt w240" maxlength="32" style="height:60px;" ' + '>' + line.remark.toValue() + '</textarea>')
        ])
        + '</table>'
        
        + '</div>';

    config.html = strHtml;
    var pwobj = cms.box.win(config);
    cms.util.fillNumberOptions(cms.util.$('ddlLineCode_LineForm'), 0, 9, parseInt(line.code, 10), 1);
    cms.util.fillNumberOptions(cms.util.$('ddlSortOrder_LineForm'), 0, 9, parseInt(line.sortOrder, 10), 1);
    var arrDisplay = [['1','显示'],['0','不显示']];
    cms.util.fillOptions(cms.util.$('ddlIsDisplay_LineForm'), arrDisplay, line.isDisplay);
    
    //cms.util.$('txtLineCode_LineForm').focus();
    cms.util.$('ddlLineCode_LineForm').focus();
};

cms.line.editServerLine = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_LineForm').val();
        //var lineCode = $('#txtLineCode_LineForm').val().trim();
        var lineCode = $('#ddlLineCode_LineForm').val().trim();
        var lineName = $('#txtLineName_LineForm').val().trim();
        var sortOrder = $('#ddlSortOrder_LineForm').val().trim();
        var isDisplay = $('#ddlIsDisplay_LineForm').val().trim();
        var remark = $('#txtRemark_LineForm').val().trim();
        if(lineCode.equals('')){
            cms.box.msgAndFocus(cms.util.$('ddlLineCode_LineForm'), {id: boxId, title: '提示信息', html: '请选择线路编号。'});
            return false;
        } else if(lineName.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtLineName_LineForm'), {id: boxId, title: '提示信息', html: '请输入线路名称。'});
            return false;
        }
        var urlparam = '';
        if(strAction == 'edit'){
            var id = $('#txtLineId_LineForm').val();
            urlparam = 'action=editServerLine&id=' + id + '&lineCode=' + lineCode + '&lineName=' + escape(lineName)
                + '&sortOrder=' + sortOrder + '&isDisplay=' + isDisplay + '&remark=' + escape(remark);
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/server.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var jsondata = data.toJson();//eval('(' + data + ')');
                    if(jsondata.result == 1){
                        cms.line.getServerLine();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '线路信息已修改。'}, true);
                    } else if(jsondata.result == -2){
                        cms.box.msgAndFocus(cms.util.$('txtLineName_LineForm'),{id: boxId, title: '提示信息', html: '已存在相同名称的线路信息。'}, true);                        
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                    }
                }
            });
        } else {
            urlparam = 'action=addServerLine&lineCode=' + lineCode + '&lineName=' + escape(lineName)
                + '&sortOrder=' + sortOrder + '&isDisplay=' + isDisplay + '&remark=' + escape(remark);
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/server.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var jsondata = data.toJson();//eval('(' + data + ')');
                    if(jsondata.result == 1){
                        cms.line.getServerLine();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '线路信息已添加。'}, true);
                    } else if(jsondata.result == -2){
                        cms.box.msgAndFocus(cms.util.$('txtLineName_LineForm'),{id: boxId, title: '提示信息', html: '已存在相同名称的线路信息。'}, true);                      
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                    }
                }
            });
        }
    } else {
        pwobj.Hide();
    }
};

cms.line.showDeleteServerLineWin = function(){
    timerPlayStop(true);
    var uc = cms.jquery.getCheckBoxChecked('#tbList_line').length;
    var lineIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_line');
     if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择要删除的线路！'}, true);
        timerPlayStop(false);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个线路。<br />'
            + '删除后不可恢复，您确定要删除选中的线路信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除线路信息',
            html: strHtml,
            callBack: cms.line.deleteServerLine,
            returnValue: {
                lineIdList: lineIdList
            }
        });
    }
};

cms.line.deleteServerLine = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var lineIdList = pwReturn.returnValue.lineIdList;
        var urlparam = 'action=deleteServerLine&lineIdList=' + lineIdList;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/server.aspx',
            data: urlparam,
            error: function(jqXHR, textStatus, errorThrown){
                module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR){
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                }
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    cms.line.getServerLine();
                    cms.box.alert({id: boxId, title: '提示信息', html: '线路信息已删除。'}, true);
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);
                }
                pwobj.Hide();
            }
        });
    } else {
        pwobj.Hide();
    }
};