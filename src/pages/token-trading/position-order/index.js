import PostionOrder from './order';
import styles from '../trading-order/styles.scss'

const Position = (props) => {
  return  (<div className={styles.trading_order}>
      <PostionOrder  {...props}/>
      </div>)
}
export default  Position