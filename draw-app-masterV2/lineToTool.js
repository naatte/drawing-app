//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the 
//pixel array.
function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";

	let sliderValue = 5;

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;

	//draws the line to the screen 
	this.draw = function(){

		//only draw when mouse is clicked
		if(mouseIsPressed){
			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				//save the current pixel Array
				loadPixels();
			} else {
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				updatePixels();
				//draw the line
				line(startMouseX, startMouseY, mouseX, mouseY);
			}

			// remember slider value
			strokeWeight(sliderValue);
		} else if(drawing){
			//save the pixels with the most recent line and reset the
			//drawing bool and start locations
			loadPixels();
			helpers.undo();
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};

	this.unselectTool = function() {
		//clear options
		select(".options").html("");
	};

    this.populateOptions = function() {
        // creates a slider for controlling spray can size
        select(".options").html("<input type='range' id='LineToToolStrokeSlider' min='5' max='20' value='5'>");

        // if the slider is used, update sliderValue with the new value
        select("#LineToToolStrokeSlider").input(function() {
            sliderValue = this.value();
        });

        // this line of code enables the slider position to be portrayed accurately
        select("#LineToToolStrokeSlider").value(sliderValue);
	};

}
