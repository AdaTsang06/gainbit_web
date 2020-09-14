import React, { PureComponent } from 'react';
//import { FormattedMessage } from 'umi-plugin-locale';
import noticeIco from '@/assets/home/web_icon_massige.png';
//import arrow from '@/assets/home/web_icon_arrow.png';
import styles from './styles.scss';
export default class Notice extends PureComponent {
  state = {
    posts: [],
    current: null,
  };
  interval = null;
  componentDidMount() {
    this.transformNotice(this.props.noticeList)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.noticeList !== nextProps.noticeList){
      this.transformNotice(nextProps.noticeList)
    }
  }
  
  transformNotice = posts => {
    const len = posts.length;
    if(len > 0){
      let i = 0;
      this.setState({ current: posts[i]},() => {
        i++;
      });
      if(len > 1){
          this.interval = setInterval(() => {
          if (i >= len) {
            i = 0;
          }
          if (!this.interval) return;
          this.setState({ current: posts[i] }, () => {
            i++;
          });       
        }, 3000);
     }
   }
  };
  render() {
    const { current } = this.state;
    if(!current) return '';
    return (
      <div className={styles.notice}>
        <div className={styles.notice_item}>
          <img src={noticeIco} />
          <a target="_blank" rel="noopener noreferrer">
            {current.content}
          </a>
        </div>
        {/* <a
          target="_blank"
          className={styles.notice_more}
        >
          <FormattedMessage id="more" />
          <img src={arrow} />
        </a> */}
      </div>
    );
  }
}
