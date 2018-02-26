
/* get query string */
function qs(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// 给个url，获取其中某个query值
function qs2(url, name) {
	var q = url.substring(url.indexOf('?'));
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(q);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function doT_Render(tplId, data) {
	var tpl = document.getElementById(tplId).innerHTML;
    var render = doT.template(tpl);
	return render(data);
}

function vdate(raw) {
    return raw.replace(/201[789]\//g, '').replace(' 0:00', '').replace(/201[789]-/g, '').replace('00:00:00', '');
}

function tlog(x) {
    console.log(x);
}
