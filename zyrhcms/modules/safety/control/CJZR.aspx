<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CJZR.aspx.cs" Inherits="modules_safety_control_CJZR" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>通知车间主任</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript">
        var eid = '<%=eid%>';
        var step = '<%=step%>';
        var sub = '<%=sub%>';
    </script>
</head>
<body>
    <div id="pageBody" class="hide">
        <div id="bodyLeft" style="background:#fff;">
            <div class="titlebar">
                <div class="title">选择人员</div>
            </div>
            <div class="operbar" style="text-align:left;padding:0 5px; line-height:26px;">
                <select id="ddlSearchType" class="select">
                    <option value="realName">根据姓名</option>
                    <option value="telephone">根据办公电话</option>
                    <option value="mobile">根据手机号码</option>
                </select>
                <input type="text" class="txt w120" id="txtKeywords" />
                <a onclick="loadData();" class="btn btnsearch"></a>
                <a onclick="loadAllData();" class="btn btnsearch-cancel"></a>
                <div style="float:right;">
                    <span style="float:left;margin-right:3px;">每页显示</span>
                    <select id="ddlPageSize" onchange="loadData();" class="select">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100" selected="selected">100</option>
                    </select>
                </div>
            </div>
            <div id="listBox" class="listbox">
                <div id="listHeader" class="listheader">
                    <table id="tbHeader" class="tbheader" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width:25px;">序号</td>
                            <td style="width:25px;">选择</td>
                            <td style="width:100px;">部门</td>
                            <td style="width:50px;">姓名</td>
                            <td style="width:80px;">职名</td>
                            <td style="width:50px;">办公电话</td>
                            <td style="width:70px;">手机号码</td>
                            <td style="width:30px;">性别</td>
                            <td style="width:70px;">出生年月</td>
                            <td style="width:60px;">政治面貌</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div id="listContent" class="list"><table id="tbList" class="tblist" cellpadding="0" cellspacing="0"></table></div>
            </div>
            <div id="statusBar" class="statusbar">
                <span id="pagination" class="pagination"></span><span id="prompt"></span><span id="loading" class="loading"></span>
            </div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <div id="mainTitle" class="titlebar">
                <div class="title"><span>人员信息</span></div>
                <a class="btn btnc22" onclick="clearPerson();" style="float:right;margin-right:5px;"><span>清空人员信息</span></a>
            </div>
            <div id="mainContent" style="overflow:auto;">
                <div class="operbar" style="text-align:left;">
                    <div id="tabpanel" class="tabpanel" style="float:left;"></div>                    
                </div>
                <div id="divForm" class="infobox">
                    <div id="listHeaderSelect" class="listheader">
                        <table id="tbHeaderSelect" class="tbheader" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width:25px;">序号</td>
                                <td style="width:25px;"><input type="checkbox" name="chbAllSelect" onclick="cms.util.selectCheckBox('chbPersonSelect', 3);" /></td>
                                <td style="width:100px;">部门</td>
                                <td style="width:50px;">姓名</td>
                                <td style="width:70px;">职名</td>
                                <td style="width:65px;">办公电话</td>
                                <td style="width:100px;">手机号码</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <div id="listContentSelect" class="list"><table id="tbListSelect" class="tblist" cellpadding="0" cellspacing="0"></table></div>
                    <div id="smsBox">
                        <div class="operbar" style="text-align:left;padding:0 5px; line-height:25px;border-top:solid 1px #99bbe8;">
                            <span>短信群发</span><span>(<label id="lblWorkCount" style="padding:0 5px; text-align:right;"></label>)</span>
                            <span style="float:right;" id="smsLengthPrompt"></span>
                        </div>
                        <div>
                            <textarea id="txtSmsContent" class="txt" style="width:100%;height:60px;padding:0 5px;border-left:none;border-right:none;" cols="" rows=""
                             onchange="setSmsWordPrompt();" onkeydown="setSmsWordPrompt();" onkeyup="setSmsWordPrompt();"></textarea>
                        </div>
                        <div style="padding:5px 0 0 5px;">
                            <a id="btnSendSms" class="btn btnc30" onclick="sendSms();"><span class="w80"><img class="icon-sms" style="margin:7px 0 0 8px;float:left;" alt="" />短信群发</span></a>
                            <label id="lblSendSms" style="line-height:28px;"></label>
                        </div>
                    </div>
                    <div id="callBox">
                        <div class="operbar" style="text-align:left;padding:0 5px; line-height:25px;border-top:solid 1px #99bbe8;">
                            <span>语音通话</span><span id="lblCallName"></span>
                        </div>
                        <div id="divCallForm" style="padding:5px;"></div>
                    </div>
                </div>
                <div style="padding:0;background:#fff;width:100%;display:none;" id="divLog" class="infobox">
                    <textarea id="txtResult" class="txt" readonly="readonly" cols="" rows="" style="width:100%;height:60px;padding:0 5px;border-left:none;border-right:none;"></textarea>
                </div>
            </div>            
            <div class="statusbar statusbar-h30" style="text-align:center;">
                <a class="btn btnc24" onclick="saveContent(false);"><span class="w50">确定</span></a>
                <a class="btn btnc24" onclick="saveContent(true);"><span class="w80">确定，关闭</span></a>
                <a class="btn btnc24" onclick="cancel();"><span class="w50">取消</span></a>
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="control.js"></script>
<script type="text/javascript" src="person.js"></script>
<script type="text/javascript">
    var paddingTop = 4;
    var paddingWidth = 5;
    var borderWidth = 2;
    var leftWidth = leftWidthConfig = 305;
    var rightWidth = rightWidthConfig =  0;
    var switchWidth = 5;
    var boxSize = {};
    
    var htPerson = new cms.util.Hashtable();
    var arrPerson = [];
    var arrSmsSendLog = [];
    
    var operH = 26;
    var smsBoxH = 135;
    var callBoxH = 80;
    var resultBoxH = 100;
    var dataCount = 0;
    var pageStart = 1;
    var pageIndex = pageStart;
    var pageSize = 100;
    
    //短信内容最大长度
    var smsContentMaxLength = 140;
    var callTimer = null;
    
    var tabs = [
        {code: 'form', name: '通知车间主任及工长', objName: 'divForm', load: false},
        {code: 'log', name: '操作记录', objName: 'divLog', load: false}
    ];
    var curTab = 'form';
        
    $(window).load(function(){
        cms.frame.setFrameSize(leftWidth, rightWidth);
        initialForm();
        cms.frame.setPageBodyDisplay();
        
        setBodySize();
        getAddressList();
        getEventDetail(eid);
    });
    
    $(window).resize(function(){
        setBodySize();
    });
    
    var loadData = function(){    
        pageIndex = pageStart;
        getAddressList();
    };

    var loadAllData = function(){
        pageIndex = pageStart;
        $('#txtKeywords').attr('value','');
        getAddressList(); 
    };
    
    var setBodySize = function(){
        var frameSize = cms.frame.getFrameSize();
        leftWidthConfig = frameSize.width > 800 ? 460 : 305;
        leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
        
        $('#pageBody').css('padding-top', paddingTop);
    
        $('#bodyLeft').width(leftWidth - borderWidth);
        $('#bodyLeftSwitch').width(switchWidth);
        boxSize = {
            width: frameSize.width - leftWidth - switchWidth - borderWidth, 
            height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
        };
        $('#bodyMain').width(boxSize.width);
        $('#bodyMain').height(boxSize.height);
        $('#bodyLeft').height(boxSize.height);
        $('#bodyLeftSwitch').height(boxSize.height);
        
        setBoxSize();
    };

    var setBoxSize = function(){
        $('#mainContent').height(boxSize.height - 25 - 32);
        
        $('#listBox').width(leftWidth - 2);
        $('#listBox').height(boxSize.height - operH - 25*2);
        
        $('#listContent').width(leftWidth - 2);
        $('#listContent').height(boxSize.height - operH - 25*2 - 25);
        
        $('#tbHeader').width(680);
        $('#tbList').width(663);
        
        $('#smsBox').height(smsBoxH);
        $('#callBox').height(callBoxH);
        $('#txtResult').width(boxSize.width - 10);
        $('#txtSmsContent').width(boxSize.width - 10);
        $('#txtResult').height(boxSize.height - 30 - operH - 30);
        $('#listContentSelect').height(boxSize.height - operH - 28 - 26 - 30 - smsBoxH - callBoxH);        
    };

    var setLeftDisplay = function(obj){
        if(obj == undefined){
            obj = $('#bodyLeftSwitch');
        }
        cms.frame.setLeftDisplay($('#bodyLeft'), obj);
    };
    
    var initialForm = function(){
        $('#bodyLeftSwitch').click(function(){
            setLeftDisplay($(this));
        });
        var bodySize = cms.util.getBodySize();
                
        for(var i=0; i<tabs.length; i++){
            var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#' + tabs[i].objName + '"><span>' + tabs[i].name + '</span></a>';
            $('#tabpanel').append(strTab);
            
            if(tabs[i].code == curTab){
                $('#' + tabs[i].objName).show();
            }
        }
        cms.jquery.tabs('#tabpanel', null, '.infobox', '');
        
        $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
        
        $('#smsLengthPrompt').html('字数不得超过' + smsContentMaxLength + '个字符(' + parseInt(smsContentMaxLength/2, 10) + '个汉字)');
    };
    
    var getEventDetail = function(eventId){
        var urlparam = 'action=getSingleEvent&eventId=' + eventId;
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
                    if(jsondata.info.eventDesc != ''){
                        cms.util.$('txtSmsContent').value = jsondata.info.eventDesc;
                    } else {
                        cms.util.$('txtSmsContent').value = jsondata.info.eventName;
                    }
                    setSmsWordPrompt();
                    delete jsondata;
                }
            }
        });
    };
    
    var getAddressList = function(){
        var strSearchType = $('#ddlSearchType').val().trim();
        var strKeywords = $('#txtKeywords').val().trim();
        pageSize = $('#ddlPageSize').val().trim();
        var urlparam = 'action=getAddressList&deptType=2' + '&searchType=' + strSearchType + '&keywords=' + escape(strKeywords) + '&isLeader=1'
            + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize;  
        $.ajax({
            type: 'post',
            //async: false,
            datatype: 'text',
            url: cms.util.path + '/ajax/person.aspx',
            data: urlparam,
            error: function(data){ alert('er:' + data);},
            success: function(data){
                var strData = data;
                if(!strData.isJsonData()){
                    //alert('1' + data);
                    //module.showDataError({html:strData, width:400, height:250});
                    return false;
                }
                
                var jsondata = eval('(' + strData + ')');
                if(1 == jsondata.result){
                    showAddressList(jsondata);
                }
                delete strData;
                delete jsondata;
            },
            complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
        });
    };

    var showAddressList = function(jsondata){
        var objList = cms.util.$('tbList');
        var rid = 0;
        var dataCount = jsondata.dataCount;
        var dc = jsondata.list.length;
        
        cms.util.clearDataRow(objList, 0);
        
        
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rowData = [];
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            var cellid = 0;
            var strChecked = htPerson.contains(dr.jobNumber) ? ' checked="checked" ' : '';
            var strLang = '[\'' + dr.jobNumber + '\',\'' + dr.deptName + '\',\'' + dr.realName + '\',\'' + dr.jobName + '\',\'' + dr.telephone + '\',\'' + dr.mobile + '\',\'' + dr.sex + '\']';
            var strCheckBox = '<input name="chbPerson" id="chbPerson_' + dr.jobNumber + '" onclick="selectPerson(\'chbPerson\', this);" type="checkbox" ' + strChecked 
                + ' lang="' + strLang + '" value="' + dr.jobNumber + '"/>';

            row.lang = dr.jobNumber;
            row.ondblclick = function(){
                $('#chbPerson_' + this.lang).click();
                selectPerson('chbPerson', cms.util.$('chbPerson_' + this.lang));
            };
            
            rowData[cellid++] = {html: rnum, style:[['width','25px']]}; //序号
            rowData[cellid++] = {html: strCheckBox, style:[['width','25px'],['textAlign','center']]}; //选择
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.deptName, 100, true, dr.deptName), style:[['width','100px']]};
            rowData[cellid++] = {html: dr.realName, style:[['width','50px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.jobName, 80, true, dr.jobName), style:[['width','80px']]};
            
            rowData[cellid++] = {html: dr.telephone, style:[['width','50px']]};
            rowData[cellid++] = {html: dr.mobile, style:[['width','70px']]};
            rowData[cellid++] = {html: parseSex(dr.sex), style:[['width','30px']]};
            rowData[cellid++] = {html: dr.birthday.split(' ')[0], style:[['width','70px']]};
            rowData[cellid++] = {html: dr.political, style:[['width','60px']]};
            
            rowData[cellid++] = {html: '', style:[]}; //空
            
            cms.util.fillTable(row, rowData);

            rowData = null;
            dr = null;
            delete dr;
            delete rowData;
            
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: pageIndex,
            pageSize: pageSize,
            pageStart: pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'showPage',
            showDataStat: false,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination'));
        pageCount = pager.pageCount;
        
    };

    var showPage = function(page){
        pageIndex = parseInt(page, 10);
        getAddressList();
    };

    var parseSex = function(sex){
        var arrSex = ['未知', '男', '女'];
        return arrSex[parseInt(sex, 10)];  
    };
    
    var getDateTime = function(){
        return new Date().toString('yyyy-MM-dd HH:mm:ss');
    };
    
    var buildPersonData = function(dr){
        var op = htPerson.contains(dr[0]) ? htPerson.items(dr[0]) : null;
        var person = {
            jobNumber: dr[0],
            deptName: dr[1],
            realName: dr[2],
            jobName: dr[3],
            telephone: dr[4],
            mobile: dr[5],
            sendSms: op != null ? op.sendSms : false,
            sendTime: op != null ? op.sendTime : '',
            isCall: op != null ? op.isCall : false,
            callTime: op != null ? op.callTime : '',
            time: getDateTime()
        };
        return person;
    }

    var selectPerson = function(chbName, obj){
        var person = {};
        if(obj != null){
            var strLang = obj.lang;
            var dr = eval('(' + strLang + ')');
            var jobNumber = dr[0];
            if(obj.checked){
                person = buildPersonData(dr);
                if(!htPerson.contains(jobNumber)){
                    arrPerson.push(person);
                    htPerson.add(jobNumber, person);
                }
            } else {
                deletePerson(jobNumber);
                if(htPerson.contains(jobNumber)){
                    htPerson.remove(jobNumber);
                }
            }
        } else {
            var arrChb = cms.util.getCheckBoxChecked(chbName);
            var strResult = '';
            for(var i=0,c=arrChb.length; i<c; i++){
                var strLang = arrChb[i].lang;
                var dr = eval('(' + strLang + ')');
                var jobNumber = dr[0];                
                person = buildPersonData(dr);
                if(!htPerson.contains(jobNumber)){
                    arrPerson.push(person);
                    htPerson.add(jobNumber, person);
                }
            }
        }
        
        showSelectResult();
        showSelectList();
        showSmsSendResult();
    };
    
    var deletePerson = function(jobNumber){
        for(var i=0,c=arrPerson.length; i<c; i++){
            if(arrPerson[i].jobNumber == jobNumber){
                arrPerson.splice(i, 1);
                break;
            }
        };
    };

    var clearPerson = function(){
        if($('#txtResult').val().trim() != ''){
            var config = {
                id: 'pwClearPerson',
                title: '确认',
                html: '确定要清空人员信息吗？',
                callBack: clearPersonCallBack
            };
            cms.box.confirm(config);
        }
    };
    
    var clearPersonCallBack = function(pwobj, pwResult){
        if(pwResult.dialogResult){
            arrPerson.length = 0;
            htPerson.clear();
            cms.util.selectCheckBox('chbPerson', 2);
            $('#txtResult').attr('value', '');
            cms.util.clearDataRow(cms.util.$('tbListSelect'), 0);
        }
        pwobj.Hide();
    };
    
    var showSelectList = function(){
        var objList = cms.util.$('tbListSelect');
        var rid = 0;
        var dataCount = arrPerson.length;
        var dc = dataCount;
        
        cms.util.clearDataRow(objList, 0);        
        //取消全选框为不选中状态
        cms.util.selectCheckBox('chbAllSelect', 2);

        for(var i = 0; i < dc; i++){
            var dr = arrPerson[i];
            var row = objList.insertRow(rid);
            var rowData = [];
            var rnum = rid + 1;
            var cellid = 0;
            var strChecked = ' ';//' checked="checked" ';//htPerson.contains(dr.jobNumber) ? ' checked="checked" ' : '';
            var strLang = '[\'' + dr.jobNumber + '\',\'' + dr.deptName + '\',\'' + dr.realName + '\',\'' + dr.jobName + '\',\'' + dr.telephone + '\',\'' + dr.mobile + '\',\'' + dr.sex + '\']';
            /*
            //双击人员信息，可以删除该人员信息
            row.lang = dr.jobNumber;
            row.ondblclick = function(){
                $('#chbPerson_' + this.lang).click();
                selectPerson('chbPerson', cms.util.$('chbPerson_' + this.lang));
            };
            */
            
            rowData[cellid++] = {html: rnum, style:[['width','25px']]}; //序号
            
            rowData[cellid++] = {html: '<input name="chbPersonSelect" id="chbPersonSelect_' + dr.jobNumber + '" type="checkbox" ' + strChecked 
                + ' lang="' + strLang + '" value="' + dr.jobNumber + '" onclick="setAllSelectChecked();" />', style:[['width','25px'],['textAlign','center']]}; //选择
                        
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.deptName, 100, true, dr.deptName), style:[['width','100px']]};
            rowData[cellid++] = {html: dr.realName, style:[['width','50px']]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.jobName, 70, true, dr.jobName), style:[['width','70px']]};
            
            rowData[cellid++] = {html: dr.telephone + buildCallOper(dr, 1), style:[['width','65px']]};
            rowData[cellid++] = {html: dr.mobile + buildCallOper(dr, 2), style:[['width','100px']]};
            
            rowData[cellid++] = {html: '', style:[]}; //空
            
            cms.util.fillTable(row, rowData);
                
            rowData = null;
            dr = null;
            delete dr;
            delete rowData;
            
            rid++;
        }
    };
    
    var setAllSelectChecked = function(){
        var c = cms.util.getCheckBoxCheckedCount('chbPersonSelect');
        if(c == arrPerson.length){
            cms.util.selectCheckBox('chbAllSelect', 1);            
        } else {
            cms.util.selectCheckBox('chbAllSelect', 2);        
        }
    };
        
    var showSelectResult = function(){
        var strResult = '';
        var person = null;
        for(var i=0,c=arrPerson.length; i<c; i++){
            person = arrPerson[i];
            strResult += (i+1) + '.' + person.deptName + ' ' + person.realName + ' ' + person.jobName + ' 办公电话：' + (person.telephone == '' ? '不详' : person.telephone)
                + '，手机号码：' + (person.mobile == '' ? '不详' : person.mobile) + '。[' + person.time + ']' 
                + (person.sendSms ? '【短信已发送】' + person.sendTime : '【短信未发送】') 
                + (person.isCall ? '【电话已联系】' + person.callTime : '【电话未联系】') + '\r\n';
        }
        $('#txtResult').attr('value', strResult);
    };
    
    var showSmsSendResult = function(){
        var strHtml = '\n【短信群发】\n';
        for(var i=0,c=arrSmsSendLog.length; i<c; i++){
            strHtml += (i + 1) + '. 短信群发，发送时间：[' + arrSmsSendLog[i].sendTime + ']，短信内容：[' + arrSmsSendLog[i].smsContent
                + ']，人员名单：[' + buildPersonMobile(arrSmsSendLog[i].mobileList, arrSmsSendLog[i].nameList) + ']\n';
        }
        //$('#txtResult').append(strHtml);
        var strContent = $('#txtResult').val().trim();
        $('#txtResult').attr('value', strContent + strHtml);
    };
    
    var buildCallOper = function(dr, type){
        var strOper = '';
        if(1 == type){
            if(dr.telephone != ''){
                strOper = '<a class="icon-call" onclick="callPerson(\'' + dr.jobNumber + '\',\'' + dr.telephone + '\',\'' + dr.realName + '\',\'' + dr.jobName + '\');" title="通话"></a>';        
            }
        } else {
            if(dr.mobile != ''){
                strOper = '<a class="icon-call" onclick="callPerson(\'' + dr.jobNumber + '\',\'' + dr.mobile + '\',\'' + dr.realName + '\',\'' + dr.jobName + '\');" title="通话"></a>';        
            }        
        }
        return strOper;
    };
    
    var buildPersonMobile = function(arrMobile, arrName){
        var strHtml = '';
        for(var i=0,c=arrMobile.length; i<c; i++){
            strHtml += (i>0 ? '；' : '') + arrName[i] + ':' + arrMobile[i];
        }
        return strHtml;
    };
    
    var setSendSmsPrompt = function(str, isOver){
        $('#lblSendSms').html(str);
        $('#btnSendSms').attr('disabled', !isOver);
    };
    
    var setSmsWordPrompt = function(){
        var strSms = $('#txtSmsContent').val().trim();
        var c = strSms.len();
        var sc = smsContentMaxLength - c;
        if(sc > 0){
            $('#lblWorkCount').html('还可以输入<label style="color:#00f;">' + sc + '</label>个字符');
        } else {
            $('#lblWorkCount').html('已超出<label style="color:#f00;">' + Math.abs(sc) + '</label>个字符');
        }
    };
    
    //设置短信发送状态
    var setSendSmsStatus = function(jobNumber){
        if(jobNumber != undefined){
            for(var i=0,c=arrPerson.length; i<c; i++){
                if(arrPerson[i].jobNumber == jobNumber){
                    arrPerson[i].sendSms = true;
                    arrPerson[i].smsTime = getDateTime();
                    break;
                }
            }
        } else {
            for(var i=0,c=arrPerson.length; i<c; i++){
                arrPerson[i].sendSms = true;
                arrPerson[i].smsTime = getDateTime();
            }
        }
    };
    
    //设置电话通话状态
    var setCallStatus = function(jobNumber){
        if(jobNumber != undefined){
            for(var i=0,c=arrPerson.length; i<c; i++){
                if(arrPerson[i].jobNumber == jobNumber){
                    arrPerson[i].isCall = true;
                    arrPerson[i].callTime = getDateTime();
                    break;
                }
            }
        } else {
            for(var i=0,c=arrPerson.length; i<c; i++){
                arrPerson[i].isCall = true;
                arrPerson[i].callTime = getDateTime();
            }
        }
    };
    
    var sendSms = function(){
        var smsContent = $('#txtSmsContent').val().trim();
        var arrChb = cms.util.getCheckBoxChecked('chbPersonSelect');
        if($('#btnSendSms').is(':disabled')){
            //正在发送短信，不能重复点击发送
            return false;
        } else if(arrChb.length == 0){
            cms.box.alert({title: '提示信息', html: '请选择要发送短信的人员。'});
            return false;        
        } else if(smsContent.equals(string.empty)){
            cms.box.msgAndFocus(cms.util.$('txtSmsContent'), {title: '提示信息', html: '请输入短信内容。'});
            return false;
        } else if(smsContent.len() > smsContentMaxLength){
            cms.box.msgAndFocus(cms.util.$('txtSmsContent'), {title: '提示信息', html: '短信内容字数不得超过' + smsContentMaxLength 
                + '个字符(' + parseInt(smsContentMaxLength/2,10) + '个汉字)。'});
            return false;        
        } else {
            var arrNumber = [];
            var arrMobile = [];
            var arrName = [];
            for(var i=0,c=arrChb.length; i<c; i++){
                var person = eval('(' + arrChb[i].lang + ')');
                //如果手机号码为空，则不发短信
                if(person[5].trim() != ''){
                    arrNumber.push(person[0]);
                    arrMobile.push(person[5]);
                    arrName.push(person[2]);
                }
            }
            var config = {
                id: 'pwSms',
                title: '确认',
                html: '确定要群发短信吗？',
                callBack: sendCmsCallBack,
                returnValue: {
                    smsContent: smsContent,
                    arrNumber: arrNumber,
                    arrMobile: arrMobile,
                    arrName: arrName
                }
            };
            cms.box.confirm(config);
        }
    };
    
    var sendCmsCallBack = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            setSendSmsPrompt('正在发送短信，请稍候...', false);
            
            var param = pwReturn.returnValue;
            window.setTimeout(realSendSms, 2000, param.smsContent, param.arrNumber, param.arrMobile, param.arrName);
            pwobj.Hide();
        } else {
            pwobj.Hide();
        }   
    };
    
    var realSendSms = function(smsContent, arrNumber, arrMobile, arrName){
        var strMobileList = arrMobile.join(',');
        if(true){
            setSendSmsPrompt('短信已发送完毕(测试中，实际未发送，因为短信平台还没有完善)', true);
            for(var i=0,c=arrNumber.length; i<c; i++){
                setSendSmsStatus(arrNumber[i]);
            }

            arrSmsSendLog.push({smsContent: smsContent, sendTime: getDateTime(), mobileList: arrMobile, nameList: arrName});
        }
        showSelectResult();
        showSelectList();
        showSmsSendResult();
    };
    
    var callPerson = function(jobNumber, telNumber, realName, jobName){
        var strHtml = '<a class="icon-call" style="float:left;margin-right:10px;"></a>正在拨号，请稍候...'
            + '<a class="btn btnc22" style="margin-left:30px;" onclick="cancelCall();"><span>取消拨号</span></a>';

        $('#lblCallName').html('<a class="icon-call-right" style="margin:0 10px;"></a> 联系人：' + realName + ' ' + jobName + '，电话号码：' + telNumber + '。');
        $('#divCallForm').html(strHtml);
        
        callTimer = window.setTimeout(callTalk, 3000, jobNumber);
    };
    
    var callTalk = function(jobNumber){
        var strHtml = '<a class="icon-call" style="float:left;margin-right:10px;"></a>正在通话中...(测试中，实际没有通话，因为电话平台未完善)'
            + '<a class="btn btnc22" style="margin-left:30px;" onclick="cancelTalk();"><span>停止通话</span></a>';
        $('#divCallForm').html(strHtml);
        
        setCallStatus(jobNumber);
        showSelectResult();
        showSelectList();
        showSmsSendResult();
    };
    
    var cancelCall = function(){
        var strHtml = '<a class="icon-call" style="float:left;margin-right:10px;"></a>已取消拨号';
        $('#divCallForm').html(strHtml);
        if(callTimer != null){
            window.clearTimeout(callTimer);
        }
    };
    
    var cancelTalk = function(){
        var strHtml = '<a class="icon-call" style="float:left;margin-right:10px;"></a>已停止通话';
        $('#divCallForm').html(strHtml);
    };
    
    var saveContent = function(isClose){
        var strResult = cms.util.$('txtResult').value.trim();
        
        updateControlValue(eid, step, sub, isClose, true, strResult, false);
    };

    var cancel = function(){
        updateControlValue(eid, step, sub, true);
    };
</script>