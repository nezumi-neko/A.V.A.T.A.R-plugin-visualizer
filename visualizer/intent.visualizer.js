import { default as _helpers } from '../../ia/node_modules/ava-ia/helpers/index.js';

export default async function (state, actions) {
  // Exit si l'intention est déjà résolue par un autre plugin
  if (state.isIntent) return (0, _helpers.resolve)(state);

  let match;
  let matchedRule;

  // Boucle sur les règles définies dans visualizer.prop
  for (var rule in Config.modules.visualizer.rules) {
    match = (0, _helpers.syntax)(state.sentence, Config.modules.visualizer.rules[rule]);
    if (match) { matchedRule = rule; break; }
  }

  if (match) {
    state.isIntent = true;
    state.rule = matchedRule; // 'open', 'close', 'setOrb1', 'setOrb2', 'setOrb3'
    return (0, _helpers.factoryActions)(state, actions);
  } else {
    return (0, _helpers.resolve)(state);
  }
}
