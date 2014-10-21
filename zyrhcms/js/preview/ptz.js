cms.ptz = cms.ptz || {};
cms.ptz.speed = {min:1, max:7, ini:1, val:4};
cms.ptz.bar = null;
cms.ptz.isInitial = true;
cms.ptz.btnAction = ['press', 'release'];
cms.ptz.curAction = cms.ptz.btnAction[1];

cms.ptz.arrButton = [
    {type: 'left-up', enable: 0, module:1, cmd: 8, action: [1, 2], name: '云台左上转'},
    {type: 'up', enable: 1, module:1, cmd: 1, action: [1, 2], name: '云台上转'},
    {type: 'right-up', enable: 0, module:1, cmd: 5, action: [1, 2], name: '云台右上转'},
    {type: 'left', enable: 1, module:1, cmd: 3, action: [1, 2], name: '云台左转'},
    {type: 'auto', enable: 0, module:1, cmd: 9, action: [1, 2], name: '云台自动转'},
    {type: 'right', enable: 1, module:1, cmd: 4, action: [1, 2], name: '云台右转'},
    {type: 'left-down', enable: 0, module:1, cmd: 7, action: [1, 2], name: '云台左下转'},
    {type: 'down', enable: 1, module:1, cmd: 2, action: [1, 2], name: '云台下转'},
    {type: 'right-down', enable: 0, module:1, cmd: 6, action: [1, 2], name: '云台右下转'},
    
    {type: 'wiper', id: 'btnPtzWiper', enable: 1, module:2, cmd: 16, action:[1, 2], name: ['打开雨刷','关闭雨刷'], txt: '雨刷'},
    {type: 'light', id: 'btnPtzLight', enable: 1, module:2, cmd: 17, action:[1, 2], name: ['打开灯光','关闭灯光'], txt: '灯光'},
    {type: 'heat', id: 'btnPtzHeat', enable: 1, module:2, cmd: 18, action:[1, 2], name: ['打开加热','关闭加热'], txt: '加热'}
];

cms.ptz.arrAction = [
    {type: 'focus-near', enable: 1, module:1, cmd: 10, action: [1, 2], name: '镜头放大', txt: '放大'},
    {type: 'focus-far', enable: 1, module:1, cmd: 11, action: [1, 2], name: '镜头缩小', txt: '缩小'},
    {type: 'zoom-in', enable: 1, module:1, cmd: 12, action: [1, 2], name: '镜头聚焦', txt: '聚焦'},
    {type: 'zoom-out', enable: 1, module:1, cmd: 13, action: [1, 2], name: '镜头散焦', txt: '散焦'},
    {type: 'iris-large', enable: 1, module:1, cmd: 14, action: [1, 2], name: '光圈增大', txt: '增大'},
    {type: 'iris-small', enable: 1, module:1, cmd: 15, action: [1, 2], name: '光圈减小', txt: '减小'},
    {type: '', enable: 0, module:1, action: [0, 2], name: '', txt: ''},
    {type: '', enable: 0, module:1, action: [0, 2], name: '', txt: ''}
];

cms.ptz.buildPtzForm = function(){
    var strHtml = '';
    var strAction = '';
    var strId = '';
    var strBtn = '';
    strHtml += '<ul class="ptz-btn-form">';
    for(var i=0,c=cms.ptz.arrButton.length; i<c; i++){
        var btn = cms.ptz.arrButton[i];
        if(btn.enable == 1){
            strId = btn.id != undefined ? ' id="' + btn.id + '" ' : '';
            if(btn.module == 1){
                strAction = ' onmousedown="cms.ptz.ptzControl(event,' + btn.cmd + ',' + btn.action[0] + ',\'' + cms.ptz.btnAction[0] + '\',\'' + btn.name + '\',this, false);"  '
                    + ' onmouseup="cms.ptz.ptzControl(event,' + btn.cmd + ',' + btn.action[1] + ',\'' + cms.ptz.btnAction[1] + '\',\'' + btn.name + '\',this, false);"  ';
                strBtn = '<a class="ptz-icon" ' + strId + ' rel="' + cms.ptz.btnAction[0] + '" ' + strAction + '><i class="ptz-' + (btn.type) + '"></i></a>';            
            } else {
                strAction = ' onclick="cms.ptz.ptzControl(event,' + btn.cmd + ',' + btn.action[0] + ',this.rel, this.title, this, true);"  ';
                strBtn = '<a class="ptz-icon" ' + strId + ' lang="' + btn.action + ',' + btn.name + '" rel="' + cms.ptz.btnAction[0] + '" title="' + btn.name[0] + '" ' + strAction + '>'
                    + '<i class="ptz-' + (btn.type) + '">' + (btn.txt != undefined? btn.txt : '') + '</i>'
                    + '</a>';
            }
        } else {
            strBtn = '<span class="ptz-none"></span>';
        }
        strHtml += '<li class="' + ((i+1) % 3 == 0 ? 'rli' : 'li') + '">' + strBtn + '</li>';
    }
    strHtml += '</ul>';
    strHtml += '<ul class="ptz-btn-lr">';
    
    for(var i=0,c=cms.ptz.arrAction.length; i<c; i++){
        var btn = cms.ptz.arrAction[i];
        if(btn.enable == 1){
            var strTitle = '';
            strId = btn.id != undefined ? ' id="' + btn.id + '" ' : '';
            if(btn.module == 1){
                strAction = ' onmousedown="cms.ptz.ptzControl(event,' + btn.cmd + ',' + btn.action[0] + ',\'' + cms.ptz.btnAction[0] + '\',\'' + btn.name + '\',this, false);"  '
                    + ' onmouseup="cms.ptz.ptzControl(event,' + btn.cmd + ',' + btn.action[1] + ',\'' + cms.ptz.btnAction[1] + '\',\'' + btn.name + '\',this, false);"  ';
                strTitle = btn.name;
            } else {
                strAction = ' onclick="cms.ptz.ptzControl(event,' + btn.cmd + ',' + btn.action[0] + ',this.rel,\'' + btn.name + '\',this, true);"  ';
            }
            strBtn = '<a class="ptz-icon-' + (i % 2 == 0 ? 'left' : 'right') + '" ' + strId + strAction + ' rel="' + cms.ptz.btnAction[0] + '" title="' + strTitle + '">'
                + '<i class="ptz-' + (btn.type) + '">' + (btn.txt != undefined? btn.txt : '') + '</i>'
                + '</a>';
        } else {
            strBtn = '<span class="ptz-none-' + (i % 2 == 0 ? 'left' : 'right') + '"></span>';
        }
        strHtml += '<li style="float:left;">' + strBtn + '</li>';
    }
    strHtml += '</ul>';
    
    $('#ptzPanel').html(strHtml);
    
    strHtml = null;
    delete strHtml;
    
    cms.ptz.ptzButtonHover($('.ptz-icon-left'), false);
    cms.ptz.ptzButtonHover($('.ptz-none-left'), false);
    $('.ptz-icon-left').hover(    
        function() { cms.ptz.ptzButtonHover($(this), true); },
        function() { cms.ptz.ptzButtonHover($(this), false); }
    );
    $('.ptz-icon-right').hover(    
        function() { cms.ptz.ptzButtonHover($(this).parent().prev().children(), true); },
        function() { cms.ptz.ptzButtonHover($(this).parent().prev().children(), false); }
    );
    
    //$('#mainTitle').append('<span id="lblPrompt" style="float:right;"></span>');
};

cms.ptz.ptzButtonHover = function(obj, hover){
    obj.css('border-right',hover ? 'solid 1px #4aa0e8' : 'solid 1px #8d9fab');
};

cms.ptz.ptzControl = function(ev, cmd, action, param, name, obj, isSwitch){
    if(!cms.preview.checkDevice()){
        //alert('请在左边树菜单中选择设备并双击设备名称');
        return false;
    }
    var previewOcx = cms.preview.previewOcx;
    var result = '';
    if(isSwitch){
        action = cms.ptz.setButtonStatus(obj, obj.rel == cms.ptz.btnAction[0]);
    } else {
        /*
        if(param == cms.ptz.btnAction[1]){
            document.onmouseup = function(){
                result = cms.ptz.ptzControlAction(previewOcx, parseInt(cmd, 10), action, param, name, obj);
            };
        }
        */
    }
    result = cms.ptz.ptzControlAction(previewOcx, parseInt(cmd, 10), action, param, name, obj);
};

//云台控制
cms.ptz.ptzControlAction = function(previewOcx, cmd, action, param, name, obj){
    var camera = cms.preview.getWinDevData();
    var previewOcx = cms.preview.previewOcx;
    if(camera.devCode == ''){
        //return false;
    }  
    if(param.equals(cms.ptz.btnAction[0])){
        //按下
        cms.ptz.curAction = cms.ptz.btnAction[0];
    } else {
        //释放
        cms.ptz.curAction = cms.ptz.btnAction[1];
    }
    //加热功能需要调用预置点
    switch(cmd){
        case 18:
            if(1 == action){
                //alert('打开 加热 需要设置预置点128、预置点103');
                cms.preset.setPreset(128);
                cms.preset.setPreset(103);
            } else if(2 == action){
                //alert('关闭 加热 需要调用预置点103');
                cms.preset.callPreset(103);            
            }
            break;
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PtzControl Request] iPtzCmd: ' + cmd + ', iPtzAction: ' +  action + ', iPtzParam: ' + cms.ptz.speed.val
        + ', 备注：' + (action == 1 ? '开始' : '停止') + name);
    //云台控制
    var result = cms.ocx.ptzControl(previewOcx, cmd, action, cms.ptz.speed.val);
    
    //设置播放窗口设备数据云台控制按钮状态
    cms.preview.setWinDevDataForPtzAction(cmd, action);
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PtzControl Response] return: ' + cms.ocx.showErrorCode(result));
    return result;
};

//更改云台速度
cms.ptz.changePtzSpeed = function(num, objId){
    var obj = cms.util.$(objId);
    obj.value = num;
    cms.ptz.speed.val = num;
    if(!cms.preview.checkDevice()){
        if(!cms.ptz.isInitial){
            //alert('请在左边树菜单中选择设备通道并双击设备通道名称');
        }
        return false;
    }
};

//云台速度滑动条 步进 控制
cms.ptz.steppingPtzSpeed = function(num){
    cms.ptz.bar.stepping(num);
};

cms.ptz.buildPtzSpeed = function(){
    var strTitle = '云台速度';
    var strHtml = '<div style="padding:5px 0;overflow:hidden;">'
        + '<table cellpadding="0" cellspacing="0" style="margin:0 auto;">';
     strHtml += '<tr style="height:27px;">'
            + '<td><a class="btn-icon-sub" title="' + strTitle + '" onclick="cms.ptz.steppingPtzSpeed(-1);" style="margin-right:5px;"></a></td>'
            + '<td><div id="ptzSpeed"></div></td>'
            + '<td><a class="btn-icon-add" title="' + strTitle + '" onclick="cms.ptz.steppingPtzSpeed(1);" style="margin-left:5px;"></a></td>'
            + '</tr>';
    strHtml += '</table><input type="hidden" id="txtPtzSpeed" readonly="readonly" class="txt w20" /></div>';
    
    $('#ptzSpeedBox').html(strHtml);
    
    cms.ptz.bar = new SliderBar(cms.util.$('ptzSpeed'),
        {
            id:'sb_ptzSpeed', width:150, min:cms.ptz.speed.min, defaultValue:cms.ptz.speed.val, title:strTitle, max:cms.ptz.speed.max, limit:{},border:'none',
            callBack:cms.ptz.changePtzSpeed, returnValue:'txtPtzSpeed', moveCall:false
        }
    );
    cms.ptz.isInitial = false;
};

cms.ptz.unloadControl = function(){
    $('#ptzPanel').html('');
    if(cms.ptz.bar != null){
        cms.ptz.bar = null;
        delete cms.ptz.bar;
    }
};

cms.ptz.setPtzButtonStatus = function(param){
    var btnPtzLight = cms.util.$('btnPtzLight');
    var btnPtzWiper = cms.util.$('btnPtzWiper');
    var btnPtzHeat = cms.util.$('btnPtzHeat');    
    if(param != null && typeof param == 'object' && param.devCode != ''){
        cms.ptz.setButtonStatus(btnPtzLight, param.ptzLight);
        cms.ptz.setButtonStatus(btnPtzWiper, param.ptzWiper);
        cms.ptz.setButtonStatus(btnPtzHeat, param.ptzHeat);
    } else {
        cms.ptz.setButtonStatus(btnPtzLight, false);
        cms.ptz.setButtonStatus(btnPtzWiper, false);
        cms.ptz.setButtonStatus(btnPtzHeat, false);
    }
};

cms.ptz.setButtonStatus = function(obj, isPress){
    if(obj != null){
        var arrInfo = obj.lang.split(',');
        var action = 0;
        if(isPress){
            obj.rel = cms.ptz.btnAction[1];
            obj.className = 'ptz-icon-sel';
            action = arrInfo[0];
            obj.title = arrInfo[3];
        } else {
            obj.rel = cms.ptz.btnAction[0];
            obj.className = 'ptz-icon';
            action = arrInfo[1];
            obj.title = arrInfo[2];
        }
        return action;
    }
};