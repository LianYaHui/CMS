var tree = tree || {};

tree.$ = function(i){ return document.getElementById(i); }
tree.isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;
tree.txtTreeData = 'txtTreeData';
tree.txtTreeDevHash = 'txtTreeDevHash';
tree.txtTreeMenuKeywords = 'txtTreeMenuKeywords';
tree.txtTreeRefurbish = 'txtTreeRefurbish';
tree.txtTreeHtmlCode = 'txtTreeHtmlCode';
tree.strLoadingHtml = '<span class="loading" style="float:left;">正在加载数据，请稍候...</span>';
tree.devOnly2G = ['50780'];
tree.isOpen = false;

tree.config = {};

tree.checkIsOnly2G = function(typeCode){
    for(var i=0,c=tree.devOnly2G.length; i<c; i++){
        if(tree.devOnly2G[i].equals(typeCode)){
            return true;
        }
    }
    return false;
};

tree.buildTreeForm = function(leftMenu, treeType, title, func, callBack, folderLinks, boxW, chbValue, tools){
    var strHtml = '';
    boxW = boxW || 200;
    var showOnlineCheck = false;
    switch(treeType){
        case 'device':
        case 'camera':
            showOnlineCheck = true;
            break;
    }
    if(chbValue == undefined){
        chbValue = '2';
    }
        
    var chbTitle = chbValue == '2' ? '显示2G在线设备' : '显示3G在线设备';
    var strCheckBox = '';
    if(showOnlineCheck){
        strCheckBox = '<input id="chbTreeDeviceOnline" value="' + chbValue + '" type="checkbox" title="' + chbTitle 
            //+ '" onclick="' + func + '($(\'#txtTreeMenuKeywords\').val() !== \'\',\'' + treeType + '\',\'' + callBack + '\',' + folderLinks + ');" />';
            + '" onclick="tree.searchTreeMenu();" />';
    } else {
        strCheckBox = '<input id="chbOpenAll" type="checkbox" onclick="tree.openAll();" />';
    }
    strHtml = '<div class="titlebar">'
        + '<span class="title">' + title + '</span>'
        + (tools !== undefined && tools !== null ? '<div class="tools">' + tools + '</div>' : '')
        + '</div>';
    strHtml += '<div class="operbar">'
        + '<div class="btn btnsearch-chb">' + strCheckBox + '</div>'
        + '<input id="' + tree.txtTreeMenuKeywords + '" type="\r\nShift" class="txt" maxlength="25" style="width:' + (boxW - 88) + 'px;" />'
        + '<a class="btn btnsearch-menu" onclick="' + func + '(true,\'' + treeType + '\',\'' + callBack + '\',' + folderLinks + ');"></a>'
        + '<a class="btn btnsearch-cancel" onclick="' + func + '(false,\'' + treeType + '\',\'' + callBack + '\',' + folderLinks + ');"></a>'
        + '</div>';
    strHtml += '<div id="treebox" class="treebox">'
        + '<div id="tree" class="tree">' + tree.strLoadingHtml + '</div>'
        + '<input id="' + tree.txtTreeRefurbish + '" type="hidden" style="width:170px;" />'
        + '<input id="' + tree.txtTreeData + '" type="hidden" style="width:170px;" />'
        + '<input id="' + tree.txtTreeDevHash + '" type="hidden" style="width:170px;" />'
        + '<input id="' + tree.txtTreeHtmlCode + '" type="hidden" style="width:170px;" />'
        + '</div>';
        
    $('#leftMenu').html(strHtml);
    
    tree.config = {
        treeType: treeType,
        callBack: callBack,
        folderLinks: folderLinks,
        isAsync: true
    };
    window.setTimeout(cms.util.setKeyEnter, 500, [cms.util.$(tree.txtTreeMenuKeywords)], 'tree.searchTreeMenu');
    
    $('#leftMenu a').focus(function(){
        this.blur();
    });
};

tree.searchTreeMenu = function(){
    var isSearch = $('#txtTreeMenuKeywords').val() !== '';
    tree.showTreeMenu(isSearch, tree.config.treeType, tree.config.callBack, tree.config.folderLinks, tree.config.isAsync, tree.config.showGroup, tree.config.showCheckBox, tree.config.dblclick);
};

tree.showTreeMenu = function(isSearch, treeType, callBack, folderLinks, isAsync, showGroup, showCheckBox, dblclick){
    isSearch = isSearch || false;
    treeType = treeType || 'device';
    folderLinks = folderLinks || false;
    showGroup = showGroup || false;
    showCheckBox = showCheckBox || false;
    dblclick = dblclick || false;
    
    tree.config.showGroup = showGroup;
    tree.config.showCheckBox = showCheckBox;
    tree.config.dblclick = dblclick;
    
    //是否异步加载，默认为异步加载true
    if(isAsync == undefined){
        isAsync = true;
    }
    var obj = '#tree';
    var online = false;//$('#chbTreeDeviceOnline').attr('checked');
    var chbValue = '';// $('#chbTreeDeviceOnline').val();
    
    var status3G = online && chbValue == '3' ? 1 : -1;
    var status2G = online && chbValue == '2' ? 1 : -1;
    var keys = $('#' + tree.txtTreeMenuKeywords).val();
    if(isSearch){
        if(keys == '') return false;
    } else {
        keys = '';
        $('#' + tree.txtTreeMenuKeywords).attr('value', keys);
    }
    
    if(!isAsync){
        $('#tree').html(tree.strLoadingHtml);
    }
    return tree.buildTree(obj,{
        isSearch: isSearch,
        treeType: treeType,
        callBack: callBack,
        keys: keys,
        statusType: chbValue,
        status2G: status2G,
        status3G: status3G,
        openAll: false,
        folderLinks: folderLinks,
        isAsync: isAsync,
        showGroup: showGroup,
        showCheckBox: showCheckBox,
        dblclick: dblclick
    });
};

tree.buildTree = function(obj, config){
    var rootUnitId = 0;
    var nid = 0;
    var pid = -1;
    
    var htTree = new cms.util.Hashtable();
    var htParent = new cms.util.Hashtable();
    var htOnline = new cms.util.Hashtable();
    var imgPath = cms.util.path + '/skin/default/images/common/tree/';
    
	d = new dTree('d', 
	    {skin: cms.util.path + '/common/js/dtree/img1',showCheckBox:config.showCheckBox,dblclick:config.dblclick,folderLinks:config.folderLinks},
	    {node: imgPath + 'device.gif'}
	);
	nid++;
	pid++;
	
	var urlparam = 'action=getDepartmentPerson';
	//alert(urlparam);
	
	$.ajax({ 
        type: "post", 
        async: config.isAsync, //默认为异步加载 true
        datatype: "json",
        url: cms.util.path + '/ajax/person.aspx',
        data: urlparam, 
        error: function(data){
            //alert(data);
        },
        success: function(data){
            //$('#txtTreeData').attr('value', data);
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
            } else {
                var jsondata = eval('(' + data + ')');
                
                var department = jsondata.department;
                var person = jsondata.person;
                
	            d.add(0,-1,'设备目录树',null);
	            
                for(var i=0,c=department.length; i<c; i++){
                    htTree.add('dept' + department[i].id, nid);
                    pid = nid == 1 ? 0 : htTree.items('dept' + department[i].pid);
                    var url = config.callBack + '({nid:\'' + nid + '\',type:\'unit\',unitId:\'' + department[i].id + '\',unitCode:\'' + department[i].code + '\',unitName:' + (tree.isFirefox ? 'this.textContent' : 'this.innerText') + '});';
                    
                    d.add(nid,pid,department[i].name,null,url,'','',imgPath + 'unit.gif',imgPath + 'unit.gif',true,false);
                    nid++;
                }

                if(config.treeType == 'person'){
                    for(var j=0,cc=person.length; j<cc; j++){
                        var p = person[j];
                        
                        htTree.add('person' + p.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('dept' + p.pid);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'device\',devCode:\'' + p.code + '\',devName:\'' + p.name + '\',unitId:\'' + p.pid + '\',unitName:\'' + p.pname + '\'});';
                        var title = '';//'编号：' + dev.code + '&#10;' + '名称：' + dev.name;// + '&#10;' + '状态：' + (dev.s=='1'?'3G在线':'3G离线') + '&nbsp;&nbsp;' + (dev.s2=='1'?'2G在线':'2G离线');
                        var icon = imgPath + 'user.gif';
                        var contextmenu = config.showGroup ? 'tree.devContextMenu(event, this, {id:' + dev.id + ',code:\'' + dev.code + '\',name:\'' + dev.name + '\'});' : null;
                        
                        d.add(nid,pid,p.name,null,url,title,'',icon,icon,true, contextmenu, false);
                        
                        nid++;
                    }
                    
                }
                
	            $(obj).html(''+d);

	            //隐藏第一个节点 root
	            $("#id0").parent("div").hide();

                //$('#' + tree.txtTreeHtmlCode).attr('value', ''+d);

                $('#treebox a').focus(function(){
                    this.blur();
                });
                
	            try{
	                //将第一个节点选中
	                d.s(1);
	            }catch(e){}
            }
        }
    });
    return rootUnitId;
};

tree.openAll = function(){
    if(tree.isOpen){
        d.closeAll();
        d.openTo(1);
        tree.isOpen = false;
    } else {
        d.openAll();
        tree.isOpen = true;
    }
};