/**
 * Returns a promise that has a cancelled method that will cause the callbacks not to fire when it resolves or rejects
 * @param promise to wrap
 * @returns new promise that will only resolve or reject if cancel is not called
 */
 export default function cancellable(promise) {
    var cancelled = false;
  
    const toReturn = new Promise((resolve, reject) => {
      promise.then(() => {
        if (!cancelled) {
          resolve.apply(this, arguments);
        }
      }, () => {
        if (!cancelled) {
          reject.apply(this, arguments);
        }
      })
    });
  
    toReturn.cancel = () => cancelled = true;
    return toReturn;
  };