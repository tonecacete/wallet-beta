import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {

  constructor(
    // private router:Router
  ) { }

  private chartData;

  setData(data){
    this.chartData = data;
  }

  getData(){
    let temp = this.chartData;
    this.clearData();
    return temp;
  }

  clearData(){
    this.chartData = undefined;
  }

}
