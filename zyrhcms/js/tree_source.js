var tree = tree || {};

tree.$ = function(i){ return document.getElementById(i); }
tree.isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;
tree.txtTreeData = 'txtTreeData';
tree.txtTreeDevHash = 'txtTreeDevHash';
tree.txtTreeMenuKeywords = 'txtTreeMenuKeywords';
tree.txtTreeRefurbish = 'txtTreeRefurbish';
tree.txtTreeHtmlCode = 'txtTreeHtmlCode';
tree.strLoadingHtml = '<span class="loading" style="float:left;">正在加载数据，请稍候...</span>';
tree.isOpen = false;

tree.config = {};

tree.checkIs3G = function(networkMode, typeCode){
    return networkMode.indexOf('3') >= 0 || networkMode.indexOf('4') >= 0;
};

tree.checkIs2G = function(networkMode, typeCode){
    return networkMode.indexOf('2') >= 0;
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
        strCheckBox = '<input id="chbTreeDeviceOnline" value="' + chbValue + '" type="checkbox" title="' + chbTitle + '" onclick="tree.searchTreeMenu();" />';
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
        + '<a class="btn btnsearch-menu" onclick="tree.searchTreeMenu();"></a>'
        + '<a class="btn btnsearch-cancel" onclick="tree.searchTreeMenu(true);"></a>'
        + '</div>';
    strHtml += '<div id="treebox" class="treebox">'
        + '<div id="tree" class="tree">' + tree.strLoadingHtml + '</div>'
        + '<input id="' + tree.txtTreeRefurbish + '" type="hidden" />'
        + '<input id="' + tree.txtTreeData + '" type="hidden" />'
        + '<input id="' + tree.txtTreeDevHash + '" type="hidden" />'
        + '<input id="' + tree.txtTreeHtmlCode + '" type="hidden" />'
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

tree.searchTreeMenu = function(isClear){
    if(isClear){
        $('#txtTreeMenuKeywords').attr('value', '');
    }
    var isSearch = $('#txtTreeMenuKeywords').val() !== '';
    tree.showTreeMenu(isSearch, tree.config.treeType, tree.config.callBack, tree.config.folderLinks, tree.config.isAsync, tree.config.showGroup,
        tree.config.showCheckBox, tree.config.dblclick, tree.config.networkMode, tree.config.checkbox);
};

tree.showTreeMenu = function(isSearch, treeType, callBack, folderLinks, isAsync, showGroup, showCheckBox, dblclick, networkMode, checkbox){
    isSearch = isSearch || false;
    treeType = treeType || 'device';
    folderLinks = folderLinks || false;
    showGroup = showGroup || false;
    showCheckBox = showCheckBox || false;
    checkbox = checkbox || null;
    dblclick = dblclick || false;
    
    tree.config.showGroup = showGroup;
    tree.config.showCheckBox = showCheckBox;
    tree.config.dblclick = dblclick;
    tree.config.networkMode = networkMode;
    tree.config.checkbox = checkbox;
    
    //是否异步加载，默认为异步加载true
    if(isAsync == undefined){
        isAsync = true;
    }
    var obj = '#tree';
    var online = $('#chbTreeDeviceOnline').attr('checked');
    var chbValue = $('#chbTreeDeviceOnline').val();
    
    var status3G = online && (chbValue == '3' || chbValue == '') ? 1 : -1;
    var status2G = online && (chbValue == '2' || chbValue == '') ? 1 : -1;
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
        checkbox: checkbox,
        dblclick: dblclick,
        networkMode: networkMode || ''
    });
};

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
	
	var urlparam = 'action=getTree&controlUnitId=0&treeType=' + config.treeType + '&keywords=' + escape(config.keys)
	    + '&statusType=' + config.statusType
	    + '&status2G=' + config.status2G + '&status3G=' + config.status3G + '&showGroup=' + (config.showGroup ? 1 : 0) 
	    + '&networkMode=' + config.networkMode
	    + '&' + new Date().getTime();
	//alert(urlparam);
	
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
            
            for(var i=0,c=unit.length; i<c; i++){
                htTree.add('unit' + unit[i].id, nid);
                pid = nid == 1 ? 0 : htTree.items('unit' + unit[i].pid);
                var url = config.callBack + '({nid:\'' + nid + '\',type:\'unit\',unitId:\'' + unit[i].id + '\',unitCode:\'' + unit[i].code + '\',unitName:' + (tree.isFirefox ? 'this.textContent' : 'this.innerText') + '});';
                var checkbox = {
                    name: 'chbTreeUnit',
                    css: 'chbTreeUnit',
                    value: '{type:\'unit\', uid:' + unit[i].id + '}',
                    callback: config.checkbox != null ? config.checkbox.callback : null
                };
                d.add(nid,pid,unit[i].name,checkbox,url,'','',imgPath + 'unit.gif',imgPath + 'unit.gif',true);
                nid++;
            }

            if(config.treeType == 'device' || config.treeType == 'camera'){
                var strDevHash = '{devlist:[';
                for(var j=0,cc=device.length; j<cc; j++){
                    var dev = device[j];
                    
                    htTree.add('dev' + dev.id, nid);
                    pid = nid == 1 ? 0 : htTree.items('unit' + dev.uid);
                    var url = config.callBack + '({nid:\'' + nid + '\',type:\'device\',devCode:\'' + dev.code + '\',devName:\'' + dev.name + '\',unitId:\'' + dev.uid + '\',unitName:\'' + dev.uname + '\'});';
                    var title = '';//'编号：' + dev.code + '&#10;' + '名称：' + dev.name;// + '&#10;' + '状态：' + (dev.s=='1'?'3G在线':'3G离线') + '&nbsp;&nbsp;' + (dev.s2=='1'?'2G在线':'2G离线');
                    var icon = '';
                    
                    /*
                    if(config.statusType == '2' || (tree.checkIs2G(dev.nmode, dev.type) && !tree.checkIs3G(dev.nmode, dev.type))){
                        icon = imgPath + (dev.s2 == '1' ? 'device.gif' : 'device-stop.gif');
                        htOnline.add('dev' + dev.id, dev.s2);
                    } else {
                        icon = imgPath + (dev.s3 == '1' ? 'device.gif' : 'device-stop.gif');
                        htOnline.add('dev' + dev.id, dev.s3);
                    }
                    */
                    //2G、3G同时有的设备，以3G状态为主
                    var isOnline = tree.checkIs2G(dev.nmode, dev.type) && !tree.checkIs3G(dev.nmode, dev.type) ? dev.s2 == 1 : dev.s3 == 1;
                    htOnline.add('dev' + dev.id, isOnline ? '1' : '0');
                    //更新设备状态
                    var icon = cmsPath + '/skin/default/images/common/tree/' + (isOnline ? 'device.gif' : 'device-stop.gif');
                    
                    var contextmenu = config.showGroup ? 'tree.devContextMenu(event, this, {id:' + dev.id + ',code:\'' + dev.code + '\',name:\'' + dev.name + '\',type:\'' + dev.type + '\',nmode:\'' + dev.nmode + '\',audioType:\'' + dev.audioType + '\'});' : null;
                    var checkbox = {
                        name: 'chbTreeDevice',
                        css: 'chbTreeDevice',
                        value: '{id:' + dev.id + ',code:\'' + dev.code + '\',name:\'' + dev.name + '\',type:\'' + dev.type + '\',nmode:\'' + dev.nmode + '\'}',
                        callback: config.checkbox != null ? config.checkbox.callback : null
                    };
                    d.add(nid,pid,dev.name,checkbox,url,title,'',icon,icon,true, contextmenu, false);
                    
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
                        var contextmenu = config.showGroup ? 'tree.cameraContextMenu(event, this, {id:' + ci.id + ',channel:' + ci.channel + ',code:\'' + ci.dcode + '\',name:\'' + ci.dname + '\'});' : null;
                        var checkbox = {
                            name: 'chbTreeCamera',
                            css: 'chbTreeCamera',
                            value: '{id:' + ci.id + ',channel:' + ci.channel + ',code:\'' + ci.dcode + '\',name:\'' + ci.dname + '\'}',
                            callback: config.checkbox != null ? config.checkbox.callback : null
                        };
                        d.add(nid,pid,ci.name,checkbox,url,title,'',icon,icon,true, contextmenu, false);
                        
                        strDevHash += (i > 0 ? ',' : '') + '{id:' + ci.id + ',pid:\'' + ci.did + '\',tid:' + nid + '}';
                        nid++;
                    }
                    strDevHash += ']}';  
                } else {
                    strDevHash += '],count:' + device.length + '}';
                }
                
                $('#' + tree.txtTreeDevHash).attr('value', strDevHash);
            }
            
            if(config.showGroup){
                var glist = group.group;
                for(var i=0,c=glist.length; i<c; i++){
                    htTree.add('group' + glist[i].id, nid);
                    pid = glist[i].pid == '-1' ? 0 : htTree.items('group' + glist[i].pid);
                    var url = '';
                    var contextmenu = (pid == 0 ? 'tree.addGroup' : 'tree.groupAction') +  ('(event, this, {id:' + glist[i].id + ',name:\'' + glist[i].name + '\'});');
                    d.add(nid,pid,glist[i].name,null,url,'','',imgPath + 'folder.gif',imgPath + 'folderopen.gif',false,contextmenu,false);
                    nid++;
                }
                var gcamera = group.camera;
            }

            $(obj).html(''+d);

            //隐藏第一个节点 root
            $("#id0").parent("div").hide();

            //$('#' + tree.txtTreeHtmlCode).attr('value', ''+d);

            $('#treebox a').focus(function(){
                this.blur();
            });

            if(config.isSearch || config.status2G == 1 || config.status3G == 1 || config.openAll || $('#chbOpenAll').attr('checked') == 'checked'){
                d.openAll();
                tree.isOpen = true;
            }
            else if(!config.auto){
                d.closeAll();
	            d.openTo(1);
            }
	        else{
                d.closeAll();
                d.o(rootUnitId);
            }
            try{
                //将第一个节点选中
                d.s(1);
            }catch(e){}
        }
    });
    return rootUnitId;
};

tree.fillTree = function(jsonData){

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
        if(jsondev.cameralist !== undefined){
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
                        var isOnline = tree.checkIs2G(ds.nmode, ds.type) && !tree.checkIs3G(ds.nmode, ds.type) ? ds.s2 == 1 : ds.s3 == 1;
                        //更新设备状态
                        var icon = cmsPath + '/skin/default/images/common/tree/' + (isOnline ? 'device.gif' : 'device-stop.gif');
                        $('#id' + htDev.items('tree_dev_' + ds.id)).attr('src', icon);
                        //var title = '编号：' + ds.code + '\r\n' + '名称：' + ds.name;// + '\r\n' + '状态：' + (isOnline ?'3G在线':'3G离线') + '  ' + (devStatus.list[j].s2=='1'?'2G在线':'2G离线');
                        //tree.$('sd' + htDev.items('tree_dev_' + ds.code)).title = title;
                        
                        //更新监控点状态
                        var strCamera = htCamera.items('tree_camera_' + ds.id);
                        if(strCamera !== '' && (''+strCamera).indexOf(',') < 0){
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
	item[idx++] = {
		text:'设备详情', func:function(){
			module.showDevDetail(dev.code, dev.name, {lock: true});
		}
	};
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
                        if(di.cagServerIp.equals('')){
                            var strHtml = '设备没有配置服务器信息，请到后台管理先配置设备服务器信息' + cms.box.buildIframe(600,300,true);
                            cms.box.alert({id: 'pwerror', title: '错误信息', html: strHtml});
                            return false;
                        } else {
                            if(isAudio){
                                devAudio.devCode = '';
                                cms.preview.stopAudioChat(di.cagServerIp, di.cagServerPort);
                            } else {
                                //保存
                                devAudio.devCode = dev.code;
                                cms.preview.startAudioChat(loginUser.userName, loginUser.userPwd, di.cagServerIp, di.cagServerPort, devAudio.devCode, di.audioType);
                            }
                        }
                    }
                }
            });
		}
	};
	item[idx++] = {
		text: 'separator'
	};
	item[idx++] = {
		text:'录像回放', func:function(){
			module.showPlayBack(dev.code, dev.name, {lock: true});
		}
	};
	item[idx++] = {
		text:'远程配置', func:function(){
			module.showRemoteConfig(dev.code, dev.name, {lock: true});
		}
	};
	item[idx++] = {
		text: 'separator'
	};
	item[idx++] = {
		text:'轨迹回放', func:function(){
			module.showGpsTrack(dev.code, dev.name, {lock: true});
		}
	};
	if(tree.checkIs2G(dev.nmode, dev.type)){
	    item[idx++] = {
		    text:'2G配置', func:function(){
			    module.showGprsConfig(dev.code, dev.name, {lock: true});
		    }
	    };
	}
	var config = {
		width: 80,
		zindex: 1000,
		opacity: 1,
		item: item,
		coverOcx: cms.util.$('pwAboveOcx') !== null
	};
	var cmenu = new ContextMenu(e, config, obj);
};

/*以下为通道右键菜单*/
tree.cameraContextMenu = function(e, obj, camera){
    var item = [];
	var idx = 0;
	item[idx++] = {
		text:'添加到我的分组', func:function(){
			alert('未完成');
		}
	};
	item[idx++] = {
		text:'设置预置点', func:function(){
			module.showDevPreset(camera.code, camera.name, camera.id, {lock: true});
		}
	};
	var config = {
		width: 80,
		zindex: 1000,
		opacity: 1,
		item: item,
		coverOcx: cms.util.$('pwAboveOcx') !== null
	};
	var cmenu = new ContextMenu(e, config, obj);
};