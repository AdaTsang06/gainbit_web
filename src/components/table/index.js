import React, { PureComponent, Fragment } from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import PropTypes from 'prop-types';
import Pagination from '../pagination';
import { FormattedMessage } from 'umi-plugin-locale';
import styles from './styles.scss';
import { mainColor } from '../../common/color';

export default class Table extends PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    pagination: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    hideHeader: PropTypes.bool,
    minWidth: PropTypes.number,
  };
  static defaultProps = {
    hideHeader: false,
    minWidth: 400,
    detailShow: false,
    detailShowIndex: 0,
  };
  state = {
    position: 'left',
    child:[]
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
  componentWillReceiveProps(nextProps){
    const { child =[] } = nextProps;
    if(this.props.child !== nextProps.child){
      this.setState({child: child, detailShow: child.length > 0 })
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
    this.setState({ detailShow: !detailShow, detailShowIndex: index,child:[] });
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
      childcolumns,
      rowOnClickHandler,
      init
    } = this.props;
    const { child } = this.state;
    const detailTips = (
      <a
        style={{
          display: 'inline-block',
          width: '60px',
          height: '25px',
          lineHeight: '25px',
          textAlign: 'right',
          color: mainColor,
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
                    <Fragment key={idx}>
                    <tr
                      key={idx}
                      style={{
                        position: 'relative',
                        height:'36px',
                        verticalAlign:'top',
                        cursor:rowOnClickHandler ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if(rowOnClickHandler){
                          rowOnClickHandler(item);
                        }
                      }}
                    >
                      {columns.map(
                        ({ align, key, render }, columnIdx) =>
                          key ==='showDetail' ? (
                            <td
                              key={columnIdx}
                              style={{ textAlign: align }}
                              onClick={() => this._changeDetailShow(idx)}
                            >
                              {!render
                                ? item[key]
                                : child && child.length > 0 && detailShow && detailShowIndex === idx
                                  ? detailTips
                                  : render(item[key], item)}                            
                            </td>
                          ) : (
                            <td key={columnIdx} style={{ textAlign: align }}>
                              {!render ? item[key] : render(item[key], item)}
                            </td>
                          )
                      )}
                    </tr>
                    {child &&
                      child.length > 0 &&
                      detailShow &&
                      detailShowIndex === idx && (
                              <Fragment>                    
                              {!hideHeader && (
                                  <tr className={styles.table_content_child_tr}>
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
                              )}
                                {child.map((item, index) => (
                                  <tr
                                    key={`chilid${index}`}
                                    className={styles.table_content_child_tr}
                                  >
                                    {childcolumns.map(
                                      (
                                        { align, key, render },
                                        columnIndex
                                      ) => (
                                        <td
                                          key={columnIndex}
                                          style={{
                                            textAlign: align,
                                            margin: '0',
                                            paddingTop: 0
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
                                </Fragment>
                      )}
                   </Fragment>
                  ))
                ) : (
                  <tr style={{ borderBottom: 0 }}>
                    <td className={styles.table_empty} colSpan={columns.length}>
                      {loading ? (
                        <span>loading...</span>
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
        {pagination &&
           (
            <Pagination
              defaultCurrent={pagination.defaultCurrent}
              dataLen={data.length}
              pageCount={pagination.pageCount}
              callback={this._paginationFunc}
              init={init}
            />
          )}
      </div>
    );
  }
}
