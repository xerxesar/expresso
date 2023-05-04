class AutoFlag {
  constructor(value, timeout) {
    this.value = value || false;
    this.timeout = timeout;
    this.timeoutRef = null;
  }

  setTrue(onTimeout, timeout) {
    const _timeout = timeout === -1 ? undefined : this.timeout || timeout;
    const _activated = !this.value;
    if (_activated) {
      this.value = true;
      if (_timeout) {
        setTimeout(() => {
          if (this.value) {
            this.value = false;
            if (onTimeout) onTimeout();
          }
        }, _timeout);
      }
    }
    return _activated;
  }

  setFalse() {
    this.value = false;
  }

  valueOf() {
    return this.value;
  }
}
module.exports = {
  AutoFlag,
};
function r() {
  let f = new AutoFlag(false, 1000);

  f.setTrue(() => {
    console.log('done');
  });
}
