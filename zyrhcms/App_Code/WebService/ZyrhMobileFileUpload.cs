using System;
using System.Web;
using System.Collections;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.IO;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Common;

/// <summary>
/// ZyrhMobileFileUpload 的摘要说明
/// </summary>
[WebService(Namespace = "http://ZyrhMobileFileUpload/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhMobileFileUpload : System.Web.Services.WebService
{
    protected DeviceUploadFileManage ufm = new DeviceUploadFileManage(Public.PicDBConnectionString);

    private string strFileDir = "pic/";

    public ZyrhMobileFileUpload()
    {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        //return "Hello World";
        return strFileDir;
    }

    private string GetSubDir(string strFileName)
    {
        string[] arrName = strFileName.Split('_');
        if (arrName.Length < 2)
        {
            return string.Empty;
        }
        return String.Format("/{0}/{1}/", arrName[1].Substring(0, 8), arrName[0]);
    }
    
    private string GetFileDir(string strFileName)
    {
        return String.Format("/{0}/{1}/", this.strFileDir, this.GetSubDir(strFileName)).Replace("//", "/");
    }

    [WebMethod]
    public int UploadStatus(string strFileName, string strUserPwd)
    {
        string strFileDir = this.GetFileDir(strFileName);
        string strFilePath = Server.MapPath(String.Format("{0}/{1}/{2}", Config.WebDir, strFileDir, strFileName));

        if (File.Exists(strFilePath))
        {
            return 1;
        }
        if (File.Exists(strFilePath + ".tmp"))
        {
            return 0;
        }

        return -1;
    }

    [WebMethod(Description="参数说明：<br />strDevCode: 设备索引编号<br />fileType: 文件类型，0-图片，1-录像，2-录音"
        + "<br />strFileName: 文件名称（格式：设备编号_日期时间.扩展名）")]
    public int UploadStart(int fileType, string strFileName, string strUserPwd)
    {
        FileStream fs = null;
        try
        {
            string[] arrName = strFileName.Split('_');
            string strDevCode = arrName[0];
            string strMonth = arrName[1].Substring(0, 6);
            string strTableName = ufm.BuildUploadFileTableName(strMonth);
            string strFileDir = this.GetFileDir(strFileName);
            string strFilePath = strFileDir + strFileName;

            string strRealPath = Server.MapPath(String.Format("{0}/{1}/{2}", Config.WebDir, strFileDir, strFileName));

            if (!Directory.Exists(Server.MapPath(Config.WebDir + strFileDir)))
            {
                Directory.CreateDirectory(Server.MapPath(Config.WebDir + strFileDir));
            }
            fs = new FileStream(strRealPath + ".tmp", FileMode.OpenOrCreate);
            int fileSize = (int)fs.Length;

            DeviceUploadFileInfo info = new DeviceUploadFileInfo();
            info.DevCode = strDevCode;
            info.ChannelNo = 1;
            info.FileType = fileType;
            info.FilePath = strFilePath;
            info.IsFinished = 0;
            info.CreateTime = Public.GetDateTime();

            string strSql = ufm.BuildUploadFileInsertSql(strTableName, info);
            ufm.AddUploadFile(strSql);

            return fileSize;
        }
        catch (Exception e)
        {
            return -1;
        }
        finally
        {
            if (fs != null)
            {
                fs.Close();
            }
        }

    }

    [WebMethod]
    public int UploadContent(string strFileName, int position, string strBase64, string strUserPwd)
    {
        FileStream fs = null;
        try
        {
            string strFileDir = this.GetFileDir(strFileName);
            string strRealPath = Server.MapPath(String.Format("{0}/{1}/{2}", Config.WebDir, strFileDir, strFileName));

            fs = new FileStream(strRealPath + ".tmp", FileMode.Open);
            byte[] bytes = Convert.FromBase64String(strBase64);
            fs.Position = position;
            fs.Write(bytes, 0, bytes.Length);

            return (int)fs.Length;
        }
        catch (Exception e)
        {
            return -1;
        }
        finally
        {
            if (fs != null)
            {
                fs.Close();
            }
        }
    }
    [WebMethod]
    public int UploadFinish(string strFileName, int fileSize, string strUserPwd)
    {
        FileStream fs = null;
        try
        {
            string strMonth = strFileName.Split('_')[1].Substring(0, 6);
            string strTableName = ufm.BuildUploadFileTableName(strMonth);
            string strFileDir = this.GetFileDir(strFileName);
            string strFilePath = strFileDir + strFileName;
            string strRealPath = Server.MapPath(String.Format("{0}/{1}/{2}", Config.WebDir, strFileDir, strFileName));

            fs = new FileStream(strRealPath + ".tmp", FileMode.Open);

            if (fs.Length == fileSize)
            {
                fs.Close();
                fs = null;
                if (File.Exists(strRealPath))
                {
                    File.Delete(strRealPath);
                }
                File.Move(strRealPath + ".tmp", strRealPath);

                int fileId = ufm.GetUploadFileId(strTableName, strFilePath);
                int result = ufm.UpdateFileFinished(strTableName, fileId, 1, fileSize);

                return fileSize;
            }
            else
            {
                return -1;
            }
        }
        catch (Exception e)
        {
            return -1;
        }
        finally
        {
            if (fs != null)
            {
                fs.Close();
            }
        }
    }

}

