cms.role = cms.role || {};

cms.role.pageStart = 1;
cms.role.pageIndex = cms.role.pageStart;
cms.role.pageSize = 20;

cms.role.getRoleInfo = function(async, tbId){
    var role = null;
    var urlparam = 'action=getRole';
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetRoleList Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        async: async,
        //dataType: 'json',
        url: cms.util.path + '/ajax/user.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetRoleList Response] data: ' + data);
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = data.toJson();//eval('(' + data + ')');
            if(jsondata.result === 1){
                role = jsondata;
                if(async){
                    cms.role.showRoleInfo(tbId, role, null, true);
                }
            }
            module.appendDebugInfo(module.getDebugTime() + '[ShowRoleList Finished]');
        }
    });
    if(!async){
        return role;
    }
};

cms.role.showListHeader = function(tbId, isPop){
    var objHeader = cms.util.$(tbId);
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.role.buildListHeader(isPop);
    cms.util.fillTable(row, rowData);
};

cms.role.showRoleInfo = function(tbId, jsondata, user, showPagination){
    if(jsondata !== null){
        var objList = cms.util.$(tbId);
        var rid = 0;
        var dataCount = jsondata.dataCount;
        var dc = jsondata.list.length;
        var rowData = [];
        
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            var strParam = "{userId:'" + dr.userId + "',userName:'" + dr.userName + "',roleId:'" + dr.roleId + "',unitId:'" + dr.unitId + "'}";
            
            row.lang = strParam;
            
            rowData = cms.role.buildListData(row, dr, rnum, user, !showPagination);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        if(showPagination){
            var config = {
                dataCount: dataCount,
                pageIndex: cms.role.pageIndex,
                pageSize: cms.role.pageSize,
                pageStart: cms.role.pageStart,
                showType: 'nolist',
                markType: 'Symbol',
                callBack: 'cms.role.showPage',
                showDataStat: true,
                showPageCount: false,
                keyAble: true
            };
            var pager = new Pagination();
            pager.Show(config, cms.util.$('pagination_role'));
            pageCount = pager.pageCount;
        }
        
        cms.role.setTableStyle('#' + tbId, null, showPagination);
    }
};

cms.role.buildListHeader = function(isPop){
    var cellid = 0;
    var rowData = [];
    
    //rowData[cellid++] = {html: '<input type="checkbox" id="chbAllRole" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '<div class="chb-disabled"></div>', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '角色名称', style:[['width','100px']]};
    rowData[cellid++] = {html: '描述', style:[['width', isPop ? '200px' : '300px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.role.buildListData = function(row, dr, rid, user, isPop){
    var cellid = 0;
    var rowData = [];
    var strCheckBox = '';
    if(!isPop){
        strCheckBox = '<div class="chb-disabled"></div>';
    }
    else if(user !== undefined){
        var strDisabled = user.userId === '1' || user.userName === 'admin' ? ' disabled="disabled" ': '';
        var strChecked = user.roleId === dr.roleId ? ' checked="checked" ': '';
        strCheckBox = '<input type="checkbox" value="' + dr.roleId + '" ' + strChecked + strDisabled + ' />';
        row.className = 'selected';
    } else {        
        strCheckBox = '<input type="checkbox" value="' + dr.roleId + '" />';
    }
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: dr.roleName, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.description, style:[['width', isPop ? '200px' : '300px'],['textAlign','left'],['textIndent','5px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.role.showPage = function(page){
    cms.role.pageIndex = parseInt(page, 10);
    cms.role.getRoleInfo(true, 'tbList_role');
};

cms.role.setTableStyle = function(tb, tbHeader, multi){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    var chbitems = $(tb + ' tr input[type="checkbox"]');
    if(multi && tbHeader !== null){
        chbitems.click(function() {
            if($(this).attr("checked") === 'checked'){
                $(this).parents('tr').addClass('selected');
            }else{
                $(this).parents('tr').removeClass('selected');
            }
            $(tbHeader + ' #chbAll').attr('checked', chbitems.size() === cms.jquery.getCheckBoxChecked(tb).size());
        });
        
        $(tbHeader + ' #chbAll').click(function(){
            cms.jquery.selectCheckBox('#tbList_role');
        });
    } else {
        chbitems.click(function() {
            if($(this).attr("checked") === 'checked'){
                $(tb + ' tr').removeClass('selected');
                $(this).parents('tr').addClass('selected');
                $(tb + ' tr input[type="checkbox"]').attr('checked', false); 
                $(this).attr('checked', true);
                $('#txtRoleId_UserForm').attr('value', $(this).val());
            }else{
                $(this).parents('tr').removeClass('selected');
                $(tb + ' tr input[type="checkbox"]').attr('checked', false); 
                $('#txtRoleId_UserForm').attr('value', '');
            }
        });
    }
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
};