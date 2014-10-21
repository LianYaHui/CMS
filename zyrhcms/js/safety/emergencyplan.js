var safety = safety || {};
safety.eplan = safety.eplan || {};

safety.eplan.planListHeight = 260;
safety.eplan.accidentListHeight = 200;

safety.eplan.showPlanList = function(){
    var width = 317;
    var height = boxSize.height - safety.eplan.accidentListHeight - 5;
    var strHtml = '<div style="height:55px;background:#dbebfe;padding:0 5px;">'
        + '<table><tr>'
        + '<td>专&nbsp;&nbsp;业：</td>'
        + '<td>'
        + '<label class="chb-label-nobg" style="margin:0 0 0 -4px;"><input type="checkbox" name="chbProfession" class="chb" value="1" /><span>接触网</span></label>'
        + '<label class="chb-label-nobg"><input type="checkbox" name="chbProfession" class="chb" value="2" /><span>变电</span></label>'
        + '<label class="chb-label-nobg"><input type="checkbox" name="chbProfession" class="chb" value="3" /><span>电力</span></label>'
        + '</td></tr>'
        + '<tr>'
        + '<td>关键字：</td>'
        + '<td><input type="text" class="txt w165" maxlength="32" id="txtPlanKeywords" />'
        + '<a class="btn btnc22" style="margin-left:5px;" onclick="safety.eplan.getPlanList();"><span>搜索</span></a>'
        + '</td></tr></table>'
        + '</div>'
        + '<div style="height:' + (height - 25 - 55) + 'px;width:' + width + 'px;overflow:auto;" id="divPlanList"></div>';
    var config = {
        id: 'pweplanlist',
        title: '预案查询',
        html: strHtml,
        closeType: 'hide',
        build: 'show',
        reload: false,
        noBottom: true,
        lock: false,
        //maxAble: true,
        minAble: true,
        showMinMax: true,
        zindex:2000,
        position: 1,
        y: safety.eplan.accidentListHeight + 40,
        width: width,
        height: height
    };
    
    cms.box.win(config);
    safety.eplan.getPlanList()
};

safety.eplan.getPlanList = function(isOpen){
    var professionIdList = cms.util.getCheckBoxCheckedValue('chbProfession', ',');
    var strKeywords = cms.util.$('txtPlanKeywords').value.trim();
    var urlparam = 'action=getResponsePlan&professionIdList=' + professionIdList + '&keywords=' + escape(strKeywords);
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/planManage.aspx',
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
            if(1 == jsondata.result){
                safety.eplan.buildPlanList(jsondata, strKeywords);
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.eplan.buildPlanList = function(jsondata, strKeywords){
    var obj = cms.util.$('divPlanList');

    var strHtml = '';
    if(jsondata.list.length > 0){
        strHtml += '<table class="tblist" cellpadding="0" cellspacing="0" >';
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var dr = jsondata.list[i];
            var rid = (i+1);
            strHtml += '<tr>'
                + '<td style="width:30px;">' + rid + '</td>';
            /*
            if(isOpen){
                strHtml += '<td onclick="safety.eplan.showPlanDetail(' + dr.id + ',\'' + dr.name + '\');" style="text-align:left;">' + dr.name + '</td>';        
            } else {
                strHtml += '<td onclick="safety.eplan.showPlanContent(' + dr.id + ');" style="text-align:left;">' + dr.name + '</td>';
            }
            */
            strHtml += '<td onclick="safety.eplan.showPlanContent(' + dr.id + ');" style="text-align:left;">' + cms.util.fixedCellWidth(dr.name, 270, true, dr.name) + '</td>';
            strHtml += '</tr>';
        }
        strHtml += '</table>';
    } else {
        strHtml += '<div style="padding:5px;">没有搜索到相关的预案信息';
        if(!strKeywords.equals(string.empty)){
            strHtml += '<br />'
                + '建议您将搜索关键字作拆分处理<br />'
                + '比如：<br />'
                + '将“接触网抢修预案”拆分成“接触网 抢修 预案”'
                + '</div>';
        }
    }
    obj.innerHTML = strHtml;
    
    delete strHtml;
};

safety.eplan.showPlanContent = function(id, name){
    var strHtml = '<div style="padding:10px;overflow:auto;max-width:800px;" id="divPlanContentPanel"></div>';
    var config = {
        id: 'pwPlanContent',
        title: '预案详细内容',
        html: strHtml,
        closeType: 'hide',
        build: 'show',
        reload: false,
        noBottom: true,
        lock: false,
        minAble: true,
        showMinMax: true,
        position: 4,
        x: 324,
        zindex:2010,
        width: 600,
        height: 450,
        minWidth: 317,
        minHeight: 260
    };
    
    cms.box.win(config);
    
    safety.eplan.getPlanDetail(id);
};

safety.eplan.getPlanDetail = function(id){
    var urlparam = 'action=getSingleResponsePlan&id=' + id;
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/planManage.aspx',
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
            if(1 == jsondata.result){
                safety.eplan.showPlanDetail(jsondata);
                delete jsondata;
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.eplan.showPlanDetail = function(jsondata){
    var obj = cms.util.$('divPlanContentPanel');
    obj.innerHTML = jsondata.plan.content;
};


/*
safety.eplan.showPlanContent = function(id, name){
    var width = 316;
    var height = boxSize.height - safety.eplan.planListHeight - safety.eplan.accidentListHeight - 5;
    var strHtml = ''
        + '<div style="float:left; width:300px;display:none;border-right:solid 1px #99bbe8;" id="divPlanListPanel"></div>'
        + '<div style="padding:10px;overflow:auto;max-width:800px;" id="divPlanContentPanel"></div>';
    var config = {
        id: 'pwPlanContent',
        title: '预案详细内容',
        html: strHtml,
        closeType: 'hide',
        build: 'show',
        reload: false,
        noBottom: true,
        lock: false,
        minAble: true,
        showMinMax: true,
        zindex:2010,
        position: 1,
        y: safety.eplan.planListHeight + safety.eplan.accidentListHeight + 38 + 5,
        width: 600,
        height: 400,
        minWidth: 316,
        minHeight: height,
        callBackByResize: safety.eplan.changePanelSize
    };    
    var pwc = cms.box.win(config);
    $('#divPlanContentPanel').load(cms.util.path + '/modules/safety/temp/' + id + '.htm');
    
    pwc.Min();
};

safety.eplan.showPlanDetail = function(id){
    $('#divPlanContentPanel').load(cms.util.path + '/modules/safety/temp/' + id + '.htm');
};
*/

safety.eplan.changePanelSize = function(model, winBodySize){
    var obj = $('#divPlanContentPanel');
    
    if(model == 'max'){
        $('#divPlanListPanel').show();
        $('#divPlanListPanel').html(safety.eplan.getPlanList(true));
    } else {
        $('#divPlanListPanel').hide();
        $('#divPlanListPanel').html('');
    }
    $('#divPlanListPanel').height(winBodySize.h-21);
    
    obj.width(winBodySize.w-20);
    obj.height(winBodySize.h-21);
    
};
