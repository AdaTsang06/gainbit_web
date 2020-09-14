import { acCurrency } from "./constants";
const USDDepths = {
  BTC: 2,
  BCH: 2,
  LTC: 2,
  DASH: 2,
  MONA: 4,
  ETH: 2,
  ETC: 4,
};
const BTCDepths = {
  BCH: 6,
  LTC: 6,
  DASH: 6,
  MONA: 8,
  ETH: 6,
  ETC: 6,
};
const ETHDepths = {
  BTCC: 6,
};
const getDepth = base => {
  switch (base) {
    case acCurrency:
      return name => {
        if (name in USDDepths) {
          return USDDepths[name];
        }
        return 2;
      };
    case 'BTC':
      return name => {
        if (name in BTCDepths) {
          return BTCDepths[name];
        }
        return 2;
      };
    case 'ETH':
      return name => {
        if (name in ETHDepths) {
          return ETHDepths[name];
        }
        return 2;
      };
    default:
      return () => 2;
  }
};
export default getDepth;
