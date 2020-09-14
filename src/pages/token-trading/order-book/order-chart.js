import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import styles from './styles.scss';

export default class ChartForOrderBook extends PureComponent {
  render() {
    const { buyData, sellData } = this.props;
    const buyColor = 'rgba(41, 176, 29, 0.15)';
    const sellColor = 'rgba(214, 29, 29, 0.15)';
    return (
      <div className={styles.order_book_chart}>
        <ResponsiveContainer height="50%">
          <AreaChart
            margin={{ bottom: 0, top: 4 }}
            layout="vertical"
            data={sellData}
          >
            <XAxis type="number" reversed hide />
            <YAxis dataKey="Price" type="category" reversed hide />
            <Area
              type="monotone"
              dataKey="total"
              stroke={sellColor}
              fillOpacity={1}
              fill={sellColor}
            />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer height="50%">
          <AreaChart
            margin={{ top: 0, bottom: 4 }}
            layout="vertical"
            data={buyData}
          >
            <XAxis type="number" reversed hide />
            <YAxis dataKey="Price" type="category" hide />
            <Area
              type="monotone"
              dataKey="total"
              stroke={buyColor}
              fillOpacity={1}
              fill={buyColor}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
