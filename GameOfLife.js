
// Variable Setup
var cols = 20,
    rows = 20,
    stopSignal;
    delay = 100;
    alive = [];


var buildGrid = function(row, col){
	var table = "";
	
	alive = [];
	for(var i = 0; i < row; i ++){
		table += "<tr>";
		alive.push([]);
		for(var j = 0; j < col; j ++){
			// only the index of table in html needs to be decoded.
			table += "<td id = " + (i * row + j) + "></td>"
			alive[i].push(0);
			
			// console.log(alive[i][j]);
		}
		table += "</tr>";
	}
	$("#gridTable").html(table);
	// for(var i = 0; i < row; i ++){
	// 	for(var j = 0; j < col; j ++){
	// 		$("#" + (i * row + j) + "").addClass("dead");
	// 	}
	// }
}

var reBuildGrid = function (){
	for(var i = 0; i < rows; i ++){
		for(var j = 0; j < cols; j ++){
			alive[i][j] = 0;
			if($("#" + (i * rows + j) + "").hasClass('live')){
				$("#" + (i * rows + j) + "").removeClass("live");
			}
			if($("#" + (i * rows + j) + "").hasClass('dead')){
				$("#" + (i * rows + j) + "").removeClass("dead");
			}
		}
	}
}

var liveNumAllDead = function(i, j, mode){
	var alive_point = 0;
	if(mode == "dead") alive_point = 0;
	else if(mode == "live") alive_point = 1;
	var live_num = 0;
	// console.log("i=", i, "j=", j);
	//if(0 <= i - 1 && i + 1 < rows && 0 <= j - 1 && j + 1 <= cols){
		live_num =     ((alive[i - 1] != undefined && alive[i - 1][j - 1] != undefined ) ? alive[i - 1][j - 1] : alive_point )
					 + ((alive[i - 1] != undefined ) ? alive[i - 1][j] : alive_point)
					 + ((alive[i - 1] != undefined  && alive[i - 1][j + 1] != undefined ) ? alive[i - 1][j + 1]  : alive_point )
					 + ((alive[i][j - 1] != undefined ) ? alive[i][j - 1] : alive_point )
					 + ((alive[i][j + 1] != undefined ) ? alive[i][j + 1] : alive_point )
					 + ((alive[i + 1] != undefined  && alive[i + 1][j - 1] != undefined ) ? alive[i + 1][j - 1] : alive_point )
					 + ((alive[i + 1] != undefined ) ? alive[i + 1][j] : alive_point )
					 + ((alive[i + 1] != undefined  && alive[i + 1][j + 1] != undefined ) ? alive[i + 1][j + 1] : alive_point);
	return live_num;
}


var oneIteration = function(){
	// one iteration
	// TODO: toroidal
	var mode = "dead";
	for(var i = 0; i < rows; i ++){
		for(var j = 0; j < cols; j ++){
			var live_num = liveNumAllDead(i, j, mode);
			// if alive is 1, it must be a live class.
			// 
			if(alive[i][j] == 1){
				if(live_num <= 1){
					// loneliness
					$("#" + (i * rows + j) + "").removeClass("live").addClass("dead");
				}else if(live_num <= 3){
					// remain live;
					continue;
				}else{
					// overpopulation;
					$("#" + (i * rows + j) + "").removeClass("live").addClass("dead");					
				}
			}else{
				if(live_num == 3){
					//genearation/
					if($("#" + (i * rows + j) + "").hasClass('dead')){
						$("#" + (i * rows + j) + "").removeClass("dead");
					}
					$("#" + (i * rows + j) + "").addClass("live");					
				}
			}
		}
	}
	// console.log("oneIteration");
	for(var i = 0; i < rows; i ++){
		for(var j = 0; j < cols; j ++){
			var state = $("#" + (i * rows + j) + "").attr("class");
			// console.log(state);
			if(state == "dead"){
				alive[i][j] = 0;
			}else if(state == "live"){
				alive[i][j] = 1;
			}
		}
	}	
}
var resetOp = function(){
	reBuildGrid();
}

var randomAlive = function(){
	var total_num = rows * cols;
	for(var i = 0; i < Math.floor(total_num * 0.15);  i ++){
		var index = Math.floor(Math.random() * total_num);
		var index_r = Math.floor(index / rows),
			index_c = index % rows;
		alive[index_r][index_c] = 1;
		$("#" + index + "").addClass("live");
	}
}

var oneStep = function(){
	oneIteration();
	stopSignal = setTimeout(oneStep, delay);
}
$(function() {
	
	// Build the Grid initially.  


	buildGrid(rows, cols);

	$("#sizeSlider").change(function() {
		rows = $(this).val();
		cols = $(this).val();
		buildGrid(rows, cols);
	});

	$("#speedSlider").change(function() {
		delay = Math.floor(1000 / $(this).val());
	});
	// click event for the table entry.
	$("#gridTable").delegate("td", "click", function(event){
		var click_r = Math.floor($(this).attr("id") / rows);
		var click_c = $(this).attr("id") % rows;
		if(event.ctrlKey){
			alive[click_r][click_c] = 0;
			if($(this).hasClass('live')){
				$(this).removeClass("live").addClass('dead');
			}
		}else if(event.shiftKey){
			alive[click_r][click_c] = 1;
			if($(this).hasClass('dead')){
				$(this).removeClass("dead").addClass('live');
			}
		}else{
			$(this).toggleClass("live");
			alive[click_r][click_c] = !alive[click_r][click_c];
		}

		// console.log(alive[click_r][click_c], liveNumAllDead(click_r, click_c, "dead"),click_r,click_c);
	});

	// Start the game of life
	$("#random").click(function(){
		//reBuildGrid();
		clearInterval(stopSignal);
		resetOp();
		randomAlive();
	});
	$("#reset").click(resetOp);
	$("#start").click(function(){
		stopSignal = setTimeout(oneStep, delay);
	});
	
	$("#stop").click(function(){
		clearTimeout(stopSignal);
	});

});

