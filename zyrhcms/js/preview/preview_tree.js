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
    
    strHtml = '<div class="titlebar">'
        + '<span class="title">' + title + '</span>'
        + (tools != undefined && tools != null ? '<div class="tools">' + tools + '</div>' : '')
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
    
    $('#leftMenu a').focus(function(){
        this.blur();
    });
}

tree.searchTreeMenu = function(){
    tree.showTreeMenu(true, tree.config.treeType, tree.config.callBack, tree.config.folderLinks, tree.config.isAsync);
}

tree.showTreeMenu = function(isSearch, treeType, callBack, folderLinks, isAsync, showGroup, showCheckBox, dblclick){
    isSearch = isSearch || false;
    treeType = treeType || 'device';
    folderLinks = folderLinks || false;
    showGroup = showGroup || false;
    showCheckBox = showCheckBox || false;
    dblclick = dblclick || false;
    
    //是否异步加载，默认为异步加载true
    if(isAsync == undefined){
        isAsync = true;
    }
    var obj = '#tree';
    var online = $('#chbTreeDeviceOnline').attr('checked');
    var chbValue = $('#chbTreeDeviceOnline').val();
    
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
    var strDevCode = $('#txtDevCode').val().trim();
    if(strDevCode != ''){
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
            dblclick: dblclick,
            devCode: strDevCode
        });
    }
}

tree.buildTree = function(obj, config){
    var rootUnitId = 0;
    var nid = 0;
    var pid = -1;
    
    var htTree = new cms.util.Hashtable();
    var htParent = new cms.util.Hashtable();
    var htOnline = new cms.util.Hashtable();
    var imgPath = cmsPath + '/skin/default/images/common/tree/';
    
	d = new dTree('d', 
	    {skin: cmsPath + '/common/js/dtree/img1',showCheckBox:config.showCheckBox,dblclick:config.dblclick,folderLinks:config.folderLinks},
	    {node: imgPath + 'device.gif'}
	);
	nid++;
	pid++;
	
	var urlparam = 'action=getDevTree&treeType=' + config.treeType + '&devCode=' + escape(config.devCode) + '&' + new Date().getTime();
	
	$.ajax({ 
        type: "post", 
        async: config.isAsync, //默认为异步加载 true
        datatype: "json",
        url: cms.util.path + '/ajax/tree.aspx',
        data: urlparam, 
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            $('#txtTreeData').attr('value', data);
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = data.toJson();//eval('(' + data + ')');
            rootUnitId = jsondata.uid;
            var unit = jsondata.unit;
            var region = jsondata.region;
            var device = jsondata.device;
            var camera = jsondata.camera;
            var group = jsondata.group;
            
            d.add(0,-1,'设备目录树',null);
            
            if(config.treeType == 'device' || config.treeType == 'camera'){
                var strDevHash = '{devlist:[';
                for(var j=0,cc=device.length; j<cc; j++){
                    var dev = device[j];
                    htTree.add('dev' + dev.id, nid);
                    //pid = nid == 1 ? 0 : htTree.items('unit' + dev.uid);
                    //父级节点为根节点，这里不加载组织机构节点
                    pid = 0;
                    var url = config.callBack + '({nid:\'' + nid + '\',type:\'device\',devCode:\'' + dev.code + '\',devName:\'' + dev.name + '\',unitId:\'' + dev.uid + '\',unitName:\'' + dev.uname + '\'});';
                    var title = '';//'编号：' + dev.code + '&#10;' + '名称：' + dev.name;// + '&#10;' + '状态：' + (dev.s=='1'?'3G在线':'3G离线') + '&nbsp;&nbsp;' + (dev.s2=='1'?'2G在线':'2G离线');
                    var icon = '';
                    
                    if(config.statusType == '2' || tree.checkIsOnly2G(dev.type)){
                        icon = imgPath + (dev.s2 == '1' ? 'device.gif' : 'device-stop.gif');
                        htOnline.add('dev' + dev.id, dev.s2);
                    } else {
                        icon = imgPath + (dev.s3 == '1' ? 'device.gif' : 'device-stop.gif');
                        htOnline.add('dev' + dev.id, dev.s3);
                    }
                    var contextmenu = config.showGroup ? 'tree.devContextMenu(event, this, {id:' + dev.id + ',code:\'' + dev.code + '\',name:\'' + dev.name + '\'});' : null;
                    
                    d.add(nid,pid,dev.name,null,url,title,'',icon,icon,true, contextmenu, false);
                    
                    strDevHash += (j > 0 ? ',' : '') + '{id:' + dev.id + ',dc:\'' + dev.code + '\',tid:' + nid + '}';
                    
                    nid++;
                }
                if(config.treeType == 'camera'){
                    strDevHash += '],count:' + device.length + ',cameralist:[';
                    for(var i=0,c=camera.length; i<c; i++){
                        var ci = camera[i];
                        htTree.add('camera' + ci.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('dev' + ci.did);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'camera\',devId:\'' + ci.did + '\',devCode:\'' + ci.dcode + '\',devName:\'' + ci.dname + '\',unitId:\'' + ci.uid + '\',cameraId:\'' + ci.id + '\',channelNo:\'' + ci.channel + '\',cameraName:\'' + ci.name + '\'});';
                        var icon = imgPath + (htOnline.items('dev' + ci.did) == '1' ? 'camera-online.gif' : 'camera-offline.gif');
                        //单个视频预览时，设备通道 不需要添加我的分组
                        var contextmenu = null;//config.showGroup ? 'tree.cameraContextMenu(event, this, {id:' + ci.id + ',channel:' + ci.channel + ',code:\'' + ci.dcode + '\',name:\'' + ci.dname + '\'});' : null;
                        
                        d.add(nid,pid,ci.name,null,url,title,'',icon,icon,true, contextmenu, false);
                        
                        strDevHash += (i > 0 ? ',' : '') + '{id:' + ci.id + ',pid:\'' + ci.did + '\',tid:' + nid + '}';
                        nid++;
                    }
                    strDevHash += ']}';  
                } else {
                    strDevHash += '],count:' + device.length + '}';
                }
                
                $('#' + tree.txtTreeDevHash).attr('value', strDevHash);
            }
            

            $(obj).html(''+d);

            //隐藏第一个节点 root
            $("#id0").parent("div").hide();

            $('#treebox a').focus(function(){
                this.blur();
            });

            d.openAll();
            
            //将第一个节点选中
            d.s(2);
        }
    });
    return rootUnitId;
}

tree.selectNode = function(num){
    d.s(num);
};

tree.fillTree = function(jsonData){

}

tree.openAll = function(){
    if(tree.isOpen){
        d.closeAll();
        d.openTo(1);
        tree.isOpen = false;
    } else {
        d.openAll();
        tree.isOpen = true;
    }
}

//更新节点显示文字
tree.updateNodeText = function(nid, str){
    $('#sd' + nid + ' span').html(str);
};

tree.timer = null;
tree.updateDevStatus = function(timeout){
    timeout = timeout || 30*1000;
    var strDevHash = $('#' + tree.txtTreeDevHash).val();
    if(strDevHash.isJsonData()){
        var htDev = new cms.util.Hashtable();
        var htCamera = new cms.util.Hashtable();
        var strDevList = [];
        var strCameraList = [];
        var jsondev = eval('(' + strDevHash + ')');
        for(var i=0,c=jsondev.devlist.length; i<c; i++){
            var dev = jsondev.devlist[i];
            if(!htDev.contains('tree_dev_' + dev.id)){
                htDev.add('tree_dev_' + dev.id,dev.tid);
            }
            strDevList.push(dev.id);
        }
        if(jsondev.cameralist != undefined){
            for(var i=0,c=jsondev.cameralist.length; i<c; i++){
                var ci = jsondev.cameralist[i];
                if(!htCamera.contains('tree_camera_' + ci.pid)){
                    htCamera.add('tree_camera_' + ci.pid, ci.tid);
                } else {
                    var strIds = htCamera.items('tree_camera_' + ci.pid);
                    strIds += ',' + ci.tid;
                    htCamera.remove('tree_camera_' + ci.pid);
                    htCamera.add('tree_camera_' + ci.pid, strIds);
                }
                strCameraList.push(ci.id);
            }
        }
        var urlparam = 'action=getDevStatus&devList=' + strDevList.join(',');
        $.ajax({ 
            type: "post", 
            //async:false,
            datatype: "json",
            url: cms.util.path + '/ajax/tree.aspx',
            data: urlparam, 
            error: function(jqXHR, textStatus, errorThrown){
                module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR){
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                }
                var devStatus = eval('(' + data + ')');
                if(devStatus.result == 1){
                    for(var j=0,cc=devStatus.list.length; j<cc; j++){
                        var ds = devStatus.list[j];
                        var isOnline = tree.checkIsOnly2G(ds.type) ? ds.s2 == 1 : ds.s3 == 1;
                        //更新设备状态
                        var icon = cmsPath + '/skin/default/images/common/tree/' + (isOnline ? 'device.gif' : 'device-stop.gif');
                        $('#id' + htDev.items('tree_dev_' + ds.id)).attr('src', icon);
                        //var title = '编号：' + ds.code + '\r\n' + '名称：' + ds.name;// + '\r\n' + '状态：' + (isOnline ?'3G在线':'3G离线') + '  ' + (devStatus.list[j].s2=='1'?'2G在线':'2G离线');
                        //tree.$('sd' + htDev.items('tree_dev_' + ds.code)).title = title;
                        
                        //更新监控点状态
                        var strCamera = htCamera.items('tree_camera_' + ds.id);
                        if(strCamera != '' && (''+strCamera).indexOf(',') < 0){
                            icon = cmsPath + '/skin/default/images/common/tree/' + (isOnline ? 'camera-online.gif' : 'camera-offline.gif');
                            $('#id' + strCamera).attr('src', icon);
                        } else {
                            var arrCamera = strCamera.split(',');
                            for(var n=0,c=arrCamera.length; n<c; n++){
                                icon = cmsPath + '/skin/default/images/common/tree/' + (isOnline ? 'camera-online.gif' : 'camera-offline.gif');
                                $('#id' + arrCamera[n]).attr('src', icon);
                            }
                        }
                        delete ds;
                    }
                    $('#' + tree.txtTreeRefurbish).attr('value', '最后刷新：' + new Date().toString());
                    
                    //定时自动刷新设备状态
                    tree.timer = window.setTimeout(tree.updateDevStatus, timeout, timeout);
                }
            }
        });
    }
};

var isAudio = false;
var devAudio = {devCode:''};

/*以下为设备右键菜单*/
tree.devContextMenu = function(e, obj, dev){
    var item = [];
	var idx = 0;
	var strAudio = devAudio.devCode.equals(dev.code) ? '关闭语音对讲' : '开始语音对讲';
	isAudio = devAudio.devCode.equals(dev.code);
	/*
	item[idx++] = {
		text:'设备详情', func:function(){
			tree.showDevDetail(dev.id, dev.code);
		}
	};
	*/
	item[idx++] = {
		text: strAudio, func:function(){
		    //语音对讲
                    
	        var urlparam = 'action=getDevPreviewParam&devCode=' + dev.code;
            $.ajax({
                type: 'post',
                //async: false, //同步交互
                datatype: 'json',
                url: cms.util.path + '/ajax/device.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var jsondata = data.toJson();//eval('(' + data + ')');
                    if(jsondata.result == 1){
                        var di = jsondata.dev;
                        if(di.serverIp.equals('')){
                            var strHtml = '设备没有配置服务器信息，请到后台管理先配置设备服务器信息' + cms.box.buildIframe(600,300,true);
                            cms.box.alert({id: 'pwerror', title: '错误信息', html: strHtml});
                            return false;
                        } else {
                            if(isAudio){
                                devAudio.devCode = '';
                                cms.preview.stopAudioChat(di.serverIp, di.serverPort);
                            } else {
                                //保存
                                devAudio.devCode = dev.code;
                                cms.preview.startAudioChat(loginUser.userName, loginUser.userPwd, di.serverIp, di.serverPort, devAudio.devCode);
                            }
                        }
                    }
                }
            });
		}
	};
	var config = {
		width: 80,
		zindex: 1000,
		opacity: 1,
		item: item,
		coverOcx: cms.util.$('pwAboveOcx') != null
	};
	var cmenu = new ContextMenu(e, config, obj);
};