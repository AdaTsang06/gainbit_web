import React, { PureComponent } from 'react';
import { IntlProvider } from 'umi-plugin-locale';
import { connect } from 'dva';
import classnames from 'classnames';
import HomeComp from './components';
import styles from './styles.scss';
import messages from './messages.json';
import { getQueryLang } from '../../utils/util';

@connect(state => ({
  locale: state.Intl.locale,
  isLogin: state.Account.loggedIn,
  noticeList: state.global.noticeList
}))
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.load = null;
  }
  componentWillMount() {
    const chat = document.getElementsByClassName('kf5-support-chat')[0];
    if (!chat) {
      this.load = window.addEventListener(
        'load',
        () => {
          const node = document.getElementsByClassName('kf5-support-chat')[0];
          if (node) {
            node.style.display = 'block';
          }
        },
        false
      );
    }
    this.props.dispatch({type: "global/fetchNotices",payload:{ lang: getQueryLang(this.props.locale) } })
  }

  componentDidMount() {
    const chat = document.getElementsByClassName('kf5-support-chat')[0];
    if (chat) {
      chat.style.display = 'block';
    }
  }
  componentWillUnmount() {
    const chat = document.getElementsByClassName('kf5-support-chat')[0];
    if (chat) {
      chat.style.display = 'none';
    }
    return this.load && this.load.remove();
  }

  render() {
    const { locale } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.home} id="Home">
          <HomeComp.Banner />
          <div className={classnames(styles.home_container)}>
            <HomeComp.Section1 {...this.props} />
            {/* <HomeComp.Section2 /> */}
            <HomeComp.Section3 {...this.props} />
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default Home