<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="sysconfig.aspx.cs" Inherits="modules_param_sysconfig" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <style type="text/css">
        body{background:#fff;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
<form action="" method="post">
    <div id="bodyContent">
        <label id="lblPrompt"></label>
		<table cellpadding="5" cellspacing="0" class="tbform" style="margin:5px 10px;">
		    <tr>
		        <td colspan="3"><b>抓图</b></td>
		    </tr>
		    <tr>
		        <td>保存路径：</td>
		        <td class="w200"><input type="text" class="txt w180" id="txtPictureDir" value="C:\Zyrh\Pictures\" /></td>
		        <td><a class="btn btnc22" onclick="setLocalPath();" style="float:left;"><span class="w40">更改..</span></a></td>
		    </tr>
		    <tr>
		        <td colspan="3"><b>录像</b></td>
		    </tr>
		    <tr>
		        <td>保存路径：</td>
		        <td><input type="text" class="txt w180" id="txtRecordDir" value="C:\Zyrh\Records\" /></td>
		        <td><a class="btn btnc22" onclick="setLocalPath();" style="float:left;"><span class="w40">更改..</span></a></td>
		    </tr>
		</table>
	</div>
	<div><object classid="clsid:396C35AF-313A-4578-AEDF-0C4F18F0DB9E" id="WMPOCX" name="WMPOCX" width="0" height="0"></object></div>
	<div class="statusbar statusbar-h30" style="position:absolute; bottom:0; left:0;">
	    <div id="divLeft" style="float:left;"></div>
	    <div style="float:right;padding-right:5px;">
            <input id="btnReset" type="reset" value="reset" style="visibility:hidden;width:0;height:0;" />
	        <a class="btn btnc24" onclick="setDefaultPath();"><span class="w60">默认配置</span></a>
	        <a class="btn btnc24" onclick="setLocalPath();"><span class="w40">保存</span></a>
	        <a class="btn btnc24" onclick="cancel();"><span class="w40">取消</span></a>
	    </div>
	</div>
	</form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/ocx/ocx.js"></script>
<script type="text/javascript">
    var ocx = null;
    
    $(window).load(function(){
        if(!cms.util.isMSIE){
            $('#lblPrompt').html(checkBrowser());
            return false;
        }
        ocx = cms.util.$('WMPOCX');
        
        module.showOcxDebugBox({width:400,height:240,position:7});
        module.hideOcxDebugBox();
        $('#divLeft').html('<a class="btn btnc24" onclick="module.showOcxDebugBox();" style="margin:0 5px;"><span>调试</span></a>');
        getLocalPath();
    });
    
    function checkBrowser(){
        return '<div style="background:#f1f1f1;color:#f00;height:30px;text-align:center;margin:0 auto;line-height:30px;font-size:12px;">'
            + '提示：本地配置需要调用OCX控件，OCX控件仅支持IE浏览器，请使用IE浏览器。</div>';
    };
    
    function convertChar(str){
        //正则表达式将反斜杠替换成双反斜杠
        //第一个参数 正则表达式会经过一次转换，将\\\\转换为\\ 也就是 \的转义
        return str.replaceAll('\\\\','\\\\');
        /*
        var arr = str.split('\\');
        var rst = [];
        for(var i=0; i<arr.length; i++){
            rst.push(arr[i]);
        }
        return rst.join('\\\\');
        */
    }
    
    function setLocalPath(){
        if(!cms.util.isMSIE){
            $('#lblPrompt').html(checkBrowser());
            return false;
        }
        var picDir = $('#txtPictureDir').val().trim();
        var recDir = $('#txtRecordDir').val().trim();
        if(picDir == '' || recDir == ''){
            cms.box.alert({title: '提示信息', html: '抓图目录或录像目录不得为空'});
            return false;
        }
        var strConfig = '{'
            + '"picdir": "' + convertChar(picDir) + '",'
            + '"recdir": "' + convertChar(recDir) + '"'
            + '}';

        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetConfig Request] strConfig: ' + strConfig);
        var result = cms.ocx.setConfig(ocx, strConfig);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetConfig Response] return: ' + cms.ocx.showErrorCode(result));
    
        return result;
    }
    function getLocalPath(){
        try{
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetConfig Request]');
            var result = cms.ocx.getConfig(ocx);
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetConfig Response] return: ' + result);
            
            var config = result.toJson();// eval('(' + result + ')');
            $('#txtPictureDir').attr('value', config.picdir);
            $('#txtRecordDir').attr('value', config.recdir);
        }catch(e){
            cms.box.alert({title:'错误信息', html: e});
        }
    }
    
    function setDefaultPath(){
        $('#txtPictureDir').attr('value', 'C:\\Zyrh\\Pictures\\');
        $('#txtRecordDir').attr('value', 'C:\\Zyrh\\Records\\');
        
        var strConfig = '{'
            + '"picdir": "C:\\\\Zyrh\\\\Pictures\\\\",'
            + '"recdir": "C:\\\\Zyrh\\\\Records\\\\"'
            + '}';
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetConfig Request] strConfig: ' + strConfig);
        var result = cms.ocx.setConfig(ocx, strConfig);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetConfig Response] return: ' + cms.ocx.showErrorCode(result));
        
        return result;
    }
    
    function cancel(){
        $('#btnReset').click();
    }
</script>
</asp:Content>