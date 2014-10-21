<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="infoTypeEdit.aspx.cs" Inherits="modules_ledScreen_sub_infoTypeEdit" %>
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
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/xheditor/xheditor.js"></script>
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/xheditor/xheditor_lang/zh-cn.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div class="pageTop">
        <div class="title"><%=strPageTitle%></div>
        <div class="tools"><a class="ibtn nobg" onclick="page.reload();" title="刷新"><i class="icon-refresh"></i>aa</a></div>
        <div id="lblPrompt" runat="server" class="prompt"></div>
    </div>
    <div class="pageBody"><a id="top" name="top"></a>
        <form id="Form1" action="" runat="server" method="post" onsubmit="return formSubmit();return false;">
            <div>
                <input id="txtAction" type="hidden" runat="server"/>
                <input id="txtParentId" type="hidden" runat="server"/>
                <input id="txtTypeId" type="hidden" runat="server"/>
            </div>
            <div id="pageContent" class="pageContent" style="padding:0px;">
                <div class="tabpanel">
                    <a class="cur" lang="info" rel="#divInfo"><span>基本信息</span></a>
                    <a class="tab" lang="config" rel="#divConfig"><span>分类配置</span></a>
                    <%if(this.typeId>0&&this.strAction.Equals("edit")){%>
                    <a class="tab" lang="alarm" rel="#divAlarm"><span>预警信号</span></a>
                    <%}%>
                </div>
                <script type="text/javascript">cms.jquery.tabs('.tabpanel', null, '.tabcon', 'switchTabItem');</script>
                <div id="tabContent" style="overflow:auto;">
                    <!--基本信息-->
                    <div id="divInfo" class="tabcon" style="padding:10px;">
                        <table cellpadding="0" cellspacing="0" class="tbform" style="width:100%;">
                            <tr>
                                <td class="w80">上级分类：</td>
                                <td>
                                    <span id="frmPrompt">正在加载，请稍候...</span>
                                    <iframe name="frmType" id="frmType" src="frmType.aspx?typeId=<%=typeId%>&isParent=1&parentId=<%=parentId%>&isSetFocus=<%=isSetFocus?1:0%>&<%=DateTime.Now.ToString("HHmmss")%>" style="display:none;overflow:hidden;width:100%;height:25px;" frameborder="0" scrolling="auto"></iframe>
                                </td>
                            </tr>
                            <tr>
                                <td>分类名称：</td>
                                <td><input type="text" id="txtTypeName" class="txt w150" runat="server" maxlength="30" />
                                </td>
                            </tr>
                            <!--<tr>
                                <td>分类编号：</td>
                                <td><input type="text" id="txtTypeCode" class="txt w150" runat="server" maxlength="16" /></td>
                            </tr>-->
                            <tr>
                                <td>是否启用：</td>
                                <td>
                                    <select id="ddlEnabled" class="select w150" runat="server">
                                        <option value="1">启用</option>
                                        <option value="0">不启用</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>排序编号：</td>
                                <td><input type="text" id="txtSortOrder" class="txt w50" runat="server" maxlength="6" />
                                    <span>数字大的排前面</span>
                                </td>
                            </tr>
                            <tr style="<%=strAction.Equals("edit")?"display:none;":""%>">
                                <td></td>
                                <td><label for="cphBody_chbContinue" class="chb-label-nobg" style="float:left;width:150px;">
                                        <input type="checkbox" id="chbContinue" class="chb" runat="server" /><span>添加完成后继续添加</span>
                                    </label>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!--分类介绍-->
                    <div id="divConfig" class="tabcon" style="padding:10px;display:none;">
                        <table cellpadding="0" cellspacing="0" class="tbform">
                            <tr>
                                <td class="w80" style="vertical-align:top;">存储区位：</td>
                                <td>
                                    <div id="divMemory" style="float:left;clear:both;"></div>
                                    <input type="hidden" id="txtMemoryNumberList" readonly="readonly" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>默认有效期：</td>
                                <td>
                                    <input type="text" maxlength="5" id="txtValidityHour" class="txt w50" runat="server" /> 小时
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!--预警配置-->
                    <div id="divAlarm" class="tabcon" style="padding:10px;display:none;">
                        <table cellpadding="0" cellspacing="0" class="tbform">
                            <tr>
                                <td class="w65" style="vertical-align:top;">预警信号：</td>
                                <td>
                                    <a class="btn btnc22" onclick="showEditTypeSignal('action=add&typeId=<%=typeId%>','添加预警信号');"><span>添加预警信号</span></a>
                                    <div id="divSignalList">
                                        <table id="tbSignal" cellpadding="0" cellspacing="0" class="tblist" style="line-height:22px;">
                                            <tr class="trheader" style="height:23px;">
                                                <td style="width:60px;">信号名称</td>
                                                <td style="width:100px;">信号描述</td>
                                                <td style="width:280px;">防御指南</td>
                                                <td style="width:70px;">图标</td>
                                                <td style="width:70px;">操作</td>
                                            </tr>
                                        </table>
                                        <style type="text/css">
                                            #tbSignal{}
                                            #tbSignal td{height:22px;}
                                        </style>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <table cellpadding="0" cellspacing="0" class="tbform" style="margin:0px 10px 30px;" id="tbSubmit">
                        <tr>
                            <td class="w80"></td>
                            <td>
                                <a class="btn btnc24" onclick="formSubmit();return false;"><span class="w65">提交</span></a>
                                <a class="btn btnc24" onclick="$('#btnReset').click();"><span class="w65">取消</span></a>
                                <asp:Button ID="btnSubmit" runat="server" Text="提交" onclick="btnSubmit_Click" style="visibility:hidden;" />  
                                <input id="btnReset" type="reset" value="reset" style="visibility:hidden;width:0;height:0;" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    </div>
    <div class="pageBottom">
        <div class="panel-left" style="width:80%;"><span id="lblError" runat="server" class="lbl-warning"></span></div>
        <div class="panel-right"></div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript">
    var pwEditSignal = null;
    var isTopLevel = <%=isTopLevel ? "true":"false" %>;
    var arrUsedMemoryNumber = '<%=strUsedMemoryNumber%>'.split(',');
    var htUsed = new cms.util.Hashtable();
    for(var i = 0,c = arrUsedMemoryNumber.length; i<c; i++){
        htUsed.add(arrUsedMemoryNumber[i]);
    }
    
    $(window).load(function () {
        cms.util.repairSelectWidth(null, $$('txtTypeName'));

        $('#pageContent').keypress(function () {
            setParentNeedSave();
        });

        if (typeof isSetFocus == 'undefined' || isSetFocus) {
            $('#frmType').focus();
        }
        
        showMemoryList();
        
        getTypeSignal();
    });
    
    function setBoxSize() {
        $('.pageContent').height(boxSize.height - 55);
        $('#tabContent').height(boxSize.height - 80);
    }

    function showLoadPrompt(isLoaded) {
        $('#frmPrompt').hide();
        $('#frmType').show();
    }

    function getTypeId() {
        $$('txtParentId').attr('value', $('#frmType')[0].contentWindow.getResultId());
        return $$('txtParentId').val();
    }
    function setParentNeedSave() {
        if (location.href != top.location.href) {
            parent.isNeedSave = true;
        }
    }
    
    function getMemoryNumber(){
        $$('txtMemoryNumberList').attr('value', cms.util.getCheckBoxCheckedValue('chbMemory', ','));
    }

    $(window).resize(function () {

    });
    
    function switchTabItem(param){
        if(param.action == 'alarm'){
            $('#tbSubmit').hide();
        } else {
            $('#tbSubmit').show();
        }
    }

    function formSubmit() {
        var parentId = getTypeId();
        
        getMemoryNumber();
        
        //var strTypeCode = $$('txtTypeCode').val().trim();
        var strTypeName = $$('txtTypeName').val().trim();
        var strAction = $$('txtAction').val().trim();

        /*if ('' == strTypeCode) {
            page.showPrompt('请输入分类编号！', $$('lblError'), infoType.warning);
            $$('txtTypeCode').focus();
            return false;
        } else */if ('' == strTypeName) {
            page.showPrompt('请输入分类名称！', $$('lblError'), infoType.warning);
            $$('txtTypeName').focus();
            return false;
        }

        page.showPrompt('', $$('lblError'));
        $$('btnSubmit').click();
    }
    
    function showMemoryList(){
        var nums = $$('txtMemoryNumberList').val().split(',');
        var strHtml = '';
        var min = 0;
        var max = 15;
        var htNum = new cms.util.Hashtable();
        
        for(var i=0; i<nums.length; i++){
            htNum.add(nums[i]);
        }
        
        var strName = 'chbMemory';
        var isUsed = !isTopLevel;
        var strChecked = '';
        var strDisabled = isUsed ? ' disabled="disabled" ' : '';
        for(var i=min; i<=max; i++){
            isUsed = !isTopLevel || htUsed.contains('' + i);
            strChecked = htNum.contains(i) ? ' checked="checked" ' : '';
            strDisabled = isUsed ? ' disabled="disabled" ' : '';
            strName = isUsed ? 'chbMemory_used' : 'chbMemory';
            strHtml += '<label class="chb-label-nobg" style="margin-right:6px;float:left;">'
                + '<input type="checkbox" class="chb" value="' + i + '" name="' + strName + '" '
                + strChecked + strDisabled + ' />'
                + '<span>' + i + '</span>'
                + '</label>';
        }
        if(isTopLevel){
            strHtml += '<a class="btn btnc22" onclick="cms.util.selectCheckBox(\'chbMemory\', 1);"><span>全选</span></a>'
                + '<a class="btn btnc22" onclick="cms.util.selectCheckBox(\'chbMemory\', 3);"><span>反选</span></a>'
                + '<a class="btn btnc22" onclick="cms.util.selectCheckBox(\'chbMemory\', 2);"><span>取消</span></a>';
        } else {
            strHtml += '<br /><span class="explain">子分类继承上级分类的存储区位设置</span>'; 
        }
        
        $('#divMemory').html(strHtml);
    }
    
    function getTypeSignal(){
        var typeId = $$('txtTypeId').val().trim();
        var urlparam = 'action=getTypeSignal&typeId=' + typeId;
        module.ajaxRequest({
            url: cms.util.path + '/ajax/led.aspx',
            data: urlparam,
            callBack: getTypeSignalCallBack
        });
    }
    
    function getTypeSignalCallBack(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        showTypeSignalList(jsondata.list);
    }
    
    function showTypeSignalList(list){
        var objList = cms.util.$('tbSignal');
        cms.util.clearDataRow(objList, 1);
        var rid = 1;
        
        for(var i=0,c=list.length; i<c; i++){
            var dr = list[i];
            var row = objList.insertRow(rid);
            var rowData = [];
            var cellid = 0;
            var strOper = '<div class="oper-cell">'
                + '<a onclick="showEditTypeSignal(\'action=edit&id=' + dr.id + '\',\'编辑预警信号\');"><span>编辑</span></a>'
                + '<span>|</span>'
                + '<a><span onclick="showDeleteTypeSignal(' + dr.id + ',\'删除预警信号\');">删除</span></a>'
                + '</div>';
            var strIcon = dr.icon != '' ? '<img src="%s" style="display:block;" />'.format(cms.util.path + dr.icon,'%s') : '';
            
            //rowData[cellid++] = {html: dr.signalName, style:[['width','100px']]};
            rowData[cellid++] = {html: dr.signalName, style:[]};
            rowData[cellid++] = {html: dr.signalDesc, style:[]};
            rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.defenseGuidelines, 270, true, dr.defenseGuidelines), style:[]};
            rowData[cellid++] = {html: strIcon, style:[]};
            rowData[cellid++] = {html: strOper, style:[]};

            cms.util.fillTable(row, rowData);
            
            rid++;
        }
    }
    
    function showEditTypeSignal(param, title){
        var strUrl = 'typeSignalEdit.aspx?%s'.format(param);
        var size = page.checkWinSize([600, 400]);
        var config = {
            id: 'pwEditSignal',
            title: title,
            html: strUrl,
            requestType: 'iframe',
            width: size[0],
            height: size[1],
            minWidth: 200,
            minAble: true,
            maxAble: true,
            showMinMax: true,
            noBottom: true,
            filter: false,
            callBack: editSignalCallBack
        };
        pwEditSignal = cms.box.win(config);
    }
        
    function editSignalCallBack(pwobj, pwReturn) {
        getTypeSignal();
        pwobj.Hide();
    }
    
    function closeEditSignal(){
        getTypeSignal();
        pwEditSignal.Hide();
    }
</script>
</asp:Content>