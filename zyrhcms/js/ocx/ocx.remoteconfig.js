var cms = cms || {};
cms.ocx = cms.ocx || {};

/*以下为远程配置功能*/

/*
    获取视频参数
    szDevId: 设备序列号.
    iChannel: 设备通道号.
    iSubChann: 是否子通道,1-是  0-否
    返回: json格式的结果.
    {
        "result": 0, //0表示成功,其它表示错误码
        "msg": "OK", //错误描述
        "params": //参数
        {
            "stream_type": 0,
            "resolution": 0, 
            "pic_quality": 0, 
            "bitrate_type": 0, 
            "video_bitrate": 0,
            "max_bitrate": 0,
            "video_framerate": 0
            "interval_ibp_frame": 0,
            "interval_i_frame": 0
        }
    }
*/
cms.ocx.getVideoParams = function(ocx, szDevId, iChannel, iSubChann){
    if(ocx != null){
        return ocx.GetVideoParams(szDevId, iChannel, iSubChann);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置视频参数
    szDevId: 设备序列号
    iChannel: 设备通道号
    iSubChann: 是否子通道
    szParams: 视频参数,json格式:
    {
        "stream_type": 0,
        "resolution": 0, 
        "pic_quality": 0, 
        "bitrate_type": 0, 
        "video_bitrate": 0,
        "max_bitrate": 0,
        "video_framerate": 0
        "interval_ibp_frame": 0,
        "interval_i_frame": 0
    }
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.setVideoParams = function(ocx, szDevId, iChannel, iSubChann, szParams){
    if(ocx != null){
        return ocx.SetVideoParams(szDevId, iChannel, iSubChann, szParams);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取图像参数
    szDevId: 设备序列号.
    iChannel: 设备通道号.
    iSubChann: 是否子通道,1-是  0-否
    返回: json格式的结果.
    {
	    "result": 0, //0表示成功,其它表示错误码
	    "msg": ”OK”, //错误描述
	    "params": //参数
	    {
		    "channel_name": "",
		    "is_show_channel_name": true|false, 
		    "channel_name_x": 0, 
		    "channel_name_y": 0, 
		    "is_show_osd": true|false,
		    "osd_x": 0,
		    "osd_y": 0
		    "osd_type": 0,
		    "osd_attrib": 0,
		    "is_show_week": true|false
	    }
    }
*/
cms.ocx.getImageParams = function(ocx, szDevId, iChannel, iSubChann){
    if(ocx != null){
        return ocx.GetImageParams(szDevId, iChannel, iSubChann);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置图像参数
    szDevId: 设备序列号
    iChannel: 设备通道号
    iSubChann: 是否子通道
    szParams: 视频参数,json格式:
    {
        "channel_name": "",
        "is_show_channel_name": true|false, 
        "channel_name_x": 0, 
        "channel_name_y": 0, 
        "is_show_osd": true|false,
        "osd_x": 0,
        "osd_y": 0
        "osd_type": 0,
        "osd_attrib": 0,
        "is_show_week": true|false
        }
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.setImageParams = function(ocx, szDevId, iChannel, iSubChann, szParams){
    if(ocx != null){
        return ocx.SetImageParams(szDevId, iChannel, iSubChann, szParams);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取设备参数
    szDevId: 设备序列号.
    返回: json格式的结果.
    {
	    "result": 0, //0表示成功,其它表示错误码
	    "msg": "OK", //错误描述
	    "params": //参数
	    {
		    "server_name": "",
		    "server_id": "", 
		    "recycle_record": 0, 
		    "server_type": "", 
		    "channel_num": 0,
		    "disk_num": 0,
		    "alarm_in_num": 0
		    "alarm_out_num": 0,
		    "rs232_num": 0,
		    "rs485_num": 0,
		    "network_port_num": 0,
		    "auxout_num": 0,
		    "audio_num": 0,
		    "serial_number": "",
		    "major_scale": 0,
		    "minor_scale": 0
	    }
    }
*/
cms.ocx.getDeviceParams = function(ocx, szDevId){
    if(ocx != null){
        return ocx.GetDeviceParams(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置设备参数
    szDevId: 设备序列号
    szParams:设备参数,json格式:
    {
	    "server_name": "",
	    "server_id": "", 
	    "recycle_record": 0, 
	    "server_type": "", 
	    "channel_num": 0,
	    "disk_num": 0,
	    "alarm_in_num": 0
	    "alarm_out_num": 0,
	    "rs232_num": 0,
	    "rs485_num": 0,
	    "network_port_num": 0,
	    "auxout_num": 0,
	    "audio_num": 0,
	    "serial_number": "",
	    "major_scale": 0,
	    "minor_scale": 0
    }
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.setDeviceParams = function(ocx, szDevId, szParams){
    if(ocx != null){
        return ocx.SetDeviceParams(szDevId, szParams);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取设备版本信息
    szDevId: 设备序列号.
    返回: json格式的结果.
    {
        "result": 0, //0表示成功,其它表示错误码
        "msg": "OK", //错误描述
        "params": //参数
        {
            "software": "",
            "dsp_software": "", 
            "panel": "",
            "hardware": ""
        }
    }
*/
cms.ocx.getDeviceVersion = function(ocx, szDevId){
    if(ocx != null){
        return ocx.GetDeviceVersion(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取设备信息
    szDevId: 设备序列号.
    返回: json格式的结果.
    {
        "result": 0, //0表示成功,其它表示错误码
        "msg": "OK", //错误描述
        "params": //参数
        {
            "channel_number": 0,
            "channel_amount": 0, 
            "dvr_type": 0,
            "disk_number": 0,
            "serial_number": "",
            "alarm_in_num": 0,
            "alarm_in_amount": 0,
            "alarm_out_num": 0,
            "alarm_out_amount": 0,
            "start_channel": 0,
            "audio_channel_num": 0,
            "max_digit_chann_num": 0,
            "audio_enc_type": 0,
            "sim_card_sn": "",
            "sim_card_phone": ""
        }
    }
*/
cms.ocx.getDeviceInfo = function(ocx, szDevId){
    if(ocx != null){
        return ocx.GetDeviceInfo(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    重启设备
    szDevId: 设备序列号
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.reboot = function(ocx, szDevId){
    if(ocx != null){
        return ocx.Reboot(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    恢复出厂设置
    szDevId: 设备序列号.
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.resume = function(ocx, szDevId){
    if(ocx != null){
        return ocx.Resume(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    格式化磁盘
    szDevId: 设备序列号
    iDiskNo: 磁盘编号
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.resume = function(ocx, szDevId, iDiskNo){
    if(ocx != null){
        return ocx.FormatDisk(szDevId, iDiskNo);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取格式化进度
    szDevId: 设备序列号
    iDiskNo: 磁盘编号
    返回: json格式
    {
        "result": 0, //0表示成功,其它表示错误码
        "msg": "OK", //错误描述
        "params": //参数
        {
            "disk_no": 0,
            "format_state": 0,
            "progress": 0
        }
    }
*/
cms.ocx.getFormatProgress = function(ocx, szDevId){
    if(ocx != null){
        return ocx.GetFormatProgress(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取RS232参数
*/
cms.ocx.getRS232 = function(ocx, szDevId){
    if(ocx != null){
        return ocx.GetRS232(szDevId);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置RS232参数
*/
cms.ocx.setRS232 = function(ocx, szDevId, szParams){
    if(ocx != null){
        return ocx.SetRS232(szDevId, szParams);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    设置设备登录参数
    参数:
    szDevId: 设备序列号.
    szParams:Json格式
　　    {
　　          "lb_ip" : “127.0.0.1”,
　　          "lb_port" : 6660,
　　          " dev_id" : “”,
　　          " pwd" : “”
　       }
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.setLoginParams = function(ocx, szDevId, szParams){
    if(ocx != null){
        return ocx.SetLoginParams(szDevId, szParams);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    开始远程升级
    参数:
    szDevId: 设备序列号.
    szFileName: 本地升级文件,全路径
    返回: >=0表示句柄,<0表示失败
*/
cms.ocx.startUpgrade = function(ocx, szDevId, szFileName){
    if(ocx != null){
        return ocx.StartUpgrade(szDevId, szFileName);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    停止远程升级
    参数:
    iUpgrade: StartUpgrade返回的句柄
    返回: 0表示成功,返回其它表示错误码
*/
cms.ocx.stopUpgrade = function(ocx, iUpgrade){
    if(ocx != null){
        return ocx.StopUpgrade(iUpgrade);
    }
    return cms.ocx.ErrorCodeSupply[1][0];
};

/*
    获取升级状态
    参数:
    iUpgrade: StartUpgrade返回的句柄
    返回: Json格式
    {
	    “retval”:0,
	    “recv_len”:0
    }
*/
cms.ocx.getUpgradeStatus = function(ocx, iUpgrade){
    if(ocx != null){
        return ocx.GetUpgradeStatus(iUpgrade);
    }
    return cms.ocx.ErrorCodeSupply[1][0];

};