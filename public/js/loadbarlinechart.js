
var CHART_TICKS = 0,
    VISITS_TRANSITION_DURATION = 500,
    MAXBARVALUE = 0,  MAXLINEVALUE = 0,
    ADJUSTHEUGHT = 50, ADJUSTWIDTH = 10;

var formatHour = function(hour) {
    var n = +hour,
        suffix = n >= 12 ? "p" : "a";
    return (n % 12 || 12) + suffix;
}


var load_chart = function(chart_id, test_data){
	var commasFormatter = d3.format(",");
	var chart,
	    width = parseInt($('#'+chart_id).width())+ADJUSTWIDTH, 
        height = parseInt($('#'+chart_id).height())+ADJUSTHEUGHT;
	
	    chart = nv.models.linePlusBarChart()
		        .margin({ top: 20, right: 50, bottom: 25, left: 50 })
		        .legendLeftAxisHint('')
		        .legendRightAxisHint('')
		        .color(['#cc0000', '#4c4c4c'])
		        .width(width)
		        .height(height)
		        .focusEnable(false);
    
    chart.xAxis
        .ticks(CHART_TICKS)
	    .tickFormat(function(d) { return formatHour(d) })	    
	    .showMaxMin(false);

    chart.y1Axis
        .tickFormat(function(d) { return commasFormatter(d); })
	    .showMaxMin(false);
    
    chart.y2Axis
        .tickFormat(function(d) { return commasFormatter(d); })
    	.showMaxMin(false);
    
    chart.bars
        .forceY([0, MAXBARVALUE])
        .padData(false);
    
    chart.lines
        .forceY([0, MAXLINEVALUE])
        .padData(false);
        
    chart.tooltip(function(key, x, y, e, graph) {
	    return '<h3>' + key + '</h3>' + '<p>' +  y + ' on ' + x + '</p>';
	});
    
    d3.select('#'+chart_id+' svg')
        .datum(test_data)
        .transition().duration(VISITS_TRANSITION_DURATION)
        .call(chart);
    
    nv.utils.windowResize(chart.update);
    
    return chart;
	
};

var fill_data = function(section_id){
	var loaded_data,
	    yesterday_grp_data = [], 
	    dbyesterday_grp_data = [],
	    maxbararray = [], maxbarvalue = 0,
	    maxlinearray = [], maxlinevalue = 0;
	
	var get_url = $( "#"+ section_id ).attr( "data-source" ),	
	    bar_grp_label = $( "#"+ section_id ).attr( "bar_graph_label" ),
	    line_grp_label = $( "#"+ section_id ).attr( "line_graph_label" );
	
	$.ajax({
	    url : get_url,
	    type : "get",
	    async: false,
	    success : function(data) {
	    	//loaded_data = JSON.parse(data);
	    	loaded_data = data.data;
	    	CHART_TICKS = loaded_data.length;
	    	loaded_data.forEach(function(d) {
	    		maxbararray.push(parseFloat(d.visits));
	    		yesterday_grp_data.push([ parseInt(d.hour), parseFloat(d.visits) ]);
	    		maxlinearray.push(parseFloat(d.visits));
	    		dbyesterday_grp_data.push([ parseInt(d.hour), parseFloat(d.visits_dbp) ]);
	    	});
	    },
	    error: function() {
	    	console.log( "Data Loaded Error.");
	    }
	});
	
	MAXBARVALUE = Math.max.apply(Math, maxbararray);
	MAXLINEVALUE = Math.max.apply(Math, maxlinearray);

	return [
             {
                 "key" : bar_grp_label,                 
                 "values" : yesterday_grp_data,
                 "bar": true
             },
             {
                 "key" : line_grp_label,
                 "values" : dbyesterday_grp_data
             }
           ].map(function(series) {
               series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
               return series;
           });
}

nv.addGraph(function() {
	$( ".chart_container" ).each(function( index ) {
		var element_id = $( this ).attr('id');
		load_chart(element_id, fill_data(element_id));
	});    
});