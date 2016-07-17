function zoom() {
	document.body.style.zoom = "80%"
}

function fluidDialog() {
    var $visible = $(".ui-dialog:visible");
    // each open dialog
    $visible.each(function () {
        var $this = $(this);
        var dialog = $this.find(".ui-dialog-content").data("ui-dialog");
        // if fluid option == true
        if (dialog.options.fluid) {
            var wWidth = $(window).width();
            // check window width against dialog width
            if (wWidth < (parseInt(dialog.options.maxWidth) + 50))  {
                // keep dialog from filling entire screen
                $this.css("max-width", "90%");
            } else {
                // fix maxWidth bug
                $this.css("max-width", dialog.options.maxWidth + "px");
            }
            //reposition dialog
            dialog.option("position", dialog.options.position);
        }
    });

}

//catch dialog if opened within a viewport smaller than the dialog width
$(document).on("dialogopen", ".ui-dialog", function (event, ui) {
    fluidDialog();
});

$(document).ready(function(){
	
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 100) { 
            $('#scroll').fadeIn(); 
        } else { 
            $('#scroll').fadeOut(); 
        } 
    });
    
    $('#scroll').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    });
    
    $("#dialog").dialog({autoOpen : false, 
    	modal : true, 
    	show : "blind", 
    	hide : "blind",
    	maxWidth:800,
        maxHeight: 500,
        width: 800,
        height: 500,
        fluid: true,
        show: {effect: 'fade', duration: 500}
    	}).css("background","#FFFFFF");

    // next add the onclick handler
    $("#sandwichmenu").click(function() {
      $("#dialog").dialog("open");
      $(".ui-dialog-titlebar").hide();
      $('.ui-widget-overlay').click(function() { $("#dialog").dialog("close"); });
      return false;
    });
    
	// on window resize run function
	$(window).resize(function () {
	     fluidDialog();
	});

});