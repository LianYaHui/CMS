<%@ Page Language="C#" MasterPageFile="~/master/mpWap.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="wap_default" %>
<%@ MasterType VirtualPath="~/master/mpWap.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <style type="text/css">
        ul,li{margin:0;padding:0;}
        .btnbox{}
        .btnbox li{width:40px; height:36px; display:block; float:left; border:solid 1px #99bbe8; padding:5px; margin:5px; text-align:center;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div>
        <ul class="btnbox">
            <li><a onclick="report();">故障申报</a></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
    <script type="text/javascript">
        function report(){
            alert('故障申报');
        }
    </script>
</asp:Content>