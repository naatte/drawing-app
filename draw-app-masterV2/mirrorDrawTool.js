function mirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.jpg";

	let directionButtonKeyDetection = 0;
	let sliderValue = 5;
	let currentFrame = 1;
	//which axis is being mirrored (x or y) x is default
	this.axis = "x";
	//line of symmetry is halfway across the screen
	this.lineOfSymmetry = width / 2;

	//this changes in the jquery click handler. So storing it as
	//a variable self now means we can still access it in the handler
	var self = this;

	//where was the mouse on the last time draw was called.
	//set it to -1 to begin with
	var previousMouseX = -1;
	var previousMouseY = -1;

	//mouse coordinates for the other side of the Line of symmetry.
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;

	this.draw = function() {

		updatePixels();
		currentFrame = 1;
		
		//do the drawing if the mouse is pressed
		if (mouseIsPressed) {
			//if the previous values are -1 set them to the current mouse location
			//and mirrored positions
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
				previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
			}

			//if there are values in the previous locations
			//draw a line between them and the current positions
			else {
				// Capture the canvas state before drawing
		
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;

				//these are for the mirrored drawing the other side of the
				//line of symmetry
				var oX = this.calculateOpposite(mouseX, "x");
				var oY = this.calculateOpposite(mouseY, "y");
				line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
				previousOppositeMouseX = oX;
				previousOppositeMouseY = oY;
			}
			// remember the value of the slider
			strokeWeight(sliderValue);
		}
		//if the mouse isn't pressed reset the previous values to -1
		else if(previousMouseX != -1 && previousMouseY != -1 && previousOppositeMouseX != -1 && previousOppositeMouseY != -1 ){
			// let canvasState = get();
			// mirrorDrawUndoStack.push(canvasState);
			frames.push(frameCount);
			helpers.undo();
			previousMouseX = -1;
			previousMouseY = -1;

			previousOppositeMouseX = -1;
			previousOppositeMouseY = -1;
		}

		//after the drawing is done save the pixel state. We don't want the
		//line of symmetry to be part of our drawing

		loadPixels();

		select("#UndoButton").mouseClicked(function(){
			if(currentFrame != 0){
				currentFrame = frameCount;
			}
			if(historyArr.length>=0 && currentFrame == frameCount){
				loadPixels();
				currentFrame = 0;
			}
		});

		select("#RedoButton").mouseClicked(function() {
			if(currentFrame != 0){
				currentFrame = frameCount;
			}
			if(historyArr.length>=0 && currentFrame == frameCount){
				loadPixels();
				currentFrame = 0;
			}
		});

		//push the drawing state so that we can set the stroke weight and colour
		push();
		strokeWeight(3);
		stroke('red');
		// draw the line of symmetry
		if (this.axis == "x") {
			
			line(width / 2, 0, width / 2, height);

			
		} else {

			line(0, height / 2, width, height / 2);

		}
		// return to the original stroke
		pop();
	
	};

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (y or y)
	 *@return number: the opposite coordinate
	 */
	this.calculateOpposite = function(n, a) {
		//if the axis isn't the one being mirrored return the same
		//value
		if (a != this.axis) {
			return n;
		}

		//if n is less than the line of symmetry return a coorindate
		//that is far greater than the line of symmetry by the distance from
		//n to that line.
		if (n < this.lineOfSymmetry) {
			return this.lineOfSymmetry + (this.lineOfSymmetry - n);
		}

		//otherwise a coordinate that is smaller than the line of symmetry
		//by the distance between it and n.
		else {
			return this.lineOfSymmetry - (n - this.lineOfSymmetry);
		}
	};


	//when the tool is deselected update the pixels to just show the drawing and
	//hide the line of symmetry. Also clear options
	this.unselectTool = function() {
		updatePixels();
		//clear options
		select(".options").html("");
		// if this tool is unselected deactivate the erase stroke button
		directionButtonKeyDetection = 0;
		helpers.mirrorFlag = 0;
	};

	//adds a button and click handler to the options area. When clicked
	//toggle the line of symmetry between horizonatl to vertical
	this.populateOptions = function() {
		select(".options").html("<button id='directionButton'>Make Horizontal</button>" 
			+ "<div><input type='range' id='MirrorDrawStrokeSlider' min='5' max='20' value='5'></div>");
		
		//click handler
		select("#directionButton").mouseClicked(function() {
			var button = select("#" + this.elt.id);
			if (self.axis == "x") {
				self.axis = "y";
				self.lineOfSymmetry = height / 2;
				button.html('Make Vertical');
			} else {
				self.axis = "x";
				self.lineOfSymmetry = width / 2;
				button.html('Make Horizontal');
			}
		});

		select("#MirrorDrawStrokeSlider").input(function() {
            sliderValue = this.value();
        });

		select("#MirrorDrawStrokeSlider").value(sliderValue);

		select("#MirrorDrawStrokeSlider").changed(function() {
			directionButtonKeyDetection = 0;
		});

		select("#directionButton").mouseClicked(function(){
			directionButtonKeyDetection = 1;
		});
	};


}