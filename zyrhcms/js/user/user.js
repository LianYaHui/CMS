cms.user = cms.user || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 200;
var rightWidth = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox-user-001';
//列表框最小宽度
var listBoxMinWidth = 1050;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'unit';
var treeTitle = '组织机构';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var timer = 60;
var time = timer;
var pause = false;
var autoPause = true;
var setPause = false;
var loaded = false;
var enabled = true;

var tabs = [
    {code: 'user', name: '用户', load: false, listBoxWidth: 1050},
    //{code: 'department', name: '部门', load: false, listBoxWidth: 1050},
    {code: 'role', name: '角色', load: false, listBoxWidth: 1050}
];
//当前页面类型
var pageType = 'user';
//加载JS
var jsLoaded = {role: false, department: false};
//数据加载
var dataLoaded = {role: false, deparment: false};

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showDebugBox();
    module.hideDebugBox();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    
    setBodySize();
    
    //加载数据 延时50ms
    window.setTimeout(getDataContent, 50, pageType);
    
    updateTimeBoard(time);
    window.setInterval(timing, 1000);
    
    //默认停止定时刷新
    timerPlayStop(true);
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: shortcutKeyAction, shiftKeyFunc: null});
});

$(window).resize(function(){
    if(cms.frame.resize++ == 0){
        cms.frame.setFrameSize(leftWidth, rightWidth);
    } else {
        cms.frame.setFrameSize();
    }
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    
    if(module.isDebug){
        $('#mainTitle .tools').append('<a class="ibtn" id="btnDebug" title="调试" onclick="showDebugInfo();"><i class="icon-debug"></i></a>');
    }
    
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
    
    if(!jsLoaded.role){
        cms.util.loadJs(cms.util.path + '/js/user/', 'role.js?' + new Date().getTime());
        jsLoaded.role = true;
    }
};

var shortcutKeyAction = function(keyCode){
    timerPlay(cms.util.$('btnTimerPlay'));
};

var showTools = function(type){
    $('.left-tools').html('');
    $('.left-tools').css('margin-left', '60px');
    $('#toolbar').hide();
    switch(type){
        case 'user':
            $('.left-tools').html(buildTools(type));
            if($('#toolbar').html() == ''){
                $('#toolbar').html(buildCon(type));
            }
            $('#toolbar').show();
            break;
        case 'department':
            break;
        case 'role':
            if(!dataLoaded.role){
                cms.role.showListHeader('tbHeader_role', false);
                cms.role.getRoleInfo(true, 'tbList_role');
                dataLoaded.role = true;
            }
            break;
    }
};

var buildTools = function(type){
    var strTools = '';
    switch(type){
        case 'user':
            strTools = '<a class="btn imgbtn" onclick="cms.user.showEditUserWin(\'add\');"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn" onclick="cms.user.showDeleteUserWin();"><i class="icon-delete"></i><span>删除</span></a>';
            break;
        case 'department':
            break;
        case 'role':
            strTools = '<a class="btn imgbtn" onclick=""><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn" onclick=""><i class="icon-delete"></i><span>删除</span></a>';
            break;
    }
    return strTools;
};

var buildCon = function(type){
    var strHtml = '<label for="showChild" class="chb-label" style="_width:100px;">'
        + '<input type="checkbox" id="showChild" onclick="getUserList();" class="chb" /><span>显示下级用户</span>'
        + '</label>'
        + '<select id="ddlStatus" class="select" onchange="getUserList();" style="margin-left:3px;">'
        + '<option value="-1" selected="selected">全部</option>'
        + '<option value="0">正常</option>'
        + '<option value="1">冻结</option>'
        + '<option value="3">过期</option>'
        + (module.checkUserIsFounder() ? '<option value="2">注销</option>' : '')
        + '</select>';
    
    return strHtml;
};

var gotoPage = function(param){
    if(pageType !== param.action){
        time = timer;
    }
    pageType = param.action;
    $('#statusBar .pagination').hide();
    $('#statusBar #pagination_' + pageType).show();
    showTools(param.action);
    
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
    
    setListBoxSize();
};

var getTabsIndex = function(pageType){
    for(var i=0,c=tabs.length; i<c; i++){
        if(tabs[i].code == pageType){
            return i;
        }
    }
};

var setListBoxSize = function(){
    listBoxMinWidth = tabs[getTabsIndex(pageType)].listBoxWidth;
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    }
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
};

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var getDataContent = function(pageType){
    autoPause = true;
    showLoading(true);
    switch(pageType){
        case 'user':
            pageIndex = pageStart;
            getUserList();
            break;
        case 'department':
            break;
        case 'role':
            break;
    }
    tabs[cms.jquery.getTabItem(tabs, pageType)].load = true;
    loaded = true;
    autoPause = false;
    showLoading(false);
};

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtCurUnitId').attr('value', param.unitId);
            $('#txtCurUnitName').attr('value', param.unitName);
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
    return $('#txtOldUnitId').val() !== $('#txtCurUnitId').val();
};

var loadData = function(){
    pageIndex = pageStart;
    getUserList();
};

var getUserList = function(){
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var getChild = $('#showChild').attr('checked') == 'checked' ? 1 : 0;
    var status = $('#ddlStatus').val();
    var expire = -1;
    if(status == '3'){
        status = -1;
        expire = 1;
    }
    var urlparam = 'action=getUserList&unitId=' + unit.id + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize 
        + '&status=' + status + '&expire=' + expire + '&getChild=' + getChild;
        
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetUserList Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/user.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetUserList Response] data: ' + data);
            $('#txtData').attr('value', data);
            var strData = $('#txtData').val();
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            if(1 == jsondata.result){
                showListHeader();
                showUserInfo(jsondata);
                module.appendDebugInfo(module.getDebugTime() + '[ShowUserList Finished]');
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

var showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_user');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = buildListHeader();
    cms.util.fillTable(row, rowData);
};

var showUserInfo = function(jsondata){
    var objList = cms.util.$('tbList_user');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, pageSize);
    if(pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            var strParam = "{userId:'" + dr.userId + "',userName:'" + dr.userName + "',roleId:'" + dr.roleId + "',unitId:'" + dr.unitId + "',status:'" + dr.status + "'}";
            
            row.lang = strParam;
            
            rowData = buildListData(row, dr, rnum);
            
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
            callBack: 'showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_user'));
        pageCount = pager.pageCount;
        
        setTableStyle('#tbList_user', '#tbHeader_user');
        
        return true;
    }
};

var buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '用户名', style:[['width','100px']]};
    rowData[cellid++] = {html: '真实姓名', style:[['width','80px']]};
    rowData[cellid++] = {html: '角色', style:[['width','70px']]};
    rowData[cellid++] = {html: '组织机构', style:[['width','80px']]};
    rowData[cellid++] = {html: '用户状态', style:[['width',' 60px']]};
    rowData[cellid++] = {html: '用户级别', style:[['width',' 60px']]};
    rowData[cellid++] = {html: '手机号码', style:[['width','80px']]};
    rowData[cellid++] = {html: '登录次数', style:[['width','60px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '到期时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '最后登录时间', style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

var buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strUserName = '<a class="link" onclick="showUserDetail(\'' + row.lang.toParam() + '\');">' + cms.util.fixedCellWidth(dr.userName, 100, true, dr.userName) + '</a>';
    var strCheckBox = dr.userName == 'admin' || dr.userId == '1' ? '<div class="chb-disabled"></div>' : '<input type="checkbox" value="' + dr.userId + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: strUserName, style:[['width','100px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.realName, 80, true, dr.realName), style:[['width','80px']]};
    rowData[cellid++] = {html: dr.roleName, style:[['width','70px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.unitName, 80, true, dr.unitName), style:[['width','80px']]};
    rowData[cellid++] = {html: parseUserStatus(dr.status, dr.isExpire), style:[['width',' 60px']]};
    rowData[cellid++] = {html: dr.priority, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.phoneNumber, style:[['width','80px']]};
    rowData[cellid++] = {html: dr.loginTimes, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.updateTime, style:[['width','120px']]};
    rowData[cellid++] = {html: parseExpireTime(dr.expireTime, dr.isExpire), style:[['width','120px']]};
    rowData[cellid++] = {html: dr.lastLoginTime, style:[['width','120px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

var setTableStyle = function(tb, tbHeader){
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
        cms.jquery.selectCheckBox('#tbList_user');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
};

var showPage = function(page){
    pageIndex = parseInt(page, 10);
    getUserList();
};

var showDebugInfo = function(){
    module.showDebugBox();
};

var showUserDetail = function(userInfo){
    if(!userInfo.isJsonData()){
        module.showDataError({html:userInfo, width:400, height:250});
        return false;
    }    
    var user = eval('(' + userInfo + ')');
    cms.user.showEditUserWin('edit', user.userId, user.status);
};

var parseUserStatus = function(status, isExpire){
    switch(status){
        case '0':
            return isExpire == '1' ? '<span class="red">过期</span>' : '正常';
            break;
        case '1':
            return '<span class="red">冻结</span>';
            break;
        case '2':
            return '<span class="red">注销</span>';
            break;
    }
};

var parseExpireTime = function(expireTime, isExpire){
    return isExpire == '1' ? '<span class="red" title="已过期">' + expireTime + '</span>': expireTime;
};


var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
};

cms.user.getExpireTime = function(){
    var expireTime = '';
    var urlparam = 'action=getExpireTime';
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/user.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            expireTime = data;
        }
    });
    return expireTime;
};

cms.user.showEditUserWin = function(action, userId, status){
    timerPlayStop(true);
    var isEdit = action == 'edit';
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var boxH = 460;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '用户信息',
        width: 365,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: 1001,
        callBack: cms.user.editUser
    };
    
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var ui = {
        userId:'', roleId:'', userName:'', realName:'', userPwd:'', priority:'50', timeLimitedPreview: '0', status:'0', phoneNumber:'', email:'', 
        expireTime:cms.user.getExpireTime(), isExpire:'0', sequenceIndex:'0', groupId:'0', cardId:'', description:''
    };
    
    var strDisabled = '';
    var strEnabled = '';
    
    if(isEdit){
        //加载用户信息
        var urlparam = 'action=getUserInfo&userId=' + userId + '&status=' + status;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/user.aspx',
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
                    var user = jsondata.userInfo;
                    ui.userId = user.userId;
                    ui.userName = user.userName;
                    ui.realName = user.realName;
                    ui.userPwd = user.userPwd;
                    ui.phoneNumber = user.phoneNumber;
                    ui.email = user.email;
                    ui.expireTime = user.expireTime;
                    ui.isExpire = user.isExpire;
                    ui.priority = user.priority;
                    ui.timeLimitedPreview = user.timeLimitedPreview;
                    ui.status = user.status;

                    ui.unitId = user.unitId;
                    ui.unitName = user.unitName;
                    
                    ui.roleId = user.roleId;
                    
                    ui.sequenceIndex = user.sequenceIndex;
                    ui.groupId = user.groupId;
                    ui.cardId = user.cardId;
                    ui.description = user.description;
                }
            }
        });
        
        strDisabled = ' disabled="disabled" readonly="readonly" ';
        strEnabled = ui.userName == 'admin' || ui.userId == '1' || ui.status == '2' ? ' disabled="disabled" readonly="readonly" ' : '';
    } else {
        ui.unitId = unit.id;
        ui.unitName = unit.name;
    }
    var strAllowUpdatePwd = isEdit &&  (ui.userName == 'admin' && loginUser.userName !== ui.userName) ? ' disabled="disabled" ' : '';
    var strHtml = '<div class="tabpanel" id="tabUser">'
        + '<a class="cur" lang="info" rel="#tabcon1"><span>基本信息</span></a>'
        + '<a class="tab" lang="role" rel="#tabcon2"><span>隶属关系</span></a>'
        + '</div>'
        + '<div id="tabUserContainer">'
        + '<div class="tabcon" id="tabcon1" style="padding:5px 10px;">'
        + '<input id="txtUserId_UserForm" type="hidden" class="txt w30" value="' + ui.userId + '" />'
        + '<input id="txtUnitId_UserForm" type="hidden" class="txt w30" value="' + ui.unitId + '" />'
        + '<input id="txtRoleId_UserForm" type="hidden" class="txt w30" value="' + ui.roleId + '" />'
        + '<input id="txtUserOldPwd_UserForm" type="hidden" class="txt w30" maxlength="32" value="' + ui.userPwd + '" />'
        + '<input id="txtSequenceIndex_UserForm" type="hidden" class="txt w30" maxlength="32" value="' + ui.sequenceIndex + '" />'
        + '<input id="txtGroupId_UserForm" type="hidden" class="txt w30" maxlength="32" value="' + ui.groupId + '" />'
        + '<input id="txtCardId_UserForm" type="hidden" class="txt w30" maxlength="32" value="' + ui.cardId + '" />'
        + '<input id="txtDescription_UserForm" type="hidden" class="txt w30" maxlength="32" value="' + ui.description + '" />'
        + '<input id="txtAction_UserForm" type="hidden" class="txt w30" maxlength="32" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>组织机构：','class="tdr" style="width:75px;"'),
            cms.util.buildTd('<input type="text" class="txt w200" readonly="readonly" disabled="disabled" value="' + ui.unitName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>用户名：','class="tdr"'),
            cms.util.buildTd('<input id="txtUserName_UserForm" type="text" class="txt w200" maxlength="64" ' + strDisabled + ' value="' + ui.userName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>用户密码：','class="tdr"'),
            cms.util.buildTd('<input id="txtUserPwd_UserForm" type="password" class="txt pwd w200" maxlength="32" ' + strAllowUpdatePwd + ' value="' + ui.userPwd + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>密码确认：','class="tdr"'),
            cms.util.buildTd('<input id="txtUserPwdConfirm_UserForm" type="password" class="txt pwd w200" maxlength="32" ' + strAllowUpdatePwd + ' value="' + ui.userPwd + '" />')
        ])
        /*
        + cms.util.buildTr([cms.util.buildTd('用户级别：','class="tdr"'),
            cms.util.buildTd('<select id="ddlPriority_UserForm" class="select" style="width:206px;">' + strPriority + '</select>')
        ])
        */
        + cms.util.buildTr([cms.util.buildTd('用户级别：','class="tdr"'),
            cms.util.buildTd('<div id="divPriority" style="position:relative;"><input type="text" id="ddlPriority_UserForm" /></div>')
        ])        
        + cms.util.buildTr([cms.util.buildTd('用户状态：','class="tdr"'),
            cms.util.buildTd('<select id="ddlStatus_UserForm" class="select" style="width:206px;" ' + strEnabled + '>' 
            + (ui.status == '2' ? cms.util.buildOptions([['0','正常'],['1','冻结'],['2','注销'],['3','过期']],ui.status) : action == 'edit' ? cms.util.buildOptions([['0','正常'],['1','冻结'],['3','过期']],ui.status) : cms.util.buildOptions([['0','正常'],['1','冻结']],ui.status))
            + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('到期时间：','class="tdr"'),
            cms.util.buildTd('<input id="txtExpireTime_UserForm" type="text" class="txt w200" maxlength="20" readonly="readonly" ' + strEnabled + ' value="' + ui.expireTime + '" onfocus="WdatePicker({skin:\'ext\',minDate:\'2013-01-01 0:00:00\',dateFmt:\'yyyy-MM-dd HH:mm:ss\'});" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('真实姓名：','class="tdr"'),
            cms.util.buildTd('<input id="txtRealName_UserForm" type="text" class="txt w200" maxlength="20" ' + strAllowUpdatePwd + ' value="' + ui.realName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('手机号码：','class="tdr"'),
            cms.util.buildTd('<input id="txtPhoneNumber_UserForm" type="text" class="txt w200" maxlength="20" ' + strAllowUpdatePwd + ' value="' + ui.phoneNumber + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('Email：','class="tdr"'),
            cms.util.buildTd('<input id="txtEmail_UserForm" type="text" class="txt w200" maxlength="64" ' + strAllowUpdatePwd + ' value="' + ui.email + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('限时预览：','class="tdr"'),
            cms.util.buildTd('<select id="ddlTimeLimitedPreivew_UserForm" class="select" style="width:206px;"' + (ui.userId == 1 || ui.userName == 'admin' ? ' disabled="disabled" ' : '') + '></select>')
        ])
        + (action == 'add'? cms.util.buildTr([cms.util.buildTd('','class="tdr"'),
            cms.util.buildTd('<label for="chbContinue_UserForm" class="chb-label-nobg nomp"><input type="checkbox" id="chbContinue_UserForm" class="chb"><span>添加完成后继续添加</span></label>')
        ]) : cms.util.buildTd(''))
        + '</table>'
        + '</div>'
        + '<div class="tabcon" id="tabcon2" style="display:none;">'
        + '<div class="listheader">' + cms.util.buildTable('tbRoleHeader1','tbheader') + '</div>'
        + '<div class="list">' + cms.util.buildTable('tbRoleList1','tblist') + '</div>'
        + '</div>'
        + '</div>';

    config.html = strHtml;
    cms.box.win(config);
    
    var ddl = new DropDownList(cms.util.$('ddlPriority_UserForm'), 'priority', {data:{min:1,max:100}, val:ui.priority,width:204, maxHeight:'160',event:'focus'}, cms.util.$('divPriority'));
    if(!strAllowUpdatePwd.equals('')){
        ddl.setDisabled(true);
    }
    cms.util.setFocusClearBlankSpace(cms.util.$('txtUserName_UserForm'));
    cms.util.setFocusClearBlankSpace(cms.util.$('txtUserPwd_UserForm'));
    cms.util.setFocusClearBlankSpace(cms.util.$('txtUserPwdConfirm_UserForm'));
    
    cms.role.showListHeader('tbRoleHeader1', true);

    //设置限时预览下拉选项
    var objTimeLimit = cms.util.$('ddlTimeLimitedPreivew_UserForm');
    for(var i=0; i<=60; i+=1){
        var str = i == 0 ? '不限时' : i + '分钟';
        cms.util.fillOption(objTimeLimit, i*60, str);
    }
    if(ui.timeLimitedPreview != undefined && ui.timeLimitedPreview != ''){
        objTimeLimit.value = ui.timeLimitedPreview;
    }
    

    if(action !== 'edit'){
        window.setTimeout(cms.role.showRoleInfo, 100, 'tbRoleList1', cms.role.getRoleInfo(false));
        $('#txtUserName_UserForm').focus();
    } else {
        window.setTimeout(cms.role.showRoleInfo, 100, 'tbRoleList1', cms.role.getRoleInfo(false), {roleId: ui.roleId, userId: ui.userId, userName: ui.userName});
    }
    if(ui.isExpire == '1' && ui.status == '0'){
        $('#ddlStatus_UserForm').attr('value', '3');
    }
    cms.jquery.tabs('#tabUser', '#tabUserContainer', '.tabcon', 'cms.user.tabContainerChange');
};

cms.user.tabContainerChange = function(rval){
    //alert(rval.action + ',' + rval.container);
};

cms.user.editUser = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_UserForm').val();
        var roleId = $('#txtRoleId_UserForm').val();
        var unitId = $('#txtUnitId_UserForm').val();
        var userName = $('#txtUserName_UserForm').val().trim();
        var oldPwd = $('#txtUserOldPwd_UserForm').val().trim();
        var userPwd = $('#txtUserPwd_UserForm').val().trim();
        var confirmPwd = $('#txtUserPwdConfirm_UserForm').val();
        var priority = $('#ddlPriority_UserForm').val();
        var timeLimitedPreview = $('#ddlTimeLimitedPreivew_UserForm').val();
        var status = $('#ddlStatus_UserForm').val();
        var expireTime = $('#txtExpireTime_UserForm').val();
        var realName = $('#txtRealName_UserForm').val().trim();
        var phoneNumber = $('#txtPhoneNumber_UserForm').val().trim();
        var email = $('#txtEmail_UserForm').val().trim();
                
        var sequenceIndex = $('#txtSequenceIndex_UserForm').val();
        var groupId = $('#txtGroupId_UserForm').val();
        var cardId = $('#txtCardId_UserForm').val();
        var description = $('#txtDescription_UserForm').val().trim();
        
        var dtNow = new Date();
        var dtExpire = expireTime.toDate();
        
        var patternName = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$/;
        var patternPwd = /^[\w.]{3,25}$/;
        var patternPhone = /^[0]?[1][3-9][0-9]{9}$/;
        var patternEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        
        if(userName.equals('')){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserName_UserForm'), {id: boxId, title: '提示信息', html: '请输入用户名。'});
            return false;
        } else if(userName.len() < 2 || userName.len() > 25){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserName_UserForm'), {id: boxId, html: '用户名长度为2-25个字符，由中英文字母或数字组成，以中英文字母开头。'});
            return false;
        } else if(!patternName.exec(userName)){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserName_UserForm'), {id: boxId, html: '用户名长度为2-25个字符，由中英文字母或数字组成，以中英文字母开头。'});
            return false;
        } else if(userPwd.equals('')){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserPwd_UserForm'), {id: boxId, title: '提示信息', html: '请输入密码。'});
            return false;
        } else if(!patternPwd.exec(userPwd) && !userPwd.equals(oldPwd)){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserPwd_UserForm'), {id: boxId, html: '密码长度为3-25个字符，由英文字母或数字组成。'});
            return false;
        } else if(confirmPwd.equals('')){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserPwdConfirm_UserForm'), {id: boxId, title: '提示信息', html: '请再次输入密码。'});
            return false;
        } else if(!userPwd.equals(confirmPwd)){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtUserPwdConfirm_UserForm'), {id: boxId, title: '提示信息', html: '两次输入的密码不一样。'});
            return false;
        } else if(phoneNumber !== '' && !patternPhone.exec(phoneNumber)){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtPhoneNumber_UserForm'), {id: boxId, title: '提示信息', html: '手机号码格式错误。'});
            return false;
        } else if(email !== '' && !patternEmail.exec(phoneNumber)){
            $('#tabUser a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtEmail_UserForm'), {id: boxId, title: '提示信息', html: 'Email地址格式错误。'});
            return false;
        }
        
        if(status == '3'){
            status = '0';
        }
        
        var urlparam = '';
        
        if(roleId == ''){
            cms.box.alert({id: boxId, title: '提示信息', html: '请为用户添加角色。'}, true);
            $('#tabUser a').eq(1).click();
            return false;
        }
        if(strAction == 'edit'){
            var userId = $('#txtUserId_UserForm').val();
            
            var newPwd = userPwd.equals(oldPwd) ? '' : userPwd;
            
            if(status == '2'){
                $('#tabUser a').eq(0).click();
                cms.box.alert({id: boxId, title: '提示信息', html: '不能编辑已经注销的用户。'}, true);
                return false;
            }
            urlparam = 'action=editUser&userId=' + userId + '&roleId=' + roleId + '&unitId=' + unitId + '&userName=' + escape(userName) 
                + '&userPwd=' + newPwd + '&priority=' + priority + '&timeLimitedPreview=' + timeLimitedPreview + '&status=' + status + '&expireTime=' + expireTime 
                + '&realName=' + escape(realName) + '&phoneNumber=' + phoneNumber + '&email=' + email + '&groupId=' + groupId
                + '&cardId=' + cardId + '&description=' + escape(description);
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/user.aspx',
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
                        getUserList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '用户信息已修改。'}, true);
                        timerPlayStop(false);
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                        timerPlayStop(false);
                    }
                }
            });
        } else {
            if(cms.util.dateCompare(dtExpire, dtNow) < 1){
                $('#tabUser a').eq(0).click();
                cms.box.msgAndFocus(cms.util.$('txtExpireTime_UserForm'), {id: boxId, title: '提示信息', html: '到期时间不得小于当前时间'}, true);
                return false;
            }
            var isContinue = cms.jquery.isChecked('#chbContinue_UserForm');
            urlparam = 'action=addUser&roleId=' + roleId + '&unitId=' + unitId + '&userName=' + escape(userName) 
                + '&userPwd=' + userPwd + '&priority=' + priority + '&timeLimitedPreview=' + timeLimitedPreview + '&status=' + status + '&expireTime=' + expireTime 
                + '&realName=' + escape(realName) + '&phoneNumber=' + phoneNumber + '&email=' + email + '&groupId=' + groupId
                + '&cardId=' + cardId + '&description=' + escape(description);
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/user.aspx',
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
                        getUserList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '用户信息已添加。'}, true);
                        if(isContinue){
                            cms.user.showEditUserWin('add');
                        } else {
                            timerPlayStop(false);
                        }
                    } else if(jsondata.result == -2){
                        $('#tabUser a').eq(0).click();
                        cms.box.msgAndFocus(cms.util.$('txtUserName_UserForm'),{id: boxId, title: '提示信息', html: '用户名已存在。'}, true);
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                        timerPlayStop(false);
                    }
                }
            });
        }    
    } else {
        pwobj.Hide();
        timerPlayStop(false);
    }
};

cms.user.showDeleteUserWin = function(){
    timerPlayStop(true);
    var uc = cms.jquery.getCheckBoxChecked('#tbList_user').length;    
    var userIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_user');
    var status = $('#ddlStatus').val().trim();
    if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择用户！'}, true);
        timerPlayStop(false);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个用户。<br />'
            + '确定要删除选中的用户信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除用户信息',
            html: strHtml,
            callBack: cms.user.deleteUser,
            returnValue: {
                userIdList: userIdList,
                status: status
            }
        });
    }
};

cms.user.deleteUser = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var userIdList = pwReturn.returnValue.userIdList;
        var status = pwReturn.returnValue.status;
        var urlparam = 'action=deleteUser&userIdList=' + userIdList + '&status=' + status;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/user.aspx',
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
                    getUserList();
                    cms.box.alert({id: boxId, title: '提示信息', html: '用户信息已删除。'}, true);
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);
                }
                pwobj.Hide();
                timerPlayStop(false);
            }
        });
    } else {
        pwobj.Hide();
        timerPlayStop(false);
    }
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

var refresh = function(){
    getDataContent(pageType);
};

var updateTimeBoard = function(time){
    $('#timeboard .ts').html(time);
};

//定时器
var timerPlay = function(obj){
    pause = !pause;
    setTimePlay(obj, pause);
};

var setTimePlay = function(obj, pause){
    if(pause){
        $('#' + obj.id + ' i').removeClass();
        $('#' + obj.id + ' i').addClass('icon-stop');
        obj.title = '播放';
    } else {
        $('#' + obj.id + ' i').removeClass();
        $('#' + obj.id + ' i').addClass('icon-play');
        obj.title = '暂停';
    }
};

//计时器
var timing = function(){
    if(loaded){
        $("#timerboard").show();
    }
    if(!pause && !autoPause){
        time -= (time -1 >= 0 && !pause) ? 1 : 0;
        if(time <= 0){
            time = timer;
            autoPause = true;
            
            refresh();
        }
    }
    updateTimeBoard(time);
};

var timerPlayStop= function(stop){
    if(stop){
        if(!pause){
            //停止自动刷新列表
            pause = true;
            setTimePlay(cms.util.$('btnTimerPlay'), pause);
            setPause = true;
        }
    } else {
        if(setPause){
            pause = false;
            setTimePlay(cms.util.$('btnTimerPlay'), pause);
            setPause = false;
        }
    }
};