Date.prototype.format = function (b) { var c = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(b)) { b = b.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)) } for (var a in c) { if (new RegExp("(" + a + ")").test(b)) { b = b.replace(RegExp.$1, RegExp.$1.length == 1 ? c[a] : ("00" + c[a]).substr(("" + c[a]).length)) } } return b };

String.prototype.ReplaceAll = function (oldString, newString) {
    var reg = new RegExp(oldString, "g");
    return this.replace(reg, newString);
}


var EasyuiSetting = {
    DataGrid: {
        collapsible: false,
        rownumbers: true,
        singleSelect: true,
        pagination: true
    }
};


///
///TypeOf枚举值
///
//====================================================
var DataType = {
    String: typeof (""),
    Function: typeof (function () { }),
    Object: typeof ({}),
    Number: typeof (1),
    Boolean: typeof (true),
    Undifend: typeof (UnKnow)
};
var MessageBox = {
    Show: function (content, title, show_type) {
        if (show_type == null) show_type = "show";
        if (title == null) title = "消息";

        $.messager.show({
            title: title,
            msg: "<div class='text-ui'>" + new Date().format("yyyy-MM-dd hh:mm:ss") + "</div>   " + content,
            timeout: 3000,
            showType: show_type
        });

    },
    //弹出对话框，
    //_type：error,info,question,wanring,alert之一
    Alert: function (mes, title, _type) {
        if (title == null) title = '消息';
        if (_type == null) _type = "alert";

        $.messager.alert(title, mes, _type);
    }
    ,
    Confirm: function (mes, title, fun) {
        if (title == null) title = '消息';
        $.messager.confirm(title, mes, fun);
    }
};

var EasyuiDialog = (function () {
    var winOptions = null;

    function EasyuiDialog(url, options, selector) {
        this.Href = url;
        this.Options = options;
        this.Handle = null;

        if (selector == null) {
            var win_div_ = $("<div></div>");
            $(document.body).append(win_div_);
            this.Handle = win_div_;
        }
        else
            this.Handle = $(selector);

        winOptions = $.extend({
            shadow: true,
            modal: true,
            minimizable: false,
            maximizable: false,
            collapsible: false,
            closed: true,
            href: this.Href
        }, this.Options);

        return this.Handle.dialog(winOptions);
    }

    return EasyuiDialog;
})();

(function (Enumerable) {
    window.Q = Enumerable.From;
})(Enumerable);

var Public = {
    ajax: function (url, data, Success) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: url,
            data: data,
            dataType: 'json',
            success: Success
        });
    }
};
var PubStringFun = {
    IsNullOrempty: function (str) {
        if (str == null || str == "")
            return true;
        return false;
    }
};

var Farmat = {
    IsEnable: function (val, row) {
        if (val == 1) {
            return "是";
        } else return "否";
    },
    DataTime: function (val, row) {
        if (!PubStringFun.IsNullOrempty(val))
            return val.ReplaceAll("T", " ");
    },
    Date: function (val, row) {
        if (!PubStringFun.IsNullOrempty(val))
            return val.substr(0, 10);
    },
    execStatus: function (val, row) {
        var desc = "";
        switch (val) {
            case 1: desc = "未开始"
                break;
            case 2: desc = "执行中"
                break;
            case 3: desc = "未完成"
                break;
            case 4: desc = "已完成"
                break;
            default: desc = "未知"
                break;
        }
        return desc;
    },
    DateMonth: function (date) {
        return date.format("yyyy-MM");
    }
        ,
    DateYYYYMMDD: function (date) {
        return date.format("yyyy-MM-dd");
    },
    NullToZero: function (val, row) {
        if (!val) return 0;

        return val;
    },
    Url: function (val, row) {
        if (!val)
            return "";

        return "<a target='_blank' href='" + val + "'>" + val + "</a>";
    }
        ,
    SX: function (val, row) {
        if (!val)
            return "";

        if (row.super_id === 0)
            return "";

        if (val === 10) return "上行";
        else return "下行";
    }
};



var $LineDialog = null,
    $linePointDialog = null,
    $deviceDialog = null,
    $node_recard_dialog = null
;

$(function () {
    $LineDialog = new EasyuiDialog(_path + "LineDialog.aspx", {
        width: 450,
        height: 400,
        title: "选择路线"
    });

    $linePointDialog = new EasyuiDialog(_path + "LinePointDialog.aspx", {
        width: 650,
        height: 400,
        title: "选择巡检点"
    });

    $deviceDialog = new EasyuiDialog((_path + "DevicePage.aspx"), {
        width: 900,
        height: 400,
    });

    $node_recard_dialog = new EasyuiDialog("", {
        fit: true
    });
});
