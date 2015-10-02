
// Variable Setup
var cols = 20,
    rows = 20;

var stopSignal,
    alive = [];

var delay = 100,
    mode = "dead",
    longliness = 2,
    overpopulation = 3,
    radius = 1,
    upperbound = 4 * radius * radius + 4 * radius;
    generationMin = 3,
    generationMax = 3;


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

var liveNumAllDeadWithDefaultRadius = function(i, j){
	var live_num = 0;
	if(mode == "dead" || mode == "live"){
		var alive_point = 0;
		if(mode == "dead") alive_point = 0;
		else if(mode == "live") alive_point = 1;
		
		// console.log("i=", i, "j=", j);
		//if(0 <= i - 1 && i + 1 < rows && 0 <= j - 1 && j + 1 <= cols){
			live_num =     ((alive[i - 1] != undefined && alive[i - 1][j - 1] != undefined ) ? alive[i - 1][j - 1] : alive_point )
						 + ((alive[i - 1] != undefined ) ? alive[i - 1][j] : alive_point)
						 + ((alive[i - 1] != undefined && alive[i - 1][j + 1] != undefined ) ? alive[i - 1][j + 1]  : alive_point )
						 + ((alive[i][j - 1] != undefined ) ? alive[i][j - 1] : alive_point )
						 + ((alive[i][j + 1] != undefined ) ? alive[i][j + 1] : alive_point )
						 + ((alive[i + 1] != undefined && alive[i + 1][j - 1] != undefined ) ? alive[i + 1][j - 1] : alive_point )
						 + ((alive[i + 1] != undefined ) ? alive[i + 1][j] : alive_point )
						 + ((alive[i + 1] != undefined && alive[i + 1][j + 1] != undefined ) ? alive[i + 1][j + 1] : alive_point);		
	}else if(mode == "toroidal"){
			live_num =     ((alive[i - 1] != undefined && alive[i - 1][j - 1] != undefined ) ? alive[i - 1][j - 1] : (i != 0) ? alive[i - 1][cols - 1] : (j != 0) ? alive[rows - 1][j - 1] : alive[rows - 1][cols - 1])
						 + ((alive[i - 1] != undefined) ? alive[i - 1][j] : alive[rows - 1][j])
						 + ((alive[i - 1] != undefined && alive[i - 1][j + 1] != undefined ) ? alive[i - 1][j + 1] : (i != 0) ? alive[i - 1][0] : (j != cols - 1) ? alive[rows - 1][j + 1] : alive[rows - 1][0])
						 + ((alive[i][j - 1] != undefined) ? alive[i][j - 1] : alive[i][cols - 1] )
						 + ((alive[i][j + 1] != undefined) ? alive[i][j + 1] : alive[i][0] )
						 + ((alive[i + 1] != undefined && alive[i + 1][j - 1] != undefined ) ? alive[i + 1][j - 1] : (i != rows - 1) ? alive[i + 1][cols - 1] : (j != 0) ? alive[0][j - 1] : alive[0][cols - 1])
						 + ((alive[i + 1] != undefined) ? alive[i + 1][j] : alive[0][j] )
						 + ((alive[i + 1] != undefined && alive[i + 1][j + 1] != undefined ) ? alive[i + 1][j + 1] : (i != rows - 1) ? alive[i + 1][0] : (j != cols - 1) ? alive[0][j + 1] : alive[0][0]);								
	}

	return live_num;
}

var outIndex = function(a, b){
	var ta, tb;
	if(0 <= a && a < rows && 0 <= b && b < cols){
		ta = a; 
		tb = b;
	}else{
		if(0 <= a && a < rows){
			ta = a;
		}else{
			if(a < 0){
				ta = parseInt(rows) + parseInt(a);
			}else if(a >= rows){
				ta = parseInt(a) - parseInt(rows);
			}
		}
		if(0 <= b && b < cols){
			tb = b;
		}else{
			if(b < 0){
				tb = parseInt(cols) + parseInt(b);
			}else if(b >= cols){
				tb = parseInt(b) - parseInt(cols);
			}
		}
	}
	return [ta, tb];
}
var liveNum = function(i, j){
	var live_num = 0;
	if(mode == "dead") alive_point = 0;
	else if(mode == "live") alive_point = 1;
	for(var pr = -radius; pr <= radius; pr ++){
		for(var pc = -radius; pc <= radius; pc ++){
			if(pr == 0 && pc == 0) continue;
			if(mode == "dead" || mode == "live"){
				live_num += ((0 <= i + pr && i + pr < rows && 0 <= j + pc && j + pc < cols) ? alive[i + pr][j + pc] : alive_point );
			}else if(mode == "toroidal"){
				var nidx = outIndex(i + pr, j + pc);
				live_num += alive[nidx[0]][nidx[1]];
			}
			
		}
	}
	return live_num;
}
var oneIteration = function(){
	// one iteration
	// console.log(mode);
	for(var i = 0; i < rows; i ++){
		for(var j = 0; j < cols; j ++){
			var live_num = liveNum(i, j);
			// if alive is 1, it must be a live class.
			// 
			if(alive[i][j] == 1){
				if(live_num < longliness){
					// loneliness
					$("#" + (i * rows + j) + "").removeClass("live").addClass("dead");
				}else if(live_num <= overpopulation){
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

var nextStep = function(){
	oneIteration();
	stopSignal = setTimeout(nextStep, delay);
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
		reBuildGrid();
		randomAlive();
	});

	$("#reset").click(function(){
		reBuildGrid();
		clearTimeout(stopSignal);
	});

	$("#start").click(function(){
		$(this).attr("disabled", true);
		$("#step").attr("disabled", true);
		stopSignal = setTimeout(nextStep, delay);

	});
	
	/* stopped is for the first step regulation. 
	   stepAgain is for continous step regulation.
	   When (and only when) the automaton is stopped, the user should be provided with a way to advance the automaton by one step. */
	$("#step").click(function(){
		oneIteration();
	});

	$("#stop").click(function(){
		clearTimeout(stopSignal);
		$("#start").attr("disabled", false);
		$("#step").attr("disabled", false);
	});

	$("div#mode select").change(function(){
		mode = $(this).val();
	});

	// parameter of overpopulation, longliness, radius, generationMax and generationMin.
	/* After updating raduis, overpopulation and generationMax are limited upperbound,
		longliness and generationMin are choosen first, then overpopulation and generationMax
		have limited lowerbound.
	   */
	$("div#bound span#upper").text(upperbound);
	$("#radius").change(function(){
		radius = $(this).val();
		upperbound = parseInt(radius) * parseInt(radius) * 4 + parseInt(radius) * 4;
		$("div#bound span#upper").text(upperbound);
	});

	$("div#bound span#lowerOverPop").text(longliness);
	$("#lonely").change(function(){
		longliness = $(this).val();
		$("div#bound span#lowerOverPop").text(longliness);
	});

	$("#overPop").change(function(){
		overpopulation = $(this).val();
	});

	$("div#bound span#lowerGMax").text(generationMin);
	$("#gMin").change(function(){
		generationMin = $(this).val();
		$("div#bound span#lowerGMax").text(generationMin);
	});

	$("#gMax").change(function(){
		generationMax = $(this).val();
	});
});

