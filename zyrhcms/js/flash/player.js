var cms = cms || {};
cms.player = cms.player || {};

cms.player.ErrorCode = [
    [-1, 'ERROR', '未知错误'],
    [0, 'OK', '成功'],
    
    [1, 'REPEATED', '操作重复'],
    [2, 'NOT_INITED', '未初始化'],
    [3, 'NO_BIND_MOINTOR', '未绑定窗口'],
    [4, 'INVALID_PARAMS', '无效参数'],
    [5, 'UNSUPPORTED', '不支持的操作'],
    [6, 'CREATE_FILE_ERROR', '创建文件失败'],
    
    [100, 'CREATE_CU_ERROR', '创建CU失败'],
    [101, 'QUERY_LB_ERROR', '查询LB失败'],
    [102, 'REGISTER_ERROR', '注册失败'],
    [103, 'UNREGISTER_ERROR', '注销失败'],
    [104, 'OUT_OF_SERVICE', '没有登录'],
    [105, 'STARTSTREAM_ERROR', '取流失败'],

    [200, 'GET_PLAYPORT_ERROR', '获取播放库端口失败'],
    [201, 'AUDIO_PLAY_ERROR', '开启扬声器失败'],
    [202, 'AUDIO_IN_ERROR', '开启麦克风输入失败'],
    
    [300, 'CREATE_ERROR', '创建句柄失败'],
    [301, 'CONNECT_CSTORE_ERROR', '连接中心存储失败'],
    [302, 'OPEN_READHANDLE_ERROR', '打开读句柄失败'],
    [303, 'QUERY_SEGMENTS_ERROR', '查询片段失败'],
    [304, 'EOF', '播放结束'],
    [305, 'READ_HEADER_ERROR', '读取录像头失败'],
    [306, 'PLAYM4_ERROR', '初始化播放库失败'],
    
    [401, 'PLAY_DEV_FILE_ERROR', '播放设备录像失败'],
    [402, 'DOWNLOAD_DEV_FILE_ERROR', '下载设备录像失败']
];

cms.player.ErrorCodeSupply = [
    [-555, 'UNDEFINED', '接口无返回值'],
    [-5555, 'OCX_NOT_LOADED', '控件未加载'],
    [-55555, 'UNKNOWN_ERROR', '未知的错误代码']
];

cms.player.parseErrorCode = function(ecode){
    if('' === ecode){
        return [-55, '', '接口返回空值'];
    }
    if(ecode === undefined){
        return cms.player.ErrorCodeSupply[0];
    } else if(ecode === cms.player.ErrorCodeSupply[1][0]){
        return cms.player.ErrorCodeSupply[1];
    }
    var found = false;
    var high = cms.player.ErrorCode.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    while (!found && high >= low)
    {
        if (ecode === cms.player.ErrorCode[mid][0])
            found = true;
        else if (ecode < cms.player.ErrorCode[mid][0])
            high = mid - 1;
        else
            low = mid + 1;

        mid = parseInt((high + low) / 2, 10);
    }
    return found ? cms.player.ErrorCode[mid]: cms.player.ErrorCodeSupply[2];
};

cms.player.showErrorCode = function(ecode){
    var er = cms.player.parseErrorCode(ecode);
    return ecode + ': ' + er[1] + ', ' + er[2];
};

/*
    选择播放窗口
    参数:
    iWnd: 要选中的窗口编号, 编号范围:0-35
    返回: 返回更改前选中的窗口编号
*/
cms.player.setWindowSelect = function(obj, iWnd){
    if(obj != null){
        return obj.Select(iWnd);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    获取当前选择的窗口
    参数: 无
    返回: 返回选中的窗口编号, 编号范围:0-35
*/
cms.player.getWindowSelect = function(obj){
    if(obj != null){
        return obj.GetSelect();
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    设置窗口排列模式
    参数:
    iRank: 窗口排列模式,可以是以下几种模式: 1,4,6,8,9,10,12,16,25,36
    返回: 无意义，总是返回0
*/
cms.player.setWindowRank = function(obj, iRank){
    if(obj != null){
        return obj.SetRank(iRank);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    获取窗口排列模式
    参数: 无
    返回: 窗口排列模式,可以是以下几种模式: 1,4,6,8,9,10,12,16,25,36
*/
cms.player.getWindowRank = function(obj){
    if(obj != null){
        return obj.GetRank();
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    设置全屏
    参数: bFull:true-全屏;false-退出全屏
    返回: 无
*/
cms.player.setFullScreen = function(obj, bFull){
    if(obj != null){
        return obj.SetFullScreen(bFull);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    检测是否全屏
    参数: 无
    返回: true-当前全屏;false-当前不是全屏
*/
cms.player.isFullScreen = function(obj){
    if(obj != null){
        return obj.IsFullScreen();
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    启用右键菜单
    参数: bEnable:true-启用;false-禁用
    返回: 返回设置前状态
*/
cms.player.enableContextMenu = function(obj, bEnable){
    if(obj != null){
        return obj.RightClick(bEnable);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    启用双击放大功能
    参数: bEnable:true-启用;false-禁用
    返回: 返回设置前状态
*/
cms.player.enableDblClick = function(obj, bEnable){
    if(obj != null){
        return obj.DoubleClick(bEnable);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    启用拖动窗口功能
    参数: bEnable:true-启用;false-禁用
    返回: 返回设置前状态
*/
cms.player.enableDrag = function(obj, bEnable){
    if(obj != null){
        return obj.EnableDrag(bEnable);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    登录WMP平台
    参数:
    szWmpIp: wmp平台地址
    nWmpPort: wmp平台端口
    szUser: wmp平台登录账户
    szPwd: wmp平台登录密码
    iLine: wmp平台登录线路
    返回: 0表示成功,返回其它表示错误码
*/
cms.player.login = function(obj, szWmpIp, nWmpPort, szUser, szPwd, iLine){
    if(obj != null){
        //szUser += '_' + ('' + new Date().getTime()).substr(3);
        return obj.Login(szWmpIp, nWmpPort, szUser, szPwd, iLine);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    注销WMP平台
    参数: 无
    返回: 0表示成功,返回其它表示错误码
*/
cms.player.logout = function(obj){
    if(obj != null){
        return obj.Logout();
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    开启WMP设备实时预览
    描述: 预览基于WMP协议传输的设备
    参数:
    szDevId: 设备序列号
    iChannel: 设备通道号
    iSubChannel: 1-子通道,0-主通道
    iTransMode: 0-UDP,1-TCP
    iStreamCtrl: 流空模式是否启用,1-启用  0-不启用
    iDevLine: 设备线路ID
    rtmpUrl: rtmp地址（red5服务地址：rtmp://ip:1935/live）
    返回: 0表示成功,返回其它表示错误码
*/
cms.player.play = function(obj, szDevId, iChannel, iSubChannel, iTransMode, iStreamCtrl, iDevLine, rtmpUrl){
debugger;
    if(obj != null){
        iSubChannel = cms.player.checkNull(iSubChannel, 1);
        iTransMode = cms.player.checkNull(iTransMode, 0);
        iStreamCtrl = cms.player.checkNull(iStreamCtrl, 0);
        iDevLine = cms.player.checkNull(iDevLine, 1);
        rtmpUrl = cms.player.checkNull(rtmpUrl, FlashRtmpUrl);
        return obj.flashPlay(szDevId, iChannel, iSubChannel, iTransMode, iStreamCtrl, iDevLine, rtmpUrl);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

cms.player.checkNull = function(param, defaultVal){
    if(param == undefined){
        return defaultVal;
    }
    return param;
};

/*
    回放中心存储的录像
    描述: 从中心存储取流回放
    参数:
    szIp: 中心存储的地址
    nPort: 中心存储的端口
    szDeviceId: 设备序列号
    iChannelId: 设备通道号
    nRecFlag: 录像类型,0-表示定时录像
    szBeginTime: 预览开始时间 ,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    szEndTime: 预览结束时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    返回: 0表示成功,返回其它表示错误码
*/
cms.player.playCentralRecord = function(obj, szIp, nPort, szDeviceId, iChannelId, nRecFlag, szBeginTime, szEndTime){
    if(obj != null){
        return obj.PlayCentralRecord(szIp, nPort, szDeviceId, iChannelId, nRecFlag, szBeginTime, szEndTime);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    回放设备的录像
    描述: 从设备下载录像文件进行回放，需要先登陆WMP平台
    参数:
    szDeviceId: 设备序列号
    szFileName: 设备上的录像文件名,可以通过QueryDevRecords获取.
    iPercent: 开始播放的起始百分比
    返回: 0表示成功,返回其它表示错误码
*/
cms.player.playDevRecord = function(obj, szDeviceId, szFileName, iPercent){
    if(obj != null){
        return obj.PlayDevRecord(szDeviceId, szFileName, iPercent);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    停止在窗口上播放的视频流
    描述: 可以停止所有正在窗口上播放的视频流,包括:实时预览,中心存储回放,设备录像回放
    参数: 无
    返回:0表示成功,返回其它表示错误码
*/
cms.player.stop = function(obj){
    if(obj != null){
        return obj.Stop();
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    停止所有窗口上播放的视频流
    描述: 可以停止所有正在窗口上播放的视频流,包括:实时预览,中心存储回放,设备录像回放
    参数: 无
    返回:0表示成功,返回其它表示错误码
*/
cms.player.stopAll = function(obj){
    if(obj != null){
        return obj.StopAll();
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    云台控制
    描述: 该控制指令发送给当前选中的播放窗口
    参数: 无
    iPtzCmd: 云台命令
    PTZ_UP				    1		//上
　　PTZ_DOWN			    2		//下
　　PTZ_LEFT			    3		//左
　　PTZ_RIGHT			    4		//右
　　PTZ_UP_RIGHT			5		//右上
　　PTZ_RIGHT_DOWN			6		//右下
　　PTZ_DOWN_LEFT			7		//左下
　　PTZ_LEFT_UP			    8		//左上
　　PTZ_AUTO			    9		//自动

　　PTZ_ZOOMIN			    10		//放大
　　PTZ_ZOOMOUT			    11		//缩小
　　PTZ_FOCUS_NEAR			12		//聚焦
　　PTZ_FOCUS_FAR			13		//散焦
　　PTZ_DIAPHRAGM_ENLARGE	14		//光圈放大(变亮)
　　PTZ_DIAPHRAGM_SHRINK	15		//光圈缩小(变暗)
　　PTZ_WIPER   			16		//打开/关闭雨刷
　　PTZ_LIGHT   			17		//打开/关闭灯光
　　PTZ_HEAT			    18		//打开/关闭加热
    iPtzAction: 云台动作 1-开始，2-结束
    iPtzParam: 云台参数
    返回: 0表示成功,返回其它表示错误码
*/
cms.player.ptzControl = function(obj, iPtzCmd, iPtzAction, iPtzParam){
    if(obj != null){
        return obj.PtzControl(iPtzCmd, iPtzAction, iPtzParam);
    }
    return cms.player.ErrorCodeSupply[1][0];
};

/*
    设置预置点
    szDevId: 设备序列号.
    iChannel: 设备通道号
    iAction: 1-设置;2-删除;3-调用(OCX控件接口中增加了一个参数，合并3个接口为1个接口)
    iPresetId: 预置点编号
    szPresetName: 预置点名称
    返回: 0表示成功,返回其它表示错误码
    
    注意：2014-04-07 OCX控件 设置预置点接口增加1个参数iAction，合并3个接口为1个接口
*/
cms.player.setPreset = function(obj, szDevId, iChannel, iAction, iPresetId, szPresetName){
    if(obj != null){
        szPresetName = szPresetName || '';
        try{
            return obj.SetPreset(szDevId, iChannel, iAction, iPresetId, szPresetName);
        }catch(e){
            return obj.SetPreset(szDevId, iChannel, iAction, iPresetId);
        }
    }
    return cms.player.ErrorCodeSupply[1][0];
};