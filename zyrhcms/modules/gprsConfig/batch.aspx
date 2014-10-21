<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="batch.aspx.cs" Inherits="modules_gprsConfig_batch" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">
        var isBatch = true;
    </script>
    <style type="text/css">
    .explain{color:#999;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyContent">
		<div id="bodyLeft">
			<div class="titlebar"><span class="title">设备列表</span></div>
			<div class="treebox" id="treebox">
			    <div id="divDev" runat="server"></div>
			</div>
			<div class="statusbar" id="statusbar">
			    <a class="btn btnc22" onclick="cms.util.selectCheckBox('chbDevCode', 1);" style="margin-left:5px;"><span>全选</span></a>
			    <a class="btn btnc22" onclick="cms.util.selectCheckBox('chbDevCode', 2);"><span>取消</span></a>
			    <a class="btn btnc22" onclick="cms.util.selectCheckBox('chbDevCode', 3);"><span>反选</span></a>
			</div>
		</div>
		<div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
		<div id="bodyRight">
			<div class="titlebar" id="bodyTitle">
				<span class="title" style="padding-left:9px;">批量操作</span>
			</div>
			<div id="bodyPrompt" class="operbar" style="display:none;"><div class="title" style="padding-left:10px;"></div></div>
			<div class="gprsConfigForm" id="bodyForm">
			    <div style="padding:5px 10px;">
			        <input type="hidden" id="txtDevCodeList" runat="server" />
			        <span class="explain">
			        说明：手动/自动 功能只有50105和50107的设备才有，其他类型的设备即使选中了也会被自动过滤掉。
			        </span>
			        <ul>
			            <li>
			                <a class="btn btnc22" onclick="setPatrolMode(this,1);"><span class="w40">手动</span></a>
			                <span class="explain">打开3G主机及云台电源</span>
			            </li>
			            <li>
			                <a class="btn btnc22" onclick="setPatrolMode(this,0);"><span class="w40">自动</span></a>
			                <span class="explain">定时自动打开3G，执行抓拍任务后自动关闭</span>
			            </li>
			        </ul>
			    </div>
			</div>
			<div id="taskbar" style="background:#fff; overflow:hidden;"></div>
		</div>
	</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprsConfig/gprsConfig.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprsConfig/gprsConfigFrame.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gprsConfig/gprsConfigTask.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
var isDebug = module.checkIsDebug();
$(window).load(function(){
    //不显示提示信息栏
    gprsConfig.frame.promptHeight = 0;
    
    module.showDebugBox(null, {position:7,x:0,y:1});
    module.hideDebugBox();
    
    if(isDebug){
        $('#bodyRight .titlebar').append('<a name="windebug" class="ibtn nobg" id="btnDebug" onclick="module.showDebugBox();" style="float:right;margin-right:2px;"><i class="icon-debug"></i></a>');
    }
    
    gprsConfig.frame.setBodySize();
    gprsConfig.frame.initialForm();
	gprsConfig.task.initial();
	
	//设置快捷键
	gprsConfig.frame.setFrameByShortcutKey();
});

$(window).resize(function(){
    gprsConfig.frame.setBodySize();
});

function getDevCodeList(){
    var strDevCodeList = cms.util.getCheckBoxCheckedValue('chbDevCode',',');// $$('txtDevCodeList').val().trim();
    
    return strDevCodeList;
}

function setPatrolMode(btn, setting){
    var strDevCodeList = getDevCodeList();
    if('' == strDevCodeList){
        cms.box.alert({title:'提示信息', html:'请在左边栏选择设备'});
        return false;
    }
    var config = {
        id: '',
        title: '提示信息',
        html: '确定要设置巡检模式为' + (1 == setting ? '手动' : '自动') + '吗？',
        callBack: setPatrolModeAction,
        returnValue: {
            btn: btn,
            setting: setting,
            devCodeList: strDevCodeList
        }
    };
    
    cms.box.confirm(config);
}

function setPatrolModeAction(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var btn = pwReturn.returnValue.btn;
        var strSetting = pwReturn.returnValue.setting;
        var strDevCodeList = pwReturn.returnValue.devCodeList;
        
        if(!module.checkControlDisabled(btn)){
            return false;
        }
        
        var urlparam = 'action=setPatrolMode&devCode=%s&setting=%s&batch=1'.format([strDevCodeList, strSetting], '%s');
        module.appendDebugInfo(module.getDebugTime() + '[setPatrolMode Request] urlparam: ' + urlparam);
        module.ajaxRequest({
            url: cmsPath + '/ajax/gprsSetting.aspx',
            data: urlparam,
            callBack: setPatrolModeCallBack,
            param: {
                btn: btn,
                setting: strSetting
            }
        });
    }
    pwobj.Hide();
}

function setPatrolModeCallBack(data, param){
    module.appendDebugInfo(module.getDebugTime() + '[setPatrolMode Response] data: ' + data);
    module.setControlDisabledByTiming(param.btn, false);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    for(var i=0; i<jsondata.list.length; i++){
        var id = jsondata.list[i];
        gprsConfig.task.appendTaskList({id:id, action:'setPatrolMode', title:'设置巡检模式：' + (param.setting == 1 ? '手动' : '自动'), result:'正在设置，请稍候...'});
    }
}
</script>
</asp:Content>