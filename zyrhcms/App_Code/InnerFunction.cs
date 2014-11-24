using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data.MySqlClient;
using TaskBLL;

/// <summary>
/// InnerFunction 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
[System.Web.Script.Services.ScriptService]
public class InnerFunction : System.Web.Services.WebService
{
    FoxzyForMySql.MySqlManageUtil db = new FoxzyForMySql.MySqlManageUtil();

    public InnerFunction()
    {
        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public String SaveCode(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["ID"]);

        var code_count = db.CreateSelect()
            .From("CodeInfo")
            .Select("count(*)")
            .Where("Code= ?code and ID != ?id")
            .SetParameter("?code", info["Code"])
            .SetParameter("?id", id)
            .ExecuteScalar();

        if (Convert.ToInt32(code_count) > 0)
            return "已经存在Code值,请重新输入";


        if (id > 0)
        {
            db.CreateUpdate("CodeInfo")
                .SetDictionary(info)
                .Where("ID =" + id)
                .ExecuteNonQuery();
        }
        else
        {
            info.Add("createtime", DateTime.Now);
            db.CreateInsert("CodeInfo")
                 .SetDictionary(info)
                 .ExecuteNonQuery();
        }

        return "1";
    }

    [WebMethod]
    public int SavePatrolLine(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["line_id"]);

        if (id > 0)
        {

            db.CreateUpdate("patrol_line")
                .SetDictionary(info)
                .Where("line_id=" + id)
                .ExecuteNonQuery();

        }
        else
        {
            info.Add("create_time", DateTime.Now);
            db.CreateInsert("patrol_line")
                 .SetDictionary(info)
                 .ExecuteNonQuery();
        }

        return 1;
    }

    [WebMethod]
    public int SavePatrolType(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["type_id"]);


        if (id > 0)
        {
            db.CreateUpdate("patrol_point_type")
                .SetDictionary(info)
                .Where("type_id=" + id)
                .ExecuteNonQuery();
        }
        else
        {
            info.Add("is_delete", false);
            info.Add("create_time", DateTime.Now);

            db.CreateInsert("patrol_point_type")
                 .SetDictionary(info)
                 .ExecuteNonQuery();
        }

        return 1;
    }


    [WebMethod]
    public int SavePatrolPoint(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["point_id"]);

        if (id > 0)
        {
            db.CreateUpdate("patrol_point")
                .SetDictionary(info)
                .Where("point_id=" + id)
                .ExecuteNonQuery();
        }
        else
        {
            info.Add("is_delete", false);
            info.Add("create_time", DateTime.Now);
            info.Add("area_id", 0);

            db.CreateInsert("patrol_point")
                 .SetDictionary(info)
                 .ExecuteNonQuery();
        }

        return 1;
    }

    TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
    [WebMethod]
    public int DeleteTask(int id)
    {
        int execResult = bll.DeleteTask(id.ToString());
        return execResult;
    }


    [WebMethod]
    public int SaveTask(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["ID"]);




        if (id > 0)
        {
            db.CreateUpdate("inspectiontaskinfo")
                .SetDictionary(info)
                .Where("ID=" + id)
                .ExecuteNonQuery();
        }
        else
        {
            info.Add("isEnable", true);
            info.Add("CreateTime", DateTime.Now);
            info.Add("Grade", 0);

            info.Add("RoadId", 0);
            info.Add("TaskFaultID", 0);
            info.Add("taskLeave", 0);

            db.CreateInsert("inspectiontaskinfo")
                 .SetDictionary(info)
                 .ExecuteNonQuery();
        }

        return 1;
    }


    [WebMethod]
    public int SaveTaskDevice(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["tid"]);

        if (id > 0)
        {
            db.CreateUpdate("TaskDeviceInfo")
                .Set("isDelete=1,deleteTime=?time")
                .SetParameter("?time", DateTime.Now)
                .Where("TaskID=" + id)
                .ExecuteNonQuery();
        }

        var rowInfo = Convert.ToString(info["row"]).JsonStringToDictionary<List<Dictionary<String, Object>>>();

        foreach (var d in rowInfo)
        {
            d.Add("TaskID", id);
            d.Add("isDelete", false);
            d.Add("Create_time", DateTime.Now);

            //TODO 
            //add user

            db.CreateInsert("TaskDeviceInfo")
                .SetDictionary(d)
                .ExecuteNonQuery();
        }
        return 1;
    }

    [WebMethod]
    public int SaveLeaderDesc(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["ID"]);

        info.Add("descDate", DateTime.Now);
        info.Add("leaderName", "");

        return db.CreateUpdate("UserTaskMappingInfo")
            .SetDictionary(info)
            .Where("ID=" + id)
            .ExecuteNonQuery();
    }
}
