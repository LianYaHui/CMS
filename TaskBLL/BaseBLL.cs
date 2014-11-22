using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace TaskBLL
{
    public class BaseBLL
    {
        FoxzyForMySql.MySqlManageUtil db = new FoxzyForMySql.MySqlManageUtil();

        public DataTable GetDeviceinfo(int PageIndex, int PageSize, out int Count, String where = null, String order = null)
        {
            return db.CreateSelect()
                .From("device_info")
                .Select("device_id,index_code,device_name,create_time")
                .Where(where)
                .OrderByDesc("device_id")
                .Pagination(PageIndex, PageSize, out Count)
                .Tables[0];
        }

        public DataTable GetUnitInfo(String where = null)
        {
            return db.CreateSelect()
                .From("control_unit", "c")
                .Select("(select count(*) from control_unit where parent_id= c.control_unit_id ) as ChilenNum,control_unit_id,name,index_code,parent_id,create_time,unit_level")
                .Where(where)
                .ToDataSet()
                .Tables[0];
        }
    }
}
