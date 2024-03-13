
// eraser tool
function Eraser() {
    this.name = "eraser";
    this.icon = "assets/eraser.png";
    
    // create a variable to keep track of whether or not the erase stroke code should be running
    let eraseStrokeKeyDetection = 0, eraseColorKeyDetection = 0, flag = 0;
    // create a variable to hold the initial value of the slider. this will change in populate options when the slider is used
    let sliderValue = 1;

    this.draw = function() {
        //setpu.c.mouseMoved(getColorName);
        if(mouseIsPressed){
            if(flag == 0){
                flag = 1;
            } else {
                if (eraseStrokeKeyDetection == 0 && eraseColorKeyDetection == 0) {
                    strokeWeight(sliderValue);
                    erase();
                    line(pmouseX, pmouseY, mouseX, mouseY);
                    flag = 1;
                    noErase();
                } else if (eraseStrokeKeyDetection == 1){
                    eraseStroke(mouseX, mouseY);
                    flag = 1;
                } else if (eraseColorKeyDetection == 1){
                    eraseColor(mouseX, mouseY);
                    flag = 1;
                }
            }
        }else if(flag != 0){
            helpers.undo();
            flag = 0;
        } 
    }

    this.unselectTool = function() {
		//clear options
		select(".options").html("");

        // if this tool is unselected deactivate the erase stroke and erase color buttons
		eraseStrokeKeyDetection = 0;
        eraseColorKeyDetection = 0;
	};

    this.populateOptions = function() {
        // creates button option for erasing entire stroke and a slider for controlling eraser size
        select(".options").html("<div><button id='EraseStrokeOption'>Erase Stroke</button>" 
            + "<button id='EraseColorOption'>Erase Color</button></div>" 
            + "<div><input type='range' id='EraseStrokeSlider' min='1' max='20' value='1'></div>");

        // if the slider is used, update sliderValue with the new value
        select("#EraseStrokeSlider").input(function() {
            sliderValue = this.value();
        });

        // this line of code enables the slider position to be portrayed accurately
        select("#EraseStrokeSlider").value(sliderValue);

        // if the slider is selected or changed, the erase stroke and erase color code will be prevented from running
        select("#EraseStrokeSlider").changed(function() {
            eraseStrokeKeyDetection = 0;
            eraseColorKeyDetection = 0;
            select("#EraseColorOption").html("Erase Color");
        });

        // if the erase stroke button is clicked, run the code
        select("#EraseStrokeOption").mouseClicked(function(){
            eraseStrokeKeyDetection = 1;
            eraseColorKeyDetection = 0;
            select("#EraseColorOption").html("Erase Color");
        });

        // if the erase color button is clicked, run the code
        select("#EraseColorOption").mouseClicked(function(){
            eraseColorKeyDetection = 1;
            eraseStrokeKeyDetection = 0;
        });

        select("#defaultCanvas0").mouseMoved(function(){
            if(currentPixelColor() && eraseColorKeyDetection == 1){
                // update the erase color button text with the color the mouse is over
                select("#EraseColorOption").html("Erase All " + getColorName());
            }
        });
	};

    var eraseStroke = function(x, y){
        const colorOpts = freehand.colorOptions();
        colorOpts.delete("rgb(255,255,255,1)");
        
        loadPixels();
        const spAddress = getPixelAddress(x,y);  // spAddress is the address of the pixel where your mouse is
        const startColor = freehand.getColor(spAddress);  // start color is the color where your mouse is
 
        const toFill = [];
        toFill.push(spAddress);
        const white = color(255,255,255);

        while(toFill.length){
            const p = toFill.pop();
            const pColor = freehand.getColor(p); //getColor(toFill.pop())
            const ns = freehand.getNeighbors(p);

            if(red(pColor) === red(startColor) && green(pColor) === green(startColor) && blue(pColor) === blue(startColor)
                && !(red(pColor) === red(white) && green(pColor) === green(white) && blue(pColor) === blue(white))){

                freehand.setColor(p,255,255,255);

                for (var i = 0; i < ns.length; i++) {
                    if (ns[i] >= 0 && ns[i] < pixels.length) {
                        toFill.push(ns[i]);
                    }
                }
            } else if(!colorOpts.has(pColor.toString())){
                freehand.setColor(p, 255, 255, 255);
            }
        }
        updatePixels();
    }

    var eraseColor = function(x, y){
        loadPixels();
        const clickedPixel = getPixelAddress(x,y);  // spAddress is the address of the pixel where your mouse is
        const clickedColor = freehand.getColor(clickedPixel);
 
        const toFill = [], aliasFill = [];
        const white = color(255,255,255);

        for (var j=0; j<pixels.length; j+=4){
            const currentPixelColor = freehand.getColor(j);
            if(red(clickedColor) === red(currentPixelColor) && green(clickedColor) === green(currentPixelColor) && blue(clickedColor) === blue(currentPixelColor)
                && !(red(clickedColor) === red(white) && green(clickedColor) === green(white) && blue(clickedColor) === blue(white))){
                toFill.push(j);
            } 
        }

        let checkedPixels = new Set([]);

        while(toFill.length){
            const p = toFill.pop();
            const ns = freehand.getNeighbors(p);
                
            freehand.setColor(p,255,255,255);

            for (var i = 0; i < ns.length; i++) {
                const neighborColor = freehand.getColor(ns[i]);
                if(!freehand.colorOptions().has(neighborColor.toString()) && ns[i] >= 0 && ns[i] < pixels.length && !checkedPixels.has(ns[i])){
                    aliasFill.push(ns[i]);
                    checkedPixels.add(ns[i]);
                }
            }
        }
        
        for(var i=0; i<aliasFill.length; i++){
            const aliasColor = freehand.getColor(aliasFill[i]);
            if(!freehand.colorOptions().has(aliasColor.toString())){
                freehand.setColor(aliasFill[i],255,255,255);
            }
        }
        updatePixels();
    }

    // gets x and y coordinate of the pixel
    var getPixelAddress = function(x,y){
        // all the y coordinate above the pixel multiplied by the width of the canvas, add the x coordinate of the pixel and multiplied by rgba(4)
        return (y*width+x)*4;
    }

    var currentPixelColor = function(){
	    loadPixels();
	    let pixelAddress = (mouseY*width+mouseX)*4;
	    return color(pixels[pixelAddress],pixels[pixelAddress+1],pixels[pixelAddress+2]).toString();
    }

    var getColorName = function(){
	    const colorMap = {
		    "rgba(0,0,0,1)" : "Black",
		    "rgba(192,192,192,1)" : "Silver", 
		    "rgba(128,128,128,1)" : "Gray", 
		    "rgba(255,255,255,1)" : "White", 
		    "rgba(128,0,0,1)" : "Maroon", 
		    "rgba(255,0,0,1)" : "Red", 
		    "rgba(128,0,128,1)" : "Purple",
		    "rgba(255,165,0,1)" : "Orange", 
		    "rgba(255,192,203,1)" : "Pink", 
		    "rgba(255,0,255,1)" : "Fuchsia", 
		    "rgba(0,128,0,1)" : "Green", 
		    "rgba(0,255,0,1)" : "Lime", 
		    "rgba(128,128,0,1)" : "Olive", 
		    "rgba(255,255,0,1)" : "Yellow", 
		    "rgba(0,0,128,1)" : "Navy",
		    "rgba(0,0,255,1)" : "Blue", 
		    "rgba(0,128,128,1)" : "Teal", 
		    "rgba(0,255,255,1)" : "Aqua"
	    };

	    return colorMap[currentPixelColor()] || currentPixelColor();
    }

}
 