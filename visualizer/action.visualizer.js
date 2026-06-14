export default function (state) {
  return new Promise((resolve) => {
    setTimeout(() => {
      state.action = {
        module:  'visualizer',
        command: state.rule  // 'open', 'close', 'setOrb1', 'setOrb2', 'setOrb3'
      };
      resolve(state);
    }, Config.waitAction.time);
  });
}
