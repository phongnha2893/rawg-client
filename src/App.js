import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import { history } from './utils/helpers';
import { routes } from './routes';
import { PublicRoute } from './layouts';
import { initRouter } from './actions/RouterActions';
import { closeFullVideo, windowResize } from './actions/AppActions';
import HeaderContainer from './containers/HeaderContainer';
import { INDEX_PATH, GAMES_PATH, GAME_PATH } from './constants/urlApi';
import { FullVideo } from './components';
import {
  WINDOW_SIZE,
  WINDOW_RESIZE_DEBOUNCE
} from './constants/GlobalConstants';

const paths = [INDEX_PATH, GAMES_PATH, GAME_PATH];

function App({
  initRouter,
  closeFullVideo,
  videoId,
  windowResize,
  windowSize
}) {
  useEffect(() => {
    initRouter(paths);
  }, [initRouter]);

  useEffect(() => {
    let timeout = null;

    const resize = () => {
      const { innerWidth } = window;
      if (
        innerWidth < WINDOW_SIZE.tablet &&
        windowSize !== WINDOW_SIZE.tablet
      ) {
        windowResize(WINDOW_SIZE.tablet);
      } else if (
        innerWidth >= WINDOW_SIZE.tablet &&
        innerWidth < WINDOW_SIZE.laptop &&
        windowSize !== WINDOW_SIZE.laptop
      ) {
        windowResize(WINDOW_SIZE.laptop);
      } else if (
        innerWidth >= WINDOW_SIZE.laptop &&
        innerWidth < WINDOW_SIZE.desktop &&
        windowSize !== WINDOW_SIZE.desktop
      ) {
        windowResize(WINDOW_SIZE.desktop);
      } else if (
        innerWidth >= WINDOW_SIZE.desktop &&
        windowSize !== WINDOW_SIZE.all
      ) {
        windowResize(WINDOW_SIZE.all);
      }
    };

    const onWidthResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(resize, WINDOW_RESIZE_DEBOUNCE);
    };

    onWidthResize();
    window.addEventListener('resize', onWidthResize);

    return () => {
      window.removeEventListener('resize', onWidthResize);
    };
  }, [windowSize, windowResize]);

  const renderRoutes = useCallback(routes => {
    let result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        const { path, exact, layout, component } = route;

        return (
          <PublicRoute
            key={index}
            path={path}
            exact={exact}
            layout={layout}
            component={component}
          />
        );
      });
    }
    return <Switch>{result}</Switch>;
  }, []);

  return (
    <Router history={history}>
      <div className="App">
        <HeaderContainer />
        {renderRoutes(routes)}
        <FullVideo onClose={closeFullVideo} videoId={videoId} />
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

export default connect(mapStateToProps, {
  initRouter,
  closeFullVideo,
  windowResize
})(App);
