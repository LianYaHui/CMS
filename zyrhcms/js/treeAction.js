var tree = tree || {};


tree.addGroup = function(e, obj, group){
    var item = [];
	var idx = 0;
	item[idx++] = {
		text:'添加分组', func:function(){
			tree.addGroupAction(group.id + ',' + group.name);
		}
	};

	var config = {
		width: 80,
		zindex: 1000,
		opacity: 1,
		item: item
	};
	var cmenu = new ContextMenu(e, config, obj);
};

tree.addGroupAction = function(id, name){
    alert('未完成');
};

tree.groupAction = function(e, obj, group){
    var item = [];
	var idx = 0;
	item[idx++] = {
		text:'重命名', func:function(){
			tree.renameGroup(group.id + ',' + group.name);
		}
	};
	item[idx++] = {
		text:'删除', func:function(){
			tree.deleteGroup(group.id + ',' + group.name);
		}
	};

	var config = {
		width: 80,
		zindex: 1000,
		opacity: 1,
		item: item
	};
	var cmenu = new ContextMenu(e, config, obj);
};

tree.renameGroup = function(id, name){
    alert(id + ',' + name);
};

tree.deleteGroup = function(id, name){
    alert(id + ',' + name);
};

tree.appendToGroup = function(e, obj, dev){
    var item = [];
	var idx = 0;
	item[idx++] = {
		text:'添加到我的分组', func:function(){
			tree.appendToGroupAction(dev.id + ',' + dev.code);
		}
	};

	var config = {
		width: 100,
		zindex: 1000,
		opacity: 1,
		item: item
	};
	var cmenu = new ContextMenu(e, config, obj);
};

tree.appendToGroupAction = function(id, code){
    alert(id + ',' + code);
};