var cms = cms || {};
cms.jquery = cms.jquery || {};

cms.jquery.selectCheckBox = function(obj){
    var chbitems = $(obj + ' tr input[type="checkbox"]');
    chbitems.each(function(){
        if($(this).attr("checked") == 'checked'){
            $(this).attr("checked", false);
            $(this).parents('tr').removeClass('selected');
        }else{
            $(this).parents('tr').addClass('selected');
            $(this).attr("checked", true);
        }
    });
};

cms.jquery.getCheckBoxCheckedValue = function(obj){
    var arr = [];
    var chbitems = $(obj + ' input[type="checkbox"]');
    chbitems.each(function(){
        if($(this).is(":checked")){
            arr.push($(this).val());
        }
    });
    return arr.join(',');
};

cms.jquery.getCheckBoxChecked = function(obj){
    var arr = [];
    var chbitems = $(obj + ' input[type="checkbox"]:checked');
    return chbitems;
};

cms.jquery.isChecked = function(obj){
    return $(obj).attr("checked") == 'checked';
};

cms.jquery.buildTab = function(code, name, maxlen, tabContainerId, isClose, func, arrCss, contextmenu, style, closeText){
    var len = name.len();
    var strTitle = len > maxlen ? name : '';
    var strName = len > maxlen ? name.gbtrim(maxlen, '..') : name;
    if(tabContainerId.indexOf('#') != 0) tabContainerId = '#' + tabContainerId;
    var css = arrCss || (isClose ? ['tab-c', 'cur-c'] : ['tab', 'cur']);
    if(isClose){
        if(closeText == undefined){
            closeText = '关闭';
        }
        var strFunc = '(event, \'' + code + '\');';
        func = func == undefined || func == '' ? 'delTab' + strFunc : func.indexOf('(') < 0 ? func + strFunc : func;
    }
    var strStyle = style != undefined ? ' style="' + style + '"':'';
    var strTab = '<a class="' + css[0] + '" lang="' + code + '" rel="' + tabContainerId + '"'
        + (contextmenu != undefined && contextmenu != null ? ' oncontextmenu="' + contextmenu + '"' : '')
        + ' onselectstart="return false" unselectable="on" '
        + '>'
        + '<span title="' + strTitle + '" lang="' + css[0] + ',' + css[1] + '"' + strStyle + '>' + strName + '</span>'
        + (isClose ? '<i class="c" title="' + closeText + '" onclick="' + func + '"></i>' : '')
        + '</a>';
    return strTab;
};

cms.jquery.tabs = function(tab, tabContainer, containerList, func){
    if(containerList == undefined){
        containerList = '.tabcon';
    }
    $(tab + ' a').click(function(){
        $(tab + ' a').removeClass();
        $.each($(tab + ' a'), function(){
            $(this).addClass($(this).children('span').eq(0).prop('lang').split(',')[0] || 'tab');
        });
        $(this).addClass($(this).children('span').eq(0).prop('lang').split(',')[1] || 'cur');
        
        var container = $(this).prop('rel');
        if(containerList != null){
            var parent = tabContainer != null && tabContainer != undefined ? tabContainer : '';
            $(parent + ' ' + containerList).hide();

            if(container != ''){
                $(parent + ' ' + container).show();
            }
        }

        if(func != undefined && func != ''){
            eval(func)({action:$(this).prop('lang'), container:container });
        }
    });
};

cms.jquery.tabSwitch = function(tab, i){
    $(tab + ' a').eq(i).click();
};

cms.jquery.getTabItem = function(tabs, code){
    var idx = -1;
    $.each(tabs, function(i, o){
        if(o.code == code){
            idx = i;
            return false;
        }
    });
    return idx;
};

cms.jquery.getTabWidth = function(objTabBox, maxWidth){
    var total = 0;
    var w = 0;
    var list = objTabBox.children();
    var c = list.length;
    for(var i=0; i<c; i++){
        w = list.eq(i).width();
        total += w;
    }
    total += c*3 + 14;
    if(total <= maxWidth){
        return maxWidth;
    }
    return total;
};

cms.jquery.scrollSync = function(obj, objSync) {
    $(objSync).scrollLeft($(obj).scrollLeft());
};


$(function(){   
    window.recycler = (function() {     
        var t = document.createElement('div');     
        t.id  = 'recycler';     
        return t;     
    })();    
  
    jQuery.fn.extend({   
        freeMemory: function() {   
            var jel = $(this);   
            jel.unbind();   
            var cld = jel.children(),   
                len = cld.size();   
            if (len) {   
                $.each(cld, $.freeMemory);   
            }   
            var rel = jel.get(0);   
            if (rel && window.recycler){   
                window.recycler.appendChild(rel);   
                window.recycler.innerHTML = '';   
            }   
            delete rel; rel = null;   
            delete len; len = null;   
            delete cld; cld = null;   
            delete jel; jel = null;   
        },  
  
        html2: function(value, raw) {   
            if ((typeof raw === 'undefined' || typeof raw === 'Undefined' || !raw) && typeof value === 'string') {   
                this.children().each(jQuery.freeMemory);   
                if (this[0] && typeof this[0].innerHTML != 'undefined' && typeof this[0].innerHTML != 'Undefined') {   
                    this[0].innerHTML = value;   
                    delete value; value = null;   
                    return this;   
                }   
            }   
        return value === undefined ? (this[0] ? this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g, "") : null) : this.empty().append( value );   
        }  
    });   
});  