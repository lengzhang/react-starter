import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

let middleware = [ thunk ];

// 如果是在客户端环境，并且是开发模式，那么打印redux日志
if (process.env.NODE_ENV == 'development' && __CLIENT__) middleware.push(createLogger());

const composeEnhancers = process.env.NODE_ENV == 'development' && __CLIENT__ ? composeWithDevTools : compose;

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
