<%@ Page Language="C#" MasterPageFile="~/master/mpPlan.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="modules_responsePlan_default" %>
<%@ MasterType VirtualPath="~/master/mpPlan.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dropdownlist/dropdownlist.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody" class="hide">
        <div id="bodyLeft">
            <div id="leftMenu" class="left-menu">
                <div class="tabpanel" id="tabModule">
                    <a class="cur" lang="1" rel="#tabContainer_1"><span lang="tab,cur">应急预案</span></a>
                    <a class="tab" lang="2" rel="#tabContainer_2"><span lang="tab,cur">事故管理</span></a>
                    <a class="tab" lang="3" rel="#tabContainer_3"><span lang="tab,cur">预案管理</span></a>
                    <a class="tab" lang="4" rel="#tabContainer_4"><span lang="tab,cur">视频预览</span></a>
                    <a class="tab" lang="5" rel="#tabContainer_5"><span lang="tab,cur">系统设置</span></a>
                  
                </div>
                
                <div id="tabContainer">
                    <div id="tabContainer_1" class="tabcontainer">
                        <div class="tabpanel" id="tabAccident">
                            <a lang="0" rel="#planlist_1" class="cur"><span>未处理的预案</span></a>
                            <a lang="1" rel="#planlist_2" class="tab"><span>已处理的预案</span></a>
                        </div>
                        <div id="listResponsePlan" style="height:150px;background:#fff;">
                            <div id="planlist_1" class="planlist">未处理的预案信息列表</div>
                            <div id="planlist_2" class="planlist" style="display:none;">已处理的预案信息列表</div>
                        </div>
                        <div class="titlebar">
                            <div class="title">预案详情</div>
                        </div>
                        <div id="planDetail" style="height:150px;padding:0 5px;background:#fff;">
                        
                        </div>
                        <div class="titlebar">
                            <div class="title">预案统计</div>
                        </div>
                        <div style="height:120px;background:#fff;">
                        
                        </div>
                    </div>
                    <div id="tabContainer_2" class="tabcontainer" style="display:none;">
                        <div class="titlebar">
                            <div class="title">事故列表</div>
                        </div>
                        <div style="background:#fff;">
                            <table cellpadding="0" cellspacing="0" id="tbPlanList"></table>
                            
                        </div>
                        <div class="titlebar">
                            <div class="title">事故详情</div>
                        </div>
                        <div id="planDetail_manage" style="background:#fff;">
                            
                        </div>
                    </div>
                    <div id="tabContainer_3" class="tabcontainer" style="display:none;">
                        <div class="titlebar">
                            <div class="title">预案类型</div>
                        </div>
                        <div id="treePlanType" style="overflow:auto;"></div>
                        <div class="titlebar" style="border-top:solid 1px #99bbe8; ">
                            <div class="title">功能模块配置</div>
                        </div>
                        <div style="height:159px;overflow:auto; background:#fff;">
                            <div class="listheader">
                                <table cellpadding="0" cellspacing="0" class="tbheader">
                                    <tr>
                                        <td style="width:30px;">序号</td>
                                        <td style="width:120px;">模块名称</td>
                                        <td style="width:30px;">排序</td>
                                        <td style="width:60px;">是否启用</td>
                                        <td></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="listbox" style="height:135px; overflow:auto;">
                                <table cellpadding="0" cellspacing="0" class="tblist" id="tbPlanTypeModule"></table>
                            </div>
                        </div>
                    </div>
                    <div id="tabContainer_5" class="tabcontainer" style="display:none;">
                        <div class="titlebar">
                            <div class="title">模块管理</div>
                        </div>
                        <div id="moduleList" class="planlist" style="background:#fff;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="bodyLeftSwitch" class="switch-left" title="隐藏左栏菜单"></div>
        <div id="bodyMain">
            <!--
            <div id="mainTitle" class="titlebar">
                <div class="title">电子地图</div>
            </div>
            -->
            <div id="mainContent" style="position:relative;">
                <div id="toolbar" class="emap-toolbar">
                    <div style="float:left;padding:2px 2px 0;">
                        <a class="ibtn nobg" onclick="distanceFrom(this);"><i class="icon-measure"></i></a>
                        <a class="ibtn nobg"><i class="icon-marquee"></i></a>
                    </div>
                    <div style="float:right;padding:2px 2px 0;">
                        <a class="btn btnc22" onclick="editResponsePlan(this);"><span class="w60">预案发布</span></a>
                    </div>
                </div>
                <div id="mapCanvas"></div>
                <div class="emap-menu-list-bg" style="position:absolute; left:0; top:27px; z-index:1001;"></div>
                
                <div id="menuBox" onmouseover="showMenu();" onmouseout="hideMenu();" style="position:absolute; background:transparent; left:0; top:27px; overflow:hidden; z-index:1003;">
                    <div class="emap-menu-list" style="z-index:1005; margin:0 auto;">
                        <ul style="margin:0 auto;display:none;">
                            <li>
                                <a onclick="showResponsePlan(this);" title="应急预案"><i style="background-image:url('<%=strImgPathDir%>/1.png');"></i><span>应急预案</span></a>
                            </li>
                            <li>
                                <a onclick="showResponsePlanManage(this);" title="预案管理"><i style="background-image:url('<%=strImgPathDir%>/2.png');"></i><span>预案管理</span></a>
                            </li>
                            <li>
                                <a onclick="editResponsePlan(this);" title="预案发布"><i style="background-image:url('<%=strImgPathDir%>/3.png');"></i><span>预案发布</span></a>
                            </li>
                            <li>
                                <a title="设备信息"><i style="background-image:url('<%=strImgPathDir%>/4.png');"></i><span>视频预览</span></a>
                            </li>
                            <li>
                                <a><i title="视频预览" style="background-image:url('<%=strImgPathDir%>/5.png');"></i><span>设备信息</span></a>
                            </li>
                            <li>
                                <a title="设备信息"><i style="background-image:url('<%=strImgPathDir%>/4.png');"></i><span>视频预览</span></a>
                            </li>
                            <li>
                                <a><i title="视频预览" style="background-image:url('<%=strImgPathDir%>/5.png');"></i><span>设备信息</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/responsePlan.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/testdata.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/mapcorrect.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/emap.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/responsePlan/typetree.js"></script>
</asp:Content>