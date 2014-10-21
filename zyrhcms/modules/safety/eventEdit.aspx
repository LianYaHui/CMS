<%@ Page Language="C#" AutoEventWireup="true" CodeFile="eventEdit.aspx.cs" Inherits="modules_safety_eventEdit" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>故障事件</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <style type="text/css">
        body{background:#fff;}
        .tdr{text-align:right;}
        .star{color:#f00; font-style:normal;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div style="background:#dbebfe;padding:0 10px;">
        说明：打“*”项必须填写或选择
        <br />
        <b>事件基本信息</b>
    </div>
    <div style="padding:10px 0 5px;">
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td class="tdr" style="width:80px;"><i class="star">*</i>选择专业：</td>
                <td>
                    <asp:DropDownList ID="ddlProfession" runat="server" CssClass="select w100" onchange="changeEventProfession(this.value);">
                    </asp:DropDownList>
                    <input id="txtEventId" type="hidden" value="0" />
                </td>
                <td class="tdr" style="width:80px;"><i class="star">*</i>发生时间：</td>
                <td style="width:130px;"><input id="txtEventTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")%>" maxlength="19" /></td>
                <td class="tdr" style="width:70px;">严重等级：</td>
                <td><asp:DropDownList ID="ddlLevel" runat="server" CssClass="select w100">
                    </asp:DropDownList></td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform">   
            <tr>
                <td class="tdr" style="width:80px;"><i class="star">*</i>事件标题：</td>
                <td colspan="5">
                    <input type="text" class="txt w400" style="width:485px;" id="txtEventName" />
                </td>
            </tr>
            <tr>
                <td class="tdr" style="vertical-align:top;width:80px;">事件描述：</td>
                <td colspan="5">
                    <textarea rows="" cols="" class="txt" id="txtEventDesc" style="width:485px;height:80px;margin-top:5px;"></textarea>
                </td>
            </tr>
        </table>
        <div style="background:#dbebfe;padding:0 10px; margin:10px 0 5px;">
            <b>设置故障点</b>
        </div>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td class="tdr" style="width:80px;">选择线别：</td>
                <td>
                    <asp:DropDownList ID="ddlLine" runat="server" CssClass="select w100">
                    </asp:DropDownList>
                </td>
                <td class="tdr" style="width:80px;">选择行别：</td>
                <td>
                    <asp:DropDownList ID="ddlUpDown" runat="server" CssClass="select w100">
                    </asp:DropDownList></td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform" id="tbJCW" style="display:none;">
            <tr>
                <td class="tdr" style="width:80px;">公里标：</td>
                <td>
                    <input type="text" id="txtKilometerPost" class="txt w100" style="width:94px;" />(km)
                    <a class="btn btnc22" style="margin-left:5px;" onclick="searchPillarInfo();"><span class="w30">搜索</span></a>
                    <label id="lblSearchPrompt" style="color:#00f;"></label>
                </td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform" id="tbBD" style="display:none;">
            <tr>
                <td class="tdr" style="width:80px;">选择故障点：</td>
                <td>
                    <asp:DropDownList ID="ddlSubstation" runat="server" CssClass="select" onchange="selectEventPlace(this);">
                    </asp:DropDownList></td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td class="tdr" style="width:80px;">故障点信息：</td>
                <td>
                    <input type="text" id="txtEventPlace" class="txt w485" style="width:485px;" readonly="readonly" disabled="disabled" />
                    <input type="hidden" id="txtTensionLengthIndexCode" class="txt" />
                </td>
            </tr>
            <tr>
                <td></td>
                <td><a class="btn btnc22" onclick="setEventPlaceInfo('');"><span>清除故障点信息</span></a></td>
            </tr>
        </table>
        
    </div>    
    <div class="statusbar statusbar-h30" style="position:absolute;bottom:0;left:0; text-align:center;">
        <a class="btn btnc26" onclick="saveContent(false);"><span class="w50">保存</span></a>
        <a class="btn btnc26" onclick="saveContent(true);"><span class="w80">保存，关闭</span></a>
        <a class="btn btnc26" onclick="cancel();"><span class="w50">取消</span></a>
    </div>
    </form>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript">
//接触网支柱故障点最大允许偏离距离，单位：km
var pillarMaxKilometerOffset = 1;
var lastProfession = 0;
var htEventPlace = new cms.util.Hashtable();

$(window).load(function(){
    $("#txtEventTime").focus(function(){
        WdatePicker({skin:'ext',dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
});

$(window).resize(function(){

});

var changeEventProfession = function(type){
    type = parseInt(type, 10);
    switch(type){
        case 0:
            $('#tbJCW').hide();
            $('#tbBD').hide();
            break;
        case 1:
            $('#tbJCW').show();
            $('#tbBD').hide();
            break;
        case 2:
            $('#tbJCW').hide();
            $('#tbBD').show();
            break;
        case 3:
            $('#tbJCW').hide();
            $('#tbBD').hide();
            break;
    }
    if(0 == type){
        setEventPlaceInfo('');    
    } else {
        if(htEventPlace.contains(type)){
            setEventPlaceInfo(htEventPlace.items(type));  
        } else {
            setEventPlaceInfo('');         
        }
    }
};

var selectEventPlace = function(obj){
    var strValue = obj.value;
    if(strValue != '0'){
        var arrName = ['type','code','name','lat','lng'];
        var arr = strValue.split(',');
        var strContent = '[{type:2,';
        for(var i=0; i<arr.length; i++){
            strContent +=  (i> 0 ? ',' : '' );
            strContent += arrName[i+1] + ':\'' + arr[i] + '\'';
        }
        strContent += '}]';
        setEventPlaceInfo(strContent);
    } else {
        setEventPlaceInfo('');
    }
};

var searchPormpt = function(str){
    $('#lblSearchPrompt').html(str);
};

var setEventPlaceInfo = function(str){
    $('#txtEventPlace').attr('value', str);
    
    var type = parseInt($('#ddlProfession').val(), 10);
    if(type > 0){
        if(htEventPlace.contains(type)){
            htEventPlace.remove(type);
        }
        htEventPlace.add(type, str);
    }
};

var getEventPlaceInfo = function(){
    return $('#txtEventPlace').val().trim();
};

var searchPillarInfo = function(){
    var lineIndexCode = $('#ddlLine').val().split(',')[1];
    var upDownId = parseInt($('#ddlUpDown').val().trim(), 10);
    var kilometerPost = $('#txtKilometerPost').val();
    
    if(lineIndexCode == '0' || upDownId == 0 || kilometerPost == ''){
        cms.box.alert({title: '提示', html: '选择线别、选择行别、填写公里标才可以搜索支柱信息'});
    } else {        
        if('' == kilometerPost){
            cms.box.msgAndFocus(cms.util.$('txtKilometerPost'), {title:'提示信息',html:'请输入公里标！'});
            return false;
        } else {
            var pattern = /^[0-9]+(.[0-9]{1,5})?$/;
            if(!pattern.exec(kilometerPost)){
                cms.box.msgAndFocus(cms.util.$('txtKilometerPost'), {title:'提示信息',html:'公里标格式错误，请输入小数，小数位最长不超过5位'});
                return false;
            }
        }
        kilometerPost = parseFloat(kilometerPost);
        
        searchPormpt('正在搜索，请稍候...');
        setEventPlaceInfo('');
        
        var urlparam = 'action=getPillarList&lineIndexCode=' + lineIndexCode + '&upDownId=' + upDownId + '&kilometerPost=' + kilometerPost;
        $.ajax({
            type: 'post',
            //async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/controlcenter.aspx',
            data: urlparam,
            error: function(data){
                alert('er:' + data);
                //cms.box.alert({id: boxId, title: '错误信息', html: data});
            },
            complete: function(XHR, TS){ 
                XHR = null; 
                if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
            },
            success: function(data) {
                try{
                    var jsondata = eval('(' + data + ')');
                    if(jsondata.result == 1){
                        if(jsondata.wsResult.result == 1){
                            parsePillarInfo(jsondata.list, false, kilometerPost);
                        } else {
                            parsePillarInfo(null, true);
                            searchPormpt('搜索故障点信息失败');
                            alert(jsondata.wsResult.error);
                        }
                    } else {
                        parsePillarInfo(null, true);
                        searchPormpt('搜索故障点信息失败');
                        alert(jsondata.error);
                    }
                } catch(ex){
                    parsePillarInfo(null, true);
                    searchPormpt('搜索故障点信息失败');
                    alert('获取支柱信息失败。错误信息如下：\r\n' + data);
                }
            }
        });
    }
};

var parsePillarInfo = function(dataList, isClear, kilometerPost){
    setEventPlaceInfo('');
    if(isClear == undefined || !isClear){
        if(dataList.length > 0){
            var dr = dataList[0];
            
            if(dr.kp != undefined && dr.kp != ''){
                var dval = parseInt(Math.abs(kilometerPost - parseFloat(dr.kp)) * 1000, 10) / 1000;
                if(dval >= pillarMaxKilometerOffset){
                    var strHtml = '故障点公里标<b style="color:#f00;margin:0 3px;">' + kilometerPost + '</b>km，搜索到的支柱信息：'
                        + '<table class="tblist" cellpadding="0" cellspacing="0">'
                        + '<tr><td>支柱名称</td><td>锚段编号</td><td>经纬度</td><td>公里标(km)</td></tr>'
                        + '<tr><td>' + dr.name + '</td><td>' + dr.pid + '</td><td>' + dr.lat + ',' + dr.lng + '</td><td>' + dr.kp + '</td></tr>'
                        + '</table>'
                        + '搜索到的支柱信息公里标距离目标<b style="color:#f00;margin:0 3px;">' + dval + '</b>km，已超出允许偏移距离'
                        + '<br /><span style="color:#00f;">注：最大允许偏移距离为<b style="color:#f00;margin:0 3px;">' + pillarMaxKilometerOffset + '</b>km。</span>'
                        + '<br /><span style="font-size:14px;">是否要将搜索到的支柱作为故障点？</span>';
                    var config = {
                        id: 'pwSearchPillar',
                        title: '接触网故障点确认',
                        html: strHtml,
                        callBack: parsePillarInfoCallBack,
                        returnValue: {
                            dr: dr
                        },
                        buttonText: ['是', '否']
                    };
                    cms.box.confirm(config);
                    return false;
                }
            }
            
            buildPillarInfo(dr);
            
            searchPormpt('搜索故障点信息完毕');
        } else {
            searchPormpt('没有搜索到相关的故障点信息');
        }
    }
};

var parsePillarInfoCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var dr = pwReturn.returnValue.dr;        
        buildPillarInfo(dr);
        
        searchPormpt('搜索故障点信息完毕');
    } else {
        searchPormpt('搜索故障点信息完毕 - 没有找到相关的故障点');    
    }
    pwobj.Hide();
};

var buildPillarInfo = function(dr){
    var arrName = ['type','code','name','lat','lng'];
    var strContent = '[{';
    strContent += 'type:1,pid:\'' + dr.pid + '\',name:\'' + dr.name + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\',kp:\'' + dr.kp + '\',code:\'' + dr.code + '\'';
    strContent += '}]';
    setEventPlaceInfo(strContent);
};

var saveContent = function(isClose){
    var eid = parseInt(cms.util.$('txtEventId').value.trim(), 10);
    var pid = parseInt(cms.util.$('ddlProfession').value.trim(), 10);
    var lineId = parseInt(cms.util.$('ddlLine').value.trim().split(',')[0], 10);
    var upDownId = parseInt(cms.util.$('ddlUpDown').value.trim(), 10);
    var levelId = parseInt(cms.util.$('ddlLevel').value.trim(), 10);
    var strName = cms.util.$('txtEventName').value.trim();
    var strEventTime = cms.util.$('txtEventTime').value.trim();
    var strDesc = cms.util.$('txtEventDesc').value.trim();
    var substationIndexCode = cms.util.$('ddlSubstation').value.trim();
    if(substationIndexCode != ''){
        substationIndexCode = substationIndexCode.split(',')[0];
    }
    var eventPlace = cms.util.$('txtEventPlace').value.trim();
    var tensionLengthIndexCode = cms.util.$('txtTensionLengthIndexCode').value.trim();
    var kilometerPost = cms.util.$('txtKilometerPost').value.trim();
    
    if(0 == pid){
        cms.box.msgAndFocus(cms.util.$('ddlProfession'), {title:'提示信息',html:'请选择专业！'});
        return false;
    } else if('' == strEventTime){
        cms.box.msgAndFocus(cms.util.$('txtEventTime'), {title:'提示信息',html:'请选择发生时间！'});
        return false;
    } else if(strName.equals(string.empty)){
        cms.box.msgAndFocus(cms.util.$('txtEventName'), {title:'提示信息',html:'请输入事件标题！'});
        return false;
    }
    var strAction = eid > 0 ? 'editEvent' : 'addEvent';
    
    var urlparam = 'action=' + strAction + '&eventId=' + eid + '&professionId=' + pid + '&lineId=' + lineId + '&levelId=' + levelId
        + '&kilometerPost=' + kilometerPost
        + '&upDownId=' + upDownId + '&substationIndexCode=' + substationIndexCode + '&tensionLengthIndexCode=' + tensionLengthIndexCode
        + '&eventName=' + escape(strName) + '&eventTime=' + strEventTime + '&eventPlace=' + escape(eventPlace) + '&eventDesc=' + escape(strDesc);
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/flowcontrol.aspx',
        data: urlparam,
        error: function(data){
            module.showDataError({html:data, width:400, height:250});
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data){
            var jsondata = eval('(' + data + ')');
            if(1 == jsondata.result){
                if('addEvent' == strAction){
                    cms.util.$('txtEventId').value = jsondata.eventId;
                }
                if(isClose){
                    if(top.location != self.location){
                        parent.safety.accident.callBack();
                    }
                } else {
                    cms.box.alert({title:'提示信息', html:'故障事件' + ('addEvent' == strAction ? '创建' : '更新') + '成功'});
                }
                if(!cms.util.isTop()){
                    parent.safety.accident.setEditSuccess(true);
                }                
            } else {
                cms.box.alert({title:'提示信息', html:'故障事件' + ('addEvent' == strAction ? '创建' : '更新') + '失败'});
            }
        }
    });
    
}; 

var cancel = function(){
    if(top.location != self.location){
        parent.safety.accident.callBack();
    }
};
</script>