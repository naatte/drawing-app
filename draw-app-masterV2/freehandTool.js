function FreehandTool(){
	//set an icon and a name for the object
	this.icon = "assets/freehand.jpg";
	this.name = "freehand";
	this.getColor = getColor;
	this.setColor = setColor;
	this.getNeighbors = getNeighbors;
	this.colorOptions = colorOptions;

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	var previousMouseX = -1;
	var previousMouseY = -1;

	let colorOverrideKeyDetection = 0, cancelOverrideKeyDetection = 0, disappearModeKeyDetection = 0, appearKeyDetection = 0;
	let sliderValue = 5;

	let funArray = [], arrayOfArraysUndo = [], arrayOfArraysRedo = [], cancelArr = [];
	let undoIndex = -1, redoIndex = -1;

	this.draw = function(){
		//loadPixels();
		//if the mouse is pressed
		if(mouseIsPressed){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.

			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{
				//bresenham(previousMouseX,previousMouseY,mouseX,mouseY);
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}

			// remember stroke weight
			strokeWeight(sliderValue);
		} else if(colorOverrideKeyDetection == 1){
			colorOverride();
			colorOverrideKeyDetection = 0;
		} else if(cancelOverrideKeyDetection == 1){
			cancelOverride();
			cancelOverrideKeyDetection = 0;
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		else if(previousMouseX != -1 && previousMouseY != -1 && disappearModeKeyDetection == 1){
			disappearMode(previousMouseX, previousMouseY);
			previousMouseX = -1;
			previousMouseY = -1;
		} else if(previousMouseX != -1 && previousMouseY != -1){
			helpers.undo();
			previousMouseX = -1;
			previousMouseY = -1;
		}

	};

	this.unselectTool = function() {
		//clear options
		select(".options").html("");
		disappearModeKeyDetection = 0;
		appearKeyDetection = 0;
		helpers.disappearFlag = 0;
		funArray = [];
		select("#UndoButton").html("Undo");
	};

	this.populateOptions = function() {
        // creates a slider for controlling stroke weight
        select(".options").html("<div><button id='DisappearModeOption'>Disappear Mode</button>" 
			+ "<button id='AppearOption'>Appear</button>"
			+ "<button id='ExitDisappearModeOption'> Exit Disappear Mode</button></div>"
			+ "<div><button id='OverridePixelsOption'>Override Pixels</button>" 
			+ "<button id='CancelOverrideOption'>Cancel Override</button></div>"
			+ "<div><input type='range' id='FreeHandStrokeSlider' min='5' max='20' value='5'></div>");

        // if the slider is used, update sliderValue with the new value
        select("#FreeHandStrokeSlider").input(function() {
            sliderValue = this.value();
        });

        // this line of code enables the slider position to be portrayed accurately
        select("#FreeHandStrokeSlider").value(sliderValue);

		select("#OverridePixelsOption").mouseClicked(function(){
            colorOverrideKeyDetection = 1;
        });

		select("#CancelOverrideOption").mouseClicked(function(){
            cancelOverrideKeyDetection = 1;
        });

		select("#DisappearModeOption").mouseClicked(function(){
            disappearModeKeyDetection = 1;
			helpers.disappearFlag = 1;
			select("#UndoButton").html("Disappear Undo");
        });

		select("#AppearOption").mouseClicked(function(){
			appearKeyDetection = 1;
			funArray = arrayOfArraysUndo.flat();
			if(disappearModeKeyDetection == 1){
				loadPixels();
            	for(let i = 0; i < funArray.length; i+=4){
					pixels[funArray[i]] = funArray[i+1];
					pixels[funArray[i] + 1] = funArray[i+2];
					pixels[funArray[i] + 2] = funArray[i+3];
				}
				updatePixels();
			}
        });

		select("#ExitDisappearModeOption").mouseClicked(function(){
            disappearModeKeyDetection = 0;
			appearKeyDetection = 0;
			helpers.disappearFlag = 0;
			funArray = [];
			select("#UndoButton").html("Undo");
        });

		select("#UndoButton").mouseClicked(function() {
			if(disappearModeKeyDetection == 1){
				disappearUndo();
			}
		});

		select("#RedoButton").mouseClicked(function() {
			if(disappearModeKeyDetection == 1){
				disappearRedo();
			}
		});

	};

	function getColor(pLocation){
        return color(pixels[pLocation],pixels[pLocation+1],pixels[pLocation+2]);
    }

	function setColor(pLocation,r,g,b){
        pixels[pLocation] = r;
        pixels[pLocation+1] = g;
        pixels[pLocation+2] = b;
    }

	function getNeighbors(p){
        const ns = [] //ns = neighbors

		// Define offsets for a 3x3 grid
        const offsets = [-4, 0, 4, -width * 4, width * 4, -(width * 4) - 4, -(width * 4) + 4, (width * 4) - 4, (width * 4) + 4];

        // Add neighbors using offsets
        for (let i = 0; i < offsets.length; i++) {
            const neighbor = p + offsets[i];
            if (neighbor >= 0 && neighbor < pixels.length) {
            	ns.push(neighbor);
            }
        }

        return ns;
    }

	function colorOptions(){
        const theColorOptions = new Set([
            "rgb(0,0,0,1)", "rgb(192,192,192,1)", "rgb(128,128,128,1)", "rgb(128,0,0,1)", "rgb(255,0,0,1)", 
            "rgb(128,0,128,1)", "rgb(255,165,0,1)", "rgb(255,192,203,1)", "rgb(255,0,255,1)", "rgb(0,128,0,1)", 
            "rgb(0,255,0,1)", "rgb(128,128,0,1)", "rgb(255,255,0,1)", "rgb(0,0,128,1)", "rgb(0,0,255,1)", 
            "rgb(0,128,128,1)", "rgb(0,255,255,1)", "rgb(255,255,255,1)"
        ]);
        return theColorOptions;
    }

	var colorOverride = function(){
        const colorOptions = [[0,0,0], [192,192,192], [128,128,128], [128,0,0], [255,0,0], 
            [128,0,128], [255,165,0], [255,192,203], [255,0,255], [0,128,0], [0,255,0], 
            [128,128,0], [255,255,0], [0,0,128], [0,0,255], [0,128,128], [0,255,255]];

        loadPixels();

        for(var i=0; i<pixels.length; i+=4){
            const pixelColor = [pixels[i], pixels[i+1], pixels[i+2]];
            for(var j=0; j<colorOptions.length; j++){
				if(pixelColor[0] === colorOptions[j][0] && pixelColor[1] === colorOptions[j][1] && pixelColor[2] === colorOptions[j][2]){
                    const randomRed = Math.floor(Math.random() * (250 - 0) + 0);
                    const randomGreen = Math.floor(Math.random() * (250 - 0) + 0);
                    const randomBlue = Math.floor(Math.random() * (250 - 0) + 0);

					cancelArr.push(i, i+1, i+2, pixels[i], pixels[i+1], pixels[i+2]);

					pixels[i] = randomRed;
        			pixels[i+1] = randomGreen;
        			pixels[i+2] = randomBlue;
                }
            }
        }
        updatePixels();
    }

	var cancelOverride = function(){
		loadPixels();
		for(var k=0; k<cancelArr.length; k+=6){
			pixels[cancelArr[k]] = cancelArr[k+3];
			pixels[cancelArr[k+1]] = cancelArr[k+4];
			pixels[cancelArr[k+2]] = cancelArr[k+5];
		}
		cancelArr = [];
		updatePixels();
	}

	var disappearMode = function(x, y){
        loadPixels();
        const spAddress = (y*width+x)*4;  // spAddress is the address of the pixel where your mouse is
        const startColor = getColor(spAddress);  // start color is the color where your mouse is
 
        const toFill = [];
		let holdingArr = [];
        toFill.push(spAddress);
        const white = color(255,255,255);

        while(toFill.length){
            const p = toFill.pop();
            const pColor = getColor(p); //getColor(toFill.pop())
            const ns = getNeighbors(p);

			let breakFlag = 0;

			let checkedPixels = new Set([]);

			if(checkedPixels.has(p)){
				breakFlag = 1;
			}

            if(red(pColor) === red(startColor) && green(pColor) === green(startColor) && blue(pColor) === blue(startColor)
                && !(red(pColor) === red(white) && green(pColor) === green(white) && blue(pColor) === blue(white))
				&& breakFlag == 0){

				checkedPixels.add(p);
                holdingArr.push(p, red(startColor), green(startColor), blue(startColor));
				
                setColor(p,255,255,255);

                for (var i = 0; i < ns.length; i++) {
					nsColor = getColor(ns[i]);
					if(red(nsColor) === red(startColor) && green(nsColor) === green(startColor) && blue(nsColor) === blue(startColor)){
						if (ns[i] >= 0 && ns[i] < pixels.length) {
							checkedPixels.add(ns[i]);
							toFill.push(ns[i]);
						}
					} else if(!colorOptions().has(nsColor.toString())){
						if (ns[i] >= 0 && ns[i] < pixels.length) {
							checkedPixels.add(ns[i]);
							toFill.push(ns[i]);
						}
					}
                }
            } else if(!colorOptions().has(pColor.toString()) && p >= 0 && p < pixels.length && breakFlag == 0){
				//funArray.push(p, red(pColor), green(pColor), blue(pColor));
				setColor(p,255,255,255);
			}
        }
		if((mouseY*width+mouseX)*4 >= 0 && (mouseY*width+mouseX)*4 < pixels.length){
			arrayOfArraysUndo.push(holdingArr);
			undoIndex++;
		}
		//console.log(undoIndex);
        updatePixels();
	}

	var disappearUndo = function(){
		if(undoIndex > -1 && arrayOfArraysUndo.length > 0 && appearKeyDetection == 1){
			loadPixels();
			for(var j=0; j<arrayOfArraysUndo[undoIndex].length; j+=4){
				setColor(arrayOfArraysUndo[undoIndex][j], 255, 255, 255);
			}
			arrayOfArraysRedo.push(arrayOfArraysUndo[undoIndex]);
			redoIndex++;
			arrayOfArraysUndo.pop();
			undoIndex--;
			updatePixels();
		} else if(undoIndex > -1 && arrayOfArraysUndo.length > 0 && appearKeyDetection == 0){
			arrayOfArraysRedo.push(arrayOfArraysUndo[undoIndex]);
			redoIndex++;
			arrayOfArraysUndo.pop();
			undoIndex--;
		}
	}

	var disappearRedo = function(){
		if(redoIndex > -1 && arrayOfArraysRedo.length > 0 && appearKeyDetection == 1){
			loadPixels();
			for(var j=0; j<arrayOfArraysRedo[redoIndex].length; j+=4){
				setColor(arrayOfArraysRedo[redoIndex][j], arrayOfArraysRedo[redoIndex][j+1], arrayOfArraysRedo[redoIndex][j+2], arrayOfArraysRedo[redoIndex][j+3]);
			}
			arrayOfArraysUndo.push(arrayOfArraysRedo[redoIndex]);
			undoIndex++;
			arrayOfArraysRedo.pop();
			redoIndex--;
			updatePixels();
		} else if(redoIndex > -1 && arrayOfArraysRedo.length > 0 && appearKeyDetection == 0){
			arrayOfArraysUndo.push(arrayOfArraysRedo[redoIndex]);
			undoIndex++;
			arrayOfArraysRedo.pop();
			redoIndex--;
		}
	}
	
}