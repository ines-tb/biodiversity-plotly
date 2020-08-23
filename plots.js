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
    
    optionChanged(selector.property("value"));

})}

function optionChanged(newSample) {
  
  d3.json("samples.json").then((data) => {
    buildMetadata(newSample,data);
    buildCharts(newSample,data);
  })
};

function buildMetadata(sample,data){
    
    console.log("Sample displayed: " + sample);

    var metadata = data.metadata;
    var resultArray  = metadata.filter(sampleElement => sampleElement.id == sample);
    var result = resultArray [0];
    var PANEL = d3.select("#sample-metadata");

    // Clear panel before assigning
    PANEL.html("");

    Object.entries(result).forEach(([key,value]) => {
        PANEL.append("h6").text(key.toUpperCase() + " : " + value);
    }); 


};

function buildCharts(sample,data){

    var samples = data.samples;
    var resultArray  = samples.filter(sampleElement => sampleElement.id == sample);
    var result = resultArray [0];

    // BAR CHART:
    // Top ten bacterial species
    
    var topNames = result.otu_ids.slice(0,10).reverse().map(id => "OTU " + id);
    var topValues = result.sample_values.slice(0,10).reverse();
    var topLabels = result.otu_labels.slice(0,10);

    var trace1 = {
        y: topNames,
        x: topValues,
        text: topLabels,
        type: "bar",
        orientation: "h"
    };

    var plotData1 = [trace1];

    var layout1 = {
        title: "Top 10 Bacterial Cultures Found"
    }
    
    Plotly.newPlot("bar", plotData1, layout1);
    

    // BUBBLE CHART 
    // All bacterial found

    var trace2 = {
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: 'markers',          
        marker: {
          size: result.sample_values,
          color: result.otu_ids              
        }
    }
      
    var plotData2 = [trace2];
    
    var layout2 = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false
    };

    Plotly.newPlot('bubble', plotData2, layout2);

    // GAUGE:
    // Gauge for the weekly washing frequency
    
    var metadata = data.metadata;
    var resultArray  = metadata.filter(sampleElement => sampleElement.id == sample);
    var result = resultArray[0];
    var gaugeValue = result.wfreq;

    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: gaugeValue,
          title: { 
              text: "Belly Button Washing Frequency <br> Scrubs per week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "snow"},
              { range: [1, 2], color: "cornsilk"},
              { range: [2, 3], color: "linen"},
              { range: [3, 4], color: "PaleGoldenRod" },
              { range: [4, 5], color: "Khaki" },
              { range: [5, 6], color: "darkKhaki" },
              { range: [6, 7], color: "darkSeaGreen" },
              { range: [7, 8], color: "mediumseagreen" },
              { range: [8, 9], color: "SeaGreen" },
            ]
          }
          
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 }};

      Plotly.newPlot('gauge', data, layout);
    
}

init();
