var flowControl = flowControl || {};
flowControl.config = flowControl.config || {};

flowControl.config.initialProcess = function(){
	var process = [
		{
			type: 1,
			picBoxSize: [580, 600],
			item: [
				{id: 1, pid: 0, sid: 0, name: '接触网设备故障信息', parent: 1, parentCssText: 'width:550px;',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}, loadInfo: true
				},
				{id: 2, pid: 1, sid: 1, name: '所亭跳闸数据', parentName: '分析设备故障信息', parent: 1, parentCssText: 'width:405px;float:left;',
				    form: {type:'textarea', enabled: true, size:['99%','60px']}, loadInfo: true
				},
				{id: 3, pid: 1, sid: 1, name: '外来安全信息', parentName: '分析设备故障信息', parent: 1, parentCssText: 'float:right;',
				    form: {type:'textarea', enabled: true, size:['99%','60px']}, loadInfo: true
				},
				{id: 4, pid: 2, sid: 2, name: '重合失败', parentName: '重合', parent: 1, parentCssText: 'float:left;', cssText: 'width:150px;'},
				{id: 5, pid: 2, sid: 2, name: '重合成功', parentName: '重合', parent: 1, parentCssText: 'float:right;', cssText: 'width:150px;'},
				{id: 6, pid: 4, sid: 4, name: '通知车间主任', cssText: 'width:150px;',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'CJZR',text: '通知车间主任'}
				},
				{id: 7, pid: 4, sid: 6, name: '汇报领导、安全及技术科长', parent: 1, parentCssText: 'width:240px;',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'ZGLD',text: '汇报主管领导'}
				},
				{id: 8, pid: 7, sid: 7, name: '试送失败', parentName: '试送', parent: 1, parentCssText: 'float:left;', cssText: 'width:145px;'},
				{id: 12, pid: 7, sid: 7, go: 15, direction: 2, name: '试送成功', parentName: '试送', cssText: 'float:right;'},
				{id: 9, pid: 8, sid: 8, name: '', sub: [
						{id: 0, pid:8, sid: 8, name: '数据分析', cssText: 'width:15px;margin-left:3px;'},
						{id: 0, pid:8, sid: 8,  name: '故障线路图纸等', cssText: 'width:15px;'},
						{id: 0, pid:8, sid: 8,  name: '故障区段视频', cssText: 'width:15px;'},
						{id: 0, pid:8, sid: 8,  name: '轨道车运行视频', cssText: 'width:15px;'},
						{id: 0, pid:8, sid: 8,  name: '汽车出动交通图', cssText: 'width:15px;'},
						{id: 0, pid:8, sid: 8,  name: '启动抢修预案', cssText: 'width:15px;',
				            form: {type:'textarea', size:['99%','80px'], request: 'YJYA',text: '启动应急预案', lock: false, winSize: [800, 500]}
				        }
					]
				},
				{id: 10, pid: 8, sid: 9, name: '', sub: [
						{id: 0, pid:8, sid: 9,  name: '人员到达时间', cssText: 'width:15px;margin-left:3px;',
				            form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				        },
						{id: 0, pid:8, sid: 9, name: '轨道车到达时间', cssText: 'width:15px;',
				            form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				        },
						{id: 0, pid:8, sid: 9, name: '现场负责人，反馈设备情况及时间', cssText: 'width:24px;',
				            form: {type:'textarea', enabled: true, size:['99%','60px']}
				        },
						{id: 0, pid:8, sid: 9, name: '预案实施过程', cssText: 'width:15px;',
				            form: {type:'textarea', enabled: true, size:['99%','80px']}
				        },
						{id: 0, pid:8, sid: 9, name: '恢复送电时间', cssText: 'width:15px;',
				            form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				        },
						{id: 0, pid:8, sid: 9, name: '采取的临时安保措施', cssText: 'width:15px;',
				            form: {type:'textarea', enabled: true, size:['99%','60px']}
				        }
					]
				},
				{id: 11, pid: 8, sid: 10, name: '事故故障统计库'},
				
				{id: 13, pid: 5, sid: 5, name: '通知车间主任',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'CJZR',text: '通知车间主任'}
				},
				{id: 14, pid: 5, sid: 13, name: '汇报领导、安全及技术科长',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'ZGLD',text: '汇报主管领导'}
				},
				{id: 15, pid: 5, sid: 14, name: '现场负责人',
				    form: {type:'textarea', enabled: true, size:['99%','60px']}
				},
				{id: 16, pid: 5, sid: 15, name: '查找过程情况',
				    form: {type:'textarea', enabled: true, size:['99%','60px']}
				},
				{id: 17, pid: 5, sid: 16, name: '查找结果',
				    form: {type:'textarea', enabled: true, size:['99%','60px']}
				},
				{id: 18, pid: 5, sid: 17, name: '跳闸统计库'},

				{id: 19, pid: 3, sid: 3, parent: 1, name: '启动应急措施',
		            form: {type:'textarea', size:['99%','80px'], request: 'YJYA',text: '启动应急预案', lock: false, winSize: [800, 500]}
		        },
				{id: 20, pid: 3, sid: 19, parent: 1, name: '通知车间主任及工班',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'CJZR',text: '通知车间主任'}
				},
				{id: 21, pid: 3, sid: 20, parent: 1, name: '汇报领导、安全及技术科长', cssText: 'width:120px;',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'ZGLD',text: '汇报领导'}
				},
				{id: 22, pid: 3, sid: 21, parent: 1, name: '应急措施实施情况',
		            form: {type:'textarea', enabled: true, size:['99%','80px']}
		        },
				{id: 23, pid: 3, sid: 22, name: '完成时间',
				    form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				}
			]
		},
		{
			type: 2,
			picBoxSize: [360, 600],
			cssText: 'width:180px;display:inline-block;',
			item: [
				{id: 1, pid: 0, sid: 0, name: '变电设备故障信息', cssText: 'width:150px;',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}, loadInfo: true
				},
				{id: 2, pid: 0, sid: 1, name: '汇报局电调',
				    form: {val: '汇报局电调'}
		        },
				{id: 3, pid: 0, sid: 2, name: '启动相应故障类型应急预案',
				    form: {type:'textarea', size:['99%','80px'], request: 'YJYA',text: '启动应急预案', lock: false, winSize: [800, 500]}
				},				
				{id: 4, pid: 0, sid: 3, name: '查看所亭主接线路',
				    form: {type:'textarea', size:['99%','80px'], request: 'ZJST',text: '查看所亭主接线路', lock: false, winSize: [700, 500]}
				},
				{id: 5, pid: 0, sid: 4, name: '查看一所一档资料',
				    form: {type:'textarea', size:['99%','80px'], request: 'YSYD',text: '查看一所一档资料', lock: false, winSize: [750, 500]}
				},
				{id: 6, pid: 0, sid: 5, name: '通知车间变电指导员及主任、检修车间主任', cssText: 'width:260px;',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'CJZR',text: '通知车间主任'}
				},
				{id: 7, pid: 0, sid: 6, name: '汇报主管领导、变电工程师、安全及技术科长', cssText: 'width:300px;',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'ZGLD',text: '汇报主管领导'}
				},
				{id: 8, pid: 0, sid: 7, name: '人员到达现场时间',
				    form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				},
				{id: 9, pid: 0, sid: 8, name: '确认详细故障情况',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}
				},
				{id: 10, pid: 0, sid: 9, name: '预案实施情况',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}
				},
				{id: 11, pid: 0, sid: 10, name: '恢复正常供电时间',
				    form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				}
			]
		},
		{
			type: 3,
			picBoxSize: [360, 600],
			cssText: 'width:200px;display:inline-block;',
			item: [
				{id: 1, pid: 0, sid: 0, name: '电力设备故障信息',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}, loadInfo: true
				},
				{id: 2, pid: 0, sid: 1, name: '远动断开的开关号1',
				    form: {type: 'text', size:['200px'], readonly: true, request: 'DKKG', text: '断开远动开关', winSize: [500, 320]}
				},
				{id: 3, pid: 0, sid: 2, name: '远动断开的开关号2',
				    form: {type: 'text', size:['200px'], readonly: true, request: 'DKKG', text: '断开远动开关', winSize: [500, 320]}
				},
				{id: 4, pid: 0, sid: 3, name: '电力故障区段',
				    form: {type: 'text', size:['300px'], readonly: true, request: 'GZQD', text: '确定故障区段', winSize: [500, 320]}
				},
				{id: 5, pid: 0, sid: 4, name: '通知车间主任及技术员',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'CJZR',text: '通知车间主任'}
				},
				{id: 6, pid: 0, sid: 5, name: '汇报主管领导、变电工程师、安全及技术科长', cssText: 'width:300px;',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'ZGLD',text: '汇报主管领导'}
				},
				{id: 7, pid: 0, sid: 6, name: '启动电力应急预案',
				    form: {type:'textarea', size:['99%','80px'], request: 'YJYA',text: '启动应急预案', lock: false, winSize: [800, 500]}
				},
				{id: 8, pid: 0, sid: 7, name: '查看电力线路图',
				    form: {type: 'textarea', size:['99%','80px'], readonly: true, request: 'DLJST',text: '查看电力线路图'}
				},
				{id: 9, pid: 0, sid: 8, name: '人员到达现场时间',
				    form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				},
				{id: 10, pid: 0, sid: 9, name: '预案实施情况',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}
				},
				{id: 11, pid: 0, sid: 10, name: '恢复正常供电时间',
				    form: {type: 'text', size:['240px'], readonly: true, request: 'DateTime', text: '选择时间', winSize: [300, 200], lock: false}
				},
				{id: 12, pid: 0, sid: 11, name: '设备故障情况',
				    form: {type:'textarea', enabled: true, size:['99%','80px']}
				}
			]
		}
	];
	
	return process;
};

flowControl.config.getChartBoxSize = function(type){
    var process = flowControl.config.initialProcess();
    for(var i=0; i<process.length; i++){
        if(type == process[i].type){
            return process[i].picBoxSize;
        }
    }
    return [500, 500];
};