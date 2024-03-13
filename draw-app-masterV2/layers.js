// function to create layers
// code written by me
// work in progress, still need to add switch layers html and css
function Layers(){
    this.name = "layers";
    this.icon = "assets/layers.png";

    this.layers = [];
    this.currentLayerIndex = 0;
    //buffer to store drawn pixels
    this.originalPixels = null;

    //method to create the layer
    this.createLayer = function(){
        this.layers.push(createGraphics(width,height));
    }

    //method to switch to a different layer
    this.switchLayer = function(index){
        this.currentLayerIndex = index;
    }

    //gets the current layer
    this.currentLayer = function(){
        return this.layers[this.currentLayerIndex];
    }

    //copies the content of the current layer to pixels buffer
    this.copyOriginalPixels = function(){
        if(!this.originalPixels){
            this.originalPixels = createImage(width,height);
        }
        this.originalPixels.copy(this.currentLayer(),0,0,width,height,0,0,width,height);
    }

    //draws all the layers
    this.draw = function(){
        for(var i = 0; i < this.layers.length; i++){
            image(this.layers[i],0 ,0);
        }
    }

    //sets up initial layer
    this.setupLayer = function(){
        this.createLayer();        
        this.switchLayer(0);       
        this.copyOriginalPixels(); 
    }

}

