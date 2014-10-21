document.oncontextmenu = function() {
	return false;
}

var boxSize = {width: 800, height: 500, bannerHiehgt: 320};
var boxId = 'loginpw';

function setBoxPosition(){
    var bodySize = cms.util.getBodySize();
    var box = cms.util.$('loginBox');
    box.style.marginTop = (bodySize.height < boxSize.height ? (bodySize.height - boxSize.height) : (bodySize.height - boxSize.height) / 2) + 'px';
    box.style.width = (bodySize.width < boxSize.width ? bodySize.width : boxSize.width) + 'px';
};

//设置登录界面背景图片
//原来是用CSS设置的，但为了处理缓存问题，采用JS设置
$('.login-banner').css('background','url("' + cms.util.path + '/skin/default/images/' + imgLoginBg + '") no-repeat center');
    
setBoxPosition();

$(window).load(function() {
    setBoxPosition();
    initial();
    
    if(!cms.util.cookieEnabled()) {
        cms.box.alert({
            title: '提示信息',
            html: '您的浏览器Cookie被禁用，平台功能将无法使用，请开启Cookie功能。<br />谢谢！'
        });
    }
});

$(window).resize(function(){
    setBoxPosition();
});

function initial(){
    var txtName = cms.util.$('txtUserName');
    var txtPwd = cms.util.$('txtUserPwd');
    var ddlLine = cms.util.$('ddlServerLine');
    var txtVCode = cms.util.$('txtVerifyCode');
    var chbRemember = cms.util.$('chbRemember');
    
    //屏蔽 '=,-/\ shift 以及 空格 禁止粘贴;
    cms.util.inputControl(txtName, false);
    cms.util.inputControl(txtPwd, true);
    cms.util.inputControl(txtVCode, true);
    
    var arrObj = [txtName, txtPwd, ddlLine, txtVCode, chbRemember];
    window.setTimeout(cms.util.setKeyEnter, 50, arrObj, 'userLogin');
    
    txtName.onchange = function(){
        checkIsNeedVerifyCode();
    };
    
    getServerLine();
    getUserCookie();
    
    /*
    txtName.onkeydown = function(e){
        var e = e||event;
        //屏蔽 '=,-/\ shift 以及 空格;
        return cms.util.checkFormInput(e, '' + e.keyCode, ['32', '186', '187', '188', '189', '191', '220', '222']);
    };
    txtName.onpaste = function(e){
        return false;
    };
    txtName.focus();
    
    txtPwd.onkeydown = function(e){
        var e = e||event;
        return cms.util.checkFormInput(e, '' + e.keyCode, ['32', '186', '187', '188', '189', '191', '220', '222']);
    };
    txtPwd.onpaste = function(e){
        return false;
    };
    */
    cms.util.setFocusClearBlankSpace(txtName);
    
    txtPwd.onfocus = function(){
        this.select();
        if(this.value.indexOf(' ') >= 0){
            this.value = this.value.trim();
        }
    };
    
    $("input[type=password]").iPass({ 'keyEnterCallBack': userLogin });
};

function getUserCookie(){
    var urlparam = 'action=getUserCookie';
    var result = module.ajaxRequest({
        url: cms.util.path + '/ajax/login.aspx',
        data: urlparam,
        callBack: getUserCookieCallBack
    });
}

function getUserCookieCallBack(data, param){
    if(!data.isJsonData()){
        return false;
    }
    var val = eval('(' + data + ')');
    if(val.length >= 4){
        $('#txtUserName').attr('value', val[0]);
        $('#txtUserPwd').attr('value', val[1]);
        $('#chbRemember').attr('checked', val[3] == '1');
        if(val[2]!= ''){
            $('#ddlServerLine').attr('value', val[2]);
        }
    }
    $('#txtUserName').focus();
    $('#txtUserName').select();
    
    checkIsNeedVerifyCode();
}

//获得登录线路
function getServerLine(val){
    module.ajaxRequest({
        url: cms.util.path + '/ajax/login.aspx',
        data: 'action=getServerLine',
        callBack: getServerLineCallBack,
        param: val
    });
}

function getServerLineCallBack(data, val){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var json = data.toJson();// eval('(' + data + ')');
    
    if (json.result == 1) {
        for(var i=0; i<json.list.length; i++){
            cms.util.fillOption(cms.util.$('ddlServerLine'), json.list[i].id, json.list[i].name);
        }
        if(typeof val == 'number'){
            $('#ddlServerLine').attr('value', val);
        }
    } else if (json.result == -1) {
        if(cms.util.dbConnection(json.error) == 0){
            cms.box.alert({id: boxId, title: '错误信息', html: '数据库连接出现异常，请稍候...', iconType:'error'});
        } 
    } else {
        module.showErrorInfo(json.msg, json.error);
    }
}


function checkIsNeedVerifyCode(){
    var txtName = cms.util.$('txtUserName');
    var userName = txtName.value.trim();
    var urlparam = 'action=checkIsNeedVerifyCode&userName=' + escape(userName);
    module.ajaxRequest({
        url: cms.util.path + '/ajax/login.aspx',
        data: urlparam,
        callBack: checkIsNeedVerifyCodeCallBack,
        param: {}
    });
}

function checkIsNeedVerifyCodeCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.vc){
        showVerifyCode();
    } else {
        $('#trVerifyCode').hide();
    }
}

function showVerifyCode(isUpdate){
    var url = cms.util.path + '/vcode/verifyCode.aspx?' + new Date().getTime();
    
    $('#trVerifyCode').show();
    $('#imgVerifyCode').hide();
    $('#imgVerifyCode').attr('src', url + (isUpdate ? '&' + new Date().getTime() : ''));
    cms.util.setWindowStatus();
    
    $('#imgVerifyCode').click(function(){
        $(this).attr('src', url + '&' + new Date().getTime() );
        cms.util.setWindowStatus();
        checkVerifyCode();
    });
    $('#txtVerifyCode').keyup(function(){
        checkVerifyCode();
    });
    $('#imgVerifyCode').load(function(){
        checkVerifyCode();
        
        $(this).show();
    });
    if($('#txtUserName').val().trim() != '' && $('#txtUserPwd').val().trim() != ''){
        $('#txtVerifyCode').focus();
    }
    $('#lblVerifyCode').removeClass();
    $('#lblVerifyCode').addClass('lbl-none');
}

function checkVerifyCode(){
    var txtVCode = cms.util.$('txtVerifyCode');
    var vcode = txtVCode.value.trim();
    if('' == vcode){
        $('#lblVerifyCode').removeClass();
        $('#lblVerifyCode').addClass('lbl-none');
        return false;
    }
    if(vcode.length < 6){
        $('#lblVerifyCode').removeClass();
        $('#lblVerifyCode').addClass('lbl-error');
        return false;
    }
    var urlparam = 'action=checkVerifyCode&vcode=' + escape(vcode);
    module.ajaxRequest({
        url: cms.util.path + '/ajax/login.aspx',
        data: urlparam,
        callBack: checkVerifyCodeCallBack,
        param: {}
    });
}

function checkVerifyCodeCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    $('#lblVerifyCode').removeClass();
    var jsondata = data.toJson();//eval('(' + data + ')');    
    if(1 == jsondata.result){
        //$('#txtVerifyCode').css('color', '#000800');
        $('#lblVerifyCode').addClass('lbl-right');
    } else {
        //$('#txtVerifyCode').css('color', '#ff0000');
        $('#lblVerifyCode').addClass('lbl-error');
    }
}

function userLogin() {
    var txtName = cms.util.$('txtUserName');
    var txtPwd = cms.util.$('txtUserPwd');
    var chbRemember = cms.util.$('chbRemember');
    var txtVCode = cms.util.$('txtVerifyCode');
    var userName = txtName.value.trim();
    var userPwd = txtPwd.value.trim();
    var lineId = cms.util.$('ddlServerLine').value;
    var vcode = txtVCode.value.trim();
    
    if(userName.equals('')){
        cms.box.msgAndFocus(txtName, {id: boxId, html: '请输入用户名！'});
        return false;
    } else {
        //2-25字符，因有中文，所以设置为2-25位，先检测长度，再正则
        var pattern = /^[a-zA-Z\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5_]{1,24}$/;
                
        if(userName.len() < 2 || userName.len() > 25){
            //alert('长度错误');
            cms.box.msgAndFocus(txtName, {id: boxId, html: '用户名长度为2-25个字符，由中英文字母或数字组成，以中英文字母开头。'});
            return false;
        } else if (!pattern.exec(userName)){
            //alert('格式错误');
            cms.box.msgAndFocus(txtName, {id: boxId, html: '用户名长度为2-25个字符，由中英文字母或数字组成，以中英文字母开头。'});
            return false;
        }
        
        //cms.util.setCookie('userName', userName, 1);
        //cms.util.setCookie('lineId', lineId, 1);
    }
    if(userPwd.equals('')){
        cms.box.msgAndFocus(txtPwd, {id: boxId, html: '请输入密码！'});
        return false;
    } else {
        var pattern = /^[\w.]{3,25}$/;
        if (userPwd.length != 32 && !pattern.exec(userPwd)){
            cms.box.msgAndFocus(txtPwd, {id: boxId, html: '密码长度为3-25个字符，由英文字母或数字组成！'});
            return false;
        }
    }
    if($('#trVerifyCode').is(':visible') && vcode.equals('')){
        cms.box.msgAndFocus(txtVCode, {id: boxId, html: '请输入验证码！'});
        return false;
    }
    var timestamp = new Date().toTimeStamp();
    var isRemember = chbRemember.checked ? 1 : 0;
    userPwd = userPwd.length != 32 ? md5(userPwd) : userPwd;
    var urlparam = 'action=userLogin&userName=' + escape(userName) + '&userPwd=' + userPwd+ '&rememberPwd=' + isRemember
        + '&lineId=' + lineId + '&vcode=' + vcode + '&' + timestamp;
    module.ajaxRequest({
        url: cms.util.path + '/ajax/login.aspx',
        data: urlparam,
        callBack: userLoginCallBack,
        param: {}
    });
}

function userLoginCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var txtName = cms.util.$('txtUserName');
    var txtPwd = cms.util.$('txtUserPwd');
    var txtVCode = cms.util.$('txtVerifyCode');
    
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result == 1){
        //location.href = cms.util.path + '/default.aspx';
        //window.setTimeout(goHome, 5000);
        
        cms.util.setCookie('userInfo', '{user:\'%s\',loginTime:\'%s\'}'.format([txtName.value.trim(), new Date().toString()], '%s'), 12);

        goHome();
    } else if(jsondata.result == -1) {
        if(cms.util.dbConnection(jsondata.error) == 0){
            cms.box.alert({id: boxId, title: '错误信息', html: '数据库连接出现异常，请稍候...', iconType:'error'});
        } else {
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
    } else if(jsondata.result == -2) {
        cms.box.msgAndFocus(txtVCode, {id: boxId, title: '错误信息', html: jsondata.msg, iconType:'error'});
        if(jsondata.vc){
            showVerifyCode();
        }
    } else if(jsondata.result == 2) {
        cms.box.alert({id: boxId, title: '错误信息', html: '用户帐户被冻结', iconType:'error'});
    } else if(jsondata.result == 3) {
        cms.box.alert({id: boxId, title: '错误信息', html: '用户帐户已注销', iconType:'error'});
    } else if(jsondata.result == 4) {
        cms.box.alert({id: boxId, title: '错误信息', html: '用户帐户已过期或受限', iconType:'error'});
    } else {
        cms.box.msgAndFocus(txtName, {id: boxId, title: '错误信息', html: jsondata.msg || '用户名不存在或密码错误', iconType:'error'});
        if(jsondata.vc){
            showVerifyCode();
        }
    }
}

function goHome(){
    location.href = cms.util.path + '/default.aspx';
}