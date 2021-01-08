import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'src/assets/canvas/canvasjs.min.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	let chart = new CanvasJS.Chart("chartContainer", {
  		theme: "light2",
  		animationEnabled: true,
  		exportEnabled: true,
  		title:{
  			text: "Balanço"
  		},
  		data: [{
  			type: "pie",
  			showInLegend: true,
  			toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
  			indexLabel: "{name} - #percent%",
  			dataPoints: [
  				{ y: 450, name: "Food" },
  				{ y: 120, name: "Insurance" },
  				{ y: 300, name: "Traveling" },
  				{ y: 800, name: "Housing" },
  				{ y: 150, name: "Education" },
  				{ y: 150, name: "Shopping"},
  				{ y: 250, name: "Others" }
  			]
  		}]
  	});
  	chart.render();
  }

}
