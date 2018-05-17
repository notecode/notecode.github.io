
/*
    @pattern:
    [
        {
            someKey: 'ios-0.0.1',
            [org0, org1]
        },
        {
            someKey: 'ios-0.0.2',
            [org0, org1]
        }
    ]
*/

$(function() {
    var byV = (qs('byver') == 1);
    var arr = splitByVer(byV ? window.dataByVer : window.data);  // dataByVer / data 的定义见 data1.js / data2.js
    sortVersions(arr);

    window.allData = (qs('all-data') == 1);

    for (var i = 0; i < arr.length; i++) {
        arr[i].dateList = splitByDate(arr[i].arr);
        delete arr[i].arr;

        arr[i].dateList.sort(function(a, b) {
            var da = new Date(a.date);
            var db = new Date(b.date);
            return (da.valueOf() - db.valueOf());
        });
    }

    window.arr = arr;

    //fooRenderCharts(arr);
    // for (var i = 0; i < arr.length; i++) {
    //     if (arr[i].version == 'ios-0.1.22') {
    //         renderVer30DaysRetention(arr[i]);
    //     }
    // }

    renderTable(arr);
});

function renderTable(data) {
    var html = doT_Render('tpl-data', data);
    document.getElementById('tables').innerHTML = html;
}

function fooRenderCharts(data) {
    var myChart = echarts.init(document.getElementById('charts'));

    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10]
        }]
    };

    myChart.setOption(option);
}

function renderVer30DaysRetention(ver) {
    var xArr = [];
    var lgd = [];
    for (var i = 0; i < ver.dateList.length; i++) {
        lgd.push(vdate(ver.dateList[i].date));
    }

    var steps = ver.dateList[0].arr;
    for (var i = 0; i < steps.length; i++) {
        xArr.push(steps[i].step);
    }

    var serArr = [];
    for (var i = 0; i < ver.dateList.length; i++) {
        var the = ver.dateList[i];
        var data = [];
        for (var j = 0; j < the.arr.length; j++) {
            data.push(the.arr[j].retentionrate);
        }

        serArr.push({
            name: vdate(the.date),
            type: 'line',
            data: data,
        });
    }

    var myChart = echarts.init(document.getElementById('charts'));
    var option = {
        title: {
            text: ver.version
        },
        tooltip: {},
        legend: {
            data: lgd,
        },
        xAxis: {
            data: xArr,
        },
        yAxis: {},
        series: serArr
    };

    myChart.setOption(option);
}

function splitByVer(orgArr) {
    var arr = splitByKey(orgArr, 'version');

    var toShow = function(ver) {
        if (ver.version.indexOf('00.00') >= 0 || ver.version.indexOf('0.0') >= 0) {
            tlog('ignore: ' + ver.version);
            return false;
        } else {
            return true;
        }
    }

    var narr = [];
    for (var i = 0; i < arr.length; i++) {
        if (toShow(arr[i])) {
            narr.push(arr[i]);
        }
    }

    return narr;
}

// 将某个版本，赶开始的日期，分堆（下一步再将这一堆按step排序）
function splitByDate(orgArr) {
    var arr = splitByKey(orgArr, 'date');
    for (var i = 0; i < arr.length; i++) {
        arr[i].arr.sort(function(a, b) {
            return (a.step - b.step);
        });
    }

    return arr;
}

function splitByKey(orgArr, key) {
    var arr = [];
    var getIndexByKey = function(arr, x) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] == x) {
                return i;
            }
        }

        return -1;
    }

    for (var i = 0; i < orgArr.length; i++) {
        var x = orgArr[i][key];
        var idx = getIndexByKey(arr, x);
        if (idx >= 0) {
            arr[idx].arr.push(orgArr[i]);
        } else {
            var o = {};
            o[key] = x;
            o['arr'] = [orgArr[i]];

            arr.push(o);
        }
    }

    return arr;
}

function makeTD(step, idx) {
    var dayN = makeDayN(idx);
    var r = step.retentionrate;
    var rate = (typeof r == 'string') ? parseFloat(r) : r;
    if (0 < rate && rate < 1) {
        var s = 256 - (256 * rate).toFixed();
        var bg = 'background-color: rgb(' + s + ',' + s + ',' + s + ');';
        var clr = (rate > 0.6) ? ' color: #fff;' : '';
        var css = bg + clr;
        return '<td class="' + dayN + '" style="' + css + '">' + rate.toFixed(2) + '</td>';
    } else {
        return '<td class="' + dayN + ' gray">' + rate.toFixed(2) + '</td>';
    }
}

function makeDayN(idx) {
    var rgb = qs('rgb');
    if (rgb != 0) {
        var dayN = 'day' + (idx + 1);
        return dayN;
    } else {
        return '';
    }
}

// 9-20开始地推，之前的版本量太少，不足取样
function isValidDate(date) {
    if (window.allData) {
        return true;
    } else {
        var start = new Date('2017-09-20 00:00:00');
        var then = new Date(date);
        return (then.valueOf() >= start.valueOf());
    }
}

function sortVersions(arr) {
    var prior = {
        'all': -1,
        'ios': 1,
        'android': 2,
        'ios-notin-coupon': 3,
        'android-notin-coupon': 4,
    };

    var getPrior = function(ver) {
        var p = prior[ver];
        return p || 100;
    }

    arr.sort(function(a, b) {
        var va = a.version;
        var vb = b.version;
        var pa = getPrior(va);
        var pb = getPrior(vb);
        if (pa != pb) {
            return pa - pb;
        } else {
            if (va < vb) {
                return -1;
            } else if (va == vb) {
                return 0;
            } else {
                return 1;
            }
        }
    });
}
