import React, { PureComponent } from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Pagination from '../pagination_Page';
import { FormattedMessage } from 'umi-plugin-locale';
import styles from './styles.scss';
import { tabColor } from '../../common/color';

export default class Table extends PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    pagination: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    hideHeader: PropTypes.bool,
    minWidth: PropTypes.number,
  };
  static defaultProps = {
    // pagination: {},
    hideHeader: false,
    minWidth: 400,
    detailShow: false,
    detailShowIndex: 0,
  };
  state = {
    position: 'left',
  };
  componentDidMount() {
    this.tableRef.addEventListener('scroll', this._scrollListener, false);
    window.addEventListener('resize', this._resizeListener, false);
  }
  componentWillUnmount() {
    if (this.tableRef) {
      this.tableRef.removeEventListener('scroll', this._scrollListener, false);
      window.removeEventListener('resize', this._resizeListener, false);
    }
  }
  _paginationFunc = idx => {
    const {
      pagination: { pageCount, paginationCallback },
    } = this.props;
    const offset = pageCount * idx;
    paginationCallback(offset);
  };
  _scrollListener = e => {
    const node = e.target;
    const scrollToLeft = node.scrollLeft === 0;
    const scrollToRight =
      node.scrollLeft + 1 >=
      node.children[0].getBoundingClientRect().width -
        node.getBoundingClientRect().width;
    let position = 'left';
    if (scrollToLeft && scrollToRight) {
      position = 'both';
    } else if (scrollToRight) {
      position = 'right';
    } else if (this.state.position !== 'middle') {
      position = 'middle';
    }
    this.setState({ position });
  };
  _resizeListener = () => {
    const { position } = this.state;
    const { minWidth } = this.props;
    const { offsetWidth } = this.tableRef;
    if (offsetWidth > minWidth && position !== 'both') {
      this.setState({ position: 'both' });
    } else if (offsetWidth < minWidth && position !== 'left') {
      this.setState({ position: 'left' });
    }
  };
  _changeDetailShow = index => {
    const { detailShow } = this.state;
    this.setState({ detailShow: !detailShow, detailShowIndex: index });
  };
  render() {
    const {
      columns,
      data = [],
      pagination,
      minWidth = 800,
      placeholder = '',
      hideHeader,
      loading,
      child = [],
      childcolumns,
    } = this.props;
    const detailTips = (
      <a
        style={{
          marginRight: '8px',
          width: '55px',
          height: '25px',
          lineHeight: '25px',
          display: 'inline-block',
          textAlign: 'center',
          color: tabColor,
        }}
      >
        <FormattedMessage id="up" values={{ arrow: '▲' }} />
      </a>
    );
    const { detailShow, detailShowIndex } = this.state;
    return (
      <div className={styles.table}>
        <div
          className={styles.table_content}
          ref={e => {
            this.tableRef = e;
          }}
        >
          <FreeScrollBar>
            <table
              style={{ minWidth: `${minWidth}px` }}
              className={styles.table_content_child}
            >
              <colgroup>
                {columns.map(
                  ({ fixed, width }, idx) =>
                    !fixed ? (
                      <col key={idx} style={{ width: `${width}px` }} />
                    ) : (
                      <col key={idx} />
                    )
                )}
              </colgroup>
              {!hideHeader && (
                <thead>
                  <tr>
                    {columns.map(item => (
                      <th key={item.key} style={{ textAlign: item.align }}>
                        {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {data.length ? (
                  data.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        position: 'relative',
                        height:
                          child &&
                          child.length &&
                          detailShow &&
                          detailShowIndex === idx
                            ? 56 + 44 * child.length + 'px'
                            : '56px',
                        verticalAlign:
                          child &&
                          child.length &&
                          detailShow &&
                          detailShowIndex === idx
                            ? 'top'
                            : 'middle',
                      }}
                    >
                      {columns.map(
                        ({ align, key, render }, columnIdx) =>
                          child &&
                          child.length > 0 &&
                          key ==='showDetail' ? (
                            <td
                              key={columnIdx}
                              style={{ textAlign: align }}
                              onClick={() => this._changeDetailShow(idx)}
                            >
                              {!render
                                ? item[key]
                                : detailShow && detailShowIndex === idx
                                  ? detailTips
                                  : render(item[key], item)}
                              {child &&
                                child.length > 0 &&
                                detailShow &&
                                detailShowIndex === idx && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 56 * (idx + 2) + 'px',
                                      left: '0',
                                      right: '40px',
                                      height: '300px',
                                      background: '#131f39',
                                    }}
                                  >
                                    <FreeScrollBar>
                                      <table
                                        style={{
                                          minWidth: `${minWidth}px`,
                                          margin: '0 0 0 20px',
                                        }}
                                        className={styles.table_content_trade}
                                      >
                                        {!hideHeader && (
                                          <thead>
                                            <tr>
                                              {childcolumns.map(item => (
                                                <th
                                                  key={item.key}
                                                  style={{
                                                    textAlign: item.align,
                                                  }}
                                                >
                                                  {item.title}
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                        )}
                                        <tbody>
                                          {child.map((item, idx) => (
                                            <tr
                                              key={idx}
                                              style={{
                                                position: 'relative',
                                                height: '40px',
                                                verticalAlign: 'top',
                                                padding: '0',
                                              }}
                                            >
                                              {childcolumns.map(
                                                (
                                                  { align, key, render },
                                                  columnIdx
                                                ) => (
                                                  <td
                                                    key={columnIdx}
                                                    style={{
                                                      textAlign: align,
                                                      padding: '0',
                                                      margin: '0',
                                                    }}
                                                  >
                                                    {!render
                                                      ? item[key]
                                                      : render(item[key], item)}
                                                  </td>
                                                )
                                              )}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </FreeScrollBar>
                                  </div>
                                )}
                            </td>
                          ) : (
                            <td key={columnIdx} style={{ textAlign: align }}>
                              {!render ? item[key] : render(item[key], item)}
                            </td>
                          )
                      )}
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: 0 }}>
                    <td className={styles.table_empty} colSpan={columns.length}>
                      {loading ? (
                        <FormattedMessage id="loading" />
                      ) : (
                        placeholder
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </FreeScrollBar>
        </div>
        {columns.map(({ align, key, render, fixed, title, width }) => {
          if (fixed) {
            return (
              <div
                key={key}
                className={classnames(
                  styles[`table_${fixed}`],
                  styles[`table_${fixed}_${this.state.position}`]
                )}
                style={{ height: '400px' }}
              >
                <FreeScrollBar>
                  <table>
                    <colgroup>
                      <col style={{ width: `${width}px` }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th style={{ textAlign: align }}>{title}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: align }}>
                            {!render ? item[key] : render(item[key], item)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </FreeScrollBar>
              </div>
            );
          }
          return null;
        })}
        {pagination &&
          pagination.total > pagination.pageCount && (
            <Pagination
              defaultCurrent={pagination.defaultCurrent}
              total={pagination.total}
              pageCount={pagination.pageCount}
              callback={this._paginationFunc}
              init={pagination.init}
            />
          )}
      </div>
    );
  }
}
