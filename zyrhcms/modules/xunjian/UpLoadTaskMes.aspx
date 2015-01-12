<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UpLoadTaskMes.aspx.cs" Inherits="modules_xunjian_UpLoadTaskMes" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>


    <link href="<%=Public.WebDir%>/modules/xunjian/jPlayer/skin/blue.monday/jplayer.blue.monday.css" rel="stylesheet" />
    <script src="<%=Public.WebDir%>/modules/xunjian/jPlayer/dist/jplayer/jquery.jplayer.min.js"></script>
    <script src="<%=Public.WebDir%>/modules/xunjian/jPlayer/dist/add-on/jplayer.playlist.js"></script>

    <form id="form1" class="margin5" runat="server">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <h3>上报故障等级</h3>
                    <hr />
                </div>
            </div>

            <div class="padding10">
            </div>
            <div class="row">
                <div class="col-md-12" runat="server" id="upLevel">
                </div>
            </div>


            <div class="row">
                <div class="col-md-12">
                    <h3>上报文本信息</h3>
                    <hr />
                </div>
            </div>
            <div class="padding10">
            </div>
            <div class="row">
                <div class="col-md-12" runat="server" id="upTextDiv">
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <h3>评价</h3>
                    <hr />
                </div>
            </div>
            <div class="padding10">
            </div>
            <div class="row">
                <div class="col-md-12" runat="server" id="sp_leaderDesc">
                </div>
            </div>

            <div class="margin5">
            </div>

            <div class="row">
                <div class="col-md-12">
                    <h3>图片</h3>
                    <hr />
                </div>
            </div>
            <div class="padding10">
            </div>
            <div class="row">
                <%=ImageHtml %>
            </div>
            <div class="margin5">
            </div>
            <div class="row">
                <div class="col-md-12">
                    <h3>录音</h3>
                    <hr />
                </div>
            </div>
            <div class="padding10">
            </div>
            <div class="row">
                <div class="col-md-12" id="audio_div">
                    <div id="audio_div_player" class="jp-jplayer"></div>
                    <div id="audio_div_player_container" class="jp-audio" role="application" aria-label="media player">
                        <div class="jp-type-playlist">
                            <div class="jp-gui jp-interface">
                                <div class="jp-controls">
                                    <button class="jp-previous" role="button" tabindex="0">previous</button>
                                    <button class="jp-play" role="button" tabindex="0">play</button>
                                    <button class="jp-next" role="button" tabindex="0">next</button>
                                    <button class="jp-stop" role="button" tabindex="0">stop</button>
                                </div>
                                <div class="jp-progress">
                                    <div class="jp-seek-bar">
                                        <div class="jp-play-bar"></div>
                                    </div>
                                </div>
                                <div class="jp-volume-controls">
                                    <button class="jp-mute" role="button" tabindex="0">mute</button>
                                    <button class="jp-volume-max" role="button" tabindex="0">max volume</button>
                                    <div class="jp-volume-bar">
                                        <div class="jp-volume-bar-value"></div>
                                    </div>
                                </div>
                                <div class="jp-time-holder">
                                    <div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>
                                    <div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
                                </div>
                                <div class="jp-toggles">
                                    <button class="jp-repeat" role="button" tabindex="0">repeat</button>
                                </div>
                            </div>
                            <div class="jp-playlist">
                                <ul>
                                    <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div class="jp-no-solution">
                                <span>Update Required</span>
                                To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <p>音频下载列表</p>
                    <div id="div_Audio_down">
                        无
                    </div>
                </div>
            </div>
            <div class="margin5">
            </div>
            <div class="row">
                <div class="col-md-12">
                    <h3>视屏</h3>
                    <hr />
                </div>
            </div>
            <div class="padding10">
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div id="vidio_div" class="jp-video jp-video-270p" role="application" aria-label="media player">
                        <div class="jp-type-playlist">
                            <div id="vidio_div_player" class="jp-jplayer"></div>
                            <div class="jp-gui">
                                <div class="jp-video-play">
                                    <button class="jp-video-play-icon" role="button" tabindex="0">play</button>
                                </div>
                                <div class="jp-interface">
                                    <div class="jp-progress">
                                        <div class="jp-seek-bar">
                                            <div class="jp-play-bar"></div>
                                        </div>
                                    </div>
                                    <div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>
                                    <div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
                                    <div class="jp-controls-holder">
                                        <div class="jp-controls">
                                            <button class="jp-previous" role="button" tabindex="0">previous</button>
                                            <button class="jp-play" role="button" tabindex="0">play</button>
                                            <button class="jp-next" role="button" tabindex="0">next</button>
                                            <button class="jp-stop" role="button" tabindex="0">stop</button>
                                        </div>
                                        <div class="jp-volume-controls">
                                            <button class="jp-mute" role="button" tabindex="0">mute</button>
                                            <button class="jp-volume-max" role="button" tabindex="0">max volume</button>
                                            <div class="jp-volume-bar">
                                                <div class="jp-volume-bar-value"></div>
                                            </div>
                                        </div>
                                        <div class="jp-toggles">
                                            <button class="jp-repeat" role="button" tabindex="0">repeat</button>
                                            <button class="jp-shuffle" role="button" tabindex="0">shuffle</button>
                                            <button class="jp-full-screen" role="button" tabindex="0">full screen</button>
                                        </div>
                                    </div>
                                    <div class="jp-details">
                                        <div class="jp-title" aria-label="title">&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                            <div class="jp-playlist">
                                <ul>
                                    <!-- The method Playlist.displayPlaylist() uses this unordered list -->
                                    <li>&nbsp;</li>
                                </ul>
                            </div>
                            <div class="jp-no-solution">
                                <span>Update Required</span>
                                To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
	
                            </div>
                        </div>
                    </div>


                </div>

                <div class="col-md-12">
                    <p>视屏下载列表</p>
                    <div id="div_Vidio_down">无</div>
                </div>
            </div>
        </div>
        <script>
            $(document).ready(function () {
                var audio_url = <%=AudioUrl%>;
                var downHtml="";

                $.each(audio_url,function(i,a){
                    downHtml+=("<p><a href='"+a.mp3+"' target='_blank'>"+a.title+"</a></p>");
                });  
                if(!downHtml){
                    downHtml="没有上传音频";
                }

                $("#div_Audio_down").html(downHtml);

                new jPlayerPlaylist({
                    jPlayer: "#audio_div_player",
                    cssSelectorAncestor: "#audio_div_player_container"
                }, audio_url, {
                    swfPath: _path + "jPlayer/dist/jplayer",
                    supplied: "oga, mp3",
                    wmode: "window",
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true
                });



                var  vidio_url=<%=VidioUrl%>;

                var VidiodownHtml="";

                try
                {
                    $.each(audio_url,function(i,a){
                        VidiodownHtml+=("<p><a href='"+a.m4v+"' target='_blank'>"+a.title+"</a></p>");
                    });
                }catch(e){
                    
                }

                if(!VidiodownHtml){
                    VidiodownHtml="没有上传视频";
                }

                $("#div_Vidio_down").html(VidiodownHtml);



                new jPlayerPlaylist({
                    jPlayer: "#vidio_div_player",
                    cssSelectorAncestor: "#vidio_div"
                }, vidio_url, {
                    swfPath: "../../dist/jplayer",
                    supplied: "m4v,m4a,webmv,ogv,mp3",
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true
                });


            });
        </script>
    </form>
</body>
</html>

