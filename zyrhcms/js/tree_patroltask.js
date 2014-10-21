var pwtree = pwtree || {};
pwtree.$ = function(i){ return document.getElementById(i); }
pwtree.isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;

pwtree.buildTree = function(obj, config){
    var rootUnitId = config.unitId || 0;
    var nid = 0;
    var pid = -1;
    var strTree = '';
    var htTree = new cms.util.Hashtable();
    var htParent = new cms.util.Hashtable();
    var cmsPath = cms.util.path;
    var imgPath = cmsPath + '/skin/default/images/common/tree/';
	var urlparam = 'action=getTree&controlUnitId=' + rootUnitId + '&treeType=' + config.treeType + '&' + new Date().getTime();
	
	$.ajax({ 
        type: "post", 
        async: config.isAsync, //默认为异步加载 true
        datatype: "json",
        url: cms.util.path + '/ajax/treePatrolTask.aspx',
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
            var group = jsondata.group;

            d = new dTree('d', 
                {skin: cmsPath + '/common/js/dtree/img1',showCheckBox:config.showCheckBox,dblclick:config.dblclick,folderLinks:config.folderLinks},
                {node: imgPath + 'device.gif'}
            );
            nid++;
            pid++;
        	
            d.add(0,-1,'设备目录树',null);
            
            for(var i=0,c=unit.length; i<c; i++){
                htTree.add('unit' + unit[i].id, nid);
                pid = nid == 1 ? 0 : htTree.items('unit' + unit[i].pid);
                //var url = config.callBack + '({nid:\'' + nid + '\',type:\'unit\',unitId:\'' + unit[i].uid + '\',unitName:\'' + unit[i].name + '\'});';
                var url = config.callBack + '({nid:\'' + nid + '\',type:\'unit\',unitId:\'' + unit[i].id + '\',unitName:' + (pwtree.isFirefox ? 'this.textContent' : 'this.innerText') + '});';
                
                d.add(nid,pid,unit[i].name,null,url,'','',imgPath + 'unit.gif',imgPath + 'unit.gif',true);
                nid++;
            }
            
            if(config.treeType == 'device' || config.treeType == 'camera'){
                var device = jsondata.device;
                var camera = jsondata.camera;
                var cc = device.length;
                if(cc == 0){
                    strTree = '该组织机构暂无设备信息';
                } else {
                    for(var j=0; j<cc; j++){
                        var dev = device[j];
                        htTree.add('device' + dev.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('unit' + dev.uid);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'device\',devCode:\'' + dev.code + '\',devName:\'' + dev.name + '\',unitId:\'' + dev.uid + '\',unitName:\'' + dev.uname + '\'});';
                        var title = '编号：' + dev.code + '&#10;' + '名称：' + dev.name;// + '&#10;' + '状态：' + (dev.s=='1'?'3G在线':'3G离线') + '&nbsp;&nbsp;' + (dev.s2=='1'?'2G在线':'2G离线');
                        var icon = '';                            
                        icon = imgPath + (dev.s2 == '1' ? 'device.gif' : 'device-stop.gif');
                        var contextmenu = null;//config.showGroup ? 'tree.devDetail(event, this, {id:' + dev.id + ',code:\'' + dev.code + '\'});' : null;
                        
                        d.add(nid,pid,dev.name,null,url,title,'',icon,icon,true, contextmenu, false);
                        
                        nid++;
                    }
                }
            }
            if(config.treeType == 'point'){
                var line = jsondata.line;
                var point = jsondata.point;
                var cc = line.length;
                if(cc == 0){
                    strTree = '该组织机构暂无线路、巡检点信息';
                } else {
                    for(var j=0; j<cc; j++){
                        var li = line[j];
                        htTree.add('line' + li.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('unit' + li.uid);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'line\',lineId:\'' + li.id + '\',lineName:\'' + li.name + '\',unitId:\'' + li.uid + '\',unitName:\'' + li.uname + '\'});';
                        var icon = imgPath + 'line.gif';
                        var checkbox = null;
                        if(config.checkbox !== undefined){
                            checkbox = {};
                            checkbox.callback = config.checkbox.callback;
                        }
                        d.add(nid,pid,li.name,checkbox,url,title,'',icon,icon,true, null, false);
                        
                        nid++;
                    }
                    for(var k=0,cc=point.length; k<cc; k++){
                        var pt = point[k];
                        htTree.add('point' + pt.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('line' + pt.lid);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'point\',pointId:\'' + pt.id + '\',pointName:\'' + pt.name 
                            + '\',latitude:\'' + pt.lat + '\',longitude:\'' + pt.lng + '\',radii:\'' + pt.radii + '\',unitId:\'' + pt.uid 
                            + '\',unitName:\'' + pt.uname + '\'});';
                        var icon = imgPath + 'point.gif';
                        var checkbox = null;
                        if(config.checkbox !== undefined){
                            checkbox = {};
                            checkbox.css = config.checkbox.css;
                            checkbox.name = config.checkbox.name;
                            checkbox.callback = config.checkbox.callback;
                            checkbox.value = '{id:\'' + pt.id + '\',name:\'' + pt.name + '\',lat:\'' + pt.lat + '\',lng:\'' + pt.lng + '\',radii:\'' + pt.radii + '\'}';
                        }
                        d.add(nid,pid,pt.name,checkbox,url,title,'',icon,icon,true, null, false);
                        
                        nid++;
                    }
                }
            }
            if(config.treeType == 'user'){
                var user = jsondata.user;
                for(var i=0,c=user.length; i<c; i++){
                    var ui = user[i];
                    htTree.add('user' + user[i].id, nid);
                    pid = nid == 1 ? 0 : htTree.items('unit' + ui.uid);
                    var url = config.callBack + '({nid:\'' + nid + '\',type:\'user\',userId:\'' + ui.id + '\',userName:' + (pwtree.isFirefox ? 'this.textContent' : 'this.innerText') + '});';
                    
                    d.add(nid,pid,ui.name,null,url,'','',imgPath + 'user.gif',imgPath + 'user.gif',true);
                    nid++;
                }
            }
            
            $(obj).html(''+d + strTree);

            //隐藏第一个节点 root
            $("#id0").parent("div").hide();

            //$('#' + tree.txtTreeHtmlCode).attr('value', ''+d);
            
            d.closeAll();
            d.openTo(1);
	            
            //将第一个节点选中
            d.s(1);
        }
    });
    return rootUnitId;
};