var cms = cms || {};
cms.ocx = cms.ocx || {};
cms.ocx.classId = '396C35AF-313A-4578-AEDF-0C4F18F0DB9E';
//限时预览提示时间
cms.ocx.playLimitNotify = 30;

cms.ocx.ErrorCode = [
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

cms.ocx.ErrorCodeSupply = [
    [-555, 'UNDEFINED', '接口无返回值'],
    [-5555, 'OCX_NOT_LOADED', '控件未加载'],
    [-55555, 'UNKNOWN_ERROR', '未知的错误代码']
];

cms.ocx.parseErrorCode = function(ecode){
    if('' === ecode){
        return [-55, '', '接口返回空值'];
    }
    if(ecode === undefined){
        return cms.ocx.ErrorCodeSupply[0];
    } else if(ecode === cms.ocx.ErrorCodeSupply[1][0]){
        return cms.ocx.ErrorCodeSupply[1];
    }
    var found = false;
    var high = cms.ocx.ErrorCode.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    while (!found && high >= low)
    {
        if (ecode === cms.ocx.ErrorCode[mid][0])
            found = true;
        else if (ecode < cms.ocx.ErrorCode[mid][0])
            high = mid - 1;
        else
            low = mid + 1;

        mid = parseInt((high + low) / 2, 10);
    }
    return found ? cms.ocx.ErrorCode[mid]: cms.ocx.ErrorCodeSupply[2];
};

cms.ocx.showErrorCode = function(ecode){
    var er = cms.ocx.parseErrorCode(ecode);
    return ecode + ': ' + er[1] + ', ' + er[2];
};

cms.ocx.checkNull = function(param, defaultVal){
    if(param == undefined){
        return defaultVal;
    }
    return param;
};

/*----------以下是OCX控件提供的函数方法----------*/


/*
    选择播放窗口
    参数:
    iWnd: 要选中的窗口编号, 编号范围:0-35
    返回: 返回更改前选中的窗口编号
*/
cms.ocx.setWindowSelect = function(ocx, iWnd){
    if(ocx != null){
        return ocx.Select(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取当前选择的窗口
    参数: 无
    返回: 返回选中的窗口编号, 编号范围:0-35
*/
cms.ocx.getWindowSelect = function(ocx){
    if(ocx != null){
        return ocx.GetSelect();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置窗口排列模式
    参数:
    iRank: 窗口排列模式,可以是以下几种模式: 1,4,6,8,9,10,12,16,25,36
    返回: 无意义，总是返回0
*/
cms.ocx.setWindowRank = function(ocx, iRank){
    if(ocx != null){
        return ocx.SetRank(iRank);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取窗口排列模式
    参数: 无
    返回: 窗口排列模式,可以是以下几种模式: 1,4,6,8,9,10,12,16,25,36
*/
cms.ocx.getWindowRank = function(ocx){
    if(ocx != null){
        return ocx.GetRank();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    登录WMP平台
    参数:
    szIp: wmp平台地址
    nPort: wmp平台端口
    szUser: wmp平台登录账户
    szPwd: wmp平台登录密码
    iLine: wmp平台登录线路
    nPlayLimit: 限时预览,单位:秒,0表示不限制
    nLimitNotify: 限时即将到时发送限时通知事件,单位:秒
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.login = function(ocx, szIp, nPort, szUser, szPwd, iLine, nPlayLimit, nLimitNotify){
    if(ocx != null){
        if(nLimitNotify == undefined){
            nLimitNotify = cms.ocx.playLimitNotify;
        }
        return ocx.Login(szIp, nPort, szUser, szPwd, iLine, nPlayLimit, nLimitNotify);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    注销WMP平台
    参数: 无
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.logout = function(ocx){
    if(ocx != null){
        return ocx.Logout();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
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
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.play = function(ocx, szDevId, iChannel, iSubChannel, iTransMode, iStreamCtrl, iDevLine){
    if(ocx != null){
        iSubChannel = cms.ocx.checkNull(iSubChannel, 1);
        iTransMode = cms.ocx.checkNull(iTransMode, 0);
        iStreamCtrl = cms.ocx.checkNull(iStreamCtrl, 0);
        iDevLine = cms.ocx.checkNull(iDevLine, 1);
        return ocx.Play(szDevId, iChannel, iSubChannel, iTransMode, iStreamCtrl, iDevLine);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    回放中心存储的录像
    描述: 从中心存储取流回放
    参数:
    szDevId: 设备序列号
    iChannel: 设备通道号
    szBeginTime: 预览开始时间 ,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    szEndTime: 预览结束时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    iRecFlag: 录像类型,0-表示定时录像
    nTotalSize: 文件总大小
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.playCentralRecord = function(ocx, szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize){
    if(ocx != null){
        return ocx.PlayCentralRecord(szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    回放设备的录像
    描述: 从设备下载录像文件进行回放，需要先登陆WMP平台
    [2014-05-11 修改]
    参数:
    szDeviceId: 设备序列号
    iChannel:设备通道号
    szFileName:设备上的录像文件名,可以通过QueryDevRecords获取.
    nOffset:开始回放的偏移字节数.
    nReadSize:播放的字节数(预留,暂不起作用)
    nTotalSize:文件总大小(字节)
    iSaveToCenter: 是否存储中心存储，0-不进行中心存储录像;1-按帧时间存入中心存储;2-按当前时间存入中心存储
    iDevLine:设备所在的线路号
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.playDevRecord = function(ocx, szDeviceId, iChannel, szFileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine){
    if(ocx != null){
        return ocx.PlayDevRecord(szDeviceId, iChannel, szFileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    停止在窗口上播放的视频流
    描述: 可以停止所有正在窗口上播放的视频流,包括:实时预览,中心存储回放,设备录像回放
    参数: 无
    返回:0表示成功,返回其它表示错误码
*/
cms.ocx.stop = function(ocx){
    if(ocx != null){
        return ocx.Stop();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
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
cms.ocx.ptzControl = function(ocx, iPtzCmd, iPtzAction, iPtzParam){
    if(ocx != null){
        return ocx.PtzControl(iPtzCmd, iPtzAction, iPtzParam);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    开启语音对讲
    参数:
    szDevId: 开启对讲的设备序列号
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.startAudioChat = function(ocx, szDevId, iAudioType){
    if(ocx != null){
        return ocx.StartAudioChat(szDevId, iAudioType);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    关闭语音对讲
    参数: 无
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.stopAudioChat = function(ocx){
    if(ocx != null){
        return ocx.StopAudioChat();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取正在播放的中心存储录像进度
    参数:
    iWnd: 窗口编号
    返回: >=0表示完成百分比,-1表示失败
*/
cms.ocx.getCentralProgress = function(ocx, iWnd){
    if(ocx != null){
        return ocx.GetCentralProgress(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取正在播放的设备录像进度
    参数:
    iWnd: 窗口编号
    返回: >=0表示完成百分比,-1表示失败
*/
cms.ocx.getDevProgress = function(ocx, iWnd){
    if(ocx != null){
        return ocx.GetDevProgress(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    搜索指定时间范围内中心存储中的录像片段
    参数:
    szDeviceId: 设备序列号
    iChannel: 设备通道号
    iFileType: 录像类型
    iOffset:文件数偏移(暂不支持,填0)
    iLimited:文件查询数量(目前接口不支持获取到数量,可以填一个较大的值,比如100)
    szBeginTime: 预览开始时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    szEndTime: 预览结束时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    返回: 
    Json格式的搜索结果.
    {
        "result": 0, //0表示成功,其它表示错误码
        "msg": "OK", //错误描述
        "params": //参数
        [
            {
                "seg_id": 123, //录像片段ID
                "rec_flag": 0, //录像片段类型
                "rec_len": 512000, //片段长度，单位:byte
                "begin_time": "2013-12-23 00:00:00", //开始时间
                "end_time": "2013-12-23 23:59:59" //结束时间
            },
            …
        ]
    }
*/
cms.ocx.queryCentralRecords = function(ocx, szDeviceId, iChannel, iFileType, iOffset, iLimited, szBeginTime, szEndTime){
debugger;
    if(ocx != null){
        return ocx.QueryCentralRecords(szDeviceId, iChannel, iFileType, iOffset, iLimited, szBeginTime, szEndTime);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    搜索指定时间范围内设备中的录像片段
    描述: 该方法需要先登录平台
    [2014-05-11 修改]
    参数:
    szDeviceId: 设备序列号
    iChannel: 设备通道号
    iFileType: 录像类型
    iOffset:文件数偏移(暂不支持,填0)
    iLimited:文件查询数量(目前接口不支持获取到数量,可以填一个较大的值,比如100)
    szBeginTime: 预览开始时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    szEndTime: 预览结束时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    返回: 
    Json格式的搜索结果.
    {
        "result":0,			//0表示成功,其它表示错误码
        "msg":"OK",			//错误描述
        "params":			//参数
        [
		    {
			    "file_name":"",
			    "channel":1,
			    "type":0,
			    "begin_time":"2013-12-28:00:00:00",
			    "end_time":"2013-12-28:00:00:00",
			    "size":5345000000		//字节
		    },
		    …
        ]
    }
*/
cms.ocx.queryDevRecords = function(ocx, szDeviceId, iChannel, iFileType, iOffset, iLimited, szBeginTime, szEndTime){
    if(ocx != null){
        if(iOffset == undefined){
            iOffset = 0;
        }
        if(iLimited == undefined){
            iLimited = 10;
        }
        return ocx.QueryDevRecords(szDeviceId, iChannel, iFileType, iOffset, iLimited, szBeginTime, szEndTime);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    开始下载中心存储录像
    描述: 文件存放在SetConfig指定的目录下
    参数:
    szDevId: 设备序列号
    iChannel:设备通道号
    szBeginTime:预览开始时间 ,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    szEndTime:预览结束时间,格式[YYYY-MM-DD HH:mm:SS] 位数必须补齐
    iRecFlag:录像类型,0-表示定时录像
    nTotalSize: 文件总大小
    返回: >=0表示成功返回下载句柄,-1表示错误
*/
cms.ocx.downloadCentralRecords = function(ocx, szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize){
    if(ocx != null){
        return ocx.DownloadCentralRecords(szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    开始下载设备录像文件
    描述: 文件存放在SetConfig指定的目录下
    [2014-05-11 修改]
    参数:
    szDevId:设备序列号
    iChannel:设备通道号
    szFileName:设备上的录像文件名,可以通过QueryDevRecords获得.
    nOffset:下载偏移字节数
    nReadSize:读取字节数,(预留,目前不起作用)
    nTotalSize:文件总大小
    iSaveToCenter: 是否存储中心存储，0-不进行中心存储录像;1-按帧时间存入中心存储;2-按当前时间存入中心存储
    iDevLine:设备所在的线路号
    返回: >=0表示成功返回下载句柄,-1表示错误
*/
cms.ocx.downloadDevRecords = function(ocx, szDevId, iChannel, szFileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine){
    if(ocx != null){
        return ocx.DownloadDevRecords(szDevId, iChannel, szFileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};


/*
    停止正在下载的文件
    描述: StopDownload可以停止指定句柄的下载任务,不用关心该句柄是设备下载还是中心存储下载
    参数:
    iDownloadHandle: DownloadCentralRecords或者DownloadDevRecords返回的下载句柄
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.stopDownload = function(ocx, iDownloadHandle){
    if(ocx != null){
        return ocx.StopDownload(iDownloadHandle);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取正在下载的任务进度
    描述: GetDownloadProgress可以查询指定句柄下载任务的进度,不用关心该句柄是设备下载还是中心存储下载
    参数:
    iDownloadHandle: DownloadCentralRecords或者DownloadDevRecords返回的下载句柄
    返回: >=0表示进度百分比,-1表示错误
*/
cms.ocx.getDownloadProgress = function(ocx, iDownloadHandle){
    if(ocx != null){
        return ocx.GetDownloadProgress(iDownloadHandle);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置本地目录配置
    描述: 本地目录用于存放录像和抓图文件
    参数:
    szConfig:
    {
	    "picdir": "", //图片存放目录
	    "recdir": "" //录像存放目录
    }
    返回: 无
*/
cms.ocx.setConfig = function(ocx, szConfig){
    if(ocx != null){
        return ocx.SetConfig(szConfig);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取本地目录配置
    参数: 无
    返回: {
	    "picdir": "", //图片存放目录
	    "recdir": "" //录像存放目录
    }
*/
cms.ocx.getConfig = function(ocx){
    if(ocx != null){
        return ocx.GetConfig();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置本地目录
    参数:
    picDir: 图片保存目录
    recDir: 录像保存目录
    返回: 无
*/
cms.ocx.setLocalPath = function(ocx, picDir, recDir){
    if(ocx != null){
        var szConfig = {
            "picdir": picDir,
            "recdir": recDir,
            "line": 1
        };
        return ocx.SetConfig(szConfig);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    抓图
    szDevId: 设备序列号.
    iChannel: 设备通道号
    szDir: 图片保存目录,如果为null,则使用SetLocalPath提供的目录.
    nFormat: 图片格式:
            JPEG_MODE_D1 = 2 //	D1 
            JPEG_MODE_CIF = 3 //	CIF
            JPEG_MODE_QCIF = 4 //	QCIF
    nQuality: 图片质量:
            JPEG_QUALITY_COMMON = 40 //	普通
            JPEG_QUALITY_BETTER = 60 //	较好
            JPEG_QUALITY_BEST = 80 //	最好
    返回: 0表示成功,返回其它表示错误码
*/
/*
cms.ocx.capture = function(ocx, szDevId, iChannel, szDir, nFormat, nQuality){
    if(ocx != null){
        return ocx.Capture(szDevId, iChannel, szDir, nFormat, nQuality);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};
*/
cms.ocx.capture = function(ocx, iWnd){
    if(ocx != null){
        return ocx.Capture(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    检查设备是否在线
    szDevId: 设备序列号
    返回: 1表示在线,0表示不在线,-1表示出错
*/
cms.ocx.checkOnline = function(ocx, szDevId){
    if(ocx != null){
        return ocx.CheckOnline(szDevId);
    }
};

/*
    获取图像信息
    szDevId: 设备序列号.
    iChannel: 设备通道号
    iSubChann: 1-子通道;0-主通道
    返回: {
        "result": 0, //0表示成功,其它表示错误码
        "msg": "OK", //错误描述
        "params": //参数
　　    {
　　          "brightness": 0,
　　          "hue": 0,
　　          "contrast": 0,
　　          "saturation": 0
       }
    }
*/
cms.ocx.getPicParams = function(ocx, szDevId, iChannel, iSubChann){
    if(ocx != null){
        return ocx.GetPicParams(szDevId, iChannel, iSubChann);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置图像信息
    szDevId: 设备序列号.
    iChannel: 设备通道号
    iSubChann: 1-子通道;0-主通道
    szParams:
　　{
        "brightness" : 0,
        "hue" : 0,
        "contrast" : 0,
        "saturation" : 0
   }
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.setPicParams = function(ocx, szDevId, iChannel, iSubChann, szParams){
    if(ocx != null){
        return ocx.SetPicParams(szDevId, iChannel, iSubChann, szParams);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
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
cms.ocx.setPreset = function(ocx, szDevId, iChannel, iAction, iPresetId, szPresetName){
    if(ocx != null){
        szPresetName = szPresetName || '';
        try{
            return ocx.SetPreset(szDevId, iChannel, iAction, iPresetId, szPresetName);
        }catch(e){
            return ocx.SetPreset(szDevId, iChannel, iAction, iPresetId);
        }
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    停止所有窗口上播放的视频流
    描述: 可以停止所有正在窗口上播放的视频流,包括:实时预览,中心存储回放,设备录像回放
    参数: 无
    返回:0表示成功,返回其它表示错误码
*/
cms.ocx.stopAll = function(ocx){
    if(ocx != null){
        return ocx.StopAll();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    停止所有录像下载任务
    参数:
    无
    返回: 无
*/
cms.ocx.stopAllDownload = function(ocx){
    if(ocx != null){
        return ocx.StopAllDownload();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置全屏
    参数: bFull:true-全屏;false-退出全屏
    返回: 无
*/
cms.ocx.setFullScreen = function(ocx, bFull){
    if(ocx != null){
        return ocx.SetFullScreen(bFull);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    检测是否全屏
    参数: 无
    返回: true-当前全屏;false-当前不是全屏
*/
cms.ocx.isFullScreen = function(ocx){
    if(ocx != null){
        return ocx.IsFullScreen();
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    启用右键菜单
    参数: bEnable:true-启用;false-禁用
    返回: 返回设置前状态
*/
cms.ocx.enableContextMenu = function(ocx, bEnable){
    if(ocx != null){
        return ocx.EnableContextMenu(bEnable);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    启用双击放大功能
    参数: bEnable:true-启用;false-禁用
    返回: 返回设置前状态
*/
cms.ocx.enableDblClick = function(ocx, bEnable){
    if(ocx != null){
        return ocx.EnableDblClick(bEnable);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    启用拖动窗口功能
    参数: bEnable:true-启用;false-禁用
    返回: 返回设置前状态
*/
cms.ocx.enableDrag = function(ocx, bEnable){
    if(ocx != null){
        return ocx.EnableDrag(bEnable);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    开启录像
    描述：对正在预览的窗口进行录像
    参数:
    iWnd: 窗口ID
    bStart: TRUE-开始录像;FALSE-停止录像
    返回:返回设置前状态
*/
cms.ocx.record = function(ocx, iWnd, bStart){
    if(ocx != null){
        return ocx.Record(iWnd, bStart);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    窗口是否正在录像
    描述：检查指定窗口是否正在录像
    参数:
    iWnd: 窗口ID
    返回:TRUE表示正在录像,FALSE表示没有录像
*/
cms.ocx.isRecording = function(ocx, iWnd){
    if(ocx != null){
        return ocx.IsRecording(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    开启播放复合流时的音频
    参数:
    iWnd: 窗口ID
    bEnable:1-表示开启;0-表示关闭
    返回:0表示成功,其他返回错误码
*/
cms.ocx.enableSound = function(ocx, iWnd, bEnable){
    if(ocx != null){
        return ocx.EnableSound(iWnd, bEnable);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    检查是否开启复合流音频
    参数:
    iWnd: 窗口ID
    返回:1-表示开启;0-表示未开启
*/
cms.ocx.isEnableSound = function(ocx, iWnd){
    if(ocx != null){
        return ocx.IsEnableSound(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置音频音量
    参数:
    iWnd: 窗口ID
    iVol: 取值0-0xFFFF
    返回: 0表示成功,其他返回错误码
*/
cms.ocx.setVolume = function(ocx, iWnd, iVol){
    if(ocx != null){
        return ocx.SetVolume(iWnd, iVol);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取音频音量
    参数:
    iWnd: 窗口ID
    返回: 音量值,取值0-0xFFFF
*/
cms.ocx.getVolume = function(ocx, iWnd){
    if(ocx != null){
        return ocx.GetVolume(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    清空限时预览时间,继续播放
    参数：
    iWnd: 窗口ID
*/
cms.ocx.keepPlaying = function(ocx, iWnd){
    if(ocx != null){
        return ocx.KeepPlaying(iWnd);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
报警类型
100-硬盘满;
101-硬盘错;
102;视频丢失;
103-视频制式不匹配;
201-视频遮挡;
202-移动侦测;
203-超速报警;
204-噪音报警;
300-报警输入;
301-报警输出
*/
cms.ocx.parseAlarmType = function(iAlarmType){
    switch(iAlarmType){
        case 100: return '硬盘满'; break;
        case 101: return '硬盘错'; break;
        case 102: return '视频丢失'; break;
        case 103: return '视频制式不匹配'; break;
        case 201: return '视频遮挡'; break;
        case 202: return '移动侦测'; break;
        case 203: return '超速报警'; break;
        case 204: return '噪音报警'; break;
        case 300: return '报警输入'; break;
        case 301: return '报警输出'; break;
        default: return '未知类型'; break;
    }
    return '-';
};