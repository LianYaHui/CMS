<%@ Page Language="C#" AutoEventWireup="true" CodePage="65001" %>
<%@ Import namespace="System" %>
<%@ Import namespace="System.Collections" %>
<%@ Import namespace="System.Configuration" %>
<%@ Import namespace="System.Data" %>
<%@ Import namespace="System.Web" %>
<%@ Import namespace="System.Web.Security" %>
<%@ Import namespace="System.Web.UI" %>
<%@ Import namespace="System.Web.UI.HtmlControls" %>
<%@ Import namespace="System.Web.UI.WebControls" %>
<%@ Import namespace="System.Web.UI.WebControls.WebParts" %>
<%@ Import namespace="Zyrh.BLL" %>
<%@ Import namespace="Zyrh.Common" %>

<script runat="server">

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Charset = "UTF-8";
        Response.ContentType = "text/plain";
        
        if (!new UserCenter().CheckUserLogin())
        {
            this.Response.Redirect(Public.WebDir + Public.LoginUrl, false);
        }
        if (Config.ValidateUrlReferrer())
        {
            if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
            {
                Response.Write("{'err':'UrlReferrer Error','msg':'UrlReferrer Error'}");
                Response.End();
            }
        }

        ///上传文件目录，按模块分类存储
        string strDir = Request["dir"] != null ? Request["dir"].ToString() : string.Empty;
        strDir = strDir.Equals(string.Empty) ? string.Empty : strDir + "/";

        ///上传文件类型，分为：文件-files；插图-pics；
        string strType = Request["type"] != null ? Request["type"].ToString() : string.Empty;
        strType = strType.Equals(string.Empty) ? string.Empty : strType + "/";

        string strYear = DateTime.Now.ToString("yyyy");

        //表单文件域name
        string strInputName = "filedata";
        // 上传文件保存路径，结尾不要带/
        string strAttachDir = (Config.WebDir + Config.UploadFileDir + "/" + strDir + strType).Replace("//", "/");
        // 1:按天存入目录 2:按月存入目录 3:按扩展名存目录 5:不加年份日期子目录
        int dirType = Request["dt"] != null ? int.Parse(Request["dt"].ToString()) : 1;
        strAttachDir += dirType == 5 ? string.Empty : strYear;

        // 最大上传大小，默认是4M
        int maxAttachSize = 4194304;
        // 上传扩展名
        string strUpFileExt = "txt,rar,zip,jpg,jpeg,gif,png,swf,wmv,avi,wma,mp3,mid";
        //返回上传参数的格式：1，只返回url，2，返回参数数组
        int msgType = 2;
        //立即上传模式，仅为演示用
        string immediate = Request.QueryString["immediate"];
        // 统一转换为byte数组处理
        byte[] bytFile;
        string strLocalName = string.Empty;
        string strDisPosition = Request.ServerVariables["HTTP_CONTENT_DISPOSITION"];

        string strError = string.Empty;
        string strMsg = "''";

        if (strDisPosition != null)
        {
            // HTML5上传
            bytFile = Request.BinaryRead(Request.TotalBytes);
            // 读取原始文件名
            strLocalName = Regex.Match(strDisPosition, "filename=\"(.+?)\"").Groups[1].Value;
        }
        else
        {
            HttpFileCollection fileCollection = Request.Files;
            HttpPostedFile postedFile = fileCollection.Get(strInputName);

            // 读取原始文件名
            strLocalName = postedFile.FileName;
            // 初始化byte长度.
            bytFile = new Byte[postedFile.ContentLength];

            // 转换为byte类型
            System.IO.Stream stream = postedFile.InputStream;
            stream.Read(bytFile, 0, postedFile.ContentLength);
            stream.Close();

            fileCollection = null;
        }

        if (bytFile.Length == 0) strError = "无数据提交";
        else
        {
            if (bytFile.Length > maxAttachSize)
            {
                strError = "文件大小超过" + maxAttachSize + "字节";
            }
            else
            {
                string attach_dir, attach_subdir, strFilename, strExtension, strTarget;

                FileOperate fo = new FileOperate();
                FileExtension[] fx = new FileExtension[] { FileExtension.PNG, FileExtension.GIF, FileExtension.JPG };
                string strImgExt = "jpg,jpeg,gif,png";
                string strFileEx = FileOperate.ReadFileExtension(bytFile);

                // 取上载文件后缀名
                strExtension = GetFileExt(strLocalName);

                if (("," + strUpFileExt + ",").IndexOf("," + strExtension + ",") < 0)
                {
                    strError = "上传文件扩展名必需为：" + strUpFileExt;
                }
                else if (strImgExt.IndexOf(strExtension) >= 0 && !FileOperate.ValidateFileExtension(strFileEx, fx))
                {
                    strError = "图片文件格式错误：" + strImgExt;
                }
                else
                {
                    switch (dirType)
                    {
                        default:
                        case 1:
                            //attach_subdir = "day_" + DateTime.Now.ToString("yyMMdd");
                            attach_subdir = DateTime.Now.ToString("MMdd");
                            break;
                        case 2:
                            attach_subdir = "month_" + DateTime.Now.ToString("yyMM");
                            break;
                        case 3:
                            attach_subdir = "ext_" + strExtension;
                            break;
                        case 4:
                            attach_subdir = DateTime.Now.ToString("yyMM");
                            break;
                        case 5:
                            attach_subdir = string.Empty;
                            break;
                    }
                    attach_dir = strAttachDir + (attach_subdir.Equals(string.Empty) ? string.Empty : "/" + attach_subdir + "/");

                    // 生成随机文件名
                    Random random = new Random(DateTime.Now.Millisecond);
                    strFilename = DateTime.Now.ToString("yyyyMMddHHmmssfff") + random.Next(10, 99) + "." + strExtension;

                    strTarget = attach_dir + strFilename;
                    try
                    {
                        CreateFolder(Server.MapPath(attach_dir));

                        System.IO.FileStream fs = new System.IO.FileStream(Server.MapPath(strTarget), System.IO.FileMode.Create, System.IO.FileAccess.Write);
                        fs.Write(bytFile, 0, bytFile.Length);
                        fs.Flush();
                        fs.Close();
                    }
                    catch (Exception ex)
                    {
                        strError = ex.Message.ToString();
                    }

                    // 立即模式判断
                    if (immediate == "1") strTarget = "!" + strTarget;
                    strTarget = jsonString(strTarget);
                    if (msgType == 1) strMsg = "'" + strTarget + "'";
                    else strMsg = "{'url':'" + strTarget + "','localname':'" + jsonString(strLocalName) + "','id':'1'}";
                }
            }
        }

        bytFile = null;

        Response.Write("{'err':'" + jsonString(strError) + "','msg':" + strMsg + "}");
    }


    string jsonString(string str)
    {
        str = str.Replace("\\", "\\\\");
        str = str.Replace("/", "\\/");
        str = str.Replace("'", "\\'");
        return str;
    }

    string GetFileExt(string FullPath)
    {
        return !FullPath.Equals(string.Empty) ? FullPath.Substring(FullPath.LastIndexOf('.') + 1).ToLower() : string.Empty;
    }

    void CreateFolder(string FolderPath)
    {
        if (!System.IO.Directory.Exists(FolderPath))
        {
            System.IO.Directory.CreateDirectory(FolderPath);
        }
    }
    
</script>