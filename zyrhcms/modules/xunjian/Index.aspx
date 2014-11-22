<%@ Page Title="" Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="modules_xunjian_Index" %>

<%@ Register Src="~/common/ascx/top.ascx" TagName="top" TagPrefix="uc1" %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" runat="Server">
    <link href="../../js/bootstrap/css/bootstrap.css" rel="stylesheet" />

    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />

    <script>var _path = "<%=Public.WebDir%>/modules/xunjian/";</script>

    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>


    <link href="../../js/easyui/easyui.css" rel="stylesheet" />
    <link href="../../js/easyui/icon.css" rel="stylesheet" />
    <link href="../../js/easyui/min.Plugin.css" rel="stylesheet" />
    <link href="../../js/easyui/ui-common.css" rel="stylesheet" />

    <script src="../../js/easyui/lib.js"></script>
    <script src="../../js/easyui/jquery.min.js"></script>
    <script src="../../js/easyui/Jquery.MS.min.js"></script>
    <script src="../../js/easyui/jquery.easyui.min.js"></script>
    <script src="../../js/easyui/easyui-lang-zh_CN.js"></script>
    <script src="../../js/easyui/common.js"></script>
    <%--<script src="../../js/bootstrap/js/bootstrap.min.js"></script>--%>

    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>

    <style>
        body {
            height: 100%;
            width: 100%;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="Server">
    <div class="easyui-layout" data-options="fit:true">
        <div id="nav_div_left" data-options="region:'west',split:true" title="导航栏" style="width: 180px;">
            <div id="nav-left-div" class="easyui-accordion" data-options="fit:true,border:false">
                <div title="用户权限管理">
                    <ul>
                        <li class="menu-li" data-url="UserPermissionManage.aspx">权限管理</li>
                    </ul>
                </div>

                <div title="任务管理">
                    <ul>

                        <li class="menu-li" data-url="PatrolLineManage.aspx">线路管理</li>
                        <li class="menu-li" data-url="PatrolPointManage.aspx">巡检点类型管理</li>
                        <li class="menu-li" data-url="PointManagePage.aspx">巡检点管理</li>
                        <li class="menu-li" data-url="TaskManage.aspx">任务管理</li>
                    </ul>
                </div>

                <div title="系统代码管理">
                    <ul>
                        <li class="menu-li" data-url="SysCodeManage.aspx">代码管理</li>
                    </ul>
                </div>
            </div>
        </div>
        <div data-options="region:'center'">
            <div id="tabs" class="easyui-tabs" data-options="fit:true,border:false,plain:true">
                <div title="控制台" style="padding: 5px" data-option="closable:true">
                    <div class="warp padding5 radia5">
                        <span>
                            <a href="../../default.aspx">返回首页</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>


    </div>

    <script type="text/javascript">
        $(function () {
            var $acc = $("#nav-left-div").accordion();

            $acc.accordion("unselect", 0);
            
            


            //Tabs
            $("#nav-left-div div ul li").click(function () {
                var nav_menu = $(this);
                if (nav_menu.data("new") === "True") {
                    window.open(nav_menu.data("url"));
                    return;
                }

                var tabs = $("#tabs");
                var flag = false;
                var tab = $("#tabs").tabs("tabs");

                for (var i = 0; i < tab.length; i++) {
                    if ($.trim(tab[i].panel("options").title) == $.trim(nav_menu.text())) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    tabs.tabs("select", $.trim(nav_menu.text()));
                } else {
                    $("#tabs").tabs('add', {
                        title: $.trim(nav_menu.text()),
                        href: "<%=Public.WebDir%>/modules/xunjian/" + nav_menu.data("url"),
                        closable: true,
                        tools: [{
                            iconCls: 'icon-mini-refresh',
                            handler: function () {
                                var slt = tabs.tabs("getTab", $(this).parent().parent().find('.tabs-title').text());
                                slt.panel("refresh");
                            }
                        }]
                    });
                }
            });
        });
    </script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" runat="Server">
</asp:Content>

