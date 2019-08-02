import React from "react";

const Manual = () => {
  return (
    <div className="manual border p-2 mt-2">
      <p>
        Įrašai filtruojami, nurodant pagal kokius kriterijus turi būti atrenkami. 
        Kriterijai aprašomi loginėmis operacijomis su įrašų laukų reikšmėmis. Pvz., kad kelias
        turi būti lygus vienetui (t.y., pirmasis kelias) arba kad kilometras turi būti daugiau už 200.
        Vienų laukų reikšmės yra išreikštos skaičiumi, kitų laukų reikšmės išreikštos tekstu. 
      </p>
      <p>
        Skaičiais yra išreikšti šie laukai: <span className="fn">km</span>,{" "}
        <span className="fn">pk</span>, <span className="fn">m</span>,{" "}
        <span className="fn">bmetai</span> (turimi omeny bėgio valcavimo metai),{" "}
        <span className="fn">kkateg</span> (kelio kategorija),{" "}
        <span className="fn">dstop</span> suvirinimams (suvirinimo panaikinimo žyma).
        Visų kitų laukų reikšmės (ir visos datos) išreikštos tekstu, todėl filtravimo sąlygose jų
        reikšmės turi būti rašomos kabutėse. Pvz.:{" "}
        <span className="cd">
          meistrija != '11' &amp;&amp; km &lt;= 211 &amp;&amp; (kkateg = 2 ||
          kkateg = 1) &amp;&amp; data &gt;= '2017-01-01'
        </span>
      </p>
      <p>Ateity tas dalykas, žinoma, bus tobulinamas ir turės darytis paprastesnis</p>
      <p>
        Su skaičiais išreikštų laukų reikšmėmis galima atlikti aritmetikos
        veiksmus. 
      </p>
      <p>
        Vietos koordinatės pagrindiniame kelyje palyginimui galima
        naudoti išraišką <span className="cd">vt</span> (vieta), kurios reikšmė yra{" "}
        <span className="cd">km*1000&nbsp;+&nbsp;(pk-1)*100&nbsp;+&nbsp;m</span>
        , ir kuri faktiškai reiškia kelio koordinatę, išreikštą metrais.
        Pavyzdžiui, norint išfiltruoti visus defektus, kurie yra nuo 214.03.65
        iki 222.05.99, galima rašyti filtravimo sąlygą{" "}
        <span className="cd">vt &gt;= 214265 &amp;&amp; vt &lt;= 222499</span>
        . Atkreipti dėmesį, kad piketo reikšmė mažinama vienetu. Kabutės negalimos.
      </p>
    </div>
  );
};

export default Manual;
