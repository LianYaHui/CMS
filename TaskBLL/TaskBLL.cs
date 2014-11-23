using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;
using System.Web;

namespace TaskBLL
{
    public class TaskBLL
    {
        FoxzyForMySql.MySqlManageUtil db = new FoxzyForMySql.MySqlManageUtil();

        public int InsertLog(String LogStr)
        {
            return db.CreateInsert("sysManageLog")
                .SetObject(new
                {
                    logtime = DateTime.Now,
                    logText = LogStr,
                    clientIP = HttpContext.Current.Request.UserHostAddress
                })
                .ExecuteNonQuery();
        }








        /// <summary>
        /// 根据客户端的ID 获取该ID下的所有任务
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public DataTable GetTaskTableByUser(String userID)
        {
            //TODO
            //不是最好的,需要TaskUser映射
            String sql = @"select tt.Value as TaskTypeText,td.Value as TaskDegreeTest,tc.Value as taskCategoryTest,
t.HelpUrl,p.Longitude,p.Latitude,u.ID,t.Grade,t.TaskCategory,
t.TaskDegree,t.TaskDescription,t.TaskEndTime,t.TaskStartTime,t.TaskType,
t.TaskName,t.RoadId,t.taskLeave as 'Leave'
from UserTaskInfo u left JOIN InspectionTaskInfo t on t.ID=u.TaskID and t.isEnable=1
left join patrol_point p on p.point_id= t.PointID
left join codeinfo tc on tc.Code=t.taskCategory
left join codeinfo td on td.Code=t.TaskDegree
left join codeinfo tt on tt.Code=t.TaskType
where u.UserAccount=?user and u.Enable=1";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?user",userID)
            };
            return db.FillDataSet(sql, pars).Tables[0];
        }


        public DataTable GetTaskTableByID(int userTaskID)
        {
            String sql = @"select t.OperationStandard as Specifications,u.FaultText,u.FaultType,c.Value as FaultTypeText
from UserTaskInfo u left JOIN InspectionTaskInfo t on t.ID=u.TaskID and t.isEnable=1
left JOIN codeinfo c on c.Code=u.FaultType
where u.enable=1 and u.ID=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",userTaskID)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }

        public DataTable GetPatrolLine(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select l.line_id,l.create_time,l.line_name,line_count.c,u.name
from patrol_line l left join control_unit u on l.unit_id=u.control_unit_id
left join (select line_id,count(*) as c from patrol_point group by line_id) as line_count on line_count.line_id=l.line_id
where l.is_delete=0";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }

        public DataRow GetPatrolLineByID(int ID)
        {
            String sql = @"select * from patrol_line where line_id=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",ID)
            };

            return db.FillDataSet(sql, pars).Tables[0].Rows[0];
        }


        public DataTable GetPatrolType(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select t.*,c.c from patrol_point_type t left join (select type_id,count(*) as c from patrol_point group by type_id) c on c.type_id=t.type_id where is_delete=0";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }

        public DataRow GetPatrolTypeByID(int id)
        {
            String sql = @"select * from patrol_point_type where type_id=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",id)
            };

            return db.FillDataSet(sql, pars).Tables[0].Rows[0];
        }



        public DataTable GetPatrolPoint(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select p.*,pt.type_name,pl.line_name,u.name as uName from patrol_point p left JOIN patrol_point_type pt on p.type_id=pt.type_id
                                left JOIN patrol_line pl on pl.line_id=p.line_id
                                left Join control_unit u on u.control_unit_id=p.unit_id where p.is_delete=0";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }

        public DataRow GetPatrolPointByID(int id)
        {
            String sql = @"select * from patrol_point where point_id=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",id)
            };

            return db.FillDataSet(sql, pars).Tables[0].Rows[0];
        }


        public DataTable GetTaskDesc(string UserName, int BeginNum, int EndNum)
        {
            String sql = String.Format("select td.desc,td.Accout,td.DescDateTime from taskdesc td where td.DriveID=?d limit {0},{1}", BeginNum, EndNum);

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?d",UserName)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }

        public DataTable GetTaskList(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select t.*,ct.`Value` as typeDesc,cc.`Value` as Category,cd.`Value` as DegreeDesc, p.*from 
inspectiontaskinfo t LEFT JOIN codeinfo ct on ct.`Code`=t.TaskType
LEFT JOIN CodeInfo cc on cc.code=t.TaskCategory
left join CodeInfo cd on cd.code=t.TaskDegree
left join patrol_point p on t.pointID =p.point_id 
 where t.`isEnable`=1";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }


        public int DeleteTask(String TaskIDs)
        {
            return db.CreateUpdate("inspectiontaskinfo")
                .Set("isEnable=0")
                .Where(String.Format("id in ({0})", TaskIDs))
                .ExecuteNonQuery();
        }

        public DataRow GetTaskByID(int id)
        {
            return db.CreateSelect()
                .From("inspectiontaskinfo")
                .Where("ID=?id")
                .SetParameter("?id", id)
                .ToDataSet()
                .Tables[0]
                .Rows[0];
        }

        public DataTable GetTaskDeviceByTaskID(int taskID)
        {
            return db.CreateSelect()
                .From("TaskDeviceInfo")
                .Where(String.Format("isDelete=0 and TaskID={0}", taskID))
                .ToDataSet()
                .Tables[0];
        }



    }
}
