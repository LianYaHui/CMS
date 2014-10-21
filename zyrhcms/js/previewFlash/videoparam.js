cms.videoparam = cms.videoparam || {};
cms.videoparam.isBatch = false;
//是否启用视频参数设置
cms.videoparam.isEnabled = false;

cms.videoparam.bars = [];
cms.videoparam.barconfig = [
    {type:'brightness', title:'亮度', min:0, max:255, ini:0, val: 128},
    {type:'hue', title:'色调', min:0, max:255, ini:0, val: 128},
    {type:'contrast', title:'对比度', min:0, max:255, ini:0, val: 128},
    {type:'saturation', title:'饱和度', min:0, max:255, ini:0, val: 128}
];
cms.videoparam.isInitial = true;

cms.videoparam.getVideoParam = function(){
    if(!cms.videoparam.isEnabled) return false;
    var camera = cms.preview.getWinDevData();
    if(camera.devCode == ''){
        return false;
    }    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetPicParams Request] szDevId: ' + camera.devCode + ', iChannel: ' + camera.channelNo + ', iSubChann: ' + 0);

    //获得视频图像参数
    var picparam = cms.ocx.getPicParams(cms.preview.previewOcx, camera.devCode, camera.channelNo, 0);
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetPicParams Response] return: ' + picparam  + '\r\n');
    
    try{
        var jsondata = eval('(' + picparam + ')');
        if(0 == jsondata.result){
            var params = jsondata.params;
            for(var id in params){
                cms.videoparam.showVideoParam(id, parseInt(params[id], 10));
            }
        }
    }catch(e){}
};

cms.videoparam.showVideoParam = function(type, val){    
    var cfg = cms.videoparam.barconfig;
    for(var i=0,c=cfg.length; i<c; i++){
        if(type == cfg[i].type){
            cms.videoparam.bars[i].setting(val, false);
            $('#txtVideoParam_' + type).attr('value', val);
            return true;
        }
    }
    return -1;
};

cms.videoparam.changeVideoParam = function(num, objId){
    var obj = cms.util.$(objId)
    obj.value = num;
    var json = eval('(' + obj.lang + ')');
    if(!cms.preview.checkDevice()){
        if(!cms.videoparam.isInitial){
            //alert('请在左边树菜单中选择设备并双击设备名称');
        }
        return false;
    }
    if(!cms.videoparam.isBatch){
        cms.videoparam.setPictureParam();
    }
};

cms.videoparam.setPictureParam = function(){
    if(!cms.videoparam.isEnabled) return false;
    var camera = cms.preview.getWinDevData();
    if(camera.devCode == ''){
        return false;
    }
    var cfg = cms.videoparam.barconfig;
    var strParams = '{';
    for(var i=0,c=cfg.length; i<c; i++){
        var val = $('#txtVideoParam_' + cfg[i].type).val();
        strParams += i > 0 ? ',' : '';
        strParams += '"' + cfg[i].type + '":' + val;
    }
    strParams += '}';
    
    alert(strParams);

    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPicParams Request] szDevId: ' + camera.devCode + ', iChannel: ' + camera.channelNo + ', iSubChann: ' + 0 + ', szParams: ' + strParams);

    //更改视频参数
    var result = cms.ocx.setPicParams(cms.preview.previewOcx, camera.devCode, camera.channelNo, 0, strParams);
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPicParams Response] return: ' + cms.ocx.showErrorCode(result));
    
    cms.videoparam.step = 0;
    
    cms.videoparam.isBatch = false;
};

cms.videoparam.setDefault = function(){
    if(!cms.videoparam.isEnabled) return false;
    cms.videoparam.isBatch = true;
    for(var i=0; i<cms.videoparam.bars.length; i++){
        cms.videoparam.bars[i].setting(cms.videoparam.barconfig[i].val);
    }
    cms.videoparam.setPictureParam();
};

//设置视频参数可用性
cms.videoparam.setEnabled = function(btn){
    if(cms.videoparam.isEnabled){
        btn.className = 'locked';
        btn.title = '启用视频参数';
        cms.videoparam.isEnabled = false;
    } else {  
        btn.className = 'unlock';
        btn.title = '关闭视频参数';
        cms.videoparam.isEnabled = true;
    }
    for(var i=0; i<cms.videoparam.bars.length; i++){
        cms.videoparam.bars[i].disabled(!cms.videoparam.isEnabled);
    }
    if(!cms.videoparam.isEnabled){
        cms.videoparam.isBatch = true;
        for(var i=0; i<cms.videoparam.bars.length; i++){
            cms.videoparam.bars[i].setting(cms.videoparam.barconfig[i].val);
        }
    }
};

cms.videoparam.setParam = function(num, val){
    cms.videoparam.bars[num].setting(cms.videoparam.barconfig[num].val);
};

cms.videoparam.buildVideoParam = function(){
    var strHtml = '<div style="padding:5px 0;overflow:hidden;">'
        + '<table cellpadding="0" cellspacing="0" style="margin:0 auto;">';
    for(var i=0; i<4; i++){
        var num = i+1;
        var cfg = cms.videoparam.barconfig[i];
        strHtml += '<tr style="height:27px;">'
            + '<td><div class="vp-icon vp-' + cfg.type + '" title="' + cfg.title + '"></div></td>'
            + '<td><div id="videoParamBox_' + cfg.type + '"></div></td>'
            + '<td>'
            + '<input type="text" id="txtVideoParam_' + cfg.type + '" style="border:none;background:none;" '
            + ' value="' + cfg.val + '" lang="{type:\'' + cfg.type + '\',num:' + i + '}" readonly="readonly" class="txt w20" />'
            + '</td>'
            + '</tr>';
    }
    strHtml += '</table></div>';
    strHtml += '<div style="text-align:center;">'
        + '<a class="ibtn f-left" style="margin-left:5px;"><span class="locked" title="启用视频参数" onclick="cms.videoparam.setEnabled(this);"></span></a>'
        + '<a class="btn btnc22" onclick="cms.videoparam.setDefault();"><span class="w80">默认值</span></a>'
        + '</div>';
    
    $('#paramBox').html(strHtml);
    
    for(var i=0; i<4; i++){
        var num = i+1;
        var cfg = cms.videoparam.barconfig[i];
        var bar = new SliderBar(cms.util.$('videoParamBox_' + cfg.type),
            {
                id:'sb_' + cfg.type, width:150, min:cfg.min, defaultValue:cfg.val, title:cfg.title, max:cfg.max, limit:{},border:'none',
                callBack:cms.videoparam.changeVideoParam, returnValue:'txtVideoParam_' + cfg.type ,moveCall:false
            }
        );
        if(!cms.videoparam.isEnabled){
            bar.disabled(true);
        }
        cms.videoparam.bars.push(bar);
    }
    cms.videoparam.isInitial = false;
};