<?php
	$puid = @$_GET['puid'];
	$chan = @$_GET['chan'];
	$preset = @$_GET['preset'];
	$time = @$_GET['time'];
	$sequence = @$_GET['sequence'];
	
	if($puid != '' && $chan != ''){
		// 要写入的文件名字
		$logfilename = 'text.txt';
		// 写入的字符
		$word = $time.":".$puid."_".$chan."_".$preset."_".$sequence."\r\n";

		$fh = fopen($logfilename, "a");
		fwrite($fh, $word);
		fclose($fh);
	}

	if($preset == ""){
		$preset = "0001";
	}
	
	$FormatedDate 		= date("Ymd",strtotime($time));
	$FormatedWholeTime 	= date("YmdHis",strtotime($time));

	if($_SERVER["REQUEST_METHOD"]!="POST")
	{
		exit;
	}

	$host = $_SERVER['SERVER_NAME'];
	$port = 81;//$_SERVER['SERVER_PORT'];
	$url = "http://".$host.($port ? ":".$port : "")."/service/upload_pic.ashx";
	
	$check = file_get_contents($url."?action=check&puid=".$puid, false);
	if($check != '1'){
		exit;
	}
	
	//'userfile'为模拟表单的名称
	$f=&$HTTP_POST_FILES['userfile'];
	
	//获取客户端图片的名称
	$filename = $f['name'];

	$fh = fopen($logfilename, "a");
	fwrite($fh, $filename."\r\n");
	fclose($fh);
	
	//以下为获取通道号、后缀名
	$paramArray 	= explode("_",$filename);
	$tmpArray 		= explode(".",$paramArray[count($paramArray)-1]);
	$channelName 	= $tmpArray[0];
	$sufixName 		= $tmpArray[count($tmpArray)-1];
	
	//各个文件夹名称
	$folder_pic = "../../pic";
	$folder_date = $folder_pic."/".$FormatedDate;
	$folder_puid = $folder_date."/".$puid;
	
	$filepath = "pic/".$FormatedDate."/".$puid;
	
	//创建“日期”文件夹
	if( $folder_puid != "" )
	{
		if (!is_dir($folder_puid)) 
		{
			if (!mkdir($folder_puid, 0777,TRUE) || !chmod($folder_puid, 0777)) 
			{
 				//exit("创建保存目录失败");
			}
		}
	}	

	//设定上传目录/文件名date("YmdHis")
	//$picName = $FormatedWholeTime."_".$sequence."_".$puid."_".$chan.$preset.".jpg";
	$picName = sprintf("%s_%02d_%s_%02d_%04d.jpg",$FormatedWholeTime,$sequence,$puid,$chan,$preset);
	
	//$picName0 = sprintf("%s_%02d_%s_%02d",$FormatedWholeTime,$sequence,$puid,$chan);
	//$picName = $picName0."_".date("YmdHis").".jpg";
	
	$dest = $folder_puid."/".$picName;
	$filepath = $filepath."/".$picName;
	
	if( !move_uploaded_file($f['tmp_name'],$dest) )
	{
		//exit("失败!");
		//$folder_tmp = $folder_puid."/"."fail".date("YmdHis");
		//mkdir($folder_tmp, 0777,TRUE);
	}
	else
	{
		//设定上传的文件的属性
		chmod($dest, 0755);
	}
	//echo($filepath);
	
	$md5 = md5($filepath.$puid.$time);	
	$upload = file_get_contents($url."?action=upload&puid=".$puid."&chan=".$chan."&preset=".$preset."&time=".urlencode($time)."&sequence=".$sequence."&filepath=".urlencode($filepath).'&md5='.$md5);
	
	//$upload = '1';
	echo('<UploadResult><Result>'.($upload == '1' ? '0' : '-1').'</Result></UploadResult>');
?>
<?php
	exit;
?>