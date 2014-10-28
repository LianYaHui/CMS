using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;

namespace TaskBLL
{
    public class TaskBLL
    {
        FoxzyForMySql.MySqlManageUtil db = new FoxzyForMySql.MySqlManageUtil();

        /// <summary>
        /// 根据客户端的ID 获取该ID下的所有任务
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public DataTable GetTaskTableByUser(String userID)
        {
            String sql = @"select tt.Value as TaskTypeText,td.Value as TaskDegreeTest,tc.Value as taskCategoryTest,t.HelpUrl,t.Longitude,t.Latitude,u.ID,t.Grade,t.TaskCategory,t.TaskDegree,t.TaskDescription,t.TaskEndTime,t.TaskStartTime,t.TaskType,t.TaskName,t.RoadId,t.Leave
from UserTaskInfo u left JOIN InspectionTaskInfo t on t.ID=u.TaskID and t.enable=1
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
from UserTaskInfo u left JOIN InspectionTaskInfo t on t.ID=u.TaskID and t.enable=1
left JOIN codeinfo c on c.Code=u.FaultType
where u.enable=1 and u.ID=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",userTaskID)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }

        public DataTable GetPatrolLine(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select l.create_time,l.line_name,line_count.c,u.name
from patrol_line l left join control_unit u on l.unit_id=u.control_unit_id
left join (select line_id,count(*) as c from patrol_point group by line_id) as line_count on line_count.line_id=l.line_id
where l.is_delete=0";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = db.ExecuteScalar<int>(getCountSql);

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }
    }
}
