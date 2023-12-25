# Alertweet
:fr: Une "mini-app" multi-plateforme basée sur les produits Google Workspace pour recevoir des notifications personnalisées de publications de comptes Twitter (X) selon leur contenu, dates/heure de publication ou de référence (période mentionnée dans la publication).

:us:/:uk: A cross-platform "mini-app" relying on Google Workspace to get custom notification on Twitter (X) posts from an accounts based on their contents and dates/time of publication or reference (mentionned in the post).

# :fr: Documentation
## Ce qu'est Alertweet
Alertweet est un outil développé sur Google Apps script permettant de recevoir des notification personnalisées de posts d'un compte Twitter public. Cela permet de filtrer les tweets selon:
  * Des mots-clés,
  * La date et l'heure. Soit de publication du tweet, soit d'une date et/ou heure mentionnés dans le tweet.

Les notifications sont envoyées via des évènements Google Calendar. Le paramétrage de l'appli se fait depuis un fichier Google Sheet.
L'utilisation des services Google, en plus de leur grande accessibilité (tant au développeur qu'à son public), garantit une totale transparence en matière de code et de sécurité.

## Pré-requis
* Un compte Google (si vous disposez de plusieurs comptes Google, n'en utilisez qu'un seul pour cette appli)
* Un ordinateur connecté à internet
* Des connaissances très (très) élémentaires en Google Sheet (/Excel) 

## Mise en place initiale
### Création de l'outil
1. Créer un calendrier [Google Calendar](https://calendar.google.com/calendar/u/0/r) et récupérer son ID:
    * dans le menu à gauche, cliquer sur "+" à côté de "Autres Agendas" puis "Créer un agenda". Le nommer et paramétrer puis créer.
    * (en restant) dans les paramètres, choisir l'agenda créé et descendre jusqu'à "ID de l'agenda". Copier l'ID.
2. Créer et nommer un fichier Google Sheet avec le même compte Google que le calendrier. Passer les noms de fonctions en anglais (Fichier > Paramètres > Toujours utiliser les noms de fonction en anglais)
3. Créer et nommer 2 feuilles `settings` et `logs`
4. Dans la feuille `settings`:
    * Reproduire selon l'image ci-dessous (la langue n'importe pas, mais l'ordre et le contenu (ex: semaine commençant le Lundi); si.
    * Mettre une case à cocher en B12 (Insertion > case à cocher) 
    * Mettre la formule `="'"&substitute(SUBSTITUTE(B2;",";",");"-";"-")` en C2 et propager jusqu'à C8.
    * Mettre la formule `=if(Not(ISBLANK(B2));MOD(ROW(A2)-1;7);)` en D2 et propager jusqu'à D8.
    * Mettre la formule `=IF(LEFT(B11;1)="@";RIGHT(B11;LEN(B11)-1);B11)` en C11.
    * Coller l'ID de l'agenda (cf étape 1) en D13.
    * (Optionel) masquer les colonnes C et D (sélectionner les colonnes > clic droit > masquer les colonnes).
    
![image](https://github.com/Nexie107/Alertweet/assets/151630513/daf03348-7333-4ea2-9a87-47a296e8b8a8)

5. Dans la feuille `logs`:
    * reproduire selon l'image ci-dessous (la langue n'importe pas, mais l'ordre et le contenu (ex: semaine commençant le Lundi); si.
    * (optionel) figer la ligne 1: clic droit sur le numéro de la ligne (1) > Afficher plus d'options > Figer jusqu'à la ligne 1.

>:bulb: C'est dans cette feuille qu seront inscirts tous les tweets qui ont été retenus après filtrage par mots-clés, date et heure.
      
![image](https://github.com/Nexie107/Alertweet/assets/151630513/25a180fc-ce8f-4e4e-8488-627c93d4f0f2)

6. Créer les macros:
    * Extensions > Apps Script
    * Créer les fichiers suivants: "Main.gs" et un autres à nommer à la convenance
    *  

## Renseignement du compte à surveiller, mots-clés, dates et heures
Dans la feuille `settings`, remplir les plages horaires que vous voulez surveiller (les tweet mentionnant ces plages, ou publié durant celles-ci s'il n'en mentionne aucune sera retenu):
  1. En face du jour concerné (B2 à B8), remplir au format `[heure du début de la plage]-[heure de la fin de la plage]`. Le format d'heure à adopter est `[hh]:[mm]` avec les heures au format 24h. Pour avoir plusieurs plages horaires sur un même jour de la semaine, les séparer par une virgule sans espace. (ex: `7:00-9:00,17:00-19:00` pour surveiller entre 7:00 et 9:00, puis entre 17:00 et 19:00).
  2. Remplir les mots-clés, séparés par des virgules sans espaces. :warning: les mots-clés seront recherchés tels quels, donc attention à la casse !
  3. Remplir le nom du compte Twitter (X) à surveiller (@...) en B11. 

> :bulb: **Astuce:** Pour ne pas surveiller un jour, laisser la cellule correspondante vide. A l'inverse, pour surveiller la journée complète, écrire `00:00-23:59`.

> :bulb: **Astuce:** Pour choisir correctement les mots-clés, il est conseillé d'aller vérifier les mots employés dans les tweets du compte à surveiller. Si vous n'avez pas de compte Twitter (X), vous pouvez utiliser [Twstalker](https://twstalker.com/).

>:warning: Décocher la case **`ON/OFF`** (B12) arrêtera complètement le fonctionnement de l'appli (OFF) ! Donc aucun tweet ne sera traité, même s'il concerne un moment ultérieur

## Limites
* Un seul compte tweeter peut être surveillé à la fois.
* Il y a un risque de manquer des infos lorsque la case **`ON/OFF`** est décochée (OFF).
* Changer les périodes de surveillance risque de conduire à manquer des informations concernant les nouvelles périodes si elles ont été postées avant le changement.
* Si le format/synthaxe des tweets postés change, des informations risquent d'être manquées (ex: des mots-clés ne correspondent pas). C'est encore plus vrai en utlisant des fonctions poersonnalisées pour la date et l'heure (cf [partie suivante](https://github.com/Nexie107/Alertweet#pour-les-geeks))

## Pour les geeks
Vous pouvez choisir de développer vos propres fonctions pour analyser les tweets plus en profondeur en Google Apps Script (Javascript), notament pour détecter des dates et heures. Par exemple, si un service de transport en communs annonce des perturbations à une date ultérieure, il sera plus intéressant de recevoir la notification ultérieurement plutôt qu'au moment du tweet.

* La fonction qui détecte les mots clés prend en entrée un string unique et renvoie un booléen, où true correspond à un mot clé détecté.
* Celle qui récupère les dates dans le corps d'un tweet prend en entrée un string unique et renvoie soit une date (format date de js) ou un array de dates.
* Celle qui récupère les heures dans le corps d'un tweet prend en entrée un string unique et renvoie un array de 2 dates dont la première est la date de début et la seconde celle de fin.
