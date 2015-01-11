using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TaskBLL
{
    public class DBUtil
    {
        public static String ConnetionString { set; get; }

        public static FoxzyForMySql.MySqlManageUtil CreateMySqlDB()
        {
            return new FoxzyForMySql.MySqlManageUtil(ConnetionString);
        }
    }
}
