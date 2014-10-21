<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="bulletinDetail.aspx.cs" Inherits="modules_infoManage_sub_bulletinDetail" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
<div id="bodyTitle"><div id="lblPrompt" runat="server"></div></div>
<div id="bodyContent" style="text-align:center; max-width:800px;">
    <h3 style="font-size:18px; line-height:30px; height:30px;"><%=info.Title%></h3>
    <div style="height:30px;">发布时间：<%=info.CreateTime%></div>
    <div style="text-align:left; overflow:auto; font-size:14px;padding:5px 10px; " id="divContent">
        <%=info.Content%>
        <br />
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript">
    $(window).load(function(){
        setBoxSize();
    
    });
    
    $(window).resize(function(){
        setBoxSize();
    });
    
    function setBoxSize(){
        $('#divContent').height(boxSize.height - 96);
    }
</script>
</asp:Content>