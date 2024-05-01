![logo](./frontend/src/img/readmelogo.png#gh-light-mode-only) 
![logo](./frontend/src/img/logo_nimi.png#gh-dark-mode-only) 

## Esittely
Tässä projektissa luotiin sovellus, jolla voidaan etsiä elokuvia ja sarjoja sekä elokuvateattereiden näytösaikoja ja lisätä niitä omiin suosikkeihin sekä erinäisiin ryhmiin. Tämän sovelluksen toteutti Oulun ammattikorkeakoulun tieto- ja viestintätekniikan toisen vuosikurssin opiskelijat Web-ohjelmoinnin sovellusprojektin tuotoksena keväällä 2024. 

Projektin esittely [Youtube-video](https://www.youtube.com/watch?v=HQ_kgyvaYF0) ja linkki [sovellukseen](https://filmiverkko.onrender.com).

---
### Sovelluksen käyttöönotto
1. Kloonaa repository 
2. Aja Npm install komento backend- ja frontend-kansioissa
3. Luo .env tiedosto backend -kansioon:
    >PG_HOST = 
    >
    >PG_PORT = 
    >
    >PG_DATABASE =
    > 
    >PG_USER = 
    >
    >PG_PW =
    >
    >user =
    > 
    >JWT_SECRET=
    >
    >TMDB_API_KEY= (The movie Databasesta API-avain) 
4. Npm start backend- ja frontend -kansioissa.

---

### Sovelluksen ominaisuudet
Sovelluksesta löytyy monenlaisia ominaisuuksia elokuvien ja sarjojen tutkimiseen. 

Aloitussivulle (kuva 1) saapuessa tulee näkyviin Finnkinon uusimman elokuvan traileri. Selatessa sivua alaspäin löytyy The Movie Databasen suosituimmat elokuvat ja sarjat.

![Aloitus-sivu](./documents/Readme/aloitussivu.png)
*Kuva 1 Aloitussivu*

Haku-sivulta voidaan etsiä elokuvia ja sarjoja hakusanan, genren, vuosikymmenen ja arvosana-asteikon mukaan (kuva 2). Elokuvan tai sarjan kuvaa klikkaamalla saat kyseisestä elokuvasta tai sarjasta enemmän tietoa ja tietokannasta mahdollisesti löytyvät arvostelut (kuva 3). Jos olet kirjautuneena sivulle voit lisätä valitun elokuvan tai sarjan suosikkeihin, omiin ryhmiisi sekä kirjoittaa arvostelun elokuvasta. 

![Haku-sivu](./documents/Readme/haku.png)
*Kuva 2 Hakusivu*

![Ponnahdusikkuna](./documents/Readme/popupwindow.png)
*Kuva 3 Haku-sivun media elementistä*

Näytökset-sivulta (kuva 4) pystytään etsimään elokuvanäytöksiä eri teattereista päivämäärän mukaan. Jos olet kirjautuneena sivulle, voit lisätä näytöksen omiin ryhmiisi. 

![Näytös-sivu](./documents/Readme/naytos.png)
*Kuva 4 Näytökset-sivusta*

Ryhmät-sivulla (kuva 5) voidaan selailla ryhmiä ja kirjautuneena pyytää pääsyä ryhmiin, luoda ryhmä sekä nähdä niiden ryhmien sisällön (kuva 6), mihin kuulut. 

![Ryhmät-sivu](./documents/Readme/ryhma.png)
*Kuva 5 Ryhmät-sivusta*
![Ryhmä-sivu](./documents/Readme/ryhmasivu.png)
*Kuva 6 Yksittäisen ryhmän sivusta*

Suosikit-sivuilta (kuva 7) löytyy kirjautuneena käyttäjän oma suosikkilista, jota pystyy jakamaan myös muille sivulla olevan linkin avulla. Täällä pystytään myös hallinnoimaan omaa suosikkilistaa eli poistamaan elokuvia tai sarjoja listalta. 

![Suosikit-sivu](./documents/Readme/suosikki.png)
*Kuva 7 Suosikit-sivusta*

Arvostelut-sivulta (kuva 8) pystytään lukemaan arvosteluja, joita käyttäjät ovat elokuvista antaneet. 
![Arvostelu-sivu](./documents/Readme/arvostelut.png)
*Kuva 8 Arvostelut-sivusta*

Kirjautuneena profiilikuvaa klikkaamalla päästään profiilisivulle (kuva 9), jossa näkyy tunnuksen tiedot ja profiilikuva, jonka voi vaihtaa. Tämän lisäksi näkyy viisi viimeisintä sinun suosikkilistallesi lisäämää elokuvaa tai sarjaa ja klikkaamalla Näytä lisää mennään Suosikit-sivulle. Viimeisenä näkyy alue, jossa on ryhmät, joihin käyttäjä kuuluu, sekä hallinnoimiesi ryhmien jäsenpyynnöt. 

![Profiili-sivu](./documents/Readme/profile.png)
*Kuva 9 Profiili-sivusta*

---

### Projektin toteutus 
Projektit toteutettiin osana Tieto- ja viestintätekniikan koulutusta keväällä 2024. Projekti aloitettiin luennoilla sovelluksen rakentamisesta. Tämän jälkeen alkoi projektin toteutus. Ensimmäiset kaksi viikko olivat projektiryhmän muodostamista ja suunnittelua varten. Suunnittelun aikana teimme alustavat ER-kaaviot (kuvassa 10 lopullinen ER-kaavio), UI-suunnitelmat (kuva 11) ja Rest-dokumentaatio (lopullinen [Rest-dokumentaatio](https://documenter.getpostman.com/view/29936650/2sA3JDhRKW)). Suunnittelussa käytimme apuna Miro-sovellusta. 

![ER-Diagram](./documents/ER-kaavio.png)

*Kuva 10 ER-kaavio*

![FULLDESINGPLAN](./documents/UI-suunnitelma/UI-suunnitelma.png)
*Kuva 11 UI-suunnitelma*

Toteutusvaiheessa hyödynsimme Discordia sekä GitHubin projektin hallintaa Kanban-mallilla. Tämä mahdollisti selkeän projektinhallinnan ja töiden jakamisen.  Projekti toteutettiin Visual Studio Codella, jossa käytettiin Reactia ja Nodea. Projektin toteutus kesti hiukan yli kuukauden. Pysyimme hyvin aikataulussa ja saavutimme kaikki toiminnallisuudet, joita tavoittelimme. 

---

### Ryhmän esittely ja vastuualueet 

<div style="display: flex; align-items: center;">
    <a href="https://github.com/ArttuA02">
        <img src="https://github.com/ArttuA02.png" alt="Arttu Aalto" width="100px" style=" margin-right: 10px; padding-right: 100px">
    </a>
    <div>
        Arttu Aalto - Ryhmän luonti ja ryhmien haku sivulle tietokannasta sekä ryhmän oman sivun alustava layout, suosikkien lisääminen- ja haku tietokannasta, infotekstien lisäämistä sekä kaikkea muuta pientä säätöä eri sivuille.
    </div>
</div>
 
<div style="display: flex; align-items: center;">
    <a href="https://github.com/Ville-A">
        <img src="https://github.com/Ville-A.png" alt="Ville Ahola" width="100px" style=" margin-right: 10px; padding-right: 100px">
    </a>
    <div>
        Ville Ahola – Sovelluksen tietokannan luonti, ylläpito ja muokkaukset. Backendin runko. Käyttäjän rekisteröinti, kirjautuminen ja poistaminen (fullstack). Token-middleware suojattuihin endpointeihin. Ryhmäsivujen liittymispyyntöjen lähetys ja vastaanottaminen profiilisivulle (fullstack).   Ryhmän roolien luonti, admin ja user (fullstack)
    </div>
</div>

<div style="display: flex; align-items: center;">
    <a href="https://github.com/AvaRaGane">
        <img src="https://github.com/AvaRaGane.png" alt="Juha-Matti Huhta" width="100px" style=" margin-right: 10px; padding-right: 100px">
    </a>
    <div>
        Juha-Matti Huhta – React-sovelluksen runko, oman näkymän(suosikkilistan) jakaminen, ryhmän sisällön lisääminen, ryhmän jäsenen poistaminen(frontend), leffa-arvostelujen selaaminen, leffa-arvostelujen lisääminen(backend), suodatettu haku(kriteerit), Finnkinon näytösaikojen hakeminen ja lisääminen ryhmään, suosikkien tulostuksen muokkaus sekä kaikkea muuta.
    </div>
</div>
 
<div style="display: flex; align-items: center;">
    <a href="https://github.com/MikkoKom">
        <img src="https://github.com/MikkoKom.png" alt="Mikko Komulainen" width="100px" style=" margin-right: 10px; padding-right: 70px">
    </a>
    <div>
        Mikko Komulainen - Haunrunko. Jäsenen poistaminen ryhmästä. Salasanan vaihto. Esittelyvideon kuvaus, juontaminen, editointi ja julkaiseminen.
    </div>
</div>
 

<div style="display: flex; align-items: center;">
    <a href="https://github.com/Ereride">
        <img src="https://github.com/Ereride.png" alt="Minna Leppänen" width="100px" style=" margin-right: 10px; padding-right: 100px">
    </a>
    <div>
        Minna Leppänen - React-sovelluksen runko sekä sivuston tyylittely ja responsiivisuus. Lisäksi aloitussivu (fullstack), profiilisivu (fullstack) ja median ponnahdusikkunan (fullstack) sekä kaikkea muuta.
    </div>
</div>




 
