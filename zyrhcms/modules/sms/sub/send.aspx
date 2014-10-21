<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="send.aspx.cs" Inherits="modules_sms_sub_send" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <style type="text/css">
        .explain{color:#999;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyTitle">
        <span class="title"></span><span id="reload" class="reload"></span>
        <div class="tools"></div>
    </div>
    <div id="bodyContent">
        <div class="form" id="bodyForm" style="overflow:auto;padding:5px;">
            <form action="" method="post" onsubmit="sendSms();">
            <table cellpadding="0" cellspacing="0" class="tbform" style="min-width:780px;">
                <tr>
                    <td class="w90" style="vertical-align:top;">手机号码：</td>
                    <td>
                        <input id="txtPhoneNumber" class="txt w500" onchange="checkPhoneNumber(this.value,this);" style="float:left;"/>
                        <label class="chb-label-nobg" style="float:left;margin-left:20px;">
                            <input type="checkbox" class="chb" id="chbDelErrorNumber" value="1" onclick="checkPhoneNumber(cms.util.$('txtPhoneNumber').value, cms.util.$('txtPhoneNumber'));" />
                            <span>自动清除无效号码</span>
                        </label>
                        <label class="chb-label-nobg" id="lblP2P" style="float:left;margin-left:20px;">
                            <input type="checkbox" class="chb" id="chbP2P" value="1" />
                            <span>逐条发送</span>
                        </label>
                        <br />
                        <span class="explain" style="clear:both;">手机号码可以多个，每个之间以英文逗号“,”分隔。</span>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align:top;">短信内容：</td>
                    <td>
                        <textarea id="txtSmsContent" rows="1" cols="1" class="txt" style="width:500px;height:80px;"></textarea>
                        <br />
                        <span class="explain" style="clear:both;" id="lblWordCount"></span>
                    </td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="tbform" style="min-width:780px;display:none;">
                <tr>
                    <td class="w90">数据类型：</td>
                    <td>
                        <label class="chb-label-nobg" style="float:left;width:120px;">
                            <input type="radio" class="chb" name="rbDataType" checked="checked" value="1" />
                            <span>保存到数据库</span>
                        </label>
                        <label class="chb-label-nobg" style="float:left; margin:0 20px 0 50px;">
                            <input type="radio" class="chb" name="rbDataType" value="2" />
                            <span>不保存（透明传输），一般用于测试或紧急短信发送</span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>回复类型：</td>
                    <td>
                        <label class="chb-label-nobg" style="float:left;width:120px;">
                            <input type="radio" class="chb" name="rbResponse" checked="checked" value="1" />
                            <span>回复WebService</span>
                        </label>
                        <label class="chb-label-nobg" style="float:left; margin:0 20px 0 50px;">
                            <input type="radio" class="chb" name="rbResponse" value="2" />
                            <span>不回复（透明传输），一般用于测试或紧急短信发送</span>
                        </label>                    
                    </td>
                </tr>
                <tr>
                    <td>发送方式：</td>
                    <td>
                        <label class="chb-label-nobg" style="float:left;width:120px;">
                            <input type="radio" class="chb" name="rbModel" checked="checked" value="1" onclick="switchSmsSendModel(this.value);" />
                            <span>即时发送</span>
                        </label>
                        <label class="chb-label-nobg" style="float:left; margin:0 20px 0 50px;">
                            <input type="radio" class="chb" name="rbModel" value="2" onclick="switchSmsSendModel(this.value);" />
                            <span>定时发送</span>
                        </label>
                        <div id="divSmsTime" style="display:none;">
                            <span style="float:left;">定时发送时间：</span>
                            <input type="text" id="txtSmsTime" class="txt w120" style="float:left;" />
                            <input type="hidden" id="txtMinDate" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")%>" />
                            <span class="explain" style="margin-left:5px;">默认定时5分钟，可自行修改时间。</span>
                        </div>
                    </td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="tbform" style="min-width:780px;">
                <tr>
                    <td class="w90"></td>
                    <td style="padding-top:20px;">
                        <a class="btn btnc30" id="btnSend" onclick="sendSms(this);"><span class="w80">发送短信</span></a>
                    </td>
                </tr>
            </table>
            </form>
        </div>
        
		<div id="taskbar" style="background:#fff; overflow:hidden;"></div>
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
<script type="text/javascript" src="<%=Public.WebDir%>/js/sms/sms.task.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
    sms.frame = sms.frame || {};    
    sms.frame.taskBoxHeightConfig = [26, 168, 282];
    sms.frame.taskBoxHeight = 168;
    sms.frame.taskBoxWinModeConfig = [0, 1, 2];
    sms.frame.taskBoxWinMode = 1;
    
    //设置任务状态框尺寸 三种模式 0-min,1-normal,2-max
    sms.frame.setTaskBoxSize = function(winMode, btn){
        if(btn != undefined && btn != null){
            switch(sms.frame.taskBoxWinMode){
                case 0:
                    sms.frame.taskBoxWinMode = sms.frame.taskBoxWinModeConfig[winMode == 0 ? 1 : 2];
                    break;
                case 1:
                    sms.frame.taskBoxWinMode = sms.frame.taskBoxWinModeConfig[winMode == 0 ? 0 : 2]; 
                    break;
                case 2:
                    sms.frame.taskBoxWinMode = sms.frame.taskBoxWinModeConfig[winMode == 0 ? 0 : 1];
                    break;
            }
        } else {
            sms.frame.taskBoxWinMode = winMode;
        }        
        cms.util.$('btnTaskWinMin').className = 0 == sms.frame.taskBoxWinMode ? 'win-normal' : 'win-min';
        cms.util.$('btnTaskWinMax').className = 2 == sms.frame.taskBoxWinMode ? 'win-normal' : 'win-max';
        
        sms.frame.setBoxSize();
    };    
    
    sms.frame.setBoxSize = function(){
        var bodySize = cms.util.getBodySize();
        
        sms.frame.taskBoxHeight = sms.frame.taskBoxHeightConfig[sms.frame.taskBoxWinMode];
	    $('#taskbar').height(sms.frame.taskBoxHeight - 1);
    	
	    sms.task.setBoxSize(sms.frame.taskBoxHeight - 1);
	    
	    $('#bodyForm').height(bodySize.height - 25 - 27 - 10 - sms.frame.taskBoxHeight);
    };


    var timing = 0;
    
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
	    sms.task.initial();
	    sms.frame.setBoxSize();
	    
        $("#txtSmsTime").focus(function(){
            var newTime = buildTime();
            
            $("#txtSmsTime").attr('value', newTime);
            
            WdatePicker({skin:'ext',minDate:newTime,dateFmt:'yyyy-MM-dd HH:mm:ss'});
        });
        
        window.setInterval(calculagraph, 1000);
        
        var obj = cms.util.$('txtSmsContent');
        obj.onkeydown = obj.onkeyup = obj.onchange = function(){
            showWordCount(this);
        };
    });
    
    $(window).resize(function(){
	    sms.frame.setBoxSize();    
    });    
    
    //计时器
    function calculagraph(){
        timing++;
    }
    
    function buildTime(){
        var mindate = $("#txtMinDate").val();
        //转换时间
        var newMinDate = new Date(Date.parse(mindate.replace(/-/g, "/")));
        newMinDate.setSeconds(newMinDate.getSeconds() + timing);
        newMinDate.setMinutes(newMinDate.getMinutes() + 5);
        
        return newMinDate.toString();
    }
    
    function switchSmsSendModel(model){
        if(1 == model){
            $('#divSmsTime').hide();
        } else {
            $('#divSmsTime').show();
            $("#txtSmsTime").attr('value', buildTime());
        }
    }
    
    function checkPhoneNumber(val, obj){
        var isDel = $('#chbDelErrorNumber').attr("checked");
        val = val.trim().replaceAll('，', ',');
        if('' == val){
            if(typeof obj == 'object'){
                cms.box.msgAndFocus(obj, {title:'提示信息', html:'请输入手机号码'});
                return false;
            }
        }
        var arr = val.split(',');
        var arrNum = [];
        var pattern = /^(13[0-9]|14[7]|15[^4]|18[0|2|6|8|9])\d{8}$/;
        var num = '';
        
        for(var i=0,c=arr.length; i<c; i++){
            num = arr[i].trim();
            if('' == num){
                continue;
            }
            if(pattern.exec(num)){
                arrNum.push(num);
            } else if(!isDel) {
                if(typeof obj == 'object'){
                    cms.box.msgAndFocus(cms.util.$('txtPhoneNumber'), {title:'提示信息', html:'手机号码格式错误，请检查输入的手机号码！'});
                    obj.focus();
                }
                return false;
            }
        }
        var strResult = arrNum.join(',');
        if(typeof obj == 'object'){
            obj.value = strResult;
        }
        return strResult;
    }
    
    function showWordCount(obj){
        var val = obj.value.trim();
        var len = val.len();
        
        var strHtml = '已输入 %s 个字符'.format(len, '%s');
        $('#lblWordCount').html(strHtml);
    }
    
    function sendSms(btn){
        var phoneNumber = checkPhoneNumber($('#txtPhoneNumber').val().trim(), cms.util.$('txtPhoneNumber'));
        var smsContent = $('#txtSmsContent').val().trim();
        var dataType = parseInt(cms.util.getRadioCheckedValue('rbDataType'), 10);
        var model = parseInt(cms.util.getRadioCheckedValue('rbModel'), 10);
        var smsTime = 2 == model ? $('#txtSmsTime').val().trim() : '';
        var isP2P = $('#chbP2P').attr("checked") ? 1 : 0;
        //alert(phoneNumber + '|' + smsContent + '|' + dataType + '|' + model + '|' + smsTime);
        
        var isPass = false;
        
        if(!phoneNumber){
            return false;
        } else if('' == phoneNumber){
            cms.box.msgAndFocus(cms.util.$('txtPhoneNumber'), {title:'提示信息', html:'请输入手机号码'});
        } else if('' == smsContent){
            cms.box.msgAndFocus(cms.util.$('txtSmsContent'), {title:'提示信息', html:'请输入短信内容'});        
        } else {
            isPass = true;
        }
        
        if(!isPass){
            return false;
        }
        
        if(!module.checkControlDisabled(btn)){
            return false;
        }
        
        var urlparam = 'action=addSmsSend&phoneNumber=%s&smsContent=%s&isP2P=%s'.format([phoneNumber, escape(smsContent), isP2P], '%s');
        
        module.ajaxRequest({
            url: cmsPath + '/ajax/sms.aspx',
            data: urlparam,
            callBack: sendSmsCallBack,
            param: {
                btn: btn,
                phoneNumber: phoneNumber,
                smsContent: smsContent
            }
        });
    }
    
    function sendSmsCallBack(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[sendSms Response] data: ' + data);
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
            var arr = jsondata.param[i].split('_');
            sms.task.appendTaskList({id:id, action:'sendSms', title:'发送短信(手机号码：' + arr[0] + '，短信内容：' + arr[1] + ')', result:'正在发送，请稍候...'});
        }
    }
</script>
</asp:Content>