class ReferencableBoolean {
  constructor(value) {
    this.value = value;
  }

  set(value) {
    this.value = value;
  }

  state() {
    return this.value;
  }
}

function addToggle(fn, resetOnFalse = true) {
  let toggle = new ReferencableBoolean(true);

  const newFn = function () {
    if (toggle.state()) {
      fn();
    } else {
      toggle.set(resetOnFalse);
    }
  };

  return [newFn, toggle];
}

function rejectErrors(fn) {
  try {
    fn();
  } catch (e) {}
}

function createOrderedCalls(...fns) {
  return function (...args) {
    for (let i = 0; i < fns.length; i++) {
      fns[i](args[i]);
    }
  };
}




export {
  ReferencableBoolean,
  rejectErrors,
  addToggle,
  createOrderedCalls,
  runAfterLoad,
};
