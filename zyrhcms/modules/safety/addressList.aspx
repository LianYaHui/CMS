<%@ Page Language="C#" AutoEventWireup="true" CodeFile="addressList.aspx.cs" Inherits="modules_safety_addressList" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>通讯录</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script><%=strCode%>
    <script type="text/javascript">var strAction = '<%=strAction%>';</script>
</head>
<body>    
    <div id="mainContent" class="" style="background:#fff;">
        <div class="operbar" style="text-align:left;padding:0 5px; line-height:26px;">
            <span>部门：</span><input id="txtDeptNameList" type="text" class="txt w200" style="margin-right:5px;" readonly="readonly" onfocus="showDepartment(cms.util.$('txtDeptIndexList').value.trim());" />
            <div id="divDeptPanel" style="position:absolute;left:41px;top:23px;width:400px;height:200px;background:#fff;border:solid 1px #99bbe8;display:none;">
                <div class="operbar" style="padding:0 5px;">
                    <span style="float:left;">部门关键字：</span>
                    <input id="txtDeptKeywords" type="text" class="txt" />
                    <a onclick="" class="btn btnsearch"></a>
                    <a onclick="" class="btn btnsearch-cancel"></a>
                    <a onclick="hideDepartment();" style="float:right;">关闭</a>
                </div>
            </div>
            <input id="txtDeptIndexList" type="hidden" class="txt w200" />
            <select id="ddlSearchType" class="select">
                <option value="realName">根据姓名</option>
                <option value="jobNumber">根据工作证号</option>
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
                    <option value="20" selected="selected">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
        <div id="listBox" class="listbox">
            <div id="listHeader" class="listheader">
                <table class="tbheader" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="width:30px;">序号</td>
                        <td style="width:110px;">部门</td>
                        <td style="width:60px;">姓名</td>
                        <td style="width:100px;">工作证号</td>
                        <td style="width:110px;">职名</td>
                        <td style="width:60px;">办公电话</td>
                        <td style="width:70px;">手机号码</td>
                        <td style="width:30px;">性别</td>
                        <td style="width:70px;">出生年月</td>
                        <td style="width:70px;">入职时间</td>
                        <!--<td style="width:50px;">学历</td>-->
                        <td style="width:60px;">政治面貌</td>
                        <%if("edit" == strAction){%>
                            <td style="width:40px;">操作</td>                        
                        <%}%>
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
</body>
</html>
<script type="text/javascript">
var operH = 26;
var dataCount = 0;
var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;
var isEdit = 'edit' == strAction;
var pwEdit = null;

$(window).load(function(){
    setBodySize();
    getAddressList();
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    
    $('#mainContent').width(bodySize.width);
    $('#mainContent').height(bodySize.height);
    $('#listBox').width(bodySize.width);
    $('#listBox').height(bodySize.height - operH - 27);
    
    $('#listContent').width(bodySize.width);
    $('#listContent').height(bodySize.height - operH - 27 - 23);
};

var loadData = function(){    
    pageIndex = pageStart;
    getAddressList();
};

var loadAllData = function(){
    pageIndex = pageStart;
    $('#txtKeywords').attr('value','');
    getAddressList(); 
};

var getAddressList = function(){
    var strSearchType = $('#ddlSearchType').val().trim();
    var strKeywords = $('#txtKeywords').val().trim();
    pageSize = $('#ddlPageSize').val().trim();
    var urlparam = 'action=getAddressList&searchType=' + strSearchType + '&keywords=' + escape(strKeywords) + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize;    
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
        
        //rowData[cellid++] = {html: '<input type="checkbox" value="' + dr.devCode + '" />', style:[['width','25px']]}; //选择
        rowData[cellid++] = {html: rnum, style:[['width','30px']]}; //序号
        rowData[cellid++] = {html: dr.deptName, style:[['width','110px']]};
        rowData[cellid++] = {html: dr.realName, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.jobNumber, style:[['width','100px']]};
        rowData[cellid++] = {html: dr.jobName, style:[['width','110px']]};
        
        rowData[cellid++] = {html: dr.telephone, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.mobile, style:[['width','70px']]};
        rowData[cellid++] = {html: parseSex(dr.sex), style:[['width','30px']]};
        rowData[cellid++] = {html: dr.birthday.split(' ')[0], style:[['width','70px']]};
        rowData[cellid++] = {html: dr.entryTime.split(' ')[0], style:[['width','70px']]};
        //rowData[cellid++] = {html: dr.education, style:[['width','50px']]};
        rowData[cellid++] = {html: dr.political, style:[['width','60px']]};
        
        if(isEdit){
            if(dr.jobName != '' && loginUser.userName != 'admin' && loginUser.userName != 'whtl'){
                var strEdit = '-';
            } else {
                var strEdit = '<a onclick="showEditWin(' + dr.id + ',\'' + dr.jobNumber + '\');"><span>编辑</span></a>';
            }
            rowData[cellid++] = {html: strEdit, style:[['width','40px']]};        
        }
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
        showDataStat: true,
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

var showDepartment = function(deptIndexCodeList){
    var obj = cms.util.$('divDeptPanel');
    
    obj.style.display = '';    
};

var hideDepartment = function(){
    var obj = cms.util.$('divDeptPanel');
    obj.style.display = 'none'; 
};

var showEditWin = function(id, jobNumber){
    var strHtml = cms.util.path + '/modules/safety/editPerson.aspx?id=' + id + '&jobNumber=' + jobNumber;
    var config = {
        id: 'pwEditPerson',
        title: '编辑人员信息',
        html: strHtml,
        noBottom: true,
        boxType: 'window',
        requestType: 'iframe',
        width: 600,
        height: 400,
        closeType: 'hide',
        build: 'show',
        callBack: editPersonCallBack
    };
    
    pwEdit = cms.box.win(config);
};

var editPersonCallBack = function(pwobj, pwReturn){
    getAddressList();
    
    pwobj.Hide();
};

var closeEditWin = function(){
    if(pwEdit != null){
        pwEdit.Hide();
    }
    getAddressList();    
};
</script>