import co from 'co';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const ensureInterval = (lastProcessFrom, interval) => co(function* () {
  const now = Date.now();
  const nextProcessTime = interval + lastProcessFrom;
  const intervalLeft = nextProcessTime - now;
  // normalize min ms for setTimeout
  if (intervalLeft > 10) {
    yield wait(intervalLeft);
  } else if (intervalLeft > 0) {
    yield wait(10);
  }
  yield Promise.resolve();
});

export default (send, { asyncMode = true, interval = 5000 }) => {
  const state = {
    $$processing: false,
    $$lastProcessFrom: 0,
    pick() {
      this.$$processing = true;
      this.$$lastProcessFrom = Date.now();
    },
    free() {
      this.$$processing = false;
    },
    get processing() {
      return this.$$processing;
    },
    get lastProcessFrom() {
      return this.$$lastProcessFrom;
    },
  };

  const waitings = []; // queue

  const deferRequest = () => new Promise(resolve => waitings.push(resolve));

  const resolveNextRequest = () => {
    if (waitings.length) {
      waitings.shift()();
    }
  };

  const process = (...args) => co(function* () {
    let result;
    if (state.processing) {
      yield deferRequest();
    }
    state.pick();
    yield ensureInterval(state.lastProcessFrom, interval);

    if (asyncMode) {
      state.free();
      resolveNextRequest();
      result = yield send(...args);
    } else {
      result = yield send(...args);
      state.free();
      resolveNextRequest();
    }
    return result;
  });

  return {
    push: process,
  };
};
