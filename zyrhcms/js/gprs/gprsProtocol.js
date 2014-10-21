var gprsProtocol = gprsProtocol || {};

gprsProtocol.webProtocolErrorCode = function(code){
    var strError = '';
    switch(code){
        case '101':
            strError = '下发失败，设备离线';
            break;
        case '102':
            strError = '下发失败，下发协议格式错误';
            break;
        case '103':
            strError = '下发失败，协议参数格式错误';
            break;
        case '201':
            strError = '设备回复超时';
            break;
        case '202':
            strError = '回复失败，回复协议格式错误';
            break;
        case '203':
            strError = '回复成功，下发协议格式错误';
            break;
        case '204':
            strError = '回复成功，设备执行失败';
            break;
    }
    return strError;
}