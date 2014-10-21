var user = user || {};

user.getUserInfo = function(){

};

user.showUserInfo = function(config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||420, config.height||300];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/common/aspx/userinfo.aspx';
	var _config = {
	    id: 'pwUserInfo',
	    title: '用户信息' + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		//noBottom: true,
		filter: false
	};
	return cms.box.win(_config);
};

user.modifyPassword = function(){
    var strHtml = '<div class="pw-modify-pwd"><ul>'
        + '<li><span class="star">*</span><span class="wd">原密码：</span><input type="password" id="txtOldPassword" class="txt pwd" style="width:178px;" maxlength="25" /></li>'
        + '<li><span class="star">*</span><span class="wd">新密码：</span><input type="password" id="txtNewPassword" class="txt pwd" style="width:178px;" maxlength="25" /></li>'
        + '<li><span class="star">*</span><span class="wd">确认密码：</span><input type="password" id="txtConfirmPassword" class="txt pwd" style="width:178px;" maxlength="25" /></li>'
        + '<ul></div>'
        + '<style type="text/css">'
        + '.pw-modify-pwd{padding:12px 10px 0; display:block; overflow:hidden;}'
        + '.pw-modify-pwd li{height:35px;}'
        + '.pw-modify-pwd .star{color:#f00; font-family:Arial;}'
        + '.pw-modify-pwd .wd{width:70px; display:inline-block;}'
        + '</style>';
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    cms.box.form({
        id: 'modifypwd01',
        title: '修改密码' + strFrame,
        html: strHtml,
        width: 300,
        height: 180,
        filter: false,
        //coverOCX: true,
        //bgOpacity: 0.01,
        callBack: user.modifyPasswordAction,
        dragMask: strFrame.equals('')
    });
        
    var arrObj = [];
    arrObj.push(cms.util.$('txtOldPassword'));
    arrObj.push(cms.util.$('txtNewPassword'));
    arrObj.push(cms.util.$('txtConfirmPassword'));
    for(var i=0; i<arrObj.length; i++){        
        cms.util.inputControl(arrObj[i]);
        
        cms.util.setFocusClearBlankSpace(arrObj[i]);
    }
    arrObj[0].focus();    
};

user.modifyPasswordAction = function(pwobj, pwReturn){
    if (pwReturn.dialogResult) {
        var pwd_old = cms.util.$('txtOldPassword');
        var pwd_new = cms.util.$('txtNewPassword');
        var pwd_confirm = cms.util.$('txtConfirmPassword');
        var pattern = /^[\w.]{3,25}$/;    
        
        if (pwd_old.value.trim().equals('')) {
            cms.box.msgAndFocus(pwd_old, {id: 'modifypwd', html: '请输入旧密码！' + cms.box.buildIframe(300, 180)});
            return false;
        } else if (!pattern.exec(pwd_old.value.trim())) {
            cms.box.msgAndFocus(pwd_old, {id: 'modifypwd', html: '密码长度为5-25个字符，由英文字母或数字组成！'});
            return false;
        } else if (pwd_new.value.trim().equals('')) {
            cms.box.msgAndFocus(pwd_new, {id: 'modifypwd', html: '请输入新密码！' + cms.box.buildIframe(300, 180)});  
            return false;  
        } else if (!pattern.exec(pwd_new.value.trim())) {
            cms.box.msgAndFocus(pwd_new, {id: 'modifypwd', html: '密码长度为5-25个字符，由英文字母或数字组成！'});
            return false;
        } else if (pwd_confirm.value.trim().equals('')) {
            cms.box.msgAndFocus(pwd_confirm, {id: 'modifypwd', html: '请再次输入密码！' + cms.box.buildIframe(300, 180)});  
            return false;  
        } else if (!pattern.exec(pwd_confirm.value.trim())) {
            cms.box.msgAndFocus(pwd_confirm, {id: 'modifypwd', html: '密码长度为5-25个字符，由英文字母或数字组成！'});
            return false;
        } else if (!pwd_new.value.trim().equals(pwd_confirm.value.trim())) {
            cms.box.msgAndFocus(pwd_confirm, {id: 'modifypwd', html: '两次输入的密码不一样，请重新输入。'});
            return false;
        }
        
        var urlparam = 'action=modifyPassword&pwd_old=' + pwd_old.value + '&pwd_new=' + pwd_new.value + '&pwd_confirm=' + pwd_confirm.value;
        $.ajax({
            type: 'post',
            //async: false,
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
                    cms.box.confirm({id: 'modifypwd', title: '提示信息', html: '密码修改成功，是否重新登录？',
                        callBack: user.logoutAction,
                        returnValue: {
                            pwobj: pwobj
                        }
                    });
                    pwobj.Hide();
                    return false;
                } else if(jsondata.result == -1){
                    if(cms.util.dbConnection(jsondata.error) == 0){
                        cms.box.alert({id: 'modifypwd', title: '错误信息', html: '数据库连接出现异常，请稍候...', iconType:'error'});
                    } else if(cms.util.userAuth(jsondata.error) == 0){
                        cms.box.alert({id: 'modifypwd', title: '错误信息', html: '用户未登录或已超时', iconType:'error',
                            target: cms.util.path + '/login.aspx',
                            autoClose: true,
                            timeout: 10*1000
                        });
                    }
                } else {
                    cms.box.alert({id: 'modifypwd', title: '提示信息', html: jsondata.msg || '密码修改失败，请稍候再试。'});
                }
            }
        });
    } else {
        pwobj.Hide();
    }
};

user.logout = function(){
    var strHtml = '确定要退出系统吗？';
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var pwobj = cms.box.confirm({
        id: 'pwlogout',
        title: '退出' + strFrame,
        html: strHtml,
        filter: false,
        callBack: user.logoutAction,
        dragMask: strFrame.equals('')
    });
    pwobj.Focus(1);
};

user.logoutAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var urlparam = 'action=logout';
        $.ajax({
            type: 'post',
            datatype: 'text',
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
                    location.href = cms.util.path + '/login.aspx';
                } 
            }
        });
    } else {
        pwobj.Hide();
    }
};