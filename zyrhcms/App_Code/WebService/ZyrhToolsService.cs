using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.IO;
using Zyrh.Tools;
using Zyrh.Tools.Model;
using Zyrh.Tools.BLL;

/// <summary>
/// tools 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhToolsService")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhToolsService : System.Web.Services.WebService
{

    public ZyrhToolsService()
    {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod]
    public string GetSoundRecordFileDir()
    {
        try
        {
            string strDir = Server.MapPath(String.Format("{0}/{1}/", Public.WebDir, Public.SoundRecordFileDir).Replace("//", "/"));
            if (!Directory.Exists(strDir))
            {
                Directory.CreateDirectory(strDir);
            }
            return strDir;
        }
        catch (Exception ex) { return string.Empty; }
    }

    [WebMethod]
    public int AddSoundRecord(SoundRecordInfo[] lstInfo)
    {
        try
        {
            int count = 0;
            if (lstInfo.Length > 0)
            {
                SoundRecordManage srm = new SoundRecordManage(Public.ToolsDBConnectionString);
                string strTableName = string.Empty;
                foreach (SoundRecordInfo info in lstInfo)
                {
                    if (null == info || info.StartTime.Equals(string.Empty) || info.Duration ==0 || info.FilePath.Equals(string.Empty))
                    {
                        continue;
                    }
                    
                    DateTime dt = DateTime.Parse(info.StartTime);

                    strTableName = srm.BuildTableName(dt.ToString("yyyyMM"));

                    if (info.CreateTime.Equals(string.Empty))
                    {
                        info.CreateTime = Public.GetDateTime();
                    }
                    if (info.EndTime.Equals(string.Empty))
                    {
                        info.EndTime = dt.AddSeconds(info.Duration).ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    try
                    {
                        if (srm.CheckSoundFileLogIsExist(strTableName, info.FilePath) > 0)
                        {
                            continue;
                        }
                        count += srm.AddSoundRecord(strTableName, info).iResult;
                    }
                    catch (Exception exx)
                    {
                        srm.CreateSoundRecordTable(strTableName);
                        count += srm.AddSoundRecord(strTableName, info).iResult;
                    }
                }
            }
            return count;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return 0;
        }
    }

}