<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="devTypeEdit.aspx.cs" Inherits="modules_organize_devTypeEdit" %>
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
                <input id="txtId" type="hidden" runat="server"/>
            </div>
            <div id="pageContent" class="pageContent" style="padding:0px;">
                    <div id="divInfo" class="tabcon" style="padding:10px;">
                        <table cellpadding="0" cellspacing="0" class="tbform" style="width:100%;">
                            <tr>
                                <td class="w80">分类编号：</td>
                                <td><input type="text" id="txtTypeCode" class="txt w150" runat="server" maxlength="16" /></td>
                            </tr>
                            <tr>
                                <td>分类名称：</td>
                                <td><input type="text" id="txtTypeName" class="txt w150" runat="server" maxlength="30" />
                                </td>
                            </tr>
                            <tr>
                                <td>分类描述：</td>
                                <td><input type="text" id="txtTypeDesc" class="txt w300" runat="server" maxlength="200" />
                                </td>
                            </tr>
                            <tr>
                                <td>网络制式：</td>
                                <td>
                                    <div id="divNetworkMode" style="margin-top:2px;">
                                        <label class="chb-label-nobg">
                                            <input type="checkbox" value="2" class="chb" name="chbNetworkMode" /><span>2G</span>
                                        </label>
                                        <label class="chb-label-nobg">
                                            <input type="checkbox" value="3" class="chb" name="chbNetworkMode" /><span>3G</span>
                                        </label>
                                        <label class="chb-label-nobg">
                                            <input type="checkbox" value="4" class="chb" name="chbNetworkMode" /><span>4G</span>
                                        </label>
                                    </div>
                                    <input id="txtNetworkMode" type="hidden" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>预置点数量：</td>
                                <td>
                                    <input type="text" id="txtPresetQuanlity" class="txt w40" runat="server" maxlength="5" />
                                    <span id="lblPQ"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>音频解码库：</td>
                                <td>
                                    <select id="ddlDecodeLibrary" class="select" runat="server">
                                        <option value="0">请选择</option>
                                        <option value="1">G.711</option>
                                        <option value="2">G.722</option>
                                    </select>
                                </td>
                            </tr>
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
        cms.util.repairSelectWidth(null, $$('txtTypeName'));

        $('#pageContent').keypress(function () {
            setParentNeedSave();
        });

        if (typeof isSetFocus == 'undefined' || isSetFocus) {
            $$('txtTypeCode').focus();
        }
        
        var strNetworkMode = $$('txtNetworkMode').val().trim();
        
        cms.util.setCheckBoxChecked('chbNetworkMode', ',', strNetworkMode);
        
        var arr = [10, 128, 256, 1000];
        var strHtml = '';
        for(var i=0; i<arr.length; i++){
            strHtml += '<a onclick="$$(\'txtPresetQuanlity\').attr(\'value\',\'' + arr[i] + '\');">' + arr[i] + '</a> ';
        }
        $('#lblPQ').html(strHtml);
    });
    
    function setBoxSize() {
        $('.pageContent').height(boxSize.height - 55);
    }

    function setParentNeedSave() {
        if (location.href != top.location.href) {
            parent.isNeedSave = true;
        }
    }

    $(window).resize(function () {

    });
    
    function formSubmit() {        
        var strTypeCode = $$('txtTypeCode').val().trim();
        var strTypeName = $$('txtTypeName').val().trim();
        var strAction = $$('txtAction').val().trim();
        var strNetworkMode = cms.util.getCheckBoxCheckedValue('chbNetworkMode', ',');
        
        $$('txtNetworkMode').attr('value', strNetworkMode);

        if ('' == strTypeCode) {
            page.showPrompt('请输入分类编号！', $$('lblError'), infoType.warning);
            $$('txtTypeCode').focus();
            return false;
        } else if ('' == strTypeName) {
            page.showPrompt('请输入分类名称！', $$('lblError'), infoType.warning);
            $$('txtTypeName').focus();
            return false;
        }

        page.showPrompt('', $$('lblError'));
        $$('btnSubmit').click();
    }
    
</script>
</asp:Content>