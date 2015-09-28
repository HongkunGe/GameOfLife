function buildGrid(row, col){
	var table = "";
	
	for(var i = 0; i < row; i ++){
		table += "<tr>";
		for(var j = 0; j < col; j ++){
			table += "<td></td>"
		}
		table += "</tr>";
	}
	$("#gridTable").html(table);
}



$(function() {
	

	// Variable Setup
	var cols = 20,
	    rows = 20;
	 
	// Build the Grid initially.  
	buildGrid(cols, rows);

	$("#sizeSlider").change(function() {
		rows = $(this).val();
		cols = $(this).val();
		buildGrid(cols, rows);
	});

	// click event for the table entry.
	$("#gridTable").delegate("td", "click", function(){
		$(this).toggleClass("posChosen");
	});

	// Start the game of life

});

function game_start(){
	
}