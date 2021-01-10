import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as CanvasJS from 'src/assets/canvas/canvasjs.min.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() totalCoinsList: [];
  chart = null;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.createChart();
  }

  createChart() {
    console.log("coiso")
  	this.chart = new CanvasJS.Chart("chartContainer", {
  		theme: "light2",
  		animationEnabled: true,
  		exportEnabled: true,
  		title:{
  			text: "Balanço"
  		},
  		data: [{
  			type: "pie",
  			showInLegend: true,
  			toolTipContent: "{y} <b>{name}</b>  (#percent%)",
  			indexLabel: "{name} - #percent%",
  			dataPoints: []
  		}]
  	});
    this.defineDataPoints();
  	this.chart.render();
  }

  defineDataPoints() {
    rows: [];
    if (this.totalCoinsList.length) {
      for(let row of this.totalCoinsList){
        console.log(row['quantidade']);
        this.chart.options.data[0].dataPoints.push({ y:row['quantidade'], name: row['moeda']});
      }
    }
  }

}
