var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 320;
var rightWidth = 0;
var switchWidth = 5
var boxSize = {};
var boxId = 'pwboxid001';
var pwBuildInfo = null;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var arrMarker = [];
var arrLabel = [];

//预案内容窗体
var planWins = [];
//功能模块窗体
var moduleWins = [];

var menuBoxWidth = 300;

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    //cms.frame.setFullScreen(true);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    //setLeftDisplay($('#bodyLeftSwitch'));
    
    cms.frame.setFrameByShortcutKey();
    //window.setTimeout(showResponseStat, 1000);
    
});

$(window).resize(function(){
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    window.setTimeout(showBuildInfo, 500);
    window.setTimeout(emap.initialEmap, 500);
    //获得部门信息
    getDepartment(cms.util.$('txtDepartmentId'), cms.util.$('ddlDepartment'));
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
    setLeftPanelSize();
};

var getDateTime = function(){
    var urlparam = 'action=getDateTime&format=' + escape('yyyy年MM月dd日 HH:mm:ss') + '&showWeedDay=1';
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/common.aspx',
        data: urlparam,
        error: function(data){
            module.showDataError({html:data, width:400, height:250});
        },
        success: function(data){
            $('#timeboard').html(data);
            window.setTimeout(getDateTime, 500);
        }
    });
};

var setBoxSize = function(){
    $('#mapCanvas').width(boxSize.width - (cms.util.isMSIE ? 1 : 0));
    $('#mapCanvas').height(boxSize.height - 27 - (cms.util.isMSIE ? 1 : 0));
    
};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var setLeftPanelSize = function(){
    var c = $('#leftPanel .titlebar').size();
    var topHeight = 165;
    $('#common_form').height(topHeight - 26);
    
    var totalHeight = boxSize.height - 25 * c - topHeight;
    $('#leftPanel .box-panel').height(totalHeight);
    $('#leftPanel .titlebar').css('cursor','pointer');
    $('#leftPanel .titlebar').click(function(){
        if($(this).next('.box-panel').is(":hidden")){
            $("#leftPanel .box-panel").slideUp('fast');
            $('#leftPanel .titlebar a').removeClass();
            $('#leftPanel .titlebar a').addClass('switch sw-close');
            $(this).next('.box-panel').animate({height: 'toggle', opacity: 'toggle'}, 'fast');
            $(this).find('a').removeClass();
            $(this).find('a').addClass('switch sw-open');
        }
    });
};

var getDepartment = function(obj, box){
    var urlparam = 'action=getDepartment&id=0';
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/controlcenter.aspx',
        data: urlparam,
        error: function(data){
            module.showDataError({html:data, width:400, height:250});
        },
        success: function(data){
            var jsondata = data.toJson();//eval('(' + data + ')');
            showDepartment(obj, box, jsondata.list);
        }
    });
};

var showDepartment = function(obj, box, depList){
    if(depList.length > 0){
        var depFirst = depList[0];
        new DropDownList(obj, 'dep', {parentId:0, data:depList, val: depFirst.id, text: depFirst.name, maxHeight:'110',width:'200',event:'focus', recursion:true}, box);
        $('#ddlDepartment1').hide();
    }
};

var showBuildInfo = function(){
    var arrType = [
        ['JCW','接触网'],
        ['BD','变电'],
        ['DL','电力']
    ];
    var strHtml = '<div id="workPlanList">';
    for(var i=0; i<arrType.length; i++){
        strHtml += '<div class="operbar" style="height:22px;text-align:left; text-indent:10px;" lang="open">'
            + '<a class="switch sw-' + (i > 0 ? 'close"' : 'open') + '" style="float:right;"></a>'
            + arrType[i][1] + '</div>'
            + '<div ' + (i > 0 ? ' style="display:none;"' : '') + '>'
            + '<div class="listheader">'
            + '<table class="tbheader" cellpadding="0" cellspacing="0">'
            + '<tr>'
            + '<td style="width:25px;">序号</td>'
            + '<td style="width:80px;">班组</td>'
            + '<td style="width:120px;">作业内容</td>'
            + '<td style="width:100px;">作业地点</td>'
            + '<td style="width:100px;">起止时间</td>'
            + '<td style="width:45px;">状态</td>'
            + '<td></td>'
            + '</tr>'
            + '</table>'
            + '</div>'
            + '<div id="divListBox_' + arrType[i][0] + '" class="listbox" style="overflow:auto;">'
            + '<table id="tbList_' + arrType[i][0] + '" class="tblist" cellpadding="0" cellspacing="0"></table>'
            + '</div>'
            + '</div>';
    }
    strHtml += '</div>';
    
    var config = {
        id: 'pwbuildinfo',
        title: '今日施工计划<span id="timeboard" style="font-weight:normal;line-height:22px;width:200px;float:right;margin-right:40px;"></span>',
        html: strHtml,
        width: 480,
        height: 265,
        minAble: true,
        //maxAble: true,
        showMinMax: true,
        minWidth: 350,
        minHeight: 24,
        noBottom: true,
        lock: false,
        position: 1,
        x: leftWidth + 8,
        y: 125
    };
    
    pwBuildInfo = cms.box.win(config);
    
    getDateTime();
    for(var i=0; i<arrType.length; i++){
        $('#divListBox_' + arrType[i][0]).height(260 - 22*3 - 24 - 23);
    }

    $('#workPlanList .operbar').click(function(){
        $("#workPlanList .operbar").next('div').hide();//slideUp('fast');
        $('#workPlanList .operbar a').addClass('switch sw-close');
        $(this).find('a').removeClass();
        $(this).find('a').addClass('switch sw-open');
        $(this).next('div').show();//animate({height: 'toggle', opacity: 'toggle'}, 'slow');
        /*
        $(this).find('a').removeClass();
        if($(this).prop('lang').equals('open')){
            $(this).find('a').addClass('switch sw-close');
            $(this).attr('lang', 'close');
        } else {
            $(this).find('a').addClass('switch sw-open');
            $(this).attr('lang', 'open');
        }
        */
    });
    
    buildinfo.initialBuildInfo(arrType);
};