# Visualizer — Plugin A.V.A.T.A.R

![visualizer](../../core/plugins/visualizer/assets/images/visualizer.png =100x*)

--

## Description

Le plugin Visualizer affiche une fenêtre animée réactive au son en temps réel. Il capte simultanément l'entrée microphone et la sortie audio Windows.
Dix styles d'orbe sont disponibles, allant de la sphère WebGL au visualiseur Matrix, en passant par un égaliseur circulaire FFT, un feu plasma, ou une surface d'eau animée.

--

## Prévisualisation

Une page de prévisualisation interactive est disponible : **[preview.html](../../core/plugins/visualizer/preview.html)**

Elle affiche les 10 orbes en miniature avec animation en temps réel, et un lien direct pour ouvrir chaque orbe en plein écran dans le navigateur.

--

## Installation

1. Copier le dossier dans `<AVATAR>/resources/app/core/plugins/visualizer/`
2. Redémarrer A.V.A.T.A.R Server
3. Dans Widget Studio, ajouter le widget `Button_visualizer` (code appareil : `927413`)
![visualizer](../../core/plugins/visualizer/assets/widget/widget-visualizer.png =400x*)

4. Optionnel : configurer le menu circulaire du widget avec le label `Orbe suivante` et la commande `command=cycleOrb` (voir image ci-dessus)
		1--Dans Widget Studio → label : "Orbe suivante"
		2--Cliquer Ajouter
		3--Sélectionner plugin Visualizer
		4--Dans le champ commande : "command=cycleOrb"
		5--Cliquer Associer
		6--Cliquer Modifier pour sauvegarder

--

## Styles d'orbe

| # | Nom | Description |
|---|---|---|
| 1 | Sphère WebGL 			| Sphère avec bruit fractal GLSL |
| 2 | Graphe neuronal 		| Nœuds interconnectés avec signaux animés |
| 3 | Particules organiques | Nuage de particules avec répulsion et attraction |
| 4 | Matrix 				| Pluie de katakana avec têtes réactives au son |
| 5 | Oscilloscope 			| Onde FFT circulaire sur périmètre |
| 6 | Feu plasma 			| Particules de feu avec turbulence audio |
| 7 | Constellation 		| Étoiles rotatives, connexions et étoiles filantes |
| 8 | Vortex tunnel 		| Anneaux en perspective avec torsion audio |
| 9 | Égaliseur circulaire 	| Barres FFT en cercle avec pics mémorisés |
| 10 | Eau / Ripple 		| Surface d'eau avec ondulations propagées |

--

## Commandes vocales

| Commande | Action |
|---|---|
| "open the visualizer" / "open the orb" | Ouvre la fenêtre |
| "close the visualizer" / "close the orb" | Ferme la fenêtre |
| "orb one" / "orb sphere" | Orbe 1 — Sphère WebGL |
| "orb two" / "orb graph" | Orbe 2 — Graphe neuronal |
| "orb three" / "orb organic" | Orbe 3 — Particules organiques |
| "orb four" / "orb matrix" | Orbe 4 — Matrix |
| "orb five" / "orb Oscilloscope" | Orbe 5 — Oscilloscope circulaire |
| "orb six" / "orb Plasma" | Orbe 6 — Feu plasma |
| "orb seven" / "orb Constellation" | Orbe 7 — Constellation |
| "orb heigt" / "orb Vortex" | Orbe 8 — Vortex tunnel |
| "orb nine" / "orb Equalizer" | Orbe 9 — Égaliseur circulaire |
| "orb ten" / "orb Ripple" | Orbe 10 — Eau / Ripple |

--

## Utilisation du widget

- **Clic simple** : ouvre ou ferme la fenêtre
- **Double-clic** : passe à l'orbe suivante (cycle 1→2→…→10→1)

--

## Plein écran

Double-cliquer sur n'importe quelle orbe, faire un clic droit, ou appuyer sur **F11** pour basculer en plein écran. Même action pour revenir en taille normale.

--

## Configuration (visualizer.prop)

| Clé | Description |
|---|---|
| `orbStyle` | Orbe affichée au démarrage (1 à 10) |
| `autoOpen` | Ouvrir automatiquement au démarrage d'A.V.A.T.A.R |
| `opacity` | Opacité de la fenêtre (0.0 à 1.0) |
| `window.width/height` | Taille initiale de la fenêtre en pixels |
| `window.x/y` | Position initiale de la fenêtre |
| `window.alwaysOnTop` | Toujours visible au-dessus des autres fenêtres |

--

## Auteur

Plugin développé pour le système de domotique A.V.A.T.A.R.
Créé par : **Nezumi** 

<br><br>

