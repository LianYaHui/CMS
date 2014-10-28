Date.prototype.format = function (b) { var c = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(b)) { b = b.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)) } for (var a in c) { if (new RegExp("(" + a + ")").test(b)) { b = b.replace(RegExp.$1, RegExp.$1.length == 1 ? c[a] : ("00" + c[a]).substr(("" + c[a]).length)) } } return b };

String.prototype.ReplaceAll = function (oldString, newString) {
    var reg = new RegExp(oldString, "g");
    return this.replace(reg, newString);
}

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

///对话框
var DialogBox = (function () { var b = null; function a(f, e, c) { this.Href = f; this.Options = e; this.Handle = null; if (c == null) { var d = $("<div></div>"); $(document.body).append(d); this.Handle = d } else { this.Handle = $(c) } b = $.extend({ shadow: true, modal: true, minimizable: false, maximizable: false, collapsible: false, closed: true, href: this.Href }, this.Options); this.Handle = this.Handle.window(b); this.Window = this.Handle.window } a.prototype.AddOptions = function (c) { this.Options = $.extend(this.Options, c) }; a.prototype.OpenWindow = function () { this.Handle.window("open") }; a.prototype.UrlOption = function (f) { f = f || {}; var n = new Array(); var e = {}; var d = this.Handle.window("options").href || ""; var j = d.split("?"); if (d.indexOf("?") > 0) { var k = d.substr(d.indexOf("?") + 1); var g = k.split("&"); for (var h = 0; h < g.length; h++) { var l = g[h].split("="); e[l[0]] = l[1] } f = $.extend(e, f) } for (var m in f) { n.push(m + "=" + f[m]) } var c = ""; c = j[0] + "?" + n.join("&"); this.Handle.window({ href: c }); return c }; return a })();

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

var _Marsk = { init: false, setting: { time: 400, display: "数据正在载入，请稍等。。。。", opt: 0.8 }, Setsetting: function (a) { this.setting = $.extend({}, this.setting, a) }, Show: function (i) { if (!this.init) { try { document.createElement("canvas").getContext("2d"); $("<div class='mask_top' style='display: none;'><div style='margin-top:100px;text-align: center;'><canvas id='c'></canvas><p></p></div></div>").appendTo(document.body); var y = document.getElementById("c"), t = y.getContext("2d"), f = y.width = 400, p = y.height = 300, z = function (e, c) { return ~~((Math.random() * (c - e + 1)) + e) }, n = function (c) { return c * (Math.PI / 180) }, k = { x: (f / 2) + 5, y: (p / 2) + 22, radius: 90, speed: 2, rotation: 0, angleStart: 270, angleEnd: 90, hue: 220, thickness: 18, blur: 25 }, x = [], o = 100, s = function () { if (k.rotation < 360) { k.rotation += k.speed } else { k.rotation = 0 } }, m = function () { t.save(); t.translate(k.x, k.y); t.rotate(n(k.rotation)); t.beginPath(); t.arc(0, 0, k.radius, n(k.angleStart), n(k.angleEnd), true); t.lineWidth = k.thickness; t.strokeStyle = b; t.stroke(); t.restore() }, v = function () { t.save(); t.translate(k.x, k.y); t.rotate(n(k.rotation)); t.beginPath(); t.arc(0, 0, k.radius + (k.thickness / 2), n(k.angleStart), n(k.angleEnd), true); t.lineWidth = 2; t.strokeStyle = a; t.stroke(); t.restore() }, u = function () { t.save(); t.translate(k.x, k.y); t.rotate(n(k.rotation + 185)); t.scale(1, 1); t.beginPath(); t.arc(0, k.radius, 30, 0, Math.PI * 2, false); t.closePath(); var c = t.createRadialGradient(0, k.radius, 0, 0, k.radius, 30); c.addColorStop(0, "hsla(330, 50%, 50%, .35)"); c.addColorStop(1, "hsla(330, 50%, 50%, 0)"); t.fillStyle = c; t.fill(); t.restore() }, d = function () { t.save(); t.translate(k.x, k.y); t.rotate(n(k.rotation + 165)); t.scale(1.5, 1); t.beginPath(); t.arc(0, k.radius, 25, 0, Math.PI * 2, false); t.closePath(); var c = t.createRadialGradient(0, k.radius, 0, 0, k.radius, 25); c.addColorStop(0, "hsla(30, 100%, 50%, .2)"); c.addColorStop(1, "hsla(30, 100%, 50%, 0)"); t.fillStyle = c; t.fill(); t.restore() }, g = function () { if (x.length < o) { x.push({ x: (k.x + k.radius * Math.cos(n(k.rotation - 85))) + (z(0, k.thickness * 2) - k.thickness), y: (k.y + k.radius * Math.sin(n(k.rotation - 85))) + (z(0, k.thickness * 2) - k.thickness), vx: (z(0, 100) - 50) / 1000, vy: (z(0, 100) - 50) / 1000, radius: z(1, 6) / 2, alpha: z(10, 20) / 100 }) } }, q = function () { var c = x.length; while (c--) { var e = x[c]; e.vx += (z(0, 100) - 50) / 750; e.vy += (z(0, 100) - 50) / 750; e.x += e.vx; e.y += e.vy; e.alpha -= 0.01; if (e.alpha < 0.02) { x.splice(c, 1) } } }, h = function () { var c = x.length; while (c--) { var e = x[c]; t.beginPath(); t.fillRect(e.x, e.y, e.radius, e.radius); t.closePath(); t.fillStyle = "hsla(0, 0%, 100%, " + e.alpha + ")" } }, r = function () { t.globalCompositeOperation = "destination-out"; t.fillStyle = "rgba(0, 0, 0, .1)"; t.fillRect(0, 0, f, p); t.globalCompositeOperation = "lighter" }; loop = function () { r(); s(); m(); v(); u(); d(); g(); q(); h() }; t.shadowBlur = k.blur; t.shadowColor = "hsla(" + k.hue + ", 80%, 60%, 1)"; t.lineCap = "round"; var b = t.createLinearGradient(0, -k.radius, 0, k.radius); b.addColorStop(0, "hsla(" + k.hue + ", 60%, 50%, .25)"); b.addColorStop(1, "hsla(" + k.hue + ", 60%, 50%, 0)"); var a = t.createLinearGradient(0, -k.radius, 0, k.radius); a.addColorStop(0, "hsla(" + k.hue + ", 100%, 50%, 0)"); a.addColorStop(0.1, "hsla(" + k.hue + ", 100%, 100%, .7)"); a.addColorStop(1, "hsla(" + k.hue + ", 100%, 50%, 0)"); setInterval(loop, 16) } catch (w) { $("<div class='mask_top' style='display: none;'><div style='margin-top:300px;text-align: center;'><img src='/Images/loading2.gif'/><p></p></div></div>").appendTo(document.body) } this.init = true } var l = $.extend({}, this.setting, i); var j = $(".mask_top"); j.find("p").text(l.display); if (typeof (l.time) == DataType.Number) { j.fadeTo(Math.abs(l.time), l.opt) } }, Close: function (a) { var c = $.extend({}, this.setting, a); var b = $(".mask_top"); if (typeof (c.time) == DataType.Number) { b.fadeOut(Math.abs(c.time), function () { $(this).css("display", "none") }) } } };

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
    }
};