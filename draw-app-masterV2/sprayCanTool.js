function SprayCanTool(){
	
	this.name = "sprayCanTool";
	this.icon = "assets/sprayCan.jpg";

	let sliderValue = 1, flag = 0;;

	var points = 13;
	var spread = 10;

	this.draw = function(){
		if(mouseIsPressed){
			if(flag == 0){
				flag = 1;
			} else {
				strokeWeight(sliderValue);
				for(var i = 0; i < points; i++){
					point(random(mouseX-spread, mouseX + spread), random(mouseY-spread, mouseY+spread));
				}
			}
		} else if(flag != 0){
			helpers.undo();
			flag = 0;
		}
	};

	this.unselectTool = function() {
		//clear options
		select(".options").html("");
	};

    this.populateOptions = function() {
        // creates a slider for controlling spray can size
        select(".options").html("<input type='range' id='SprayCanStrokeSlider' min='1' max='20' value='1'>");

        // if the slider is used, update sliderValue with the new value
        select("#SprayCanStrokeSlider").input(function() {
            sliderValue = this.value();
        });

        // this line of code enables the slider position to be portrayed accurately
        select("#SprayCanStrokeSlider").value(sliderValue);
	};
}