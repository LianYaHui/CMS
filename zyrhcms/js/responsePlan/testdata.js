var testdata = testdata || {};

testdata.responsePlanData = function(){
    var list = [
        {id:1, name:'事故名称1', level:'Ⅱ', type:13, lat:'30.60752', lng:'114.424330', desc:'', createTime:'2013-07-09 10:00:15'},
        {id:2, name:'事故名称2', level:'Ⅲ', type:15, lat:'30.91307', lng:'114.4323500', desc:'', createTime:'2013-07-10 12:00:15'},
        {id:3, name:'事故名称3', level:'Ⅳ', type:13, lat:'30.20019', lng:'114.8878300', desc:'', createTime:'2013-07-10 14:00:15'}
    ];
    var data = {result:1,list:list};
    return data;
};

testdata.buildTable = function(){
    $('#planlist_1').html('<table cellpadding="0" cellspacing="0" id="tbPlan1" class="tblist"></table>');
    $('#planlist_2').html('<table cellpadding="0" cellspacing="0" id="tbPlan2" class="tblist"></table>');
    
    $('#moduleList').html('<table cellpadding="0" cellspacing="0" id="tbModule" class="tblist"></table>');
    
    testdata.fillPlanHeader('tbPlan1');
    testdata.fillPlan(testdata.responsePlanData(), 'tbPlan1');
    
    testdata.fillModuleHeader('tbModule');
    testdata.fillModule(testdata.moduleData(), 'tbModule');
};

testdata.fillPlanHeader = function(tbId){
    var objList = cms.util.$(tbId);
    var cellid = 0;
    var rowData = [];
    var row = objList.insertRow(0);
    row.className = 'trheader';
    
    rowData[cellid++] = {html: '事故名称', style:[['width','90px']]};
    rowData[cellid++] = {html: '等级', style:[['width','35px']]};
    rowData[cellid++] = {html: '发布时间', style:[['width','70px']]};
    
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
};

testdata.fillPlan = function(data, tbId){
    var objList = cms.util.$(tbId);
    var rid = 1;
    var rowData = [];
    var list = data.list;
    cms.util.clearDataRow(objList, 1);
        
    for(var i=0,c=list.length; i<c; i++){
        var dr = list[i];
        var cellid = 0;
        var row = objList.insertRow(rid);
        row.lang = '{id:' + dr.id + ',name:\'' + dr.name + '\',type:\'' + dr.type + '\',level:\'' + dr.level + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\','
            + 'desc:\'' + dr.desc + '\', createTime:\'' + dr.createTime + '\'}';
        
        row.onclick = function(){
            testdata.showPlanDetail('#planDetail', this);
            var lang = eval('(' + this.lang + ')');
            emap.setMapCenter(lang.lat, lang.lng);
        };
        row.ondblclick = function(){
            var lang = eval('(' + this.lang + ')');
            showResponsePlan(null, lang);
        };
        rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.name, 90, true, dr.name), style:[['width','90px']]};
        rowData[cellid++] = {html: dr.level, style:[['width','35px']]};
        rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.createTime, 95, true, dr.createTime), style:[['width','95px']]};
        
        rowData[cellid++] = {html: '', style:[]};
        
        cms.util.fillTable(row, rowData);
        rid++;
    }
};

testdata.showPlanDetail = function(obj, row){
    var lang = eval('(' + row.lang + ')');
    var strHtml = '事故名称：' + lang.name + '<br />'
        + '严重等级：' + lang.level + '<br />'
        + 'GPS经纬度：' + lang.lat + ',' + lang.lng + '<br />'
        + '发布时间：' + lang.createTime + '<br />'
        + '事故描述：' + lang.desc;
    $(obj).html(strHtml);
};

testdata.loadPlan = function(){

};

testdata.moduleData = function(){
    var list = [
        {id:1, name:'CAD图纸', url:'', param:'', desc:'', createTime:'2013-07-09 10:00:15'},
        {id:2, name:'巡检记录', url:'', param:'', desc:'', createTime:'2013-07-09 10:00:15'},
        {id:3, name:'检修记录', url:'', param:'', desc:'', createTime:'2013-07-09 10:00:15'},
        {id:4, name:'设备履历', url:'', param:'', desc:'', createTime:'2013-07-09 10:00:15'},
        {id:5, name:'视频预览', url:'', param:'', desc:'', createTime:'2013-07-09 10:00:15'}
    ];
    var data = {result:1,list:list};
    return data;
};

testdata.fillModuleHeader = function(tbId){
    var objList = cms.util.$(tbId);
    var cellid = 0;
    var rowData = [];
    var row = objList.insertRow(0);
    row.className = 'trheader';
    
    rowData[cellid++] = {html: '模块名称', style:[['width','90px']]};
    //rowData[cellid++] = {html: 'URL地址', style:[['width','120px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','70px']]};
    
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
};

testdata.fillModule = function(data, tbId){
    var objList = cms.util.$(tbId);
    var rid = 1;
    var rowData = [];
    var list = data.list;
    cms.util.clearDataRow(objList, 1);
        
    for(var i=0,c=list.length; i<c; i++){
        var dr = list[i];
        var cellid = 0;
        var row = objList.insertRow(rid);
        row.lang = '{id:' + dr.id + ',name:\'' + dr.name + '\',url:\'' + dr.url + '\',param:\'' + dr.param + '\', createTime:\'' + dr.createTime + '\'}';
        
        row.onclick = function(){
            var lang = eval('(' + this.lang + ')');
        };
        row.ondblclick = function(){
            var lang = eval('(' + this.lang + ')');
            
        };
        rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.name, 90, true, dr.name), style:[['width','90px']]};
        //rowData[cellid++] = {html: dr.url, style:[['width','120px']]};
        rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.createTime, 95, true, dr.createTime), style:[['width','95px']]};
               
        rowData[cellid++] = {html: '', style:[]};
        
        cms.util.fillTable(row, rowData);
        rid++;
    }
};