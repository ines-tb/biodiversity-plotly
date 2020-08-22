function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
};

function buildMetadata(sample){
    console.log("Sample displayed: " + sample);

    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray  = metadata.filter(sampleElement => sampleElement.id == sample);
        var result = resultArray [0];
        var PANEL = d3.select("#sample-metadata");

        // Clear panel before assigning
        PANEL.html("");

        Object.entries(result).forEach(([key,value]) => {
            PANEL.append("h6").text(key.toUpperCase() + " : " + value);       
        });

    })
};

function buildCharts(sample){

}

init();
