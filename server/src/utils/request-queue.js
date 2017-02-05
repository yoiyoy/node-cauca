import co from 'co';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default (sendFunc, {
  minInterval = 5000,
  asyncWithInterval = true,
}) => {
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

  const ensureInterval = (lastProcessFrom, interval) => co(function* () {
    const now = Date.now();
    const nextProcessTime = interval + lastProcessFrom;
    let intervalLeft = nextProcessTime - now;
    intervalLeft = intervalLeft < 10 ? 10 : intervalLeft; // normalize min ms for setTimeout
    yield wait(intervalLeft);
  });

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
    yield ensureInterval(state.lastProcessFrom, minInterval);

    if (asyncWithInterval) {
      state.free();
      resolveNextRequest();
      result = yield sendFunc(...args);
    } else {
      result = yield sendFunc(...args);
      state.free();
      resolveNextRequest();
    }
    return result;
  });

  return {
    send: process,
    sendImmed: sendFunc,
  };
};
