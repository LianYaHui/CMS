var flowControl = flowControl || {};

flowControl.processConfig = [];
flowControl.eventConfig = [];
flowControl.formConfig = ['input', 'popwin'];
flowControl.arrPopWin = [];

flowControl.initialProcess = function(){
    var process = flowControl.config.initialProcess();
	flowControl.processConfig = process;
	return process;
};

flowControl.getProcess = function(type){
	for(var i=0,c=flowControl.processConfig.length; i<c; i++){
		if(type == flowControl.processConfig[i].type){
			return flowControl.processConfig[i];
		}
	}
	return null;
};

flowControl.getNextProcess = function(processItem, sid){
	var arr = [];
	for(var i=0,c=processItem.length; i<c; i++){
		if(sid == processItem[i].sid){
			arr.push(processItem[i]);
		}
	}
	return arr;
};

flowControl.getTargetProcess = function(processItem, id){
    var arr = [];
	for(var i=0,c=processItem.length; i<c; i++){
		if(id == processItem[i].id){
			arr.push(processItem[i]);
		}
	}
	return arr;
};

flowControl.getChild = function(process, pid){
	var arr = [];
	for(var i=0,c=process.length; i<c; i++){
		if(process[i].pid == undefined){
			return 'null';
		}
		if(parseInt(process[i].pid, 10) == pid){
			arr.push(process[i]);
		}
	}
	return arr;
};

flowControl.getEventProcess = function(type, id){
	var process = flowControl.getProcess(type);
	if(process != null){
		return process;
	}
	return null;
};

flowControl.showFlowChart = function(type, id, obj, process){
	if(process == undefined || process == null){
	    process = flowControl.getProcess(type);
	}
	if(process != null){
		flowControl.buildFlowChart(id, 0, process, obj, null, 0);
		
		flowControl.eventConfig.push({id: id, process: process});
	} else {
		//alert('没有找到相关的应急流程');
		cms.box.alert({title: '提示信息', html: '没有找到相关的应急流程配置，请检查流程配置或事件数据。'});
	}
};

flowControl.createElement = function(tag, id, strHtml, css, cssText, width, objParent){
	var obj = document.createElement(tag);
	if(css != undefined && css != null){
		obj.className = css;
	}
	if(id != undefined && id != null){
		obj.id = id;
	}	
	if(strHtml != undefined && strHtml != null){
		obj.innerHTML = strHtml;
		obj.title = cms.util.filterHtmlTag(strHtml);
	}			
	if(cssText != undefined && cssText != null){
		obj.style.cssText = cssText;
	}
	if(width != undefined && width != null){
		obj.style.width = width;
	}
	if(objParent != undefined && objParent != null){
		objParent.appendChild(obj);
	}
	return obj;
};

flowControl.createArrow = function(direction, objParent){
	var css = '';
	var cssText = '';
	switch(direction){
		case 1:
			css = 'arrow-up';
			break;
		case 2:
			css = 'arrow-right';
			cssText = 'float:right;';
			break;
		case 3:
			css = 'arrow-down';
			break;
		case 4:
			css = 'arrow-left';
			cssText = 'float:left;';
			break;
	}
	return flowControl.createElement('DIV', null, null, css, cssText, null, objParent);
};

flowControl.buildFlowChart = function(eid, pid, process, obj, subobj){
	if(process == null || process == undefined || process.item == undefined){
		return false;
	}
	var arr = flowControl.getChild(process.item, pid);
	var cssText = process.cssText != undefined ? process.cssText : '';
	var c = arr.length;
	for(var i=0; i<c; i++){
		var dr = arr[i];
		var id = dr.id;
		var sub = dr.sub;
		var switchItem = dr.switchItem;
		var parent = dr.parent;
		var arrow = dr.arrow;
		var next = dr.next;
		var objParent = obj;
		var strStep = '';
		var strHtml = sub != undefined ? '' : strStep + dr.name;

		if(subobj != undefined && subobj != null){
			objParent = subobj;
		}
		
		var fb = null;
		if(parent != undefined && parent > 0){
			var fbid = eid + '_' + dr.id;
			fb= flowControl.createElement('DIV', fbid, null, 'frame-box', dr.parentCssText, dr.width, objParent);
			
			objParent = fb;
		}
		// 第一个元素 或明确表示不需要指示箭头的 不加箭头
		if((pid > 0 || i > 0) && (arrow == undefined || arrow > 0)){
			var arrow = flowControl.createElement('DIV', null, null, 'arrow-down', null, null, objParent);
		}

		if(dr.direction != undefined && dr.direction > 0){
			var arrow = flowControl.createArrow(dr.direction, objParent);
		}

		if(sub != undefined){
			var p = flowControl.createElement('DIV', null, strHtml, 'sub-box', dr.subCssText || cssText, dr.width, objParent);
			for(var j=0,cc=sub.length; j<cc; j++){
				strHtml = strStep + sub[j].name;
				var sp = flowControl.createElement('DIV', null, strHtml, 'sub-item-box', sub[j].cssText, sub[j].width, p);
			}
		} else {
			var p = flowControl.createElement('DIV', null, strHtml, 'item-box', dr.cssText || cssText, dr.width, objParent);
		}
		if(next > 0){
			var arrow = flowControl.createElement('DIV', null, null, 'arrow-down', null, null, objParent);
		}
		delete dr;

		if(parent > 0){
		    flowControl.buildFlowChart(eid, parseInt(id), process, obj, fb);
		}
	}
};

flowControl.clearFlowChart = function(obj){
	try{
		var childs = obj.childNodes;
		for(var i=childs.length-1; i>=0; i--){
			obj.removeChild(childs[i]);
		}
	}catch(e){}
};

flowControl.getEventConfig = function(id){
	for(var i=0,c=flowControl.eventConfig.length; i<c; i++){
		if(id == flowControl.eventConfig[i].id){
			return flowControl.eventConfig[i];
		}
	}
	return null;
};

flowControl.processControl = function(eid, sid, btn, num){
	var objProcess = document.getElementById('divProcess_' + eid);
	var processItem = flowControl.getEventConfig(eid);
	
	var ev = safety.accident.getEvent(eid);
    var info = ev[1];
    var step = info.step;
    
    if(null != btn && step > 0){
        try{
            var strNum = num != undefined ? '_' + num : '';
            var icon = cms.util.$('icon_' + eid + '_' + step + strNum);
            var txtTime = cms.util.$('time_' + eid + '_' + step + strNum);
            var btnReturn = cms.util.$('btnReturn_' + eid + '_' + step);
            
            var rbSwitch = cms.util.$N('rbFlowControl_' + eid + '_' + step);
            var strSwitch = cms.util.getRadioCheckedValue('rbFlowControl_' + eid + '_' + step, '');
            var txtTitle = cms.util.$('txtFlowControlTitle_' + eid + '_' + step);
            var txtContent = cms.util.$('txtFlowControlContent_' + eid + '_' + step);
            if(rbSwitch.length > 0 && strSwitch.equals(string.empty)){
                cms.box.alert({title: '提示信息', html: '请选择第' + step + '步选项'});
                return false;
            }
            //alert(strSwitch + ',' + 'txtFlowControlContent_' + eid + '_' + step);
            if(rbSwitch.length > 0 && txtContent != null && 'hidden' == txtContent.type){
                txtContent.value = strSwitch;
            }
            
            if(txtContent != null && txtContent.type != 'hidden' && '' == txtContent.value.trim()){
                cms.box.alert({title: '提示信息', html: '第' + step + '步尚未完成'});
                return false;
            }
            
            var btnNext = cms.util.$N('btnNext_' + eid + '_' + step);
            for(var i=0; i<btnNext.length; i++){
                btnNext[i].style.display = 'none';
            }
            for(var i=0; i<rbSwitch.length; i++){
                rbSwitch[i].disabled = 'disabled';
            }

            if(btn != undefined && typeof btn == 'object'){
                btn.style.display = 'none';
                icon.style.display = 'inline-block';
                txtTime.value = '[' + new Date().toString() + ']';
                txtTime.style.display = '';
                btnReturn.style.display = '';
                if(txtContent != null){
                    //是否要禁用上一个步骤的内容更改
                    if(!txtContent.lang.equals('enabled')){
                        txtContent.readOnly = true;
                        txtContent.disabled = true;
                    }
	                var process = flowControl.getTargetProcess(processItem.process.item, sid);
                    if(process.length > 0 && process[0].sub != undefined){
                        for(var i=0; i<process[0].sub.length; i++){
                            var txtSubContent = cms.util.$('txtFlowControlContent_' + eid + '_' + step + '_' + i);
                            if(!txtSubContent.lang.equals('enabled')){
                                txtSubContent.readOnly = true;
                                txtSubContent.disabled = true;
                            }
                        }
                    }
                }
            }
        }catch(e){alert('e:' + e);}
    }
    
    if(1 == ev[1].over){
        return false;
    }
    if(null == btn && step > 0){
        return false;
    }
    
	var strHtml = '';
	var strName = '';
	var strParentName = '';
	var strId = '';
	var strBtnName = '';
	var strOnclick = '';
	var strReturnBtnId = 'btnReturn_' + eid + '_' + (step + 1);
	var strChecked = ' checked="checked" ';
	if(processItem != null){
	    var process = flowControl.getTargetProcess(processItem.process.item, sid);
		var c = process.length; 
	    
	    if(c > 0 && process[0].go != undefined){
	        process = flowControl.getTargetProcess(processItem.process.item, parseInt(process[0].go));
	    } else if(c > 0 && process[0].next != undefined){
	        process = flowControl.getTargetProcess(processItem.process.item, parseInt(process[0].next));
	    } else {
		    process = flowControl.getNextProcess(processItem.process.item, sid);
		}
		c = process.length;
		if(c > 0){
		    strHtml += '<div class="process-box" style="position:relative;">'
		    for(var i=0; i<c; i++){
		        strBtnName = 'btnNext_' + eid + '_' + (step + 1);
		        strOnclick = ' onclick="flowControl.returnStep(' + eid + ',' + step + ');" ';
		        
		        if(process[i].sub != undefined){
                    strHtml += '<b class="f-left" style="line-height:24px;">第' + (step + 1) + '步. ' + '</b>'
                        + '<input type="hidden" name="txtFlowControlTitle_' + eid + '" id="txtFlowControlTitle_' + eid + '_' + (step + 1) + '"'
                        + ' lang="' + (step + 1) + '" />'
                        + flowControl.showControlForm(eid, sid, (step + 1), -1, process[i].form, '', process[i].loadInfo);
                    
		            strHtml += '<div style="position:absolute;bottom:0;left:0;padding:0 5px 5px;">'
                        + '<i id="icon_' + eid + '_' + (step + 1) + '" class="icon-right f-left success-icon"></i>'
                        + '<input type="text" class="txt-time f-left" name="time_' + eid + '" id="time_' + eid + '_' + (step + 1) + '"'
                        + ' readonly="readonly" style="display:none;" />'
		                + '<a id="' + strReturnBtnId + '" ' + strOnclick + ' class="btn btnc22 f-left" style="display:none;"><span>还原</span></a>'
                        + '<a name="' + strBtnName + '" class="btn btnc22" onclick="flowControl.processControl(' + eid + ',' + process[i].id + ', this);">'
                        + '<span>下一步</span></a>'
                        + '</div>';
                        
                    var cc = process[i].sub.length;
                    
                    strHtml += '<div style="margin-bottom:25px;">';
		            for(var j=0; j<cc; j++){
		                strId = eid + '_' + (step + 1) + '_' + j;
		                strHtml += cc > 1 ? '<div class="sub-box" style="margin:0 0 2px;">' : '';
		                strHtml +=  '<b class="f-left" style="margin-right:20px;">' + (step + 1) + '.' + (j + 1) + ' ' + process[i].sub[j].name + '</b>'
		                    + '<input type="hidden" name="txtFlowControlTitle_' + eid + '" id="txtFlowControlTitle_' + eid + '_' + (step + 1) + '_' + j + '"'
		                    + ' lang="' + (step + 1) + '.' + j + '" value="' + process[i].sub[j].name + '" />'
                            + flowControl.showControlForm(eid, sid, (step + 1), j, process[i].sub[j].form, '', process[i].loadInfo)
		                    + '<i id="icon_' + strId + '" class="icon-right f-left" style="width:25px;height:22px;display:none;"></i>'
                            + '<input type="text" class="txt-time f-left" name="time_' + eid + '" id="time_' + strId + '" readonly="readonly" style="display:none;" />'
                            + '<a id="btnNext_' + strId +  '" class="btn btnc22" onclick="flowControl.finishSingleStep(' + eid + ',' + (step + 1) + ',' + j + ',this);">'
                            + '<span>完成</span></a>';
                        strHtml += cc > 1 ? '</div>' : '';
		            }
                    strHtml += '</div>';
		        } else {
		            if(c > 1){
		                //多选一
		                strId = eid + '_' + (step + 1) + '_' + i;
		                if(0 == i){
		                    strParentName = process[i].parentName != undefined ? process[i].parentName : '';
                            strHtml += '<b class="f-left" style="line-height:24px;">' + '第' + (step + 1) + '步. ' + strParentName + '' + '</b>';
                            strHtml += '<input type="hidden" name="txtFlowControlTitle_' + eid + '" id="txtFlowControlTitle_' + eid + '_' + (step + 1) + '" lang="' + (step + 1) + '" title="' + strParentName + '" />';
		                }
		                strHtml += '<label class="chb-label-nobg">'
		                    + '<input type="radio" class="chb" name="rbFlowControl_' + eid + '_' + (step + 1) + '" value="' + process[i].name + '" '
		                    + ' onclick="flowControl.switchNextStep(\'' + strBtnName + '\',' + eid + ',' + process[i].id + ',' + (step + 1) + ',this);" />'
		                    + process[i].name
		                    + '</label>';
		                if(i == c - 1){
                            strHtml += flowControl.showControlForm(eid, sid, (step + 1), -1, process[i].form, '', process[i].loadInfo)
                                + '<i id="icon_' + eid + '_' + (step + 1) + '" class="icon-right f-left success-icon"></i>'
                                + '<input type="text" class="txt-time f-left" name="time_' + eid + '" id="time_' + eid + '_' + (step + 1) + '" readonly="readonly" style="display:none;" />'
                                + '<a id="' + strReturnBtnId + '" ' + strOnclick + ' class="btn btnc22 f-left" style="display:none;"><span>还原</span></a>'
                                + '<a name="' + strBtnName + '" class="btn btnc22" onclick="flowControl.processControl(' + eid + ',' + process[i].id + ', this);">'
                                + '<span>下一步</span></a>';
		                }
		            } else {
		                strId = eid + '_' + (step + 1);
		                strName = '第' + (step + 1) + '步. ' +  process[i].name;
                        strHtml += '<b class="f-left" style="line-height:24px;margin-right:20px;">' + strName + '</b>'
                            + '<input type="hidden" name="txtFlowControlTitle_' + eid + '" id="txtFlowControlTitle_' + strId + '" value="' + process[i].name + '" lang="' + (step + 1) + '" />'
                            + flowControl.showControlForm(eid, sid, (step + 1), -1, process[i].form, '', process[i].loadInfo)
                            +'<i id="icon_' + strId + '" class="icon-right f-left success-icon"></i>'
                            + '<input type="text" class="txt-time f-left" name="time_' + eid + '" id="time_' + strId + '" readonly="readonly" style="display:none;" />'
                            + '<a id="' + strReturnBtnId + '" ' + strOnclick + ' class="btn btnc22 f-left" style="display:none;"><span>还原</span></a>'
                            + '<a name="' + strBtnName + '" class="btn btnc22" onclick="flowControl.processControl(' + eid + ',' + process[i].id + ', this);">'
                            + '<span>下一步</span></a>';
		            }
		        }
		    }
		    strHtml += '</div>';
		} else {
	        strHtml += '<div id="divReport_' + eid + '" style="text-align:center;margin:10px 0;">'
	            + '<a onclick="flowControl.buildReport(' + eid + ');" class="btn btnc30"><span class="w120">生成应急流程总结</span></a>'
	            + '</div>';
	    }
	}
	var obj = document.createElement('DIV');
	obj.id = 'flowControlStepBox_' + eid + '_' + step;
	
	obj.innerHTML = strHtml;
	objProcess.appendChild(obj);
		
    safety.accident.events[ev[0]].step++;
	return strHtml;
};

flowControl.returnStep = function(eid, num){
    var strHtml = 0 == num ? '重新开始将会清空所有已经完成的步骤，确定要重新开始吗？' : '确定要还原步骤到第' + (num + 1) + '步吗？';
    var config = {
        id: 'pwReturnStep',
        title: 0 == num ? '重新开始' : '步骤还原',
        html: strHtml,
        boxType: 'confirm',
        callBack: flowControl.returnStepCallBack,
        returnValue: {
            eid: eid,
            num: num
        }
    };
    
    var pw = cms.box.win(config);
    pw.Focus(2);
};

flowControl.returnStepCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var eid = pwReturn.returnValue.eid;
        var num = pwReturn.returnValue.num;
        
        var parent = cms.util.$('divProcess_' + eid);
	    var ev = safety.accident.getEvent(eid);
        var info = ev[1];
        var step = info.step;
        var childs = parent.childNodes;
        
        for(var i=step - 1; i>=num; i--){
            parent.removeChild(childs[i]);
        }
        safety.accident.events[ev[0]].step = num;
        
        if(0 == num){
            //重新开始步骤
            flowControl.processControl(eid, 0, null);
        } else {
            var btn = cms.util.$N('btnNext_' + eid + '_' + num);
            btn[0].click();
        }
        
        pwobj.Hide();    
    } else {
        pwobj.Hide();
    }
};

flowControl.finishSingleStep = function(id, step, num, btn){
    try{
        if(btn != undefined && typeof btn == 'object'){
            var icon = cms.util.$('icon_' + id + '_' + step + '_' + num);
            var time = cms.util.$('time_' + id + '_' + step + '_' + num);

            btn.style.display = 'none';
            icon.style.display = 'inline-block';
            time.value = '[' + new Date().toString() + ']';
            time.style.display = '';
        }
    }catch(e){}
};

flowControl.showControlForm = function(eid, sid, step, sub, form, action, isLoadInfo){
    var strHtml = '';
    var strId = 'txtFlowControlContent_' + eid + '_' + step + (-1 == sub ? '' : '_' + sub);
    var strName = 'txtFlowControlContent_' + eid;
    var val = '';
    var strDisplay = '';
    var strLang = '';
    if(form != undefined){
        var strReadonly = form.readonly ? ' readonly="readonly" ' : '';
        strLang = form.enabled ? 'enabled' : '';
        
        if(form.request != undefined){
            strDisplay = 'display:none;';
            strHtml += '<a class="btn btnc22" onclick="flowControl.showModuleControl(' + eid + ',' + step + ',' + sub + ',\'' + form.request + '\',\'' + form.action + '\',' + form.lock +(form.winSize != undefined ? ',' + form.winSize[0] + ',' + form.winSize[1] : '') + ');"><span>' + form.text + '</span></a>';
        }
        strHtml += '<div style="clear:both;">';
        if('textarea' == form.type){
            strHtml += '<textarea name="' + strName + '" lang="' + strLang + '" id="' + strId + '" ' + strReadonly + ' class="txt" style="width:' + form.size[0] + ';height:' + form.size[1] + ';margin-bottom:3px;' + strDisplay + '">'
                + '</textarea>';
        } else if('text' == form.type){
            strHtml += '<input type="text" name="' + strName + '" lang="' + strLang + '" id="' + strId + '" ' + strReadonly + ' class="txt" style="width:' + form.size[0] + ';margin-bottom:3px;' + strDisplay + '" />';  
        } else {
            val = form.val != undefined ? form.val : '';
            strHtml += '<input type="hidden"  name="' + strName + '" id="' + strId + '" class="txt" value="' + val + '" />';
        }
    } else {
        strHtml += '<div style="clear:both;">';
        strHtml += '<input type="hidden" name="' + strName + '" id="' + strId + '" class="txt" value="' + '" />';
    }
    strHtml += '</div>';
    
    if(isLoadInfo){
        //第一步，加载故障事件描述或标题
        window.setTimeout(flowControl.getEventDetail, 100, eid, strId);
    }
    return strHtml;
};

flowControl.switchNextStep = function(btnName, eid, sid, step, obj){
    var btn = cms.util.$N(btnName);
    cms.util.$('txtFlowControlTitle_' + eid + '_' + step).value = obj.value.trim();
    btn[0].onclick = function(){
        flowControl.processControl(eid, sid, this);
    }
};

flowControl.buildReport = function(eid){
    var objParent = cms.util.$('divProcessReport_' + eid);
    var arrTitle = cms.util.$N('txtFlowControlTitle_' + eid);
    var arrContent = cms.util.$N('txtFlowControlContent_' + eid);
    var arrTime = cms.util.$N('time_' + eid);
    var step = 0;
    var sub = -1;
    var strStep = '';
    var strTitle = '';
    var strContent = '';
    var strTime = '';
    var strTimeTitle = '';
    
    if(objParent.childNodes.length > 0){
        for(var i=0; i<objParent.childNodes.length; i++){
            objParent.removeChild(objParent.childNodes[i]);
        }
    }
    
    var strHtml = '<div><textarea class="txt" id="txtFlowControlReport_' + eid + '" style="width:99%;height:450px;">';
    for(var i=0; i<arrTitle.length; i++){
        strStep = arrTitle[i].lang != undefined ? arrTitle[i].lang : '';
        if(strStep != ''){
            step = strStep.split('.')[0];
            if(strStep.indexOf('.') > 0){
                sub = parseInt(strStep.split('.')[1], 10);
            } else {
                sub = -1;
            }
        }
        strStep = step >= 0 ? (sub >= 0 ? '<b>' + step + '.' + (sub + 1) + '</b> ' : '<b>第' + step + '步.</b> ') : '';
        strTitle = arrTitle[i].title.trim().equals('') ? '' : '<b>' + arrTitle[i].title + '</b>' + '</p><p>';
        
        if('hidden' == arrContent[i].type && arrContent[i].value == arrTitle[i].value){
            strContent = '';
        } else {
            strContent = arrContent[i].value.trim().equals('') ? '' : '<p>' + arrContent[i].value.replaceAll('\r\n', '<br />') + '</p>';
        }
        strTimeTitle = arrTime[i].title.trim().equals('') ? '未完成' : arrTime[i].title;
        strTime = '<p>' + (arrTime[i].value.trim().equals('') ? strTimeTitle : '完成时间：' + arrTime[i].value) + '</p>';
        
        strHtml += '<p>' + strStep + strTitle + '<b>' + arrTitle[i].value + '</b></p>' + strContent + strTime;
        
    }
    strHtml += '</textarea></div>';
    strHtml += '<div style="text-align:center;padding:5px 0 10px;">'
        + '<a onclick="flowControl.saveEventReport(' + eid + ', this);" lang="0" class="btn btnc30" style="float:left;"><span>确认，保存</span></a>'
        + '<span id="btnExportForm_' + eid + '" style="display:none;margin-left:5px;float:right;">'
        + '<a onclick="flowControl.exportContent(' + eid + ',1);" class="btn btnc30"><span>导出Word文档</span></a>'
        + '<a onclick="flowControl.exportContent(' + eid + ',2);" class="btn btnc30 m-l-5"><span>导出Excel文档</span></a>'
        + '<a onclick="flowControl.exportContent(' + eid + ',3);" class="btn btnc30 m-l-5"><span>导出Txt文档</span></a>'
        + '</span>'
        + '</div>';
        
    var obj = document.createElement('DIV');
    obj.innerHTML = strHtml;
    
    objParent.appendChild(obj);
    
    $('#txtFlowControlReport_' + eid).xheditor({skin:'o2007silver',tools:"my"}); 
};

flowControl.saveEventReport = function(eid, btn){
    var strName = '' + eid;
    var strContent = cms.util.$('txtFlowControlReport_' + eid).value;
    var urlparam = 'action=saveEventReport&eid=' + eid + '&name=' + escape(strName) + '&content=' + escape(strContent);
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/flowcontrol.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata =  eval('(' + data + ')');
            
            if(1 == jsondata.result){
                cms.box.alert({title: '提示', html: '保存成功'});
                
                var times = parseInt(btn.lang, 10);
                btn.lang = ++times;
                btn.childNodes[0].innerHTML = '第' + times + '次保存';
                cms.util.$('btnExportForm_' + eid).style.display = '';
            }
        }
    });
};

flowControl.exportContent = function(eid, docType){
    var strAction = 1 == docType ? 'exportWord' :  2 == docType ? 'exportExcel' : 'exportTxt';
    var handleURL = cms.util.path + '/ajax/flowcontrol.aspx?action=' + strAction + '&eid='+ eid + '&isIE=' + (cms.util.isMSIE ? 1 : 0);
    window.location.href = handleURL;
};

flowControl.showModuleControl = function(eid, step, sub, request, action, lock, w, h){
    var strSub = -1 == sub ? '' : '_' + sub;
    var strTitle = cms.util.$('txtFlowControlTitle_' + eid + '_' + step + strSub).value; //'应急流程控制';
    var strHtml = cms.util.path + '/modules/safety/control/control.aspx?request=' + request 
        + '&action=' + action + '&eid=' + eid + '&step=' + step + '&sub=' + sub;
    var config = {
        id: 'pwModuleControl_' + eid + '_' + step + strSub,
        title: strTitle,
        html: strHtml,
        boxType: 'window',
        requestType: 'iframe',
        noBottom: true,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        filter: false,
        width: 800,
        height: 500,
        zindex: 10010
    };
    if(lock != undefined){
        config.lock = lock;
    }
    if(w != undefined){
        config.width = w;
    }
    if(h != undefined){
        config.height = h;
    }
    
    var pw = cms.box.win(config);
    flowControl.arrPopWin.push({id: eid + '_' + step + strSub, obj: pw});
};

/*
    更新控件过程内容
    
    eid: 事件ID
    step: 当前步骤
    sub: 当前子步骤
    isClose: 是否关闭窗口
    dialogResult: 窗口结果，若为true则更新内容
    strResult: 内容结果
    isAppend: 是否追加内容
    isAppendPrefix: 是否追加前缀，一般是选择时间时加上标题前缀
*/
flowControl.updateControlValue = function(eid, step, sub, isClose, dialogResult, strResult, isAppend, isAppendPrefix){
    var strSub = -1 == sub ? '' : '_' + sub;    
    var pwobj = null;
    var idx = -1;
    for(var i=0,c=flowControl.arrPopWin.length; i<c; i++){
        if(flowControl.arrPopWin[i].id == eid + '_' + step + strSub){
            pwobj = flowControl.arrPopWin[i].obj;
            idx = i;
            break;
        }
    }
    
    if(dialogResult){
        var obj = cms.util.$('txtFlowControlContent_' + eid + '_' + step + strSub);
        if(isAppendPrefix){
            strResult = pwobj.config.title + '：' + strResult;        
        }
        if(isAppend){
            obj.value += strResult;
        } else {
            obj.value = strResult;
        }
        obj.style.display = '';
        if(sub >= 0){
            var btn = cms.util.$('btnNext_' + eid + '_' + step + '_' + sub);
            flowControl.finishSingleStep(eid, step, sub, btn);
        }
    }    
        
    if(isClose && pwobj != null){        
        pwobj.Hide();
        flowControl.arrPopWin.splice(idx, 1);
    }
};

flowControl.getEventDetail = function(eventId, objName){
    var obj = cms.util.$(objName);
    var urlparam = 'action=getSingleEvent&eventId=' + eventId;
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/flowcontrol.aspx',
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
                if(jsondata.info.eventDesc != ''){
                    obj.value = jsondata.info.eventDesc;
                } else {
                    obj.value = jsondata.info.eventName;
                }
                delete jsondata;
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};