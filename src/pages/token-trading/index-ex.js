import ExchangeContent from './index-content';
import { account_type } from '../../common/constant-enum';
const exchangeEX = (props) => {
    return <ExchangeContent exchangeType={account_type.accountTypeEx}/>
}
export default exchangeEX;