var hideshow = function(state, id){
	if (state == 'show')
		$("#" + id).show("slow");
	else
		$("#" + id).hide("slow");
}

var show_metrics = function(metrics_cls){
   $("." + metrics_cls).each(function () {
	   hideshow('show', this.id);
   });
}

var hide_metrics = function(metrics_cls){
	$("." + metrics_cls).each(function () {
	   hideshow('hide', this.id);
    });
}

var initialize_proc = function(){
   show_metrics('yesterday_metrics');
   hide_metrics('7day_metrics');
   hide_metrics('30day_metrics');
}

$( document ).ready(function() {
   $( "#tab-yesterday" ).attr( "aria-selected", true );
   $( "#tab-7-day" ).attr( "aria-selected", false );
   $( "#tab-30-day" ).attr( "aria-selected", false );
   // Call init method
   initialize_proc()
});

$( "#tab-yesterday" ).click(function() {
   $( "#tab-yesterday" ).attr( "aria-selected", true );
   $( "#tab-7-day" ).attr( "aria-selected", false );
   $( "#tab-30-day" ).attr( "aria-selected", false );
   // Call init method
   initialize_proc();       
});

$( "#tab-7-day" ).click(function() {
   $( "#tab-yesterday" ).attr( "aria-selected", false );
   $( "#tab-7-day" ).attr( "aria-selected", true );
   $( "#tab-30-day" ).attr( "aria-selected", false );
	   
   hide_metrics('yesterday_metrics');
   show_metrics('7day_metrics');
   hide_metrics('30day_metrics');
});

$( "#tab-30-day" ).click(function() {
   $( "#tab-yesterday" ).attr( "aria-selected", false );
   $( "#tab-7-day" ).attr( "aria-selected", false );
   $( "#tab-30-day" ).attr( "aria-selected", true );
	   
   hide_metrics('yesterday_metrics');
   hide_metrics('7day_metrics');
   show_metrics('30day_metrics');       
});