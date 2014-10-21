<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="typeSignalEdit.aspx.cs" Inherits="modules_ledScreen_sub_typeSignalEdit" %>
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
                <input id="txtTypeId" type="hidden" runat="server"/>
                <input id="txtSignalId" type="hidden" runat="server"/>
                <input id="txtId" type="hidden" runat="server"/>
            </div>
            <div id="pageContent" class="pageContent" style="padding:5px 10px;">
                <table cellpadding="0" cellspacing="0" class="tbform">
                    <tr>
                        <td class="w70">选择信号：</td>
                        <td>
                            <select id="ddlSignal" class="select w100" runat="server"></select>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align:top;">描述：</td>
                        <td>
                            <textarea id="txtDesc" runat="server" class="txt w450" style="height:50px;" rows="1" cols="1"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align:top;">防御指南：</td>
                        <td>
                            <textarea id="txtDefenseGuidelines" runat="server" class="txt w450" style="height:100px;" rows="1" cols="1"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>图标：</td>
                        <td>
                            <input type="file" runat="server" id="fileIcon" class="file w200" />
                            <input type="hidden" id="txtOldIcon" runat="server" />
                            <img runat="server" id="imgIcon" alt="" src="about:blank;" style="display:inline-block;float:left;" />
                        </td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0" class="tbform" style="margin:10px 0 30px;">
                    <tr>
                        <td class="w70"></td>
                        <td>
                            <a class="btn btnc24" onclick="formSubmit();return false;"><span class="w65">提交</span></a>
                            <a class="btn btnc24" onclick="$('#btnReset').click();"><span class="w65">取消</span></a>
                            <asp:Button ID="btnSubmit" runat="server" Text="提交" onclick="btnSubmit_Click" style="visibility:hidden;" />  
                            <input id="btnReset" type="reset" value="reset" style="visibility:hidden;width:0;height:0;" />
                        </td>
                    </tr>
                </table>
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
    $(window).load(function () {
        if (typeof isSetFocus == 'undefined' || isSetFocus) {
            $('#ddlSignal').focus();
        }
    });
    
    function formSubmit() {
        var typeId = parseInt($$('txtTypeId').val().trim(), 10);
        var signalId = parseInt($$('ddlSignal').val().trim(), 10);
        var id = parseInt($$('txtId').val().trim(), 10);
        
        var strAction = $$('txtAction').val().trim();
        
        if(strAction == 'edit' && id <= 0){
            page.showPrompt('ID不存在，非法提交！', $$('lblError'), infoType.warning);
            return false;
        } else if (typeId <= 0) {
            page.showPrompt('分类ID不存在，非法提交！', $$('lblError'), infoType.warning);
            return false;
        } else if (signalId <= 0) {
            page.showPrompt('请选择信号！', $$('lblError'), infoType.warning);
            $$('ddlSignal').focus();
            return false;
        }

        page.showPrompt('', $$('lblError'));
        $$('btnSubmit').click();
    }
</script>
</asp:Content>