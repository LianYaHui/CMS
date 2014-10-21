var page = page || {};

var pageTopHeight = 25;
var pageBottomHeight = 28;
var bodySize = {};
var boxSize = {};

page.pwLoading = null;

var infoType = {warning:'warning', error:'error', success:'success', disabled:'disabled'};

page.$ = function(id, prefix){
    return module.$(id, prefix);
};

page.showPrompt = function(str, obj, type, autoHide, timing){
    if(obj == undefined){ obj = $$('lblPrompt'); }
    obj.html(str);
    
    if(str != '' && str != undefined){
        obj.show();
        obj.addClass('lbl-' + type);
    } else {
        obj.hide();
        obj.removeClass();
    }
    if(autoHide){
        if(timing != undefined && parseInt(timing,10) > 0){
            timing = parseInt(timing,10);
        } else {
            timing = 5000;
        }
        obj.dblclick(function(){
            page.hidePrompt($(this));
        });
        window.setTimeout('page.hidePrompt($(\'#' + obj.prop('id') + '\'))', timing);
    }
};

page.hidePrompt = function(obj){
    obj.hide();
};

page.loadPage = function(url){
    location.href = url;
    cms.util.setWindowStatus();
};

page.reload = function(){
    var config = {
        title: '刷新',
        html: '确定要刷新（重新加载）当前页面内容吗？',
        callBack: page.reloadCallBack
    };
    cms.box.confirm(config);
};

var pageReload = function(){
    page.reload();
};

page.reloadCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        window.location.href = location.href;
    }
    pwobj.Hide();
};


page.showPromptWin = function(strHtml, strUrl, isClose, callBack){
    var config = {
        title: '提示信息',
        html: strHtml
    };
    
    if(strHtml.indexOf('成功') >= 0 || strHtml.indexOf('完毕') >= 0 || strHtml.indexOf('完成')){
        config.iconType = 'success';
    }
    if(isClose && typeof callBack == 'function'){
        config.callBack = callBack;
    }
    else if(strUrl != ''){
        config.callBack = page.showPromptWinCallBack;
        config.returnValue = {url: strUrl};
    }
    if(!cms.util.isMSIE){
        cms.box.alert(config);
    } else {
        //IE8中会出现这个错误：HTML Parsing Error: Unable to modify the parent container element before the child element is closed (KB927917)
        //所以延时50ms
        window.setTimeout(cms.box.alert, 50, config);
    }
};

page.showPromptWinCallBack = function(pwobj, pwReturn){
    var strUrl = pwReturn.returnValue.url;
    window.location.href = strUrl;
};


$(window).load(function(){
    //清除密码输入框的密码，防止浏览器记住密码
    $$('txtUserPwd').attr('value', '');
    page.setBodySize();
    if(window.location != top.window.location){
        if(parent.hideContextMenu != undefined){
            document.onmousedown = function(){
                parent.hideContextMenu();
            };
        }
    }
    $('#reload').html('<a class="ibtn" onclick="location.reload();" style="margin:1px 1px 0 0;" title="刷新当前页"><i class="icon-refresh"></i></a>');
});

$(window).resize(function(){
    page.setBodySize();
});

page.getBodySize = function() {
    return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
};

page.setBodySize = function(){
    bodySize = page.getBodySize();
    boxSize = bodySize;
    if(0 == bodySize.width){
        return false;
    }
    pageBottomHeight = $('#bodyBottom').length > 0 ? 28 : 0;
    $('#bodyTitle').width(bodySize.width);
    $('#bodyContent').width(bodySize.width);
    $('#bodyContent').height(bodySize.height - pageTopHeight - pageBottomHeight);
    
    try{
        if(setBoxSize != undefined && setBoxSize != null){
            setBoxSize();
        }
    } catch(e){}
};

page.setPageTitle = function(title){
    $('#bodyTitle .title').html(title);
};

page.stringConvertNumber = function (num) {
    if (typeof num == 'number') {
        return num;
    } else {
        return parseInt(num, 10);
    }
};

page.checkWinSize = function (size) {
    var bodySize = cms.util.getBodySize();
    var w = 0;
    var h = 0;
    var type = 0;
    if (typeof size == 'object') {
        if (size.length >= 2) {
            w = page.stringConvertNumber(size[0]);
            h = page.stringConvertNumber(size[1]);
            type = 0;
        } else if (size.width != undefined && size.height != undefined) {
            w = page.stringConvertNumber(size.width);
            h = page.stringConvertNumber(size.height);
            type = 1;
        }
    } else if (typeof size == 'string') {
        var arr = size.split(',');
        if (arr.length >= 2) {
            w = parseInt(arr[0], 10);
            h = parseInt(arr[0], 10);
            type = 2;
        }
    }
    if (w > bodySize.width) {
        w = bodySize.width;
    }
    if (h > bodySize.height) {
        h = bodySize.height;
    }

    return 0 == type ? [w, h] : 1 == type ? { width: w, height: h} : (w + ',' + h);
};