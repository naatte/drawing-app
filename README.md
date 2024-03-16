Welcome!

If you'd like to download the code and give my drawing app a try, I believe the easiest way is to use visual studio code and install the extension called live server.       
If you are on windows, you only need to open the code in the folders called "draw-app-masterV2" and ".vscode." If you are on mac, you can open up the "__MACOSX/draw-app-masterV2" folder in VS code in place of the "draw-app-masterV2" folder.        
The only thing in the ".vscode" folder is a json file that enables you to open the drawing app locally in chrome.      

Below is an overview detailing the functionality of each file within "draw-app-masterV2," along with some identified shortcomings for each.   

sketch.js:     
  Description --> Creation of the canvas and the setup of toolbox, colorpalette, and the helperfunctions objects, as well as all the tool objects                      
  Shortcomings --> This file comes first in index.html, so every file after this one cannot access anything in the functions within this file                     

toolbox.js:     
  Description --> Creation of the tool images on the left side of the app. Responsible for tracking which tool is selected and showing a blue square around the tool image when it is selected             
  Shortcomings --> Small number of tools

colourPalette.js:      
  Description --> Creation of the colors seen in the bottom left corner of the app         
  Shortcomings --> Limited number of colors         

helperFunctions.js:      
  Description --> Contains the primary undo and redo functions used in every tool. Also has the clear button and save image button functionality                                
  Shortcomings --> None?                             

freehandTool.js:     
  Description --> Can be used to draw whatever you want. Has two cool options: (1) disappear mode where everything you draw is erased immediately and can make everything you drew reappear when you click "appear." (2) the override pixels option which just fills in every non-white pixel with a random color. Can be cancelled             
  Shortcomings --> I had to make my own undo and redo functions specifically for disappear mode since the general undo and redo functions work by capturing images when the mouse is released (what you draw disappears before the image can be captured)              

lineToTool.js:      
  Description --> Can be used to draw only straight lines        
  Shortcomings --> None?         

sprayCanTool.js:      
  Description --> Can be used to spray paint the canvas
  Shortcomings --> None?

mirrorDrawTool.js:     
  Description --> Draws whatever you're drawing on the opposite side of the canvas like a mirror reflection. The reflection can be over either the x or y axis (selected with a button)                                 
  Shortcomings --> Since the draw function is updated 60 times per second and updatePixels() has to be called at the top of the draw function, updatePixels() is called 60 times per second which overrides the captured images from undo/redo too quickly to be able to see. To overcome this, I had to put a select button option for both undo and redo and detect a single click and loadPixels() after each click                                     

eraser.js:     
  Description --> Can be used to erase a whole stroke, part of a stroke, or all of a single color on the screen                          
  Shortcomings --> The erase color option can take a few seconds if a large portion of the screen is covered in the color you want to erase. The erase stroke button only erases the color you clicked on until it see a different color. So if you have overlapping colors, it won't erase the entire stroke with one click                        

index.html:     
  Description --> A collection of the actual elements and images that you can interact with on the app. Any line of code after an arbitrary line of code in this file cannot see the arbitrary line of code (ie eraser.js cannot access anything in sketch.js)      
  Shortcomings --> Basic     

style.css:      
  Description --> Styling the elements and images in index     
  Shortcomings --> Basic     
