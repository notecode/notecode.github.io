
function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

// 按版本号统计
window.dataByVer = [];

window.data = window.dataByVer.concat(window.data);
