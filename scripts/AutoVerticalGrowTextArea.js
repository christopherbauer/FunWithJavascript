$(document).ready(function() {
	$('table tr').on('focus', 'input,textarea', function(event) {
		var $blurFrom = $(event.delegateTarget);
		$blurFrom.css("background-color","yellow");
		
		$blurFrom.find("textarea[cols]").each(function(i, element) {
			expandHeight($(element));
		});
	});
	$('table tr').on('focusout', 'input,textarea', function(event) {
		var $blurFrom = $(event.delegateTarget);
		$blurFrom.css("background-color","white");
		
		$blurFrom.find("textarea[cols]").each(function(i, element) {
			collapseHeight($(element));
		});
	});
	 
	$("table tr textarea[cols]").on("keyup", function(){
		expandHeight($(this));
	});

	function expandHeight($this){
		var rows = ($this.val().length / ($this.prop("cols")-2) + 1);
		$this.prop("rows",rows);
	}
	function collapseHeight($this){
		$this.prop("rows", 1);
	}
});