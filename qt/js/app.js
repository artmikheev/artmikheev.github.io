

$(function() {
	$.each($("table.codetable"), function(k,i) {
		new codeTable(i);
	});
	
	// Table of contents
	(function() {
		var tableofcontents = $("ul#tableofcontents");
		var chapters = $("h3");
		
		var links = [];
		var undefIndex=0;
		
		$.each(chapters, function(k, chap) {
			chap = $(chap);
			var id=chap.attr('id');
			var name = chap.html();
			
			if(id==undefined) {
				id="chap"+(undefIndex++);
				chap.attr('id', id);
			}
			links.push('<li><a href="#' + id + '">'+name+'</a></li>');
		});
		tableofcontents.html(links.join("\n"));
	})();
});
