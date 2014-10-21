var gprsConfig = gprsConfig || {};
gprsConfig.tree = gprsConfig.tree || {};

gprsConfig.tree.buildMenuTree = function(treeData, arrOpenIndex, selectIndex){
	var nodeid = 0;
	var arrTreeData = treeData;
	var imgPath = cmsPath + '/common/js/dtree/img1';
	d = new dTree('d',
		    {skin: imgPath, showCheckBox:false,dblclick:false,folderLinks:false},
		    {node: imgPath + '/setting.gif'}
	);
	var arrModule = arrTreeData.module;
	for(var i=0,c=arrModule.length; i<c; i++){
	    var arrMenu = gprsConfig.getTreeMenu(devInfo.typeCode, arrModule[i].func);
	    if(arrMenu.length > 0 || arrModule[i].pid == -1){
	        var pnode = arrModule[i];
	        d.add(pnode.id,pnode.pid,pnode.name,null);
	        nodeid++;
	        
	        for(var j=0,cc=arrMenu.length; j<cc; j++){
		        var tnode = arrMenu[j];
		        var strType = 'menu';
		        var url = '';
		        if(tnode.callBack != null && tnode.callBack != undefined){
			        var callback = tnode.callBack;
			        url = callback.func + '({type:\'' + strType + '\',action:\'' + callback.action + '\',url:\'' + callback.url + '\',name:\'' + tnode.name + '\'})';
		        }
		        var icon = '';
		        d.add(tnode.id,pnode.id,tnode.name,null,url,'','',icon,icon,true, null, false);
	            nodeid++;
	        }
	    }
	}
	$('#treebox').html('' + d);
	
	$('#id0').parent('div').hide();
	
	d.openAll();
	if(nodeid > 2){
	    d.s(2);
	}
};