Hajusrakenduste projekt:

Taskapp projekt, kus on CRUD operatsioonid ülesannete (taskide) jaoks.

Tegijad:
Tormi Laane
Mel Kosk

Õpetaja: Kristjan Kivikangur

Projektihalduslink: https://trello.com/invite/b/68f0a812968004ea9423e498/ATTI4d0920a19c01a049a8a539f0610cc32c63E12EF7/taskapp-tormilaane-melkosk

## Projekti käivitamine

Mine kausta backend ja nimeta ümber .env.example -> .env

Siis täida .env fail sobivate andmetega

Mine kausta frontend ja nimeta ümber .env.example -> .env

Siis täida .env fail sobivate andmetega

Peale kloonimist minna kloonitud kausta ja käivitada käsk:
"npm install"
Projekti käivitamiseks anda käsk:
"npm start"

Projekt töötab ja kuvab veebilehed, millelt saab lehte külastada.
Lõpetamiseks vajuta klahve CTRL+C

## Azure Evitus
1. **Tee kindlaks, et .env.example on nimetatud ringi .env'iks <br>(Frontend ja backend kaustades)<br>**
![alt text](image-1.png)
2. Käivita käsklus "**npm run dep-pre**", et puhastada repo.
![alt text](image-2.png)
3. Installi "**Azure App Service**" plugin Visual Studio Code's
![alt text](image-3.png)
4. Logi enda kontoga sisse
![alt text](image-4.png)
5. Parem klõpsa "**App Services**"
![alt text](image-5.png)
6. Vali "**Create New Web App**"
![alt text](image-6.png)
7. Vali ressursi asukoht (Soovitan "Recommended" asukohta)
![alt text](image-7.png)
8. Pane unikaalne nimi "taskapp" või midagi muud
![alt text](image-8.png)
9. Vali "**Node 24 LTS**" runtime stack
![alt text](image-9.png)
10. Vali "**Free**" või "**Basic**"
![alt text](image-10.png)
11. Oota kuni service on loodud
12. Parem klõpsa loodud service peal
13. Klikka "**Deploy to Web App**"
14. Vali ülevalt aknast taskapp repo
15. Oota kuni see on evitatud ja valmis ehitatud, **see võtab natukene aega (2-10 minutit)**
16. Parem klõps sinu loodud service peal
17. Klikka "**Browse Website**"
18. Nüüd peaks projekt olema evitatud Azure keskkonnas

## Azure Probleemide lahendus
1. Andmebaas ei töötanud, pidi selle ära kustutama
2. Deploy ei töödanud kuna node_modules eksisteeris, selle pidi ära kustutama
3. Ressurssi asukoha probleem, Azure veebi keskkonnas pidi vaatama "recommended locations"