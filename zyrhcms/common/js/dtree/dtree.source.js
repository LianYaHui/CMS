var dtree = dtree || {};
dtree.$ = function(i){ return document.getElementById(i); };

dtree.getMyName = function() {
    var es = document.getElementsByTagName('script');
    var scriptSrc = es[es.length - 1].src;
    return scriptSrc.split('/')[scriptSrc.split('/').length - 1];
};
dtree.jsName = dtree.getMyName();

dtree.getJsPath = function(js){
	var es = document.getElementsByTagName('script');
	for (var i = 0; i < es.length; i++)
	{
		var si = es[i].src.lastIndexOf('/');
		if(es[i].src != '' && es[i].src.substr(si + 1).split('?')[0] == js){
			return es[i].src.substring(0,si + 1);
		}
	}
};
function Node(id, pid, name, checkbox, url, title, target, icon, iconOpen, open, contextmenu, dblclick) {
	this.id = id;
	this.pid = pid;
	this.name = name;
	this.checkbox = checkbox;
	if(checkbox != null){
		this.cname = checkbox.name || '';
		this.cvalue = checkbox.value || '';
		this.cclass = checkbox.css || '';
		this.cchecked = checkbox.checked || false;
		this.cdisabled = checkbox.disabled || false;
		this.ccallback = checkbox.callback || null;
	}
	this.url = url || '#';
	this.title = title;
	this.target = target;
	this.icon = icon;
	this.iconOpen = iconOpen;
	this.contextmenu = contextmenu || null;
	this.dblclick = dblclick || false;
	this._io = open || false;
	this._is = false;
	this._ls = false;
	this._hc = false;
	this._ai = 0;
	this._p;
};

function dTree(objName, config, icons) {
	config = config || {};
	icons = icons || {};
	this.skin = config.skin || dtree.getJsPath(dtree.jsName) + 'img';
	this.dblclick = config.dblclick || false;
	this.showCheckBox = config.showCheckBox || false;
	this.config = {
		target				: null,
		folderLinks			: config.folderLinks || false,
		useSelection		: config.useSelection || true,
		useCookies			: config.useCookies || false,
		useLines			: config.useLines || false,
		useIcons			: config.useIcons || true,
		useStatusText		: config.useStatusText || false,
		closeSameLevel		: config.closeSameLevel || false,
		inOrder				: config.inOrder || false
	};
	this.icon = {
		root				: icons.root ||this.skin + '/base.gif',
		folder				: icons.folder || this.skin + '/folder.gif',
		folderOpen			: icons.folderOpen || this.skin + '/folderopen.gif',
		node				: icons.node || this.skin + '/page.gif',
		empty				: icons.empty || this.skin + '/empty.gif',
		line				: icons.line || this.skin + '/line.gif',
		join				: icons.join || this.skin + '/join.gif',
		joinBottom			: icons.joinBottom || this.skin + '/joinbottom.gif',
		plus				: icons.plus || this.skin + '/plus.gif',
		plusBottom			: icons.plusBottom || this.skin + '/plusbottom.gif',
		minus				: icons.minus || this.skin + '/minus.gif',
		minusBottom			: icons.minusBottom || this.skin + '/minusbottom.gif',
		nlPlus				: icons.nlPlus || this.skin + '/nolines_plus.gif',
		nlMinus				: icons.nlMinus || this.skin + '/nolines_minus.gif'
	};
	this.obj = objName;
	this.aNodes = [];
	this.aIndent = [];
	this.root = new Node(-1);
	this.selectedNode = null;
	this.selectedFound = false;
	this.completed = false;
};

// Adds a new node to the node array
dTree.prototype.add = function(id, pid, name, checkbox, url, title, target, icon, iconOpen, open, contextmenu, dblclick) {
	this.aNodes[this.aNodes.length] = new Node(id, pid, name, checkbox, url, title, target, icon, iconOpen, open, contextmenu, dblclick);
};

// Open/close all nodes
dTree.prototype.openAll = function() {
	this.oAll(true);
};
dTree.prototype.closeAll = function() {
	this.oAll(false);
};

// Outputs the tree to the page
dTree.prototype.toString = function() {
	var str = '<div class="dtree">\n';
	if (document.getElementById) {
		if (this.config.useCookies) this.selectedNode = this.getSelected();
		str += this.addNode(this.root);
	} else str += 'Browser not supported.';
	str += '</div>';
	if (!this.selectedFound) this.selectedNode = null;
	this.completed = true;
	return str;
};

// Creates the tree structure
dTree.prototype.addNode = function(pNode) {
	var str = '';
	var n=0;
	if (this.config.inOrder) n = pNode._ai;
	for (n,c=this.aNodes.length; n<c; n++) {
		if (this.aNodes[n].pid == pNode.id) {
			var cn = this.aNodes[n];
			cn._p = pNode;
			cn._ai = n;
			this.setCS(cn);
			if (!cn.target && this.config.target) cn.target = this.config.target;
			if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
			if (!this.config.folderLinks && cn._hc) cn.url = null;
			if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
					cn._is = true;
					this.selectedNode = n;
					this.selectedFound = true;
			}
			str += this.node(cn, n);
			if (cn._ls) break;
		}
	}
	return str;
};
// Creates the node icon, url and text
dTree.prototype.node = function(node, nodeId) {
	var str = '<div class="dTreeNode">' + this.indent(node, nodeId);
	if (this.config.useIcons) {
		if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);
		if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
		if (this.root.id == node.pid) {
			node.icon = this.icon.root;
			node.iconOpen = this.icon.root;
		}
		str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
	}
	if (node.url != undefined) {	    
		str += '<a id="s' + this.obj + nodeId + '" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '"';
		//str += ' href="' + node.url + '"';
		//str += ' href="javascript:;"';
		if (node.title != undefined) str += ' title="' + node.title + '"';
		if (node.target != undefined) str += ' target="' + node.target + '"';
		if (this.config.useStatusText) 
			str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';
		if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))
			str += ' onclick="' + this.obj + '.s(' + nodeId + ');'
				+ (node._hc && this.config.folderLinks && (!this.dblclick && !node.dblclick) ? this.obj + '.o(' + nodeId + ');' : '') 
				+ (this.dblclick || node.dblclick ? '' : node.url != '#' ? node.url : '') + '"';
		if(this.dblclick || node.dblclick){
			str += ' ondblclick="' + (node._hc && this.config.folderLinks ? this.obj + '.o(' + nodeId + ');' : '')
				+ (this.showCheckBox? 'dtree.$(\'' + node.cname + '_' + node.id + '\').click();' : '') 
				+ (node.url != '#' ? node.url : '') + '"';
		}
		if(node.contextmenu != null){
		    str += ' oncontextmenu="' + node.contextmenu + '"';
		}
		str += '>';
	}
	else if (this.config != undefined && (!this.config.folderLinks || node.url == undefined) && node._hc && node.pid != this.root.id){
		if(this.dblclick || node.dblclick){
			str += '<a href="#" '
				+ ' onclick="' + this.obj + '.s(' + nodeId + ');"'
				+ ' ondblclick="' + this.obj + '.o(' + nodeId + ');' + (this.showCheckBox?'dtree.$(\'' + node.cname + '_' + node.id + '\').click();':'') + '"'
				+ ' class="node"';
		} else {
			str += '<a href="#" '
				+ ' onclick="' + this.obj + '.s(' + nodeId + ');' + this.obj + '.o(' + nodeId + ');' +'"'
				+ ' ondblclick="' + (this.showCheckBox?'dtree.$(\'' + node.cname + '_' + node.id + '\').click();':'') + '"'
				+ ' class="node"';
		}
		if(node.contextmenu != null){
		    str += ' oncontextmenu="' + node.contextmenu + '"';
		}
		str += '>';
	}
	//str += node.name;
	if(node.pid == this.root.id){
		str += '<span>' + node.name + '</span>';
	}else{
		if(this.showCheckBox){
			checkboxSyntax = '<input type="checkbox" name="' + node.cname + '" id="' + node.cname + '_' + node.id + '" value="' + node.cvalue + '"'
				+ ' class="' + node.cclass + '" '
				+ ' onclick="' + this.obj + '.checkNode(' + node.id+','+node.pid+','+node._hc + ',this.checked);' 
				+ (node.ccallback != null ? node.ccallback + '();' : '') + '" ';
			
			if(node.cchecked)
				checkboxSyntax += " checked ";
			
			if(node.cdisabled || node.checkbox == null)
				checkboxSyntax += " disabled ";
			checkboxSyntax += ' lang="' + node.name + '" />';
			checkboxSyntax += '<span>' + node.name + '</span>';
								
			str += checkboxSyntax;
		} else {
			str += '<span>' + node.name + '</span>';
		}
	}

	if (node.url != undefined || ((!this.config.folderLinks || node.url == undefined) && node._hc)) str += '</a>';
	str += '</div>';
	if (node._hc) {
		str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
		str += this.addNode(node);
		str += '</div>';
	}
	this.aIndent.pop();
	return str;
};

// Adds the empty and line icons
dTree.prototype.indent = function(node, nodeId) {
	var str = '';
	if (this.root.id != node.pid) {
		for (var n=0,c=this.aIndent.length; n<c; n++)
			str += '<img src="' + ( (this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) + '" alt="" />';
		this.aIndent.push(node._ls ? 0 : 1);
		if (node._hc) {
			str += '<a href="javascript:' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';
			if (!this.config.useLines) str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
			else str += ( (node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus ) );
			str += '" alt="" /></a>';
		} else str += '<img style="margin-left:4px;" src="' + ( (this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) + '" alt="" />';
	}
	return str;
};

// Checks if a node has any children and if it is the last sibling
dTree.prototype.setCS = function(node) {
	var lastId;
	for (var n=0,c=this.aNodes.length; n<c; n++) {
		if (this.aNodes[n].pid == node.id) node._hc = true;
		if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
	}
	if (lastId==node.id) node._ls = true;
};

// Returns the selected node
dTree.prototype.getSelected = function() {
	var sn = this.getCookie('cs' + this.obj);
	return (sn) ? sn : null;
};

dTree.prototype.checkNode = function(id,pid,_hc,checked) {
	if(!this.isHaveBNode(id,pid)){
		if(checked){
			this.checkPNodeRecursion(pid,checked);
		}else{
			this.checkPNode(pid,checked);
		}
	}
	if(_hc)		
		this.checkSNodeRecursion(id,checked);
};

dTree.prototype.isHaveBNode = function(id, pid) {
    var isChecked = false;
    for (var n = 0, c = this.aNodes.length; n < c; n++) {
        var node = this.aNodes[n];
        if (node.pid != -1 && node.id != id && node.pid == pid) {
            if (dtree.$(node.cname + "_" + node.id).checked) {
                isChecked = true;
                break;
            }
        }
    }

    return isChecked;
};

dTree.prototype.checkPNodeRecursion = function(pid,ischecked) {	
	for (var n=0,c=this.aNodes.length; n<c; n++) {
		var node = this.aNodes[n];
		if (node.pid!=-1 && node.id == pid) {
			dtree.$(node.cname + "_" + node.id).checked = ischecked;
			this.checkPNodeRecursion(node.pid,ischecked);
			break;
		}
	}
};

dTree.prototype.checkSNodeRecursion = function(id,ischecked) {
	for (var n=0,c=this.aNodes.length; n<c; n++) {
		var node = this.aNodes[n];
		if (node.pid!=-1 && node.pid == id) {
			dtree.$(node.cname + "_" + node.id).checked = ischecked;
			this.checkSNodeRecursion(node.id,ischecked);
		}
	}
};

dTree.prototype.checkPNode = function(pid,ischecked) {
	var nodes = this.aNodes;
	for (var n=0,c=nodes.length; n<c; n++) {
		if (nodes[n].pid!=-1 && nodes[n].id == pid) {
			dtree.$(nodes[n].cname + "_" + nodes[n].id).checked = ischecked;
			break;
		}
	}
};

// Highlights the selected node
dTree.prototype.s = function(id) {
	if (!this.config.useSelection) return;
	var cn = this.aNodes[id];
	if (cn._hc && !this.config.folderLinks) return;
	if (this.selectedNode != id) {
		if (this.selectedNode || this.selectedNode==0) {
			eOld = dtree.$("s" + this.obj + this.selectedNode);
			eOld.className = "node";
		}
		var eNew = dtree.$("s" + this.obj + id);
		if(eNew != null){
		    eNew.className = "nodeSel";
		    this.selectedNode = id;
		    if (this.config.useCookies) this.setCookie('cs' + this.obj, cn.id);
		}
	}
};

// Toggle Open or close
dTree.prototype.o = function(id) {
	var cn = this.aNodes[id];
	this.nodeStatus(!cn._io, id, cn._ls);
	cn._io = !cn._io;
	if (this.config.closeSameLevel) this.closeLevel(cn);
	if (this.config.useCookies) this.updateCookie();
};

// Open or close all nodes
dTree.prototype.oAll = function(status) {
	var nodes = this.aNodes;
	for (var n=0,c=nodes.length; n<c; n++) {
		if (nodes[n]._hc && nodes[n].pid != this.root.id) {
			this.nodeStatus(status, n, nodes[n]._ls)
			nodes[n]._io = status;
		}
	}
	if (this.config.useCookies) this.updateCookie();
};

// Opens the tree to a specific node
dTree.prototype.openTo = function(nId, bSelect, bFirst) {
	if (!bFirst) {
	for (var n=0,c=this.aNodes.length; n<c; n++) {
			if (this.aNodes[n].id == nId) {
				nId=n;
				break;
			}
		}
	}
	var cn=this.aNodes[nId];
	if (cn.pid==this.root.id || !cn._p) return;
	cn._io = true;
	cn._is = bSelect;
	if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
	if (this.completed && bSelect) this.s(cn._ai);
	else if (bSelect) this._sn=cn._ai;
	this.openTo(cn._p._ai, false, true);
};

// Closes all nodes on the same level as certain node
dTree.prototype.closeLevel = function(node) {	
	var nodes = this.aNodes;
	for (var n=0,c=nodes.length; n<c; n++) {
		if (nodes[n].pid == nodes[n].pid && nodes[n].id != nodes[n].id && nodes[n]._hc) {
			this.nodeStatus(false, n, nodes[n]._ls);
			nodes[n]._io = false;
			this.closeAllChildren(nodes[n]);
		}
	}
};

// Closes all children of a node
dTree.prototype.closeAllChildren = function(node) {
	var nodes = this.aNodes;
	for (var n=0,c=nodes.length; n<c; n++) {
		if (nodes[n].pid == nodes[n].id && nodes[n]._hc) {
			if (nodes[n]._io) this.nodeStatus(false, n, nodes[n]._ls);
			nodes[n]._io = false;
			this.closeAllChildren(nodes[n]);
		}
	}
};

// Change the status of a node(open or closed)
dTree.prototype.nodeStatus = function(status, id, bottom) {
	eDiv	= dtree.$('d' + this.obj + id);
	eJoin	= dtree.$('j' + this.obj + id);
	if(eJoin != null){
	    if (this.config.useIcons) {
		    eIcon = dtree.$('i' + this.obj + id);	    
		    eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
	    }
	    eJoin.src = (this.config.useLines)?
	    ((status)?((bottom)?this.icon.minusBottom:this.icon.minus):((bottom)?this.icon.plusBottom:this.icon.plus)):
	    ((status)?this.icon.nlMinus:this.icon.nlPlus);
	}
	eDiv.style.display = (status) ? 'block': 'none';
};


// [Cookie] Clears a cookie
dTree.prototype.clearCookie = function() {
	var now = new Date();
	var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
	this.setCookie('co'+this.obj, 'cookieValue', yesterday);
	this.setCookie('cs'+this.obj, 'cookieValue', yesterday);
};

// [Cookie] Sets value in a cookie
dTree.prototype.setCookie = function(cookieName, cookieValue, expires, path, domain, secure) {
	document.cookie =
		escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
};

// [Cookie] Gets a value from a cookie
dTree.prototype.getCookie = function(cookieName) {
	var cookieValue = '';
	var posName = document.cookie.indexOf(escape(cookieName) + '=');
	if (posName != -1) {
		var posValue = posName + (escape(cookieName) + '=').length;
		var endPos = document.cookie.indexOf(';', posValue);
		if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
		else cookieValue = unescape(document.cookie.substring(posValue));
	}
	return (cookieValue);
};

// [Cookie] Returns ids of open nodes as a string
dTree.prototype.updateCookie = function() {
	var str = '';
	var nodes = this.aNodes;
	for (var n=0,c=nodes.length; n<c; n++) {
		if (nodes[n]._io && nodes[n].pid != this.root.id) {
			if (str) str += '.';
			str += nodes[n].id;
		}
	}
	this.setCookie('co' + this.obj, str);
};

// [Cookie] Checks if a node id is in a cookie
dTree.prototype.isOpen = function(id) {
	var aOpen = this.getCookie('co' + this.obj).split('.');
	for (var n=0,c=aOpen.length; n<c; n++)
		if (aOpen[n] == id) return true;
	return false;
};

// If Push and pop is not implemented by the browser
if (!Array.prototype.push) {
	Array.prototype.push = function array_push() {
		for(var i=0,c=arguments.length;i<c;i++)
			this[this.length]=arguments[i];
		return this.length;
	}
};
if (!Array.prototype.pop) {
	Array.prototype.pop = function array_pop() {
		lastElement = this[this.length-1];
		this.length = Math.max(this.length-1,0);
		return lastElement;
	}
};

dtree.loadCss = function(cssDir, cssName){
	var cssTag = document.createElement('link');
	cssTag.setAttribute('rel','stylesheet');
	cssTag.setAttribute('type','text/css');
	cssTag.setAttribute('href', cssDir + cssName);
	document.getElementsByTagName('head')[0].appendChild(cssTag);
};
dtree.loadCss(dtree.getJsPath(dtree.jsName), 'dtree.css');