$(function(){
    init();
})
function init(){

    $.ajax({
        type: 'get',
        url: '/cov19/getglobaldata/',
        dataType:'json',
        success:function(data){
            let global_data = data.data[0]
            $('#newinfection').html(global_data['confirm_new'])
            $('#newdeath').html(global_data['death_new'])
            $('#totalconfirmed').html(global_data['confirm_total'])
            $('#totaldeath').html(global_data['death_total'])
            $('#totalcured').html(global_data['cured_total'])
            $('#newcured').html(global_data['cured_new'])
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    })

    var mapChart = echarts.init(document.getElementById('mapChart'));

    let getMax = function(num){
        digits = 0;
        let result = num;
        while(result > 100){
            result /= 10;
            digits += 1
        }
        result += 1;
        result = Math.floor(result);
        result = result * Math.pow(10,digits);
        return result;
    }

    let formatNumber = function(num) {
        let reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ',');
    }
    
    $.ajax({
        type: 'get',
        url: '/cov19/gettotalconfirm/',
        dataType: 'json',
        success: function(data){
            mapChart.setOption({
                title:{
                    text: 'COVID-19 Global Cases',
                    subtext:'Data Sources--Johns Hopkins University CSSE',
                    sublink:'https://datahub.io/core/covid-19',
                    left:'center',
                    fontSize: 7
                },
                tooltip:{
                    show:false,
                    trigger:'item',
                    formatter:'{b}<br/>{c}'
                },
                toolbox:{
                    show:false,
                    orient:'horizontal',
                    left:'right',
                    feature:{
                        saveAsImage:{
                            title:'save as image'
                        },
                    }
                },
                visualMap: {
                    type: 'piecewise',
                    pieces: [
                        {min: 100000, color:'#E33539'},
                        {min: 50000, max: 99999, color:'#EB7153'},
                        {min: 10000, max: 49999,color:'#F19373'},
                        {min: 5000, max: 9999,color:'#F6B297'},
                        {min: 1000, max: 4999,color:'#FACE9C'},
                        {min: 100, max: 999,color:'#FCD9C4'},
                        {max: 99,color:'#FDE2CA'}
                    ],
                },
                series:{
                    name:'Infection by country',
                    type:'map',
                    map:'world',
                    zoom: 1.2,
                    roam: true,
                    scaleLimit:{
                        min:1,
                        max:2
                    },
                    label: {
                        show: false,
                        formatter: '{b}',
                        fontSize: 5
                    },
                    data:data.data
                },
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    })
    doughnutSample()
    topBarSample()

    $(".button1").on('click', function(params){
        let id = $(this).attr("id");
        $.ajax({
            type:'post',
            url:'/cov19/gettop/',
            dataType:'json',
            data:{
                'top':10,
                'field':id
            },
            success: function(data){
                let topBar = echarts.init(document.getElementById('top_bar'));
                let topData = data.data;
                let nameData = []
                let valueData = []
                for(let i = 0; i < topData.length; i++) {
                    nameData.push(topData[i]['country_name'])
                    valueData.push(topData[i][id])
                }
                let option={
                    title:{
                        text:'Top 10 countries with the largest total of ' + (id == 'confirm_total' ? 'confirm' : id == 'death_total' ? 'death' : 'cured'),
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip:{
                        trigger: 'item',
                        formatter: id == 'confirm_total' ? 'Total Confirm' +':<br>{c}' : id == 'death_total' ? 'Death Total' +':<br>{c}' : 'Cured Total' +':<br>{c}'
                    },
                    backgroundColor:'#323a5e',
                       ytip: {
                         trigger: 'axis',
                         axisPointer: { 
                           type: 'shadow'
                         },
                       },
                       grid: {
                        x:'2%',
                        left: '2%',
                        right: '4%',
                        bottom: '14%',
                        top:'16%',
                        containLabel: true
                       },
                       xAxis: {
                         type: 'category',
                         data: nameData,
                         axisLine: {
                           lineStyle: {
                             color: 'white'
               
                           }
                         },
                         axisLabel: {
                            interval: 0,
                            textStyle: {
                                fontSize: 10,
                                fontWeight: 'bolder'
                            }
                        },
                       },
               
                       yAxis: {
                         type: 'value',
                         max:getMax(valueData[0]),
                         axisLine: {
                           show: false,
                           lineStyle: {
                             color: 'white'
                           }
                         },
                         splitLine: {
                           show: true,
                           lineStyle: {
                             color: 'rgba(255,255,255,0.3)'
                           }
                         },
                         axisLabel: {
                            margin:20,
                            interval: 0,
                            textStyle: {
                                fontSize: 9,
                                fontWeight: 'bolder'
                            }
                         }
                       },
                       "dataZoom": [{
                         "show": true,
                         "height": 12,
                         "xAxisIndex": [
                           0
                         ],
                         bottom:'8%',
                         "start": 10,
                         "end": 90,
                         handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                         handleSize: '110%',
                         handleStyle:{
                           color:"#d3dee5",
               
                         },
                         textStyle:{
                           color:"#fff"},
                         borderColor:"#90979c"
                       }, {
                         "type": "inside",
                         "show": true,
                         "height": 15,
                         "start": 1,
                         "end": 35
                       }],
                       series: [{
                         name: id,
                         type: 'bar',
                         barWidth: '15%',
                         itemStyle: {
                           normal: {
                               color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                   offset: 0,
                                   color: '#248ff7'
                               }, {
                                   offset: 1,
                                   color: '#6851f1'
                               }]),
                           barBorderRadius: 11,
                           }
                         },
                         data: valueData
                       }]
                     };
                     topBar.setOption(option)
               
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        })
    })
    mapChart.on('click', function(params) {
        doughnut(params)
    })
    
    function topBarSample(){
        var topBar = echarts.init(document.getElementById('top_bar'));
        $.ajax({
            type:'post',
            url:'/cov19/gettop/',
            dataType:'json',
            data:{
                'top':10,
                'field':'confirm_total'
            },
            success: function(data){
                let topData = data.data;
                console.log(topData);
                let nameData = []
                let valueData = []
                for(let i = 0; i < topData.length; i++) {
                    nameData.push(topData[i]['country_name'])
                    valueData.push(topData[i]['confirm_total'])
                }
                console.log(nameData);
                let option={
                    title:{
                        text:'Top 10 countries with the largest total of confirm',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip:{
                        trigger: 'item',
                        formatter: 'Total Confirm' +':<br>{c}' 
                    },
                    backgroundColor:'#323a5e',
                       ytip: {
                         trigger: 'axis',
                         axisPointer: { 
                           type: 'shadow'
                         },
                       },
                       grid: {
                        x:'2%',
                        left: '2%',
                        right: '4%',
                        bottom: '14%',
                        top:'16%',
                        containLabel: true
                       },
                       xAxis: {
                         type: 'category',
                         data: nameData,
                         axisLine: {
                           lineStyle: {
                             color: 'white'
               
                           }
                         },
                         axisLabel: {
                            interval: 0,
                            textStyle: {
                                fontSize: 10,
                                fontWeight: 'bolder'
                            }
                        },
                       },
               
                       yAxis: {
                         type: 'value',
                         max:getMax(valueData[0]),
                         axisLine: {
                           show: false,
                           lineStyle: {
                             color: 'white'
                           }
                         },
                         splitLine: {
                           show: true,
                           lineStyle: {
                             color: 'rgba(255,255,255,0.3)'
                           }
                         },
                         axisLabel: {
                            margin:20,
                            interval: 0,
                            textStyle: {
                                fontSize: 9,
                                fontWeight: 'bolder'
                            }
                         }
                       },
                       "dataZoom": [{
                         "show": true,
                         "height": 12,
                         "xAxisIndex": [
                           0
                         ],
                         bottom:'8%',
                         "start": 10,
                         "end": 90,
                         handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                         handleSize: '110%',
                         handleStyle:{
                           color:"#d3dee5",
               
                         },
                         textStyle:{
                           color:"#fff"},
                         borderColor:"#90979c"
                       }, {
                         "type": "inside",
                         "show": true,
                         "height": 15,
                         "start": 1,
                         "end": 35
                       }],
                       series: [{
                         name: 'Total Confirm',
                         type: 'bar',
                         barWidth: '15%',
                         itemStyle: {
                           normal: {
                               color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                   offset: 0,
                                   color: '#248ff7'
                               }, {
                                   offset: 1,
                                   color: '#6851f1'
                               }]),
                           barBorderRadius: 11,
                           }
                         },
                         data: valueData
                       }]
                     };
                     topBar.setOption(option)
               
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        })
    }

    function doughnutSample(){
        var doughnutSample = echarts.init(document.getElementById('countryDoughnut'));
        doughnutSample.setOption({
            title:[{
                text:'country\ntotal confirmed',
                top:'center',
                left:'center',
                textStyle: {
                    rich: {
                        name: {
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: '#666666',
                            padding: [10, 0]
                        },
                        val: {
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: '#333333',
                        }
                    }
                }
            }],
            tooltip: {
                show:false,
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [
                {
                    name: 'country',
                    type: 'pie',
                    radius: ['50%', '90%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    label: {
                        show:true,
                        position:"inside"
                    },
                    data: [
                        {name: 'Current Confirmed', value: 0},
                        // {name: 'New Confirmed', value: 0},
                        {name: 'Total Death', value: 0},
                        {name: 'Total Cured', value: 0},
                    ]
                }
            ]   
        });
    }

    function doughnut(params){
        $.ajax({
            type: 'post',
            url: '/cov19/getbycountry/',
            data: {
                'name':params.name
            },
            dataType: 'json',
            success: function(data){
                let countryData = (data.data)[0];
                let scale = 1
                let countryDoughnut = echarts.init(document.getElementById('countryDoughnut'));
                countryDoughnut.setOption({
                    title:[{
                        text: countryData['country_name'] + '\n' + formatNumber(countryData['confirm_total']),
                        top:'center',
                        left:'center',
                        textStyle: {
                            rich: {
                                name: {
                                    fontSize: 14,
                                    fontWeight: 'normal',
                                    color: '#666666',
                                    padding: [10, 0]
                                },
                                val: {
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    color: '#333333',
                                }
                            }
                        }
                    }],
                    tooltip: {
                        show:false,
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '90%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '5',
                                fontWeight: 'bold'
                            }
                        },
                        label: {
                            show:true,
                            normal: {
                                formatter: function(params, ticket, callback) {
                                    var total = 0; 
                                    var percent = 0; 
                                    total = countryData['confirm_total'];
                                    percent = ((params.value / total) * 100).toFixed(1);
                                    return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n{blue|' + percent + '%}';
                                },
                                rich: {
                                    yellow: {
                                        color: "#ffc72b",
                                        fontSize: 10 * scale,
                                        padding: [5, 4],
                                        align: 'center'
                                    },
                                    total: {
                                        color: "#ffc72b",
                                        fontSize: 40 * scale,
                                        align: 'center'
                                    },
                                    white: {
                                        color: "#fff",
                                        align: 'center',
                                        fontSize: 14 * scale,
                                        padding: [21, 0]
                                    },
                                    blue: {
                                        color: '#49dff0',
                                        fontSize: 16 * scale,
                                        align: 'center'
                                    },
                                    hr: {
                                        borderColor: '#0b5263',
                                        width: '100%',
                                        borderWidth: 1,
                                        height: 0,
                                    }
                                }
                            }
                        },
                        data: [
                            {name: 'Current Confirmed', value: countryData['confirm_current']},
                            // {name: 'New Confirmed', value: countryData['confirm_new']},
                            {name: 'Total Death', value:countryData['death_total']},
                            {name: 'Total Cured', value:countryData['cured_total']},
                        ]
                    }]
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        })
    }
}

