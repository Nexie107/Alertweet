# Alertweet
:fr: Une "mini-app" multi-plateforme basée sur les produits Google Workspace pour recevoir des notifications personnalisées de publications de comptes Twitter (X) selon leur contenu, dates/heure de publication ou de référence (période mentionnée dans la publication).

:us:/:uk: A cross-platform "mini-app" relying on Google Workspace to get custom notification on Twitter (X) posts from an accounts based on their contents and dates/time of publication or reference (mentionned in the post).

English version [below]((https://github.com/Nexie107/Alertweet#us-fr-documentation).

# :fr: Documentation
**:warning: Toute responsabilité est déclinée par rapport à l'utilisation de cette application, y compris en terme de contenu notifié et de bon focntionnement. Je ne suis pas responsable du contenu publié sur Twitter (X) que vous cherchez à surveiller.**
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
    * Dans Google Sheet: Extensions > Apps Script
    * Créer un fichier "Main.gs" et y copier-coller le contenu de [Main.gs](code/Main.gs)
    * Créer un fichier pour la détection de date et heure dans le tweet. Y copier-coller le contenu d'un de [ces fichiers](https://github.com/Nexie107/Alertweet/tree/main/code/custom%20date&time) permettant une détection spéciale pour des comptes Twitter (X) en particulier, ou considérer que tout est en dirct (notification reçue moins d'une minute après la publication du tweet) avec le contenu de [ce fichier](code/Simple_date_time.gs).

7. Accorder les autorisations. Pour la première utilisation, Google va vous demander des autorisations pour accéder à Google Sheet et Calendar.
    * Choisir `run` dans la liste des fonctions et cliquer sur "Exécuter" ![image](https://github.com/Nexie107/Alertweet/assets/151630513/2bbfe9ac-0916-4176-89fb-7476d103c8c7)
    * Un popup invitant à accorder les autorisations nécessaires apparaît. Accorder les autorisations en se laissant guider. Une fenêtre indiquant que "Google n'a pas validé cette application" apparaît. C'est normal. Cliquer sur "Paramètres avancés", puis "Accéder à Alertweet (non sécurisé)" et enfin "Autoriser". (aucune crainte, Google demande juste l'autorisation d'accéder à vos propres données !)
 

8. Créer un  déclencheur. Cela permettra de faire tourner le code automatiquement sur les serveurs de Google pour s'assurer d'être notifié au bon moment.
    * Aller dans le menu "Déclencheurs" (bouton avec une horloge dans le menu à gauche).
    * Cliquer sur "Ajouter un déclencheur" (bouton bleu en bas à droite)
    * Paramétrer comme ceci: (ou avec vos propres paramètres, même si un intervalle de déclenchement le plus bas assure un meilleur fonctionnement de l'application) ![image](https://github.com/Nexie107/Alertweet/assets/151630513/9f98f892-6a09-462b-974d-6c7c578a5310)
    * Vous recevrez par email chaque semaine un rapport des éventuelles erreurs survenues (les causes sont multiples, par exemple des erreurs de serveurs).



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
* Si le format/synthaxe des tweets postés change, des informations risquent d'être manquées (ex: des mots-clés ne correspondent pas). C'est encore plus vrai en utlisant des fonctions personnalisées pour la date et l'heure (cf [partie suivante](https://github.com/Nexie107/Alertweet#pour-les-geeks))

## Pour les geeks
Vous pouvez choisir de développer vos propres fonctions pour analyser les tweets plus en profondeur en Google Apps Script (Javascript), notament pour détecter des dates et heures. Par exemple, si un service de transport en communs annonce des perturbations à une date ultérieure, il sera plus intéressant de recevoir la notification ultérieurement plutôt qu'au moment du tweet.

* La fonction qui détecte les mots clés prend en entrée un string unique et renvoie un booléen, où true correspond à un mot clé détecté.
* Celle qui récupère les dates dans le corps d'un tweet prend en entrée un string unique et renvoie soit une date (format date de js) ou un array de dates.
* Celle qui récupère les heures dans le corps d'un tweet prend en entrée un string unique et renvoie un array de 2 dates dont la première est la date de début et la seconde celle de fin.
* Si vous souhaitez voir vos fonctions personnalisées intégrées au projet, parlez-en [ici](https://github.com/Nexie107/Alertweet/discussions/1) !

# :us:/:uk: Documentation 
**:warning: Disclaimer: All responsibility is disclaimed regarding the use of this application, including in terms of the notified content and proper functioning. I am not liable for the content published on Twitter (X) that you are seeking to monitor.**
## What is Alertweet
Alertweet is a tool developed on Google Apps Script that allows receiving personalized notifications for posts from a public Twitter account. This enables filtering tweets based on:
  * Keywords,
  * Date and time, either of tweet publication or a date and/or hour mentioned in the tweet.

Notifications are sent via Google Calendar events. The application configuration is done through a Google Sheet file. The use of Google services, in addition to their broad accessibility (both for developers and their audience), ensures complete transparency in terms of code and security.

## Prerequisites
* A Google account (if you have multiple Google accounts, use only one for this app)
* A computer connected to the internet
* Very (very) basic knowledge of Google Sheet/Excel 

## Initial Setup
### Creating the Tool
1. Create a [Google Calendar](https://calendar.google.com/calendar/u/0/r) and retrieve its ID:
    * In the left menu, click on "+" next to "Other Calendars," then "Create Calendar." Name it and set it up, then create.
    * (While still) in the settings, choose the created calendar and scroll down to "Calendar ID." Copy the ID.
2. Create and name a Google Sheet file with the same Google account as the calendar. If you're not using Google Sheet in English language, set the function names to English (File > Settings > Always use English function names).
3. Create and name 2 sheets `settings` and `logs`
4. In the `settings` sheet:
    * Replicate according to the image below (language doesn't matter, but order and content do; e.g., week starting on Monday).
    * Insert a checkbox in B12 (Insert > Checkbox) 
    * Write the formula `="'"&substitute(SUBSTITUTE(B2;",";",");"-";"-")` in C2 and fill it down to C8.
    * Write the formula `=if(Not(ISBLANK(B2));MOD(ROW(A2)-1;7);)` in D2 and fill it down to D8.
    * Write the formula `=IF(LEFT(B11;1)="@";RIGHT(B11;LEN(B11)-1);B11)` in C11.
    * Paste the calendar ID (step 1) into D13.
    * (Optional) hide columns C and D (select columns > right-click > hide columns).
    
![image](https://github.com/Nexie107/Alertweet/assets/151630513/daf03348-7333-4ea2-9a87-47a296e8b8a8)

5. In the `logs` sheet:
    * Replicate according to the image below (language doesn't matter, but order and content do).
    * (Optional) freeze row 1: right-click on the row number (1) > Show more options > Freeze up to row 1.

>:bulb: This sheet will record all tweets that have been retained after filtering by keywords, date, and time.
      
![image](https://github.com/Nexie107/Alertweet/assets/151630513/25a180fc-ce8f-4e4e-8488-627c93d4f0f2)

6. Create the macros:
    * In Google Sheet: Extensions > Apps Script
    * Create a file "Main.gs" and copy-paste the content of [Main.gs](code/Main.gs)
    * Create a file for date and time detection in the tweet. Copy-paste the content of one of [these files](https://github.com/Nexie107/Alertweet/tree/main/code/custom%20date&time) that allows special detection for specific Twitter accounts (X), or consider everything is live (notification received less than a minute after the publication of the tweet) with the content of [this file](code/Simple_date_time.gs).

7. Grant permissions. For the first use, Google will ask for permissions to access Google Sheet and Calendar.
    * Choose `run` from the list of functions and click "Run" ![image](https://github.com/Nexie107/Alertweet/assets/151630513/2bbfe9ac-0916-4176-89fb-7476d103c8c7)
    * A popup inviting you to grant the necessary permissions will appear. Grant the permissions by following the instructions. A window indicating that "Google has not verified this app" will appear. This is normal. Click "Advanced settings," then "Access Alertweet (not secure)" and finally "Authorize." (no worries, Google is just asking for permission to access your own data!)

8. Create a trigger. This will allow the code to run automatically on Google's servers to ensure you are notified at the right time.
    * Go to the "Triggers" menu (clock button in the left menu).
    * Click on "Add Trigger" (blue button at the bottom right)
    * Set it up like this: (or with your own settings, although a lower trigger interval ensures better application performance) ![image](https://github.com/Nexie107/Alertweet/assets/151630513/fd8589cd-8c08-47bf-8c4b-41ce8eccfeb4)
    * You will receive a weekly email report of any errors that may have occurred (causes are diverse, such as server errors).

## Providing Information for the monitored Account, keywords, dates and times
In the `settings` sheet, fill in the time ranges you want to monitor (tweets mentioning these times, or published during them if not mentioned, will be retained):
  1. Across from the relevant day (B2 to B8), fill in the format `[start time of the range]-[end time of the range]`. The time format to adopt is `[hh]:[mm]` with 24-hour format. To have multiple time ranges on the same day of the week, separate them with a comma without space. (e.g., `7:00-9:00,17:00-19:00` to monitor between 7:00 and 9:00, then between 17:00 and 19:00).
  2. Fill in the keywords, separated by commas without spaces. :warning: keywords will be searched as they are written there, so be careful with case sensitivity!
  3. Fill in the name of the Twitter account (X) to monitor (@...) in B11. 

> :bulb: **Tip:** To avoid monitoring a day, leave the corresponding cell empty. To monitor the entire day, write `00:00-23:59`.

> :bulb: **Tip:** To choose keywords correctly, it is recommended to check the words used in the tweets of the account to be monitored. If you don't have a Twitter account (X), you can use [Twstalker](https://twstalker.com/).

>:warning: Unchecking the **`ON/OFF`** box (B12) will completely stop the application (OFF)! So, no tweets will be processed, even if they concern a later time.

## Limitations
* Only one Twitter account can be monitored at a time.
* There is a risk of missing information when the **`ON/OFF`** checkbox is unchecked (OFF).
* Changing monitoring periods may lead to missing information about new periods if they were posted before the change.
* If the format/syntax of posted tweets changes, information may be missed (e.g., keywords not matching). This is even more true when using custom functions for date and time (see [next section](https://github.com/Nexie107/Alertweet#for-geeks)).

## For Geeks
You can choose to develop your own functions to analyze tweets more deeply in Google Apps Script (JavaScript), especially for detecting dates and times. For example, if a public transport service announces disruptions at a later date, it would be more interesting to receive the notification later than at the time of the tweet.

* The function that detects keywords takes a unique string as input and returns a boolean, where true corresponds to a detected keyword.
* The one that retrieves dates from the body of a tweet takes a unique string as input and returns either a date (JavaScript date format) or an array of dates.
* The one that retrieves hours from the body of a tweet takes a unique string as input and returns an array of 2 dates, where the first is the start date and the second is the end date.
* If you want to see your custom functions integrated into the project, discuss it [here](https://github.com/Nexie107/Alertweet/discussions/1)!
