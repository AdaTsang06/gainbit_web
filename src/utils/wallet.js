import { acCurrency } from '../common/constants';
import { dir, position_status } from '../common/constant-enum';

export const getTotalProfitAndFrozen = (positionInfos =[], ticker={}, currencyInfos={} ) => {
  let total = {profit: 0, margin: 0}, price, direction,pf=0;
  positionInfos.reduce((t,item) => {
    if(item.status === position_status.opened){
       price = parseFloat(ticker[item.symbolid] && ticker[item.symbolid].price) || 0;
       direction = item.direction === dir.sell ? -1 : 1;
       pf = (price - parseFloat(item.open_price)) * (parseFloat(item.amount || 0) - parseFloat(item.amount_deliver || 0)) * direction;     
       t.profit += parseFloat((pf || 0).toFixed(currencyInfos[acCurrency] && currencyInfos[acCurrency].digits));
       t.margin += parseFloat(item.frozen);
    }
    return t;
  },total);
  return total;
}

export const getSymbolStartPrice = (currency_quantity, currency_price, symbolList =[]) => {
  if(!currency_quantity || !currency_price || symbolList.length <= 0) return 0;
  let price = 0, obj;
  for(let i = 0; i < symbolList.length; i++){
    obj = symbolList[i];
    if(currency_quantity === obj.currency_quantity && currency_price === obj.currency_price){
      price = obj.start_price || 0;
      break;
    }
    else if(currency_quantity === obj.currency_price && currency_price === obj.currency_quantity){
      if(parseFloat(obj.start_price || 0)){
        price = 1/obj.start_price;
      }
    }
  }
  return price;
}

export const getPrice = (currency_quantity, currency_price, symPairPriceObj) => {
  let price=-1, keys = Object.keys(symPairPriceObj);
  if(keys.indexOf(`${currency_quantity}/${currency_price}`) !== -1){
    price = parseFloat(symPairPriceObj[`${currency_quantity}/${currency_price}`] || 0);
  }
  else if(keys.indexOf(`${currency_price}/${currency_quantity}`) !== -1){
    if( parseFloat(symPairPriceObj[`${currency_price}/${currency_quantity}`] || 0)){
      price = 1/parseFloat(symPairPriceObj[`${currency_price}/${currency_quantity}`]);
    }
    else {
      price = 0;
    }
  }
  return price;
}