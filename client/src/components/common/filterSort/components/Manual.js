import React from "react";

const Manual = () => {
  return (
    <div className="manual border p-2 mt-2">
      <p>
        Skaičiais yra išreikšti šie laukai: <span className="fn">km</span>,{" "}
        <span className="fn">pk</span>, <span className="fn">m</span>,{" "}
        <span className="fn">metai</span> (turimi omeny bėgio valcavimo metai).
        Visų kitų laukų reikšmės išreikštos tekstu, todėl filtravimo sąlygose jų
        reikšmės turi būti rašomos kabutėse. Pvz.:{" "}
        <span className="cd">
          meistrij != '11' &amp;&amp; km &lt;= 211 &amp;&amp; (kkateg = '2' ||
          kkateg = '1')
        </span>
      </p>
      <p>
        Su skaičiais išreikštų laukų reikšmėmis galima atlikti aritmetikos
        veiksmus. Vietos koordinačių pagrindiniame kelyje palyginimui galima
        naudoti išraišką <span className="cd">_m_</span> (metrai), kurios reikšmė yra{" "}
        <span className="cd">km*1000&nbsp;+&nbsp;(pk-1)*100&nbsp;+&nbsp;m</span>
        , ir kuri faktiškai reiškia kelio koordinatę, išreikštą metrais.
        Pavyzdžiui, norint išfiltruoti visus defektus, kurie yra nuo 214.03.65
        iki 222.05.99, galima rašyti filtravimo sąlygą{" "}
        <span className="cd">_m_ &gt;= 214265 &amp;&amp; _m_ &lt;= 222499</span>
        . Atkreipti dėmesį, kad piketo reikšmė mažinama vienetu. Kabutės negalimos.
      </p>
      <p>
        Panaši į <span className="cd">_m_</span> išraišką vietos koordinatei
        pagrindiniame kelyje nurodyti yra <span className="cd">_k_</span> (koordinatė). Tik čia formatas yra: <span className="cd">km.pk.m</span>. Pavyzdžiui,
        norint išfiltruoti visus defektus, kurie yra nuo 74.03.65 iki 112.10.09,
        galima rašyti filtravimo sąlygą{" "}
        <span className="cd">_k_ &gt;= 74.3.65 &amp;&amp; _k_ &lt;= 112.10.9</span>. Čia piketas rašomas toks kaip defekto kode. Piketams ir metrams nuliai
        priekyje nebūtini. Piketas turėtų būti skaičius nuo 1 iki 10, metrai - skaičius nuo 0 iki 99. Kabutės negalimos.
      </p>
      <p>
        Laukai <span className="fn">action</span>,{" "}
        <span className="fn">data</span>, <span className="fn">oper</span>,{" "}
        <span className="fn">apar</span>, <span className="fn">kodas</span>,{" "}
        <span className="fn">dh</span>, <span className="fn">dl</span>,{" "}
        <span className="fn">pavoj</span> - yra history įrašuose, kurių vienas
        defektas gali turėti kelis. <span className="fn">action</span>{" "}
        <span className="fv">"aptikta"</span> ir{" "}
        <span className="fv">"perrašyta"</span> atlieka tik operatorius,{" "}
        <span className="fv">"pakeista"</span>,{" "}
        <span className="fv">"tvarsliuota"</span>,{" "}
        <span className="fv">"pervirinta"</span> alieka tik eksploatacija.
      </p>
      <p>Skirtingų history įrašų laukus galima pasiekti:</p>
      <ul>
        <li>
          <em>paties pirmojo</em> history įrašo - prie lauko pavadinimo
          pridedant galūnę <span className="cd">_0</span>:{" "}
          <span className="fn">action_0</span>,{" "}
          <span className="fn">pavoj_0</span>, <span className="fn">dh_0</span>{" "}
          ir pan. Pvz.:
          <br />
          <span className="cd">kodas_0 = '17.2' &amp;&amp; pavoj_0 = 'D3'</span>
          <br />
          (pats pirmasis history įrašas bus atliktas operatoriaus, nes defektus
          randa operatoriai);
        </li>
        <li>
          pirmojo <em>eksploatacijos</em> atlikto history įrašo - prie lauko
          pavadinimo pridedant galūnę <span className="cd">_ex0</span>:{" "}
          <span className="fn">action_ex0</span>,{" "}
          <span className="fn">date_ex0</span>. Pvz.:
          <br />
          <span className="cd">
            date_ex0 &lt; '2017-02-18' &amp;&amp; action_ex0 = 'tvarsliuota'
          </span>
          ;
        </li>
        <li>
          <em>paties paskutiniojo</em> history įrašo - prie lauko pavadinimo
          pridedant galūnę <span className="cd">_9</span>:{" "}
          <span className="fn">action_9</span>,{" "}
          <span className="fn">pavoj_9</span>, <span className="fn">dh_9</span>{" "}
          ir pan. Pvz.:
          <br />
          <span className="cd">kodas_9 = '17.2' &amp;&amp; pavoj_9 = 'D3'</span>
          ;
        </li>
        <li>
          paskutiniojo <em>operatoriaus</em> atlikto veiksmo įrašo - prie lauko
          pavadinimo pridedant galūnę <span className="cd">_op9</span>:{" "}
          <span className="fn">action_op9</span>,{" "}
          <span className="fn">pavoj_op9</span>,{" "}
          <span className="fn">dh_op9</span> ir pan. Pvz.:
          <br />
          <span className="cd">
            kodas_op9 = '17.2' &amp;&amp; pavoj_op9 = 'D3'
          </span>
          ;
        </li>
        <li>
          paskutiniojo <em>eksploatacijos</em> atlikto veiksmo įrašo - prie
          lauko pavadinimo pridedant galūnę <span className="cd">_ex9</span>:{" "}
          <span className="fn">action_ex9</span>,{" "}
          <span className="fn">pavoj_ex9</span>,{" "}
          <span className="fn">dh_ex9</span>. Pvz.:
          <br />
          <span className="cd">
            date_ex9 &lt; '2017-02-18' &amp;&amp; action_ex9 = 'tvarsliuota'
          </span>
          ;
        </li>
        <li>
          norint nurodyti, kad salygą turėtų tenkinti <em>kuris nors</em> iš
          history įrašų <em>arba keli</em>, sąlygos reiškiniai įrašomi į
          funkciją <span className="cd">some</span>, o prie laukų pavadinimų
          pridedama galūnė <span className="fn">_x</span>.<br />
          Pavyzdžiui, užrašas{" "}
          <span className="cd">
            some(apar_x = '806' &amp;&amp; data &lt; '2017-01-01')
          </span>{" "}
          reiškia, kad ieškoma tokių defektų, kurių history turėtų bent vieną
          įrašą, kuriame būtų nurodytas aparato kodas 806 ir to įrašo data būtų
          ankstesnė nei 2017 metai.
        </li>
      </ul>
      <p>
        Sakykime, norime rasti visus šiuo metu sutvarsliuotus defektus kelyje.
        Tada jų pats paskutinis <em>eksploatacijos atliktas</em> įrašas turėtų
        turėti <span className="fn">action</span> reikšmę{" "}
        <span className="fv">"tvarsliuota"</span>. Filtras būtų{" "}
        <span className="cd">action_ex9 = 'tvarsliuota'</span>.
      </p>
      <p>
        Sakykime, norime rasti visus defektus, kurie kada nors buvo tvarsliuoti.
        Tada jų history turėtų turėti <em>bent vieną</em> įrašą, kurio{" "}
        <span className="fn">action</span> reikšmė būtų{" "}
        <span className="fv">"tvarsliuota"</span>. Filtras būtų{" "}
        <span className="cd">some(action_x = 'tvarsliuota')</span>.
      </p>
      <p>
        Sakykime, norime rasti visus defektus, kurie šiuo metu yra sutvarsliuoti
        ir kuriems po sutvarsliavimo kažkas keitėsi. Tada jų pats paskutinis{" "}
        <em>eksploatacijos atliktas</em> įrašas turėtų turėti{" "}
        <span className="fn">action</span> reikšmę{" "}
        <span className="fv">"tvarsliuota"</span>, o pats{" "}
        <em>apskritai paskutinis</em> įrašas turėtų turėti{" "}
        <span className="fn">action</span> reikšmę{" "}
        <span className="fv">"perrasyta"</span>. Filtras būtų{" "}
        <span className="cd">
          action_ex9 = 'tvarsliuota' &amp;&amp; action_9 = 'perrasyta'
        </span>
        .
      </p>
    </div>
  );
};

export default Manual;
