var cms = cms || {};
cms.frame = cms.frame || {};

cms.frame.haveHeader = $('#pageTop').attr('id') !== undefined;
cms.frame.showHeader = true;
cms.frame.topHeightConfig = [90, 34, 0];
try{
    cms.frame.topHeight = cms.frame.haveHeader ? 90 : 0;
}catch(ex){
    cms.frame.topHeight = 90;
}

cms.frame.leftWidthConfig = 200;
cms.frame.leftWidth = 200;
cms.frame.rightWidthConfig = 150;
cms.frame.rightWidth = 150;
cms.frame.borderWidth = 2;
cms.frame.switchWidth = 5;

cms.frame.showLeft = true;
cms.frame.showRight = true;
//是否满屏显示主要内容
cms.frame.fullScreen = false;

cms.frame.frameSize = {};

//快捷键回调函数
cms.frame.resizeCallBackFunc = null;

//是否已执行resize事件，解决IE多次resize事件影响
cms.frame.resize = 0;

if($('#switchHeader').attr('id') !== undefined){
    $('#switchHeader').attr('title', '隐藏顶部');
    $('#switchHeader').click(function(){
        cms.frame.setHeaderDisplay($(this));
    });
}

var loadBanner = function(){
    try{
        //原来是用CSS设置的，但为了处理缓存问题，采用JS设置
        if(typeof imgTopBanner == 'string'){
            $('#topBanner').css('background','url("' + cms.util.path + '/skin/default/images/' + imgTopBanner + '") no-repeat left 0');
        }
    }catch(e){}
};

loadBanner();

cms.frame.setFrameSize = function(wLeft, wRight, resizeFunc){
    var bodySize = cms.util.getBodySize();
    if(cms.frame.haveHeader){
        $('#pageTop').height(cms.frame.topHeight);
    } else {
        cms.frame.topHeight = 0;
    }
    cms.frame.frameSize = {width: bodySize.width, height: bodySize.height - cms.frame.topHeight};
    
    if(wLeft !== undefined){
        cms.frame.leftWidthConfig = wLeft;
        cms.frame.leftWidth = wLeft;
    }
    if(wRight !== undefined){
        cms.frame.rightWidthConfig = wRight;
        cms.frame.rightWidth = wRight;
    }
    if(typeof resizeFunc == 'function'){
        cms.frame.resizeCallBackFunc = resizeFunc;
    }
};

cms.frame.getFrameSize = function(){
    var bodySize = cms.util.getBodySize();
    return {width:bodySize.width, height: bodySize.height - cms.frame.topHeight};
};

cms.frame.getBoxSize = function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.hasTop = cms.frame.objExist($('#pageTop'));
    
    var boxSize = {
        width: bodySize.width - cms.frame.leftWidth - cms.frame.borderWidth, 
        height: bodySize.height - cms.frame.borderWidth - (cms.frame.hasTop ? cms.frame.topHeight : 0)
    };
    return boxSize;
};

cms.frame.setHeaderDisplay = function(objSwitch){
    if(!cms.frame.haveHeader) return false;
    if(objSwitch == undefined){
        cms.frame.topHeight = cms.frame.topHeightConfig[cms.frame.fullScreen ? 2 : 1];
        cms.frame.showHeader = false;
        if(cms.frame.resizeCallBackFunc != null){
            cms.frame.resizeCallBackFunc();
        }
    } else {
        objSwitch = objSwitch || $('#switchHeader');
        var hasSwitch = cms.frame.objExist(objSwitch);
        if (hasSwitch) { objSwitch.removeClass(); }
        if(cms.frame.showHeader){
            cms.frame.topHeight = cms.frame.topHeightConfig[cms.frame.fullScreen ? 2 : 1];
            cms.frame.showHeader = false;
            if(hasSwitch){
                objSwitch.addClass('switch-header-close');
                objSwitch.attr('title', '显示顶部\r\nShift + T');
                $('#switchExit').show();
            }
        } else {
            cms.frame.topHeight = cms.frame.topHeightConfig[0];
            cms.frame.showHeader = true;  
            if(hasSwitch){
                objSwitch.addClass('switch-header');
                objSwitch.attr('title', '隐藏顶部\r\nShift + T');
                $('#switchExit').hide();
            }
        }    
        cms.frame.setFrameSize();
        
        if(cms.frame.resizeCallBackFunc != null){
            cms.frame.resizeCallBackFunc();
        }
    }
};

cms.frame.setLeftDisplay = function(objTarget, objSwitch){
    if(!cms.frame.objExist(objTarget)) return false;
    var hasSwitch = cms.frame.objExist(objSwitch);
    if(hasSwitch){objSwitch.removeClass();}
    //objTarget.toggle();
    if(cms.frame.showLeft){
        cms.frame.showLeft = false;
        cms.frame.leftWidth = 0;
        objTarget.hide();
        if(hasSwitch){
            objSwitch.addClass('switch-right');
            objSwitch.attr('title', '显示左栏菜单\r\nShift + L');
        }
    } else {
        cms.frame.showLeft = true;
        cms.frame.leftWidth = cms.frame.leftWidthConfig;
        objTarget.show();
        if(hasSwitch){
            objSwitch.addClass('switch-left');
            objSwitch.attr('title', '隐藏左栏菜单\r\nShift + L');
        }
    }
    if(cms.frame.resizeCallBackFunc != null){
        cms.frame.resizeCallBackFunc();
    }
};

cms.frame.setRightDisplay = function(objTarget, objSwitch){
    if(!cms.frame.objExist(objTarget)) return false;
    var hasSwitch = cms.frame.objExist(objSwitch);
    if(hasSwitch){objSwitch.removeClass();}
    //objTarget.toggle();
    if(cms.frame.showRight){
        cms.frame.showRight = false;
        cms.frame.rightWidth = 0;
        objTarget.hide();
        if(hasSwitch){
            objSwitch.addClass('switch-left');
            objSwitch.attr('title', '显示右栏菜单\r\nShift + R');
        }
    } else {
        cms.frame.showRight = true;
        cms.frame.rightWidth = cms.frame.rightWidthConfig;
        objTarget.show();
        if(hasSwitch){
            objSwitch.addClass('switch-right');
            objSwitch.attr('title', '隐藏右栏菜单\r\nShift + R');
        }
    }
    if(cms.frame.resizeCallBackFunc != null){
        cms.frame.resizeCallBackFunc();
    }
};

cms.frame.setFullScreen = function(isFull, resizeFunc){
    if(isFull !== undefined && isFull != null){
        cms.frame.fullScreen = !isFull;
    } else {
        cms.frame.fullScreen = true;
        var arrObj = [[cms.frame.haveHeader, cms.frame.showHeader], [cms.frame.objExist($('#bodyLeft')), cms.frame.showLeft], [cms.frame.objExist($('#bodyRight')), cms.frame.showRight]];
        for(var i=0; i<arrObj.length; i++){
            if(arrObj[i][0] && arrObj[i][1]){
                cms.frame.fullScreen = false;
                break;
            }
        }
    }
    cms.frame.showHeader = cms.frame.showLeft = cms.frame.showRight = !cms.frame.fullScreen;
    cms.frame.fullScreen = !cms.frame.fullScreen;
    
    cms.frame.setLeftDisplay($('#bodyLeft'), $('#bodyLeftSwitch'));
    cms.frame.setRightDisplay($('#bodyRight'), $('#bodyRightSwitch'));
    cms.frame.setHeaderDisplay($('#switchHeader'));
};

cms.frame.setPageBodyDisplay = function(show){
    if(show || show === undefined){
        $('#pageBody').show();
    } else {
        $('#pageBody').hide();
    }
};

cms.frame.objExist = function(obj){
    return obj.attr('id') !== undefined
};

cms.frame.setFrameByShortcutKey = function(callBack){
    if(callBack == null || callBack == undefined){
        callBack = {};
    } else {
        if(typeof callBack.resizeFunc == 'function'){
            cms.frame.resizeCallBackFunc = callBack.resizeFunc;
        }
    }
    document.onkeyup = function(e){
        var e = e||event;
        if(19 == e.keyCode){
            if(typeof callBack.keyFunc == 'function'){
                callBack.keyFunc(e.keyCode);
            }
        } else {
            //当同时按下 Shift + L 键，即触发左栏菜单隐藏/显示
            if(e.shiftKey){
                switch(e.keyCode){
                    case 70: //F fullscreen
                        cms.frame.setFullScreen();
                        break;
                    case 76: //L left
                        cms.frame.setLeftDisplay($('#bodyLeft'), $('#bodyLeftSwitch'));
                        break;
                    case 82: //R right
                        cms.frame.setRightDisplay($('#bodyRight'), $('#bodyRightSwitch'));
                        break;
                    case 84: //T top
                        cms.frame.setHeaderDisplay($('#switchHeader'));
                        break;
                    default:
                        if(typeof callBack.shiftKeyFunc == 'function'){
                            callBack.shiftKeyFunc(e.keyCode);
                        }
                        break;
                }
            }
        }
    }
};