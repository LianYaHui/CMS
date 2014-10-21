cms.patrol = cms.patrol  || {};
cms.patrol.area = cms.patrol.area  || {};

cms.patrol.area.arrKeys = {name:'输入要查找的区域名称'};

cms.patrol.area.checkKeywords = function(objTxt){
    return $(objTxt).val() == cms.patrol.area.arrKeys.name;
}