import React, { PureComponent } from 'react';
import BasicDropzone from 'react-dropzone';
import uploadIcon from '@/assets/upload.png';
import closeIcon from '@/assets/close.png';
import styles from './styles.scss';

//const limitSize = 5 * 1024 * 1024;

export default class Dropzone extends PureComponent {
  state = {
    error: false,
    value: this.props.defaultValue,
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }
    if(this.props.defaultValue !== nextProps.defaultValue){
      this.setState({value: nextProps.defaultValue})
    }
  }
  _onDrop = files => {
    if (!files.length) return;
    this.setState({ value: files[0].preview, error: false });
    this.props.onDrop(files);
  };
  _onDropRejected = () => {
    this.setState({ error: true });
  };
  render() {
    const {
      multiple = false,
      accept = 'image/*',
      //maxSize = limitSize,
      tip,
      isPassed=true,
      loading = false,
      eg,
    } = this.props;
    const { value, error } = this.state;
    return (
      <div className={styles.dropzone_wrapper}>
        {!value && (
          <BasicDropzone
            style={{ borderColor: isPassed ? '#c4c7d0' : 'red' }}
            className={styles.dropzone}
            multiple={multiple}
            //maxSize={maxSize}
            accept={accept}
            onDrop={this._onDrop}
            onDropRejected={this._onDropRejected}
          >
            <img src={uploadIcon} alt="upload" />
            <span
              style={{ color: error ? '#e91010' : '#868686' }}
              className={styles.tip}
            >
              {tip}
            </span>
          </BasicDropzone>
        )}
        {value && (
          <div
            style={{ border: isPassed ? '0' : '1px solid red' }}
            className={styles.preview}
          >
            {!loading && (
              <span
                className={styles.preview_close}
                onClick={() => {
                  this.setState({ value: null });
                  this.props.delImg();
                }}
              >
                <img src={closeIcon} alt="close" />
              </span>
            )}
            <img className={styles.preview_img} src={value} alt="preview" />
            {loading && <div className={styles.donut} />}
          </div>
        )}
        {eg && <div className={styles.dropzone_eg}>
          <img src={eg} alt="eg" />
        </div>}
      </div>
    );
  }
}
