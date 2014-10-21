<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="datumEdit.aspx.cs" Inherits="modules_infoManage_sub_datumEdit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
<div id="bodyTitle"><div id="lblPrompt" runat="server"></div></div>
<div id="bodyContent">
    <form id="Form1" action="" method="post" runat="server">
        <input id="txtAction" type="hidden" runat="server"/>
        <input type="hidden" id="txtId" runat="server" />
        <table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:10px;">
            <tr>
                <td class="w70">资料标题：</td>
                <td><input type="text" id="txtTitle" class="txt w400" runat="server" maxlength="64" /></td>
            </tr>
            <tr>
                <td>文件类型：</td>
                <td>
                    <select id="ddlFileExt" class="select w200" runat="server">
                        <option value="rar">RAR压缩文件</option>
                        <option value="zip">ZIP压缩文件</option>
                        <option value="doc">Word文档(.doc|.wps)</option>
                        <option value="docx">Word文档(.docx)</option>
                        <option value="xls">Excel文档(.xls|.et)</option>
                        <option value="xlsx">Excel文档(.xlsx)</option>
                        <option value="pdf">PDF文档</option>
                        <option value="img">图片文件(.jpg|.gif|.png|.bmp)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:top;">选择文件：</td>
                <td>
                    <input id="fileDatum" type="file" runat="server" class="txt w200" />
                    <input type="hidden" id="txtOldPath" runat="server" />
                    <br />
                    <span style="color:#999;">编辑资料时，如果不需要修改上传文件，可以不选择文件。</span>
                </td>
            </tr>
            <tr>
                <td>是否有效：</td>
                <td colspan="3">
                    <label><input type="radio" name="rbValidate" value="1" runat="server" id="rbValidate1" />有效</label>
                    <label><input type="radio" name="rbValidate" value="0" runat="server" id="rbValidate0" />无效</label>
                    <span style="color:#999;">若设置为无效，该资料信息不会出现在首页“下载中心”中。</span>
                </td>
            </tr>
            <tr>
                <td>排序编号：</td>
                <td colspan="3">
                    <input type="text" id="txtSortOrder" class="txt w80" runat="server" maxlength="8" value="0" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')" />
                    <span style="color:#999;">降序排列，数字大的排在前面</span>
                </td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:10px;">
            <tr>
                <td class="w70"></td>
                <td>
                    <a class="btn btnc24" onclick="saveDatum();"><span class="w75">确认,上传</span></a>
                    <input id="btnSave" type="submit" value="确定" onserverclick="btnSave_ServerClick" runat="server" style="visibility:hidden;width:0;height:0;" />
                </td>
            </tr>
        </table>
    </form>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript"> 
    /*
    $(".tbform tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    */
    
    function saveDatum(){
        var strTitle = $$('txtTitle').val().trim();
        
        if('' == strTitle){
            cms.box.msgAndFocus(page.$('txtTitle'), {title:'提示信息', html:'请输入资料标题！'});
        } else {
            $$('btnSave').click();
        }
    }
</script>
</asp:Content>