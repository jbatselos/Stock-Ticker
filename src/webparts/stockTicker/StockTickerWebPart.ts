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
import * as React from 'react';
export interface IStockTickerWebPartProps {
  symbol: string;
}

export default class StockTickerWebPart extends BaseClientSideWebPart<IStockTickerWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.stockTicker }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Stock Ticker</span>
              <p class="${ styles.subTitle }">Name:     Symbol: ${escape(this.properties.symbol)}</p>
              <p class="${ styles.subTitle }">Price: Change: PerChange:</p>
              <p class="${ styles.description }">Date</p>
              <a href="https://api.iextrading.com/1.0/stock/${escape(this.properties.symbol)}/book" class="${ styles.button }">
                <span class="${ styles.label }">See API</span>
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
                    { key: 'AMZN', text: 'AMZN' }
                  ]})
                

                
              ]
            }
          ]
        }
      ]
    };
  }
}
