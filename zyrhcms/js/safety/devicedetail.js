var deviceDetail = deviceDetail || {};

deviceDetail.showDeviceDetail = function(action, param){
    var url = '';
    var title = '';
    switch(action.toLowerCase()){
        case 'workplan':
            url = thirdPartyPage.workPlan.format(param.id);
            title = '施工计划详细信息';
            break;
        case 'dutyplan':
            url = thirdPartyPage.dutyPlan.format(param.id);
            title = '值班跟班计划详细信息';
            break;
        case 'tensionlength':
            url = thirdPartyPage.tensionLength.format(param.indexCode);
            title = (param.name != undefined ? param.name : '') + '锚段详细信息';
            break;
        case 'pillar':
            url = thirdPartyPage.pillarInfo.format([param.indexCode, param.parentIndexCode]);
            title = param.name +'支柱详细信息';
            break;
        case 'substation':
            url = thirdPartyPage.subStation.format(param.indexCode);
            title = param.name +'详细信息';
            break;
        case 'questionlibrary':
            url = thirdPartyPage.questionLibrary.format([param.type, param.indexCode]);
            title = param.name + '问题库';
            break;
        case 'deptpreson':
            url = thirdPartyPage.deptPreson.format([param.type, param.indexCode]);
            title = param.name + '人员信息';
            break;
    }
    var size = [param.winWidth||800, param.winHeight||500];
    size = module.checkWinSize(size[0], size[1]);
    var config = {
        id: 'pwDeviceDetail',
        title: title,
        html: url,
        width: size[0],
        height: size[1],
        boxType: 'iframe',
        requestType: 'iframe',
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        lock: false,
        filter: false,
        zindex: 111111
    };
    
    cms.box.win(config);
};

deviceDetail.showWorkPlanDetail = function(id){
    //打开第三方平台施工计划详细信息页面
    deviceDetail.showDeviceDetail('workPlan', {id:id});
};

deviceDetail.showDutyPlanDetail = function(id){
    //打开第三方平台值班跟班计划详细信息页面
    deviceDetail.showDeviceDetail('dutyPlan', {id:id});
};

deviceDetail.showTensionLengthDetail = function(indexCode, name){
    //打开第三方平台锚段详细信息页面
    deviceDetail.showDeviceDetail('tensionLength', {indexCode:indexCode, name: name});
};

deviceDetail.showPillarDetail = function(indexCode, parentIndexCode, name){
    //打开第三方平台支柱详细信息页面
    deviceDetail.showDeviceDetail('pillar', {indexCode:indexCode, parentIndexCode:parentIndexCode, name: name});
};

deviceDetail.showSubstationDetail = function(indexCode, name){
    //打开第三方平台所亭详细信息页面
    deviceDetail.showDeviceDetail('substation', {indexCode:indexCode, name: name});
};

deviceDetail.showQuestionLibraryDetail = function(type, indexCode, name){
    //打开第三方平台问题库详细信息页面
    deviceDetail.showDeviceDetail('questionLibrary', {indexCode:indexCode, type:type, name: name, winWidth:720, winHeight:500});
};

deviceDetail.showDepartmentPresonDetail = function(type, indexCode, name){
    //打开第三方平台部门人员详细信息页面
    deviceDetail.showDeviceDetail('deptPreson', {indexCode:indexCode, type:type, name: name, winWidth:600, winHeight:400});
};