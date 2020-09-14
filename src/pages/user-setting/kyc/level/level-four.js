import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Form from '@/components/form';
import { FormattedMessage } from 'umi-plugin-locale';
import Dropzone from '@/components/dropzone';
import { formatCalendar }  from "@/utils/format-date";
import { imgCompress, showBase64Img } from "@/utils/util";
//import id_cover from '@/assets/kyc/id_cover.png';
import styles from './styles.scss';

@connect(state => ({
  loading: state.Loading.submitLoading,
  randNumber: state.KYC.randNumber,
  randNumberTime: state.KYC.randNumberTime,
  handPhoto: state.KYC.handPhoto
}))
class LevelThree extends PureComponent {
  state = { error: {} };

  componentWillMount(){
    this.props.dispatch({type:"KYC/queryLevelStep4"});
    const { handPhoto } =  this.props;
    this.setState({handPhoto})
  }
  componentWillReceiveProps(nextProps){
    const { handPhoto } =  nextProps;
    if(this.props.handPhoto !== handPhoto){
      this.setState({handPhoto})
    }
  }

  _submit = () => {
    const {
      handPhoto,
      error
    } = this.state;
    if (!handPhoto) {
      this.setState({ error: { ...error, 1: true } });
      return;
    }
    if(handPhoto !== this.props.handPhoto){
       const obj = {
        photo: handPhoto
       };
      this.props.dispatch({type:'KYC/submitLevelStep4', payload:obj});
    }
    else{
      this.props.dispatch(require('dva').routerRedux.push('/ac/user-setting/security-setting'))
    }
  };
  
  _onDrop = (files, index) => {
    const pics = { 1: 'handPhoto'};
    const prop = pics[index];
    imgCompress(files,(data)=>{
      this.setState({ [prop]: data });
    })
  };
  _delImg = (index) => {
    const pics = { 1: 'handPhoto'};
    const prop = pics[index];
    this.setState({ [prop]:"" });
  }

  render() {
    const { error } = this.state;
    const { loading,kycIdPhoto, handPhoto, randNumber, randNumberTime} = this.props;
    const tip = <FormattedMessage id="file_must"/>;
    const action = (
      <button disabled={loading} type="submit" className='submit_button'>
        <FormattedMessage id="submit" />
      </button>
    );
    const date = new Date();
    return (
      <div>
        <Form
          initialValues={kycIdPhoto}
          className={styles.kyc_form}
          actionAlign="flex-end"
          action={action}
          onSubmit={this._submit}
          form="uploadIdPhoto"
        >
          <div className={styles.kyc_level_content_title}>
            <FormattedMessage id="handTip"/>
          </div>
          <div style={{marginBottom:'20px'}}><FormattedMessage id="handTip1"/></div>
          <div className={styles.kyc_form_item}>
            <FormattedMessage id="handTip11"/>
            <label>{formatCalendar(randNumberTime*1000,1) }</label>
          </div>
          <div className={styles.kyc_form_item}>
            <FormattedMessage id="handTip12" />
            <label>{randNumber}</label>
          </div>
          <div className={styles.kyc_form_item}>
            <FormattedMessage id="handTip2" />
            <Dropzone
              defaultValue={showBase64Img(handPhoto)}
              error={error[1]}
              tip={tip}
              onDrop={files => this._onDrop(files, 1)}
              //eg={id_cover}
              delImg={() => this._delImg(1)}
            />
          </div>         
        </Form>
        {/* <pre className={styles.level_warning}>
          <FormattedMessage id="kyc_level_3_warning" />
        </pre> */}
      </div>
    );
  }
}
export default LevelThree