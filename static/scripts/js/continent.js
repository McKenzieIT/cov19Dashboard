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
    });
    waterfall('North America');
    waterfall('Europe');
    waterfall('South America');
    waterfall('Asia');
    waterfall('Africa');
    waterfall('Oceania');
}

function waterfall(continent){
    $.ajax({
        type: 'post',
        url: '/cov19/getbycontinent/',
        dataType: 'json',
        data: {
            'continent':continent
        },
        success: function(data){
            let continentData = data.data[0];
            let total = continentData['confirm_total'];
            let confirmCurrent = continentData['confirm_current'];
            let curedTotal = continentData['cured_total']
            let deathTotal = continentData['death_total']
            let waterfall = echarts.init(document.getElementById(continent))
            waterfall.setOption({
                backgroundColor: 'rgba(37, 101, 131, 0.897)',
                title: {
                    text: continent + ' Situation',
                    textStyle:{
                        color:'#00fcae'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        var tar = params[1];
                        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    splitLine: {show: false},
                    data: ['Total Confirm', 'Current Confirm', 'Total Death', 'Total Cured'],
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            fontSize: 10,
                            fontWeight: 'bolder'
                        }
                    },
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar',
                        stack: 'total',
                        itemStyle: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            itemStyle: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                        data: [0, total-confirmCurrent, deathTotal, 0]
                    },
                    {
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true,
                            position: 'inside',
                            textStyle:{
                                color: ''
                            }
                        },
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00fcae'
                            }, {
                                offset: 1,
                                color: '#006388'
                            }]),
                            opacity: 1,
                        },
                        data: [total, confirmCurrent, curedTotal, deathTotal]
                    }
                ]
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}