(function() {
	"use strict";


	var pageSize = 3;
	var page = 0;
	var itemCount = 0;

	//**********************DELME
	for(var i = 0; i < 20; i++) {
		$("#fixed").append("<div data-rank=\""+i+"\">"+(i+1)+"</div>");
	}
	//**********************DELME

	refreshItemCount();

	$("#next").on("click",function() {
		if((page+1)*pageSize < itemCount){
			page++;
		}
		
		scrollTo();
	});
	$("#previous").on("click",function() {
		if(page > 0) {
			page--;
		}
		
		scrollTo();
	});

	function refreshItemCount() {
		itemCount = $("#fixed div[data-rank]").length;
	}

	function scrollTo() {
		var $scrollElement = $($("#fixed div[data-rank='"+[page * pageSize]+"'"));
		
		var layout = ($scrollElement.outerWidth(true)-$scrollElement.innerWidth()) / 2;
			
		var pageAdjustment = page > 0 ? layout : 0;
		
		var $parent = $scrollElement.parent();
		
		var elementScrollLeft = ($scrollElement.position().left - layout) + $parent.scrollLeft() + pageAdjustment - $parent.offset().left;
		
		$("#fixed").stop().animate({ scrollLeft: elementScrollLeft }, 1000);
	}

})();