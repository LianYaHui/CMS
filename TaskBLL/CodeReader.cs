using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using MySql.Data.MySqlClient;

namespace TaskBLL
{
    public class CodeReader
    {
        public static FoxzyForMySql.MySqlManageUtil db = new FoxzyForMySql.MySqlManageUtil();

        public static DataTable GetCodeByType(int type)
        {
            String sql = "select Code,Value as text from codeinfo where Enable=1 AND CodeType=?type";

            MySqlParameter[] pars = new MySqlParameter[] { 
                new MySqlParameter("?type",type)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }

        public static DataTable GetCodeTableByType(int type, String user)
        {
            String sql = "select Code,Value from codeinfo where Enable=1 AND CodeType=?type and Object in (?user,'system')";

            MySqlParameter[] pars = new MySqlParameter[] { 
                new MySqlParameter("?type",type),
                new MySqlParameter("?user",user)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }
    }
}
