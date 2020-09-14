import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { tabColor } from '@/common/color';
import Facebook from '@/assets/svg/facebook';
import Twitter from '@/assets/svg/twitter';
import Linkedin from '@/assets/svg/linkedin';
import Wechat from '@/assets/svg/wechat';
import Weibo from '@/assets/svg/weibo';
import wecaht from '@/assets/wechat.png';
import styles from './index.scss';
@connect(state =>({
  locale: state.Intl.locale
}))
class Footer extends PureComponent {
  render() {
    const { pathname, locale } = this.props;
    const list = [
      [
        'footer1_title',
        [
          ['footer1_content1', '/guide/service'],
          ['footer1_content2', '/guide/privacy'],
          ['footer1_content3', '/guide/fee'],
        ],
      ],
      [
        'footer2_title',
        [
          [
            'footer2_content1',
            ``,
          ],
          [
            'footer2_content2',
            ``,
          ],
        ],
      ],
      [
        'footer3_title',
        [
          ['footer3_content1', '/guide/aboutus']
        ],
      ],
      [
        'footer4_title',
        [
          ['footer4_content3', ''],
        ],
      ],
    ];
    const social = [
      {
        icon: <Facebook color={tabColor} />,
        link: '',
      },
      {
        icon: <Twitter color={tabColor} />,
        link: '',
      },
      {
        icon: <Linkedin color={tabColor} />,
        link: '',
      },
      {
        icon: <Wechat color={tabColor} />,
        pic: <img src={wecaht} alt="wechat" />,
      },
      {
        icon: <Weibo color={tabColor} />,
        link: '',
      }
    ];
    const shouldShowFooterSub =
      pathname === '/login' || pathname.indexOf('/register') !== -1 ;
    return (
      <footer
        className={classNames(
          shouldShowFooterSub && styles.footerSub,
          styles.footer
        )}
      >
        {!shouldShowFooterSub && (
          <div
            style={{ flexDirection: 'column', height: 'auto' }}
          >
            <div className={styles.footer_info}>
              <div>
                <div className={styles.footer_social}>
                  {social.map(
                    (item, index) =>
                      item.pic ? (
                        <a key={index} className={styles.footer_social_wechat}>
                          {item.pic}
                          {item.icon}
                        </a>
                      ) : (
                        <a
                          key={index}
                          href={item.link}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.icon}
                        </a>
                      )
                  )}                 
                </div>
                <p><FormattedMessage id='companyAddress'/></p>
                <p className={styles.footerLogin}>
                  © Copyright © 2019 GOLDEX
                </p>
              </div>
              <div className={styles.footer_links}>             
                {list.map(item => (
                  <dl key={item[0]}>
                    <dt>
                      <FormattedMessage id={item[0]} />
                    </dt>
                    {item[1].map(([name, href]) => (
                      <dd key={name}>
                        {href.indexOf('http') > -1 ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FormattedMessage id={name} />
                          </a>
                        ) : (
                          <Link to={href}>
                            <FormattedMessage id={name} />
                          </Link>
                        )}
                      </dd>
                    ))}
                  </dl>
                ))}
              </div>
            </div>
          </div>
        )}
        {shouldShowFooterSub && (
          <p className={styles.footerLogin}>© Copyright © 2019 GOLDEX</p>
        )}
      </footer>
    );
  }
}
export default  Footer