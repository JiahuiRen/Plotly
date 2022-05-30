function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildCharts2(firstSample);
      buildCharts3(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    buildCharts2(newSample);
    buildCharts3(newSample);
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0]; 
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var sampleLabels = result.otu_ids;
      var sampleValues = result.sample_values;
      var hoverText = result.otu_labels;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = sampleLabels.map(label => "OTU " + label).slice(0,10).reverse();
      var xticks = sampleValues.map(val => parseInt(val)).slice(0,10).reverse();
      var chartHoverText = hoverText.slice(0,10).reverse();
  
      
      console.log(yticks)
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h", 
      }];
        
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        showticklabels: true,
      }; 
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout); var bubbleTrace = {
        x: sampleLabels,
        y: sampleValues,
        text: hoverText,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: sampleLabels
        }
      }; 
      var bubbleData = [bubbleTrace];
      var bubbleLayout = {title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}, 
      hovermode: 'closest',
      hoverlabel: hoverText
        
      }; Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

   });
}

// Bar and Bubble charts 
// Create the buildCharts function.
function buildCharts2(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {

      // 1. Create the trace for the bubble chart.
      
      var bubbleData = {
        x: sampleLabels,
        y: sampleValues,
        text: hoverText,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: sampleLabels
        }
      };
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}, 
      hovermode: 'closest',
      hoverlabel: hoverText
        
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    });
}

//D3
// Create the buildChart function.
function buildCharts3(sample) {
    // Use d3.json to load the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);
  
      
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);  
      
      // 2. Create a variable that holds the first sample in the metadata array.
      var gaugeResult = gaugeArray[0];
  
      
  
      // 3. Create a variable that holds the washing frequency.
      var wfreqs = gaugeResult.wfreq;
      console.log(wfreqs)
     
     
      
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        value: wfreqs,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        gauge: {
          axis: {range: [null,10], dtick: "2"},
  
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ],
          dtick: 2
        }
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        automargin: true
       };
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }    