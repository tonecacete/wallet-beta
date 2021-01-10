import { Component, OnInit } from '@angular/core';
import { PurchaseModel } from '../shared/models/purchase.model';
import { TotalCoinsModel } from '../shared/models/totalCoins.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  addCoin = false;
  coinInserted = false;
  coinCanceled = false;
  //cancel = false;
  // fields
  id = 0;
  moeda = '';
  quantidade = null;
  investimento = null;
  taxas = null;
  investimentoReal = 0;
  preco = 0;
  coinDate = new Date().toISOString().slice(0, 10);

  purchase: PurchaseModel;
  purchases: PurchaseModel[] = [];
  diffCoins = [];
  totalCoins: TotalCoinsModel;
  totalCoinsList: TotalCoinsModel[] = [];

  purchaseDeleted = false;

  constructor() {

  }

  ngOnInit(): void {

  }

  addCoins(){
    this.addCoin = true;
    this.coinInserted = false;
    this.coinCanceled = false;
  }

  insertCoin(){
    this.purchase = new PurchaseModel();
    this.purchase.id = (this.id += 1);
    this.purchase.moeda = this.moeda;
    this.purchase.quantidade = this.quantidade;
    this.purchase.investimento = this.investimento;
    this.purchase.taxas = this.taxas;
    this.purchase.investimentoReal = this.investimentoReal;
    this.purchase.preco = this.preco;
    this.purchase.coinDate = this.formatDate(this.coinDate);
    this.purchases.push(this.purchase);
    this.purchases = Object.assign([], this.purchases);
    this.setOwnedCoins();
    this.clearFields();
    this.coinInserted = true;
  }

  setOwnedCoins(){
    this.totalCoins = new TotalCoinsModel();
    if (this.purchases.length) {
      let distinctCoins = this.purchases.filter((coin, i, arr) => arr.findIndex(t => t.moeda === coin.moeda) === i);
      for (let row of distinctCoins) {
        this.totalCoins.moeda = row.moeda;
        this.totalCoins.investimento = this.calculateTotalInvest(row.moeda);
        this.totalCoins.quantidade = this.calculateQuantity(row.moeda);
        this.totalCoins.investimentoReal = this.calculateTotalInvestReal(row.moeda);
      }

      for (let row of this.totalCoinsList){
        if (row.moeda === this.moeda) {
          this.totalCoins.moeda = row.moeda;
          this.totalCoins.investimento = row.investimento + this.investimento;
          this.totalCoins.quantidade = row.quantidade + this.quantidade;
          this.totalCoins.investimentoReal = row.investimentoReal + this.investimentoReal;
        }
      }

      if (this.totalCoinsList.length && !this.purchaseDeleted) {
        this.totalCoinsList = this.totalCoinsList.filter(x => this.moeda !== x.moeda);
      }else{
        this.totalCoinsList = [];
      }
      this.totalCoinsList.push(this.totalCoins);
      this.totalCoinsList.sort((a,b)=>a.moeda.localeCompare(b.moeda));
    }else{
      this.totalCoinsList = [];
    }
  }

  calculateQuantity(coin:any){
    let quantidade = 0;
    for (let row of this.purchases) {
      if (row.moeda == coin) {
        quantidade += row.quantidade;
      }
    }
    return quantidade;
  }

  calculateTotalInvest(coin:any){
    let totalInvest = 0;
    for (let row of this.purchases) {
      if (row.moeda == coin) {
        totalInvest += row.investimento;
      }
    }
    return totalInvest;
  }

  calculateTotalInvestReal(coin:any){
    let totalInvestReal = 0;
    for (let row of this.purchases) {
      if (row.moeda == coin) {
        totalInvestReal += row.investimentoReal;
      }
    }
    return totalInvestReal;
  }

  cancelCoin(){
    this.clearFields();
    this.coinCanceled = true;
  }

  coinUpperCase(event:any) {
    console.log(event);
    this.moeda=event.target.value.toUpperCase();
  }

  clearFields(){
    this.moeda = '';
    this.quantidade = null;
    this.investimento = null;
    this.taxas = null;
    this.investimentoReal = 0;
    this.preco = 0;
    this.coinDate = new Date().toISOString().slice(0, 10);
  }

  deleteTableItem(id:any){
      if (confirm("Are you sure you want to delete")){
        this.purchases = this.purchases.filter(row => row.id != id);
      }
      this.purchaseDeleted = true;
      this.setOwnedCoins();
      this.purchaseDeleted = false;
   }

  formatDate(coinDate:any){
    return this.coinDate.split('-').reverse().join("-");
  }

  calcInvestAndPrice(event:any){
    if((event.target as Element).id == "investimento"){
      this.investimentoReal = event.target.value - this.taxas;
    }else if((event.target as Element).id == "taxas"){
      if(event.target.value == ""){
        this.investimentoReal = this.investimento - 0;
      }else{
        this.investimentoReal = this.investimento - this.taxas;
      }
    }
    this.preco = this.investimentoReal / this.quantidade;
  }
}
