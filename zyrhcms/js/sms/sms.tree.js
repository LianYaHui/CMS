var sms = sms || {};
sms.tree = sms.tree || {};

sms.tree.buildMenuTree = function(treeData, arrOpenIndex, selectIndex){
	var nodeid = 0;
	var arrTreeData = treeData;
	var imgPath = cms.util.path + '/common/js/dtree/img';
	d = new dTree('d',
		    {skin: imgPath, showCheckBox:false,dblclick:false,folderLinks:false},
		    {node: imgPath + '/page.gif'}
	);
	var arrModule = arrTreeData.module;
	for(var i=0,c=arrModule.length; i<c; i++){
		var tnode = arrModule[i];
		nodeid = tnode.id;
		d.add(nodeid,tnode.pid,tnode.name,null);
	}
	
	var arrMenu = arrTreeData.menu;

	for(var i=0,c=arrMenu.length; i<c; i++){
		var tnode = arrMenu[i];
		nodeid++;
		var strType = 'menu';
		var url = '';
		if(tnode.callBack != null && tnode.callBack != undefined){
			var callback = tnode.callBack;
			url = callback.func + '({type:\'' + strType + '\',action:\'' + callback.action + '\',url:\'' + callback.url + '\',name:\'' + tnode.name + '\'})';
		}
		var icon = '';

		d.add(nodeid,tnode.pid,tnode.name,null,url,'','',icon,icon,true, null, false);
	}
	$('#treebox').html('' + d);
	$('#id0').parent('div').hide();
	
    $('#treebox a').focus(function(){
        this.blur();
    });
	
	for(var i=0; i<arrOpenIndex.length; i++){
	    d.o(arrOpenIndex[i]);
	}
	d.s(selectIndex);
};