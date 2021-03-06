﻿<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="sendLog.aspx.cs" Inherits="modules_sms_sub_sendLog" %>
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
    <script type="text/javascript">
        var phoneNumberList = '<%=Config.GetSmsPhoneNumberList()%>';
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyTitle">
        <span class="title"></span><span id="reload" class="reload"></span>
        <div class="tools">            
            <select id="ddlDesc" class="select" style="margin-right:5px;float:left;">
                <option value="1">降序</option>
                <option value="0">升序</option>
            </select>
            <span>每页</span>
            <select id="ddlPageSize" class="select" style="margin:0 2px;float:left;">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20" selected="selected">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
            <span>条</span>
        </div>
    </div>
    <div id="bodyContent">
        <div class="operform">
            <div class="formpanel">
                <input type="hidden" id="txtMinDate" value="2014-07-01 00:00:00" />
                <input type="hidden" id="txtMaxDate" value="<%=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd")%> 23:59:59" />
                <select id="ddlSendStatus" class="select w85" style="margin-left:3px;margin-right:5px;">
                    <option value="-1">全部</option>
                    <option value="0">未发送</option>
                    <option value="1">发送成功</option>
                    <option value="2">发送失败</option>
                    <option value="3">取消发送</option>
                </select>
                <span>发送号码：</span>
                <select id="ddlSendNumber" class="select" style="margin-right:5px;">
                    <option value="">选择发送号码</option>
                </select>
                <span>开始时间：</span>
                <input type="text" id="txtStartTime" class="txt w120" style="margin-right:5px;" value="<%=DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd")%> 00:00:00" />
                <span>结束时间：</span>
                <input type="text" id="txtEndTime" class="txt w120" style="margin-right:5px;" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%> 23:59:59" />
                <select id="ddlSearchType" class="select" style="margin-right:1px;">
                    <option value="PhoneNumber">按手机号码</option>
                    <option value="SmsContent">按短信内容</option>
                </select>
                <input id="txtKeywords" type="text" class="txt w125" maxlength="25" value="输入要查找的关键字" />
                <a onclick="loadData();" class="btn btnsearch" style="margin:0;"></a>
                <a onclick="loadAllData();" class="btn btnsearch-cancel" style="margin:0;"></a>
            </div>
        </div>
        <div class="listbox" style="padding:0;margin:0;">
            <div class="listheader">
                <table class="tbheader" cellpadding="0" cellspacing="0" style="min-width:1100px;">
                    <tr>
                        <td style="width:45px;">序号</td>
                        <td style="width:45px;">任务ID</td>
                        <td style="width:80px;">手机号码</td>
                        <td style="width:300px;">短信内容</td>
                        <td style="width:60px;">发送状态</td>
                        <td style="width:120px;">短信发送时间</td>
                        <td style="width:80px;">发送号码</td>
                        <td style="width:120px;">创建记录时间</td>
                        <td style="width:55px;">是否群发</td>
                        <td style="width:50px;">群组ID</td>
                        <td style="width:55px;">子集数量</td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="list">
                <table class="tblist" id="tbList" cellpadding="0" cellspacing="0" style="min-width:1080px;"></table>
            </div>
        </div>
    </div>
    <div id="bodyBottom">
        <div id="pagination" class="pagination"></div>
        <span id="loading" class="loading"></span>
        <div class="panel-left" style="width:80%;"><span id="lblError" runat="server"></span></div>
        <div class="panel-right"></div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<script type="text/javascript">
var strSearchKeywords = '输入要查找的关键字';
var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

$(window).load(function(){
    page.setPageTitle('<%=strTitle%>');
    setBoxSize();
    initial();
});

$(window).resize(function(){
    setBoxSize();
});

function initial(){
    var mindate = $('#txtMinDate').val().trim();
    var maxdate = $('#txtMaxDate').val().trim();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:mindate,maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:mindate,maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
    cms.util.$('txtKeywords').onfocus = function(){
        setKeywords(this, 'focus');
    };
    cms.util.$('txtKeywords').onblur = function(){
        setKeywords(this, 'blur');
    };
    
    $('#ddlSendNumber').change(function(){
        getSmsSendLog();
    });
    $('#ddlDesc').change(function(){
        getSmsSendLog();
    });
    $('#ddlPageSize').change(function(){
        pageIndex = pageStart;
        pageSize = parseInt($(this).val().trim(), 10);
        getSmsSendLog();
    });

    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    createPhoneNumberOption(cms.util.$('ddlSendNumber'));
    
    getSmsSendLog();
}

function createPhoneNumberOption(obj){
    var arrPhone = phoneNumberList.split(',');
    for(var i=0,c=arrPhone.length; i<c; i++){
        var num = arrPhone[i].trim();
        if('' == num){
            continue;
        }
        cms.util.fillOption(obj, num, num);
    }
}

function setBoxSize(){
    var bodySize = cms.util.getBodySize();
    $('.listbox').height(boxSize.height - 25 - 28 - $('.operform').outerHeight());
}

function setKeywords(obj, action){
    var val = obj.value.trim();
    if('focus' == action && strSearchKeywords == val){
        obj.value = '';
    } else if('blur' == action && '' == val){
        obj.value = strSearchKeywords;
    }
}

function getData(){
    pageIndex = pageStart;
    getSmsSendLog();
}

function getAllData(){
    $('#txtKeywords').attr('value', '');
    pageIndex = pageStart;
    getSmsSendLog();
}

function getSmsSendLog(){
    var sendStatus = $('#ddlSendStatus').val().trim();
    var sendNumber = $('#ddlSendNumber').val().trim();
    var searchType = $('#ddlSearchType').val().trim();
    var keywords = $('#txtKeywords').val().trim();
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var isDesc = $('#ddlDesc').val().trim();
    if(strSearchKeywords == keywords){
        keywords = '';
    }
        
    //清除分页数据
    $('#pagination').html('');
    //显示加载
    showLoading(true);
    
    var urlparam = 'action=getSmsSendList&sendStatus=%s&sendNumber=%s&startTime=%s&endTime=%s&searchType=%s&keywords=%s&isDesc=%s&pageIndex=%s&pageSize=%s'.format(
        [sendStatus, sendNumber, startTime, endTime, searchType, keywords, isDesc, (pageIndex-pageStart), pageSize] 
        ,'%s');
    module.ajaxRequest({
        url: cmsPath + '/ajax/sms.aspx',
        data: urlparam,
        callBack: showSmsSendLog,
        param: {
        
        }
    });
}

function showSmsSendLog(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var objList = cms.util.$('tbList');
    cms.util.clearDataRow(objList, 0);
    
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }    
    
    var rid = 0;
    var pnum = (pageIndex - pageStart) * pageSize;
    for(var i=0,c=jsondata.list.length; i<c; i++){
        var dr = jsondata.list[i];
        
        buildDataList(objList, dr, pnum, rid);
        
        rid++;
    }
    
    var config = {
        dataCount: jsondata.dataCount,
        pageIndex: pageIndex,
        pageSize: pageSize,
        pageStart: pageStart,
        showType: 'nolist',
        markType: 'Symbol',
        callBack: 'showPage',
        showDataStat: true,
        showPageCount: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, cms.util.$('pagination'));
    pageCount = pager.pageCount;
    
    setTableStyle('#tbList');    
    
    showLoading(false);
}

//显示加载
function showLoading(show){
    if(show){
        $("#loading").show();
        $("#loading").html("正在加载数据，请稍候...");
    }
    else{
        $("#loading").hide();
    }
}

function showPage(page){
    pageIndex = parseInt(page, 10);
    getSmsSendLog();
}

function setTableStyle(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

function buildDataList(objList, dr, pnum, rid){
    var cellid = 0;
    var rowData = [];
    var row = objList.insertRow(rid);
    var strContent = cms.util.fixedCellWidth(dr.smsContent, 280, true, dr.smsContent);
    var isMulti = parseMulti(dr.parentId, dr.childQuantity);
    
    rowData[cellid++] = {html: (pnum + rid + 1), style:[['width','45px']]};
    rowData[cellid++] = {html: dr.id, style:[['width','45px']]};
    rowData[cellid++] = {html: isMulti ? '群发' : dr.phoneNumber, style:[['width','80px']]};
    rowData[cellid++] = {html: strContent, style:[['width','300px'],['textAlign','left']]};
    rowData[cellid++] = {html: parseSendStatus(dr.sendStatus, dr.childQuantity), style:[['width','60px']]};
    rowData[cellid++] = {html: dr.sendTime, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.sendNumber, style:[['width','80px']]};
    rowData[cellid++] = {html: dr.smsTime, style:[['width','120px']]};
    rowData[cellid++] = {html: isMulti ? '群发' : '-', style:[['width','55px']]};
    rowData[cellid++] = {html: dr.parentId > 0 ? dr.parentId : '-', style:[['width','50px']]};
    rowData[cellid++] = {html: dr.childQuantity >  0 ? dr.childQuantity : '-', style:[['width','55px']]};
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
}

function parseSendStatus(status, childQuantity){
    if(childQuantity > 0){
        return '-';
    }
    switch(status){
        case 0:
            return '<span style="color:#00f;">未发送</span>';
            break;
        case 1:
            return '<span style="color:#008000;">已发送</span>';
            break;
        case 2:
            return '<span style="color:#f00;">发送失败</span>';
            break;
        case 3:
            return '<span style="color:#999;">取消发送</span>';
            break;
    }
}

function parseMulti(parentId, childQuantity){
    return 0 == parentId && childQuantity > 0;
}
</script>
</asp:Content>