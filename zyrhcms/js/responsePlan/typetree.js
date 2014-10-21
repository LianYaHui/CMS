var typetree = typetree || {};
typetree.isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;

typetree.loadTypeTree = function(){
    var urlparam = 'action=getPlanType';
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/responsePlan.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    typetree.showTypeTree('#treePlanType', jsondata, 'typetree.showTypeDetail');
                } else {
                    module.showDataError({html:jsondata.error, width:400, height:250});
                }
            }
        }
    });
};

typetree.showTypeDetail = function(param){
    var urlparam = 'action=getPlanTypeModule&typeId=' + param.id;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/responsePlan.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    typetree.fillTypeModule(jsondata.list);
                } else {

                }
            }
        }
    });
    
};

typetree.fillTypeModule = function(list){
    var objList = cms.util.$('tbPlanTypeModule');
    var rid = 0;
    var rowData = [];
    cms.util.clearDataRow(objList, 0);
        
    for(var i=0,c=list.length; i<c; i++){
        var dr = list[i];
        var cellid = 0;
        var row = objList.insertRow(rid);
//        row.lang = '{id:' + dr.id + ',name:\'' + dr.name + '\',type:\'' + dr.type + '\',level:\'' + dr.level + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\','
//            + 'desc:\'' + dr.desc + '\', createTime:\'' + dr.createTime + '\'}';

        rowData[cellid++] = {html: (i+1), style:[['width','30px']]};
        rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.name, 120, true, dr.name), style:[['width','120px']]};
        rowData[cellid++] = {html: dr.sortOrder, style:[['width','30px']]};
        rowData[cellid++] = {html: dr.display, style:[['width','60px']]};
        
        rowData[cellid++] = {html: '', style:[]};
        
        cms.util.fillTable(row, rowData);
        rid++;
    }
};

typetree.showTypeTree = function(obj, jsondata, callBack){
    var nid = 0;
    var pid = -1;
    var strTree = '';
    var imgPath = cmsPath + '/skin/default/images/common/tree/';
    var htTree = new cms.util.Hashtable();

    d = new dTree('d', 
        {skin: cmsPath + '/common/js/dtree/img',showCheckBox:false,dblclick:false,folderLinks:true}
    );
    nid++;
    pid++;

    d.add(0,-1,'应急预案类型',null);

    var list = jsondata.list;
    var c = list.length;

    for(var i=0; i<c; i++){
        var pt = list[i];
        htTree.add('pt' + pt.id, nid);
        pid = pt.pid == 0 ? 0 : htTree.items('pt' + pt.pid);
        var url = callBack + '({id:\'' + pt.id + '\',pid:\'' + pt.pid + '\',name:' + (typetree.isFirefox ? 'this.textContent' : 'this.innerText') + '});';
                    
        d.add(nid,pid,pt.name,null,url);
        nid++;
    }

    $(obj).html(''+d);
    //隐藏第一个节点 root
    $('#i' + 'd' + '0').parent("div").hide();
};