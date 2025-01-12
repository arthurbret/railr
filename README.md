# Voici TrainTracker <img src="./logo.png" alt="logo TrainTracker" width="50"/>

## Génèse du projet
J'utilise au quotidien les trains TER pour me rendre à l'école et régulièrement des problèmes (retards, trains supprimés...) sont présents. J'ai donc testé différentes manières pour me tenir au courant de ces perturbations : application L'assistant SNCF, l'application SNCF Connect, applications tierces. Elles fonctionnent pour la plupart mais ne sont pas complètes selon moi, elles ne proposent pas de système de notification par exemple, elles prennent du temps à s'ouvrir et beaucoup de clics sont nécessaires pour accéder à l'information recherchée. J'ai donc voulu créer une alternative rapide et simple, sans bug, facile à utiliser en proposant un accès instantanné aux retards, suppressions, grève sur la gare demandée par l'utilisateur.

## Objectifs de ce projet
**Court terme (quelques semaines) :**
 - [x] Accès au tableau des prochains trains d'une gare
 - [x] [Autocompletion barre de recherche](./#autocompletion-barre-de-recherche)
 - [ ] Amélioration visuelle site web
 - [ ] Page "train" avec toutes les informations sur le train
 - [ ] Affichage complet retards et suppression avec la cause
 
**Moyen terme (quelques mois) :**
 - [ ] Compte utilisateur avec les gares préférées
 - [ ] Système communautaire d'alerte perturbation
 - [ ] Notification webapp avec les perturbations détectées
 - [ ] Réclamation de groupe
 
 **Long terme (rentrée septembre 2024)**
 
 - [ ] Application mobile iOS/Android avec widgets
 - [ ] Application montre connectée watchOS/wearOS avec fonctionnalité logicielle

# Présentation des fonctionnalités

## Accès au tableau des prochains trains d'une gare
Fonction de base du projet, permettre l'affichage du tableau des prochains trains (comme on retrouve dans toutes les gares) de manière simplifiée pour une lecture rapide. Cette fonctionnalité est liée à la barre de recherche qui permet à l'utilisateur de rechercher le nom de la gare qu'il souhaite Tracker.

## Autocompletion barre de recherche
Fonctionnalité indispensable pour simplifier grandement la recherche. Au lieu de taper lui même le nom exact de la gare, l'utilisateur voit apparaitre des suggestions qui se rapprochent de ce qu'il a déjà tapé dans la barre de recherche. Cette fonctionnalité manque encore de certains éléments de navigation via les touches du clavier (flèche de bas pour défiler dans les suggestions et touche entrée pour valider) et d'éléments de style pour éviter que les suggestions effacent le tableau des prochains départs. Cette autocompletion génère aussi un bug de duplication des suggestions. Ces éléments vont être patchés rapidement, ils ne sont pas très compliqués à résoudre.

## Amélioration visuelle site web
N'ayant pas beaucoup d'expérience et d'affinités avec le frontend le site n'est pas très joli, certains bugs visuels sont présents comme avec les suggestions mais aussi l'affichage des retards. Ces bugs seront résolus au compte-goutte car ce n'est pas la priorité du projet.

## Page "train" avec toutes les informations sur le train
Une page dédiée qui s'affiche quand l'utilisateur clique sur un des trains affichés dans le tableau des prochains départs. Cette page permettra d'accéder au trajet complet du train, les horaires de passage de ce train chaque gare, et toutes les autres informations disponibles sur l'API SNCF.

## Affichage complet retards et suppression avec la cause
Ajout d'un petit bloc en dessous de chaque départ de train qui indique la raison de la suppression ou du retard.

## Compte utilisateur avec les gares préférées
Système de connexion avec compte utilisateur sur lequel l'utilisateur pourra enregistrer ses gares préférées pour y avoir accès encore plus rapidement. Nécessite l'ajout d'une interface de connexion qui sera probablement faite avec Firebase pour simplifier l'implémentation.

## Système communautaire d'alerte perturbation
Élement très novateur et dans l'ère du temps, en étant connecté l'utilisateur pourras signaler des perturbation sur le train dans lequel il se trouve. Si jamais l'API SNCF n'indique pas un retard l'utilisateur pourras le signaler et ce retard sera visible par tous les autres utlisateur. Au delà des retards le but est de pouvoir signaler d'autres éléments qui ne seront jamais donnés par l'API comme par exemple un train bondé, une personne qui a un comportement douteux, un bagage oublié...

## Notification webapp avec les perturbations détectées
L'objectif de ce point est de pouvoir simplifier encore la vie de l'utilisateur en lui évitant de consulter TrainTracker régulièrement pour vérifier si des perturbations sont présentes sur son train. Au lieu de ça la webapp TrainTracker sera capable d'envoyer une notification à l'utilisateur dès qu'une perturbation sera détectée. 
❗Cette fonctionnalité sera probablement payante pour supporter les frais de serveur

## Réclamation de groupe
Proposition qui fera plaisir à beaucoup d'usagers quotidiens des transports SNCF. Le but est de faire des réclamations à la SNCF en groupe. Pendant des périodes de grèves ou de retards intempestifs un bouton apparaitra et permettra à tous les usagers qui le souhaitent de faire partie de la réclamation de groupe puis cette réclamation sera envoyée en masse auprès du service SNCF concerné.

## Application mobile iOS/Android avec widgets
Cette fonctionnalité est dans la catégorie "long terme" car je ne suis pas encore assez formé pour la proposer. N'hésitez pas à me contacter si vous souhaitez apporter votre aide.

## Application montre connectée watchOS/wearOS avec fonctionnalité logicielle
Cette fonctionnalité est dans la catégorie "long terme" car je ne suis pas encore assez formé pour la proposer. N'hésitez pas à me contacter si vous souhaitez apporter votre aide.

# Utilisation de TrainTracker

Après toute cette présentation vous vous demandez probablement comment utiliser ce merveilleux service ? C'est très simple, il vous suffit de vous rendre sur ce [site web](https://arthurbret.github.io/Train-tracker/).

N'hésitez pas à me contacter sur cette adresse mail si vous souhaitez participer au projet, donner votre avis ou des conseils, ils sont tous bienvenus : abret.56@gmail.com.