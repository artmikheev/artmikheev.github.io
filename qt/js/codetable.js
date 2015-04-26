function codeTable(codetable) {
	var self=this;
	codetable = $(codetable);
	self.files = codetable.find("td.files ul li a");
	self.fileContents = codetable.find("td.contents div.content");
	
	function getFileAttribute(filelink) {
		return $(filelink).attr("data-file");
	}
	
	self.currentFile = getFileAttribute(self.files.filter(".selected"));
	
	function selectFile(filename) {
		self.currentFile = filename;
		$.each(self.files, function(k,i) {
			var f = getFileAttribute(i);
			if(f == filename) {
				$(i).addClass("selected");
			} else {
				$(i).removeClass("selected");
			}
		});
		
		$.each(self.fileContents, function(k,i) {
			var f = getFileAttribute(i);
			if(f == filename) {
				$(i).addClass("selected");
			} else {
				$(i).removeClass("selected");
			}
		});
	}

	function filelinkClickHandler(el) {
		var filename = getFileAttribute(el);
		if(self.currentFile!=filename) {
			selectFile(filename);
		}
	}
	
	selectFile(self.currentFile);
	self.files.click(function() {filelinkClickHandler(this);});
}
