import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './StockTickerWebPart.module.scss';
import * as strings from 'StockTickerWebPartStrings';
import * as JSONP from 'jsonp';
import * as jquery from 'jquery';




import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';

export interface IStockTickerWebPartProps {
  symbol: string;
  name: string;
  dataNeeded: Quote;
}


export interface Stock {
  quote: Quote;
  bids: any[];
  asks: any[];
  trades: any[];
  systemEvent: any;
}

export interface Quote {
  symbol: string;
  companyName: string ;
  primaryExchange: string;
  sector: string;
  calculationPrice: string;
  open: number;
  openTime: number;
  close: number;
  closeTime: number;
  high: number;
  low: number;
  latestPrice: number;
  latestSource: string;
  latestTime: string;
  latestUpdate: number;
  latestVolume: number;
  iexRealtimePrice: number;
  iexRealtimeSize: number;
  iexLastUpdated: number;
  delayedPrice: number;
  delayedPriceTime: number;
  extendedPrice: number;
  extendedChange: number;
  extendedChangePercent: number;
  extendedPriceTime: number;
  previousClose: number;
  change: number;
  changePercent: number;
  iexMarketPercent: number;
  iexVolume: number;
  avgTotalVolume: number;
  iexBidPrice: number;
  iexBidSize: number;
  iexAskPrice: number;
  iexAskSize: number;
  marketCap: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
  ytdChange: number;
}



export default class StockTickerWebPart extends BaseClientSideWebPart<IStockTickerWebPartProps> {
   
/*
  public async getStockData(){
    var response = await fetch("https://api.iextrading.com/1.0/stock/aapl/book");
    var data = await response.json();
    let stock:Stock = await data();
    let quote:Quote = stock.quote;
    0;
    return quote;
  }
  */
  

  public render(): void { 
    //get Quote
    const hund: number =100;
    this.context.httpClient.get("https://api.iextrading.com/1.0/stock/"+this.properties.symbol+"/book", HttpClient.configurations.v1)
    .then((response: HttpClientResponse) => {
      let info = response.json(); 
      return info.then((obj :Stock) => {
        let thisIsit:Quote = obj.quote;
       
        
      
          
        
        
    //show
      this.domElement.innerHTML = `
        <div class="${ styles.stockTicker }">
          <div class="${ styles.container }">
            <div class="${ styles.row }">
              <div class="${ styles.column }">
                <p class="${ styles.title }">${thisIsit.companyName} ( ${escape(this.properties.symbol)} )</p>
                <span class="${ styles.subTitle }">${thisIsit.latestPrice}  &ensp; </span> 
                <e class="${ styles.other}">   ${thisIsit.change} (${(thisIsit.changePercent* hund).toFixed(3)}%)</e>
                <p class="${ styles.description}">Lastest Update: ${ new Date(thisIsit.latestUpdate.valueOf())}</p>
                <a href="https://api.iextrading.com/1.0/stock/${escape(this.properties.symbol)}/book" class="${ styles.button }">
                  <span class="${ styles.label }">See API</span>
                </a>
              </div>
            </div>
          </div>
        </div>`;
      });
    }); 
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              //groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('symbol', {
                  label: "Stock Symbol", selectedKey: 'AAPL',
                  options: [
                    { key: 'AAPL', text: 'AAPL' },
                    { key: 'MSFT', text: 'MSFT' },
                    { key: 'GOOGL', text: 'GOOGL' },
                    { key: 'AMZN', text: 'AMZN' },
                    { key: 'A', text: 'A' },
                    { key: 'AA', text: 'AA' }
                  ]})
                

                
              ]
            }
          ]
        }
      ]
    };
  }
}
