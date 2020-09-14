import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Form, { FieldSelect } from '@/components/form';
import { Field, change } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import Dropzone from '@/components/dropzone';
//import { cardType } from '../../../../common/search-item';
import { imgCompress, showBase64Img } from "@/utils/util";
// import id_cover from '@/assets/kyc/id_cover.png';
// import id_back from '@/assets/kyc/id_back.png';
// import passport_cover from '@/assets/kyc/passport_cover.png';
import styles from './styles.scss';



/* eslint-disable */
const desMap = {
  1: [
    <FormattedMessage id="id_card_des1" />,
    <FormattedMessage id="id_card_des2" />,
    <FormattedMessage id="id_card_des3" />,
  ],
  2: [
    <FormattedMessage id="id_card_des1" />,
    <FormattedMessage id="id_card_des2" />,
    <FormattedMessage id="id_card_des3" />,
  ]
};
/* eslint-enable */
// const picMap = {
//   1: [id_cover, id_back, id_cover],
//   2: [passport_cover, passport_cover,passport_cover]
// };

@connect(state => ({
  loading: state.Loading.submitLoading,
  kycIdPhoto: state.KYC.kycIdPhoto,
  headPhoto: state.KYC.headPhoto,
  backPhoto: state.KYC.backPhoto,
  //addressPhoto: state.KYC.addressPhoto
}))
class LevelThree extends PureComponent {
  state = { id_type: 1, error: {} };

  componentWillMount() {
    this.props.dispatch({ type: "KYC/queryLevelStep3" });
    const {
      headPhoto,
      backPhoto,
      //addressPhoto
     } = this.props;
    this.setState({ 
      head_photo: headPhoto, 
      back_photo: backPhoto,
      //address_photo: addressPhoto 
      })
  }

  componentWillReceiveProps(nextProps) {
    const { kycIdPhoto, headPhoto, backPhoto } = nextProps;
    if (kycIdPhoto !== this.props.kycIdPhoto) {
      this.props.dispatch(change('uploadIdPhoto', 'id_type', kycIdPhoto.id_type))
    }
    if (this.props.headPhoto !== headPhoto) {
      this.setState({ head_photo: headPhoto });
    }
    if (this.props.backPhoto !== backPhoto) {
      this.setState({ back_photo: backPhoto });
    }
    // if(this.props.addressPhoto !== addressPhoto){
    //   this.setState({address_photo:addressPhoto});
    // }
  }

  _submit = values => {
    const {
      head_photo,
      back_photo,
      address_photo,
      id_type,
      error,
    } = this.state;
    const {
      headPhoto,
      backPhoto,
      // addressPhoto
    } = this.props;
    if (!head_photo) {
      this.setState({ error: { ...error, 1: true } });
      return;
    }
    if (!back_photo) {
      this.setState({ error: { ...error, 2: true } });
      return;
    }
    // if (!address_photo) {
    //   this.setState({ error: { ...error, 3: true } });
    //   return;
    // }
    const obj = {
      id_type: values.id_type || id_type
    };
    let flag = false;
    if (head_photo !== headPhoto) {
      obj.head_photo = head_photo;
      flag = true;
    }
    if (back_photo !== backPhoto) {
      obj.back_photo = back_photo;
      flag = true;
    }
    // if(address_photo !== addressPhoto){
    //   obj.address_photo = address_photo;
    //   flag = true;
    // }
    if (flag) {
      this.props.dispatch({ type: 'KYC/submitLevelStep3', payload: obj });
    }
    else {
      this.props.dispatch(require('dva').routerRedux.push('/ac/user-setting/kyc/personal/4'));
    }
  };
  _validate = values => {
    const requiredProps = ['id_type', 'user_sign3'];
    const errors = {};
    requiredProps.forEach(key => {
      if (Object.keys(values).indexOf(key) === -1 || !values[key]) {
        errors[key] = 'required';
      }
      if (!values.user_sign3) {
        errors.user_sign3 = 'must_agree';
      }
    });
    return errors;
  };
  _typeChange = (e, value) => {
    this.setState({ id_type: value });
  };
  _onDrop = (files, index) => {
    const pics = { 1: 'head_photo', 2: 'back_photo', 3: 'address_photo' };
    const prop = pics[index];
    imgCompress(files, (data) => {
      this.setState({ [prop]: data });
    })
  };

  _delImg = (index) => {
    const pics = { 1: 'head_photo', 2: 'back_photo', 3: 'address_photo' };
    const prop = pics[index];
    this.setState({ [prop]: "" });
  }

  render() {
    const { id_type, error } = this.state;
    const { 
      loading, 
      kycIdPhoto, 
      headPhoto, 
      backPhoto, 
      //addressPhoto 
    } = this.props;
    const tip = <FormattedMessage id="file_must" />;
    const action = (
      <button disabled={loading} type="submit" className='submit_button'>
        <FormattedMessage id="nextStep" />
      </button>
    );
    const type = id_type || kycIdPhoto.id_type || 1;
    return (
      <div>
        <Form
          initialValues={kycIdPhoto}
          className={styles.kyc_form}
          actionAlign="flex-end"
          action={action}
          onSubmit={this._submit}
          //validate={this._validate}
          form="uploadIdPhoto"
        >
          {/* <Field
            onChange={this._typeChange}
            arr={cardType}
            name="id_type"
            type="select"
            component={FieldSelect}
            label={<FormattedMessage id="id_type" />}
          /> */}
          <div className={styles.kyc_form_item}>
            {desMap[type][0]}
            <Dropzone
              defaultValue={showBase64Img(headPhoto)}
              error={error[1]}
              tip={tip}
              onDrop={files => this._onDrop(files, 1)}
              //eg={picMap[type][0]}
              delImg={() => this._delImg(1)}
            />
          </div>
          <div className={styles.kyc_form_item}>
            {desMap[type][1]}
            <Dropzone
              defaultValue={showBase64Img(backPhoto)}
              error={error[2]}
              tip={tip}
              onDrop={files => this._onDrop(files, 2)}
              //eg={picMap[type][1]}
              delImg={() => this._delImg(2)}
            />
          </div>
          {/* <div className={styles.kyc_form_item}>
            {desMap[type][2]}
            <Dropzone
              defaultValue={showBase64Img(addressPhoto)}
              error={error[3]}
              tip={tip}
              onDrop={files => this._onDrop(files, 3)}
              //eg={picMap[type][2]}
              delImg={() => this._delImg(3)}
            />
          </div> */}
          {/* <Field
            name="user_sign3"
            type="checkbox"
            component={FieldCheckbox}
            label={
              <Fragment>
                <FormattedMessage id="user_sign" />
                <Agreement level={3} />
              </Fragment>
            }
          /> */}
        </Form>
        {/* <pre className={styles.level_warning}>
          <FormattedMessage id="kyc_level_3_warning" />
        </pre> */}
      </div>
    );
  }
}
export default LevelThree