<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="soundRecord.aspx.cs" Inherits="modules_sms_sub_soundRecord" %>
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
        var phoneNumberList = '<%=Config.GetSoundRecordPhoneNumberList()%>';
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
                <input type="hidden" id="txtMinDate" value="2014-06-01 00:00:00" />
                <input type="hidden" id="txtMaxDate" value="<%=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd")%> 23:59:59" />
                <select id="ddlInOut" class="select" style="margin-right:5px;margin-left:3px;">
                    <option value="-1">全部</option>
                    <option value="0">呼入</option>
                    <option value="1">呼出</option>
                </select>
                <span>本机号码：</span>
                <select id="ddlPhoneNumber" class="select" style="margin-right:5px;">
                    <option value="">选择本机号码</option>
                </select>
                <span>开始时间：</span>
                <input type="text" id="txtStartTime" class="txt w120" style="margin-right:5px;" value="<%=DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd")%> 00:00:00" />
                <span>结束时间：</span>
                <input type="text" id="txtEndTime" class="txt w120" style="margin-right:5px;" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%> 23:59:59" />
                <span>对方号码：</span>
                <input type="text" id="txtTargetNumber" class="txt w100" maxlength="16" />
                <a onclick="loadData();" class="btn btnsearch" style="margin:0;"></a>
                <a onclick="loadAllData();" class="btn btnsearch-cancel" style="margin:0;"></a>
            </div>
        </div>
        <div class="listbox" style="padding:0;margin:0;">
            <div class="listheader">
                <table class="tbheader" cellpadding="0" cellspacing="0" style="min-width:1100px;">
                    <tr>
                        <td style="width:45px;">序号</td>
                        <td style="width:120px;">开始录音时间</td>
                        <td style="width:60px;">录音时长</td>
                        <td style="width:120px;">录音结束时间</td>
                        <td style="width:55px;">呼入呼出</td>
                        <td style="width:90px;">本机号码</td>
                        <td style="width:100px;">对方号码</td>
                        <td style="width:150px;">文件名称</td>
                        <td style="width:60px;">文件大小</td>
                        <td style="width:40px;">播放</td>
                        <td style="width:40px;">下载</td>
                        <td style="width:50px;">ID</td>
                        <td style="width:120px;">记录时间</td>
                        <!--<td style="width:40px;">删除</td>-->
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
        <canvas id="Canvas"></canvas>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<script type="text/javascript">
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

    $('#ddlPhoneNumber').change(function(){
        getSoundRecordList();
    });
    $('#ddlInOut').change(function(){
        getSoundRecordList();
    });
    $('#ddlDesc').change(function(){
        getSoundRecordList();
    });
    $('#ddlPageSize').change(function(){
        pageIndex = pageStart;
        pageSize = parseInt($(this).val().trim(), 10);
        getSoundRecordList();
    });

    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    createPhoneNumberOption(cms.util.$('ddlPhoneNumber'));
    
    getSoundRecordList();
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

function getData(){
    pageIndex = pageStart;
    getSoundRecordList();
}

function getAllData(){
    $('#txtTargetNumber').attr('value', '');
    pageIndex = pageStart;
    getSoundRecordList();
}

function getSoundRecordList(){
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var inOut = $('#ddlInOut').val().trim();
    var phoneNumber = $('#ddlPhoneNumber').val().trim();
    var targetNumber = $('#txtTargetNumber').val().trim();
    var isDesc = $('#ddlDesc').val().trim();
    
    //清除分页数据
    $('#pagination').html('');
    //显示加载
    showLoading(true);
    
    var urlparam = 'action=getSoundRecordList&startTime=%s&endTime=%s&inOut=%s&phoneNumber=%s&targetNumber=%s&isDesc=%s&pageIndex=%s&pageSize=%s'.format(
        [startTime, endTime, inOut, phoneNumber, targetNumber, isDesc, (pageIndex-pageStart), pageSize] 
        ,'%s');
    module.ajaxRequest({
        url: cmsPath + '/ajax/sms.aspx',
        data: urlparam,
        callBack: showSoundRecordList,
        param: {
        
        }
    });
}

function showSoundRecordList(data, param){
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
        
        buildDataList(objList, dr, pnum, rid, jsondata.fileDir);
        
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
    getSoundRecordList();
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

function buildDataList(objList, dr, pnum, rid, fileDir){
    var cellid = 0;
    var rowData = [];
    var row = objList.insertRow(rid);
    var strFileName = getFileName(dr.filePath);
    var isExist = '-1' != dr.fileSize;

    var strPlay = '-';
    var strDownload = '-';
    if(isExist){
        strPlay = '<a onclick="playSound(\'' + fileDir + dr.filePath + '\');">播放</a>';
        strDownload = '<a onclick="downloadFile(\'' + fileDir + dr.filePath + '\');">下载</a>';
    }
    //var strDel = '<a onclick="deleteFile(' + dr.id + ',\'' + dr.startTime.split(' ')[0] + '\');">删除</a>';
    
    rowData[cellid++] = {html: (pnum + rid + 1), style:[['width','45px']]};
    rowData[cellid++] = {html: dr.startTime, style:[['width','120px']]};
    rowData[cellid++] = {html: parseDuration(dr.duration), style:[['width','60px']]};
    rowData[cellid++] = {html: dr.endTime, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.inOut == 0 ? '呼入' : '呼出', style:[['width','55px']]};
    rowData[cellid++] = {html: dr.phoneNumber, style:[['width','90px']]};
    rowData[cellid++] = {html: '' == dr.targetNumber ? '-' : dr.targetNumber, style:[['width','100px']]};
    rowData[cellid++] = {html: strFileName, style:[['width','150px']]};
    rowData[cellid++] = {html: parseFileSize(dr.fileSize), style:[['width','60px']]};
    rowData[cellid++] = {html: strPlay, style:[['width','40px']]};
    rowData[cellid++] = {html: strDownload, style:[['width','40px']]};
    rowData[cellid++] = {html: dr.id, style:[['width','50px']]};
    rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
    //rowData[cellid++] = {html: strDel, style:[['width','40px']]};
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
}

function getFileName(strFilePath){
    if('' == strFilePath){
        return '-';
    }
    var arr = strFilePath.split('/');
    return arr[arr.length - 1];
}

function parseFileSize(fileSize){
    if('-1' == fileSize){
        return '<span style="color:#f00;">文件不存在</span>';
    }
    return fileSize;
}

function parseDuration(d){
    var h = 0;
    var m = 0;
    var s = 0;
    
    if(d > 3600){
        h = parseInt(d / 3600, 10);
        var temp = d % 3600;
        if(temp != 0){
            if(temp > 60){
                m = parseInt(temp / 60, 10);
                s = temp % 60;
            } else {
                s = parseInt(temp, 10);
            }
        } 
    } else {
        m = parseInt(d / 60, 10);
        s = d % 60;
    }
    
    var strTitle = (h > 0 ? h + '小时' : '')
        + (m > 0 ? m + '分' : '')
        + (s > 0 ? s + '秒' : '');
    
    return '<span title="' + strTitle + '">' + h + ":" + m + ":" + s + "</span>";
}

function playSound(filePath){
    var isHtml5 = false;
    if (!cms.util.$('Canvas').getContext){
        isHtml5 = false;
    } else {
        isHtml5 = true;
    }
    
    var strHtml = '<div style="display:block; padding:3px 5px;">'
        + '录音文件：' + getFileName(filePath) + '<br />';
    if(isHtml5){
        strHtml += '<audio controls="controls" id="audio_player" style="width:290px;height:30px;">'
            + '<source src="' + filePath + '" >'
            + '</audio>';
    } else {
        strHtml += '<embed id="MPlayer" src="' + filePath + '" loop="false" width="290px" height="45px" /></embed>';
    }
    strHtml += '</div>';
    
    var config = {
        id: 'pwPlaySound',
        title: '播放电话录音',
        html: strHtml,
        noBottom: true,
        width: 300,
        height: isHtml5 ? 90 : 102,
        lock: false,
        position: 9
    };
    cms.box.win(config);
}

function deleteFile(id, date){
    var config = {
        id: 'pwDeleteFile',
        title: '删除电话录音记录',
        html: '确定要删除电话录音记录吗？',
        callBack: deleteFileAction,
        returnValue:{
            id: id,
            date: date
        }
    };
    cms.box.confirm(config);
}

function deleteFileAction(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var id = pwReturn.returnValue.id;
        var date = pwReturn.returnValue.date;
        var urlparam = 'action=deleteSoundRecordFile&id=%s&date=%s'.format([id, date],'%s');
        module.ajaxRequest({
            url: cmsPath + '/ajax/sms.aspx',
            data: urlparam,
            callBack: deleteFileCallBack
        });
    }
    pwobj.Hide();
}

function deleteFileCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    getSoundRecordList();
}

function downloadFile(filePath){
    try{
        var handleUrl = cmsPath + '/ajax/download.aspx?action=downloadSound&path=' + filePath;
	    window.location.href = handleUrl;
	}catch(ex){
	    cms.box.alert({id: 'pwError', title: '录音文件下载失败', html: '录音文件下载失败。<br />失败原因：<br />' + ex});
	}
}
</script>
</asp:Content>