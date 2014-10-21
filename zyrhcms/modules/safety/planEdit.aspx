<%@ Page Language="C#" AutoEventWireup="true" CodeFile="planEdit.aspx.cs" Inherits="modules_safety_planEdit" ValidateRequest="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>编辑预案</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/xheditor/xheditor.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</head>
<body style="overflow:auto;">
    <form id="form1" runat="server">
    <div style="padding:10px;">
        <span style="display:none;">
        <input type="text" id="txtPlanId" runat="server" />
        <input type="text" id="txtAction" runat="server" />
        </span>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <!--
            <tr style="display:none;">
                <td style="width:70px;">预案类型：</td>
                <td></td>
            </tr>
            -->
            <tr>
                <td style="width:70px;">专业类型：</td>
                <td>
                    <select id="ddlProfessionType" class="select" runat="server">
                        <option value="1">接触网</option>
                        <option value="2">变电</option>
                        <option value="3">电力</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td style="width:70px;">预案名称：</td>
                <td><input type="text" id="txtPlanName" class="txt w500" runat="server" /></td>
            </tr>
            <tr>
            
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td style="width:70px; vertical-align:top;">预案内容：</td>
                <td>
                    <div style="background:#fff;">
                    <textarea id="txtPlanContent" name="txtPlanContent" cols="20" rows="2" style="width:600px; height:350px;" runat="server"></textarea>
                    </div>
                    <script type="text/javascript">
                        $(document).ready(function() { 
                            $('#txtPlanContent').xheditor({skin:'o2007silver',tools:"my",upImgUrl:"../upload/upload.aspx?dir=plan&type=pics",upImgExt:"jpg,jpeg,gif,png"}); 
                        }); 
                    </script>
                </td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td style="width:70px;"></td>
                <td>
                    <a class="btn btnc24" onclick="savePlan();"><span class="w50">保存</span></a>
                    <a class="btn btnc24" onclick="resetPlan();"><span class="w50">重置</span></a>
                    <asp:Label ID="lblPrompt" runat="server" ForeColor="green"></asp:Label>
                    <asp:Label ID="lblError" runat="server" ForeColor="red"></asp:Label>
                    <input id="btnSubmit" type="submit" value="保存" runat="server" onserverclick="btnSubmit_ServerClick" style="visibility:hidden;" />
                    <input id="btnReset" type="reset" value="重置" style="visibility:hidden;" />
                </td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
<script type="text/javascript">
$(window).load(function(){
    $('#txtPlanName').focus();
});
function savePlan(){
    var strName = $('#txtPlanName').val().trim();
    var strContent = $('#txtPlanContent').val().trim();
    
    if(strName.equals(string.empty)){
        cms.box.alert({title:'提示', html:'请输入预案名称！'});
    } else if(strContent.equals(string.empty) || cms.util.checkContentIsEmpty(strContent, true)){
        cms.box.alert({title:'提示', html:'请输入预案内容！'});    
    } else {
        $('#btnSubmit').click();    
    }
}
function resetPlan(){
    cms.box.confirm({
        title: '确认',
        html: '确定要重置内容吗？',
        callBack: resetCallBack
    });
}

function resetCallBack(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        $('#btnReset').click();        
    }
    pwobj.Hide();
}
</script>