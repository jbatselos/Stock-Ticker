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
import {Quote, Stock,IStockTickerWebPartProps} from './Stock';
import { HttpClientResponse, HttpClient } from '@microsoft/sp-http';


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

   private currentQuote: Quote;

    constructor() {
      super();

      
    }
    public getStockData() {
      //get Quote
      
      this.context.httpClient.get("https://api.iextrading.com/1.0/stock/" + this.properties.symbol + "/book", HttpClient.configurations.v1)
      .then((response: HttpClientResponse) => {
          let info = response.json();
          return info.then((obj: Stock) => {
          // let quote: Quote = obj.quote;
            this.currentQuote = obj.quote;
            this.render();
          });
      });
    }

   public render(): void {
    this.getStockData();
    

    //show
    this.domElement.innerHTML = `
        <div class="${ styles.stockTicker}">
          <div class="${ styles.container}">
            <div class="${ styles.row}">
              <div class="${ styles.column}">
                <p class="${ styles.title}">${this.currentQuote ? this.currentQuote.companyName : ""} ( ${escape(this.properties.symbol)} )</p>
                <span class="${ styles.subTitle}">${this.currentQuote ? this.currentQuote.latestPrice : ""}  &ensp; </span> 
                <e class="${ styles.other}">   ${this.currentQuote ? this.currentQuote.change : ""} (${(this.currentQuote ? this.currentQuote.changePercent * 100 : 0).toFixed(3)}%)</e>
                <p class="${ styles.description}">Lastest Update: ${ this.currentQuote ? new Date(this.currentQuote.latestUpdate.valueOf()) : ""}</p>
                <a href="https://api.iextrading.com/1.0/stock/${escape(this.properties.symbol)}/book" class="${styles.button}">
                  <span class="${ styles.label}">See API</span>
                </a>
              </div>
            </div>
          </div>
        </div>`;

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
                  ]
                })



              ]
            }
          ]
        }
      ]
    };
  }
}
