var stock = (function () {
	// 数据存放目录
	var baseUrl = '../data/';
    // 获取数据并渲染界面
	function render() {
		var kUrl = baseUrl + 'k.json';
		var handicapUrl = baseUrl + 'handicap.json';
		var fundFlowUrl = baseUrl + 'fund_flow.json';
		var analysisUrl = baseUrl + 'compony_finance_analysis.json';
		_ajax(kUrl, function(data) {
            _renderK(data)
        })
        _ajax(handicapUrl, function(data) {
            _renderHandicap(data)
        })
        _ajax(fundFlowUrl, function(data) {
            _renderFundFlow(data)
        })
        _ajax(analysisUrl, function(data) {
            _renderAnalysis(data)
        })
	}
    // 渲染k线图
	function _renderK(data) {
		var kChart = echarts.init(document.getElementById('data-k'));
		var xData = [],
			kData = [],
			volumeData = [];
		data.forEach(function (value) {
			xData.push(value.date)
			kData.push(value.value)
			volumeData.push(value.volume)
		})
		function calculateMA(dayCount) {
	        var result = [];
	        for (var i = 0, len = kData.length; i < len; i++) {
	            if (i < dayCount) {
	                result.push('-');
	                continue;
	            }
	            var sum = 0;
	            for (var j = 0; j < dayCount; j++) {
	                sum += kData[i - j][1];
	            }
	            result.push(sum / dayCount);
	        }
	        return result;
	    }
		var option = {
		    title: {
		        text: 'K线图',
		        left: 0
		    },
		    toolbox: {
		        show: true,
		        right: "10%",
		        feature: {
		            dataZoom: {
		                yAxisIndex: 'none'
		            }
		        }
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
		        bottom: 'bottom',
		        left: 'center'
		    },
		    grid: [{
		        x: '10%',
		        y: '10%',
		        width: '80%',
		        height: '50%'
		    }, {
		        x2: '10%',
		        y: '65%',
		        width: '80%',
		        height: '20%'
		    }],
		    xAxis: [{
		        type: 'category',
		        data: xData,
		        gridIndex: 0,
		        scale: true,
		        boundaryGap: false,
		        axisLine: {
		            onZero: false
		        },
		        splitLine: {
		            show: false
		        },
		        splitNumber: 20,
		        min: 'dataMin',
		        max: 'dataMax'
		    }, {
		        data: xData,
		        gridIndex: 1,
		        axisLine: {
		            lineStyle: {
		                color: 'rgba(0,0,0,1)'
		            }
		        },
		        axisTick: {
		            lineStyle: {
		                color: 'rgba(255,255,255,1)'
		            }
		        },
		        axisLabel: {
		            textStyle: {
		                color: 'rgba(255,255,255,0)'
		            }
		        }
		    }],
		    yAxis: [{
		        scale: true,
		        gridIndex: 0,
		        splitArea: {
		            show: true
		        }
		    }, {
		        gridIndex: 1,
		        splitLine: false,
		        axisLine: {
		            lineStyle: {
		                color: 'rgba(255,255,255,0)'
		            }
		        },
		        axisLabel: {
		            textStyle: {
		                color: 'rgba(255,255,255,0)'
		            }
		        }
		    }],
		    dataZoom: [{
		        type: 'inside',
		        start: 50,
		        xAxisIndex: [0, 1],
		        end: 100
		    }, {
		        xAxisIndex: [0, 1],
		        show: true,
		        type: 'slider',
		        y: '90%',
		        start: 50,
		        end: 100
		    }],
		    series: [{
		        name: '日K',
		        type: 'candlestick',
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        data: kData
		    }, {
		        name: 'MA5',
		        type: 'line',
		        data: calculateMA(5),
		        smooth: true,
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        lineStyle: {
		            normal: {
		                opacity: 0.5
		            }
		        }
		    }, {
		        name: 'MA10',
		        type: 'line',
		        data: calculateMA(10),
		        smooth: true,
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        lineStyle: {
		            normal: {
		                opacity: 0.5
		            }
		        }
		    }, {
		        name: 'MA20',
		        type: 'line',
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        data: calculateMA(20),
		        smooth: true,
		        lineStyle: {
		            normal: {
		                opacity: 0.5
		            }
		        }
		    }, {
		        name: 'MA30',
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        type: 'line',
		        data: calculateMA(30),
		        smooth: true,
		        lineStyle: {
		            normal: {
		                opacity: 0.5
		            }
		        }
		    }, {
		    	name : '成交量',
		        type: 'bar',
		        xAxisIndex: 1,
		        yAxisIndex: 1,
		        data: volumeData
		    }]
		};


		kChart.setOption(option);
	}
    // 渲染盘口
	function _renderHandicap(data) {
		var $sell = $(".js-data-handicap-sell");
		var $buy = $(".js-data-handicap-buy");
		var sellHtml = '';
		var buyHtml = '';
		sellHtml += '<table>'
		data.sell.forEach(function (sell) {
			 sellHtml += '<tr>'
			 sellHtml += '<td>' + sell.name + '</td>'
			 sellHtml += '<td class="up-text">' + sell.price + '</td>'
			 sellHtml += '<td>' + sell.count + '</td>'
			 sellHtml += '</tr>'
		})
		sellHtml += '</table>'

		buyHtml += '<table>'
		data.buy.forEach(function (buy) {
			 buyHtml += '<tr>'
			 buyHtml += '<td>' + buy.name + '</td>'
			 buyHtml += '<td class="up-text">' + buy.price + '</td>'
			 buyHtml += '<td>' + buy.count + '</td>'
			 buyHtml += '</tr>'
		})
		buyHtml += '</table>'
		$sell.empty()
		.append(sellHtml)
		$buy.empty()
		.append(buyHtml)
	}
    // 渲染资金流向
	function _renderFundFlow(data) {
		var pieData = data.main_investor;
		var barData = data.classify_fund;
		pie(pieData)
		bar(barData)
		function pie(data) {
			var pieChart = echarts.init(document.getElementById('fund-flow-pie'));
		    var option = {
		        tooltip: {
		            trigger: 'item',
		            formatter: "{a} <br/>{b} : {c} ({d}%)"
		        },
		        series: [{
		            name: '主户、散户资金流向',
		            type: 'pie',
		            radius: '55%',
		            center: ['50%', '50%'],
		            data: [{
		                value: data.main_buy,
		                name: '主力买入'
		            }, {
		                value: data.main_sell,
		                name: '主力卖出'
		            }, {
		                value: data.investor_buy,
		                name: '散户买入'
		            }, {
		                value: data.investor_sell,
		                name: '散户卖出'
		            }]
		        }]
		    };
		    pieChart.setOption(option);
		}
		function bar(data) {
			var barChart = echarts.init(document.getElementById('fund-flow-bar'));
			var option = {
			    tooltip: {
			        trigger: 'axis'
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: [{
			        type: 'category',
			        data: ['散单', '小单', '大单', '特大单'],
			        axisLine: {
			            lineStyle: {
			                color: '#000',
			                width: 2
			            }
			        },
			        axisTick: {
			            lineStyle: {
			                color: 'rgba(255,255,255,0)'
			            }
			        },
			        axisLabel: {
			            textStyle: {
			                color: 'rgba(255,255,255,0)'
			            }
			        },
			    }],
			    yAxis: [{
			        type: 'value',
			        splitLine: false,
			        axisLine: {
			            lineStyle: {
			                color: 'rgba(255,255,255,0)'
			            }
			        },
			        axisTick: {
			            lineStyle: {
			                color: 'rgba(255,255,255,0)'
			            }
			        },
			        axisLabel: {
			            textStyle: {
			                color: 'rgba(255,255,255,0)'
			            }
			        }
			    }],
			    series: [{
			        name: '分类资金净流入额',
			        type: 'bar',
			        barWidth: '60%',

			        data: [{
			            value: data.scatter,
			            name: '散单',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top',
			                    formatter: '{b}',
			                    textStyle: {
			                        color: '#333'
			                    }
			                }
			            }
			        }, {
			            value: data.small,
			            name: '小单',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top',
			                    formatter: '{b}',
			                    textStyle: {
			                        color: '#333'
			                    }
			                }
			            }
			        }, {
			            value: data.big,
			            name: '大单',
			            itemStyle: {
			                normal: {
			                    color: 'green'
			                }
			            },
			            label: {
			                normal: {
			                    show: data.scatter,
			                    position: 'bottom',
			                    formatter: '{b}',
			                    textStyle: {
			                        color: '#333'
			                    }
			                }
			            }
			        }, {
			            value: data.xBig,
			            name: '特大单',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top',
			                    formatter: '{b}',
			                    textStyle: {
			                        color: '#333'
			                    }
			                }
			            }
			        }]
			    }]
			};
			barChart.setOption(option);
		}
	}
    // 渲染公司财务分析
	function _renderAnalysis(data) {
		var xData = [],
			netProfitData = [],
			mainRevenueData = [],
			preShareData = [];
		data.netProfit.forEach(function (d) {
			xData.push(d.name)
			netProfitData.push(d.value)
		})
		data.mainRevenue.forEach(function (d) {
			mainRevenueData.push(d.value)
		})
		data.preShare.forEach(function (d) {
			preShareData.push(d.value)
		})
		var analysisChart = echarts.init(document.getElementById('company-finance-analysis-chart'));
		var option = {
		    tooltip: {
		        trigger: 'axis'
		    },
		    grid: [{
		        x: '10%',
		        y: '10%',
		        width: '20%',
		        height: '80%'
		    }, {
		        x: '40%',
		        y: '10%',
		        width: '20%',
		        height: '80%'
		    }, {
		        x: '70%',
		        y: '10%',
		        width: '20%',
		        height: '80%'
		    }],
		    xAxis: [{
		        gridIndex: 0,
		        type: 'category',
		        axisLabel: {
		            interval: 0
		        },
		        data: xData
		    }, {
		        gridIndex: 1,
		        type: 'category',
		        axisLabel: {
		            interval: 0
		        },
		        data: xData
		    }, {
		        gridIndex: 2,
		        type: 'category',
		        axisLabel: {
		            interval: 0
		        },
		        data: xData
		    }],
		    yAxis: [{
		        type: 'value',
		        gridIndex: 0,
		        nameLocation: 'end',
		        nameGap: 5,
		        name: '净利润',
		        axisLabel : {
		        	formatter : '{value}亿'
		        }
		    }, {
		        type: 'value',
		        gridIndex: 1,
		        nameLocation: 'end',
		        nameGap: 5,
		        name: '主营收',
		        axisLabel : {
		        	formatter : '{value}亿'
		        }
		    }, {
		        type: 'value',
		        gridIndex: 2,
		        nameLocation: 'end',
		        nameGap: 5,
		        name: '每股收益（元）'
		    }],
		    series: [{
		        name: '净利润',
		        type: 'bar',
		        barWidth: '40%',
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        data: netProfitData
		    }, {
		        name: '主营收',
		        type: 'bar',
		        barWidth: '40%',
		        xAxisIndex: 1,
		        yAxisIndex: 1,
		        data: mainRevenueData
		    }, {
		        name: '每股收益（元）',
		        type: 'bar',
		        barWidth: '40%',
		        xAxisIndex: 2,
		        yAxisIndex: 2,
		        data: preShareData
		    }]
		};

		analysisChart.setOption(option);
	}
	// 封装ajax方法
	function _ajax(url, cb) {
	    // $.getJSON(url + '&callback=?')
	    $.getJSON(url)
        .done(function(d) {
            // console.log(d)
            cb && cb(d)
        })
        .fail(function(e) {
        	console.log(e)
            alert(url + '：获取不到数据');
        })
	}
    // 暴露render方法
	return {
		render : render
	}
})()