import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ChartComponent } from './chart/chart.component';
import { PurchaseModel } from './shared/models/purchase.model';
import { TotalCoinsModel } from './shared/models/totalCoins.model';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [PurchaseModel,TotalCoinsModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
