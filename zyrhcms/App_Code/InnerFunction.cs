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
    public int SaveTask(String json)
    {
        return 0;
    }

    [WebMethod]
    public int SaveCode(String json)
    {
        var info = json.JsonStringToDictionary<Dictionary<String, Object>>();
        int id = Convert.ToInt32(info["ID"]);

        MySqlParameter[] pars = new MySqlParameter[] { 
            new MySqlParameter("?id",id),
            new MySqlParameter("?display",Convert.ToString(info["Display"])),
            new MySqlParameter("?typeid",Convert.ToInt32(info["TypeID"])),
            new MySqlParameter("?isenable",Convert.ToBoolean(info["isEnable"]))
        };

        if (id > 0)
        {
            String sql = "update sys_code set Display=?display,isEnable=?isenable,TypeID=?typeid where ID=?id";

            db.ExecuteNonQuery(sql, pars, System.Data.CommandType.Text);
        }
        else
        {
            String sql = "insert into sys_code(display,CREATETime,isenable,typeID) VALUES(?display,NOW(),?isenable,?typeid)";

            db.ExecuteNonQuery(sql, pars, System.Data.CommandType.Text);
        }

        return 1;
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

}
