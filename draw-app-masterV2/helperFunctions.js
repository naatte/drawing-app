function HelperFunctions() {
	let flag = 0
	//Jquery click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {
		background(255, 255, 255);
		//call loadPixels to update the drawing state
		//this is needed for the mirror tool
		loadPixels();
	});

	//event handler for the save image button. saves the canvsa to the
	//local file system.
	select("#saveImageButton").mouseClicked(function() {
		saveCanvas("myPicture", "jpg");
	});

	select("#UndoButton").mouseClicked(function() {
		loadPixels();
		flag = 1;

		if(historyArr.length > 0){
			if(historyArr.length-1 > 0){
				image(historyArr[historyArr.length - 2],0,0);
				if(redoArr.length == 0){
					redoArr.push(historyArr[historyArr.length - 1]);
				}
				redoArr.push(historyArr[historyArr.length - 2]);
				historyArr.pop();
			} else {
				background(255, 255, 255);
				redoArr.push(historyArr[0]);
				historyArr.pop();
			}
		}
	});

	select("#RedoButton").mouseClicked(function() {
		if(helpers.disappearFlag != 1){
			loadPixels();
			if(redoArr.length > 0){
				if(flag == 1 && historyArr.length > 0){
					redoArr.pop();
					flag = 0;
				}
				image(redoArr[redoArr.length - 1],0,0);
				historyArr.push(redoArr[redoArr.length - 1]);
				redoArr.pop();
			}
		}
	});

	this.undo = function(){
		loadPixels();
		let spAddress = ((mouseY*width+mouseX)*4);

		const img = get();

		if(spAddress >= 0 && spAddress < pixels.length && mouseX >= 0 && mouseY >= 0){
			historyArr.push(img);
		}
	}
}

