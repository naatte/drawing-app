Welcome!

If you'd like to download the code and give my drawing app a try, I believe the easiest way is to use visual studio code and install the extension called live server. 
If you are on windows, you only need to open the code in the folders called "draw-app-masterV2" and ".vscode." If you are on mac, you can open up the "__MACOSX/draw-app-masterV2" folder in VS code in place of the "draw-app-masterV2" folder.
The only thing in the ".vscode" folder is a json file that enables you to open the drawing app locally in chrome.

Below is an overview detailing the functionality of each file within "draw-app-masterV2," along with some identified shortcomings for each.
sketch.js:
  Description --> 
  Shortcomings -->

toolbox.js:
  Description --> 
  Shortcomings -->

colourPalette.js:
  Description --> 
  Shortcomings -->

helperFunctions.js:
  Description --> 
  Shortcomings -->

freehandTool.js:
  Description --> 
  Shortcomings -->

lineToTool.js:
  Description --> 
  Shortcomings -->

sprayCanTool.js:
  Description --> 
  Shortcomings -->

mirrorDrawTool.js:
  Description --> 
  Shortcomings -->

eraser.js:
  Description --> 
  Shortcomings -->

index.html:
  Description --> A collection of the actual elements and images that you can interact with on the app. Any line of code after an arbitrary line of code in this file cannot see the arbitrary line of code (ie eraser.js cannot access anything in sketch.js)
  Shortcomings --> Basic

style.css:
  Description --> Styling the elements and images in index
  Shortcomings --> Basic
