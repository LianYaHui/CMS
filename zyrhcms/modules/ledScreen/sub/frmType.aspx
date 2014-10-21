<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="frmType.aspx.cs" Inherits="modules_ledScreen_sub_frmType" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
<link rel="stylesheet" type="text/css" href="<%=Config.WebDir%>/skin/default/css/main.css" />
<link rel="stylesheet" type="text/css" href="<%=Config.WebDir%>/skin/default/css/page.css" />
<script type="text/javascript">var hasType = <%=strHasType%>;</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
<div style="padding-top:2px;">
    <form id="Form1" action="" runat="server" method="post">
        <asp:PlaceHolder ID="phType" runat="server">
            <%if(maxCount>=5){ %>
            <asp:DropDownList ID="ddlType0" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType1" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType2" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType3" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType4" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <%}%>
            <%if(maxCount>=10){ %>
            <asp:DropDownList ID="ddlType5" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType6" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType7" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType8" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType9" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <%}%>
            <%if(maxCount>=15){ %>
            <asp:DropDownList ID="ddlType10" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType11" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType12" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType13" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType14" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <%}%>
            <%if(maxCount>=20){ %>
            <asp:DropDownList ID="ddlType15" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType16" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType17" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType18" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <asp:DropDownList ID="ddlType19" runat="server" CssClass="select" style="margin-right:3px;"></asp:DropDownList>
            <%}%>
        </asp:PlaceHolder>
        <input type="hidden" id="txtId" runat="server" class="txt w40" />
        <input type="hidden" id="txtTypeId" runat="server" class="txt w40" />
        <input type="hidden" id="txtParentId" runat="server" class="txt w40" />
        <input type="hidden" id="txtResultId" runat="server" class="txt w40" />
        <span id="lblError" runat="server"></span>
    </form>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/jquery.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/common.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/cms.const.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/cms.util.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/popwin/popwin.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/cms.box.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/cms.jquery.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/js/page.js"></script>
<script type="text/javascript">
    $(window).load(function () {
        if (top.location != self.location) {
            if (typeof parent.showLoadPrompt == 'function') {
                parent.showLoadPrompt(true);
            }
        }
        <%if(isSetFocus){%>
        var id = <%=maxLevel%>;
        for(var i=id; i>=0; i--){
            if ($$('ddlType' + i).attr('id') !== undefined) {
                $$('ddlType' + i).focus();
                break;
            }
        }
        <%}%>
    });

    function getResultId() {
        return $$('txtResultId').val().trim();
    }

    function setFocus() {
        if (hasType) {
            $$('ddlType0').focus();
        }
    }

    function reload() {
        location.href = location.href;
    }
</script>
</asp:Content>