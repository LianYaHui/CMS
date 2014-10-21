<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">通道号：</td>
                <td>
                    <select id="ddlChannelId" class="select" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">波特率：</td>
                <td>
                    <select id="ddlBaudRate" class="select" style="width:206px;">
                        <option value="0">50</option>
                        <option value="1">75</option>
                        <option value="2">110</option>
                        <option value="3">150</option>
                        <option value="4">300</option>
                        <option value="5">600</option>
                        <option value="6">1200</option>
                        <option value="7">2400</option>
                        <option value="8">4800</option>
                        <option value="9">9600</option>
                        <option value="10">19200</option>
                        <option value="11">38400</option>
                        <option value="12">57600</option>
                        <option value="13">76800</option>
                        <option value="14">115.2K</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>数据位：</td>
                <td>
                    <select id="ddlDataBit" class="select" style="width:206px;">
                        <option value="0">5</option>
                        <option value="1">6</option>
                        <option value="2">7</option>
                        <option value="3">8</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>停止位：</td>
                <td>
                    <select id="ddlStopBit" class="select" style="width:206px;">
                        <option value="0">1</option>
                        <option value="1">2</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>校验类型：</td>
                <td>
                    <select id="ddlParity" class="select" style="width:206px;">
                        <option value="0">无校验</option>
                        <option value="1">奇校验</option>
                        <option value="2">偶校验</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>流控类型：</td>
                <td>
                    <select id="ddlFlowControl" class="select" style="width:206px;">
                        <option value="0">无</option>
                        <option value="1">软流控</option>
                        <option value="2">硬流控</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>解码器协议：</td>
                <td>
                    <select id="ddlDecoderType" class="select" style="width:206px;">                    
					    <option value="0">YOULI</option>
                        <option value="1">LILIN_1016</option>
                        <option value="2">LILIN_820</option>
                        <option value="3">PELCO-P</option>
                        <option value="4">DM_DynaColor</option>
                        <option value="5">HD600</option>
                        <option value="6">JC4116</option>
                        <option value="7">PELCO_DWX</option>
                        <option value="8" selected="selected">PELCO_D</option>
                        <option value="9">VCOM_VC_2000</option>
                        <option value="10">NETSTREAMER</option>
                        <option value="11">SAE_YAAN</option>
                        <option value="12">SAMSUNG</option>
                        <option value="13">Kalatel_312</option>
                        <option value="14">CELOTEX</option>
                        <option value="15">TLPELCO_P</option>
                        <option value="16">TL_HHX2000</option>
                        <option value="17">BBV</option>
                        <option value="18">RM110</option>
                        <option value="19">KC3360S</option>
                        <option value="20">ACES</option>
                        <option value="21">ALSON</option>
                        <option value="22">INV3609HD</option>
                        <option value="23">HOWELL</option>
                        <option value="24">TC_PELCO_P</option>
                        <option value="25">TC_PELCO_D</option>
                        <option value="26">AUTO_M</option>
                        <option value="27">AUTO_H</option>
                        <option value="28">ANTEN</option>
                        <option value="29">CHANGLIN</option>
                        <option value="30">DELTADOME</option>
                        <option value="31">XYM_12</option>
                        <option value="32">ADR8060</option>
                        <option value="33">EVI_D30</option>
                        <option value="34">Demo_Speed</option>
                        <option value="35">DM_PELCO_D</option>
                        <option value="36">ST_832</option>
                        <option value="37">LC_D2104</option>
                        <option value="38">HUNTER</option>
                        <option value="39">A01</option>
                        <option value="40">TECHWIN</option>
                        <option value="41">WEIHAN</option>
                        <option value="42">LG</option>
                        <option value="43">D_MAX</option>
                        <option value="44">PANASONIC</option>
                        <option value="45">KTD_348</option>
                        <option value="46">INFINOVA</option>
                        <option value="47">PIH_7625</option>
                        <option value="48">LCU</option>
                        <option value="49">DENNARD_DOME</option>
                        <option value="50">PHLIPS</option>
                        <option value="51">SAMPLE</option>
                        <option value="52">PLD</option>
                        <option value="53">PARCO</option>
                        <option value="54">HY</option>
                        <option value="55">NAIJIE</option>
                        <option value="56">CAT_KING</option>
                        <option value="57">YH_06</option>
                        <option value="58">SP9096X</option>
                        <option value="59">M_PANEL</option>
                        <option value="60">M_MV2050</option>
					    <option value="61">SAE_QUICK</option>
					    <option value="62">PEARMAIN</option>
				        <option value="63">NKO8G</option>
					    <option value="64">DH_CC440</option>
					    <option value="65">TX_CONTROL_232</option>
					    <option value="66">VCL_SPEED_DOME</option>
					    <option value="67">ST_2C160</option>
					    <option value="68">TDWY</option>
					    <option value="69">TWHC</option>
					    <option value="70">USNT</option>
					    <option value="71">KLT_NVD2200PS</option>
					    <option value="72">VIDO_B01</option>
					    <option value="73">LG_MULTIX</option>
					    <option value="74">ENKEL</option>
					    <option value="75">YT_PELCOD</option>
					    <option value="76">HIKVISION</option>
					    <option value="77">PE60</option>
					    <option value="78">LiAo</option>
					    <option value="79">NK16</option>
					    <option value="80">DaLi</option>
					    <option value="81">HN_4304</option>
					    <option value="82">VIDEOTEC</option>
					    <option value="83">HNDCB</option>
					    <option value="84">Lion_2007</option>
					    <option value="85">LG_LVC_C372</option>
					    <option value="86">Gold_Video</option>
					    <option value="87">NVD1600PS</option>
					    <option value="88">TC615P</option>
					    <option value="89">NANWANG</option>
					    <option value="90">NANWANG_1602</option>
					    <option value="91">SieMens </option>
					    <option value="92">WVCS850 </option>
					    <option value="93">PHLIPS_2</option>
					    <option value="94">PHLIPS_3</option>
					    <option value="95">AD</option>
					    <option value="96">TYCO_AD</option>
					    <option value="97">VICON</option>
					    <option value="98">TKC676</option>
					    <option value="99">YAAN_NEW</option>
					    <option value="100">DL_NVS_1Z</option>
					    <option value="101">I3_Z1200</option>
					    <option value="102">I3_Z2200 </option> 
                    </select>
                </td>
            </tr>
            <tr>
                <td>解码器地址：</td>
                <td>
                    <input type="text" id="txtDecoderAddrrss" class="txt w200" maxlength="16" />
                </td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', this);" lang="['复制到通道','取消复制']"><span class="w75">复制到通道</span></a>
        <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    remoteConfig.copyToChannel = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var chbName = pwReturn.returnValue.chbName;
        }
        pwobj.Hide();
    };
</script>