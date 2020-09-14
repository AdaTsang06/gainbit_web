import Modal from '../../../components/modal';
import { FormattedMessage } from 'umi-plugin-locale';

const OrderConfirm = (props) => {
    const { visible,hideModal,confirm } = props;
    return <Modal
    className="confirm_modal"
    width={400}
    visible={visible}
  >
    <div className="confirm_modal_title" style={{justifyContent:'center',marginBottom:'20px'}}>
      <FormattedMessage id="priceOverTip" />
    </div>
    <div className="confirm_modal_action" style={{justifyContent:'center'}}>
      <button onClick={hideModal}>
        <FormattedMessage id="cancel_replace" />
      </button>
      <button onClick={confirm}>
        <FormattedMessage id="replace_order" />
      </button>
    </div>
  </Modal>
}
export default OrderConfirm;