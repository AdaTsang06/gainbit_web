import ExchangeContent from './index-content';
import { account_type } from '../../common/constant-enum';

const exchangeTD = (props) => {
    return <ExchangeContent exchangeType={account_type.accountTypeTd}/>
}
export default exchangeTD;