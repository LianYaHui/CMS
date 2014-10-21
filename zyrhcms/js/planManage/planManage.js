var planManage = planManage || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 240;
var rightWidth = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 1025;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'unit';
var treeTitle = '组织机构';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var tabs = [
    {code: 'planManage', name: '预案管理', load: false}
    //{code: 'planType', name: '预案类型', load: false}
];
//当前页面类型
var pageType = 'planManage';
//加载JS
var jsLoaded = {};

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    
    setLeftDisplay($('#bodyLeftSwitch'));
    
    setBodySize();
    cms.frame.setPageBodyDisplay();
        
    initialForm();
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth, '');
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    
    setBodySize();

    //加载数据 延时50ms
    window.setTimeout(getDataContent, 50, pageType);
        
    cms.frame.setFrameByShortcutKey();
});

$(window).resize(function(){
    cms.frame.setFrameSize();
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (tabs[i].code == pageType ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#listBox_' + tabs[i].code + '"><span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        
        var strHtml = '<div id="listBox_' + tabs[i].code + '" class="listbox" ' + (tabs[i].code == pageType ? '':' style="display:none;"') + '>'
            + '<div id="listHeader_' + tabs[i].code + '" class="listheader"></div>'
            + '<div id="listContent_' + tabs[i].code + '" class="list scrollbar"></div>'
            + '</div>';

        $('#listBoxPanel').append(strHtml);
        $('#statusBar').append('<span id="pagination_' + tabs[i].code + '" class="pagination"></span>');
        
        $('#listHeader_' + tabs[i].code).html(cms.util.buildTable('tbHeader_' + tabs[i].code,'tbheader'));
        $('#listContent_' + tabs[i].code).html(cms.util.buildTable('tbList_' + tabs[i].code,'tblist'));
        
    }
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    showTools(pageType);
    
    cms.jquery.tabs('.operbar .tabpanel', null, '.listbox', 'gotoPage');
};


var showTools = function(type){
    $('.left-tools').html('');
    $('.right-tools').hide('');
    $('.left-tools').css('margin-left', '60px');
    $('.toolbar').hide();
    switch(type){
        case 'planManage':
            $('.left-tools').html(buildTools(type));
            if($('.right-tools').html() == ''){
                $('.right-tools').css('float', 'right');
                //先不显示搜索表单条件
                //$('.right-tools').html(buildTools('search'));
                $('#txtKeywords').focus(function(){
                    if(cms.device.checkKeywords(this)){
                        $(this).attr('value','');
                    }
                });
                $('#ddlType').change(function(){
                    switch($(this).val()){
                        case 'name':
                            if(cms.device.checkKeywords('#txtKeywords')){
                                $('#txtKeywords').attr('value', cms.device.arrKeys.name);
                            }
                            break;
                        case 'indexcode':
                            if(cms.device.checkKeywords('#txtKeywords')){
                                $('#txtKeywords').attr('value', cms.device.arrKeys.indexcode);
                            }
                            break;
                    }
                });
            }
            $('.right-tools').show();
            if($('#toolbar_' + type).html() == ''){
                $('#toolbar_' + type).html(buildCon(type));
            }
            $('#toolbar_' + type).show();
            break;
    }
};

var buildTools = function(type){
    var strTools = '';
    switch(type){
        case 'tree':
            strTools = '<a class="ibtn nobg" title="刷新" onclick="refreshTreeMenu();"><i class="icon-update"></i></a>'
                + '<a class="ibtn nobg" title="添加" onclick="cms.organize.showAddUnitWin();"><i class="icon-add"></i></a>'
                + '<a class="ibtn nobg" title="编辑" onclick="cms.organize.showEditUnitWin();"><i class="icon-edit"></i></a>'
                + '<a class="ibtn nobg" title="删除" onclick="cms.organize.showDeleteUnitWin();"><i class="icon-delete"></i></a>'
                + '<a class="ibtn nobg" title="向上排序"><i class="icon-up"></i></a>'
                + '<a class="ibtn nobg" title="向下排序"><i class="icon-down"></i></a>';
            break;
        case 'planManage':
            strTools = '<a class="btn imgbtn" onclick="planManage.showEditPlanWin(\'add\');"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn" onclick="planManage.showDeletePlanWin();"><i class="icon-delete"></i><span>删除</span></a>';
            break;
        case 'search':
            strTools = '<select id="ddlType" class="select w85" style="margin-right:1px;">'
                + '<option value="name">按预案名称</option>'
                + '</select>'
                + '<input id="txtKeywords" type="text" class="txt w125" maxlength="25" value="输入要查找的预案名称" />'
                + '<a onclick="loadData();" class="btn btnsearch"></a>'
                + '<a onclick="loadAllData();" class="btn btnsearch-cancel"></a>';
            break;        
    }
    return strTools;
};

var buildCon = function(type){
    var strHtml = '';
    switch(type){
        case 'planManage':
            strHtml = '<label for="showChild_device" class="chb-label" style="_width:100px;">'
                + '<input type="checkbox" id="showChild_device" onclick="planManage.getDeviceList();" class="chb" /><span>显示下级部门预案</span>'
                + '</label>';
            break;
    }
    return strHtml;
};

var gotoPage = function(rval){
    pageType = rval.action;
    $('#statusBar .pagination').hide();
    $('#statusBar #pagination_' + pageType).show();
    showTools(rval.action);
    
    //切换TAB时，判断是否已加载TAB项内容
    if(!tabs[cms.jquery.getTabItem(tabs, pageType)].load){
        getDataContent(pageType);
    } else {
        return false;
    }
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);

    setBoxSize();
};

var setBoxSize = function(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);      
    }
    $('.listbox').height(boxSize.height - 25*2 - 28);
    $('.listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25*2 - 28 - 23);

};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtCurUnitId').attr('value', param.unitId);
            $('#txtCurUnitName').attr('value', param.unitName);
            $('#txtNodeId').attr('value', param.nid);
            break;
    }
    if(isUnitChanged()){
        $('#txtOldUnitId').attr('value', $('#txtCurUnitId').val());
        //改变组织机构时，设置TAB项内容为未加载
        $.each(tabs, function(i, o){
            o.load = false;
        });
    }
    getDataContent(pageType);
};

var isUnitChanged = function(){
    return $('#txtOldUnitId').val() != $('#txtCurUnitId').val();
};

var getDataContent = function(pageType){
    switch(pageType){
        case 'planManage':
            planManage.pageIndex = planManage.pageStart;
            planManage.getResponsePlanList();
            break;
    }
    tabs[cms.jquery.getTabItem(tabs, pageType)].load = true;
    
    showLoading(false);
};

planManage.getResponsePlanList = function(){
    var urlparam = 'action=getResponsePlanList&pageIndex=' + (pageIndex - pageStart) + '&pageSize=' + pageSize;
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/planManage.aspx',
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
            planManage.showListHeader();
            planManage.showResponsePlanInfo(jsondata);
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

planManage.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_planManage');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = planManage.buildListHeader();
    cms.util.fillTable(row, rowData);
};

planManage.showResponsePlanInfo = function(jsondata){
    var objList = cms.util.$('tbList_planManage');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, planManage.pageSize);
    if(planManage.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        planManage.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            var strParam = "{serverId:'" + dr.serverId + "',serverName:'" + dr.serverName + "',typeId:'" + dr.typeId + "',typeName:'" + dr.typeName + "'"
                + ",serverIp:'" + dr.serverIp + "',serverPort:'" + dr.serverPort + "'" + "}";
            
            row.lang = strParam;
            
            rowData = planManage.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: pageIndex,
            pageSize: pageSize,
            pageStart: pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'planManage.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_planManage'));
        pageCount = pager.pageCount;
        
        planManage.setTableStyle('#tbList_planManage', '#tbHeader_planManage');
        
        return true;
    }
};

planManage.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '预案名称', style:[['width','400px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

planManage.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strPlanName = '<a class="link" onclick="planManage.showEditPlanWin(\'edit\',\'' + dr.id + '\');">' + cms.util.fixedCellWidth(dr.name, 400, true, dr.name) + '</a>';
    var strCheckBox = '<input type="checkbox" name="chbPlanId" value="' + dr.id + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: strPlanName, style:[['width','400px'],['textAlign','left']]};
    rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

planManage.setTableStyle = function(tb, tbHeader){
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
        cms.jquery.selectCheckBox('#tbList_planManage');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
};

planManage.showPage = function(page){
    pageIndex = parseInt(page, 10);
    planManage.getResponsePlanList();
};

//显示加载
var showLoading = function(show){
    if(show){
        $("#loading").show();
        $("#loading").html("正在加载数据，请稍候...");
    }
    else{
        $("#loading").hide();
    }
};


planManage.showEditPlanWin = function(action, id){
    var isEdit = action == 'edit' && id > 0;
    var size = [720, 500];
    var strHtml = cms.util.path + '/modules/safety/planEdit.aspx?action=' + action + '&id=' + id;
    var config = {
        id: 'pwPlanEdit',
        title: isEdit ? '编辑预案' : '新增预案',
        html: strHtml,
        boxType: 'iframe',
        requestType: 'iframe',
        noBottom: true,
        width: size[0],
        height: size[1],
        minAble: true,
        maxAble: true,
        showMinMax: true,
        filter: false,
        callBack: planManage.winCloseCallBack
    };
    
    var pwobj = cms.box.win(config);    
};

planManage.winCloseCallBack = function(pwobj, pwResult){
    pwobj.Hide();
    planManage.getResponsePlanList();
};

planManage.showDeletePlanWin = function(){
    var planIdList = cms.util.getCheckBoxCheckedValue('chbPlanId');
    if(!loginUser.userName.equals('admin')){        
        cms.box.alert({title:'提示信息', html:'只有系统管理员可以删除预案。'});
        return false;
    }
    if(planIdList.equals(string.empty)){
        cms.box.alert({title:'提示信息', html:'请选择要删除的预案信息。'});
        return false;
    }
    var strHtml = '删除后不可恢复，确定要删除选中的预案信息吗？';
    var config = {
        id: 'pwPlanDelete',
        title: '删除预案',
        html: strHtml,
        boxType: 'confirm',
        callBack: planManage.deleteResponsePlan,
        returnValue: planIdList
    };
    
    var pwobj = cms.box.win(config); 
};

planManage.deleteResponsePlan = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var planIdList = pwReturn.returnValue;
        var urlparam = 'action=deleteResponsePlan&planIdList=' + planIdList;
        $.ajax({
            type: "post", 
            //async: false, //同步
            datatype: 'json',
            url: cms.util.path + '/ajax/planManage.aspx',
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
                    cms.box.alert({title:'提示信息', html:'预案信息已删除。'});
                }
                planManage.getResponsePlanList();
            },
            complete: function(XHR, TS){ 
                XHR = null; 
                if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
            }
        });
    } else {
        pwobj.Hide();
    }
};