import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { PurchaseModel } from '../shared/models/purchase.model';
import { TotalCoinsModel } from '../shared/models/totalCoins.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, AfterViewChecked {
  addCoin = false;
  seeDetails = false;
  // fields
  id = 0;
  moeda = '';
  quantidade = null;
  investimento = null;
  taxas = null;
  investimentoReal = null;
  preco = null;
  coinDate = new Date().toISOString().slice(0, 10);

  purchase: PurchaseModel;
  purchases: PurchaseModel[] = [];
  diffCoins = [];
  totalCoins: TotalCoinsModel;
  totalCoinsList: TotalCoinsModel[] = [];
  totals: TotalCoinsModel[] = [];

  purchaseDeleted = false;
  purchaseToDelete: PurchaseModel[] = [];
  totalCoinsRowToDelete: TotalCoinsModel[] = [];

  constructor() {

  }

  ngOnInit(): void {

  }

  ngAfterViewChecked() {
    if (this.addCoin && this.moeda === '') {
      document.getElementById("moedaInput").focus();
    }
  }

  addCoins(){
    this.addCoin = true;
  }

  insertCoin(){
    this.purchase = new PurchaseModel();
    this.purchase.id = (this.id += 1);
    this.purchase.moeda = this.moeda;
    this.purchase.quantidade = this.quantidade ? this.quantidade : 0 ;
    this.purchase.investimento = this.investimento ? this.investimento : 0 ;
    this.purchase.taxas = this.taxas ? this.taxas : 0 ;
    this.purchase.investimentoReal = this.investimentoReal ? this.investimentoReal : 0 ;
    this.purchase.preco = this.preco ? this.preco : 0 ;
    this.purchase.coinDate = this.formatDate(this.coinDate);
    this.purchases.push(this.purchase);
    this.purchases = Object.assign([], this.purchases);
    this.addCoin = false;
    this.setOwnedCoins(this.moeda);
    this.clearFields();
  }

  seeBalanceInvest() {
    this.seeDetails = true;
  }
  closeDetails() {
    this.seeDetails = false;
  }

  setOwnedCoins(moeda:any){
    this.totalCoins = new TotalCoinsModel();

    if (this.purchases.length) {
      let distinctCoins = this.purchases.filter((coin, i, arr) => arr.findIndex(t => t.moeda === coin.moeda) === i);
      for (let row of distinctCoins) {
        this.totalCoins.moeda = row.moeda;
        this.totalCoins.quantidade = this.calculateQuantity(row.moeda);
        this.totalCoins.investimento = this.calculateTotalInvest(row.moeda);
        this.totalCoins.taxas = this.calculateTaxes(row.moeda);
        this.totalCoins.investimentoReal = this.calculateTotalInvestReal(row.moeda);
      }
      if (!this.purchaseDeleted) {
        for (let row of this.totalCoinsList){
          if (row.moeda === this.moeda) {
            this.totalCoins.moeda = row.moeda;
            this.totalCoins.quantidade = row.quantidade + this.quantidade;
            this.totalCoins.investimento = row.investimento + this.investimento;
            this.totalCoins.taxas = row.taxas + this.taxas;
            this.totalCoins.investimentoReal = row.investimentoReal + this.investimentoReal;
          }
        }
      }
      if (this.totalCoinsList.length && !this.purchaseDeleted) {
        this.totalCoinsList = this.totalCoinsList.filter(x => this.moeda !== x.moeda);
      }
      else if(this.totalCoinsList.length && this.purchaseDeleted && this.moeda == ""){
        this.totalCoinsRowToDelete = this.totalCoinsList.filter(x => moeda.moeda === x.moeda);
        this.totalCoins.moeda = this.totalCoinsRowToDelete[0].moeda;
        this.totalCoins.quantidade = this.totalCoinsRowToDelete[0].quantidade - moeda.quantidade;
        this.totalCoins.investimento = this.totalCoinsRowToDelete[0].investimento - moeda.investimento;
        this.totalCoins.taxas = this.totalCoinsRowToDelete[0].taxas - moeda.taxas;
        this.totalCoins.investimentoReal = this.totalCoinsRowToDelete[0].investimentoReal - moeda.investimentoReal;
        this.totalCoinsList = this.totalCoinsList.filter(x => moeda.moeda !== x.moeda);
      }
      else{
        this.totalCoinsList = [];
      }
      if (this.totalCoins.quantidade) {
        this.totalCoinsList.push(this.totalCoins);
      }
      this.totalCoinsList.sort((a,b)=>a.moeda.localeCompare(b.moeda));
    }else{
      this.totalCoinsList = [];
    }
    this.calcTotals();
  }

  calcTotals(){
    if (this.totals.length) {
      this.totals = [];
    }
    for (let row of this.totalCoinsList){
        //this.totalCoins.moeda = row.moeda;
        this.totalCoins.quantidadeTotal += row.quantidade;
        this.totalCoins.investimentoTotal += row.investimento;
        this.totalCoins.taxasTotal += row.taxas;
        this.totalCoins.investimentoRealTotal += row.investimentoReal;
    }
    this.totals.push(this.totalCoins);
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

  calculateTaxes(coin:any){
    let taxas = 0;
    for (let row of this.purchases) {
      if (row.moeda == coin) {
        taxas += row.taxas;
      }
    }
    return taxas;
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
    this.addCoin = false;
  }

  coinUpperCase(event:any) {
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
    this.purchaseToDelete = this.purchases.filter(row => row.id == id);
    if (confirm("Are you sure you want to delete")){
      this.purchases = this.purchases.filter(row => row.id != id);
      this.purchaseDeleted = true;
      this.setOwnedCoins(this.purchaseToDelete[0]);
    }
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
