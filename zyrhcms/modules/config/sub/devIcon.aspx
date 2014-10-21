<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="devIcon.aspx.cs" Inherits="modules_config_sub_devIcon"%>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyTitle"><span class="title"></span><span id="reload" class="reload"></span></div>
    <div id="bodyContent">
        <div class="form">
            <form id="Form1" action="" runat="server" method="post">                
                <strong>设备ICON图标</strong>
                <label style="color:#008000;margin-left:50px;border:solid 1px #f50;padding:3px 5px;display:none;" id="tip"></label>
                <div id="divIcon" style="max-width:585px;">
                    <div class="listheader">
                    <table cellpadding="0" cellspacing="0" class="tbheader" style="width:560px;width:auto;">
                        <tr style="height:25px;">
                            <td style="width:30px;">序号</td>
                            <td style="width:80px;">设备类型</td>
                            <td style="width:150px;">离线图标</td>
                            <td style="width:150px;">在线图标</td>
                            <td style="width:150px;">报警图标</td>
                        </tr>
                    </table>
                    </div>
                    <div class="list" style="max-height:300px; overflow:auto;">
                        <table id="tbIcon" cellpadding="0" cellspacing="0" class="tblist" style="width:560px;width:auto;"></table>
                    </div>
                </div>
                
                <div style="padding:10px 0;clear:both;">
                    <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                    <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                    <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                </div>
                <br />
                <input type="hidden" runat="server" id="txtIconData" />
                <input type="hidden" runat="server" id="txtIconList" />
                <input type="hidden" runat="server" id="txtIconPath" />
                <a class="btn btnc24" onclick="save();"><span class="w65">确认，保存</span></a>
                <label class="chb-label-nobg" style="margin-left:125px;"><input type="checkbox" id="chbInitial" runat="server" class="chb" /><span>初始化</span></label>
                <a class="btn btnc24" onclick="initialIcon(this);" style="margin:0 5px 0 5px;"><span>核对设备类型</span></a>
                <span style="color:#999;">当新增加或删除设备类型后，请点击“核对设备类型”。</span>
                
                <input id="btnSave" type="submit" value="submit" runat="server" onserverclick="btnSave_ServerClick" style="visibility:hidden;width:0;height:0;" />
                <br />
                <input id="btnInitial" type="button" value="初始化图标" runat="Server" onserverclick="btnInitial_ServerClick" style="visibility:hidden;width:0;height:0;" />
            </form>
        </div>
    </div>
    <div id="bodyBottom">
        <div class="panel-left" style="width:80%;"><span id="lblError" runat="server"></span></div>
        <div class="panel-right"></div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<script type="text/javascript">
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
        
        showDeviceIcon();
    });
    
    $(window).resize(function(){
    
    });
    
    function showDeviceIcon(){
        var strIcon = $$('txtIconData').val().trim();
        
        var jsondata = strIcon.toJson();
        
        var objList = cms.util.$('tbIcon');
        var rid = 0;
        
        cms.util.clearDataRow(objList, 1);
        for(var i=0,c=jsondata.length; i<c; i++){
            var dr = jsondata[i];
            var row = objList.insertRow(rid);
            var rowData = [];
            var cellid = 0;
            var arrIcon = dr.icon;
            var arr = [0, 1, 2];
            
            var strInput = '<input type="hidden" name="txtType" value="' + dr.type + '" />';
            var strButton = '';
            
            rowData[cellid++] = {html: (i+1), style:[['width','30px']]};
            rowData[cellid++] = {html: dr.type + strInput, style:[['width','80px']]};
            
            for(var m=0; m<arr.length; m++){
                var hasIcon = false;
                var strImg = '';
                for(var j=0; j<arrIcon.length; j++){
                    if(arrIcon[j].status == arr[m]){
                        var id = dr.type + '_' + arrIcon[j].status;
                        strImg = '<img src="' + cmsPath + arrIcon[j].path + '" id="img_' + id + '" style="float:left;display:block;" />';
                        strInput = '<input type="hidden" name="txtIcon' + '" lang="' + dr.type + ',' + arrIcon[j].status + '" id="txt_' + id + '" value="' + arrIcon[j].path + '" />'
                            + '<input type="hidden" name="txtOldIcon' + '" id="txtOld_' + id + '" value="' + arrIcon[j].path + '" />';
                        strButton = '<a class="btn btnc22" id="btnCancel_' + id + '" style="margin:5px 0 0 5px;display:none;float:right;" onclick="cancel(\'' + id + '\',\'' + arrIcon[j].path + '\');"><span>撤消</span></a>'
                            + '<a class="btn btnc22" style="margin:5px 0 0 0;float:right;" onclick="showUpdateIconWin(\'' + id + '\',\'' + arrIcon[j].path + '\');"><span>修改图片</span></a>';
                        rowData[cellid++] = {html: strImg + strInput + strButton, style:[['width','140px'],['padding','2px 5px']]};
                        hasIcon = true;
                        break;
                    }
                }
                if(!hasIcon){
                    rowData[cellid++] = {html: '-', style:[['width','140px']]};                
                }
            }
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
    }
    
    function showUpdateIconWin(id, filePath){
        var config = {
            title: '上传图片',
            html: cms.util.path + '/modules/config/sub/iconUpload.aspx?filePath=' + filePath + '&' + new Date().getTime(),
            requestType: 'iframe',
            width: 400,
            height: 260,
            noBottom: true,
            callBack: updateIconCallBack,
            returnValue: id
        };
        cms.box.win(config);
    }
    
    function updateIconCallBack(pwobj, pwReturn){
        var id = pwReturn.returnValue;
        var obj = cms.util.$('txt_' + id);
        var path = $$('txtIconPath').val().trim();
        if(path != ''){
            obj.value = path;
            cms.util.$('img_' + id).src = cmsPath + path;
            $('#btnCancel_' + id).show();
            
            $('#tip').html('温馨提示：图片文件已修改，请尽快保存！');
            $('#tip').show();
        }
        pwobj.Hide();
    }
    
    function setFilePath(path){
        $$('txtIconPath').attr('value', path);
    }
    
    function cancel(id){
        var config = {
            title: '提示信息',
            html: '确定要撤消吗？',
            callBack: cancelCallBack,
            returnValue: id
        };
        cms.box.confirm(config);
    }
    
    function cancelCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var id = pwReturn.returnValue;
            var path = $('#txtOld_' + id).val().trim();
            $('#txt_' + id).attr('value', path);
            
            cms.util.$('img_' + id).src = cmsPath + path;
            $('#btnCancel_' + id).hide();
        }
        pwobj.Hide();
    }
    
    function getIconList(){
        var arrIcon = cms.util.$N('txtIcon');
        var strIconList = '';
        for(var i=0,c=arrIcon.length; i<c; i++){
            if(i > 0){
                strIconList += '|';
            }
            strIconList += arrIcon[i].lang + ',' + arrIcon[i].value.trim()
        }
        $$('txtIconList').attr('value', strIconList);
        return strIconList;
    }
    
    
    function save(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var config = {
            title: '提示信息',
            html: '确定要保存吗？',
            callBack: saveCallBack
        };
        cms.box.confirm(config);
    }
    
    function saveCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            getIconList();
            $$('btnSave').click();
        }
        pwobj.Hide();
    }
    
    function initialIcon(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var isInitial = page.$('chbInitial').checked;
        var config = {
            title: '提示信息',
            html: (isInitial ? '<span style="color:#f00;">执行初始化将会删除所有已经上传的设备ICON图标，且不可恢复。<br /></span>' : '') + '确定要核对设备类型吗？',
            callBack: initialIconBack
        };
        cms.box.confirm(config);
    }
    
    function initialIconBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnInitial').click();
        }
        pwobj.Hide();
    }
</script>
</asp:Content>