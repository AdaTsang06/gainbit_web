import React, { Fragment, PureComponent } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'umi-plugin-locale';
import styles from './styles.css';

const SubRoutes = ({ prevPath, routes, pathname }) => (
  <Fragment>
    <ul className={styles.tab_ul}>
      {routes.map(route => (
        <li
          key={route.path}
          className={
            pathname == prevPath + '/' + route.path ? styles.active : ''
          }
        >
          <Link to={`${prevPath}/${route.path}`}>
            <FormattedMessage id={route.path} />
          </Link>
        </li>
      ))}
    </ul>
    {routes.map((route, i) => (
      <RouteWithSubRoutes
        key={i}
        {...route}
        pathname={pathname}
        nextPath={`${prevPath}/${route.path}`}
      />
    ))}
  </Fragment>
);

export const RouteWithSubRoutes = ({
  nextPath,
  component: Component,
  routes,
  path,
  pathname,
}) => (
  <Route
    path={nextPath}
    render={props => {
      if (typeof Component === 'function') {
        return (
          <Component
            {...props}
            name={path}
            pathname={pathname}
            routes={routes}
            prevPath={nextPath}
          />
        );
      } else if (typeof Component === 'object') {
        return Component;
      }
      return (
        <SubRoutes
          {...props}
          name={path}
          pathname={pathname}
          routes={routes}
          prevPath={nextPath}
        />
      );
    }}
  />
);

@withRouter
class Tab extends PureComponent {
  componentWillMount() {
    const { location, history } = this.props;
    const historyPath = this._pushHistory(location);
    if (historyPath !== location.pathname) {
      history.push(historyPath);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { location, history } = nextProps;
    const historyPath = this._pushHistory(location);
    if (historyPath !== location.pathname) {
      history.replace(historyPath);
    }
  }
  _recursive = (routes, path, props) =>
    routes.map(route => {
      const checkPath = path.indexOf(route.path) > -1;
      if (route.routes) {
        return this._recursive(
          route.routes,
          checkPath ? path : `${path}/${route.path}`
        );
      }
      const routePath = typeof route === 'string' ? `${route}` : route.path;
      if (route.childRoutes) {
        return this._recursive(
          route.childRoutes,
          `${path}/${route.path}`,
          !checkPath && `${path}/${routePath}`
        );
      }
      if (props && !checkPath) {
        return [props, `${path}/${routePath}`];
      }
      return !checkPath && `${path}/${routePath}`;
    });
  _listFlatten = l =>
    l.reduce((pv, cv) => {
      if (!Array.isArray(cv)) {
        if (!cv) return pv;
        return pv.concat(cv);
      }
      return pv.concat(this._listFlatten(cv));
    }, []);
  _pushHistory(location) {
    const { url, routes } = this.props;
    const deep = this._recursive(routes, url);
    const list = this._listFlatten(deep);
    return (
      list.filter(
        i =>
          location.pathname.indexOf(i) > 0 || i.indexOf(location.pathname) > -1
      )[0] || list[0]
    );
  }
  render() {
    const {
      routes,
      url,
      location: { pathname },
    } = this.props;
    return (
      <div className={styles.tab}>
        <ul className={styles.tab_root}>
          {routes.map(({ path }) => (
            <li
              key={path}
              className={
                pathname.indexOf(`${url}/${path}`) > -1 ? styles.active : ''
              }
            >
              <Link to={`${url}/${path}`}>
                <FormattedMessage id={path} />
              </Link>
            </li>
          ))}
        </ul>
        {routes.map((route, i) => (
          <RouteWithSubRoutes
            key={i}
            {...route}
            pathname={pathname}
            nextPath={`${url}/${route.path}`}
          />
        ))}
      </div>
    );
  }
}

export default Tab;
